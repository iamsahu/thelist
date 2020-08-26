import React, { useState, useContext } from "react";
import {
	GetListsOfUser,
	GetTagsOfUser,
	GetListsOfUserNonPrivate,
} from "../util/graphqlExecutor";
import { Item, Loader, Responsive, Image } from "semantic-ui-react";
import { Grid as GG, Card as CC } from "@material-ui/core";
import CuratorLandingCard from "./CuratorLandingCard";
import AddList from "../components/AddList";
import { useAuth0 } from "../react-auth0-spa";
import UserContext from "../context/UserContext";
import CommonLoader from "./CommonLoader";

function MyLists(props) {
	const [listData, setlistData] = useState("");
	const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();
	const [userC, userChange] = useContext(UserContext);

	const loadUser = (user) => {
		// if(tyuser)
		if (userC.loggedin_user_id === user) {
			//Loggedin but also the same user so private fetched
			GetListsOfUser(user)
				.then((response) => {
					// console.log(response);
					setlistData(response);
				})
				.catch((error) => console.log(error));
		} else {
			//Not the same as logged in user so fetching the non private lists
			GetListsOfUserNonPrivate(user)
				.then((response) => {
					// console.log(response);
					setlistData(response);
				})
				.catch((error) => console.log(error));
		}
	};

	if (props.user !== "") {
		loadUser(props.user);
	}

	return (
		<>
			<Responsive {...Responsive.onlyMobile}>
				<Item.Group divided relaxed="very">
					{listData === "" ? (
						<CommonLoader />
					) : listData.lists.length > 0 ? (
						listData.lists.map((item) => (
							<CuratorLandingCard item={item} key={item.id} />
						))
					) : props.user === userC.loggedin_user_id ? (
						<div
							style={{
								display: "block",
								"margin-left": "auto",
								"margin-right": "auto",
								"text-align": "center",
							}}
						>
							You have no lists. Click <AddList /> to create one!
							<br />
							<Image
								centered
								src={`${process.env.REACT_APP_BASE_URL}/undraw_empty_xct9_F5DD47.png`}
								size="large"
								verticalAlign="middle"
							/>
						</div>
					) : (
						("Nothing to see here",
						(
							<Image
								centered
								src={`${process.env.REACT_APP_BASE_URL}/undraw_empty_xct9_F5DD47.png`}
								size="large"
								verticalAlign="middle"
							/>
						))
					)}
				</Item.Group>
			</Responsive>
			<Responsive minWidth={Responsive.onlyTablet.minWidth}>
				<GG container spacing={2}>
					{listData === "" ? (
						<CommonLoader />
					) : listData.lists.length > 0 ? (
						listData.lists.map((item) => (
							<GG key={item.id} item xs={4}>
								<CuratorLandingCard item={item} key={item.id} />
							</GG>
						))
					) : props.user === userC.loggedin_user_id ? (
						<div
							style={{
								display: "block",
								"margin-left": "auto",
								"margin-right": "auto",
								"text-align": "center",
							}}
						>
							You have no lists. Click on <AddList /> to create one!
							<br />
							<Image
								centered
								src={`${process.env.REACT_APP_BASE_URL}/undraw_empty_xct9_F5DD47.png`}
								size="large"
								verticalAlign="middle"
							/>
						</div>
					) : (
						("Nothing to see here",
						(
							<Image
								centered
								src={`${process.env.REACT_APP_BASE_URL}/undraw_empty_xct9_F5DD47.png`}
								size="large"
								verticalAlign="middle"
							/>
						))
					)}
				</GG>
			</Responsive>
		</>
	);
}

export default React.memo(MyLists);
