import React from "react";
import { Card, Button, Image, Header } from "semantic-ui-react";
import history from "../util/history";
import Follow from "./Follow";

function CuratorLandingCard(props) {
	const routeChange = (t) => {
		history.push(t);
		window.location.href = window.location.href;
	};
	return (
		<>
			<div
				class="bg-white border shadow-md mt-4 rounded-lg overflow-hidden mr-1 ml-1 text-gray-900 w-full font-sans"
				key={props.item.id}
			>
				<div class="flex h-64">
					<div class="w-1/3 h-64">
						{props.item.image_url === '""' ? (
							<img
								class="object-cover rounded p-4"
								src="https://i.imgur.com/MwTfvwo.png"
							/>
						) : (
							<img
								class="object-cover rounded p-4"
								src={props.item.image_url}
							/>
						)}
					</div>
					<div class="p-2 w-2/3 h-64">
						<div class="mb-1 max-h-full h-48">
							<a
								class="font-normal text-base md:text-xl text-gray-800 w-full"
								href={props.item.curator_id + "/lists/" + props.item.id}
							>
								{props.item.list_name}
							</a>
							<p class="text-gray-700 text-sm md:text-base font-thin overflow-hidden max-h-full mb-1 pb-1 h-40">
								{props.item.description}
							</p>
						</div>
						<div class="text-gray-500 mb-8 text-left uppercase tracking-widest text-sm md:text-base">
							<Follow
								curator_id={props.item.curator_id}
								contentID={props.item.id}
							/>
							<Button
								size="tiny"
								floated="right"
								basic
								color="black"
								onClick={() => {
									var t = `/${props.item.curator_id}/lists/${props.item.id}`;
									routeChange(t);
								}}
							>
								Read
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* <Card
				fluid
				key={props.item.id}
				style={{ height: "100%" }}
			>
				<Card.Content>
					{props.item.image_url === '""' ? (
						<Image
							floated="left"
							size="mini"
							rounded
							src="https://react.semantic-ui.com/images/wireframe/square-image.png"
						/>
					) : (
						<Image
							floated="left"
							size="mini"
							rounded
							src={props.item.image_url}
						/>
					)}
					<Card.Header>
						<Header
							as="a"
							onClick={() => {
								var t = `/${props.item.curator_id}/lists/${props.item.id}`;
								routeChange(t);
							}}
						>
							{props.item.list_name}
						</Header>
					</Card.Header>
					<Card.Description>{props.item.description}</Card.Description>
				</Card.Content>
				<Card.Content
					style={{
						border: "none",
						"border-top": "none",
					}}
					extra
				>
					{props.item.view_count} Views
					<Follow
						curator_id={props.item.curator_id}
						contentID={props.item.id}
					/>
					<Button
						size="tiny"
						floated="right"
						basic
						color="black"
						onClick={() => {
							var t = `/${props.item.curator_id}/lists/${props.item.id}`;
							routeChange(t);
						}}
					>
						Read
					</Button>
				</Card.Content>
			</Card> */}
		</>
	);
}

export default CuratorLandingCard;
