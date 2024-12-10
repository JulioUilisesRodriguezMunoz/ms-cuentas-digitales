import { log } from '../commons/log'
import { HttpClientService, HttpMethod } from '../commons/http-client'
import { ClienteService } from './Cliente.Service'
import {
  RESTCRM_HOST_URL,
  RESTCRM_HTTPHEADER_OAUTHTOKEN_CLIENT_ID,
  RESTCRM_HTTPHEADER_OAUTHTOKEN_CLIENT_SECRET,
  RESTCRM_HTTPHEADER_USUARIO,
  RESTCRM_HTTPHEADER_DESTINO,
  RESTCRM_HTTPHEADER_CONSUMIDOR,
  CRM_FLUJOESTADO_PROSPECTO
} from '../constants/constants'
import { NotFoundCliente, CommonException, InternalServerError } from '../commons/responseExceptions'

/**
 * Genera el token OAuth v1, que sera usado por la funcion clienteByNumCredencial.
 * @returns Genera el token que sera utilizado por el endppint clienteByNumCredencial
 */
export const genOauthToken = async () => {
  log.info('SERV: Iniciando genOauthToken')
  const headers = { Host: 'iamdr.montepiedad.com.mx:4444', 'Content-Type': 'application/x-www-form-urlencoded' }
  const body = `grant_type=client_credentials&client_secret=${RESTCRM_HTTPHEADER_OAUTHTOKEN_CLIENT_SECRET}&client_id=${RESTCRM_HTTPHEADER_OAUTHTOKEN_CLIENT_ID}`
  const api = {
    url: `${RESTCRM_HOST_URL}/oauth/token`,
    method: HttpMethod.POST,
    body,
    headers,
    isHttps: true,
    raiseException: true,
    isBodyJson: false
  }

  const toRet = await HttpClientService.sendRequest(api)
  const token = toRet.access_token
  log.info('SERV: Terminando genOauthToken', token)
  return token
}

/**
 * Convierte el objeto cliente de Crm a la estructura local de cliente.
 * @param {*} clienteCrm objeto obtenido de Rest CRM.
 * @returns Objecto cliente con la estructura local.
 */
const convertToCliente = clienteCrm => {
  const resultCliente = clienteCrm.Cliente
  const toRet = {}
  toRet.idCliente = resultCliente.idCliente
  toRet.tarjetaMonte = resultCliente.numeroDeCredencial

  // nombre y apellidos del cliente
  if (resultCliente.nombre !== undefined) toRet.nombreCliente = resultCliente.nombre
  if (resultCliente.apellidoPaterno !== undefined) toRet.apellidoPaterno = resultCliente.apellidoPaterno
  if (resultCliente.apellidoMaterno !== undefined) toRet.apellidoMaterno = resultCliente.apellidoMaterno
  if (resultCliente.fechaDeNacimiento !== undefined) toRet.fechaDeNacimiento = resultCliente.fechaDeNacimiento

  // extraccion de correoCliente y telefono celular
  if (resultCliente.email !== undefined) toRet.correoCliente = resultCliente.email

  const listTelefonos = resultCliente.Contacto.ListaTelefonos.Telefono
  listTelefonos.forEach(element => {
    if (toRet.celularCliente === undefined) toRet.celularCliente = element.numeroTelefonico
    if (element.tipoTelefono === 'celular') toRet.celularCliente = element.numeroTelefonico
  })
  return toRet
}

/**
 * Obtiene los datos principales del cliente y los retorna con la estructura de cliente local, para que pueda ser almacenada localmente.
 * @param {*} noCredencial Tambien conocida como tarjetaMonte
 * @returns Retorna el objeto cliente.
 */
export const clienteByNumCredencial = async noCredencial => {
  log.info('SERV: Iniciando clienteByNumCredencial')
  const token = await genOauthToken()

  // Seccion de consulta con la APPY
  const headers = {
    Authorization: `Bearer ${token}`,
    usuario: RESTCRM_HTTPHEADER_USUARIO,
    idConsumidor: RESTCRM_HTTPHEADER_CONSUMIDOR,
    idDestino: RESTCRM_HTTPHEADER_DESTINO
  }
  const body = { numCredencial: noCredencial, idSucursal: 0, usuario: null }
  const api = {
    url: `${RESTCRM_HOST_URL}/GestionClientes/UsuariosMonte/v1/getClienteByNumCredencial`,
    method: HttpMethod.POST,
    body,
    headers,
    isHttps: true,
    raiseException: true
  }
  const result = await HttpClientService.sendRequest(api)

  let toRet = {}
  if (result.Cliente.idCliente === null) {
    log.error('clienteByNumCredencial.Cliente no existe...')
    toRet = null
  } else {
    toRet = result
  }
  log.info('SERV: Terminando clienteByNumCredencial', toRet)
  return toRet
}

