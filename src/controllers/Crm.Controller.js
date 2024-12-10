/* eslint-disable prettier/prettier */
import { finishController, finishControllerCatchError, initController } from '../commons/invokeController'
import { bodySchemaCrmCliente, bodySchemaCrmActualizaEstatusProceso, bodySchemaValidarCliente } from '../validator/Crm.Validator'
import { RestCrmService } from '../services/RestCrm.Service'

/**
 * Obtiene la información del cliente.
 * @param {*} req Request del Controller
 * @param {*} res Response del Controller
 * @returns {Promise<*>} promesa de respuesta
 */
const clienteByNumCredencial = async (req, res) => {
  try {
    await initController('crm/clienteByNumCredencial', req, { bodySchema: bodySchemaCrmCliente }, true, true)
    const toRet = await RestCrmService.clienteByNumCredencial(req.body.noCredencial)
    if (toRet === null) 
      return finishController('crm/clienteByNumCredencial', res, 204)
    return finishController('crm/clienteByNumCredencial', res, 200, toRet)
  } catch (error) {
    return finishControllerCatchError('crm/clienteByNumCredencial', res, error)
  }
}



/**
 * Obtiene la información del cliente.
 * @param {*} req Request del Controller
 * @param {*} res Response del Controller
 * @returns {Promise<*>} promesa de respuesta
 */
const actualizaEstatusProceso = async (req, res) => {
  try {
    await initController('crm/actualizaEstatusProceso', req, { bodySchema: bodySchemaCrmActualizaEstatusProceso }, true, true)
    const toRet = await RestCrmService.actualizaEstatusProceso(req.body.noCredencial, req.body.idFlujo, req.body.idEstatus)
    return finishController('crm/actualizaEstatusProceso', res, 201, toRet)
  } catch (error) {
    return finishControllerCatchError('crm/actualizaEstatusProceso', res, error)
  }
}


/**
 * Validar al cliente.
 * @param {*} req Request del controller
 * @param {*} res Response del Controller
 * @returns {Promise<void>} promesa de respuesta
 */
const validarCliente = async (req, res) => {
  try {
    await initController('validarCliente', req, { bodySchema: bodySchemaValidarCliente }, true)
    const toReturn =  await RestCrmService.validarCliente(req.body.tarjetaMonte, req.body.idFlujo, req.body.fechaDeNacimiento)
    return finishController('validarCliente', res, 201, toReturn)
  } catch (error) {
    return finishControllerCatchError('validarCliente', res, error)
  }
}


export const CrmController = {
  clienteByNumCredencial,  
  actualizaEstatusProceso,
  validarCliente
}
