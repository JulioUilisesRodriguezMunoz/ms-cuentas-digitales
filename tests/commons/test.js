import chai from 'chai'
import chaiHttp from 'chai-http'
import chaiAsPromised from 'chai-as-promised'
import { log } from '../../src/commons/log'
import app from '../../src/server'
import { filterbySuiteTest, filterbyTest } from './test-constants'

/** SECCION DE FUNCIONES DE TESTING */
chai.use(chaiHttp).use(chaiAsPromised).should()
let DefaultOption = {}
let DefaultSub = {}
const ListDefaultOption = {}
const ListDefaultSub = {}
const ListCommon = {}

/**
 * Libreria que permite gestionar una lista de elementos como cadena de texto.
 */
export const XList = {
  /**
   * Lee el primer elemento de la lista
   * @param {*} list Lista de elementos en texto simple.
   * @param {*} sep Caracter separador de elementos.
   * @returns El primer elemento de la lsita
   */
  readFirst: (list, sep) => {
    const indexPos = String(list).indexOf(sep)
    if (indexPos === -1) return list
    return String(list).substring(0, indexPos)
  },

  /**
   * Remueve el primer elemento de la lista.
   * @param {*} list Lista de elementos en texto simple.
   * @param {*} sep Caracter separador de elementos.
   * @returns El elemento removido.
   */
  removeFirst: (list, sep) => {
    const indexPos = String(list).indexOf(sep)
    if (indexPos === -1) return ''
    return String(list).substring(indexPos + String(sep).length)
  },

  /**
   * Verifica si existe un elmento en la lista.
   * @param {*} list Lista de elementos en texto simple.
   * @param {*} itemFind Elemento a encontrar.
   * @param {*} sep Caracter separador de elementos.
   * @returns True, si el elemento existe. Y false, si elemento no existe.
   */
  existItem: (list, itemFind, sep) => {
    if (list === undefined || itemFind === undefined || list === '' || itemFind === '') return false
    const isContinue = true
    while (isContinue) {
      const cursorItem = XList.readFirst(list, sep)
      // eslint-disable-next-line no-param-reassign
      list = XList.removeFirst(list, sep)
      if (cursorItem !== '' && cursorItem === itemFind) return true
      if (list === '') return false
    }
    return false
  }
}

/**
 * Runers de las listas
 * @param listSubs
 * @param filterSub
 * @param title
 * @param keySUITE
 * @returns {Promise<void>}
 */
const runSubsFromList = async (listSubs, filterSub, title, keySUITE) => {
  let ilistSubs = listSubs
  DefaultSub = ListDefaultSub[keySUITE]

  log.reFatal(title, ilistSubs)
  const isContinue = true
  while (isContinue) {
    const itemSub = XList.readFirst(ilistSubs, ',')
    ilistSubs = XList.removeFirst(ilistSubs, ',')
    if (itemSub === '') return
    let canRun = false
    if (filterSub === undefined || filterSub === '') canRun = true
    else canRun = String(itemSub).indexOf(filterSub) !== -1
    if (canRun) {
      log.reMark(`Iniciando RUN-${itemSub}`)
      await DefaultSub[itemSub].sub()
      log.reMark(`Terminando RUN-${itemSub}`)
    }
  }
}

/**
 * Función principal para organizar una suite de pruebas.
 * @param {*} key Clave de suite
 * @param {*} title Título de la prueba.
 * @param {*} configs Configuraciones de ejecución.
 * @param {*} callbacks Funciones CallBacks a ejecutar durante las etapas de pruebas.
 * @returns sin retorno de valor.
 */
export const SuiteTEST = async (key, title, configs, callbacks) => {
  if (configs !== undefined) {
    ListDefaultOption[key] = configs.listDefaultOption
    ListDefaultSub[key] = configs.listDefaultSub
    ListCommon[key] = { commonHeaders: configs.commonHeaders, commonRootUrl: configs.commonRootUrl }
  }
  if (filterbySuiteTest !== undefined && filterbySuiteTest !== '') {
    const ipos = String(key).indexOf(filterbySuiteTest)
    if (ipos === -1) return
  }
  describe(title, () => {
    beforeEach(async () => {
      if (callbacks !== undefined && callbacks.beforeEach !== undefined) await callbacks.beforeEach()
    })
    before(async () => {
      if (callbacks !== undefined && callbacks.before !== undefined) await callbacks.before()
    })
    after(async () => {
      if (callbacks !== undefined && callbacks.after !== undefined) await callbacks.after()
    })
    afterEach(async () => {
      if (callbacks !== undefined && callbacks.afterEach !== undefined) await callbacks.afterEach()
    })
    callbacks.tests()
  })
}

/**
 * @param {*} method Tipo de metodo a ejecutar : GET,POST,PUT,DELETE
 * @param {*} keyTest Clave del la prueba a ejecutar..
 * @param {*} keyOption Hacer referencia al set de coonfiguraciones o opciones default que se va a ejetutar. Y estas se encuentran definidas en "listDefaultOption".
 * La sintaxis general es "{KeyOption}:{ShouldHaveStatus}".
 * Beneficios: Ayuda a reutilizar un ser de opciones que van a ser comunes en otras pruebas.
 * @param {*} testTitle Titulo del proceso
 * @param {*} options Se especifica las opciones a reemplazar. Se tiene que tomar en cuenta que en listDefaultOption, se define lo principal, y options es solo para reemplazar algúno que otra opcion.
 * run...: Clave de la subritina a ejeuctar antes del proceso principal. Las claves hacer referencia a métodos. agregados en "listDefaultSub".
 * run...: Las claves deben de empezar con "before" o "after" segun sea el orden de ejecución..
 * url...:
 * body..:
 * header:
 * query.:
 * params:
 * @param {*} callbacks
 * @returns
 */

