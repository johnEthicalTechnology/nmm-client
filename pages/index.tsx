import React, { useEffect } from 'react'
import Router from 'next/router'
import { useApolloClient } from '@apollo/react-hooks'
import { Grid, Box, Button, Paragraph, Heading, Image } from 'grommet'

import { parseAuthHash } from '../utils/auth'
import logger from '../utils/logger'
import { isServer } from '../utils/misc'
import FacebookSignIn from '../components/FacebookSignIn'

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
              userData[`${process.env.CLIENT_URL}login_count`] ==
              FIRST_TIME_SIGNIN
            if (isFirstTimeLogin) {
              logger.log({
                level: 'INFO',
                description: 'Index - redirect to create profile.'
              })
              Router.push({
                pathname: '/update-profile',
                query: {
                  userId: userData.sub
                }
              })
            } else {
              logger.log({
                level: 'INFO',
                description: 'Index - redirect to home page.'
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
    <>
      <Grid
        a11yTitle='grid container for hero content'
        as='main'
        rows={[
          ['100px', '1fr'],
          ['100px', '1fr'],
          ['100px', '1fr']
        ]}
        columns={[
          ['150px', '1fr'],
          ['150px', '1fr']
        ]}
        areas={[
          { name: 'header', start: [0, 0], end: [1, 0] },
          { name: 'sidepic', start: [0, 1], end: [0, 2] },
          { name: 'content-intro', start: [1, 1], end: [1, 1] },
          { name: 'content-action', start: [1, 2], end: [1, 2] }
        ]}
        justifyContent='center'
      >
        <Box a11yTitle='container for header image in grid' gridArea='header'>
          <Image
            a11yTitle='header image of 5 people with vegetables and no meat may title'
            src='/heroImage.png'
            fit='contain'
            className='width-100'
          />
        </Box>
        <Box
          a11yTitle='container for side image'
          gridArea='sidepic'
          direction='row'
        >
          <Image
            a11yTitle='side image of cute piglet'
            src='/piggy.png'
            fit='contain'
            className='width-100'
          />
        </Box>
        <Box justify='center' gridArea='content-intro'>
          <Heading className='impactFont' level='2' textAlign='center'>
            Welcome to the No Meat May App
          </Heading>
          <Paragraph alignSelf='center'>
            We're trying something new here at No Meat May. We heard about this
            app thingy and decided to give it a go.
          </Paragraph>
          <Paragraph alignSelf='center'>
            But it's our first time. And, unfortnately, as <i>volunteers</i> we
            have limited time and resources so this is an experimental app - a
            work in progress! Ain't we all!?
          </Paragraph>
          <Paragraph alignSelf='center'>
            So why use it? Well, we'll be offering recipes to <i>anyone</i>,
            just go to the recipes link above and you'll get a random selection
            of 3 recipes for each meal of the day.
          </Paragraph>
          <Paragraph alignSelf='center'>
            But if you sign up you'll get access to all the recipes. There's
            over 100! There's two ways to sign up, through Facebook or
            registering through the app.
          </Paragraph>
        </Box>
        <Box align='center' justify='center' gridArea='content-action'>
          <Heading
            className='impactFont'
            level='3'
            textAlign='center'
            margin='xsmall'
          >
            Option 1 - Full Recipe Access & Sharing
          </Heading>
          <Paragraph alignSelf='center'>
            By signing up through Facebook, you'll get access to over{' '}
            <i>100 recipes</i> but also the ability to share the recipes on your
            Facebook wall and share a photo of your creation in the No Meat May
            group.
          </Paragraph>
          <FacebookSignIn />
          <Heading
            className='impactFont'
            level='3'
            textAlign='center'
            margin='xsmall'
          >
            Option 2 - Full Recipe Access
          </Heading>
          <Paragraph alignSelf='center'>
            Of course, not everyone to get Facebook involved so you can just
            sign up through the app itself. You'll still get access to{' '}
            <i>100 recipes</i> but won't be able to share them on Facebook.
          </Paragraph>
          <Button
            a11yTitle='go to sign up page'
            data-testid='button'
            hoverIndicator={{ color: 'white' }}
            href='/signup'
            label='SIGN UP'
            margin='small'
            primary={true}
            type='button'
          />
        </Box>
      </Grid>
    </>
  )
}
