import gql from 'graphql-tag'

export const typeDefs = gql`
  extend type Query {
    isSignedIn: Boolean!
  }

  extend type Mutation {
    signingIn(signIn: Boolean!): Boolean!
  }
`