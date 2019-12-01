import React from 'react'

import RecipeTest from '../components/RecipeTest'
import SignIn from '../containers/SignIn'
import SignUp from '../containers/SignUp'

export default function Home() {
  return (
    <div>
      <h1>Welcome Home!</h1>
      <RecipeTest />
      <SignIn />
      <SignUp />
    </div>
  )
}
