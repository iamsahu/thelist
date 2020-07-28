import React, { useContext } from "react";
import { useAuth0 } from "../react-auth0-spa";
import UserContext from "../context/UserContext";
import { GetListsOfUser } from "../util/graphqlExecutor";
import ShareSignIn from "../components/ShareSignIn";
import ShareSignedIn from "../components/ShareSignedIn";
import { Button } from "semantic-ui-react";

function GetParams(url) {
	var params = {};
	var parser = document.createElement("a");
	parser.href = url;
	var query = parser.search.substring(1);
	var vars = query.split("&");
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		params[pair[0]] = decodeURIComponent(pair[1]);
	}
	return params;
}

function Share(props) {
	const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();
	const [userC, userChange] = useContext(UserContext);
	const parsedUrl = new URL(window.location);

	var para = GetParams(parsedUrl);

	if (isAuthenticated) {
		return (
			<ShareSignedIn
				props={parsedUrl.searchParams}
				title={para.title}
				text={para.text}
			/>
		);
	} else {
		return (
			<>
				You need to sign in or sign up if you want to continue
				<br />
				<Button
					basic
					color="black"
					onClick={() => {
						loginWithRedirect({
							appState: {
								targetUrl: window.location.href,
							},
						});
					}}
				>
					Sign In/Sign Up
				</Button>
			</>
		);
		return <ShareSignIn props={parsedUrl.searchParams} />;
	}
	// return (
	// 	<div>
	// 		Hello
	// 		{isAuthenticated ? "Authenticated" : "NotAuthenticated"}
	// 		{parsedUrl.searchParams}
	// 		{/* {parsedUrl.href} */}
	// 	</div>
	// );
}

export default Share;
