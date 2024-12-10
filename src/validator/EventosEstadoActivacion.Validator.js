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
    estatusActivacion: { type: 'number', required: false }
  },
  additionalProperties: false
}
