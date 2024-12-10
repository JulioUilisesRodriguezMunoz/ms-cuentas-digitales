import fetch from 'node-fetch'
import https from 'https'
import { log } from './log'
import { InternalServerError, UnauthorizedException } from './responseExceptions'

const agent = new https.Agent({ rejectUnauthorized: false })
const TRACE_SHOW = process.env.NODE_ENV === 'LOCAL'
export const HttpMethod = {
  POST: 'POST',
  GET: 'GET',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE'
}

const parseResponse = res => {
  return res.json().then(responseBody => ({
    responseBody,
    ok: res.ok,
    status: res.status,
    statusText: res.statusText,
    headers: res.headers.raw()
  }))
}

/**
 * Genera las peticiones REST a terceros
 * @param url, dirección donde se encuentra el servicio
 * @param method, tipo de petición que utiliza la invocación
 * @param body, request body de la petición
 * @param headers, headers de la petición
 * @param isHttps, es un sitio seguro
 * @param raiseException, permite indicar si va a procesar las excepciones y manda un InternalServerError en caso de encontrar un error
 * @returns {Promise<*|{}>}
 */
export const sendRequest = async ({ url, method, body = null, headers, isHttps = true, raiseException = false, isBodyJson = true }) => {
  log.debug('SERVICE: Starting sendRequest method')
  log.reMark('req-METHOD...:', method)
  log.reMark('req-URL......:', url)
  if (TRACE_SHOW) {
    log.reMark('req-BODY.....:', body)
    log.reMark('req-HEADERS..:', headers)
  }
  const options = {
    method,
    headers: {
      ...{
        'Content-Type': 'application/json'
      },
      ...headers
    }
  }

  if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
    if (isBodyJson) options.body = JSON.stringify(body || {})
    else options.body = body
  }

  if (isHttps) options.agent = agent
  let returnResponseBody = {}
  let codigoError = 0

  // Proceso principal de ejecuciOn del http.
  try {
    const { responseBody, ok, status } = await fetch(url, options).then(parseResponse)
    codigoError = status
    log.reMark('res-VALIDO..:', ok)
    log.reMark('res-STATUS..:', status)
    if (TRACE_SHOW) log.reMark('res-BODY....:', responseBody)
    log.debug('SERVICE: Ending sendRequest method')
    returnResponseBody = responseBody
  } catch (err) {
    throw new InternalServerError({ descripcionError: JSON.stringify(err.message) })
  }

  // Desencadenador de ExcepciOn, en caso de existir algun exepciOn durante la peticion..
  if (raiseException === true && codigoError >= 400) {
    if (codigoError === 401) throw new UnauthorizedException({ descripcionError: JSON.stringify(returnResponseBody).replace('\\', '') })
    else throw new InternalServerError({ descripcionError: JSON.stringify(returnResponseBody).replace('\\', '') })
  }
  // Retorno natural de peticion..
  return returnResponseBody
}

export const HttpClientService = {
  sendRequest,
  HttpMethod
}

export default null
