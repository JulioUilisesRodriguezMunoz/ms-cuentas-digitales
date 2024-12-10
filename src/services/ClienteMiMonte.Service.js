import { log } from '../commons/log'
import { ClienteMiMonteDAO } from '../dao/clienteMiMonte.DAO'
import { ClientRedis } from '../config/redis'
import { UnauthorizedException } from '../commons/responseExceptions'
import { REDIS_EX } from '../constants/constants'
/**
 * Efecutua la actualización de ClienteMiMonte que son los datos del Token para las notificaciones push en elasticsearch.
 * Si existe datos en ClienteMiMonte se guarda uno nuevo de lo contrario se actualizan.
 * @param {*} body contiene el token de token_azure, token_firebase y otros parametros del cliente
 * @returns Status 200, si se guardo correctamente
 */
const saveClienteMiMonte = async body => {
  log.info(`SERV: Iniciando saveClienteMiMonte idCliente:  ${body.idcliente}`)
  const clienteMiMonteToSave = {
    fecharegistromimonte: new Date(),
    idcliente: body.idcliente,
    mimonte: body.mimonte,
    tokenAzure: body.tokenAzure,
    tokenFirebase: body.tokenFirebase
  }

  const clienteMiMonte = await ClienteMiMonteDAO.getClienteMiMonteByIdCliente(body.idcliente)
  if (clienteMiMonte === false) {
    await ClienteMiMonteDAO.saveClienteMiMonte(clienteMiMonteToSave)
  } else {
    await ClienteMiMonteDAO.updateClienteMiMonte(clienteMiMonte.id, clienteMiMonteToSave)
  }
}

/**
 * Eliminar el clienteMiMonte con el idCliente especificado en los parametros del query.
 * @param {*} idCliente El número del idCliente.
 * @returns Retorna el contenido de documento clienteMiMonte.
 */
const deleteClienteMiMonte = async idCliente => {
  log.info('SERV: Iniciando deleteClienteMiMonte')
  const clienteMiMonte = await ClienteMiMonteDAO.getClienteMiMonteByIdCliente(idCliente)
  if (clienteMiMonte === false) return null
  await ClienteMiMonteDAO.deleteClienteMiMonteById(clienteMiMonte.id)
  return true
}

/**
 * Eliminar el clienteMiMonte con el idCliente especificado en los parametros del query.
 * @param {*} objSession objeto de sesion {idCliente, tokenCliente, email}.
 * @returns Retorna el contenido de documento clienteMiMonte.
 */
const validateToken = async objSession => {
  log.info(`SERV: Iniciando validateToken  ${objSession.idCliente}`)

  if (Number(process.env.VALIDA_TOKEN) === 1) {
    return {
      body: { descripcion: 'Token Valido' }
    }
  }
  const { idCliente, tokenCliente, email } = objSession

  const usrCognito = await ClienteMiMonteDAO.checktokenCliente(tokenCliente)

  // validación que el token sea valido en todo momento
  if (!usrCognito) {
    log.error(`SERV: Terminando error validateToken Token Invalido: ${idCliente}`)
    throw new UnauthorizedException({ descripcionError: `Token Invalido.` })
  }

  // validación email y token
  if (idCliente === undefined || idCliente === '') {
    if (usrCognito.username !== email) {
      log.error(`SERV: Terminando error validateToken Token Valido, Email Invalido: ${email}`)
      throw new UnauthorizedException({ descripcionError: `Email Invalido.` })
    }
    return {
      body: { descripcion: 'Token Valido' }
    }
  }

  const clientRedis = await ClientRedis()

  try {
    // validación de segundo momento consumo
    if (email === undefined || email === '') {
      const userRedis = await clientRedis.get(usrCognito.username)
      // validacón de idCliente en redis con el consumidor
      if (userRedis !== idCliente) {
        log.error(`SERV: Terminando error validateToken idCliente Invalido: ${idCliente}`)
        throw new UnauthorizedException({ descripcionError: `idCliente Invalido. ${idCliente}` })
      }
      log.info(`SERV: Terminando validateToken Token Valido ${idCliente}`)
      return {
        body: { descripcion: 'Token Valido' }
      }
    }

    // validación de primer momento consumo idCliente, email, token
    if (usrCognito.username !== email) {
      log.error(`SERV: Terminando error validateToken Token Valido, Email Invalido: ${email}`)
      throw new UnauthorizedException({ descripcionError: `Email Invalido.` })
    }
    await clientRedis.set(email, idCliente, {
      EX: REDIS_EX,
      NX: false
    })
    log.info(`SERV: Terminando validateToken OK Redis sesión creada idcliente: ${idCliente}`)
    return {
      body: { descripcion: 'OK Redis' }
    }
  } catch (error) {
    log.error(`SERV: Error en validateToken: ${error.message}`)
    throw new UnauthorizedException(error)
  }
}

export const ClienteMiMonteService = {
  saveClienteMiMonte,
  deleteClienteMiMonte,
  validateToken
}
