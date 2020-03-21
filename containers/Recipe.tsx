import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import dynamic from 'next/dynamic'
import { withRouter, Router } from 'next/router'
import logger from '../utils/logger'
import useCheckSigninStatus from '../hooks/useCheckSigninStatus'
import { Box, Image, Heading, Button, List } from 'grommet'

import FbUserShare from '../components/FbUserShare'
import FbInitAndToken from '../containers/FbInitParent'
import UnAuthRecipeDeets from '../components/UnAuthRecipeDeets'

import {
  CreateUpdateChallengeState,
  CreateUpdateMutationValues,
  RecipeData,
  RecipeVars
} from '../containers/types'

const LiveFaceDetect = dynamic(() => import('../components/LiveFaceDetect'), {
  ssr: false
})

const GET_RECIPE = gql`
  query recipe($recipeId: ID!) {
    recipe(recipeId: $recipeId) {
      title
      ingredients
      method
      standardResolution
      difficulty
      cost
      mealType
      hashtags
      recipeAttribution {
        name
        website
        email
        facebook
        instagram
        twitter
      }
    }
  }
`

const GET_CHALLENGE = gql`
  query challenge($recipeId: ID!) {
    challenge(recipeId: $recipeId) {
      id
      sectionsCompleted
      sharedFriendsImages {
        standardResolution
        lowResSharedFriendsImage
      }
      userProfileId
      recipeId
    }
  }
`

const CREATE_UPDATE_CHALLENGE = gql`
  mutation createOrUpdateChallenge($challengeInput: ChallengeInput) {
    createOrUpdateChallenge(challengeInput: $challengeInput) {
      id
      sectionsCompleted
      sharedFriendsImages {
        standardResolution
        lowResSharedFriendsImage
      }
      userProfileId
      recipeId
    }
  }
`

const INITIAL_CREATE_UPDATE_CHALLENGE_STATE: CreateUpdateChallengeState = {
  sectionsCompleted: [],
  standardResolution: '',
  lowResSharedFriendsImage: ''
}

