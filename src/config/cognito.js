// eslint-disable-next-line import/no-extraneous-dependencies
import { CognitoJwtVerifier } from 'aws-jwt-verify'

export const ClientCognito = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_OLD_POOL_ID,
  tokenUse: 'access',
  clientId: process.env.COGNITO_OLD_CLIENT_ID
})
