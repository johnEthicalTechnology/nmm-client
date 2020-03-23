import React from 'react'
import { Box } from 'grommet'
import { Home, Cafeteria, Accessibility, Logout, Login } from 'grommet-icons'

import { logout } from '../utils/auth'
import { AnchorStyled } from './sharedStyledComponents/anchors'
import useCheckSigninStatus from '../hooks/useCheckSigninStatus'

export default function Navigation({ page }: { page: string }) {
  // Custom hooks
  const { signedIn } = useCheckSigninStatus()
  if (page == 'SignInPage' || page == 'SignUpPage') return null
  return (
    <Box
      a11yTitle='navigation bar'
      as='nav'
      background='red'
      basis='medium'
      direction='row-responsive'
      justify='between'
      responsive={true}
    >
      <AnchorStyled
        a11yTitle='link to index page'
        href='/index'
        icon={<Home color='white' />}
        label='Home'
      />
      <AnchorStyled
        a11yTitle='link to the recipes page'
        href='/recipes-by-meal'
        icon={<Cafeteria color='white' />}
        label='Recipes'
      />
      {signedIn ? (
        <>
          <AnchorStyled
            a11yTitle='link to the profile page'
            href='/profile'
            icon={<Accessibility color='white' />}
            label='Profile'
          />
          <AnchorStyled
            a11yTitle='logout'
            icon={<Logout color='white' />}
            onClick={() => logout()}
            label='Logout'
          />
        </>
      ) : (
        <AnchorStyled
          a11yTitle='signin'
          icon={<Login color='white' />}
          href='/signin'
          label='Sign In'
        />
      )}
    </Box>
  )
}
