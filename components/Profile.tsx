import React from 'react'
import useCheckSigninStatus from '../hooks/useCheckSigninStatus'
import useGetUserProfile from '../hooks/useGetUserProfile'

export default function ProfilePage() {
  const { signedIn, userProfileId } = useCheckSigninStatus()
  const { loading, error, data } = useGetUserProfile(userProfileId)

  if (!signedIn) {
    return <h3>Sorry, you have to be signed in to see your profile!</h3>
  }
  if (error) return <h3>Sorry there was an error: {error.message}</h3>
  if (loading) return <h3>Loading...</h3>

  const {
    bio,
    challengeGoals,
    challengeQuote,
    standardResolution,
    motivations,
    totalPoints,
    username
  } = data.me
  return (
    <div>
      <h1>Hey {username}!</h1>
      <h2>Look at the points you've got! {totalPoints}</h2>
      <p>
        <i>{challengeQuote}</i>
      </p>
      <p>
        <strong>Bio:</strong>
        {bio}
      </p>
      <p>You're motivated by these important issues:</p>
      <ul>
        {motivations.map((motivation: string) => (
          <li key={motivation}>{motivation}</li>
        ))}
      </ul>
      <p>
        Which will keep you going to complete {challengeGoals} challenges a week
      </p>
      <img
        src={standardResolution}
        alt={`An image of ${username}`}
        height='360'
        width='400'
      ></img>
    </div>
  )
}
