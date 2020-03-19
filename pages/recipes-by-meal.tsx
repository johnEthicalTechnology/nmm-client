import React from 'react'
import { Tabs, Tab } from 'grommet'

import RecipesByType from '../containers/RecipesByType'

import { MealTypeEnum } from '../containers/types'

export default function RecipesByTypePage() {
  return (
    <div>
      <Tabs>
        <Tab title='Breakfast'>
          <RecipesByType type={MealTypeEnum.Breakfast} />
        </Tab>
        <Tab title='Lunch'>
          <RecipesByType type={MealTypeEnum.Lunch} />
        </Tab>
        <Tab title='Dinner'>
          <RecipesByType type={MealTypeEnum.Dinner} />
        </Tab>
        <Tab title='Snacks'>
          <RecipesByType type={MealTypeEnum.Snack} />
        </Tab>
      </Tabs>
    </div>
  )
}
