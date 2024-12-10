import { TEST, MongoDB, CONTEXT, actionCliente } from './commons/test-nmp'
import { SuiteTEST, IT } from './commons/test'
import { ESTADO_ACTIVACION_PROSPECTO } from '../src/constants/constants'

SuiteTEST(
  'T11',
  '/cliente/estadoActivacion/eventos',
  {
    commonHeaders: TEST.LISTHEADER_OAG,
    commonRootUrl: `/${CONTEXT.NAME}/${CONTEXT.VERSION}`,
    listDefaultOption: {
      opt10: { shouldHaveStatus: 200, url: `/activacionEvento/eventos`, query: { idCliente: TEST.CLIENTE } },
      opt20: {
        shouldHaveStatus: 201,
        url: `/activacionEvento/eventos`,
        query: { idCliente: TEST.CLIENTE },
        body: { estatusActivacion: ESTADO_ACTIVACION_PROSPECTO }
      }
    },
    listDefaultSub: {}
  },
  {
    before: async () => {
      await MongoDB.connect()
    },
    after: async () => MongoDB.disconnect(),
    beforeEach: async () => {
      await actionCliente.reiniciarCliente(TEST.CLIENTE)
    },
    afterEach: async () => {
      await actionCliente.eliminarByIdCliente(TEST.CLIENTE)
    },
    tests: () => {
      // Metodo POST=> activacionEvento/eventos
      IT.Get('T11A0', 'opt10:400', 'GET: /cliente/:idCliente/estadoActivacion/eventos, sin OAG.', { listHeaders: [] })
      IT.Get('T11A1', 'opt10:200', 'GET: /cliente/:idCliente/estadoActivacion/eventos, cuando el cliente SI EXISTE.')
      IT.Get('T11A2', 'opt10:204', 'GET: /cliente/:idCliente/estadoActivacion/eventos, cuando el cliente NO EXISTE.', {
        query: { idCliente: TEST.CLIENTE_NO_EXISTE }
      })

      // Metodo POST=> setEstadoActivacion
      IT.Delete('T11B0', 'opt20:400', 'DELETE: /cliente/:idCliente/estadoActivacion/eventos, sin OAG.', { listHeaders: [] })
      IT.Delete('T11B1', 'opt20:200', 'DELETE: /cliente/:idCliente/estadoActivacion/eventos, cuando el cliente SI EXISTE.')
      IT.Delete('T11B2', 'opt20:200', 'DELETE: /cliente/:idCliente/estadoActivacion/eventos, cuando el cliente NO EXISTE.', {
        query: { idCliente: TEST.CLIENTE_NO_EXISTE }
      })
    }
  }
)
