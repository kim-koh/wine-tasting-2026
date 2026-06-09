import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

export const clientApollo = new ApolloClient({
  link: new HttpLink({ uri: process.env.NEXT_PUBLIC_HYGRAPH_URL }),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache',
    },
  },
});



