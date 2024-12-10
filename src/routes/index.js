import express from 'express'
import { ClienteController } from '../controllers/Cliente.Controller'
import { AuthOtpController } from '../controllers/AuthOtp.Controller'
import { EstadoActivacionController } from '../controllers/EstadoActivacion.Controller'
import { EventosEstadoActivacionController } from '../controllers/EventosEstadoActivacion.Controller'
import { ClienteMiMonteController } from '../controllers/ClienteMiMonte.Controller'
import { CrmController } from '../controllers/Crm.Controller'

const router = express.Router()

router.get('/healthcheck', (req, res) => {
  const data = {
    uptime: process.uptime(),
    message: 'Ok',
    date: new Date()
  }
  res.status(200).send(data)
})

// v1
router.route('/actualizarCliente').post(ClienteController.actualizarCliente)

router.route('/obtenerCliente').get(ClienteController.obtenerCliente)
router.route('/removerCliente').post(ClienteController.removerCliente)

router.route('/obtenerEstatusActivacion').get(EstadoActivacionController.obtenerEstatusActivacion)
router.route('/establecerEstatusActivacion').post(EstadoActivacionController.establecerEstatusActivacion)

router.route('/activacionEvento/eventos').get(EventosEstadoActivacionController.listarEventos)
router.route('/activacionEvento/eventos').delete(EventosEstadoActivacionController.removerEventos)

router.route('/enviarOtp').post(AuthOtpController.enviarOtp)
router.route('/verificarOtp').post(AuthOtpController.verificarOtp)

router.route('/crm/clienteByNumCredencial').get(CrmController.clienteByNumCredencial)
router.route('/crm/actualizaEstatusProceso').post(CrmController.actualizaEstatusProceso)
router.route('/validarCliente').post(CrmController.validarCliente)

/**
 * Endpoints para Reempeño Digital controller {@link ClienteMiMonteController }
 */
router.route('/token/establecerClienteMiMonte').post(ClienteMiMonteController.establecerClienteMiMonte)
router.route('/token/validaToken').post(ClienteMiMonteController.validaToken)

export default router
