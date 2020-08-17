import React, { useState } from "react";
import { GetFollowOfUser } from "../util/graphqlExecutor";
import { useHistory } from "react-router-dom";
import { Loader, Responsive, Item, Button } from "semantic-ui-react";
import { Grid as GG, Card as CC } from "@material-ui/core";
import Follow from "./Follow";

function YourFollow(props) {
	const [loading, setloading] = useState("-1");
	const [followData, setfollowData] = useState("");
	const history = useHistory();
	const routeChange = (t) => {
		history.push(t);
	};

	if (loading === "-1")
		GetFollowOfUser(props.user)
			.then((response) => {
				// console.log(response);
				if (response.list_follow.length > 0) {
					setfollowData(response);
					setloading("0");
				}
			})
			.catch((error) => console.log(error));

	if (loading === "-1") {
		return (
			<div>
				<Loader active inline="centered" />
			</div>
		);
	}

	if (followData.list_follow.length < 1) {
		// console.log("follow Data");
		return <div>You have not followed anyone</div>;
	}

	function Card(item) {
		var str = item.list.description;
		var shrt = str.substr(0, 108);
		return (
			<div
				class="bg-white border shadow-md mt-4 rounded-lg overflow-hidden mr-1 ml-1 text-gray-900 w-full font-sans"
				key={item.list.id}
			>
				<div class="flex h-56">
					<div class="w-1/3 h-56">
						<div class="rounded border-black p-2">
							{item.list.image_url === '""' ? (
								<img
									class="object-contain rounded-lg"
									src="https://i.imgur.com/MwTfvwo.png"
								/>
							) : (
								<img
									class="object-contain rounded-lg"
									src={item.list.image_url}
								/>
							)}
						</div>
					</div>
					<div class="p-2 w-2/3 h-56">
						<div class="mb-1 max-h-full h-40">
							<a
								class="font-normal text-gray-800 w-full text-lg md:text-xl"
								href={item.list.curator_id + "/lists/" + item.list.id}
							>
								{item.list.list_name}
							</a>{" "}
							<div class="text-gray-500 text-sm md:text-base font-thin">
								by{" "}
								<a href={item.list.curator_id} class="text-blue-500">
									{item.list.user.username}
								</a>
							</div>
							<p class="text-gray-700 font-thin overflow-hidden max-h-full mb-1 pb-1 h-32 text-base lg:text-lg">
								{shrt}...
							</p>
						</div>
						<div class="text-gray-500 mb-8 text-left uppercase tracking-widest text-sm md:text-base">
							<Follow
								curator_id={item.list.curator_id}
								contentID={item.list.id}
							/>
							<Button
								size="tiny"
								floated="right"
								basic
								color="black"
								onClick={() => {
									var t = `/${item.list.curator_id}/lists/${item.list.id}`;
									routeChange(t);
								}}
							>
								Read
							</Button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<>
			<Responsive {...Responsive.onlyMobile}>
				<Item.Group divided relaxed="very">
					{followData.list_follow.map((item) => Card(item))}
				</Item.Group>
			</Responsive>
			<Responsive minWidth={Responsive.onlyTablet.minWidth}>
				<GG container spacing={3}>
					{followData.list_follow.map((item) => (
						<GG key={item.id} item xs={4}>
							{Card(item)}
						</GG>
					))}
				</GG>
			</Responsive>
		</>
	);
}

export default YourFollow;
