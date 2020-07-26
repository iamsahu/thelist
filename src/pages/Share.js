import React, { useContext } from "react";
import { useAuth0 } from "../react-auth0-spa";
import UserContext from "../context/UserContext";

function Share(props) {
	const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();
	const [userC, userChange] = useContext(UserContext);
	const parsedUrl = new URL(window.location);
	return (
		<div>
			Hello
			{isAuthenticated ? "Authenticated" : "NotAuthenticated"}
			{parsedUrl.searchParams}
		</div>
	);
}

export default Share;
