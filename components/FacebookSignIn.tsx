import React, { useState } from 'react'
import { Button, Paragraph } from 'grommet'
import { Facebook } from 'grommet-icons'
import FacebookSignInFailModal from 'react-modal'
import { signIn } from '../utils/auth'

import { SignInTypes } from '../utils/types'

export default function FacebookSignIn() {
  // N.B. - Facebook sign-in
  // TODO - fix styles
  const facebookModalCustomStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)'
    }
  }
  const [facebookSignInModalState, setFacebookSignInModalState] = useState(
    false
  )
  function closeModal() {
    setFacebookSignInModalState(false)
  }
  const facebookSignIn = () => {
    try {
      signIn(SignInTypes.social)
    } catch (error) {
      localStorage.setItem('signed_in', 'false')
      setFacebookSignInModalState(true)
    }
  }

  const failMessage = 'Failed to Sign In. Please try again!'

  return (
    <>
      <Button
        a11yTitle='Submit Facebook sign in credentials'
        color='#4267B2'
        data-testid='submit'
        icon={<Facebook />}
        label='CONTINUE WITH FACEBOOK'
        margin={{
          top: '0',
          bottom: '10px'
        }}
        onClick={() => facebookSignIn()}
        primary={true}
        type='submit'
      />
      <Paragraph
        a11yTitle='facebook reassurance'
        margin={{
          top: '0',
          bottom: '20px'
        }}
        size='small'
        textAlign='center'
      >
        We won't post anything to Facebook without your permission.
      </Paragraph>
      <FacebookSignInFailModal
        isOpen={facebookSignInModalState}
        closeTimeoutMS={2}
        style={facebookModalCustomStyles}
        contentLabel={failMessage}
        shouldCloseOnOverlayClick={true}
      >
        <button onClick={closeModal}>close</button>
        <h3>{failMessage}</h3>
      </FacebookSignInFailModal>
    </>
  )
}
