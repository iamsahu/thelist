import React, { useState, useContext } from "react";
import { GetListsOfUser, GetTagsOfUser } from "../util/graphqlExecutor";
import { Item, Loader, Responsive, Image } from "semantic-ui-react";
import { Grid as GG, Card as CC } from "@material-ui/core";
import CuratorLandingCard from "./CuratorLandingCard";
import AddList from "../components/AddList";
import { useAuth0 } from "../react-auth0-spa";
import UserContext from "../context/UserContext";

function MyLists(props) {
	const [listData, setlistData] = useState("");
	const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();
	const [userC, userChange] = useContext(UserContext);

	const loadUser = (user) => {
		// if(tyuser)
		GetListsOfUser(user)
			.then((response) => {
				// console.log(response);
				setlistData(response);
			})
			.catch((error) => console.log(error));
	};

	if (props.user !== "") {
		loadUser(props.user);
	}

	return (
		<>
			<Responsive {...Responsive.onlyMobile}>
				<Item.Group divided relaxed="very">
					{listData === "" ? (
						<div key="unique">
							<Loader active inline="centered" />
						</div>
					) : (
						listData.lists.map((item) => (
							<CuratorLandingCard item={item} key={item.id} />
						))
					)}
				</Item.Group>
			</Responsive>
			<Responsive minWidth={Responsive.onlyTablet.minWidth}>
				<GG container spacing={3}>
					{listData === "" ? (
						<div>
							<Loader active inline="centered" />
						</div>
					) : listData.lists.length > 0 ? (
						listData.lists.map((item) => (
							<GG key={item.id} item xs={4}>
								<CuratorLandingCard item={item} key={item.id} />
							</GG>
						))
					) : props.user === userC.loggedin_user_id ? (
						("You have no lists please add one to begin ",
						(<br />),
						(<AddList />))
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

export default MyLists;
