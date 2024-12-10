import { EstadoActivacionService } from '../services/EstadoActivacion.Service'
import { finishController, finishControllerCatchError, initController } from '../commons/invokeController'
import { bodySchemaEstatusActivacion, querySchemaCliente } from '../validator/EstadoActivacion.Validator'

/**
 * Obtiene la información del cliente.
 * @param {*} req Request del Controller
 * @param {*} res Response del Controller
 * @returns {Promise<void>} promesa de respuesta
 */
const obtenerEstatusActivacion = async (req, res) => {
  const nameMethod = 'obtenerEstatusActivacion'
  try {
    await initController(nameMethod, req, { querySchema: querySchemaCliente }, true)
    const estadoActivacion = await EstadoActivacionService.getEstadoActivacion(req.query.idCliente)
    if (estadoActivacion === null) return finishController(nameMethod, res, 204)
    return finishController(nameMethod, res, 200, estadoActivacion)
  } catch (error) {
    return finishControllerCatchError(nameMethod, res, error)
  }
}

/**
 * Establece el Estatus de Activación de clente
 * @param {*} req Request del Controller
 * @param {*} res Response del Controller
 * @returns {Promise<void>} promesa de respuesta
 */
const establecerEstatusActivacion = async (req, res) => {
  const nameMethod = 'establecerEstatusActivacion'
  try {
    await initController(nameMethod, req, { bodySchema: bodySchemaEstatusActivacion }, true)
    const estadoActivacion = await EstadoActivacionService.setEstadoActivacion(req.body.idCliente, req.body.estadoActivacion)
    if (estadoActivacion === null) return finishController(nameMethod, res, 204)
    return finishController(nameMethod, res, 201, estadoActivacion)
  } catch (error) {
    return finishControllerCatchError(nameMethod, res, error)
  }
}

export const EstadoActivacionController = {
  obtenerEstatusActivacion,
  establecerEstatusActivacion
}
