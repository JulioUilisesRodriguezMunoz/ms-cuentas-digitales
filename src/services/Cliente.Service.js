import { log } from '../commons/log'
import { ClienteDAO } from '../dao/Cliente.DAO'
import { EstadoActivacionService } from './EstadoActivacion.Service'
import { ESTADO_ACTIVACION_PROSPECTO } from '../constants/constants'

/**
 * Obtiene el cliente con el idCliente especificado en los parametros del query.
 * @param {*} idCliente El número del idCliente.
 * @returns Retorna el contenido de documento cliente.
 */
const deleteCliente = async idCliente => {
  log.info('SERV: Iniciando deleteCliente')
  const cliente = await ClienteDAO.findByIdCliente(idCliente)
  log.reFatal('CLIENTE', cliente)
  if (cliente === null) return null
  await ClienteDAO.remover(idCliente)
  log.info(`SERV: Terminando deleteCliente`)
  return { descripcionError: `El cliente (${cliente.idCliente}) ha sido eliminado.` }
}

/**
 * Obtiene el cliente con el idCliente especificado en los parametros del query.
 * @param {*} idCliente El número del idCliente.
 * @returns Retorna el contenido de documento cliente.
 */
const getCliente = async idCliente => {
  log.info(`SERV: Iniciando getCliente ${idCliente}`)
  const cliente = await ClienteDAO.findByIdCliente(idCliente)
  log.info(`SERV: Terminando getCliente`)
  if (cliente === null) return null
  return {
    id: cliente.id,
    idCliente: cliente.idDevice,
    idDevice: cliente.idDevice,
    tarjetaMonte: cliente.tarjetaMonte,
    nombreCliente: cliente.nombreCliente,
    apellidoPaterno: cliente.apellidoPaterno,
    apellidoMaterno: cliente.apellidoMaterno,
    correoCliente: cliente.correoCliente,
    celularCliente: cliente.celularCliente
  }
}

/**
 * Efecutua la actualización de los datos personales del cliente, en caso de no existir el cliente, este es creado, en caso contrario es solamente actualizado.
 * @param {*} body contiene el 'idCliente' y otra serie de parametros de datos personales dentro del body.
 * @returns Status 200, si la actualizacion se llevo a cabo con exito.
 */
const setCliente = async (idCliente, body) => {
  log.info(`SERV: Iniciando setCliente ${idCliente}`)
  const cliente = await ClienteDAO.findByIdCliente(idCliente)
  const clienteToSave = {
    idCliente,
    idDevice: body.idDevice,
    tarjetaMonte: body.tarjetaMonte,
    nombreCliente: body.nombreCliente,
    apellidoPaterno: body.apellidoPaterno,
    apellidoMaterno: body.apellidoMaterno,
    correoCliente: body.correoCliente,
    celularCliente: body.celularCliente
  }
  if (cliente === null) {
    await ClienteDAO.save(clienteToSave)
    await EstadoActivacionService.setEstadoActivacion(idCliente, ESTADO_ACTIVACION_PROSPECTO)
  } else await ClienteDAO.findOneAndUpdate(idCliente, clienteToSave)
  log.info('SERV: Terminando setCliente')
}

export const ClienteService = {
  setCliente,
  getCliente,
  deleteCliente
}
