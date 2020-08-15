import React, { useState, useContext, useEffect } from "react";
import { LikeItem, UnlikeItem } from "../util/graphqlExecutor";
import { Button, Icon } from "semantic-ui-react";
import ReactGA from "react-ga";
import Mixpanel from "../util/mix";
import UserContext from "../context/UserContext";
import { useAuth0 } from "../react-auth0-spa";
import Tap from "react-interactions";

function LikeArticle(postdata) {
	const [liked, setLiked] = useState(-1);
	const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();
	const [userC, userChange] = useContext(UserContext);

	if (liked === -1) {
		// console.log(postdata.postdata.postdata);
		if (typeof postdata.postdata.postdata !== "undefined")
			if (
				typeof postdata.postdata.postdata["like_items_aggregate"] !==
				"undefined"
			)
				if (
					postdata.postdata.postdata["like_items_aggregate"].aggregate.count > 0
				) {
					// console.log("here");
					setLiked(true);
				} else {
					// console.log("here2");
					setLiked(false);
				}
	}

	return (
		<>
			{isAuthenticated &&
				(liked ? (
					<img
						class="h-4 float-right mr-1 object-bottom"
						src={`${process.env.REACT_APP_BASE_URL}/heart (1).svg`}
						alt="Kiwi standing on oval"
						onClick={(e) => {
							UnlikeItem(postdata.postdata.postdata.id, userC.loggedin_user_id);
							setLiked(false);
							Mixpanel.track("Appreciate Item", {
								link: postdata.postdata.postdata.link,
								curator: postdata.postdata.postdata.user.id,
								name: postdata.postdata.postdata.name,
							});
							if (process.env.REACT_APP_BASE_URL !== "http://localhost:3000")
								ReactGA.event({
									category: "Item",
									action: "Appreciate",
									label: postdata.postdata.postdata.name,
									transport: "beacon",
								});
						}}
					/>
				) : (
					// <Button
					// 	icon
					// 	size="tiny"
					// 	floated="right"
					// 	basic
					// 	color="black"
					// 	onClick={(e) => {
					// 		UnlikeItem(postdata.postdata.postdata.id, userC.loggedin_user_id);
					// 		setLiked(false);
					// 		Mixpanel.track("Appreciate Item", {
					// 			link: postdata.postdata.postdata.link,
					// 			curator: postdata.postdata.postdata.user.id,
					// 			name: postdata.postdata.postdata.name,
					// 		});
					// 		if (process.env.REACT_APP_BASE_URL !== "http://localhost:3000")
					// 			ReactGA.event({
					// 				category: "Item",
					// 				action: "Appreciate",
					// 				label: postdata.postdata.postdata.name,
					// 				transport: "beacon",
					// 			});
					// 	}}
					// >
					// 	<Icon color="red" name="like" />
					// 	<Tap waves />
					// </Button>
					<img
						class="h-4 float-right mr-1 object-bottom"
						src={`${process.env.REACT_APP_BASE_URL}/heart.svg`}
						alt="Kiwi standing on oval"
						onClick={(e) => {
							LikeItem(postdata.postdata.postdata.id, userC.loggedin_user_id);
							setLiked(true);
							Mixpanel.track("Appreciate Item", {
								link: postdata.postdata.postdata.link,
								curator: postdata.postdata.postdata.user.id,
								name: postdata.postdata.postdata.name,
							});
							if (process.env.REACT_APP_BASE_URL !== "http://localhost:3000")
								ReactGA.event({
									category: "Item",
									action: "Appreciate",
									label: postdata.postdata.postdata.name,
									transport: "beacon",
								});
						}}
					/>
					// <Button
					// 	icon
					// 	size="tiny"
					// 	floated="right"
					// 	basic
					// 	color="black"
					// 	onClick={(e) => {
					// 		LikeItem(postdata.postdata.postdata.id, userC.loggedin_user_id);
					// 		setLiked(true);
					// 		Mixpanel.track("Appreciate Item", {
					// 			link: postdata.postdata.postdata.link,
					// 			curator: postdata.postdata.postdata.user.id,
					// 			name: postdata.postdata.postdata.name,
					// 		});
					// 		if (process.env.REACT_APP_BASE_URL !== "http://localhost:3000")
					// 			ReactGA.event({
					// 				category: "Item",
					// 				action: "Appreciate",
					// 				label: postdata.postdata.postdata.name,
					// 				transport: "beacon",
					// 			});
					// 	}}
					// >
					// 	<Icon name="like" />
					// 	<Tap waves />
					// </Button>
				))}
		</>
	);
}

export default LikeArticle;
