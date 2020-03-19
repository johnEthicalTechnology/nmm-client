import nextWithApollo from 'next-with-apollo'
import createApollo from '../graphql/createApollo'
import { NormalizedCacheObject } from 'apollo-cache-inmemory'

/**
 * Always creates a new apollo client on the server
 * Creates or reuses apollo client in the browser.
 */

function initApollo(initialState: NormalizedCacheObject) {
  let apolloClient = null

  const isServer = typeof window === 'undefined'

  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (isServer) return createApollo(initialState)

  // Reuse client on the client-side
  if (!apolloClient) apolloClient = createApollo(initialState)

  return apolloClient
}

export default nextWithApollo(({ initialState = {} }) => {
  return initApollo(initialState)
})
