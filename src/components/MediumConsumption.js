import React from "react";
import { Card, Header, Checkbox, Item, Button } from "semantic-ui-react";

function MediumConsumption(props) {
	return props.content.map((item) => (
		<Item key={item.id}>
			<Item.Image size="tiny" src={item.image} />
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
		// 	<Card.Content>
		// 		<Card.Header>
		// 			<Header as="h2">{item.title}</Header>
		// 		</Card.Header>
		// 	</Card.Content>

		// 	<Card.Content
		// 		description={item.auto_description}
		// 		style={{
		// 			border: "none",
		// 		}}
		// 	/>
		// 	<Card.Content extra>
		// 		<Checkbox label="Add to newsletter" />
		// 	</Card.Content>
		// </Card>
	));
}

export default MediumConsumption;
