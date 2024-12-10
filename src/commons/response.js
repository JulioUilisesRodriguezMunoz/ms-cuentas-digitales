import { CODE_CREATED, CODE_NOT_CONTENT, CODE_SUCCESS, CREATED, NOT_CONTENT, SUCCESS } from '../constants/constants'

const Ok = (res, data) => {
  const info = {
    code: CODE_SUCCESS,
    status: SUCCESS,
    message: 'Se ha realizado correctamente la operación'
  }
  return res.status(200).send({ ...data, ...info })
}

const Created = (res, data) => {
  const info = {
    code: CODE_CREATED,
    status: CREATED,
    message: 'Se ha realizado correctamente la operación'
  }
  return res.status(201).send({ ...data, ...info })
}

const NotContent = (res, message, data) => {
  const info = {
    code: CODE_NOT_CONTENT,
    status: NOT_CONTENT,
    message,
    // Datos adicionales para APP Experiencia
    tipoError: 'Not Content',
    descripcionError: message,
    codigoError: 204,
    severidad: 0
  }
  return res.status(204).send({ ...data, ...info })
}

export const Response = {
  Ok,
  Created,
  NotContent
}
