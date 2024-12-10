import { AuthOtpService } from '../services/AuthOtp.Service'
import { bodySchemaEnviarOtp, bodySchemaVerificarOtp } from '../validator/AuthOtp.Validator'
import { finishController, finishControllerCatchError, initController } from '../commons/invokeController'

/**
 * Envia el CODIGO OTP al cliente  a travez de email o sms.
 * @param {*} req Request del Controller
 * @param {*} res Response del Controller
 * @returns {Promise<void>} promesa de respuesta
 */
const enviarOtp = async (req, res) => {
  try {
    await initController('enviarOtp', req, { bodySchema: bodySchemaEnviarOtp }, true)
    const toReturn = await AuthOtpService.enviarOtp(req.body.idCliente, req.body, req, req.body.idFlujo)
    if (toReturn === null) return finishController('enviarOtp', res, 204)
    return finishController('enviarOtp', res, 201, toReturn)
  } catch (error) {
    return finishControllerCatchError('enviarOtp', res, error)
  }
}

/**
 * Verifica el CODIGO OPT, que el cliente recibio.
 * @param {*} req Request del Controller
 * @param {*} res Response del Controller
 * @returns {Promise<void>} promesa de respuesta
 */
const verificarOtp = async (req, res) => {
  try {
    await initController('verificarOtp', req, { bodySchema: bodySchemaVerificarOtp }, true)
    const toReturn = await AuthOtpService.verificarOtp(req.body.idCliente, req.body, req, req.body.idFlujo)
    if (toReturn === null) return finishController('verificarOtp', res, 204)
    return finishController('verificarOtp', res, 201, toReturn)
  } catch (error) {
    return finishControllerCatchError('verificarOtp', res, error)
  }
}

export const AuthOtpController = {
  enviarOtp,
  verificarOtp
}
