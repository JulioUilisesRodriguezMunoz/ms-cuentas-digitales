import { TEST, MongoDB, CONTEXT, actionCliente } from './commons/test-nmp'
import { SuiteTEST, IT } from './commons/test'

SuiteTEST(
  'T01',
  'cliente',
  {
    commonHeaders: TEST.LISTHEADER_OAG,
    commonRootUrl: `/${CONTEXT.NAME}/${CONTEXT.VERSION}`,
    listDefaultOption: {
      optActualizarCliente: { shouldHaveStatus: 201, url: `/actualizarCliente`, body: TEST.CLIENTE_BODY },
      optObtenerCliente: { shouldHaveStatus: 200, url: `/obtenerCliente`, query: { idCliente: TEST.CLIENTE } },
      optRemoverCliente: { shouldHaveStatus: 200, url: `/removerCliente`, query: { idCliente: TEST.CLIENTE } }
    },
    listDefaultSub: {
      beforeActualizarClienteNoExistente: { title: 'Eliminar Cliente', sub: () => actionCliente.eliminarByIdCliente(TEST.CLIENTE_BODY.idCliente) },
      afterActualizarClienteNoExistente: { title: 'Eliminar Cliente', sub: () => actionCliente.eliminarByIdCliente(TEST.CLIENTE_BODY.idCliente) },
      beforeActualizarClienteExistente: { title: 'Eliminar Cliente', sub: () => actionCliente.reiniciarCliente(TEST.CLIENTE_BODY.idCliente) },
      afterActualizarClienteExistente: { title: 'Eliminar Cliente', sub: () => actionCliente.eliminarByIdCliente(TEST.CLIENTE_BODY.idCliente) },
      beforeObtenerClienteSiExiste: { title: 'Crear Cliente', sub: () => actionCliente.save(TEST.CLIENTE_BODY) },
      afterObtenerClienteSiExiste: { title: 'Eliminar Cliente', sub: () => actionCliente.eliminarByIdCliente(TEST.CLIENTE_BODY.idCliente) },
      beforeRemoverClienteSiExiste: { title: 'Crear Cliente', sub: () => actionCliente.save(TEST.CLIENTE_BODY) },
      afterRemoverClienteSiExiste: { title: 'Eliminar Cliente', sub: () => actionCliente.eliminarByIdCliente(TEST.CLIENTE_BODY.idCliente) }
    }
  },
  {
    // callbakcs
    before: async () => {
      await MongoDB.connect()
    },
    after: async () => {
      await MongoDB.disconnect()
    },
    tests: () => {
      // Actualizar Cliente
      IT.Post('T01A1.1.actualizarCliente-NoExiste', 'optActualizarCliente:201', 'Actualizar Cliente, cuando el cliente NO EXISTE.', {
        runBefore: 'beforeActualizarClienteNoExistente',
        runAfter: 'afterActualizarClienteNoExistente'
      })
      IT.Post('T01A1.2.actualizarCliente-Existente', 'optActualizarCliente:201', 'Actualizar Cliente, cuando el cliente SI EXISTE.', {
        runBefore: 'beforeActualizarClienteExistente',
        runAfter: 'afterActualizarClienteExistente'
      })
      IT.Post('T01A1.3.actualizarcliente-SinOAG', 'optActualizarCliente:400', 'set:cliente, sin OAG.', { listHeaders: [] })

      // Obtener Cliente
      IT.Get('T01A2.1', 'optObtenerCliente', 'Obtener Cliente, cuando el cliente SI EXISTE.', {
        runBefore: 'beforeObtenerClienteSiExiste',
        runAfter: 'afterObtenerClienteSiExiste'
      })
      IT.Get('T01A2.2', 'optObtenerCliente:400', 'get:/cliente, sin OAG.', { listHeaders: [] })
      IT.Get('T01A2.3', 'optObtenerCliente:400', 'get:/cliente, con nombre de parametro incorrecto.', { query: { Cliente: TEST.CLIENTE } })
      IT.Get('T01A2.4', 'optObtenerCliente:204', 'get:/cliente, cuando el cliente NO EXISTE.', {})

      // Eliminar Cliente
      IT.Post('T01A3.1', 'optRemoverCliente', 'Eliminar Cliente, cuando el cliente SI EXISTE.', {
        runBefore: 'beforeRemoverClienteSiExiste',
        runAfter: 'afterRemoverClienteSiExiste'
      })
      IT.Post('T01A3.2', 'optRemoverCliente:400', 'delete:/cliente, sin OAG.', { listHeaders: [] })
      IT.Post('T01A3.3', 'optRemoverCliente:200', 'delete:/cliente, cuando el cliente NO EXISTE.', { query: { idCliente: TEST.CLIENTE_NO_EXISTE } })
    }
  }
)
