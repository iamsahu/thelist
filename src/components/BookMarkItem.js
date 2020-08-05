import React, { useState, useContext } from "react";
import {
	InsertBookmark,
	DeleteBookmark,
	HaveIBookmarked,
} from "../util/graphqlExecutor";
import { Button, Icon } from "semantic-ui-react";
import ReactGA from "react-ga";
import Mixpanel from "../util/mix";
import UserContext from "../context/UserContext";
import { useAuth0 } from "../react-auth0-spa";
import Tap from "react-interactions";

function BookMarkItem(postdata) {
	const [liked, setLiked] = useState(-1);
	const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();
	const [userC, userChange] = useContext(UserContext);
	// console.log(postdata.postdata.postdata);
	// if (liked === -1) {
	// 	// console.log(postdata.postdata.postdata);
	// 	if (typeof postdata.postdata.postdata !== "undefined")
	// 		if (typeof postdata.postdata.postdata["item_bookmarks"] !== "undefined")
	// 			if (postdata.postdata.postdata["item_bookmarks"].count > 0) {
	// 				// console.log("here");
	// 				setLiked(true);
	// 			} else {
	// 				// console.log("here2");
	// 				setLiked(false);
	// 			}
	// }
	function GetB() {
		if (userC.loggedin_user_id !== "") {
			if (liked === -1) {
				HaveIBookmarked(
					postdata.postdata.postdata.id,
					userC.loggedin_user_id
				).then((response) => {
					// console.log(response);
					if (typeof response.item_bookmark_aggregate !== "undefined")
						if (response.item_bookmark_aggregate.aggregate.count > 0) {
							setLiked(true);
							// console.log("liked");
						} else {
							setLiked(false);
							// console.log("unliked");
						}
				});
			}
		}
	}
	// useEffect(() => {
	GetB();
	// });

	return (
		<>
			{isAuthenticated &&
				(liked ? (
					<Button
						icon
						size="tiny"
						floated="right"
						basic
						color="black"
						onClick={(e) => {
							DeleteBookmark(
								postdata.postdata.postdata.id,
								userC.loggedin_user_id,
								postdata.postdata.postdata.user.id
							);
							console.log("book");
							setLiked(false);
							Mixpanel.track("Unbookmark Item", {
								link: postdata.postdata.postdata.link,
								curator: postdata.postdata.postdata.user.id,
								name: postdata.postdata.postdata.name,
							});
							if (process.env.REACT_APP_BASE_URL !== "http://localhost:3000")
								ReactGA.event({
									category: "Item",
									action: "Unbookmark",
									label: postdata.postdata.postdata.name,
									transport: "beacon",
								});
						}}
					>
						<Icon color="red" name="bookmark outline" />
						<Tap waves />
					</Button>
				) : (
					<Button
						icon
						size="tiny"
						floated="right"
						basic
						color="black"
						onClick={(e) => {
							InsertBookmark(
								postdata.postdata.postdata.id,
								userC.loggedin_user_id,
								postdata.postdata.postdata.user.id,
								postdata.postdata.postdata.list_id
							);
							setLiked(true);
							console.log("insert");
							Mixpanel.track("Bookmark Item", {
								link: postdata.postdata.postdata.link,
								curator: postdata.postdata.postdata.user.id,
								name: postdata.postdata.postdata.name,
							});
							if (process.env.REACT_APP_BASE_URL !== "http://localhost:3000")
								ReactGA.event({
									category: "Item",
									action: "Bookmark",
									label: postdata.postdata.postdata.name,
									transport: "beacon",
								});
						}}
					>
						<Icon name="bookmark outline" />
						<Tap waves />
					</Button>
				))}
		</>
	);
}

export default BookMarkItem;
