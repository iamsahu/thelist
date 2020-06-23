import React from "react";
import App from "./App";
import ApolloClient from "apollo-boost";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createHttpLink } from "apollo-link-http";
import { ApolloProvider } from "@apollo/react-hooks";
import { Auth0Provider } from "./react-auth0-spa";
import config from "./auth_config.json";
import history from "./util/history";
// require('dotenv').config();

const httpLink = createHttpLink({
	uri: process.env.REACT_APP_HASURA_ENDPOINT,
});

export const client = new ApolloClient({
	link: httpLink,
	uri: process.env.REACT_APP_HASURA_ENDPOINT,
	cache: new InMemoryCache(),
	fetch,
	headers: {
		"x-hasura-admin-secret": process.env.REACT_APP_HASURA_ADMIN_SECRET,
		"x-hasura-access-key": process.env.REACT_APP_HASURA_ADMIN_SECRET,
		"Content-Type": "application/json",
	},
});

const onRedirectCallback = (appState) => {
	// console.log(appState)
	// console.log(appState.targetUrl)
	history.push(
		appState && appState.targetUrl
			? appState.targetUrl
			: window.location.pathname
	);
};

export default (
	<ApolloProvider client={client}>
		<Auth0Provider
			domain={config.domain}
			client_id={config.clientId}
			redirect_uri={process.env.REACT_APP_BASE_URL}
			onRedirectCallback={onRedirectCallback}
		>
			<App />
		</Auth0Provider>
	</ApolloProvider>
);
