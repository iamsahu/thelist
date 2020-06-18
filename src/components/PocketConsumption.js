import React from "react";
import { Card, Button, Image, Checkbox, Item } from "semantic-ui-react";

function PocketConsumption(props) {
	var t = props.content.map((item) => (
		<Item key={item.id}>
			<Item.Image size="tiny" src={item.auto_image} />
			<Item.Content>
				<Item.Header target="_blank" as="a" href={item.link}>
					{item.title}
				</Item.Header>
				<Item.Description>
					<p>{item.auto_description.substring(0, 240)}</p>
				</Item.Description>
				<Item.Extra>
					<Button floated="right">Action</Button>
				</Item.Extra>
			</Item.Content>
		</Item>
		// <Card fluid raised key={item.id}>
		// 	<Image src={item.auto_image} wrapped ui={false} />
		// 	<Card.Content>
		// 		<Card.Header>{item.title}</Card.Header>
		// 		<Card.Description>{item.auto_description}</Card.Description>
		// 	</Card.Content>
		// 	<Card.Content extra>
		// 		<Button>Move to a list</Button>
		// {/* <Checkbox label="Add to newsletter" /> */}
		// {/* </Card.Content> */}

		// {/* <Card.Content>
		// 	<Card.Header>
		// 		<Header as="h2">{item.title}</Header>
		// 	</Card.Header>
		// </Card.Content>

		// <Card.Content
		// 	description={item.auto_description}
		// 	style={{
		// 		border: "none",
		// 	}}
		// /> */}
		// {/* </Card> */}
	));
	// console.log(t);

	return t;
}

export default PocketConsumption;
