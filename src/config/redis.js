import { createClient } from 'redis'
import { log } from '../commons/log'

let client = null
let isConnecting = false

export const ClientRedis = async () => {
  try {
    // Verificar si el cliente está listo
    if (client?.isReady) {
      return client
    }

    // Si hay una conexión en proceso, esperamos
    if (isConnecting) {
      await new Promise(resolve => setTimeout(resolve, 100))
      return ClientRedis()
    }

    isConnecting = true

    // Si el cliente existe pero no está conectado, intentamos reconectar
    if (client) {
      try {
        await client.connect()
        isConnecting = false
        return client
      } catch (error) {
        log.error(`Error reconectando a Redis: ${error.message}`)
        client = null
      }
    }

    // Crear un nuevo cliente Redis
    const ca = Buffer.from(process.env.REDIS_CERT64, 'base64').toString('utf-8')

    client = createClient({
      url: process.env.REDIS_URL,
      socket: {
        tls: true,
        rejectUnauthorized: false,
        cert: ca
      }
    })

    // Manejadores de eventos para monitoreo
    client.on('error', err => {
      log.error(`Redis Client Error: ${err.message}`)
      if (client?.isReady) {
        client.quit().catch(quitErr => log.error(`Error cerrando conexión Redis: ${quitErr.message}`))
      }
      client = null
      isConnecting = false
    })

    client.on('connect', () => {
      log.info('Redis Client Connected')
    })

    client.on('reconnecting', () => {
      log.info('Redis Client Reconnecting')
    })

    client.on('end', () => {
      log.info('Redis Client Connection Ended')
      client = null
      isConnecting = false
    })

    // Conectar el cliente
    await client.connect()

    isConnecting = false
    return client
  } catch (error) {
    isConnecting = false
    log.error(`Error creando cliente Redis: ${error.message}`)
    throw error
  }
}

let isClosing = false // Bandera para evitar múltiples cierres
export const closeRedisConnection = async () => {
  if (isClosing) {
    return // Si ya está en proceso de cierre, no hacemos nada
  }
  if (client?.isReady) {
    isClosing = true
    try {
      await client.quit()
      client = null
      log.info('Redis connection closed successfully')
    } catch (error) {
      log.error(`Error closing Redis connection: ${error.message}`)
      // Forzar la desconexión si el cierre falla
      client.disconnect()
      client = null
    } finally {
      isClosing = false // Asegurarse de restablecer la bandera al final
    }
  }
}
// Manejar las señales de terminación para cerrar Redis
process.on('SIGTERM', async () => {
  log.info('SIGTERM received, closing Redis connection')
  try {
    await closeRedisConnection()
    // server.close(() => { ... })
  } catch (error) {
    log.error(`Error during shutdown: ${error.message}`)
  } finally {
    process.exit(0)
  }
})

process.on('SIGINT', async () => {
  log.info('SIGINT received, closing Redis connection')
  try {
    await closeRedisConnection()
    // server.close(() => { ... })
  } catch (error) {
    log.error(`Error during shutdown: ${error.message}`)
  } finally {
    process.exit(0)
  }
})
