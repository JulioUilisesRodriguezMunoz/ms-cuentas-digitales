import rimraf from 'rimraf'
import { LOG } from '../src/commons/log'

rimraf('./dist', error => {
  if (error) {
    LOG.error('An error occurred while cleaning the distribution directory')
    LOG.error(error)
  } else {
    LOG.info('The distribution directory was successfully removed')
  }
})
