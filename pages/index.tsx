import React, { useEffect } from 'react'
import Router from 'next/router'
import { useApolloClient } from '@apollo/react-hooks'
import Link from 'next/link'
import { Box, Button } from 'grommet'

import { parseAuthHash } from '../utils/auth'
import logger from '../utils/logger'
import { isServer } from '../utils/misc'

/**
 * @remark this page will show links to recipes, profile, etc
 */
export default function Home() {
  const apolloClient = useApolloClient()

  useEffect(() => {
    async function parsingAuthHash() {
      const signedIn = localStorage.getItem('signed_in')
      /**
       * @remark this will only run
       */
      if (!isServer() && window.location.hash && signedIn == 'true') {
        try {
          const authResult = await parseAuthHash()
          if (authResult) {
            const userData = authResult.idTokenPayload
            logger.log({
              level: 'INFO',
              description: 'Index - writing access token to cache.'
            })
            apolloClient.writeData({
              data: {
                accessToken: authResult.accessToken
              }
            })

            const FIRST_TIME_SIGNIN = 1
            const isFirstTimeLogin =
              userData[`${process.env.CLIENT_URL}/login_count`] ==
              FIRST_TIME_SIGNIN
            if (isFirstTimeLogin) {
              logger.log({
                level: 'INFO',
                description: 'Index - redirect to create profile.'
              })
              Router.push({
                pathname: '/create-profile',
                query: {
                  userId: userData.sub
                }
              })
            } else {
              logger.log({
                level: 'INFO',
                description: 'Index - redirect to another page.'
              })
              Router.push({
                pathname: '/',
                query: {
                  userId: userData.sub
                }
              })
              // TODO - send to recipe index page or last page user was on
            }
          }
        } catch (_) {
          localStorage.setItem('signed_in', 'false')
        }
      }
    }
    parsingAuthHash()
  }, [apolloClient])

  if (!isServer() && window.location.hash) return <h1>Redirecting...</h1>

  return (
    <Box
      align='center'
      direction='column'
      height='100vh'
      justify='center'
      responsive={true}
    >
      <h1>Welcome to the No Meat May App</h1>
      <Button
        a11yTitle='go to sign up page'
        color='red'
        data-testid='button'
        hoverIndicator={{ color: 'white' }}
        href='/recipes-by-meal'
        label='RECIPES'
        margin='medium'
        primary={true}
        type='button'
      />
      <Button
        a11yTitle='go to sign in page'
        color='red'
        data-testid='button'
        hoverIndicator={{ color: 'white' }}
        href='/signin'
        label='SIGN IN'
        margin='medium'
        primary={true}
        type='button'
      />
      <Button
        a11yTitle='go to sign home page'
        color='red'
        data-testid='button'
        hoverIndicator={{ color: 'white' }}
        href='/home'
        label='HOME'
        margin='medium'
        primary={true}
        type='button'
      />
    </Box>
  )
}
