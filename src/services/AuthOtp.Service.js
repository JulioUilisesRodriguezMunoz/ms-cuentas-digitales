import md5 from 'md5'
import { totp } from 'otplib'
import { toInteger } from 'lodash'
import { ComunicacionesService } from './Comunicaciones.Service'
import { EstadoActivacionService } from './EstadoActivacion.Service'
import { EventosEstadoActivacionService } from './EventosEstadoActivacion.Service'
import { log } from '../commons/log'
import { ClienteDAO } from '../dao/Cliente.DAO'
import { EventosEstadoActivacionDAO } from '../dao/EventosEstadoActivacion.DAO'
import { RestCrmService } from './RestCrm.Service'
import { CommonValidator } from '../validator/Common.Validator'
import {
  // Configuracion de OTP
  OTP_DURACION_SEGUNDOS,
  OTP_SECRETO,
  OTP_DIGITOS,
  ACTIVACION_BLOQUEO_REINTENTOS,
  // Estados de Activacion
  ESTADO_ACTIVACION_OTPGENERADO,
  ESTADO_ACTIVACION_ACTIVADO,
  ESTADO_ACTIVACION_BLOQUEADO,
  CRM_FLUJOESTADO_OTPGENERADO,
  CRM_FLUJOESTADO_ACTIVADO
} from '../constants/constants'
import { CommonException, CuentaBloqueadaException, VerificarOtpException } from '../commons/responseExceptions'

// Cambiar a variables de ambiente
const OTP_OPTIONS = {
  digits: toInteger(OTP_DIGITOS),
  algorithm: 'sha1',
  step: toInteger(OTP_DURACION_SEGUNDOS),
  window: 2
}

/**
 * Genera un hash secreto combinado de informaciòn del cliente, dispositivo y una constante del servidor.
 * @param {*} idCliente Id Del cliente
 * @param {*} idDevice Id del Dispositivo usado.
 * @returns Retorna un valor hexadecimal.
 */
export function generateHashSecret(idCliente, idDevice) {
  const fullSecret = `${OTP_SECRETO}.${idCliente}.${idDevice}`
  log.debug(`TOTP-fullSecret ${fullSecret}`)
  return String(md5(fullSecret)).toUpperCase()
}

/**
 * Genera un codigo de otp, con las opciones establecidas en OTP_OPTIONS
 * @param {*} hashSecret Es un valor string hexadecimal, generado con generateHashSecret
 * @returns  {string} otp
 */
export function generateOtp(hashSecret) {
  totp.options = OTP_OPTIONS
  return totp.generate(hashSecret)
}

/**
 * SERV: para el envío del OTP.
 * @param {*} req request del Controller (requerido para el proceso de comunicaciones)
 * @param {*} res response del Controller (requerido para el proceso de comunicaciones)
 * @param {*} idCliente el número idCliente.
 */
const enviarOtp = async (idCliente, body, req, idFlujo = 0) => {
  log.info(`SERV: Iniciando enviarOtp method. idCliente.`)

  const cliente = await ClienteDAO.findByIdCliente(idCliente)
  if (cliente === null) {
    log.error('enviarOtp.Cliente no existe..')
    return null
  }

  /** EVALUACION DE BLOQUEOS */
  const activacion = await EstadoActivacionService.getEstadoActivacionEvaluado(idCliente)
  if (activacion.estadoActivacion === ESTADO_ACTIVACION_BLOQUEADO)
    throw new CuentaBloqueadaException({
      descripcionError:
        'Por tu seguridad se ha suspendido el código de desbloqueo. Comunicate con nosotros vía telefónica o ve a la sucursal más cercana'
    })

  /** PROCESANDO CUENTA SIN BLOQUEAR */
  /** generacion del Token */
  totp.options = OTP_OPTIONS
  const hashSecret = generateHashSecret(idCliente, cliente.idDevice)
  const codigoOtp = generateOtp(hashSecret)
  /** envio del codigoOtp por sms o email */
  const correoCliente = String(cliente.correoCliente)
  const celularCliente = String(cliente.celularCliente)

  // envio de otp por email o sms
  if (body.modoEnvio === 'email') await ComunicacionesService.enviarCodigoEMAIL(req, correoCliente, codigoOtp)
  if (body.modoEnvio === 'sms') await ComunicacionesService.enviarCodigoSMS(req, celularCliente, codigoOtp)

  if (idFlujo > 0) {
    await RestCrmService.actualizaEstatusProceso(cliente.tarjetaMonte, idFlujo, CRM_FLUJOESTADO_OTPGENERADO)
  }

  await EstadoActivacionService.setEstadoActivacion(idCliente, ESTADO_ACTIVACION_OTPGENERADO, codigoOtp)

  log.info('SERV: Terminando enviarOtp method')
  const reintentosDisponibles =
    ACTIVACION_BLOQUEO_REINTENTOS - (await EventosEstadoActivacionService.getEventos(idCliente, ESTADO_ACTIVACION_OTPGENERADO, true))

  const expiraCodigoOtp = parseInt((Date.now() + OTP_DURACION_SEGUNDOS * 1000) / 1000, 10)
  const expiraCodigoOtpISO = new Date(expiraCodigoOtp * 1000).toISOString()
  return { codigoOtp, expiraCodigoOtp, expiraCodigoOtpISO, reintentosDisponibles }
}

