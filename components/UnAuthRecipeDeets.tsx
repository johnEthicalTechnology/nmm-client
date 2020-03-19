import React from 'react'
import { Recipe } from '../containers/types'
import { Box, Image, Heading, Button, List } from 'grommet'

import SignUp from '../containers/SignIn'

export default function UnAuthRecipeDeets({ recipe }: { recipe: Recipe }) {
  return (
    <Box a11yTitle='recipe title and image box' align='center' justify='center'>
      <Box pad='small' width='640'>
        <Heading size='medium'>{recipe.title}</Heading>
        <Image
          a11yTitle='recipe image'
          fit='contain'
          src={recipe.standardResolution}
        />
      </Box>
      <Box>
        <Heading level='2'>Meal Type: {recipe.mealType}</Heading>
        <Heading level='2'>Difficulty: {recipe.difficulty}</Heading>
        <Heading level='2'>Budget: {recipe.cost}</Heading>
        <h3>Ingredients</h3>
      </Box>
      <Box
        a11yTitle='recipe method box'
        align='center'
        border={{
          size: 'xsmall',
          side: 'vertical'
        }}
        justify='center'
        width='medium'
      >
        <List
          a11yTitle='list of steps for recipe method'
          data={recipe.ingredients}
        />
      </Box>
      <h3>Method</h3>
      <Box
        a11yTitle='recipe method box'
        align='center'
        border={{
          size: 'xsmall',
          side: 'vertical'
        }}
        justify='center'
        width='medium'
      >
        <List
          a11yTitle='list of steps for recipe method'
          data={recipe.method}
        />
      </Box>
      <h1>
        If you want access to all the recipes and earn points for cool stuff
        sign up now!
      </h1>
      <Button
        a11yTitle='go to sign up page'
        color='red'
        data-testid='button'
        hoverIndicator={{ color: 'white' }}
        href='/signup'
        label='SIGN UP'
        margin='medium'
        primary={true}
        type='button'
      />
    </Box>
  )
}
