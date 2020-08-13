import React from "react";
import { Card, Image, Header, Button, Label } from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import Follow from "./Follow";

function LandingPageCard(props) {
	const history = useHistory();
	const routeChange = (t) => {
		history.push(t);
	};
	return (
		<>
			<Card key={props.result.id} fluid style={{ height: "100%" }} raised>
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
					{/* <Card.Meta>
						<Label color="olive" size="tiny">
							Product
						</Label>
					</Card.Meta> */}
					{/* <Card.Meta>by {props.result.user.username}</Card.Meta> */}
					<Card.Description>{props.result.description}</Card.Description>
				</Card.Content>
				{/* <Card.Content
					description={props.result.description}
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
			</Card>
		</>
	);
}

export default LandingPageCard;
