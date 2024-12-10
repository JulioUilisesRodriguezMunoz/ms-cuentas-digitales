import Mongoose from 'mongoose'
import { clienteSchema } from '../models/cliente.model'

const Cliente = Mongoose.model('cliente', clienteSchema)

/**
 * Busca un cliente específico.
 * @param {*} idCliente Id del Cliente.
 * @returns
 */
const findByIdCliente = async idCliente => Cliente.findOne({ idCliente })

/**
 * Guarda la información de un cliente especifico.
 * @param {*} cliente Información del cliente.
 * @returns
 */
const save = async cliente => Cliente.create(cliente)

/**
 * Remueve un cliente específico.
 * @param {*} idCliente Id del Cliente.
 * @returns
 */
const remover = async idCliente => Cliente.deleteMany({ idCliente })

/**
 * Busca un cliente especifico, si lo encuentra, actualiza lso datos.
 * @param {*} idCliente Id del Cleinte.
 * @param {*} cliente Información del cliente.
 * @returns
 */
const findOneAndUpdate = async (idCliente, cliente) => {
  return Cliente.findOneAndUpdate(
    {
      idCliente
    },
    {
      $set: {
        idDevice: cliente.idDevice,
        tarjetaMonte: cliente.tarjetaMonte,
        nombreCliente: cliente.nombreCliente,
        apellidoPaterno: cliente.apellidoPaterno,
        apellidoMaterno: cliente.apellidoMaterno,
        correoCliente: cliente.correoCliente,
        celularCliente: cliente.celularCliente,
        ultimaActualizacion: Date.now()
      }
    },
    {
      new: true
    }
  )
}

export const ClienteDAO = {
  findByIdCliente,
  remover,
  save,
  findOneAndUpdate
}
