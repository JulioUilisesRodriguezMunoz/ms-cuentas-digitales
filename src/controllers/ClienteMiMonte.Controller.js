import { ClienteMiMonteService } from '../services/ClienteMiMonte.Service'
import { finishController, finishControllerCatchError, initController } from '../commons/invokeController'
import { bodySchemaClienteMiMonte, bodySchemaValidateToken } from '../validator/ClienteMiMonte.Validator'

/**
 * Guarda la información del token para notificaciones.
 * @param {*} req Request del Controller
 * @param {*} res Response del Controller
 * @returns {Promise<*|undefined>}
 */
const establecerClienteMiMonte = async (req, res) => {
  try {
    await initController('establecerClienteMiMonte', req, { bodySchema: bodySchemaClienteMiMonte }, true)
    await ClienteMiMonteService.saveClienteMiMonte(req.body)
    return finishController('establecerClienteMiMonte', res, 201)
  } catch (error) {
    return finishControllerCatchError('establecerClienteMiMonte', res, error)
  }
}

/**
 * Revisa si es valido un token en cognito y si existencia en redis
 * @param {*} req Request del Controller
 * @param {*} res Response del Controller
 * @returns {Promise<*|undefined>}
 */
const validaToken = async (req, res) => {
  try {
    await initController('validaToken', req, { bodySchema: bodySchemaValidateToken }, false)
    const resJson = await ClienteMiMonteService.validateToken(req.body)
    return finishController('validaToken', res, 200, resJson)
  } catch (error) {
    return finishControllerCatchError('validaToken', res, error)
  }
}
export const ClienteMiMonteController = {
  establecerClienteMiMonte,
  validaToken
}
export default ClienteMiMonteController
