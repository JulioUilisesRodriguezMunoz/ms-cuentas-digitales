import elasticsearch from '@elastic/elasticsearch'

export const ClientELK = new elasticsearch.Client({
  node: [process.env.ELK_HOST],
  log: process.env.ELK_LOGGER_LEVEL,
  apiVersion: process.env.ELK_API_VERSION,
  requestTimeout: process.env.ELK_TIMEOUT,
  auth: {
    username: process.env.ELK_CREDENTIAL_USER,
    password: process.env.ELK_CREDENTIAL_PASSWORD
  },
  ssl: { rejectUnauthorized: false, pfx: [] }
})

export default null
