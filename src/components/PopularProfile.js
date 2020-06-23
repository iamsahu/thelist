import React, { useState } from "react";
import { List, Divider, Item, Grid } from "semantic-ui-react";
import { GetAllUsers } from "../util/graphqlExecutor";

import ProfileListItem from "./ProfileListItem";

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
				<Grid>
					<Grid.Column width={3}></Grid.Column>
					<Grid.Column width={10}>
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
					</Grid.Column>
					<Grid.Column width={3}></Grid.Column>
				</Grid>
			)}
		</>
	);
}

export default PopularProfile;
