export const bodySchemaEnviarOtp = {
  properties: {
    idCliente: { type: 'string', required: true },
    modoEnvio: { type: 'string', enum: ['sms', 'email'], required: true },
    idFlujo: { type: 'number', required: false }
  },
  additionalProperties: false
}

export const bodySchemaVerificarOtp = {
  properties: {
    idCliente: { type: 'string', required: true },
    codigoOtp: { type: 'string', required: true },
    idFlujo: { type: 'number', required: false }
  },
  additionalProperties: false
}
