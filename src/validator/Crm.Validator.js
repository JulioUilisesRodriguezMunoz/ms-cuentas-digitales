export const bodySchemaCrmCliente = {
  properties: {
    noCredencial: { type: 'string', required: true }
  },
  additionalProperties: false
}

export const bodySchemaCrmConsultaEstatusProceso = {
  properties: {
    noCredencial: { type: 'string', required: true }
  },
  additionalProperties: false
}

export const bodySchemaCrmActualizaEstatusProceso = {
  properties: {
    noCredencial: { type: 'string', required: true },
    idFlujo: { type: 'number', required: true },
    idEstatus: { type: 'number', required: true },
    codigoOtp: { type: 'string', required: false }
  },
  additionalProperties: false
}
export const bodySchemaValidarCliente = {
  properties: {
    tarjetaMonte: { type: 'string', required: true },
    fechaDeNacimiento: { type: 'string', required: true },
    idFlujo: { type: 'number', required: true }
  },
  additionalProperties: false
}
