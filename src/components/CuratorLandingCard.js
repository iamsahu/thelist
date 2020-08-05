import React from "react";
import { Card, Button, Image, Header, Label } from "semantic-ui-react";
import history from "../util/history";
import Follow from "./Follow";

function CuratorLandingCard(props) {
	const routeChange = (t) => {
		history.push(t);
		window.location.href = window.location.href;
	};
	return (
		<>
			{/* <Card className="eq-card" fluid key={props.item.id}>
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
						<Header as="h3">{props.item.list_name}</Header>
					</Card.Header>
					<Card.Description>{props.item.description}</Card.Description>
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
			<Card
				// className="eq-card"
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
				{/* <Card.Content
					description={props.item.description}
					style={{
						border: "none",
						"border-top": "none",
					}}
				/> */}
				<Card.Content
					style={{
						border: "none",
						"border-top": "none",
					}}
					extra
				>
					{/* <Label
						image
						size="tiny"
						floated="left"
						basic
						as="a"
						href={`/${props.item.curator_id}`}
					>
						<img src={props.item.user.image_link} />
						{props.item.user.username}
					</Label> */}
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
			</Card>
		</>
	);
}

export default CuratorLandingCard;
