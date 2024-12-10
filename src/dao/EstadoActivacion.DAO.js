import Mongoose from 'mongoose'
import { log } from '../commons/log'
import { clienteSchema } from '../models/cliente.model'
import { ClienteDAO } from './Cliente.DAO'
import {
  ESTADO_ACTIVACION_OTPGENERADO,
  ESTADO_ACTIVACION_ACTIVADO,
  ESTADO_ACTIVACION_BLOQUEADO,
  ESTADO_ACTIVACION_ERROR
} from '../constants/constants'

const Cliente = Mongoose.model('cliente', clienteSchema)

/**
 * Convierte de un número de EstadoActivacion a un String que contiene el estatus activacion nombre.
 * @param {*} estadoActivacion El número del estatus de activacion.
 * @returns Nombre del estatus de activacion.
 */
export function convertirEstadoActivacionNombre(estadoActivacion) {
  if (estadoActivacion === ESTADO_ACTIVACION_OTPGENERADO) return 'OtpGenerado_Activacion'
  if (estadoActivacion === ESTADO_ACTIVACION_ACTIVADO) return 'Activado_Activacion'
  if (estadoActivacion === ESTADO_ACTIVACION_BLOQUEADO) return 'Bloqueado_Activacion'
  if (estadoActivacion === ESTADO_ACTIVACION_ERROR) return 'Error_Activacion'
  return 'Prospecto_Activacion'
}

/**
 * Establece un estatus de activacion a un cliente especifico. Además es aqui donde se actualiza el activacionlogEvents.
 * @param {*} idCliente El Id del Cliente de cuentas digitales.
 * @param {*} estadoActivacion El número del estatus de activacion.
 * @returns Objeto Cliente
 */
async function setEstadoActivacion(idCliente, activacion) {
  log.info('DAO: Iniciando setEstadoActivacion')
  const result = await Cliente.findOneAndUpdate({ idCliente }, { $set: { activacion } }, { new: true })
  log.info('DAO: Terminando setEstadoActivacion')
  return result
}

/**
 * Obtiene el estatus de activacion, si el cliente no existe, retornara como estatus 1: NoExisteCliente
 * @param {*} idCliente El Id del Cliente de cuentas digitales.
 * @returns Retorna el objeto EsatusActivacion.
 */
async function getEstadoActivacion(idCliente) {
  const cliente = await ClienteDAO.findByIdCliente(idCliente)
  let activacion = {}
  activacion = cliente.activacion
  activacion.estadoActivacion = cliente.activacion.estadoActivacion

  activacion.estadoActivacionNombre = `${convertirEstadoActivacionNombre(activacion.estadoActivacion)}`
  return activacion
}

export const EstadoActivacionDAO = {
  setEstadoActivacion,
  getEstadoActivacion,
  convertirEstadoActivacionNombre
}
