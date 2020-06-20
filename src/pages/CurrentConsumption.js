import React, { useState } from "react";
import {
	Grid,
	Container,
	Item,
	Header,
	Button,
	Checkbox,
	Modal,
	Image,
	Icon,
	Label,
} from "semantic-ui-react";
import {
	GetConsumptionOfUser,
	GetConsumptionOfUserBetween,
} from "../util/graphqlExecutor";
import TwitterConsumption from "../components/TwitterConsumption";
import MediumConsumption from "../components/MediumConsumption";
import YouTubeConsumption from "../components/YouTubeConsumption";
import PocketConsumption from "../components/PocketConsumption";
import youtube from "youtube-id";
import YouTube from "react-youtube";
import ReactLinkify from "react-linkify";

function CurrentConsumption(props) {
	const [consumption, setconsumption] = useState("");
	const loadData = (start, end, user) => {
		// GetConsumptionOfUser(user).then((response) => {
		// 	// console.log(response);
		// 	setconsumption(response);
		// });
		GetConsumptionOfUserBetween(start, end, user).then((response) => {
			// console.log(response);
			setconsumption(response);
		});
	};

	let curr = new Date();
	// curr.setDate(curr.getDate() - 7);
	let week = [];

	for (let i = 0; i <= 7; i++) {
		let first = curr.getDate() - curr.getDay() + i;
		let day = new Date(curr.setDate(first)).toISOString().slice(0, 10);
		week.push(day);
	}
	// console.log(week);
	// console.log(week[0]);
	// console.log(week[6]);

	loadData(week[0], week[7], props.match.params.user);
	if (consumption === "") return <div>Loading</div>;

	var id;
	var tt;
	const opts = {
		height: "40",
		width: "80",
		playerVars: {
			// https://developers.google.com/youtube/player_parameters
			autoplay: 0,
		},
	};

	var pocketItems,
		mediumItems,
		twitterItems,
		youtubeItems = [];
	function onChange(event, data) {
		if (data.checked) {
			switch (data.__typename) {
				case "items_youtube":
					youtubeItems.push(data);
					break;
				case "items_medium":
					mediumItems.push(data);
					break;
				case "items_twitter":
					twitterItems.push(data);
					break;
				case "items_pocket":
					pocketItems.push(data);
					break;
				default:
					break;
			}
		} else {
			switch (data.__typename) {
				case "items_youtube":
					// youtubeItems.push(data);
					youtubeItems = youtubeItems.filter((item) => item !== data);
					break;
				case "items_medium":
					// mediumItems.push(data);
					mediumItems = mediumItems.filter((item) => item !== data);
					break;
				case "items_twitter":
					// twitterItems.push(data);
					twitterItems = twitterItems.filter((item) => item !== data);
					break;
				case "items_pocket":
					// pocketItems.push(data);
					pocketItems = pocketItems.filter((item) => item !== data);
					break;
				default:
					break;
			}
		}
	}

	return (
		<div style={{ marginTop: "3em", paddingTop: "10px" }}>
			<Header>This week's consumption!</Header>
			{/* <Modal trigger={<Button>Long Modal</Button>}>
				<Modal.Header>Profile Picture</Modal.Header>
				<Modal.Content image>
					<Image
						wrapped
						size="medium"
						src="https://react.semantic-ui.com/images/wireframe/image.png"
					/>
					<Modal.Description>
						<Header>Modal Header</Header>
						<p>
							This is an example of expanded content that will cause the modal's
							dimmer to scroll
						</p>
						<Image src="https://react.semantic-ui.com/images/wireframe/paragraph.png" />
						<Image src="https://react.semantic-ui.com/images/wireframe/paragraph.png" />
						<Image src="https://react.semantic-ui.com/images/wireframe/paragraph.png" />
						<Image src="https://react.semantic-ui.com/images/wireframe/paragraph.png" />
						<Image src="https://react.semantic-ui.com/images/wireframe/paragraph.png" />
						<Image src="https://react.semantic-ui.com/images/wireframe/paragraph.png" />
						<Image src="https://react.semantic-ui.com/images/wireframe/paragraph.png" />
						<Image src="https://react.semantic-ui.com/images/wireframe/paragraph.png" />
					</Modal.Description>
				</Modal.Content>
				<Modal.Actions>
					<Button primary>
						Proceed <Icon name="right chevron" />
					</Button>
				</Modal.Actions>
			</Modal> */}
			<div className="scrollyConsump">
				<Grid divided>
					<Grid.Column width={4}>
						<Label as="a" color="teal" tag>
							Pocket
						</Label>
						<Item.Group divided relaxed="very">
							{/* <PocketConsumption content={consumption["items_pocket"]} /> */}
							{consumption["items_pocket"].map((item) => (
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
											<Checkbox
												id={item.id}
												label="Add to newsletter"
												data={item}
												onChange={onChange}
											/>
										</Item.Extra>
									</Item.Content>
								</Item>
							))}
						</Item.Group>
					</Grid.Column>
					<Grid.Column width={4}>
						<Label as="a" color="blue" tag>
							Twitter
						</Label>
						<Item.Group divided relaxed="very">
							{/* <TwitterConsumption content={consumption["items_twitter"]} /> */}
							{consumption["items_twitter"].map(
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
													<Checkbox
														id={item.id}
														label="Add to newsletter"
														data={item}
														onChange={onChange}
													/>
												</Item.Extra>
											</Item.Content>
										</Item>
									)
								)
							)}
						</Item.Group>
					</Grid.Column>

					<Grid.Column width={4}>
						<Label as="a" color="red" tag>
							YouTube
						</Label>
						<Item.Group divided relaxed="very">
							{/* <YouTubeConsumption content={consumption["items_youtube"]} /> */}
							{consumption["items_youtube"].map(
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
													<Checkbox
														id={item.id}
														label="Add to newsletter"
														data={item}
														onChange={onChange}
													/>
												</Item.Extra>
											</Item.Content>
										</Item>
									)
								)
							)}
						</Item.Group>
					</Grid.Column>

					<Grid.Column width={4}>
						<Label as="a" color="black" tag>
							Medium
						</Label>
						<Item.Group>
							{/* <MediumConsumption content={consumption["items_medium"]} /> */}
							{consumption["items_medium"].map((item) => (
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
											<Checkbox
												id={item.id}
												label="Add to newsletter"
												data={item}
												onChange={onChange}
											/>
										</Item.Extra>
									</Item.Content>
								</Item>
							))}
						</Item.Group>
					</Grid.Column>
				</Grid>
			</div>
		</div>
	);
}

export default CurrentConsumption;
