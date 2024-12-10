import nock from 'nock'
import { TEST, TEST_CLIENTE, TEST_TARJETAMONTE, MongoDB, CONTEXT } from './commons/test-nmp'
import { SuiteTEST, IT } from './commons/test'

const forNock = {
  res: {
    body: {
      clienteByNumCredencial: {
        existeCliente: {
          Cliente: {
            idCliente: TEST_CLIENTE,
            nombre: 'ABRAHAM',
            apellidoPaterno: 'FERREYRA',
            apellidoMaterno: 'CRUZ',
            fechaDeNacimiento: '1986-04-27T05:00:00Z',
            numeroDeCredencial: '1000000000000307',
            email: 'kim@gmail.com',
            sobreAforo: 0,
            calificacionMidas: 0,
            Contacto: {
              ListaTelefonos: { Telefono: [{ codigoArea: null, numeroTelefonico: '5568011845', extension: null, tipoTelefono: 'celular' }] }
            }
          }
        },
        existeClienteNoDatos: {
          Cliente: {
            idCliente: TEST_CLIENTE,
            Contacto: {
              ListaTelefonos: {
                Telefono: [
                  { codigoArea: null, numeroTelefonico: '5568011845', extension: null, tipoTelefono: 'casa' },
                  { codigoArea: null, numeroTelefonico: '5568011845', extension: null, tipoTelefono: 'celular' }
                ]
              }
            }
          }
        },
        noExisteCliente: { Cliente: { idCliente: null } }
      },
      actualizaStatusProceso: {
        existClient: { respuesta: 'Estatus actualizado' },
        noExisteCliente: { respuesta: 'Cliente no existe' },
        errorInServer: { mensage: 'error server for nock.' },
        errorInServer2: {}
      }
    }
  }
}

SuiteTEST(
  'T31',
  'Crm',
  {
    commonHeaders: TEST.LISTHEADER_OAG,
    commonRootUrl: `/${CONTEXT.NAME}/${CONTEXT.VERSION}`,
    listDefaultOption: {
      optClienteByNumCredencial: { shouldHaveStatus: 200, url: `/crm/clienteByNumCredencial`, body: { noCredencial: TEST_CLIENTE } },
      optConsultaEstatusProceso: { shouldHaveStatus: 200, url: `/crm/consultaEstatusProceso`, body: { noCredencial: TEST_TARJETAMONTE } },
      optActualizaEstatusProceso: {
        shouldHaveStatus: 201,
        url: `/crm/actualizaEstatusProceso`,
        body: { noCredencial: TEST_TARJETAMONTE, idFlujo: 1, idEstatus: 1, codigoOtp: '1111' }
      }
    },
    listDefaultSub: {
      nockGenToken: {
        title: 'NOCK-oauthToken-200',
        sub: () => nock(TEST.RESTCRM_HOST_URL).post('/oauth/token').reply(200, { MODE: 'FROM-NOCK-nockGenToken', access_token: 'xxxxxx' })
      },
      nockGetClienteByNumCredencial: {
        title: 'NOCK-GetClienteByNumCredencial-200',
        sub: () =>
          nock(TEST.RESTCRM_HOST_URL)
            .post('/GestionClientes/UsuariosMonte/v1/getClienteByNumCredencial')
            .reply(200, forNock.res.body.clienteByNumCredencial.existeCliente)
      },
      nockGetClienteByNumCredencialExisteClienteNoDatos: {
        title: 'NOCK-GetClienteByNumCredencial-200',
        sub: () =>
          nock(TEST.RESTCRM_HOST_URL)
            .post('/GestionClientes/UsuariosMonte/v1/getClienteByNumCredencial')
            .reply(200, forNock.res.body.clienteByNumCredencial.existeClienteNoDatos)
      },

      // nock GetClienteByNumCredencial
      nockGetClienteByNumCredencialNoExisteCliente: {
        title: 'NOCK-GetClienteByNumCredencialNoExiste-200',
        sub: () =>
          nock(TEST.RESTCRM_HOST_URL)
            .post('/GestionClientes/UsuariosMonte/v1/getClienteByNumCredencial')
            .reply(200, forNock.res.body.clienteByNumCredencial.noExisteCliente)
      },

      // nock ActualizaEstatusProceso
      nockCrmActualizaEstatusProceso: {
        title: 'NOCK-CrmActualizaEstatusProceso-200',
        sub: () =>
          nock(TEST.RESTCRM_HOST_URL)
            .post('/GestionClientes/Cliente/v2/updateCliente')
            .reply(200, forNock.res.body.actualizaStatusProceso.existClient)
      },
      nockCrmActualizaEstatusProcesoNoExisteCliente: {
        title: 'NOCK-CrmActualizaEstatusProceso-200',
        sub: () =>
          nock(TEST.RESTCRM_HOST_URL)
            .post('/GestionClientes/Cliente/v2/updateCliente')
            .reply(200, forNock.res.body.actualizaStatusProceso.noExisteCliente)
      },
      nockCrmActualizaEstatusProcesoErrorInServer: {
        title: 'NOCK-CrmActualizaEstatusProceso-200',
        sub: () =>
          nock(TEST.RESTCRM_HOST_URL)
            .post('/GestionClientes/Cliente/v2/updateCliente')
            .reply(200, forNock.res.body.actualizaStatusProceso.errorInServer2)
      }
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
      IT.Get('T31A0', 'optClienteByNumCredencial:200', 'ClienteByNumCredencial', { runBefore: 'nockGenToken,nockGetClienteByNumCredencial' })
      IT.Get('T31A1', 'optClienteByNumCredencial:200', 'ClienteByNumCredencial-existe cliente sin datos', {
        runBefore: 'nockGenToken,nockGetClienteByNumCredencialExisteClienteNoDatos'
      })
      IT.Get('T31A4', 'optClienteByNumCredencial:204', 'ClienteByNumCredencial-no existe cliente', {
        runBefore: 'nockGenToken,nockGetClienteByNumCredencialNoExisteCliente'
      })
      IT.Get('T31A5', 'optClienteByNumCredencial:400', 'ClienteByNumCredencial', { body: {} })

      // optActualizaEstatusProceso
      IT.Post('T31C0', 'optActualizaEstatusProceso:201', 'ActualizaEstatusProceso', {
        runBefore: 'nockGenToken,nockCrmActualizaEstatusProceso',
        body: { noCredencial: TEST_TARJETAMONTE, idFlujo: 1, idEstatus: 1 }
      })

      IT.Post('T31C2', 'optActualizaEstatusProceso:500', 'ActualizaEstatusProceso-cliente no existe', {
        runBefore: 'nockGenToken,nockCrmActualizaEstatusProcesoNoExisteCliente',
        body: { noCredencial: TEST_TARJETAMONTE, idFlujo: 1, idEstatus: 1 }
      })

      IT.Post('T31C5', 'optActualizaEstatusProceso:400', 'ActualizaEstatusProceso-no Body', { body: {} })
      IT.Post('T31C6', 'optActualizaEstatusProceso:500', 'ActualizaEstatusProceso-ErrorServer', {
        runBefore: 'nockGenToken,nockCrmActualizaEstatusProcesoErrorInServer',
        body: { noCredencial: TEST_TARJETAMONTE, idFlujo: 1, idEstatus: 1 }
      })
    }
  }
)
