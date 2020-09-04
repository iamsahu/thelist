import React, { useContext, useState } from "react";
import { UpdatePocketCreds } from "../util/graphqlExecutor";
import UserContext from "../context/UserContext";
import CommonLoader from "../components/CommonLoader";

function PocketSignInComplete() {
	const [userC, userChange] = useContext(UserContext);
	const search = window.location.search;
	const params = new URLSearchParams(search);
	const foo = params.get("code");
	console.log(foo);
	var requestOptions = {
		method: "POST",
		// headers: myHeaders,
		redirect: "follow",
	};

	fetch(
		"https://getpocket.com/v3/oauth/authorize?consumer_key=92104-32f15adc016c93919a53d671&code=" +
			foo,
		requestOptions
	)
		.then((response) => response.text())
		.then((result) => {
			if (result !== "") {
				if (result !== "403 Forbidden") {
					console.log(result);
					//Save the result to DB
					var t = result.split("&");
					var tok = t[0].replace("access_token=", "");
					console.log(tok);
					var uname = t[1].replace("username=", "");
					uname = uname.replace("%40", "@");
					console.log(uname);
					UpdatePocketCreds(userC.loggedin_user_id, tok, uname)
						.then((response) => {
							console.log(response);
							window.location.href =
								process.env.REACT_APP_BASE_URL +
								"/settings/" +
								userC.loggedin_user_id;
						})
						.catch((error) => console.log(error));
				}
			}
		})
		.catch((error) => console.log("error", error));
	return (
		<>
			<div className="w-full h-full mt-8 justify-center">
				<CommonLoader />
			</div>
		</>
	);
}

export default PocketSignInComplete;