/**
 * SERV: verificacion del OTP
 * @param {*} req request del Controller (requerido para el proceso de comunicaciones)
 * @param {*} res response del Controller (requerido para el proceso de comunicaciones)
 * @param {*} idCliente el número idCliente.
 */
const verificarOtp = async (idCliente, bodySchemaEnviarOtp, req, idFlujo = 0) => {
  log.info('SERV: Iniciando verificarOtp method')
  const { codigoOtp } = bodySchemaEnviarOtp

  // evaluacion si existe o se requiere de establecer algun bloqueo por algun abuso
  /** EVALUACION DE QUE EXISTA EL CLIENTE */
  const cliente = await ClienteDAO.findByIdCliente(idCliente)
  if (cliente === null) {
    log.error('verificarOtp.Cliente no existe..')
    return null
  }

  /** EVALUACION DE BLOQUEOS */
  const activacion = await EstadoActivacionService.getEstadoActivacionEvaluado(idCliente)
  if (activacion.estadoActivacion === ESTADO_ACTIVACION_BLOQUEADO)
    throw new CuentaBloqueadaException({
      descripcionError:
        'Por tu seguridad se ha suspendido el código de desbloqueo. Comunicate con nosotros vía telefónica o ve a la sucursal más cercana'
    })

  // verificacion si existe el estatus apropiado para evaluar el codigo otp.
  if (activacion.estadoActivacion !== ESTADO_ACTIVACION_OTPGENERADO) {
    const descripcionError = 'El código de desbloqueo no coincide con el que enviamos. Por favor verifícalo.'
    EventosEstadoActivacionDAO.agregarEventoError(idCliente, descripcionError)
    throw new VerificarOtpException({ descripcionError })
  }

  if (activacion.codigoOtp !== codigoOtp) {
    const descripcionError = `El código de desbloqueo no coincide con el que enviamos. Por favor verifícalo.`
    EventosEstadoActivacionDAO.agregarEventoError(idCliente, descripcionError)
    throw new VerificarOtpException({ descripcionError })
  }

  // validaciones y carga de parametros
  totp.options = OTP_OPTIONS
  const hashSecret = generateHashSecret(idCliente, cliente.idDevice)

  const esValidoCodigoOtp = totp.check(codigoOtp, hashSecret)
  if (esValidoCodigoOtp === false) {
    const descripcionError = `Por tu seguridad se ha suspendido el código de desbloqueo. Comunicate con nosotros vía telefónica o ve a la sucursal más cercana`
    EventosEstadoActivacionDAO.agregarEventoError(idCliente, descripcionError)
    throw new VerificarOtpException({ descripcionError })
  }
  if (idFlujo === 0 && !CommonValidator.validateEmail(cliente.correoCliente))
    throw new CommonException({ descripcionError: `Email del destinatario (${cliente.correoCliente}), para notificar activación, no es válido.` })

  // Guardado y notificaciones ...
  await EstadoActivacionService.setEstadoActivacion(idCliente, ESTADO_ACTIVACION_ACTIVADO)
  if (idFlujo > 0) await RestCrmService.actualizaEstatusProceso(cliente.tarjetaMonte, idFlujo, CRM_FLUJOESTADO_ACTIVADO, codigoOtp)
  else await ComunicacionesService.enviarActivacionEMAIL(req, cliente.correoCliente, cliente)
  log.info('SERV: Terminando verificarOtp method')
  return true
}

export const AuthOtpService = {
  enviarOtp,
  verificarOtp
}
export default AuthOtpService
