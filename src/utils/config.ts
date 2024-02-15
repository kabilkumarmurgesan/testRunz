import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GRAPHQL_URL,
});

const authorizedLink: any = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      Authorization: `Bearer ${window.sessionStorage.getItem('accessToken')}`,
    },
  };
});

const logoutLink = onError(({ networkError }) => {
  debugger
  if (networkError?.statusCode === 401) {
    // Perform logout actions here
    console.log('Logging out due to 401 error');
    // You can add your own logic to log out the user, such as clearing the token and redirecting to the login page
  }
});

export const client = new ApolloClient({
  link: logoutLink.concat(authorizedLink.concat(httpLink)),
  cache: new InMemoryCache(),
});

// 3050771387
