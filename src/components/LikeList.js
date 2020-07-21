import React, { useState, useContext, useEffect } from "react";
import { LikeList as LL, UnlikeList, DoILike } from "../util/graphqlExecutor";
import { Button, Icon } from "semantic-ui-react";
import ReactGA from "react-ga";
import Mixpanel from "../util/mix";
import UserContext from "../context/UserContext";
import { useAuth0 } from "../react-auth0-spa";
import Tap from "react-interactions";

function LikeList(props) {
	// console.log(props);
	const [liked, setLiked] = useState(-1);
	const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();
	const [userC, userChange] = useContext(UserContext);

	if (userC.loggedin_user_id !== "") {
		if (liked === -1) {
			DoILike({
				list_id: props.props,
				user_id: userC.loggedin_user_id,
			}).then((response) => {
				// console.log(response);
				if (response.like_list.length > 0) {
					setLiked(true);
				} else {
					setLiked(false);
				}
			});
		}
	}

	return (
		<>
			{isAuthenticated &&
				(liked ? (
					<Button
						icon
						floated="right"
						onClick={(e) => {
							UnlikeList(props.props, userC.loggedin_user_id);
							setLiked(false);
							// Mixpanel.track("Appreciate List", {
							// 	link: { shareUrl },
							// 	curator: props.propSent.curator_id,
							// 	name: content.currentList,
							// });
							if (process.env.REACT_APP_BASE_URL !== "http://localhost:3000")
								ReactGA.event({
									category: "List",
									action: "Like",
									transport: "beacon",
									label: "listname",
								});
						}}
					>
						<Icon color="red" name="like" />
						<Tap waves />
					</Button>
				) : (
					<Button
						icon
						floated="right"
						onClick={(e) => {
							LL(props.props, userC.loggedin_user_id);
							setLiked(true);
							// Mixpanel.track("Appreciate List", {
							// 	link: { shareUrl },
							// 	curator: props.propSent.curator_id,
							// 	name: content.currentList,
							// });
							if (process.env.REACT_APP_BASE_URL !== "http://localhost:3000")
								ReactGA.event({
									category: "List",
									action: "Unlike",
									transport: "beacon",
									label: "listname",
								});
						}}
					>
						<Icon name="like" />
						<Tap waves />
					</Button>
				))}
		</>
	);
}

export default LikeList;
