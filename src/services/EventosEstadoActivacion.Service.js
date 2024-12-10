import { log } from '../commons/log'
import { EventosEstadoActivacionDAO } from '../dao/EventosEstadoActivacion.DAO'
import { ClienteDAO } from '../dao/Cliente.DAO'

/**
 * Obtiene los eventos de estado de activación.
 * @param {*} idCliente Id del cliente.
 * @param {*} estadoActivacion Estado de activación.
 * @param {*} soloContar true/false, retorna solo conteo de los elementos.
 * @returns
 */
async function getEventos(idCliente, estadoActivacion, soloContar) {
  log.info(`SERV: Iniciando EventosEstadoActivacionService.getEventos`)
  const cliente = await ClienteDAO.findByIdCliente(idCliente)
  if (cliente === null) return null
  let toReturn = await EventosEstadoActivacionDAO.getEventos(idCliente, estadoActivacion)
  if (soloContar !== undefined && soloContar) toReturn = toReturn.length
  log.info(`SERV: Terminando EventosEstadoActivacionService.getEventos`)
  return toReturn
}

/**
 * Cuentas los eventos generados por eventos que bloquean la cuenta.
 * @param {*} idCliente Id del Cliente
 * @returns
 */
async function countEventosForBloqueo(idCliente) {
  log.info(`SERV: Iniciando EventosEstadoActivacionService.getEventosForBloqueo`)
  const toReturn = await EventosEstadoActivacionDAO.getEventosForBloqueo(idCliente)
  log.info(`SERV: Terminando EventosEstadoActivacionService.getEventosForBloqueo`)
  return toReturn.length
}

/**
 * Elimina los eventos de activación.
 * @param {*} idCliente Id del Cliente
 * @param {*} estadoActivacion Estado de activación. (Si no se especifica, el proceso eliminará todos los eventos.)
 */
async function deleteEventos(idCliente, estadoActivacion) {
  log.info(`SERV: Iniciando EventosEstadoActivacionService.getEventos`)
  const cliente = await ClienteDAO.findByIdCliente(idCliente)
  if (cliente === null) return null
  await EventosEstadoActivacionDAO.deleteEventos(idCliente, estadoActivacion)
  log.info(`SERV: Terminando EventosEstadoActivacionService.deleteEventos`)
  return true
}

export const EventosEstadoActivacionService = {
  getEventos,
  countEventosForBloqueo,
  deleteEventos
}
