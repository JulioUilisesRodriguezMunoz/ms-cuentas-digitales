import winston from 'winston'
import newrelicFormatter from '@newrelic/winston-enricher'
import { LOG_LEVEL, NEW_RELIC_LICENSE_KEY } from '../constants/constants'

const logger = winston.createLogger({
  level: LOG_LEVEL || 'debug',
  format: winston.format.combine(
    newrelicFormatter(),
    winston.format.label({
      label: 'MS-CUENTAS-DIGITALES'
    }),
    winston.format.prettyPrint()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.Http({
      host: 'log-api.newrelic.com',
      path: '/log/v1',
      headers: {
        'Api-Key': NEW_RELIC_LICENSE_KEY
      },
      ssl: true
    })
  ]
})

module.exports = logger
