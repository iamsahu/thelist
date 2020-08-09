import React, { useState } from "react";
import { List, Divider, Item, Grid, Responsive } from "semantic-ui-react";
import { GetAllUsers } from "../util/graphqlExecutor";

import ProfileListItem from "./ProfileListItem";
import { Grid as GG } from "@material-ui/core";
function PopularProfile() {
	const [loading, setloading] = useState(true);
	const [allusers, setallusers] = useState(null);

	const loadData = () => {
		GetAllUsers().then((response) => {
			setallusers(response);
			setloading(false);
		});
	};

	loadData();

	return (
		<>
			{loading ? (
				<div>loading</div>
			) : (
				<>
					{/* <Grid> */}
					<Responsive {...Responsive.onlyMobile}>
						{/* <Grid.Column width={16}> */}
						<Item.Group divided>
							{allusers.user.map((theone) => (
								<ProfileListItem
									key={theone.id}
									image_link={theone.image_link}
									id={theone.id}
									username={theone.username}
									description={theone.description}
								/>
							))}
						</Item.Group>
						{/* </Grid.Column> */}
					</Responsive>
					<Responsive minWidth={Responsive.onlyTablet.minWidth}>
						{/* <Grid.Column width={3}></Grid.Column>
						<Grid.Column width={10}> */}
						{/* <Item.Group divided> */}
						<GG container spacing={3}>
							{allusers.user.map((theone) => (
								<GG item xs={3}>
									<ProfileListItem
										key={theone.id}
										image_link={theone.image_link}
										id={theone.id}
										username={theone.username}
										description={theone.description}
									/>
								</GG>
							))}
						</GG>
						{/* </Item.Group> */}
						{/* </Grid.Column>
						<Grid.Column width={3}></Grid.Column> */}
					</Responsive>
					{/* </Grid> */}
				</>
			)}
		</>
	);
}

export default PopularProfile;
