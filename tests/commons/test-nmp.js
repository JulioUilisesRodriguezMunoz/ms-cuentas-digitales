import { log } from '../../src/commons/log'
import { createConnection } from '../../src/commons/connection'
import { generateHashSecret, generateOtp } from '../../src/services/AuthOtp.Service'
import { ClienteDAO } from '../../src/dao/Cliente.DAO'
import { EventosEstadoActivacionDAO } from '../../src/dao/EventosEstadoActivacion.DAO'
import { ClienteMiMonteService } from '../../src/services/ClienteMiMonte.Service'
import { EstadoActivacionDAO } from '../../src/dao/EstadoActivacion.DAO'
import {
  CONTEXT_NAME,
  CONTEXT_VERSION,
  URL_API_COMUNICACIONES,
  ESTADO_ACTIVACION_PROSPECTO,
  ACTIVACION_BLOQUEO_REINTENTOS,
  ESTADO_ACTIVACION_OTPGENERADO,
  ESTADO_ACTIVACION_BLOQUEADO,
  RESTCRM_HOST_URL,
  SOAPCRM_URL
} from '../../src/constants/constants'

// SECCION 1. CONSTAONTES DE CONTEXTO
export const CONTEXT = {
  NAME: CONTEXT_NAME,
  VERSION: CONTEXT_VERSION
}

// SECCION 2. CONECIONES A MONBODB
export const MongoDB = {
  connect: async () => {
    //  server = new MongodbMemoryServer()
    //  process.env.URI = await server.getConnectionString()
    // console.log(`Instancia de BD: ${process.env.URI}`)
    await createConnection()
  },
  disconnect: async () => {
    // await mongo.disconnect()
    // await server.stop()
  }
}

// SECCION 2. CONSTANTES PARA TEST
export const TEST_CLIENTE = '1803165779'
export const TEST_TARJETAMONTE = '1000000000000307'
export const ACCESS_TOKEN_SESSION =
  'eyJraWQiOiI3K0plUlpCQ1htaDBUUXc2Q3h4aDRkaXR6WHJPbG53WVhIK1wvMkhFaW1Faz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI3NzE4MmMyZS02YTBlLTQ5MzMtODdiMS01YTM4YWIzNmY5NTkiLCJldmVudF9pZCI6IjYzMDE2NmY1LWFkMzQtNDFmMy05YjZjLTBkZGUxMjFkODAxMSIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3MjI5MDExMDQsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX2FMb2ZsUzZ2UiIsImV4cCI6MTcyMjkwNDcwNCwiaWF0IjoxNzIyOTAxMTA0LCJqdGkiOiI3NzAyOTRlZS1kNTNmLTRjNjAtODZkNi01OTUzODc5NGUxOWQiLCJjbGllbnRfaWQiOiI1MGJuY2pibG1qOHJhNGQyNjA3cTYxdWM5aCIsInVzZXJuYW1lIjoiZWNvcnRlc0BxdWFya3NvZnQubmV0In0.NXpOnshdmQVXqLHPktK_7neLWdSoURZ-dE1VrQuqUCr6yhtgWWSHONBpsW6Bw6F1WnPjtW_64Uw4g0niniBUnYkugAqin9mpwR4pUupbwLOjOmq4whQqpMXv9IyPIhG-HALOHuFvjDpjtFDENXwwyU6N5lP-NtszIJNAbmRAohHIIY3IMNGOExQacxAcL-LSFp-zFzVeY_sq8dFS_SGyZu40ohbAwM3mZ8EfKiCO0jnZ-oBdpUTLEhSFYhJIaANv3kiwwjcHdI_pAY7qLVxrHGWHDtgA-3Ho9uRvkRwPRSpfXod4R8NzPM6fny4bq5HdRfdQd7yfzwbsCaPzJHBmTw'
