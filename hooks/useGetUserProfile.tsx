import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { UserProfileData } from './types'

const GET_CURRENT_USER = gql`
  query me($userProfileId: String!) {
    me(userProfileId: $userProfileId) {
      id
      totalPoints
      username
      lowResProfile
      standardResolution
      challengeGoals
      motivations
      bio
      challengeQuote
    }
  }
`

export default function useGetUserProfile(userProfileId: string) {
  const { loading, error, data } = useQuery<UserProfileData>(GET_CURRENT_USER, {
    variables: { userProfileId }
  })

  return { loading, error, data }
}
