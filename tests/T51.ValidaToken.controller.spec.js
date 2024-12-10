import { TEST, CONTEXT, actionValidaToken } from './commons/test-nmp'
import { SuiteTEST, IT } from './commons/test'

// Es necesario genera un access token valido para el test
SuiteTEST(
  'T51',
  'validaToken',
  {
    commonHeaders: TEST.LISTHEADER_OAG,
    commonRootUrl: `/${CONTEXT.NAME}/${CONTEXT.VERSION}`,
    listDefaultOption: {
      opt10: { shouldHaveStatus: 200, url: `/token/validaToken`, body: TEST.TOKEN_VALIDO_PRIMER_MOMENTO },
      opt20: { shouldHaveStatus: 401, url: `/token/validaToken`, body: TEST.TOKEN_INVALIDO_PRIMER_MOMENTO },
      opt30: { shouldHaveStatus: 200, url: `/token/validaToken`, body: TEST.TOKEN_VALIDO_SEGUNDO_MOMENTO },
      opt40: { shouldHaveStatus: 401, url: `/token/validaToken`, body: TEST.TOKEN_INVALIDO_SEGUNDO_MOMENTO },
      opt50: { shouldHaveStatus: 401, url: `/token/validaToken`, body: TEST.TOKEN_INVALIDO_PRIMER_MOMENTO_EMAIL }
    },
    listDefaultSub: {
      validaToken: { title: 'Valida Token', sub: () => actionValidaToken.validaToken(TEST.TOKEN_VALIDO_PRIMER_MOMENTO) }
    }
  },
  {
    tests: () => {
      // Validar token en primer momento {idCliente, email, tokenCliente}
      IT.Post('T51A1', 'opt10', 'Valida token en primer momento', {
        runBefore: 'validaToken'
      })
      // Validar token en primer momento {idCliente, email, tokenCliente}
      IT.Post('T51A2', 'opt20:401', 'Valida token en primer momento', {
        runBefore: 'validaToken'
      })
      // Validar token en primer momento {idCliente, tokenCliente}
      IT.Post('T51A3', 'opt30', 'Valida token en segundo momento', {
        runBefore: 'validaToken'
      })
      // Validar token en primer momento {idCliente, tokenCliente}
      IT.Post('T51A4', 'opt40:401', 'Valida token en segundo momento', {
        runBefore: 'validaToken'
      })
      // Validar token en primer momento {idCliente, tokenCliente}
      IT.Post('T51A5', 'opt50:401', 'Valida token en segundo momento', {
        runBefore: 'validaToken'
      })
    }
  }
)
