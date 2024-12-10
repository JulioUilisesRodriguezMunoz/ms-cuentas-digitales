import webpack from 'webpack'
import { LOG } from '../src/commons/log'
import webpackConfig from '../config/webpack.config'

const compiler = webpack(webpackConfig)

compiler.run((err, stats) => {
  if (err || stats.hasErrors()) {
    LOG.error('An error occurred during project packaging')
    LOG.error(stats.toJson())
  } else {
    LOG.info('The packaging of the project was successful')
  }
})
