import React, { useContext, useState } from "react";
import { Button, Icon, Modal, Header } from "semantic-ui-react";
import StreamContext from "../context/StreamContext";
import UserContext from "../context/UserContext";
import {
	FollowThisList,
	UnfollowThisList,
	DoIFollow,
} from "../util/graphqlExecutor";
import { useAuth0 } from "../react-auth0-spa";

function FollowCard(props) {
	const [userC, userChange] = useContext(UserContext);
	// const [streamClient, streamuserFeed] = useContext(StreamContext);
	const [follow, setfollow] = useState(0);
	const [open, setopen] = useState(false);

	const {
		user,
		isAuthenticated,
		loading,
		loginWithRedirect,
		logout,
	} = useAuth0();

	if (userC.loggedin_user_id !== props.curator_id)
		if (userC.loggedin_user_id !== "") {
			DoIFollow(props.contentID, userC.loggedin_user_id).then((response) => {
				// console.log(response.list_follow_aggregate.aggregate.count);
				if (typeof response !== "undefined")
					if (typeof response.list_follow_aggregate !== "undefined")
						if (response.list_follow_aggregate.aggregate.count > 0) {
							setfollow(1);
						}
			});
		}

	function OnClose() {
		setopen(false);
	}

	return (
		<>
			{userC.loggedin_user_id !== props.curator_id &&
				(userC.loggedin_user_id !== "" ? (
					follow === 0 ? (
						<button
							class="mx-auto lg:mx-0 gradient hover:bg-black hover:text-white font-bold rounded-md py-3 px-4 shadow-lg float-right bg-white text-black border-gray-800"
							onClick={() => {
								// streamClient
								// 	.feed("timeline", userC.loggedin_user_id)
								// 	.follow("listfeed", props.contentID);
								FollowThisList(props.contentID, userC.loggedin_user_id);
								setfollow(1);
							}}
						>
							<i class="fas fa-rss"></i> Follow
						</button>
					) : (
						// <Button
						// 	icon
						// 	size="tiny"
						// 	floated="right"
						// 	basic
						// 	color="black"
						// 	onClick={() => {
						// 		streamClient
						// 			.feed("timeline", userC.loggedin_user_id)
						// 			.follow("listfeed", props.contentID);
						// 		FollowThisList(props.contentID, userC.loggedin_user_id);
						// 		setfollow(1);
						// 	}}
						// >
						// 	<Icon name="feed" />
						// 	Follow
						// </Button>
						//Unfollow
						// <Button
						// 	icon
						// 	size="tiny"
						// 	floated="right"
						// 	basic
						// 	color="black"
						// 	onClick={() => {
						// 		streamClient
						// 			.feed("timeline", userC.loggedin_user_id)
						// 			.unfollow("listfeed", props.contentID);
						// 		UnfollowThisList(props.contentID, userC.loggedin_user_id);
						// 		setfollow(0);
						// 	}}
						// >
						// 	<Icon color="red" name="feed" />
						// 	Unfollow
						// </Button>
						<button
							class="mx-auto lg:mx-0 gradient hover:bg-black hover:text-white font-bold rounded-md py-3 px-4 shadow-lg float-right ml-1 bg-white text-black border-gray-800"
							onClick={() => {
								// streamClient
								// 	.feed("timeline", userC.loggedin_user_id)
								// 	.unfollow("listfeed", props.contentID);
								UnfollowThisList(props.contentID, userC.loggedin_user_id);
								setfollow(0);
							}}
						>
							<i class="fas fa-rss text-red-700"></i> Unfollow
						</button>
					)
				) : (
					<Modal
						open={open}
						onClose={OnClose}
						trigger={
							<button
								class="mx-auto lg:mx-0 gradient hover:bg-black hover:text-white font-bold rounded-md py-3 px-4 shadow-lg float-right ml-1 bg-white text-black border-gray-800"
								onClick={() => setopen(true)}
							>
								<i class="fas fa-rss"></i> Follow
							</button>
							// <Button
							// 	size="tiny"
							// 	floated="right"
							// 	basic
							// 	color="black"
							// 	icon
							// 	onClick={() => setopen(true)}
							// >
							// 	<Icon name="feed" />
							// 	Follow
							// </Button>
						}
						basic
						size="small"
					>
						<Header icon="feed" content="Sign Up/Sign In" />
						<Modal.Content>
							<p>
								To follow you will have to sign in. Do you want to proceed to
								sign in?
							</p>
						</Modal.Content>
						<Modal.Actions>
							<Button basic color="red" inverted onClick={OnClose}>
								<Icon name="remove" /> No
							</Button>
							<Button
								color="green"
								inverted
								onClick={() =>
									loginWithRedirect({
										appState: {
											targetUrl: window.location.href.replace(
												process.env.REACT_APP_BASE_URL,
												""
											),
										},
									})
								}
							>
								<Icon name="checkmark" /> Yes
							</Button>
						</Modal.Actions>
					</Modal>
					// <Button
					// 	icon
					// 	onClick={() => {
					// 		//Take user to signin/up
					// 	}}
					// >
					// 	<Icon name="feed" />
					// </Button>
				))}
		</>
	);
}

export default FollowCard;
