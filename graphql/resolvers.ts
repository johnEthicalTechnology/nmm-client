import { InMemoryCache } from 'apollo-cache-inmemory'
import gql from 'graphql-tag'
import { isServer } from '../utils/misc'

export const ACCESS_TOKEN = gql`
  query accessToken {
    accessToken @client
  }
`

export const resolvers = {
  Query: {
    accessToken: (_: any, __: any, { cache }: { cache: InMemoryCache }) => {
      return cache.readQuery({ query: ACCESS_TOKEN })
    }
  }
}
