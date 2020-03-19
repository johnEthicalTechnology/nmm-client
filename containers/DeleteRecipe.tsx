import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import { string, object } from 'yup'
import gql from 'graphql-tag'
import logger from '../utils/logger'

import DynamicForm from '../components/DynamicForm'

import { OnSubmitObject } from '../components/types'
import { FormikHelpers } from 'formik'

const DELETE_RECIPE = gql`
  mutation DeleteRecipe(
    $deleteSecret: String!
    $recipeId: Int
    $recipeTitle: String
  ) {
    deleteRecipe(
      deleteSecret: $deleteSecret
      recipeId: $recipeId
      recipeTitle: $recipeTitle
    ) {
      id
      title
    }
  }
`

export default function DeleteRecipe() {
  const formInput = [
    {
      type: 'text',
      name: 'recipeTitle',
      errorMessageId: 'recipeTitleError',
      required: true,
      autocomplete: 'on',
      displayName: 'Recipe Title',
      hintText: 'Just the full title of the recipe'
    },
    {
      type: 'password',
      name: 'deleteSecret',
      errorMessageId: 'deleteSecretError',
      required: true,
      autocomplete: 'off',
      displayName: 'Delete Secret',
      hintText: 'Ask, you know who?.'
    }
  ]

  const formInitialValues = [
    { name: 'recipeTitle', value: '' },
    { name: 'deleteSecret', value: '' }
  ]

  const validationSchema = object().shape({
    recipeTitle: string().required(
      'We need to know the title of the recipe so we can find and delete it!'
    ),
    deleteSecret: string().required(
      'To be authorised to delete the recipe please enter the delete secret!'
    )
  })
  const submitType = 'Create your profile!'
  const failMessage = 'Sorry the recipe was not deleted try again!'
  const successMessage = 'You succeeded in deleted the recipe. Yay!'

  const [deleteRecipe] = useMutation(DELETE_RECIPE)
  const onSubmit = async (
    values: OnSubmitObject,
    { resetForm, setSubmitting, setStatus }: FormikHelpers<OnSubmitObject>
  ) => {
    try {
      const deletedRecipe = await deleteRecipe({
        variables: {
          recipeTitle: values.recipeTitle,
          deleteSecret: values.deleteSecret
        }
      })
      resetForm()
      setStatus({ openModal: true, success: true })
      logger.log({
        level: 'INFO',
        description: `Recipe ${deletedRecipe.data.title} has been successfully deleted!`
      })
    } catch (err) {
      logger.log({
        level: 'ERROR',
        description: err
      })
      resetForm()
      setStatus({ openModal: true, success: false })
      setSubmitting(false)
    }
  }

  return (
    <div>
      <DynamicForm
        failMessage={failMessage}
        formInput={formInput}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        submitType={submitType}
        successMessage={successMessage}
        formInitialValues={formInitialValues}
      />
    </div>
  )
}