export const TEST = {
  SOAPCRM_URL,
  RESTCRM_HOST_URL,
  URL_API_COMUNICACIONES,
  CLIENTE: TEST_CLIENTE,
  CLIENTE_NO_EXISTE: '9990',
  CLIENTE_PARA_REMOVER: '9995',
  CLIENTE_EXTRA: '8888',
  CLIENTE_BODY: {
    idCliente: TEST_CLIENTE,
    idDevice: '74312734d5403d54',
    tarjetaMonte: TEST_TARJETAMONTE,
    nombreCliente: 'ricoff',
    apellidoPaterno: 'CARRILLO',
    apellidoMaterno: 'LOPEZF',
    correoCliente: 'rigocl@hotmail.com',
    celularCliente: '6731143889'
  },
  CLIENTE_MI_MONTE: 1001,
  CLIENTE_MI_MONTE_BODY: {
    idcliente: 1001,
    mimonte: '0000000000000001',
    tokenAzure: '1001',
    tokenFirebase: '1001'
  },
  CLIENTE_MI_MONTE_UPDATE: 1002,
  CLIENTE_MI_MONTE_UPDATE_BODY: {
    idcliente: 1002,
    mimonte: '0000000000000002',
    tokenAzure: '1002',
    tokenFirebase: '1002'
  },
  LISTHEADER_OAG: [
    { name: 'Authorization', value: 'Basic zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz=' },
    { name: 'oauth.bearer', value: 'xxxxxxxxxxxx=' },
    { name: 'idConsumidor', value: 99 },
    { name: 'idDestino', value: 99 },
    { name: 'usuario', value: 'test' }
  ],
  TOKEN_VALIDO_PRIMER_MOMENTO: {
    tokenCliente: ACCESS_TOKEN_SESSION,
    email: 'ecortes@quarksoft.net',
    idCliente: '000018050'
  },
  TOKEN_INVALIDO_PRIMER_MOMENTO: {
    tokenCliente: 'eyJra',
    email: 'ecortes@quarksoft.net',
    idCliente: '000018050'
  },
  TOKEN_VALIDO_SEGUNDO_MOMENTO: {
    tokenCliente: ACCESS_TOKEN_SESSION,
    idCliente: '000018050'
  },
  TOKEN_INVALIDO_SEGUNDO_MOMENTO: {
    tokenCliente: ACCESS_TOKEN_SESSION,
    idCliente: '00001805'
  },
  TOKEN_INVALIDO_PRIMER_MOMENTO_EMAIL: {
    tokenCliente: ACCESS_TOKEN_SESSION,
    email: 'badEmail@test.com',
    idCliente: '000018050'
  }
}

export const actionEstadoActivacion = {
  genEstadoActivacion: (idCliente, estadoActivacion, codigoOtp) => {
    log.reMark('Iniciando actionEstadoActivacion.genEstadoActivacion')
    const estado = {
      idCliente,
      estadoActivacion,
      estadoActivacionNombre: EstadoActivacionDAO.convertirEstadoActivacionNombre(estadoActivacion),
      ultimaActualizacion: Date.now(),
      codigoOtp
    }
    log.reMark('Terminando actionEstadoActivacion.genEstadoActivacion')
    return estado
  },
  setEstadoActivacion: async (idCliente, estadoActivacion, codigoOtp) => {
    log.reMark('Iniciando actionEstadoActivacion.setEstadoActivacion')
    const estado = actionEstadoActivacion.genEstadoActivacion(idCliente, estadoActivacion, codigoOtp)
    log.reFatal('setEstadoActivacion', estado)
    await EstadoActivacionDAO.setEstadoActivacion(idCliente, estado)
    log.reMark('Terminando actionEstadoActivacion.setEstadoActivacion')
  }
}

export const actionEventosEstadoActivacion = {
  setEventoEstadoActivacion: async (idCliente, estadoActivacion, codigoOtp) => {
    log.reMark('Iniciando actionEventosEstadoActivacion.setEventoEstadoActivacion')
    const estado = await actionEstadoActivacion.genEstadoActivacion(idCliente, estadoActivacion, codigoOtp)
    await EventosEstadoActivacionDAO.agregarEvento(estado)
    log.reMark('Terminando actionEventosEstadoActivacion.setEventoEstadoActivacion')
  }
}

