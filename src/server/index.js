import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'
import { CONTEXT_NAME, CONTEXT_VERSION, BIND_URL, BIND_PORT } from '../constants/constants'
// import { createConnection } from '../commons/connection'
import { log } from '../commons/log'
import appRoutes from '../routes'
import { ePRoutes } from '../routes/ePRoutes'
import { GLOBAL_CONSTANTS } from '../constants'

const app = express()

const nodeEnv = process.env.NODE_ENV
const PORT = process.env.PORT || BIND_PORT
const URL = BIND_URL || 'localhost'

if (nodeEnv !== 'production') {
  const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'Gestion de Cuentas Digitales',
        description: 'NMP Cuentas Digitales'
      },
      servers: [
        {
          url: `{server}/${CONTEXT_NAME}/${CONTEXT_VERSION}`,
          variables: {
            server: {
              default: URL
            }
          }
        }
      ]
    },
    apis: ['src/routes/*.js']
  }

  const swaggerDocs = swaggerJsDoc(swaggerOptions)
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs))
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const corsOptionsDelegate = (req, callback) => {
  const regex = new RegExp('(http|https)://localhost')
  const corsOptions = regex.test(req.header('Origin')) ? { origin: true } : { origin: false }
  callback(null, corsOptions)
}

app.use(cors(corsOptionsDelegate))

app.use(`/${CONTEXT_NAME}/${CONTEXT_VERSION}`, appRoutes)
app.use(`/${CONTEXT_NAME}/${CONTEXT_VERSION}/${GLOBAL_CONSTANTS.EP_PREFIX}`, ePRoutes)

// createConnection()
// .then(() => {
    app.listen(PORT, URL, () => {
      log.info(`server running on ${URL}:${PORT}/${CONTEXT_NAME}/${CONTEXT_VERSION}`)
      if (nodeEnv !== 'production') {
        log.info(`Swagger documentation server running on ${URL}/api-docs/`)
      }
    })
//  })
//  .catch(err => log.error(err))

export default app
