import React from 'react'
import Link from 'next/link'
import { Box, Image, Heading, Paragraph } from 'grommet'

import { Recipe } from '../containers/types'

export default function RecipeListCard({
  recipe: {
    difficulty,
    id,
    title,
    lowResolution,
    cost,
    mealType,
    hashtags,
    recipeAttribution
  }
}: {
  recipe: Recipe
}) {
  return (
    <Link
      href={{
        pathname: '/recipe/[title-id]',
        query: {
          difficulty: difficulty,
          recipeId: id
        }
      }}
      as={`/recipe/${title}-${id}`}
    >
      <Box
        a11yTitle='recipe card'
        align='center'
        background='red'
        color='white'
        border={{
          color: 'red',
          size: 'small'
        }}
        direction='row-responsive'
        elevation='medium'
        justify='center'
        round='xsmall'
      >
        <Box pad='small' width='320'>
          <Image fit='contain' src={lowResolution} />
        </Box>
        <Box>
          <Heading a11yTitle='title of recipe' color='white' margin='small'>
            {title}
          </Heading>
          <Paragraph
            a11yTitle='cost classification of recipe'
            color='white'
            margin='small'
          >
            <strong>Cost:</strong> {cost}
          </Paragraph>
          <Paragraph
            a11yTitle='difficulty of recipe to make'
            color='white'
            margin='small'
          >
            <strong>Meal Type:</strong> {mealType}
          </Paragraph>
          <Paragraph a11yTitle='recipe hashtags' color='white' margin='small'>
            {hashtags}
          </Paragraph>
          <Heading a11yTitle='recipe attribution' color='white'>
            Recipe Attribution
          </Heading>
          <Paragraph a11yTitle='name' color='white' margin='small'>
            {recipeAttribution?.name}
          </Paragraph>
          <Paragraph a11yTitle='website' color='white' margin='small'>
            {recipeAttribution?.website}
          </Paragraph>
          <Paragraph a11yTitle='instagram' color='white' margin='small'>
            {recipeAttribution?.instagram}
          </Paragraph>
        </Box>
      </Box>
    </Link>
  )
}
