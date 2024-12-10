import nock from 'nock'
import { TEST_CLIENTE, TEST_TARJETAMONTE, TEST, MongoDB, CONTEXT, actionCliente, actionAuthOtp } from './commons/test-nmp'
import { SuiteTEST, IT } from './commons/test'

let codigoOtpValido = ''
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
            numeroDeCredencial: TEST_TARJETAMONTE,
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
        noExisteCliente: { respuesta: 'Cliente no existe' }
      }
    }
  }
}

SuiteTEST(
  'T41',
  'NuevoFlujo',
  {
    commonHeaders: TEST.LISTHEADER_OAG,
    commonRootUrl: `/${CONTEXT.NAME}/${CONTEXT.VERSION}`,
    listDefaultOption: {
      optValidarCliente: {
        shouldHaveStatus: 201,
        url: `/validarCliente`,
        body: { tarjetaMonte: TEST_TARJETAMONTE, idFlujo: 1, fechaDeNacimiento: '1986-04-27' }
      },
      optEnviarOtp: { shouldHaveStatus: 201, url: `/enviarOtp`, body: { idCliente: TEST_CLIENTE, modoEnvio: 'email', idFlujo: 1 } },
      optVerificarOtp: { shouldHaveStatus: 201, url: `/verificarOtp`, body: { idCliente: TEST_CLIENTE, codigoOtp: '0000', idFlujo: 1 } }
    },
    listDefaultSub: {
      nockComunicaciones201: {
        title: 'NOCK-MS_COMUNICACIONES-201',
        sub: () => nock(TEST.URL_API_COMUNICACIONES).post('/solicitud/mensaje').reply(201, { statusRequest: 201, message: 'nockComunicaciones201' })
      },

      beforeGenerarOtpValido: {
        title: 'NOCK-MS_COMUNICACIONES-201',
        // eslint-disable-next-line no-return-assign
        sub: async () => (codigoOtpValido = await actionAuthOtp.generarOtpValido(TEST_CLIENTE))
      },

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
      nockGetClienteByNumCredencial500: {
        title: 'NOCK-GetClienteByNumCredencial-500',
        sub: () =>
          nock(TEST.RESTCRM_HOST_URL)
            .post('/GestionClientes/UsuariosMonte/v1/getClienteByNumCredencial')
            .reply(500, forNock.res.body.clienteByNumCredencial.existeCliente)
      },
      nockGetClienteByNumCredencial401: {
        title: 'NOCK-GetClienteByNumCredencial-401',
        sub: () =>
          nock(TEST.RESTCRM_HOST_URL)
            .post('/GestionClientes/UsuariosMonte/v1/getClienteByNumCredencial')
            .reply(401, forNock.res.body.clienteByNumCredencial.existeCliente)
      },
      nockCrmActualizaEstatusProceso: {
        title: 'NOCK-CrmActualizaEstatusProceso-201',
        sub: () =>
          nock(TEST.RESTCRM_HOST_URL)
            .post('/GestionClientes/Cliente/v2/updateCliente')
            .reply(201, forNock.res.body.actualizaStatusProceso.existClient)
      },

      beforeValidarCliente: {
        title: 'NOCK-CrmValidarCliente-200',
        sub: async () => {
          await actionCliente.reiniciarCliente(TEST_CLIENTE)
        }
      },

      // Excepciones
      nockGetClienteByNumCredencialNoExisteCliente: {
        title: 'NOCK-GetClienteByNumCredencialNoExiste-200',
        sub: () =>
          nock(TEST.RESTCRM_HOST_URL)
            .post('/GestionClientes/UsuariosMonte/v1/getClienteByNumCredencial')
            .reply(200, forNock.res.body.clienteByNumCredencial.noExisteCliente)
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
    beforeEach: async () => {},
    afterEach: async () => {
      await actionCliente.eliminarByIdCliente(TEST_CLIENTE)
    },
    tests: () => {
      // Flujo Sin Excepciones
      IT.Post('T41A0', 'optValidarCliente:201', 'ValidarCliente', {
        runBefore: 'nockGenToken,nockGetClienteByNumCredencial,nockGenToken,nockCrmActualizaEstatusProceso'
      })
      IT.Post('T41A1', 'optEnviarOtp:201', 'optEnviarOtp', {
        runBefore: 'beforeValidarCliente,nockComunicaciones201,nockGenToken,nockCrmActualizaEstatusProceso'
      })
      IT.Post(
        'T41A2',
        'optVerificarOtp:201',
        'optVerificarOtp',
        { runBefore: 'beforeValidarCliente,beforeGenerarOtpValido,nockGenToken,nockCrmActualizaEstatusProceso,nockComunicaciones201' },
        {
          send: () => {
            return { idCliente: TEST_CLIENTE, codigoOtp: codigoOtpValido, idFlujo: 1 }
          }
        }
      )

      // Validar Excepciones
      IT.Post('T41A4', 'optValidarCliente:404', 'ValidarCliente-Cuando cliente no existe', {
        runBefore: 'nockGenToken,nockGetClienteByNumCredencialNoExisteCliente'
      })
      IT.Post('T41A5', 'optValidarCliente:409', 'ValidarCliente-Fecha de nacimiento no valida..', {
        runBefore: 'nockGenToken,nockGetClienteByNumCredencial',
        body: { tarjetaMonte: TEST_TARJETAMONTE, idFlujo: 1, fechaDeNacimiento: '0000-01-01' }
      })
      IT.Post('T41A6', 'optValidarCliente:500', 'ValidarCliente-Crm Fallando..', { runBefore: 'nockGenToken,nockGetClienteByNumCredencial500' })
      IT.Post('T41A7', 'optValidarCliente:401', 'ValidarCliente-Crm con error 401..', { runBefore: 'nockGenToken,nockGetClienteByNumCredencial401' })
    }
  }
)
