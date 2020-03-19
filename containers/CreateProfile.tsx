import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { string, object, boolean, ValidationError } from 'yup'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import logger from '../utils/logger'
import useCheckSigninStatus from '../hooks/useCheckSigninStatus'
import SignIn from './SignIn'

import DynamicForm from '../components/DynamicForm'

import { OnSubmitObject, CheckboxSchemaObj } from '../components/types'
import { FormikHelpers } from 'formik'

export const CREATE_OR_UPDATE_USER_PROFILE = gql`
  mutation CreateOrUpdateUserProfile($userProfileInput: UserProfileInput) {
    createOrUpdateUserProfile(userProfileInput: $userProfileInput) {
      id
      totalPoints
      username
      lowResProfile
      standardResolution
      challengeQuote
    }
  }
`

export default function CreateProfile() {
  const { signedIn, userProfileId } = useCheckSigninStatus()
  const checkboxInput = [
    {
      type: 'checkbox',
      name: 'Environment',
      errorMessageId: 'environmentError',
      required: false,
      autocomplete: 'off',
      displayName: 'Environment'
    },
    {
      type: 'checkbox',
      name: 'AnimalWelfare',
      errorMessageId: 'animalWelfareError',
      required: false,
      autocomplete: 'off',
      displayName: 'Animal Welfare'
    },
    {
      type: 'checkbox',
      name: 'PersonalHealth',
      errorMessageId: 'personalHealthError',
      required: false,
      autocomplete: 'off',
      displayName: 'Personal Health'
    },
    {
      type: 'checkbox',
      name: 'FoodSecurity',
      errorMessageId: 'foodSecurityError',
      required: false,
      autocomplete: 'off',
      displayName: 'Food Security'
    }
  ]

  const formInput = [
    {
      type: 'text',
      name: 'username',
      errorMessageId: 'usernameError',
      required: false,
      autocomplete: 'on',
      displayName: 'Username'
    },
    {
      type: 'text',
      name: 'challengeQuote',
      errorMessageId: 'challengeQuoteError',
      required: false,
      autocomplete: 'off',
      displayName: 'Challenge Quote',
      hintText: 'What is a quote you want to use to keep you inspired?'
    },
    {
      type: 'text',
      name: 'bio',
      errorMessageId: 'bioError',
      required: false,
      autocomplete: 'off',
      textArea: true,
      displayName: 'Bio',
      hintText: 'Tell us something about yourself.'
    },
    {
      checkbox: true,
      legend: 'Motivations',
      name: 'motivations',
      errorMessageId: 'motivationsError',
      checkboxInput,
      hintText: 'Please choose at least 1'
    },
    {
      type: 'file',
      name: 'lowResProfile',
      errorMessageId: 'lowResProfileError',
      required: true,
      autocomplete: 'off',
      displayName: 'Profile Photo',
      hintText: 'Upload a photo for your profile for more points!'
    },
    {
      type: 'hidden',
      name: 'id'
    }
  ]

  const formSelect = [
    {
      name: 'challengeGoals',
      errorMessageId: 'challengeGoalsError',
      title: 'How much do you want to challenge yourself?',
      options: [
        {
          value: '',
          displayName: 'How many meals per week to make?'
        },
        {
          value: '5',
          displayName: 'Five(5) meals per week'
        },
        {
          value: '10',
          displayName: 'Ten(10) meals per week'
        },
        {
          value: '15',
          displayName: 'Fifteen(15) meals per week'
        },
        {
          value: '20',
          displayName: 'Twenty(20) meals per week'
        }
      ]
    }
  ]

  const router = useRouter()
  const idForUserProfile =
    typeof router.query.userId === 'undefined'
      ? userProfileId
      : router.query.userId
  const formInitialValues = [
    { name: 'Environment', value: false },
    { name: 'FoodSecurity', value: false },
    { name: 'AnimalWelfare', value: false },
    { name: 'PersonalHealth', value: false },
    { name: 'challengeGoals', value: '' },
    { name: 'bio', value: '' },
    { name: 'challengeQuote', value: '' },
    { name: 'motivations', value: '' },
    { name: 'lowResProfile', value: '' },
    { name: 'standardResolution', value: '' },
    { name: 'username', value: '' },
    { name: 'id', value: idForUserProfile }
  ]

  let validationSchema = object().shape({
    username: string().required('Please enter a display to use in the app!'),
    challengeGoals: string().required(
      'Please select challenges goals to work towards!'
    ),
    Environment: boolean(),
    AnimalWelfare: boolean(),
    PersonalHealth: boolean(),
    FoodSecurity: boolean(),
    lowResProfile: string()
  })

  const validationSchemaExtended = validationSchema.test({
    name: 'motivationsCheckboxTest',
    test: (checkboxObj: CheckboxSchemaObj) => {
      if (
        checkboxObj.Environment ||
        checkboxObj.AnimalWelfare ||
        checkboxObj.PersonalHealth ||
        checkboxObj.FoodSecurity
      ) {
        return true
      }
      return new ValidationError(
        'Check at least one motivation please!',
        null,
        'Environment'
      )
    }
  })

  const [CreateOrUpdateUserProfile] = useMutation(CREATE_OR_UPDATE_USER_PROFILE)
  const onSubmit = async (
    values: OnSubmitObject,
    {
      resetForm,
      setSubmitting,
      setStatus,
      setFieldValue
    }: FormikHelpers<OnSubmitObject>
  ) => {
    try {
      setFieldValue('id', idForUserProfile)
      /**
       * @remark convert checkbox values to Array<string> for DB &
       * remove empty keys with no value for CalculatePoints class
       */
      let motivations: Array<string> = []
      for (const valuesProperty in values) {
        if (
          valuesProperty == 'Environment' ||
          valuesProperty == 'PersonalHealth' ||
          valuesProperty == 'FoodSecurity' ||
          valuesProperty == 'AnimalWelfare'
        ) {
          if (values[valuesProperty]) {
            motivations = motivations.concat([valuesProperty])
          }
          delete values[valuesProperty]
        }
        if (!values[valuesProperty]) delete values[valuesProperty]
        ;((values.motivations as unknown) as Array<string>) = motivations
      }

      /**
       * @remark convert form string to int for db
       */
      ;((values.challengeGoals as unknown) as number) = parseInt(
        values.challengeGoals as string,
        10
      )

      const createdProfile = await CreateOrUpdateUserProfile({
        variables: {
          userProfileInput: values
        }
      })
      resetForm()
      setStatus({ openModal: true, success: true })
      logger.log({
        level: 'INFO',
        description: `Profile ${createdProfile.data.createOrUpdateUserProfile.id} with username ${createdProfile.data.createOrUpdateUserProfile.username} succeeded in being created!`
      })
    } catch (err) {
      logger.log({
        level: 'ERROR',
        description: `Create Profile - ${err}`
      })
      setStatus({ openModal: true, success: false })
      setSubmitting(false)
    }
  }

  const submitType = 'Create your profile!'
  const failMessage = 'Profile creation failed! Please try again.'
  const successMessage = 'You suceeded in creating your NMM profile. Yay!'

  if (typeof signedIn === 'undefined') return <h1>Loading...</h1>
  if (!signedIn) {
    return (
      <div>
        <h1>
          You've got to be signed into your account to create or update your
          profile
        </h1>
        <SignIn />
      </div>
    )
  }

  return (
    <div>
      <Link href='/recipes'>
        <a>Recipes page</a>
      </Link>
      <h1>Fill it out please!</h1>
      <DynamicForm
        failMessage={failMessage}
        formInput={formInput}
        validationSchema={validationSchemaExtended}
        onSubmit={onSubmit}
        submitType={submitType}
        successMessage={successMessage}
        formSelect={formSelect}
        formInitialValues={formInitialValues}
      />
    </div>
  )
}
