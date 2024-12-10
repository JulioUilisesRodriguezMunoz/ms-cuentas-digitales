import Mongoose from 'mongoose'
import { log } from '../commons/log'
import { eventoEstadoActivacionSchema } from '../models/eventoEstadoActivacion.model'
import { ESTADO_ACTIVACION_OTPGENERADO, ESTADO_ACTIVACION_ERROR } from '../constants/constants'

const activacionEvento = Mongoose.model('activacionEvento', eventoEstadoActivacionSchema)

/**
 * Agrega evento de Estado de Activación
 * @param {*} activacion Objeto de Activación.
 * @returns
 */
async function agregarEvento(activacion) {
  log.info(`DAO: Ejecutando EventosEstadoActivacionDAO.agregar`)
  return activacionEvento.create(activacion)
}

/**
 * Agrega evento de exepción.
 * @param {*} idCliente Id del Cliente
 * @param {*} mensaje Mensaje informativo del evento.
 * @returns
 */
async function agregarEventoError(idCliente, mensaje) {
  log.info(`DAO: Ejecutando EventosEstadoActivacionDAO.agregar`)
  const eventoError = { idCliente, estadoActivacion: ESTADO_ACTIVACION_ERROR, mensaje }
  return activacionEvento.create(eventoError)
}

/**
 * Obtiene los eventos del Estado de Activación.
 * @param {*} idCliente Id del Cliente
 * @param {*} estadoActivacion Estado de Activación, si no se especifica, se asume que obtiene todos los eventos.
 * @returns
 */
async function getEventos(idCliente, estadoActivacion) {
  log.info(`DAO: Iniciando EventosEstadoActivacionDAO.getEventos ${idCliente}, ${estadoActivacion}`)
  let filter
  if (estadoActivacion === undefined) filter = { idCliente }
  else filter = { $and: [{ idCliente }, { estadoActivacion }] }
  const toReturn = await activacionEvento.find(filter)
  log.info(`DAO: Terminando EventosEstadoActivacionDAO.getEventos`)
  return toReturn
}

/**
 * Obtiene los enventos del estado de activación que generan bloqueo.
 * @param {*} idCliente Id del Cliente
 * @returns
 */
async function getEventosForBloqueo(idCliente) {
  log.info(`DAO: Iniciando EventosEstadoActivacionDAO.getEventosForBloqueo: ${idCliente}`)
  const filter = {
    $and: [{ idCliente }, { $or: [{ estadoActivacion: ESTADO_ACTIVACION_OTPGENERADO }, { estadoActivacion: ESTADO_ACTIVACION_ERROR }] }]
  }
  const toReturn = await activacionEvento.find(filter)
  log.info(`DAO: Terminando EventosEstadoActivacionDAO.getEventosForBloqueo`)
  return toReturn
}

/**
 * Elimina los eventos del estado de activación.
 * @param {*} idCliente Id del Cliente
 * @param {*} estadoActivacion Enum del Estado de Activación.
 * @returns
 */
async function deleteEventos(idCliente, estadoActivacion) {
  log.info(`DAO: Iniciando EventosEstadoActivacionDAO.deleteEventos`)
  let filter = { idCliente, estadoActivacion }
  if (estadoActivacion === undefined) filter = { idCliente }
  const toReturn = await activacionEvento.deleteMany(filter)
  log.info(`DAO: Terminando EventosEstadoActivacionDAO.deleteEventos: ${toReturn}`)
  return toReturn
}

export const EventosEstadoActivacionDAO = {
  agregarEvento,
  agregarEventoError,
  getEventos,
  getEventosForBloqueo,
  deleteEventos
}
