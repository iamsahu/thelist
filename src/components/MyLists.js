import React, { useState } from "react";
import { GetListsOfUser, GetTagsOfUser } from "../util/graphqlExecutor";
import { Item, Loader, Responsive } from "semantic-ui-react";
import { Grid as GG, Card as CC } from "@material-ui/core";
import CuratorLandingCard from "./CuratorLandingCard";
function MyLists(props) {
	const [listData, setlistData] = useState("");

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
					) : (
						listData.lists.map((item) => (
							<GG key={item.id} item xs={4}>
								<CuratorLandingCard item={item} key={item.id} />
							</GG>
						))
					)}
				</GG>
			</Responsive>
		</>
	);
}

export default MyLists;
