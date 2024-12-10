import { Router } from 'express'

const router = Router()

/**
 * @swagger
 * components:
 *  schemas:
 *    Cliente:
 *      type: object
 *      properties:
 *        idCliente:
 *          type: string
 *          description: Identificador del cliente
 *      required:
 *        - idCliente
 *      example:
 *        idCliente: 24324
 */

/**
 * @swagger
 * /obtenerCliente:
 *    get:
 *      summary: Actualizar información del cliente.
 *      description: Actualiza la información del cliente.
 *      operationId: actualizarCliente
 *      tags:
 *        - Experiencia Prendaria
 *      parameters:
 *        - name: idConsumidor
 *          in: header
 *          required: true
 *          schema:
 *            type: number
 *        - name: idDestino
 *          in: header
 *          required: true
 *          schema:
 *            type: number
 *        - name: usuario
 *          in: header
 *          required: true
 *          schema:
 *            type: string
 *        - name: oauth.bearer
 *          in: header
 *          required: true
 *          schema:
 *            type: string
 *        - name: Authorization
 *          in: header
 *          required: true
 *          schema:
 *            type: string
 *        - name: idCliente
 *          in: query
 *          required: true
 *          schema:
 *            type: string
 */

// router.route('/').get(ClienteController.healthCheck)

export { router as ePRoutes }
