import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { Box } from 'grommet'

import RecipeListCard from '../components/RecipeListCard'

import { Recipe } from '../containers/types'

const GET_RECIPES = gql`
  {
    recipes {
      id
      title
      difficulty
      cost
      mealType
      hashtags
      lowResolution
    }
  }
`
export default function Recipes() {
  const { loading, error, data } = useQuery(GET_RECIPES)

  if (loading) return <h1>'Loading...'</h1>
  if (error) return <h1>`Error! ${error.message}`</h1>

  return (
    <div>
      {data.recipes.map((recipe: Recipe) => (
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
    </div>
  )
}
