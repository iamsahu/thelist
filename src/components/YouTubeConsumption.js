import React from "react";
import { Card, Header, Checkbox, Item, Button } from "semantic-ui-react";
import youtube from "youtube-id";
import YouTube from "react-youtube";
import ReactLinkify from "react-linkify";

function YouTubeConsumption(props) {
	var id;
	const opts = {
		height: "40",
		width: "80",
		playerVars: {
			// https://developers.google.com/youtube/player_parameters
			autoplay: 0,
		},
	};
	return props.content.map(
		(item) => (
			(id = youtube(item.link)),
			(
				<Item key={item.id}>
					{item.image === "None" ? (
						<Item.Content>
							<YouTube videoId={id} opts={opts} />
						</Item.Content>
					) : (
						<Item.Image size="tiny" src={item.image} />
					)}

					<Item.Content>
						<Item.Header target="_blank" as="a" href={item.link}>
							{item.title}
						</Item.Header>
						<Item.Description>
							<ReactLinkify>
								<p>{item.auto_description.substring(0, 240)}</p>
							</ReactLinkify>
						</Item.Description>
						<Item.Extra>
							<Button floated="right">Action</Button>
						</Item.Extra>
					</Item.Content>
				</Item>
			)
			// <Card fluid raised key={item.id}>
			// 	<Card.Content>
			// 		<YouTube videoId={id} opts={opts} />
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
		)
	);
}

export default YouTubeConsumption;
