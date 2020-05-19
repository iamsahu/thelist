import React from 'react'
import App from './App'
import ApolloClient from 'apollo-client'
import {InMemoryCache} from 'apollo-cache-inmemory'
import {createHttpLink} from 'apollo-link-http'
import {ApolloProvider} from '@apollo/react-hooks'
import { Auth0Provider } from "./react-auth0-spa";
import config from "./auth_config.json";
import history from "./util/history";

const httpLink = createHttpLink({
    // uri:'http://localhost:5000',
    // uri: 'https://thelistspacetest.herokuapp.com/v1/graphql'
    uri:'https://thelistspace.herokuapp.com/v1/graphql'
})

export const client = new ApolloClient({
    link:httpLink,
    cache:new InMemoryCache(),
    fetch,
    headers: {
        'x-hasura-admin-secret': 'veryverysecret',
        'x-hasura-access-key':'veryverysecret',
        'Content-Type': 'application/json',
    },
})

const onRedirectCallback = appState => {
    console.log(appState)
    history.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    );
  };

export default(
    <ApolloProvider client = {client}>
        <Auth0Provider
            domain={config.domain}
            client_id={config.clientId}
            redirect_uri={'http://localhost:3000'}
            onRedirectCallback={onRedirectCallback}
        >
            <App/>
        </Auth0Provider>
    </ApolloProvider>
)