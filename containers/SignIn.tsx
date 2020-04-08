import React, { useState } from 'react'
import { object, string } from 'yup'
import { FormikHelpers } from 'formik'
import { Box, Image } from 'grommet'

import { signIn } from '../utils/auth'
import DynamicForm from '../components/DynamicForm'

import { OnSubmitObject } from '../components/types'
import { SignInTypes } from '../utils/types'
import FacebookSignIn from '../components/FacebookSignIn'

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
      .min(8, 'Too short!')
      .required('Please enter your password!')
  })
  const [failMessage, setFailMessage] = useState('')
  const onSubmit = async (
    values: OnSubmitObject,
    { resetForm, setStatus, setSubmitting }: FormikHelpers<OnSubmitObject>
  ) => {
    try {
      localStorage.setItem('signed_in', 'true')
      await signIn(SignInTypes.auth0, values.email, values.password)
    } catch (err) {
      setFailMessage(`${err.description} Maybe you haven't Signed Up?`)
      localStorage.setItem('signed_in', 'false')
      resetForm()
      setStatus({
        openModal: true,
        success: false,
        errorMessage: err.description
      })
      setSubmitting(false)
    }
  }

  const submitType = 'SIGN IN'
  const successMessage = 'You signed in onward to awesomeness! Yay!'
  const a11yTitle = 'Button to submit sign in credentials'

  const formInitialValues = [
    { name: 'email', value: '' },
    { name: 'password', value: '' }
  ]

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
      margin={{
        top: '120px'
      }}
      responsive={true}
      round='xsmall'
      width='medium'
    >
      <Box height='small' width='small' round='full'>
        <Image
          aria-label='no meat may logo'
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
      <FacebookSignIn />
    </Box>
  )
}
