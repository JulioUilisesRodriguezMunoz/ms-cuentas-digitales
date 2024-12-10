import {
  HEADER_AUTHORIZATION,
  HEADER_ID_CONSUMIDOR,
  HEADER_ID_DESTINO,
  HEADER_OAUTH,
  HEADER_USUARIO,
  EMAIL_REMITENTE,
  TEMPLATE_API_COMUNICACIONES_EMAIL,
  TEMPLATE_API_COMUNICACIONES_EMAIL_ACTIVACION,
  TEMPLATE_API_COMUNICACIONES_SMS,
  URL_API_COMUNICACIONES
} from '../constants/constants'
import { HttpClientService } from '../commons/http-client'
import { log } from '../commons/log'
import { CommonException } from '../commons/responseExceptions'
import { CommonValidator } from '../validator/Common.Validator'

const { HttpMethod } = HttpClientService

/**
 * createHeaderComunicaciones: Genera los Headers para la petición al servicio de comunicaciones.
 * @param req Headers: para crear el header de consulta.
 * @returns {Promise<*>} La información de la respuesta obtenida.
 */
const createHeaderComunicaciones = async req => {
  log.info('SERV: Iniciando createHeaderComunicaciones')
  const idConsumidor = req.header(HEADER_ID_CONSUMIDOR)
  const idDestino = req.header(HEADER_ID_DESTINO)
  const usuario = req.header(HEADER_USUARIO)
  const oauth = req.header(HEADER_OAUTH)
  const authorization = req.header(HEADER_AUTHORIZATION)
  // Regenerate Header
  return {
    authorization,
    idConsumidor,
    idDestino,
    'oauth.bearer': oauth,
    usuario
  }
}

/**
 * Función generica que se usa para enviar las peticiones al servicio de comunicaciones.
 * @param {*} req request de la petición original
 * @param {*} bodyComunicaciones Se especifica el body con la estructura establecida de comunicaciones.
 * @returns Retorna el valor retornado del servicio de comunicaciones.
 */
const internalEnviarMensaje = async (req, bodyComunicaciones) => {
  log.info('SERV: Iniciando internalEnviarMensaje')
  const header = await createHeaderComunicaciones(req)
  const HttpComunicaciones = {
    url: `${URL_API_COMUNICACIONES}/solicitud/mensaje`,
    method: HttpMethod.POST,
    headers: header,
    body: bodyComunicaciones,
    raiseException: true
  }
  const bodyResp = await HttpClientService.sendRequest(HttpComunicaciones)
  log.info('SERV: Terminando internalEnviarEmail')
  return bodyResp
}

/**
 * enviarCodigoSMS: Permite generar el envió de SMS utilizando el servicio de Comunicaciones.
 * @param req Headers: Se recupera la información del request para validar la autenticación.
 * @param destinatario Teléfono al cual se enviá el SMS.
 * @param codigo Código de validación.
 * @returns {Promise<*>} La información de la respuesta obtenida.
 */
const enviarCodigoSMS = async (req, destinatario, codigoOtp) => {
  log.info('SERV: Iniciando enviarCodigoSMS')

  const bodyComunicaciones = {
    destinatario: {
      telefonos: [destinatario]
    },
    tipoMensaje: 'SMS',
    template: {
      id: TEMPLATE_API_COMUNICACIONES_SMS,
      metadata: {
        codigo: codigoOtp
      }
    }
  }
  const bodyResp = await internalEnviarMensaje(req, bodyComunicaciones)
  log.info('SERV: Terminando enviarCodigoSMS', bodyResp)
  return bodyResp
}

/**
 * enviarCodigoEMAIL: Permite generar el envió de SMS utilizando el servicio de Comunicaciones.
 * @param req Headers: Se recupera la información del request para validar la autenticación.
 * @param destinatario Email al que se envia el correo.
 * @param codigo Código de validación.
 * @returns {Promise<*>} La información de la respuesta obtenida.
 */
const enviarCodigoEMAIL = async (req, destinatario, codigoOtp) => {
  log.info('SERV: Iniciando enviarCodigoEMAIL')
  if (!CommonValidator.validateEmail(destinatario))
    throw new CommonException({ descripcionError: `Email del destinatario (${destinatario}), no es válido.` })
  const bodyComunicaciones = {
    destinatario: {
      email: destinatario
    },
    remitente: {
      email: EMAIL_REMITENTE
    },
    tipoMensaje: 'EMAIL',
    template: {
      id: TEMPLATE_API_COMUNICACIONES_EMAIL,
      metadata: {
        codigo: codigoOtp
      }
    },
    datosEmail: {
      asunto: 'Código de Verificación'
    }
  }

  const bodyResp = await internalEnviarMensaje(req, bodyComunicaciones)
  log.info('SERV: Terminado enviarCodigoEMAIL')
  return bodyResp
}

/**
 * enviarCodigoEMAIL: Permite generar el envió de SMS utilizando el servicio de Comunicaciones.
 * @param req Headers: Se recupera la información del request para validar la autenticación.
 * @param destinatario Email al que se envia el correo.
 * @param codigo Código de validación.
 * @returns {Promise<*>} La información de la respuesta obtenida.
 */
const enviarActivacionEMAIL = async (req, destinatario, cliente) => {
  log.info('SERV: Iniciando enviarActivacionEMAIL')
  if (!CommonValidator.validateEmail(destinatario))
    throw new CommonException({ descripcionError: `Email del destinatario (${destinatario}), no es válido.` })
  const clienteFullName = `${cliente.nombreCliente} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`

  const bodyComunicaciones = {
    destinatario: {
      email: destinatario
    },
    remitente: {
      email: EMAIL_REMITENTE
    },
    tipoMensaje: 'EMAIL',
    template: {
      id: TEMPLATE_API_COMUNICACIONES_EMAIL_ACTIVACION,
      metadata: {
        cliente: clienteFullName,
        linkActivacion: 'http://www.montepiedad.com.mx/'
      }
    },
    datosEmail: {
      asunto: 'Activación de Cuente'
    }
  }

  const bodyResp = await internalEnviarMensaje(req, bodyComunicaciones)
  log.info('SERV: Terminando enviarActivacionEMAIL', bodyResp)
  return bodyResp
}

export const ComunicacionesService = {
  enviarCodigoSMS,
  enviarCodigoEMAIL,
  enviarActivacionEMAIL
}

export default ComunicacionesService
