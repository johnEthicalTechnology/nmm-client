import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { Box } from 'grommet'

import RecipeListCard from '../components/RecipeListCard'

import { MealTypeEnum, IRecipesByType, RecipesTypeVars, Recipe } from './types'

const GET_RECIPES_BY_TYPE = gql`
  query recipesByMealType($mealType: MealTypeEnum!) {
    recipesByMealType(mealType: $mealType) {
      id
      title
      difficulty
      cost
      mealType
      hashtags
      lowResolution
      recipeAttribution {
        name
        website
        instagram
      }
    }
  }
`
export default function RecipesByType({ type }: { type: MealTypeEnum }) {
  const { loading, error, data } = useQuery<IRecipesByType, RecipesTypeVars>(
    GET_RECIPES_BY_TYPE,
    { variables: { mealType: type } }
  )

  if (loading) return <h1>'Loading...'</h1>
  if (typeof data === 'undefined' || error) {
    return <h1>`Error! ${error?.message}`</h1>
  }

  return (
    <>
      {data.recipesByMealType.map((recipe: Recipe) => (
        <React.Fragment key={recipe.title}>
          <Box
            direction='row-responsive'
            justify='center'
            pad='medium'
            width='xxlarge'
          >
            <RecipeListCard recipe={recipe} />
          </Box>
        </React.Fragment>
      ))}
    </>
  )
}
