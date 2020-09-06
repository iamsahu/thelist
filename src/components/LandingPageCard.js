import React from "react";
import { Card, Image, Header, Button, Label } from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import Follow from "./Follow";

function LandingPageCard(props) {
	const history = useHistory();
	const routeChange = (t) => {
		history.push(t);
	};
	var str = props.result.description;
	var shrt = str.substr(0, 130);
	return (
		<>
			<div
				class="bg-white border shadow-md mt-4 rounded-lg overflow-hidden text-gray-900 w-full font-sans"
				key={props.result.id}
			>
				<div class="flex h-40">
					<div class="w-1/3 h-40">
						<div class="rounded border-black p-2">
							{props.result.image_url === '""' ? (
								<img
									class="object-contain rounded-lg"
									src="https://i.imgur.com/MwTfvwo.png"
								/>
							) : (
								<img
									class="object-contain rounded-lg"
									src={props.result.image_url}
								/>
							)}
						</div>
					</div>
					<div class="p-2 w-2/3 h-40">
						<div class="mb-1 max-h-full">
							<a
								class="font-normal text-gray-800 w-full text-lg md:text-xl"
								href={props.result.curator_id + "/lists/" + props.result.id}
							>
								{props.result.list_name}
							</a>
							<p class="text-gray-700 font-thin overflow-hidden max-h-full mb-1 pb-1 h-40 text-base lg:text-lg">
								{shrt.length < 130 ? shrt : shrt + "..."}
							</p>
						</div>
						{/* <div class="text-gray-500 mb-8 text-left uppercase tracking-widest object-bottom text-sm md:text-base">
							{props.viewcount === null ? 0 : props.viewcount} Views{" "}
							{props.listcount} Lists{" "}
							{props.itemscount === null ? 0 : props.itemscount} Items
						</div> */}
					</div>
				</div>
			</div>

			{/* <Card key={props.result.id} fluid style={{ height: "100%" }} raised>
				<Card.Content>
					{props.result.image_url === '""' ? (
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
							src={props.result.image_url}
						/>
					)}
					<Card.Header>
						<Header
							as="a"
							onClick={() => {
								var t = `/${props.result.curator_id}/lists/${props.result.id}`;
								routeChange(t);
							}}
						>
							{props.result.list_name}
						</Header>
					</Card.Header>
					
					<Card.Description>{props.result.description}</Card.Description>
				</Card.Content>
				
				<Card.Content
					style={{
						border: "none",
						"border-top": "none",
					}}
					extra
				>
					<Label
						image
						size="tiny"
						floated="left"
						basic
						as="a"
						href={`/${props.result.curator_id}`}
					>
						<img src={props.result.user.image_link} />
						{props.result.user.username}
					</Label>
					<Follow
						curator_id={props.result.curator_id}
						contentID={props.result.id}
					/>
					<Button
						size="tiny"
						floated="right"
						basic
						color="black"
						onClick={() => {
							var t = `/${props.result.curator_id}/lists/${props.result.id}`;
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

export default LandingPageCard;
