import { isEmpty } from 'lodash'
import { log } from './log'
import { validateParams, validateBody, validateHeaderOAG, validateQuery, validateSchemaEMPTY } from './validations'
import { Response } from './response'
import { UnauthorizedException } from './responseExceptions'
import LOGNR from './loggerNewRelic'

/**
 * Estandariza los log a consola y válida los esquemas
 * @param {string} nameMethod nombre de la función
 * @param {*} req Request del Controller que se está ejecutando.
 * @param {*} validationSchemas Esquemas a validar
 * @param {boolean} evaluarOAG bandera para identificar si se van a evaluar los header del OAG
 * @returns {Promise<void>} promesa de respuesta
 */
export async function initController(nameMethod, req, validationSchemas, evaluarOAG = true, isOnlyModeLocal = false) {
  log.info('')
  log.info('\x1b[36m*******************************************************************\x1b[0m')
  log.info(`\x1b[36m*** CTRL: Iniciando Método\x1b[0m ${nameMethod}\x1b[36m.\x1b[0m`)
  log.info('\x1b[36m-------------------------------------------------------------------\x1b[0m')
  if (!isEmpty(req.params)) {
    log.info(`\x1b[36m-- Request.params:\x1b[0m ${JSON.stringify(req.params)}`)
    LOGNR.info(`${nameMethod} request params: ${JSON.stringify(req.params)}`)
  }
  if (!isEmpty(req.query)) {
    log.info(`\x1b[36m-- Request.query:\x1b[0m ${JSON.stringify(req.query)}`)
    LOGNR.info(`${nameMethod} request query: ${JSON.stringify(req.query)}`)
  }
  if (!isEmpty(req.body)) {
    log.info(`\x1b[36m-- Request.body:\x1b[0m ${JSON.stringify(req.body)}`)
    LOGNR.info(`${nameMethod} request body: ${JSON.stringify(req.body)}`)
  }
  log.info('\x1b[36m-------------------------------------------------------------------\x1b[0m')

  if (isOnlyModeLocal && process.env.NODE_ENV !== 'LOCAL')
    throw new UnauthorizedException({ descripcionError: `Servicio no disponible en ambiente ${process.env.NODE_ENV}.` })
  let { paramsSchema, querySchema, bodySchema } = validationSchemas
  if (paramsSchema === undefined) paramsSchema = validateSchemaEMPTY
  if (querySchema === undefined) querySchema = validateSchemaEMPTY
  if (bodySchema === undefined) bodySchema = validateSchemaEMPTY

  /* validación de los datos con sus respectivos esquemas,  */
  if (evaluarOAG) await validateHeaderOAG(req)
  validateParams(req.params, paramsSchema)
  validateQuery(req.query, querySchema)
  validateBody(req.body, bodySchema)
}

/**
 * Funcionalidad común para cuando se termina la llamda de un controller de manera normal
 * @param {string} nameMethod nombre de la función que se esta ejecutando
 * @param {*} res request de la petición
 * @param {number} statusResponse Estado de la respuesta
 * @param {JSON} dataJSON información en JSON de la data que se va a regresar
 * @param {string} message mensage que se desea presentar
 * @returns {Promise<*>} promesa de respuesta
 */
export async function finishController(nameMethod, res, statusResponse, dataJSON, message) {
  const tini = '\x1b[32m'
  const tend = '\x1b[0m'
  log.info(`${tini}-------------------------------------------------------------------${tend}`)
  log.info(`${tini}-- Response.statusResponse:${tend} ${statusResponse}${tend}`)
  log.info(`${tini}-- Response.BODY:${tend} ${JSON.stringify(dataJSON)}${tend}`)
  log.info(`${tini}-------------------------------------------------------------------${tend}`)
  log.info(`${tini}*** CTRL: Terminando Método${tend} ${nameMethod}${tini}.${tend}`)
  log.info(`${tini}********************************************************************${tend}`)
  LOGNR.info(`Response ${nameMethod} statusResponse: ${statusResponse} dataJSON ${JSON.stringify(dataJSON)}`)
  /* response registrados */
  switch (statusResponse) {
    case 200:
      return Response.Ok(res, dataJSON)
    case 201:
      return Response.Created(res, dataJSON)
    case 204:
      return Response.NotContent(res, message, dataJSON)
    default:
      return res.status(statusResponse).send(dataJSON)
  }
}

/**
 *  Funcionalidad común para cuando se termina la llamda de un controller cuando hay alguna excepción
 * @param {string} nameMethod nombre de la funcionalidad a ejecutar
 * @param {*} res request de la petición
 * @param {codigoError: (number|number|*)} errorJSON
 * @returns {Promise<*>} promesa de respuesta
 */
export async function finishControllerCatchError(nameMethod, res, responseJSON) {
  /* preparación de variables */
  const errorJSON = {}
  if (responseJSON.descripcionError === undefined) errorJSON.descripcionError = responseJSON
  else errorJSON.descripcionError = responseJSON.descripcionError

  if (responseJSON.codigoError === undefined) errorJSON.codigoError = 500
  else errorJSON.codigoError = responseJSON.codigoError

  if (responseJSON.tipoError === undefined) errorJSON.tipoError = undefined
  else errorJSON.tipoError = responseJSON.tipoError

  if (responseJSON.code === undefined) errorJSON.code = undefined
  else errorJSON.code = responseJSON.code

  if (responseJSON.stack === undefined) errorJSON.stack = undefined
  else errorJSON.stack = responseJSON.stack

  if (responseJSON.mergeVariables === undefined) errorJSON.mergeVariables = undefined
  else errorJSON.mergeVariables = responseJSON.mergeVariables

  const { codigoError } = errorJSON
  const colorText = codigoError >= 500 ? '\x1b[31m' : '\x1b[33m'

  if (codigoError === 203 || (codigoError >= 400 && codigoError <= 599)) {
    delete errorJSON.stack
    delete errorJSON.mergeVariables
  }
  LOGNR.error(
    `Error response ${nameMethod} codigoError: ${codigoError} tipoError ${errorJSON.tipoError} descripcionError ${JSON.stringify(
      errorJSON.descripcionError
    )}`
  )

  /* visualizacón de infomación del error */
  log.info(`${colorText}-------------------------------------------------------------------\x1b[0m`)
  log.info(`${colorText}-- Exception codigoError.....:\x1b[0m ${codigoError}`)
  log.info(`${colorText}-- Exception tipoError.......:\x1b[0m ${errorJSON.tipoError}`)
  log.info(`${colorText}-- Exception descripcionError:\x1b[0m ${JSON.stringify(errorJSON.descripcionError)}`)
  log.info(`${colorText}-------------------------------------------------------------------\x1b[0m`)
  log.info(`${colorText}*** CTRL: CatchError Método\x1b[0m ${nameMethod}${colorText}.\x1b[0m `)
  log.info(`${colorText}********************************************************************\x1b[0m`)
  /* retorno del error */
  // eslint-disable-next-line no-param-reassign
  errorJSON.severidad = '0'
  return res.status(codigoError).send(errorJSON)
}
