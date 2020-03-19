import React, { useState, useEffect } from 'react'
import { useApolloClient } from '@apollo/react-hooks'
import { checkSession } from '../utils/auth'
import logger from '../utils/logger'

export default function useCheckSigninStatus() {
  const apolloClient = useApolloClient()
  const [signedIn, setSignedIn] = useState<boolean | undefined>()
  const [userProfileId, setUserProfileId] = useState('')

  useEffect(() => {
    async function checkingSession() {
      try {
        const checkSessionResult = await checkSession()
        apolloClient.writeData({
          data: {
            accessToken: checkSessionResult?.accessToken
          }
        })
        localStorage.setItem('signed_in', 'true')
        setUserProfileId(checkSessionResult?.idTokenPayload.sub)
        setSignedIn(true)
      } catch (_) {
        localStorage.setItem('signed_in', 'false')
        setSignedIn(false)
      }
    }
    checkingSession()
  }, [apolloClient])

  return {
    signedIn,
    userProfileId
  }
}
