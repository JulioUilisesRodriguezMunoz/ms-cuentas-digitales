import { v4 as uuidv4 } from 'uuid'
import { ClientELK } from '../config/elasticsearch'
import { ClientCognito } from '../config/cognito'
import { log } from '../commons/log'

const params = {
  index: process.env.ELK_INDEX_CLIENTEMONTE,
  type: '_doc'
}

/**
 * guarda un documento de ClienteMiMonteToken en el índice elasticsearch ELK_INDEX_CLIENTEMONTE
 * @param {Object} clienteMiMonteToKen cuerpo de la solicitud de los ClienteMiMonteToken
 * @param {String} uuidGen parámetro para generar un identificador
 * @returns {Promise<void>} una promesa resultante
 */
const saveClienteMiMonte = async (clienteMiMonteToKen, uuidGen = uuidv4()) => {
  log.debugJSON('DAO: Starting saveClienteMiMonte method ', clienteMiMonteToKen)
  const newParams = {
    ...params,
    refresh: 'wait_for',
    body: clienteMiMonteToKen,
    id: uuidGen
  }
  const response = await ClientELK.index(newParams)
  log.debugJSON('DAO: Ending saveClienteMiMonte method ', response)
}

/**
 * Actualiza un documento de ClienteMiMonteToken en el índice elasticsearch ELK_INDEX_CLIENTEMONTE
 * @param {String} id representa id del índice de elasticsearch a modificar
 * @param {Object} doc documento con la información que se va a actualizar
 * @returns {Promise<void>} una promesa resultante
 */
const updateClienteMiMonte = async (id, doc) => {
  log.debugJSON('DAO: Starting updateClienteMiMonte method ', id)
  const newParams = {
    ...params,
    id,
    body: {
      doc
    }
  }
  const response = await ClientELK.update(newParams)
  log.debugJSON('DAO: Ending updateClienteMiMonte method ', response)
}

/**
 * Permite obtener la información del elasticsearch mediante un valor
 * @param {Object} value valor que se desea consultar
 * @returns {Promise<void>} promesa resultante
 */
const getClienteMiMonte = async value => {
  log.debugJSON('DAO: Starting getClienteMiMonte method by value ', value)

  const newParams = {
    ...params,
    body: {
      query: {
        bool: {
          must: value
        }
      }
    },
    _source: ['*']
  }
  const clientesMiMonteToken = await ClientELK.search(newParams)
  log.debugJSON('DAO: Ending getClienteMiMonte method ', clientesMiMonteToken.body.hits.hits)
  return clientesMiMonteToken
}

/**
 * Consulta el índice de elasticsearch ELK_INDEX_CLIENTEMONTE por idCliente
 * @param {number} idCliente identificador del cliente
 * @returns {Promise<{id, source: [string]}|boolean>} promesa resultante
 */
const getClienteMiMonteByIdCliente = async idCliente => {
  log.debugJSON(`DAO: Starting getClienteMiMonteByIdCliente method`, idCliente)
  const clientesMiMonteToken = await getClienteMiMonte([
    {
      match: {
        idcliente: idCliente
      }
    }
  ])
  log.debugJSON('DAO: Ending getClienteMiMonteByIdCliente method ', clientesMiMonteToken)
  return clientesMiMonteToken.body.hits.hits.length
    ? {
        // eslint-disable-next-line no-underscore-dangle
        id: clientesMiMonteToken.body.hits.hits[0]._id,
        // eslint-disable-next-line no-underscore-dangle
        source: clientesMiMonteToken.body.hits.hits[0]._source
      }
    : false
}

/**
 * Elimina el documento del eslasticsearch en el índice ELK_INDEX_CLIENTEMONTE
 * @param {String} id identificador del documento en el índice
 * @returns {Promise<void>} promesa de resultado
 */
const deleteClienteMiMonteById = async id => {
  log.debugJSON('DAO: Starting deleteClienteMiMonteTokenById method ', id)
  const newParams = {
    ...params,
    id
  }
  const response = await ClientELK.delete(newParams)
  log.debugJSON('DAO: Ending deleteClienteMiMonteTokenById method ', response)
}

/**
 * Permite obtener revisar si un token es valido con cognito mediante un token
 * @param {Object} token token que se desea consultar
 * @returns {Promise<void>} promesa resultante
 */
const checktokenCliente = async token => {
  log.debugJSON('DAO: Starting checktokenCliente method by token ', token)
  const clientCognito = ClientCognito
  try {
    const payload = await clientCognito.verify(token)
    log.debugJSON('DAO: Ending checktokenCliente method ', payload)
    return payload
  } catch (error) {
    return false
  }
}

export const ClienteMiMonteDAO = {
  saveClienteMiMonte,
  updateClienteMiMonte,
  getClienteMiMonteByIdCliente,
  deleteClienteMiMonteById,
  checktokenCliente
}
