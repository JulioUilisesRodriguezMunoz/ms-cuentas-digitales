import { EventosEstadoActivacionService } from '../services/EventosEstadoActivacion.Service'
import { bodySchemaEstatusActivacion, querySchemaCliente } from '../validator/EventosEstadoActivacion.Validator'
import { finishController, finishControllerCatchError, initController } from '../commons/invokeController'

/**
 * Lista los eventos de los Estados de Activación.
 * @param {*} req Request del Controller
 * @param {*} res Response del Controller
 * @returns {Promise<void>} promesa de respuesta
 */
const listarEventos = async (req, res) => {
  const nameMethod = 'listarEventos'
  try {
    await initController(nameMethod, req, { querySchema: querySchemaCliente }, true)
    const eventos = await EventosEstadoActivacionService.getEventos(req.query.idCliente)
    if (eventos === null) return finishController(nameMethod, res, 204)
    return finishController(nameMethod, res, 200, eventos)
  } catch (error) {
    return finishControllerCatchError(nameMethod, res, error)
  }
}

/**
 * Remueve los eventos de los estados de activación.
 * @param {*} req Request del Controller
 * @param {*} res Response del Controller
 * @returns {Promise<void>} promesa de respuesta
 */
const removerEventos = async (req, res) => {
  const nameMethod = 'removerEventos'
  try {
    await initController(nameMethod, req, { querySchema: querySchemaCliente, bodySchema: bodySchemaEstatusActivacion }, true)
    await EventosEstadoActivacionService.deleteEventos(req.query.idCliente, req.body.estatusActivacion)
    return finishController(nameMethod, res, 200)
  } catch (error) {
    return finishControllerCatchError(nameMethod, res, error)
  }
}

export const EventosEstadoActivacionController = {
  listarEventos,
  removerEventos
}

export default EventosEstadoActivacionController
