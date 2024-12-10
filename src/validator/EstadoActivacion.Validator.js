export const querySchemaCliente = {
  properties: {
    idCliente: {
      type: 'string',
      required: true
    }
  },
  additionalProperties: false
}

export const bodySchemaEstatusActivacion = {
  properties: {
    idCliente: { type: 'string', required: true },
    estadoActivacion: { type: 'number', required: true }
  },
  additionalProperties: false
}
