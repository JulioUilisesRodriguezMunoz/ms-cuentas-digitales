import mongoose from 'mongoose'
import { ACTIVACION_EVENTOS_TIMETOLIVE } from '../constants/constants'

export const eventoEstadoActivacionSchema = new mongoose.Schema({
  idCliente: { type: String, index: true, required: true },
  createdAt: { type: Date, default: Date.now },
  expireAt: { type: Date, expires: ACTIVACION_EVENTOS_TIMETOLIVE },
  estadoActivacion: Number,
  estadoActivacionNombre: String,
  codigoOtp: String
})
