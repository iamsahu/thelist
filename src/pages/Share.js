import React, { useContext } from "react";
import { useAuth0 } from "../react-auth0-spa";
import UserContext from "../context/UserContext";
import { GetListsOfUser } from "../util/graphqlExecutor";
import ShareSignIn from "../components/ShareSignIn";
import ShareSignedIn from "../components/ShareSignedIn";
import { Button } from "semantic-ui-react";

function Share(props) {
	const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();
	const [userC, userChange] = useContext(UserContext);
	const parsedUrl = new URL(window.location);

	if (isAuthenticated) {
		return (
			<ShareSignedIn
				props={parsedUrl.searchParams}
				title={parsedUrl.searchParams.title}
				text={parsedUrl.searchParams.text}
			/>
		);
	} else {
		return (
			<>
				<Button
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
