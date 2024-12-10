import mongoose from 'mongoose'

export const estadoActivacionSchema = new mongoose.Schema({
  estadoActivacion: Number,
  estadoActivacionNombre: String,
  codigoOtp: String,
  ultimaActualizacion: { type: Date, default: Date.now },
  fechaActivacion: { type: Date, default: null }
})