const Recipe = ({ router }: { router: Router }) => {
  // Parse the query
  const typedTitleId = router.query['title-id'] as string
  const recipeId = parseInt(typedTitleId.split('-')[1])
  // Custom hooks
  const { signedIn } = useCheckSigninStatus()
  // State
  const [challengeState, setChallengeState] = useState(
    INITIAL_CREATE_UPDATE_CHALLENGE_STATE
  )
  const [takePhoto, setTakePhoto] = useState(false)
  // Apollo
  const {
    loading: recipeLoading,
    error: recipeError,
    data: recipeData
  } = useQuery<RecipeData, RecipeVars>(GET_RECIPE, {
    variables: { recipeId }
  })
  const {
    error: challengeError,
    data: challengeData,
    loading: challengeLoading
  } = useQuery(GET_CHALLENGE, {
    variables: { recipeId }
  })
  const [createOrUpdateChallengeMutation] = useMutation(
    CREATE_UPDATE_CHALLENGE,
    {
      refetchQueries: [
        {
          query: GET_CHALLENGE,
          variables: { recipeId }
        }
      ]
    }
  )

  // To set the state if there's data for the challenge
  useEffect(() => {
    if (challengeError) {
      logger.log({
        level: 'ERROR',
        description: `Error querying for challenge: ${challengeError}`
      })
      return
    }
    if (challengeData == undefined || challengeData.challenge == null) return

    setChallengeState({
      sectionsCompleted: challengeData.challenge.sectionsCompleted,
      standardResolution:
        challengeData.challenge.sharedFriendsImages.standardResolution,
      lowResSharedFriendsImage:
        challengeData.challenge.sharedFriendsImages.lowResSharedFriendsImage
    })
  }, [challengeData, challengeError])

  const values: CreateUpdateMutationValues = {
    type: 'Recipe',
    difficulty: recipeData?.recipe.difficulty,
    recipeId,
    ...challengeState
  }

  async function createUpdateChallengeApi(values: any, section: string[]) {
    try {
      if (challengeState.sectionsCompleted.includes(section[0])) return

      values.sectionsCompleted = values.sectionsCompleted.concat(section)
      const challenge = await createOrUpdateChallengeMutation({
        variables: {
          challengeInput: values
        }
      })
      logger.log({
        level: 'INFO',
        description: `Challenge ${challenge.data.createOrUpdateChallenge.id} by userid in being created or updated!`
      })
      setChallengeState({
        sectionsCompleted:
          challenge.data.createOrUpdateChallenge.sectionsCompleted,
        standardResolution:
          challenge.data.createOrUpdateChallenge.sharedFriendsImages
            .standardResolution,
        lowResSharedFriendsImage:
          challengeData.challenge.sharedFriendsImages.lowResSharedFriendsImage
      })
    } catch (err) {
      logger.log({
        level: 'ERROR',
        description: `Error creating or updating challenge: ${err}`
      })
    }
  }

  function handleCreateUpdateChallengeApi(
    values: CreateUpdateMutationValues,
    section: Array<string>
  ) {
    createUpdateChallengeApi(values, section)
  }

  const ingredientsCompleted = challengeState.sectionsCompleted.includes(
    'Ingredients'
  )
  const methodCompleted = challengeState.sectionsCompleted.includes('Method')
  const sharedFriendsImageCompleted = challengeState.sectionsCompleted.includes(
    'SharedFriendsImage'
  )
  const sharedRecipeCompleted = challengeState.sectionsCompleted.includes(
    'SharedRecipe'
  )
  if (recipeLoading) return <h1>Loading...</h1>
  if (recipeData == undefined) {
    return <h1>There was an error loading the recipe. Try again!</h1>
  }
  if (recipeError != undefined && recipeError) {
    return <h1>Error! {recipeError.message}</h1>
  }
  // if (!signedIn) {
  //   return <UnAuthRecipeDeets recipe={recipeData.recipe} />
  // }
  return (
    <Box a11yTitle='recipe container' align='center' justify='center'>
      <Box a11yTitle='recipe title and image container' pad='small' width='640'>
        <Heading size='medium'>{recipeData.recipe.title}</Heading>
        <Image
          a11yTitle='recipe image'
          fit='contain'
          src={recipeData.recipe.standardResolution}
        />
      </Box>
      <Box>
        <Heading level='2'>Meal Type: {recipeData.recipe.mealType}</Heading>
        <Heading level='2'>Difficulty: {recipeData.recipe.difficulty}</Heading>
        <Heading level='2'>Budget: {recipeData.recipe.cost}</Heading>
      </Box>
      <h3>Ingredients</h3>
      {/* TODO -  1) add styling 2) make sure the non-signed in user doesn't have access to clicking on the items */}
      {ingredientsCompleted ? (
        <span>
          <p>You've completed this section!</p>
        </span>
      ) : (
        <Box
          a11yTitle='recipe ingredient container'
          align='center'
          border={{
            size: 'xsmall',
            side: 'vertical'
          }}
          justify='center'
          onClick={() =>
            handleCreateUpdateChallengeApi(values, ['Ingredients'])
          }
          width='medium'
        >
          <List
            a11yTitle='list of recipe ingredients'
            data={recipeData.recipe.ingredients}
          />
        </Box>
      )}
      <h3>Method</h3>
      {methodCompleted ? (
        <span>
          <p>You've completed this section!</p>
        </span>
      ) : (
        <Box
          a11yTitle='recipe method container'
          align='center'
          border={{
            size: 'xsmall',
            side: 'vertical'
          }}
          justify='center'
          onClick={() => handleCreateUpdateChallengeApi(values, ['Method'])}
          width='medium'
        >
          <List
            a11yTitle='list of steps for recipe method'
            data={recipeData.recipe.method}
          />
        </Box>
      )}
      {sharedFriendsImageCompleted ? (
        <div>
          <p>You've completed this section! Take a look at your photo!</p>
          <img
            src={challengeState.standardResolution}
            alt='Image of friends'
          ></img>
        </div>
      ) : (
        <div>
          {takePhoto ? (
            <LiveFaceDetect
              handleCreateUpdateChallengeApi={handleCreateUpdateChallengeApi}
              values={values}
            />
          ) : (
            <Button
              a11yTitle='open up camera button'
              color='red'
              data-testid='button'
              hoverIndicator={{ color: 'white' }}
              label='TAKE PHOTO'
              margin='medium'
              primary={true}
              type='button'
              onClick={() => setTakePhoto(true)}
            />
          )}
        </div>
      )}
      {sharedRecipeCompleted ? (
        <span>
          <p>You've completed this section!</p>
        </span>
      ) : (
        <FbInitAndToken>
          {() => (
            <FbUserShare
              href={`${process.env.CLIENT_URL}${router.asPath}`}
              quote='By eating less animal products, or going meat free, you can protect our planet, your health, and save living beings, both human and animal from suffering.'
              handleCreateUpdateChallengeApi={handleCreateUpdateChallengeApi}
              values={values}
            />
          )}
        </FbInitAndToken>
      )}
    </Box>
  )
}

export default withRouter(Recipe)
