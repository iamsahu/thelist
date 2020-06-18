import React from "react";
import { Card, Header, Checkbox, Item, Button } from "semantic-ui-react";
import { TwitterTweetEmbed } from "react-twitter-embed";

function TwitterConsumption(props) {
	var tt;
	return props.content.map(
		(item) => (
			(tt = item.link.split("/")),
			(
				<Item key={item.id}>
					<Item.Content>
						<Item.Header target="_blank" as="a" href={item.link}>
							Tweet by {item.user_name}
						</Item.Header>
						{/* <Item.Meta>Description</Item.Meta> */}
						<Item.Description>{item.description}</Item.Description>
						<Item.Extra>
							<Button floated="right">Action</Button>
						</Item.Extra>
					</Item.Content>
				</Item>
			)
			// <Card fluid raised key={item.id}>
			// 	<Card.Content>
			// 		<TwitterTweetEmbed tweetId={tt.slice(-1)[0]} />
			// 	</Card.Content>
			// 	<Card.Content extra>
			// 		<Checkbox label="Add to newsletter" />
			// 	</Card.Content>
			// </Card>
		)
	);
	return props.content.map((item) => (
		<Card fluid raised key={item.id}>
			<Card.Content>
				<Card.Header>
					<Header as="h2">{item.user_name}</Header>
				</Card.Header>
			</Card.Content>

			<Card.Content
				description={item.description}
				style={{
					border: "none",
				}}
			/>
		</Card>
	));
}

export default TwitterConsumption;