/**
 * Es un reenvión d ela petición hacia CRM, para actualizar diversos estatus de flujos como 1=Registro, 2=Activación, 3=Cambio Contraseña.
 * @param {*} noCredencial Tambien conocida como tarjeta monte.
 * @param {*} idFlujo Requerido por CRM, 1=Registro, 2=Activación, 3=Cambio Contraseña.
 * @param {*} idEstatus Valor entero del 0 al 3, su interpretación es segun el flujo.
 * Para acivacón se usan los estus 0=SIN PROCESAR, 1=PROSPECTO, 2=OTPGENRADO, 3=ACTIVADO.
 * @param {*} codigoOtp Código OTP, generado por AuthOtp.
 * @returns
 */
export const actualizaEstatusProceso = async (noCredencial, idFlujo, idEstatus, codigoOtp) => {
  log.info('SERV: Iniciando actualizaEstatusProceso')
  const toRet = {}
  const token = await genOauthToken()
  const headers = {
    Authorization: `Bearer ${token}`,
    usuario: RESTCRM_HTTPHEADER_USUARIO,
    idConsumidor: RESTCRM_HTTPHEADER_CONSUMIDOR,
    idDestino: RESTCRM_HTTPHEADER_DESTINO
  }
  const body = {
    numeroDeCredencial: noCredencial,
    DatosUsuario: {
      estatus: idEstatus,
      tipoFlujo: idFlujo,
      tokenMiMonte: codigoOtp ?? ''
    }
  }

  const api = {
    url: `${RESTCRM_HOST_URL}/GestionClientes/Cliente/v2/updateCliente`,
    method: HttpMethod.POST,
    body,
    headers,
    isHttps: true,
    raiseException: true
  }
  const result = await HttpClientService.sendRequest(api)
  if (result === undefined || result.respuesta === undefined) {
    throw new InternalServerError({
      descripcionError: `Error al actualizar estatus con el endpoint =>GestionClientes/Cliente/v2/updateCliente.. `
    })
  }

  if (result.respuesta !== 'Estatus actualizado') {
    throw new InternalServerError({
      descripcionError: `Error al actualzar estatus de Cliente.. se esperaba respuesta "Estatus actualizado" y se obtubo  ${result.respuesta}`
    })
  }
  toRet.mensaje = 'Estatus actualziado'
  log.info('SERV: Terminando actualizaEstatusProceso')
  return toRet
}

/**
 * Valida la existencia del cliente, comparando su tarjetaMonte y su fechaDeNacimiento, con lo registrado en las bases de datos.
 * Además actualiza el estatus de CRM, como porspecto.
 * @param {*} tarjetaMonte Número de indentificación de un cliente.
 * @param {*} idFlujo Requerido por CRM, 1=Registro, 2=Activación, 3=Cambio Contraseña.
 * @param {*} fechaDeNacimiento Fecha de nacimieno del cliente.
 * @returns
 */
export const validarCliente = async (tarjetaMonte, idFlujo, fechaDeNacimiento) => {
  log.info('SERV: Iniciando validarClienteByNoCredencial')
  const resultCliente = await clienteByNumCredencial(tarjetaMonte)
  const toRet = {}
  if (resultCliente === null) {
    throw new NotFoundCliente({ descripcionError: `Necesitamos verificar tu identidad. Para activar tu cuenta, dirígete a la sucursal más cercana.` })
  } else {
    const cliente = convertToCliente(resultCliente)
    cliente.idDevice = '0'
    const toCompare1 = fechaDeNacimiento.replace('-', '').replace('/', '').substring(0, 8)
    const toCompare2 = cliente.fechaDeNacimiento.replace('-', '').substring(0, 8)
    if (toCompare1 !== toCompare2) {
      throw new CommonException({
        tipoError: 'Fecha Nacimiento Incorrecta',
        descripcionError: `Fecha de nacimiento incorrecta por favor verifícala.`
      })
    } else {
      toRet.Cliente = resultCliente.Cliente
      log.reFatal('cliente', cliente)
      await ClienteService.setCliente(cliente.idCliente, cliente)
      await actualizaEstatusProceso(cliente.tarjetaMonte, idFlujo, CRM_FLUJOESTADO_PROSPECTO)
    }
  }
  log.info('SERV: Terminando validarClienteByNoCredencial', toRet)
  return toRet
}

export const RestCrmService = {
  clienteByNumCredencial,
  validarCliente,
  actualizaEstatusProceso
}
