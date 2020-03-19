import React from 'react'
import { object, string } from 'yup'
import { Box, Image } from 'grommet'
import { signUp } from '../utils/auth'

import DynamicForm from '../components/DynamicForm'

import { FormikHelpers } from 'formik'
import { OnSubmitObject } from '../components/types'

export default function SignIn() {
  const formInput = [
    {
      type: 'email',
      name: 'email',
      errorMessageId: 'emailError',
      required: false,
      autocomplete: 'on',
      displayName: 'Email'
    },
    {
      type: 'password',
      name: 'password',
      errorMessageId: 'passwordError',
      required: false,
      autocomplete: 'off',
      displayName: 'Password'
    }
  ]
  
  const PASSWORD_REGEX = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])([^\s]){10,16}$/
  const validationSchema = object().shape({
    email: string()
      .email('Invalid email!')
      .trim()
      .required('Please enter an email!'),
    password: string()
      .min(10, 'Too short!')
      .matches(
        PASSWORD_REGEX,
        'Password must be at least 10 characters long with one (1) upper case, one (1) lower case, and one(1) special character(!@#$%^&*)'
      )
      .trim()
      .required('Please enter a password!')
  })

  const onSubmit = (
    values: OnSubmitObject,
    { resetForm, setSubmitting, setStatus }: FormikHelpers<OnSubmitObject>
  ) => {
    try {
      signUp({
        email: values.email,
        password: values.password
      })
      resetForm()
      setStatus({ openModal: true, success: true })
    } catch (error) {
      resetForm()
      setStatus({ openModal: true, success: false })
      setSubmitting(false)
    }
  }

  const submitType = 'SIGN UP'
  const failMessage = 'Sign Up failed! Please try again!'
  const successMessage =
    'You suceeded in Signing Up! Yay! We have sent you an email to confirm your email address.'
  const a11yTitle = 'Sign up submission button'

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
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        submitType={submitType}
        successMessage={successMessage}
        formInitialValues={formInitialValues}
        a11yTitle={a11yTitle}
      />
    </Box>
  )
}
