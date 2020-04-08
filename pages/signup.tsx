import React from 'react'
import { Box, Button } from 'grommet'

import SignUp from '../containers/SignUp'

export default function SignUpPage() {
  return (
    <Box
      align='center'
      background='url(/potato-roses-with-zucchini-cropped.jpeg)'
      direction='column'
      height='100vh'
      justify='center'
      responsive={true}
    >
      <SignUp />
      <Button
        a11yTitle='go to sign up page'
        data-testid='button'
        hoverIndicator={{ color: 'white' }}
        href='/signin'
        label='SIGN IN'
        margin='medium'
        primary={true}
        type='button'
      />
    </Box>
  )
}
