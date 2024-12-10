# MS CUENTAS DIGITALES ( MS_CUENTAS_DIGITALES )

Este API se encarga de definir las operaciones relacionadas con la gestión de las cuentas digitales de Nacional Monte de Piedad.

## Capacidades :books:

- Gestión de Cuentas digitales
- Generación de código OPT

## Repositorio 🚀

_En caso de necesitar realizar cambios en el código, solicitar acceso a la siguiente ubicación del repositorio en GIT_

https://github.com/MontePiedadMx/MS_Cuentas_Digitales

Ver la sección **Despliegue** para conocer cómo desplegar el proyecto.

### Pre-requisitos :bookmark_tabs:

_Es necesario tener las siguientes herramientas_

- node versión 14.15.0 o superior
- node package manager versión 6.4.1 o superior

verificar con los siguientes comandos:

```
node --version
```

Y también

```
npm --version
```

### Variables de entorno :clipboard:

Para los diferentes ambientes es necesario especificar las urls a redireccionar

```
NODE_ENV: Ambiente en donde se despliega la aplicación [ LOCAL ,DEV , TEST, PROD ]
CONTEXT_NAME: Contexto del API [api]/[cuentadigital]
CONTEXT_VERSION: Versión del API
LOG_LEVEL: Nivel del Log para la escritura de las Trazas
URI: URL de conexión a la Base de Datos MongoDB
URL_OAUTH_VALIDATOR: URL para validar autenticación
ACTIVACION_BLOQUEO_REINTENTOS: Número de reintentos para el bloqueo
ACTIVACION_EVENTOS_TIMETOLIVE: Tiempo de vida de los eventos generados
OTP_DURACION_SEGUNDOS: Tiempo valido del código OTP 
OTP_SECRETO: Secuencia de caracter secreta para la generacíón del OTP
OTP_DIGITOS: Número de digitos del código OTP
SSL_SELF_SIGNED: Certificar la conexión SSL
```

Solo para desarrollo
```
MONGO_URL: url de la conexión a mongo
SSL_SELF_SIGNED: Certificar la conexión SSL false
```

Para análisis de pruebas Sonar

```
SONAR_HOST_URL: URL del Sonarqube
SONAR_PROJECT_NAME=Project name del proyecto
SONAR_PROJECT_KEY: Project key del proyecto
SONAR_PROJECT_LOGIN: Login generado para este proyecto
```

Para la API de comunicaciones
```
URL_API_COMUNICACIONES: URL para la conexión con el API de comunicaciones para el envió de SMS y EMAILs
TEMPLATE_API_COMUNICACIONES_SMS: ID de template que se utiliza para el envío de SMS para verificación del código OPT
TEMPLATE_API_COMUNICACIONES_EMAIL: ID de template que se utiliza para el envío del EMAIL para verificación del código OPT
EMAIL_REMITENTE: EMAIL del remitente que envía los correos 
```

Integración con el Elasticsearch
```
ELK_HOST: URL para la conexión del elasticsearch
ELK_TIMEOUT: Tiempo de espera en milisegundos
ELK_LOGGER_LEVEL: Nivel del logger
ELK_API_VERSION: Versión del API elasticsearch
ELK_CREDENTIAL_USER: Usuario para la conexión
ELK_CREDENTIAL_PASSWORD: Password para la conexión
ELK_INDEX_CLIENTEMONTE: Índice para almacenar los token del cliente mi monte en elasticsearch
```

### Instalación :wrench:

_Instalación de los paquetes necesarios para despliegue y pruebas_

```
npm install
```

## Ejecutando las pruebas ⚙️

_Para la ejecución de las pruebas, no es nesaria la instalacción de otra herramienta diferentes a las instaladas en la **Instalación**, ejecutar_

```
npm run test
npm run test:mongodb
npm run test:ctrl
npm run test:service
npm run test:dao
```

### Análisis del código :nut_and_bolt:

_Para la ejecución del análisis del código, no es nesaria la instalacción de otra herramienta diferentes a las instaladas en la **Instalación**, ejecutar_

```
npm run sonar
```

## Despliegue :package:

_Para el despliegue, basta con ejecutar la sentencia_

```
npm start
```

## Documentación para consumo :book:

Para el consumo de servicios sobre el manejo PENDIENTE

## CD/CI

Para CD/CI se hace mediante [Jenkins](http://dev1775-devops.apps.pcf.nmp.com.mx/job/dev1775-api-riesgos/) y ejecutar PASO [Manual de Instalacion]()

## Autores :black_nib:

Desarrollado para Nacional Monte de Piedad por

- [**Quarksoft**](<(https://www.quarksoft.net/)>) - [**Carlos Soto**](jsoto@quarksoft.net)

## Bitácora :heavy_check_mark:

- Versión Inicial