import nock from 'nock'
import { TEST, MongoDB, CONTEXT, actionCliente, actionAuthOtp } from './commons/test-nmp'
import { SuiteTEST, IT } from './commons/test'

let codigoOtp = '0000'
SuiteTEST(
  'T21',
  'AuthOTP',
  {
    commonHeaders: TEST.LISTHEADER_OAG,
    commonRootUrl: `/${CONTEXT.NAME}/${CONTEXT.VERSION}`,
    listDefaultOption: {
      opt10: { shouldHaveStatus: 201, url: `/enviarOtp`, body: { idCliente: TEST.CLIENTE, modoEnvio: 'email' } },
      opt20: { shouldHaveStatus: 201, url: `/verificarOtp`, body: { idCliente: TEST.CLIENTE, codigoOtp: '0000' } }
    },
    listDefaultSub: {
      beforeComunicaciones201: {
        title: 'NOCK-MS_COMUNICACIONES-201',
        sub: () =>
          nock(TEST.URL_API_COMUNICACIONES).post('/solicitud/mensaje').reply(201, { statusRequest: 201, message: 'NOCK-beforeComunicaciones201' })
      },
      beforeComunicaciones400: {
        title: 'NOCK-MS_COMUNICACIONES-400',
        sub: () =>
          nock(TEST.URL_API_COMUNICACIONES).post('/solicitud/mensaje').reply(400, { statusRequest: 400, message: 'NOCK-beforeComunicaciones400' })
      },
      beforeBloquearCuenta: {
        title: 'Bloquar Cuenta',
        sub: async () => actionAuthOtp.bloquarCuenta(TEST.CLIENTE)
      },
      beforeBloquearCuentaSinEventos: {
        title: 'Bloquear Cuenta Sin Eventos',
        sub: async () => actionAuthOtp.bloquearCuentaSinEventos(TEST.CLIENTE)
      },
      beforeGenerarOtpValido: {
        sub: async () => {
          codigoOtp = await actionAuthOtp.generarOtpValido(TEST.CLIENTE)
        }
      },
      beforeGenerarOtpExpirado: {
        title: 'Generar Otp Expirado',
        sub: async () => {
          codigoOtp = await actionAuthOtp.generarOtpExpirado(TEST.CLIENTE)
        }
      }
    }
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
      IT.Post(
        'T21A0',
        'opt10:201',
        'Enviar OTP por EMAIL.',
        { runBefore: 'beforeComunicaciones201', body: { idCliente: TEST.CLIENTE, modoEnvio: 'sms' } },
        {
          end: (err, res) => {
            codigoOtp = res.body.codigoOtp
          }
        }
      )
      IT.Post(
        'T21A1',
        'opt10:201',
        'Enviar OTP por EMAIL.',
        { runBefore: 'beforeComunicaciones201' },
        {
          end: (err, res) => {
            codigoOtp = res.body.codigoOtp
          }
        }
      )
      IT.Post(
        'T21A2',
        'opt20:201',
        'Verificar OTP, con OTP VALIDO. ',
        { runBefore: 'beforeComunicaciones201,beforeGenerarOtpValido' },
        {
          send: () => {
            return { idCliente: TEST.CLIENTE, codigoOtp }
          }
        }
      )

      // // POST-EnviarOTP
      IT.Post('T21B0', 'opt10:400', 'Enviar OTP, SIN OAG.', { listHeaders: [] })
      IT.Post('T21B1', 'opt10:204', 'Enviar OTP, con cliente que NO EXISTE', { body: { idCliente: TEST.CLIENTE_NO_EXISTE, modoEnvio: 'email' } })
      IT.Post('T21B2', 'opt10:201', 'Enviar OTP por EMAIL.', { runBefore: 'beforeComunicaciones201' })
      IT.Post('T21B3', 'opt10:400', 'Enviar OTP, sin definir modoEnvio', { body: { idCliente: TEST.CLIENTE } })
      IT.Post('T21B4', 'opt10:400', 'Enviar OTP, con modoEnvio NO VALIDO', { body: { idCliente: TEST.CLIENTE, modoEnvio: 'fax' } })
      IT.Post('T21B5', 'opt10:500', 'Enviar OTP, con MS_COMUNICACIONES, fallando.', { runBefore: 'beforeComunicaciones400' })

      // POST-Verificar OTP
      IT.Post('T21C0', 'opt20:400', 'Verificar OTP, sin OAG.', { listHeaders: [] })
      IT.Post('T21C1', 'opt20:204', 'Verificar OTP, con cliente que NO EXISTE.', { body: { idCliente: TEST.CLIENTE_NO_EXISTE, codigoOtp } })
      IT.Post(
        'T21C2',
        'opt20:409',
        'Verificar OTP, con codigo INVALIDO.',
        { runBefore: 'beforeGenerarOtpValido' },
        {
          send: () => {
            return { idCliente: TEST.CLIENTE, codigoOtp: '000000' }
          }
        }
      )
      IT.Post(
        'T21C3',
        'opt20:409',
        'Verificar OTP, con codigo EXPIRADO.',
        { runBefore: 'beforeGenerarOtpExpirado' },
        {
          send: () => {
            return { idCliente: TEST.CLIENTE, codigoOtp }
          }
        }
      )
      IT.Post('T21C4', 'opt20:409', 'Verificar OTP, sin haber enviado OTP.')

      // Excepciones con BLOQUEO
      // IT.Post('T21D1', 'opt10:409', 'Enviar OTP, cuenta bloqueada.', { runBefore: 'beforeBloquearCuenta' })
      IT.Post('T21D2', 'opt20:409', 'Verificar OTP, cuenta bloqueada.', { runBefore: 'beforeBloquearCuenta' })
      IT.Post('T21D3', 'opt20:409', 'Verificar OTP, cuenta bloqueada y eventos expirados', { runBefore: 'beforeBloquearCuentaSinEventos' })
    }
  }
)
