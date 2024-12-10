import { TEST, CONTEXT, actionCliente, actionClienteMiCliente } from './commons/test-nmp'
import { SuiteTEST, IT } from './commons/test'

SuiteTEST(
  'T03',
  'clienteMiMonte',
  {
    commonHeaders: TEST.LISTHEADER_OAG,
    commonRootUrl: `/${CONTEXT.NAME}/${CONTEXT.VERSION}`,
    listDefaultOption: {
      opt10: { shouldHaveStatus: 201, url: `/token/establecerClienteMiMonte`, body: TEST.CLIENTE_MI_MONTE_BODY },
      opt20: { shouldHaveStatus: 201, url: `/token/establecerClienteMiMonte`, body: TEST.CLIENTE_MI_MONTE_UPDATE_BODY }
    },
    listDefaultSub: {
      eliminarClienteMiMonteNuevo: { title: 'Eliminar ClienteMiMonte', sub: () => actionClienteMiCliente.eliminarByIdCliente(TEST.CLIENTE_MI_MONTE) },
      guardarClienteMiMonte: {
        title: 'Guardar ClienteMiMonte',
        sub: () => actionClienteMiCliente.guardarClienteMiMonte(TEST.CLIENTE_MI_MONTE_UPDATE_BODY)
      },
      eliminarClienteMiMonteActualizar: {
        title: 'Eliminar ClienteMiMonte',
        sub: () => actionClienteMiCliente.eliminarByIdCliente(TEST.CLIENTE_MI_MONTE_UPDATE)
      }
    }
  },
  {
    tests: () => {
      // Crear nuevo ClienteMiMonte
      IT.Post('T03A1', 'opt10', 'Guardar ClienteMiMonte nuevo, cuando el ClienteMiMonte no existe.', {
        runBefore: 'eliminarClienteMiMonteNuevo',
        runAfter: 'eliminarClienteMiMonteNuevo'
      })

      IT.Post('T03A2', 'opt20', 'Actualiza ClienteMiMonte, cuando el ClienteMiMonte existe.', {
        runBefore: 'guardarClienteMiMonte',
        runAfter: 'eliminarClienteMiMonteActualizar'
      })

      // Excepciones de Validacion
      IT.Post('T03A3', 'opt10:400', 'Bad Request al guardar ClienteMiMonte', {
        body: {
          idcliente: TEST.CLIENTE
        }
      })
    }
  }
)
