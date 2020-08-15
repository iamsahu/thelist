import React from "react";
import { List, Image, Item, Statistic, Card, Header } from "semantic-ui-react";
import Linkify from "react-linkify";
import { useHistory } from "react-router-dom";

function ProfileListItem(props) {
	const history = useHistory();
	const routeChange = (t) => {
		history.push(t);
	};
	return (
		<>
			<div
				class="bg-white border shadow-md mt-4 rounded-lg overflow-hidden mr-1 ml-1 text-gray-900 w-full"
				key={props.id}
			>
				<div class="flex h-40">
					<div class="flex w-1/4 max-h-full">
						{props.image_link === '""' ? (
							<img class="object-cover" src="https://i.imgur.com/MwTfvwo.png" />
						) : (
							<img class="object-cover" src={props.image_link} />
						)}
					</div>
					<div class="p-2 w-3/4">
						<div class="h-32">
							<a
								class="font-semibold text-base md:text-xl text-gray-800 w-full"
								href={`${process.env.REACT_APP_BASE_URL}/${props.id}`}
							>
								{props.username}
							</a>
							<p class="text-gray-600 text-sm md:text-base font-thin">
								<Linkify>{props.description}</Linkify>
							</p>
						</div>
						<div class="text-gray-500 mb-8 text-left uppercase tracking-widest object-bottom text-sm md:text-base">
							{props.viewcount === null ? 0 : props.viewcount} Views{" "}
							{props.listcount} Lists{" "}
							{props.itemscount === null ? 0 : props.itemscount} Items
						</div>
					</div>
				</div>
			</div>
			{/* <Item key={props.id} style={{ height: "100%" }}>
				<Item.Image avatar size="tiny" src={props.image_link} />
				<Item.Content verticalAlign="middle">
					<Item.Header
						as="a"
						href={`${process.env.REACT_APP_BASE_URL}/${props.id}`}
					>
						{props.username}
					</Item.Header>
					<Item.Description>
						<Linkify>{props.description}</Linkify>
					</Item.Description>
				</Item.Content>
			</Item> */}

			{/* <Card key={props.id} fluid style={{ height: "100%" }}>
				<Card.Content>
					{props.image_url === '""' ? (
						<Image
							floated="left"
							size="mini"
							circular
							src="https://react.semantic-ui.com/images/wireframe/square-image.png"
						/>
					) : (
						<Image floated="left" size="mini" circular src={props.image_link} />
					)}
					<Card.Header>
						<Header
							as="a"
							href={`${process.env.REACT_APP_BASE_URL}/${props.id}`}
						>
							{props.username}
						</Header>
					</Card.Header>
					<Card.Description>
						<Linkify>{props.description}</Linkify>
					</Card.Description>
				</Card.Content>
				<Card.Content
					style={{
						border: "none",
						"border-top": "none",
					}}
					extra
				>
					Views {props.viewcount} Lists {props.listcount} Items{" "}
					{props.itemscount}
				</Card.Content>
			</Card> */}
		</>
	);
}

export default ProfileListItem;
