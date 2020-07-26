import React, { useContext } from "react";
import { useAuth0 } from "../react-auth0-spa";
import UserContext from "../context/UserContext";

function Share(props) {
	const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();
	const [userC, userChange] = useContext(UserContext);
	const parsedUrl = new URL(window.location);
	return (
		<>
			{
				(isAuthenticated ? "Authenticated" : "NotAuthenticated",
				parsedUrl.searchParams)
			}
		</>
	);
}

export default Share;
