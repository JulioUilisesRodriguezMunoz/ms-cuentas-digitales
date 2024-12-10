import log4JS from 'log4js'

log4JS.configure({
  appenders: {
    out: {
      type: 'stdout',
      layout: {
        type: 'pattern',
        pattern: '[%d{ISO8601}][%[%-5.5p%]]-[%[%-10.10c%]] %m'
      }
    }
  },
  categories: {
    default: {
      appenders: ['out'],
      level: process.env.LOG_LEVEL || 'info'
    }
  }
})

export const LOG = log4JS.getLogger('cuentasdigitales')
LOG.level = 'debug'

/**
 * Función común usado para resaltar un texto y mostrar el valor del contenido del objeto.
 * @param {*} message Valor texto del mensaje a mostarr.
 * @param {*} _json Valor de objeto que va a ser expandodo.
 * @param {*} colorStyle Color del contenido.
 */
const genMessage = (message, _json, colorStyle) => {
  if (_json === undefined) {
    LOG.mark(`${colorStyle}${message}\x1b[0m`)
  } else {
    LOG.mark(`${colorStyle}${message}: ${JSON.stringify(_json)}\x1b[0m`)
  }
}

export const log = {
  reMark: (message, _json) => genMessage(message, _json, '\x1b[37m\x1b[44m'),
  reFatal: (message, _json) => genMessage(message, _json, '\x1b[30m\x1b[41m'),
  fatal: message => LOG.fatal(message),
  info: message => LOG.info(message),
  debug: message => LOG.debug(message),
  error: message => LOG.error(message),
  mark: message => LOG.mark(message),
  debugJSON: (message, _json) => LOG.debug(`${message}:${JSON.stringify(_json)} `)
}
