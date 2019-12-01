import React from 'react'
import { object, string } from 'yup'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import logger from '../utils/logger'
// COMPONENTS
import DynamicForm from '../components/DynamicForm'
// TYPES
import { OnSubmitObject } from '../components/types'
import { FormikActions } from 'formik'

const CREATE_RECIPE = gql`
  mutation createRecipe($recipe: RecipeInput!) {
    createRecipe(recipe: $recipe) {
      id
      title
      method
    }
  }
`

export default function SignIn() {
  const formInput = [
    {
      type: 'text',
      name: 'title',
      errorMessageId: 'titleError',
      required: true,
      autocomplete: 'off',
      displayName: 'Title'
    },
    {
      type: 'text',
      name: 'ingredients',
      errorMessageId: 'ingredientsError',
      required: true,
      autocomplete: 'off',
      displayName: 'Ingredients',
      textArea: true,
      hintText: 'Comma separated ingredient items, please.'
    },
    {
      type: 'text',
      name: 'method',
      errorMessageId: 'methodError',
      required: true,
      autocomplete: 'off',
      displayName: 'Method',
      textArea: true,
      hintText: 'Comma separated, numbered steps please e.g. 1\) This is a step,2\) This is a step'
    },
    {
      type: 'text',
      name: 'hashtags',
      errorMessageId: 'hashtagsError',
      required: true,
      autocomplete: 'off',
      displayName: 'Hashtags',
      hintText: 'Comma separated, spaceless hashtags e.g. #hashtag1,#hashtag2,#hashTag3'
    },
    {
      type: 'text',
      name: 'name',
      errorMessageId: 'nameError',
      required: true,
      autocomplete: 'off',
      displayName: "Creator's Name"
    },
    {
      type: 'text',
      name: 'website',
      errorMessageId: 'websiteError',
      required: true,
      autocomplete: 'off',
      displayName: 'Website',
      hintText: "URL to creator's site"
    },
    {
      type: 'email',
      name: 'email',
      errorMessageId: 'emailError',
      required: true,
      autocomplete: 'off',
      displayName: 'Email'
    },
    {
      type: 'text',
      name: 'facebook',
      errorMessageId: 'facebookError',
      required: true,
      autocomplete: 'off',
      displayName: 'Facebook page or profile',
      hintText: "Full URL to creator's page or profile"
    },
    {
      type: 'text',
      name: 'instagram',
      errorMessageId: 'instagramError',
      required: true,
      autocomplete: 'off',
      displayName: 'Instagram profile',
      hintText: "Full URL to creator's page"
    },
    {
      type: 'text',
      name: 'twitter',
      errorMessageId: 'twitterError',
      required: true,
      autocomplete: 'off',
      displayName: 'Twitter profile',
      hintText: "Full URL to creator's profile"
    },
    {
      type: 'file',
      name: 'lowResolution',
      errorMessageId: 'lowResolutionError',
      required: true,
      autocomplete: 'off',
      displayName: 'Recipe Photo',
      hintText: 'One photo only please.'
    }
  ]

  const formSelect = [
    {
      name: 'difficulty',
      errorMessageId: 'difficultyError',
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

  const formInitialValues = [
    'mealType',
    'lowResolution',
    'standardResolution',
    'name',
    'title',
    'ingredients',
    'method',
    'difficulty',
    'cost',
    'hashtags',
    'website',
    'email',
    'facebook',
    'instagram',
    'twitter'
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
    lowResolution: string().required('Please upload a photo!')
  })

  const [createRecipe] = useMutation(CREATE_RECIPE)
  const onSubmit = async (
    values: OnSubmitObject,
    { resetForm, setSubmitting, setStatus }: FormikActions<OnSubmitObject>
  ) => {
    try {
      const recipe = await createRecipe({
        variables: {
          recipe: values
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

  const submitType = 'Create Recipe!'
  const failMessage = 'Recipe creation failed. You do not have to fill out values. Please press submit again!'
  const successMessage = 'Recipe creation succeeded! Yay!'

  return (
    <div>
      <p>Create your recipe!</p>
      <DynamicForm
        failMessage={failMessage}
        formInput={formInput}
        onSubmit={onSubmit}
        submitType={submitType}
        successMessage={successMessage}
        validationSchema={validationSchema}
        formSelect={formSelect}
        formInitialValues={formInitialValues}
        inputHints={true}
      />
    </div>
  )
}
