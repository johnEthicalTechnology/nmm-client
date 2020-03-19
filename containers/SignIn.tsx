import React, { useState } from 'react'
import { object, string } from 'yup'
import { FormikHelpers } from 'formik'
import { Button, Box, Image } from 'grommet'
import FacebookSignInFailModal from 'react-modal'

import { signIn } from '../utils/auth'
import DynamicForm from '../components/DynamicForm'

import { OnSubmitObject } from '../components/types'
import { SignInTypes } from '../utils/types'

export default function SignIn() {
  const formInput = [
    {
      type: 'email',
      name: 'email',
      errorMessageId: 'emailError',
      required: true,
      autocomplete: 'on',
      displayName: 'Email'
    },
    {
      type: 'password',
      name: 'password',
      errorMessageId: 'passwordError',
      required: true,
      autocomplete: 'off',
      displayName: 'Password'
    }
  ]

  const validationSchema = object().shape({
    email: string()
      .email('Invalid email!')
      .required('Please enter your email!'),
    password: string()
      .min(10, 'Too short!')
      .required('Please enter your password!')
  })

  const onSubmit = async (
    values: OnSubmitObject,
    { resetForm, setStatus, setSubmitting }: FormikHelpers<OnSubmitObject>
  ) => {
    try {
      localStorage.setItem('signed_in', 'true')
      await signIn(SignInTypes.auth0, values.email, values.password)
    } catch (_) {
      localStorage.setItem('signed_in', 'false')
      resetForm()
      setStatus({ openModal: true, success: false })
      setSubmitting(false)
    }
  }

  const submitType = 'SIGN IN'
  const failMessage = 'Failed to Sign In. Please try again!'
  const successMessage = 'You signed in onward to awesomeness! Yay!'
  const a11yTitle = 'Button to submit sign in credentials'

  const formInitialValues = [
    { name: 'email', value: '' },
    { name: 'password', value: '' }
  ]

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

  return (
    <Box
      a11yTitle='sign in card'
      align='center'
      background='white'
      border={true}
      elevation='small'
      flex={false}
      gridArea='middlemiddle'
      justify='center'
      responsive={true}
      round='xsmall'
      width='medium'
    >
      <Box height='small' width='small' round='full'>
        <Image
          a11yTitle='no meat may logo'
          src='/circle-NMM.png'
          fit='contain'
        />
      </Box>
      <DynamicForm
        failMessage={failMessage}
        formInput={formInput}
        onSubmit={onSubmit}
        submitType={submitType}
        successMessage={successMessage}
        validationSchema={validationSchema}
        formInitialValues={formInitialValues}
        a11yTitle={a11yTitle}
      />
      <Button
        a11yTitle='Submit Facebook sign in credentials'
        color='red'
        data-testid='submit'
        hoverIndicator={true}
        label='FACEBOOK SIGN IN'
        margin={{
          top: '0',
          bottom: '30px'
        }}
        onClick={() => facebookSignIn}
        primary={true}
        type='submit'
      />
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
    </Box>
  )
}
