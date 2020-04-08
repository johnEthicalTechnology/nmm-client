import React from 'react'
import { Box, Button, Heading, Image } from 'grommet'
import useCheckSigninStatus from '../hooks/useCheckSigninStatus'
import useGetUserProfile from '../hooks/useGetUserProfile'
import SignIn from '../containers/SignIn'
import { MotivationsEnum } from '../hooks/types'

export default function ProfilePage() {
  const { signedIn, userProfileId } = useCheckSigninStatus()
  const { loading, error, data } = useGetUserProfile(userProfileId)

  if (!signedIn) {
    return (
      <Box
        a11yTitle='sign in container'
        align='center'
        background='white'
        justify='center'
        margin='medium'
      >
        <h3>Sorry, you have to be signed in to see your profile!</h3>
        <SignIn />
      </Box>
    )
  }
  if (error) return <h3>Sorry there was an error: {error.message}</h3>
  if (loading) return <h3>Loading...</h3>

  return (
    <Box
      a11yTitle='update profile container'
      align='center'
      background='white'
      justify='center'
      margin='medium'
    >
      <Heading a11yTitle='update profile heading'>
        Hey {data?.me.username}!
      </Heading>
      <Image
        src={data?.me.standardResolution}
        alt={`An image of ${data?.me.username}`}
        height='360'
        width='400'
      />
      <h2>Wow! You have {data?.me.totalPoints} points!</h2>
      <p>
        <i>{data?.me.challengeQuote}</i>
      </p>
      <p>
        <strong>Bio: </strong>
        {data?.me.bio}
      </p>
      <p>You're motivated by these important issues:</p>
      <ul>
        {data?.me.motivations.map((motivation: MotivationsEnum) => (
          <li key={motivation}>{motivation}</li>
        ))}
      </ul>
      <p>
        Which will keep you going to complete {data?.me.challengeGoals}{' '}
        challenges a week
      </p>
      <Button
        a11yTitle='update your profile button'
        data-testid='submit'
        hoverIndicator={true}
        href='/update-profile'
        label='UPDATE PROFILE'
        margin={{
          top: '0',
          bottom: '30px'
        }}
        primary={true}
        type='button'
      />
    </Box>
  )
}
