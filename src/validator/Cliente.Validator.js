export const bodySchemaCliente = {
  properties: {
    idCliente: { type: 'string', required: true },
    idDevice: { type: 'string', required: true },
    tarjetaMonte: { type: 'string', required: true },
    nombreCliente: { type: 'string', required: true },
    apellidoPaterno: { type: 'string', required: false },
    apellidoMaterno: { type: 'string', required: false },
    celularCliente: { type: 'string', required: false },
    correoCliente: { type: 'string', required: false }
  },
  additionalProperties: false
}

export const querySchemaCliente = {
  properties: {
    idCliente: {
      type: 'string',
      required: true
    }
  },
  additionalProperties: false
}
