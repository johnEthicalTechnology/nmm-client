import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { string, object, boolean, ValidationError } from 'yup'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { Box, Heading, Button } from 'grommet'
import { Trash } from 'grommet-icons'
import DeleteProfileModal from 'react-modal'
import useGetUserProfile from '../hooks/useGetUserProfile'

import logger from '../utils/logger'
import useCheckSigninStatus from '../hooks/useCheckSigninStatus'
import SignIn from './SignIn'

import DynamicForm from '../components/DynamicForm'

import { OnSubmitObject, CheckboxSchemaObj } from '../components/types'
import { FormikHelpers } from 'formik'
import { MotivationsEnum } from '../hooks/types'

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

export const DELETE_USER_PROFILE = gql`
  mutation deleteUserProfile($userProfileId: String!) {
    deleteUserProfile(userProfileId: $userProfileId) {
      id
    }
  }
`

export default function UpdateProfile() {
  const { signedIn, userProfileId } = useCheckSigninStatus()
  const { loading, error, data } = useGetUserProfile(userProfileId)
  // if (typeof data === 'undefined' || data!.me === null) {
  //   return <h1>No user profile found</h1>
  // }

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
      title: 'Challenge Goal',
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
    {
      name: 'Environment',
      value:
        data?.me !== null
          ? data?.me?.motivations.includes(MotivationsEnum.Environment)
          : false
    },
    {
      name: 'FoodSecurity',
      value:
        data?.me !== null
          ? data?.me?.motivations.includes(MotivationsEnum.FoodSecurity)
          : false
    },
    {
      name: 'AnimalWelfare',
      value:
        data?.me !== null
          ? data?.me?.motivations.includes(MotivationsEnum.AnimalWelfare)
          : false
    },
    {
      name: 'PersonalHealth',
      value:
        data?.me !== null
          ? data?.me?.motivations.includes(MotivationsEnum.PersonalHealth)
          : false
    },
    {
      name: 'challengeGoals',
      value: data?.me !== null ? data?.me?.challengeGoals : ''
    },
    { name: 'bio', value: data?.me !== null ? data?.me?.bio : '' },
    {
      name: 'challengeQuote',
      value: data?.me !== null ? data?.me?.challengeQuote : ''
    },
    { name: 'motivations', value: '' },
    { name: 'lowResProfile', value: '' },
    { name: 'standardResolution', value: '' },
    { name: 'username', value: data?.me !== null ? data?.me?.username : '' },
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
  const [DeleteUserProfile] = useMutation(DELETE_USER_PROFILE)
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
  const [deleteProfileSuccess, setDeleteProfileSuccess] = useState(false)
  const [deleteProfileFailure, setDeleteProfileFailure] = useState(false)
  const deleteUserProfile = async () => {
    try {
      const deletedUserProfile = await DeleteUserProfile({
        variables: {
          userProfileId: userProfileId
        }
      })
      console.info('User profiled deleted', deletedUserProfile)
      setDeleteProfileSuccess(true)
    } catch (error) {
      setDeleteProfileFailure(true)
      console.error(`Profile was not deleted b/c of ${error}`)
    }
  }
  function closeModal() {
    setDeleteProfileFailure(false)
    setDeleteProfileSuccess(false)
  }
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
  const modalMessage = deleteProfileSuccess
    ? 'You succeeded in deleting your user profile!'
    : deleteProfileFailure
    ? 'You failed in deleting your user profile'
    : ''

  const submitType = 'Update your profile!'
  const failMessage = 'Profile creation failed! Please try again.'
  const successMessage = 'You suceeded in creating your NMM profile. Yay!'

  if (typeof signedIn === 'undefined') return <h1>Loading...</h1>
  if (error) return <h1>Error: ${error.message}</h1>
  if (!signedIn) {
    return (
      <Box
        a11yTitle='sign in container'
        align='center'
        background='white'
        justify='center'
        margin='medium'
      >
        <h3>Sorry, you have to be signed in to update your profile!</h3>
        <SignIn />
      </Box>
    )
  }

  return (
    <Box
      a11yTitle='update profile container'
      align='center'
      background='white'
      justify='center'
      margin='medium'
    >
      <Heading a11yTitle='update profile heading'>Update your profile</Heading>
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
      <Button
        a11yTitle='delete user profile'
        data-testid='submit'
        icon={<Trash />}
        label='DELETE USER PROFILE'
        margin={{
          top: '0',
          bottom: '10px'
        }}
        onClick={() => deleteUserProfile()}
        primary={true}
        type='submit'
      />
      <DeleteProfileModal
        isOpen={deleteProfileFailure || deleteProfileSuccess}
        closeTimeoutMS={2}
        style={facebookModalCustomStyles}
        contentLabel='Fail or Success modal for deleting user profile'
        shouldCloseOnOverlayClick={true}
      >
        <button onClick={closeModal}>close</button>
        <h3>{modalMessage}</h3>
      </DeleteProfileModal>
    </Box>
  )
}
