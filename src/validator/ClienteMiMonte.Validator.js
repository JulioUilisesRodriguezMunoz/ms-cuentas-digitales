export const bodySchemaClienteMiMonte = {
  properties: {
    idcliente: { type: 'number', required: true },
    mimonte: { type: 'string', required: true, minLength: 16, maxLength: 16 },
    tokenAzure: { type: 'string', required: true },
    tokenFirebase: { type: 'string', required: true }
  },
  additionalProperties: false
}

export const bodySchemaValidateToken = {
  properties: {
    idCliente: { type: ['string', 'number', 'integer'], required: false },
    tokenCliente: { type: 'string', required: true },
    email: { type: 'string', required: false }
  },
  additionalProperties: false
}
