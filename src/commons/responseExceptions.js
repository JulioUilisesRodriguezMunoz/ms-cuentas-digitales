export class ValidationHeaderException {
  constructor(message) {
    this.tipoError = 'Header Validation'
    this.code = 'NMP.CUENTASDIGITALES.400'
    this.codigoError = 400
    this.descripcionError = message.descripcionError
  }
}

export class ValidationException {
  constructor(message) {
    this.tipoError = 'Shema Validation'
    this.code = 'NMP.CUENTASDIGITALES.400'
    this.codigoError = 400
    this.descripcionError = message.descripcionError
  }
}

export class InternalServerError {
  constructor(message) {
    this.tipoError = 'Internal Server Error'
    this.code = 'NMP.CUENTASDIGITALES.500'
    this.codigoError = 500
    this.descripcionError = message.descripcionError
    this.stack = new Error().stack
  }
}

export class UnauthorizedException {
  constructor(message) {
    this.tipoError = 'Unauthorize'
    this.code = 'NMP.CUENTASDIGITALES.401'
    this.codigoError = 401
    this.descripcionError = message.descripcionError
  }
}

export class CuentaBloqueadaException {
  constructor(message) {
    this.tipoError = 'Cuenta Bloqueada'
    this.code = 'NMP.CUENTASDIGITALES.409'
    this.codigoError = 409
    this.descripcionError = message.descripcionError
  }
}

export class VerificarOtpException {
  constructor(message) {
    this.tipoError = 'Verificar Otp Error'
    this.code = 'NMP.CUENTASDIGITALES.409'
    this.codigoError = 409
    this.descripcionError = message.descripcionError
  }
}

export class NotFoundCliente {
  constructor(message) {
    this.tipoError = 'Not Found - Cliente'
    this.code = 'NMP.CUENTASDIGITALES.404'
    this.codigoError = 404
    this.descripcionError = message.descripcionError
  }
}

export class CommonException {
  constructor(message) {
    this.tipoError = message.tipoError
    this.code = 'NMP.CUENTASDIGITALES.409'
    this.codigoError = 409
    this.descripcionError = message.descripcionError
  }
}
