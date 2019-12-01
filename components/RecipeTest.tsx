import React from 'react';
import Link from 'next/link';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const GET_RECIPES = gql`
  query GET_RECIPES {
    recipes {
      id
      title
      ingredients
      method
      difficulty
      cost
      mealType
      hashtags
      standardResolution
      attribution {
        name
      }
    }
  }
`

const Recipe = () => {
  const { loading: recipesQueryLoading, error: recipesQueryError, data: recipesQueryData } = useQuery(GET_RECIPES);
  console.log('recipesQueryData', recipesQueryData);

  if (recipesQueryLoading) return <p>Loading</p>;
  if (recipesQueryError) return <p>Error: {recipesQueryError.message}</p>;
  return (
  <div>
    <Link href='/index'>
      <a>
        <p>Back to home</p>
      </a>
    </Link>
    {/* <PleaseSignIn /> */}
    <h1>This is RECIPES</h1>
    <main>

    </main>
  </div>
)}

export default Recipe;