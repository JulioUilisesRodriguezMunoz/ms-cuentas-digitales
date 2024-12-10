export const GLOBAL_CONSTANTS = {
  EP_PREFIX: process.env.EP_PREFIX || 'experiencia-prendaria',
  CIRCUIT_BREAKER: {
    THRESHOLD: process.env.CB_THRESHOLD || 0.7,
    CIRCUIT_DURATION: process.env.CB_CIRCUIT_DURATION || 180000,
    WAIT_THRESHOLD: process.env.CB_WAIT_THRESHOLD || 10000,
    HEALTH_CHECK_INTERVAL: process.env.CB_HEALTH_CHECK_INTERVAL || 60000
  }
}