// Acciones de CLIENTE
export const actionCliente = {
  eliminar: async idCliente => {
    log.reMark('Iniciando actioncliente.eliminar')
    await ClienteDAO.remover(idCliente)
    await EventosEstadoActivacionDAO.deleteEventos(idCliente, undefined)
    log.reMark('Iniciando actioncliente.eliminar')
  },
  eliminarByIdCliente: async idCliente => {
    log.reMark('Iniciando actioncliente.eliminarByIdCliente')
    await ClienteDAO.remover(idCliente)
    await EventosEstadoActivacionDAO.deleteEventos(idCliente, undefined)
    log.reMark('Terminando actioncliente.eliminarByIdCliente')
  },
  save: async cliente => {
    log.reMark('Iniciando actioncliente.save')
    await ClienteDAO.save(cliente)
    log.reMark('Iniciando actioncliente.save')
  },
  reiniciarCliente: async idCliente => {
    log.reMark('Iniciando actioncliente.reiniciarCliente', idCliente)
    const cliente = await ClienteDAO.findByIdCliente(idCliente)
    if (cliente != null) {
      log.reMark('Cancelando actioncliente.reiniciarCliente')
    } else {
      log.reMark('Continuando actioncliente.reiniciarCliente', idCliente)
      await ClienteDAO.save(TEST.CLIENTE_BODY)
      await EventosEstadoActivacionDAO.deleteEventos(idCliente, undefined)
      await actionEstadoActivacion.setEstadoActivacion(idCliente, ESTADO_ACTIVACION_PROSPECTO, '0000')
      log.reMark('Terminando actioncliente.reiniciarCliente')
    }
  },
  actualizar: async idCliente => ClienteDAO.setCliente(idCliente, TEST.CLIENTE_BODY)
}

// Acciones de AuthOtp
export const actionAuthOtp = {
  bloquarCuenta: async idCliente => {
    log.reMark('Iniciando actionAuthOtp.bloquarCuenta')
    await actionCliente.reiniciarCliente(TEST.CLIENTE)
    const results = []
    for (let i = 0; i < ACTIVACION_BLOQUEO_REINTENTOS; i += 1) {
      results.push(actionEventosEstadoActivacion.setEventoEstadoActivacion(idCliente, ESTADO_ACTIVACION_OTPGENERADO, '000000'))
    }
    Promise.all(results)
    log.reMark('Terminando actionAuthOtp.bloquarCuenta')
  },
  bloquearCuentaSinEventos: async idCliente => {
    await actionCliente.reiniciarCliente(idCliente)
    await EventosEstadoActivacionDAO.deleteEventos(idCliente, undefined)
    await actionEstadoActivacion.setEstadoActivacion(idCliente, ESTADO_ACTIVACION_BLOQUEADO)
  },
  generarOtpValido: async idCliente => {
    await actionCliente.reiniciarCliente(idCliente)
    const cliente = await ClienteDAO.findByIdCliente(idCliente)
    log.reFatal('generarOtpValido.CLIENTE', cliente)
    const hash = generateHashSecret(idCliente, TEST.CLIENTE_BODY.idDevice)
    const codigoOtp = generateOtp(hash)
    log.reFatal('generarOtpValido.CODIGOOTP', codigoOtp)
    await actionEstadoActivacion.setEstadoActivacion(idCliente, ESTADO_ACTIVACION_OTPGENERADO, codigoOtp)
    return codigoOtp
  },
  generarOtpExpirado: async idCliente => {
    await actionCliente.reiniciarCliente(idCliente)
    const codigoOtp = '000000'
    await actionEstadoActivacion.setEstadoActivacion(idCliente, ESTADO_ACTIVACION_OTPGENERADO, codigoOtp)
    return codigoOtp
  }
}

// Acciones de CLIENTE MI MONTE
export const actionClienteMiCliente = {
  eliminarByIdCliente: async idCliente => {
    log.reMark('Iniciando actionClienteMiCliente.eliminarByIdCliente')
    await ClienteMiMonteService.deleteClienteMiMonte(idCliente)
    log.reMark('Terminando actionClienteMiCliente.eliminarByIdCliente')
  },
  guardarClienteMiMonte: async body => {
    log.reMark('Iniciando actionClienteMiCliente.guardarClienteMiMonte')
    await ClienteMiMonteService.saveClienteMiMonte(body)
    log.reMark('Terminando actionClienteMiCliente.guardarClienteMiMonte')
  }
}

// Acciones de Valida token
export const actionValidaToken = {
  validaToken: async objSession => {
    log.reMark('Iniciando validaToken.validateToken')
    await ClienteMiMonteService.validateToken(objSession)
    log.reMark('Terminando validaToken.validateToken')
  }
}
