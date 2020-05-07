import React from 'react'
import App from './App'
import ApolloClient from 'apollo-client'
import {InMemoryCache} from 'apollo-cache-inmemory'
import {createHttpLink} from 'apollo-link-http'
import {ApolloProvider} from '@apollo/react-hooks'

const httpLink = createHttpLink({
    // uri:'http://localhost:5000',
    uri: 'https://thelistspacetest.herokuapp.com/v1/graphql'
})

const client = new ApolloClient({
    link:httpLink,
    cache:new InMemoryCache(),
    headers: {
        // FIXME: This gives admin rights to all. Need to use user permissions using access Token
        'x-hasura-admin-secret': 'thesecretkey',
    },
})

export default(
    <ApolloProvider client = {client}>
        <App/>
    </ApolloProvider>
)