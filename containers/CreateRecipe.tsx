import React from 'react'
import { object, string } from 'yup'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import logger from '../utils/logger'
// COMPONENTS
import DynamicForm from '../components/DynamicForm'
// TYPES
import { OnSubmitObject } from '../components/types'
import { FormikHelpers } from 'formik'

const CREATE_RECIPE = gql`
  mutation createRecipe($recipe: RecipeInput!, $createSecret: String!) {
    createRecipe(recipe: $recipe, createSecret: $createSecret) {
      id
      title
      method
    }
  }
`

export default function CreateRecipe() {
  const formInput = [
    {
      type: 'text',
      name: 'title',
      errorMessageId: 'titleError',
      required: true,
      autocomplete: 'off',
      displayName: 'Recipe Title',
      hintText: 'The name of the recipe.'
    },
    {
      type: 'text',
      name: 'ingredients',
      errorMessageId: 'ingredientsError',
      required: true,
      autocomplete: 'off',
      displayName: 'Ingredients',
      textArea: true,
      hintText: 'Add one ingredient per input box.',
      fieldArray: true
    },
    {
      type: 'text',
      name: 'method',
      errorMessageId: 'methodError',
      required: true,
      autocomplete: 'off',
      displayName: 'Method',
      textArea: true,
      hintText:
        'Add one numbered method per input box e.g. 1) step one in recipe',
      fieldArray: true
    },
    {
      type: 'text',
      name: 'hashtags',
      errorMessageId: 'hashtagsError',
      required: true,
      autocomplete: 'off',
      displayName: 'Hashtags',
      hintText: 'Add one hashtag per input box e.g. #hashtag',
      fieldArray: true
    },
    {
      type: 'file',
      name: 'lowResolution',
      errorMessageId: 'lowResolutionError',
      required: true,
      autocomplete: 'off',
      displayName: 'Recipe Photo',
      hintText: 'One photo only please.'
    },
    {
      type: 'text',
      name: 'name',
      errorMessageId: 'nameError',
      required: true,
      autocomplete: 'off',
      displayName: "Creator's Name",
      hintText: 'What name the creator goes by.'
    },
    {
      type: 'text',
      name: 'website',
      errorMessageId: 'websiteError',
      required: true,
      autocomplete: 'off',
      displayName: 'Website',
      hintText: "URL to creator's site."
    },
    {
      type: 'email',
      name: 'email',
      errorMessageId: 'emailError',
      required: true,
      autocomplete: 'off',
      displayName: 'Email',
      hintText: "The creator's email address."
    },
    {
      type: 'text',
      name: 'videoUrl',
      errorMessageId: 'videoUrlError',
      required: false,
      autocomplete: 'off',
      displayName: 'Optional - URL for video',
      hintText: 'The full URL for the youtube video'
    },
    {
      type: 'text',
      name: 'facebook',
      errorMessageId: 'facebookError',
      required: false,
      autocomplete: 'off',
      displayName: 'Optional - Facebook page or profile',
      hintText: "Full URL to creator's page or profile."
    },
    {
      type: 'text',
      name: 'instagram',
      errorMessageId: 'instagramError',
      required: false,
      autocomplete: 'off',
      displayName: 'Optional - Instagram profile',
      hintText: "Full URL to creator's page."
    },
    {
      type: 'text',
      name: 'twitter',
      errorMessageId: 'twitterError',
      required: false,
      autocomplete: 'off',
      displayName: 'Optional - Twitter profile',
      hintText: "Full URL to creator's profile."
    },
    {
      type: 'password',
      name: 'createSecret',
      errorMessageId: 'createSecretError',
      required: true,
      autocomplete: 'off',
      displayName: 'Create Secret',
      hintText: 'The secret needed to create a recipe!'
    }
  ]

  const formSelect = [
    {
      name: 'difficulty',
      errorMessageId: 'difficultyError',
      title: 'How difficult is the recipe?',
      options: [
        {
          value: '',
          displayName: 'Please choose an DIFFICULTY LEVEL from the menu'
        },
        {
          value: 'Easy',
          displayName: 'Easy'
        },
        {
          value: 'Medium',
          displayName: 'Medium'
        },
        {
          value: 'Hard',
          displayName: 'Hard'
        }
      ]
    },
    {
      name: 'cost',
      errorMessageId: 'costError',
      title: 'How costly is the recipe?',
      options: [
        {
          value: '',
          displayName: 'Please choose an COST from the menu'
        },
        {
          value: 'Budget',
          displayName: 'Budget'
        },
        {
          value: 'Moderate',
          displayName: 'Moderate'
        },
        {
          value: 'Expensive',
          displayName: 'Expensive'
        }
      ]
    },
    {
      name: 'mealType',
      errorMessageId: 'mealTypeError',
      title: 'What meal type is it?',
      options: [
        {
          value: '',
          displayName: 'Please choose a MEAL TYPE level from the menu'
        },
        {
          value: 'Breakfast',
          displayName: 'Breakfast'
        },
        {
          value: 'Lunch',
          displayName: 'Lunch'
        },
        {
          value: 'Dinner',
          displayName: 'Dinner'
        },
        {
          value: 'Snack',
          displayName: 'Snack'
        }
      ]
    }
  ]

  /**
   * @remark used for create-recipe b/c one photo is made sent to cloudinary
   * to return a low & standard resolution size. All the inputs in
   * formInitialvalues are sent to the lambda.
   */
  const formInitialValues = [
    { name: 'ingredients', value: [''] },
    { name: 'method', value: [''] },
    { name: 'hashtags', value: [''] },
    { name: 'mealType', value: '' },
    { name: 'lowResolution', value: '' },
    { name: 'standardResolution', value: '' },
    { name: 'name', value: '' },
    { name: 'title', value: '' },
    { name: 'difficulty', value: '' },
    { name: 'cost', value: '' },
    { name: 'website', value: '' },
    { name: 'email', value: '' },
    { name: 'facebook', value: '' },
    { name: 'instagram', value: '' },
    { name: 'twitter', value: '' },
    { name: 'createSecret', value: '' },
    { name: 'videoUrl', value: '' }
  ]

  const validationSchema = object().shape({
    email: string()
      .email('Invalid email!')
      .required("Please enter the creators's email!"),
    title: string().required('Please enter the title!'),
    ingredients: string().required('Please enter the ingredients!'),
    method: string().required('Please enter the method!'),
    hashtags: string().required('Please enter the hashtags!'),
    name: string().required("Please enter the creator's name!"),
    website: string().required("Please enter the creator's website!"),
    cost: string().required('Please select cost!'),
    mealType: string().required('Please select meal type!'),
    difficulty: string().required('Please select difficulty!'),
    lowResolution: string().required('Please upload a photo!'),
    createSecret: string().required(
      'You need the create secret to create a recipe!'
    )
  })

  const [createRecipe] = useMutation(CREATE_RECIPE)
  const onSubmit = async (
    values: OnSubmitObject,
    { resetForm, setSubmitting, setStatus }: FormikHelpers<OnSubmitObject>
  ) => {
    try {
      const createSecret = values.createSecret
      delete values.createSecret
      const recipe = await createRecipe({
        variables: {
          recipe: values,
          createSecret
        }
      })
      resetForm()
      setStatus({ openModal: true, success: true })
      logger.log({
        level: 'INFO',
        description: `Recipe ${recipe.data.createRecipe.id} with title ${recipe.data.createRecipe.title} succeeded in being created!`
      })
    } catch (err) {
      logger.log({
        level: 'ERROR',
        description: err
      })
      setStatus({ openModal: true, success: false })
      setSubmitting(false)
    }
  }

  const submitType = 'CREATE RECIPE!'
  const failMessage =
    'Recipe creation failed. You do not have to fill out values. Please press submit again!'
  const successMessage = 'Recipe creation succeeded! Yay!'

  return (
    <div>
      <h3>
        Add a recipe to the database by filling in the form below and pressing
        submit.
      </h3>
      <p>Every input required, unless stated otherwise.</p>
      <hr />
      <DynamicForm
        failMessage={failMessage}
        formInput={formInput}
        onSubmit={onSubmit}
        submitType={submitType}
        successMessage={successMessage}
        validationSchema={validationSchema}
        formSelect={formSelect}
        formInitialValues={formInitialValues}
      />
    </div>
  )
}
