import auth0, { Auth0Error, Auth0DecodedHash } from 'auth0-js'
import logger from './logger'

import { ISignUpArgs, SignInTypes } from './types'

const DATABASE_CONNECTION = 'Username-Password-Authentication'
const SOCIAL_MEDIA_SIGN_IN = 'facebook'

export const webAuth = new auth0.WebAuth({
  domain: process.env.APP_DOMAIN || '',
  clientID: process.env.APP_CLIENT_ID || '',
  redirectUri: process.env.REDIRECT_URL,
  responseType: 'token id_token',
  scope: 'openid profile email',
  audience: process.env.AUDIENCE
})

// TODO - fix res: any type - find out what it returns
export const signIn = (
  type: SignInTypes,
  email?: string,
  password?: string
): void | Promise<any | undefined> => {
  if (type === SignInTypes.auth0) {
    logger.log({
      level: 'INFO',
      description: `${email} address, is signing in with Auth0`
    })
    return new Promise((resolve, reject) => {
      webAuth.login(
        {
          realm: DATABASE_CONNECTION,
          email,
          password: password || ''
        },
        (error: Auth0Error | null, res: any) => {
          if (error) {
            logger.log({
              level: 'ERROR',
              description: `Auth0 Sign In Error - ${error.description}`
            })
            reject(error)
          } else {
            logger.log({
              level: 'INFO',
              description: `${res.username}, has been successfully signed in`
            })
            resolve(res)
          }
        }
      )
    })
  }

  if (type === SignInTypes.social) {
    logger.log({
      level: 'INFO',
      description: `Signing in with Facebook`
    })
    localStorage.setItem('signed_in', 'true')
    webAuth.authorize({
      connection: SOCIAL_MEDIA_SIGN_IN
    })
  }
}

export const signUp = ({ email, password }: ISignUpArgs): Promise<void> => {
  logger.log({
    level: 'INFO',
    description: `A user with ${email} address, is signing up`
  })
  return new Promise((resolve, reject) => {
    webAuth.signup(
      {
        connection: DATABASE_CONNECTION,
        email,
        password
      },
      (error: Auth0Error | null, res: any) => {
        if (error) {
          logger.log({
            level: 'ERROR',
            description: `Auth0 Sign Up Error - ${error.description}`
          })
          reject(error)
        } else {
          logger.log({
            level: 'INFO',
            description: `${res.email}, has been successfully signed up`
          })
          resolve(res)
        }
      }
    )
  })
}

export const checkSession = () => {
  logger.log({
    level: 'INFO',
    description: 'Checking if user is signed in'
  })
  return new Promise<Auth0DecodedHash | null>((resolve, reject) => {
    webAuth.checkSession(
      {},
      (error: Auth0Error | null, res: Auth0DecodedHash | null) => {
        if (error) {
          logger.log({
            level: 'ERROR',
            description: `Auth0 Sign In check Error - ${error.description}`
          })
          reject(error)
        } else {
          logger.log({
            level: 'INFO',
            description: 'Sign in check successful'
          })
          resolve(res)
        }
      }
    )
  })
}

export const parseAuthHash = () => {
  logger.log({
    level: 'INFO',
    description: 'Parsing hash'
  })
  return new Promise<Auth0DecodedHash | null>((resolve, reject) => {
    webAuth.parseHash(
      { hash: window.location.hash },
      (error: Auth0Error | null, res: Auth0DecodedHash | null) => {
        if (error) {
          logger.log({
            level: 'ERROR',
            description: `Parsing failed with error - ${error.description}`
          })
          reject(error)
        } else {
          logger.log({
            level: 'INFO',
            description: 'Parsing successful!'
          })
          resolve(res)
        }
      }
    )
  })
}

export const logout = () => {
  localStorage.setItem('signed_in', 'false')
  webAuth.logout({
    clientID: process.env.APP_CLIENT_ID || '',
    returnTo: process.env.REDIRECT_URL
  })
}
