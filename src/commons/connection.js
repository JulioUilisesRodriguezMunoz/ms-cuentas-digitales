import mongoose from 'mongoose'
import { log } from './log'

const url = process.env.MONGO_URL

export const createConnection = async () => {
  log.reFatal('MONGO URL', url)
  mongoose.set('strictQuery', false)
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
  // Proceso de conexión con BD.
  try {
    await mongoose.connect(`${url}`, options)
    log.reMark('Conexión exitosa a MongoDB Atlas')
  } catch (error) {
    log.reFatal('Error al conectar a MongoDB Atlas:', error)
  }
}

export default null
