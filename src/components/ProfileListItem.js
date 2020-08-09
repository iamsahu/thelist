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

			<Card key={props.id} fluid style={{ height: "100%" }}>
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
							// onClick={() => {
							// 	var t = `/${process.env.REACT_APP_BASE_URL}/${props.id}`;
							// 	routeChange(t);
							// }}
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
			</Card>
		</>
	);
}

export default ProfileListItem;
