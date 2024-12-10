const sonarqubeScanner = require('sonarqube-scanner')

sonarqubeScanner(
  {
    serverUrl: process.env.SONAR_HOST_URL,
    options: {
      'sonar.projectKey': process.env.SONAR_PROJECT_KEY,
      'sonar.projectName': process.env.SONAR_PROJECT_NAME,
      'sonar.projectVersion': '1.0.0',
      'sonar.sources': 'src',
      'sonar.login': process.env.SONAR_PROJECT_LOGIN,
      'sonar.sourceEncoding': 'UTF-8',
      'sonar.javascript.lcov.reportPaths': './coverage/lcov.info',
      'sonar.inclusions': 'src/**',
      'sonar.javascript.ecmascript': '12',
      'sonar.exclusions': '**/flow-typed/**,**/node_modules/**,**/config/**,**/__mocks__/**'
    }
  },
  () => {}
)
