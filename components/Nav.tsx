import React from 'react'
import { Box, Anchor } from 'grommet'
import { Home, Cafeteria, Accessibility, Logout, Login } from 'grommet-icons'

import { logout } from '../utils/auth'
import useCheckSigninStatus from '../hooks/useCheckSigninStatus'
import useGetUserProfile from '../hooks/useGetUserProfile'

export default function Navigation({ page }: { page: string }) {
  // Custom hooks
  const { signedIn, userProfileId } = useCheckSigninStatus()
  const { loading, error, data } = useGetUserProfile(userProfileId)
  if (page == 'SignInPage' || page == 'SignUpPage') return null
  return (
    <Box
      a11yTitle='navigation bar'
      as='nav'
      background='#002E5D'
      basis='medium'
      direction='row-responsive'
      justify='between'
      responsive={true}
    >
      <Anchor
        a11yTitle='link to index page'
        href='/index'
        icon={<Home color='white' />}
        label='Home'
        className='impactFont'
      />
      <Anchor
        a11yTitle='link to the recipes page'
        href='/recipes-by-meal'
        icon={<Cafeteria color='white' />}
        label='Recipes'
        className='impactFont'
      />
      {signedIn ? (
        <>
          <Anchor
            a11yTitle='link to the profile page'
            href='/profile'
            icon={<Accessibility color='white' />}
            label='Profile'
            className='impactFont'
          />
          <Anchor
            a11yTitle='logout'
            icon={<Logout color='white' />}
            onClick={() => logout()}
            label='Logout'
            className='impactFont'
          />
        </>
      ) : (
        <Anchor
          a11yTitle='signin'
          icon={<Login color='white' />}
          href='/signin'
          label='Sign In'
          className='impactFont'
        />
      )}
    </Box>
  )
}
