import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { setContext } from "apollo-link-context";
import nextWithApollo from 'next-with-apollo';

const cache = new InMemoryCache();

const httpLink = new HttpLink({
  uri: process.env.SERVER_URI,
  credentials: 'include'
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const isBrowser = typeof window !== 'undefined';
  let signedIn, data = false;

  // TODO - update signed_in when user logs out or refreshes page
  // TODO - need to remove signed in value from local storage.
  if(isBrowser) signedIn = localStorage.getItem('signed_in');
  console.log('signedIn',signedIn);

  // if(signedIn) data = cache.readQuery({query: ACCESS_TOKEN});

  // TODO - update the data to inclued .access_token
  return {
    headers: {
      ...headers,
      authorization: data ? `Bearer ${data}` : '',
      'Access-Control-Allow-Origin': process.env.CLIENT_URI
    }
  }
});

export default nextWithApollo(({ctx, headers, initialState}) => {
  console.log('CTX', ctx);
  console.log('HEADERS', headers);

  return new ApolloClient({
    name: 'No Meat May',
    version: 'v0.0.0',
    cache: cache.restore(initialState || {}),
    link: authLink.concat(httpLink)
  })
})