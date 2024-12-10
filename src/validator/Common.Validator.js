/**
 * Valida si un correo electrónico es valido.
 * @param {*} email correo electrónico a validar.
 * @returns True, si el email es valido.
 */
function validateEmail(email) {
  const emailRegexp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  return emailRegexp.test(email)
}

export const CommonValidator = {
  validateEmail
}