export const itREQUEST = (method, keyTest, keyOption, testTitle, options, callbacks) => {
  // LECTURA DE LAS OPCIONES
  const ioptions = options === undefined ? {} : options

  // Extraer KeyTest y Evaluar el Filtro
  const keySUITE = String(keyTest).substring(0, 3)
  if (filterbyTest !== undefined && filterbyTest !== '') {
    const existTest = XList.existItem(filterbyTest, keyTest, ',')
    if (!existTest) return
  }
  const testDesc = `${keyTest}-${testTitle}`

  describe(keyTest, () => {
    // PASO 1. Ejecución de metodos before.
    before(async () => {
      // Definiendo las configuraciones de SuiteTest..
      const optTEST = XList.readFirst(keyOption, ':')
      const statusTEST = XList.removeFirst(keyOption, ':')
      if (optTEST !== '') DefaultOption = ListDefaultOption[keySUITE][optTEST]

      // Definicion del statusRuest
      if (statusTEST !== '') DefaultOption.shouldHaveStatus = Number(statusTEST)
      if (DefaultOption.shouldHaveStatus !== undefined && ioptions.shouldHaveStatus === undefined)
        ioptions.shouldHaveStatus = DefaultOption.shouldHaveStatus
      if (DefaultOption.url !== undefined && ioptions.url === undefined) ioptions.url = DefaultOption.url
      if (ListCommon[keySUITE].commonRootUrl !== undefined) ioptions.url = `${ListCommon[keySUITE].commonRootUrl}${ioptions.url}`
      if (DefaultOption.query !== undefined && ioptions.query === undefined) ioptions.query = DefaultOption.query
      if (DefaultOption.body !== undefined && ioptions.body === undefined) ioptions.body = DefaultOption.body
      if (ListCommon[keySUITE].commonHeaders !== undefined && DefaultOption.listHeaders === undefined)
        DefaultOption.listHeaders = ListCommon[keySUITE].commonHeaders
      if (DefaultOption.listHeaders !== undefined && ioptions.listHeaders === undefined) ioptions.listHeaders = DefaultOption.listHeaders

      // Ejecicion de callbaks y runs
      if (callbacks !== undefined) {
        if (callbacks.before !== undefined) await callbacks.before()
      }

      if (ioptions !== undefined) {
        // El especificar before, se asegura que el elemeto a ejecutar sea el previo.
        if (ioptions.run !== undefined) await runSubsFromList(ioptions.run, 'before', 'Options-Run', keySUITE)
        // El especificar before, se asegura que el elemeto a ejecutar sea el previo.
        if (ioptions.runBefore !== undefined) await runSubsFromList(ioptions.runBefore, '', 'Options-RunBefore', keySUITE)
      }
    })

    // PASO 2. Ejecución de la prueba.
    it(testDesc, done => {
      let testChai = chai.request(app)
      if (method === 'post') testChai = testChai.post(ioptions.url)
      if (method === 'put') testChai = testChai.put(ioptions.url)
      if (method === 'get') testChai = testChai.get(ioptions.url)
      if (method === 'delete') testChai = testChai.delete(ioptions.url)
      if (typeof ioptions.listHeaders !== 'undefined') ioptions.listHeaders.forEach(header => testChai.set(header.name, header.value))
      if (testDesc !== undefined) testChai.set('testDesc', testDesc)
      if (ioptions.query !== undefined) testChai.query(ioptions.query)
      // eslint-disable-next-line no-param-reassign
      if (callbacks !== undefined && callbacks.send !== undefined) ioptions.body = callbacks.send()
      testChai.send(ioptions.body)
      testChai.end((err, res) => {
        if (ioptions.shouldHaveStatus !== undefined) res.should.have.status(ioptions.shouldHaveStatus)
        if (callbacks !== undefined && callbacks.end !== undefined) {
          callbacks.end(err, res)
        }
        done()
      })
    })

    // PASO 3. Ejecución de los after
    after(async () => {
      if (ioptions !== undefined) {
        // El especificar after, se asegura que el elemeto a ejecutar sea el previo.
        if (ioptions.runAfter !== undefined) await runSubsFromList(ioptions.runAfter, '', 'Options-RunAfter', keySUITE)
      }
    })
  })
}
export const IT = {
  Put: async (keyTest, keyOption, testTitle, options, callbacks) => itREQUEST('put', keyTest, keyOption, testTitle, options, callbacks),
  Post: async (keyTest, keyOption, testTitle, options, callbacks) => itREQUEST('post', keyTest, keyOption, testTitle, options, callbacks),
  Get: async (keyTest, keyOption, testTitle, options, callbacks) => itREQUEST('get', keyTest, keyOption, testTitle, options, callbacks),
  Delete: async (keyTest, keyOption, testTitle, options, callbacks) => itREQUEST('delete', keyTest, keyOption, testTitle, options, callbacks)
}
