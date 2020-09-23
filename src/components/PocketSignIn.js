import React, { useState, useContext } from "react";
import { UpdatePocketCreds } from "../util/graphqlExecutor";
import UserContext from "../context/UserContext";

function PocketSignIn(props) {
	const [userC, userChange] = useContext(UserContext);
	const [token, settoken] = useState(props.pocket_token);
	// console.log(props);
	function SignIn() {
		fetch(
			"https://wfjiolg53e.execute-api.eu-west-3.amazonaws.com/default/pocketAuth"
		)
			.then((r) => r.json())
			.then((data) => {
				console.log(data);
				var t = data["code"].split("=");
				var link =
					"https://getpocket.com/auth/authorize?request_token=" +
					t[1] +
					"&redirect_uri=" +
					process.env.REACT_APP_BASE_URL +
					"/pocketcomp?code=" +
					t[1];
				window.open(link, "_blank");
			});
	}

	function UnlinkPocket() {
		UpdatePocketCreds(userC.loggedin_user_id, "", "")
			.then((response) => {
				settoken(null);
				// window.location.href =
				// 					process.env.REACT_APP_BASE_URL +
				// 					"/settings/" +
				// 					userC.loggedin_user_id;
			})
			.catch((error) => console.log(error));
	}

	return (
		<>
			{token !== null && token !== "" ? (
				<button
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4"
					onClick={UnlinkPocket}
				>
					Unlink Pocket
				</button>
			) : (
				<button
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4"
					onClick={SignIn}
				>
					Link Pocket
				</button>
			)}
		</>
	);
}

export default PocketSignIn;
