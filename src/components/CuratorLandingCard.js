import React from "react";
import { Card, Button, Image, Header } from "semantic-ui-react";
import history from "../util/history";

function CuratorLandingCard(props) {
	const routeChange = (t) => {
		history.push(t);
		window.location.href = window.location.href;
	};
	return (
		<>
			<Card className="eq-card" fluid key={props.item.id}>
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
