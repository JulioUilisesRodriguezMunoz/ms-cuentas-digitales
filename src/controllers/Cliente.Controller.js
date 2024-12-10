import { ClienteService } from '../services/Cliente.Service'
import { finishController, finishControllerCatchError, initController } from '../commons/invokeController'
import { bodySchemaCliente, querySchemaCliente } from '../validator/Cliente.Validator'

/**
 * Actualza la información del cliente.
 * @param {*} req Request del controller
 * @param {*} res Response del Controller
 * @returns {Promise<void>} promesa de respuesta
 */
const actualizarCliente = async (req, res) => {
  try {
    await initController('actualizarCliente', req, { bodySchema: bodySchemaCliente }, true)
    await ClienteService.setCliente(req.body.idCliente, req.body)
    return finishController('actualizarCliente', res, 201)
  } catch (error) {
    return finishControllerCatchError('actualizarCliente', res, error)
  }
}

/**
 * Obtiene la información del cliente.
 * @param {*} req Request del Controller
 * @param {*} res Response del Controller
 * @returns {Promise<*>} promesa de respuesta
 */
const obtenerCliente = async (req, res) => {
  try {
    await initController('obtenerCliente', req, { querySchema: querySchemaCliente }, true)
    const cliente = await ClienteService.getCliente(req.query.idCliente)
    if (cliente === null) return finishController('obtenerCliente', res, 204)
    return finishController('obtenerCliente', res, 200, cliente)
  } catch (error) {
    return finishControllerCatchError('obtenerCliente', res, error)
  }
}
/**
 * Remueve la información del Cliente.
 * @param {*} req Request del Controller
 * @param {*} res Response del Controller
 * @returns {Promise<void>} promesa de respuesta
 */
const removerCliente = async (req, res) => {
  try {
    await initController('removerCliente', req, { querySchema: querySchemaCliente }, true)
    await ClienteService.deleteCliente(req.query.idCliente)
    return finishController('removerCliente', res, 200)
  } catch (error) {
    return finishControllerCatchError('removerCliente', res, error)
  }
}

export const ClienteController = {
  obtenerCliente,
  removerCliente,
  actualizarCliente
}
export default ClienteController
