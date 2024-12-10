import mongoose from 'mongoose'
import { estadoActivacionSchema } from './estadoActivacion.model'

export const clienteSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  idCliente: { type: String, index: true, required: true },
  idDevice: { type: String, required: true },
  tarjetaMonte: { type: String, required: true },
  nombreCliente: { type: String, required: true },
  apellidoPaterno: { type: String, required: true },
  apellidoMaterno: { type: String, required: true },
  nombreCompleto: String,
  correoCliente: String,
  celularCliente: String,
  activacion: estadoActivacionSchema
})
