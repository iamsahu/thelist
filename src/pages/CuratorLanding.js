import React, { useContext, useState, useEffect } from "react";
import {
	Container,
	Item,
	Image,
	Grid,
	Header,
	Divider,
	Card,
	Loader,
	Button,
	Label,
	Responsive,
	Icon,
} from "semantic-ui-react";
import UserContext from "../context/UserContext";
import {
	DoesUserExists,
	GetListsOfUser,
	GetTagsOfUser,
} from "../util/graphqlExecutor";
import { Link } from "react-router-dom";
import ReactLinkify from "react-linkify";
import ContentContext from "../context/ContentContext";
import history from "../util/history";
import StackGrid from "react-stack-grid";

function CuratorLanding(props) {
	// console.log(props);
	const [userC, userChange] = useContext(UserContext);
	const [content, contentChange] = useContext(ContentContext);
	const [userProfile, setuserProfile] = useState(
		"https://react.semantic-ui.com/images/avatar/large/steve.jpg"
	);
	const [username, setusername] = useState("Mojo Jojo");
	const [description, setdescription] = useState(
		"Something witty that tells how witty you are"
	);
	const [twitterNumber, setTwitterNumber] = useState("1");
	const [showModal, SetModal] = useState(false);
	const [id, setid] = useState("");
	const [editState, seteditState] = useState(false);
	const [listData, setlistData] = useState("");
	const [tagData, settagData] = useState("");

	const loadUser = (user) => {
		// if(tyuser)
		DoesUserExists({ user_id: user })
			.then((response) => {
				// console.log(response)
				if (typeof response !== "undefined") {
					if (typeof response.user[0] !== "undefined") {
						// console.log(response.user[0]['image_link'])
						setuserProfile(response.user[0]["image_link"]);
						setusername(response.user[0]["username"]);
						setTwitterNumber(response.user[0]["id"]);
						if (response.user[0]["description"] !== null) {
							setdescription(response.user[0]["description"]);
						}
						if (response.user[0].id === userC.loggedin_user_id) {
							seteditState(true);
						} else {
							seteditState(false);
						}
					}
				}
			})
			.catch((error) => console.log(error));
		GetListsOfUser(user)
			.then((response) => {
				// console.log(response);
				setlistData(response);
			})
			.catch((error) => console.log(error));
		GetTagsOfUser(user)
			.then((response) => {
				// console.log(response);
				settagData(response);
			})
			.catch((error) => console.log(error));
	};

	// useEffect(() => {
	// 	loadUser(props.match.params.user);
	// }, []);
	var u;
	if (typeof props.user !== "undefined") u = props.user;
	else u = props.match.params.user;
	loadUser(u);

	const routeChange = (t) => {
		history.push(t);
	};

	if (typeof tagData.tag === "undefined") return <div>Loading</div>;
	return (
		<>
			<Responsive {...Responsive.onlyMobile}>
				<div>
					<div style={{ marginTop: "2rem", marginBottom: "2rem" }}>
						<Item.Group>
							<Item>
								<Item.Image avatar size="small" src={userProfile} />
								<Item.Content verticalAlign="middle">
									{/* <Header as="h1"> */}
									<Item.Header>{username}</Item.Header>
									{/* </Header> */}
									<Item.Meta></Item.Meta>
									<Item.Description>
										<ReactLinkify>{description}</ReactLinkify>
									</Item.Description>
									{/* <Item.Extra>Have added x unique items</Item.Extra> */}
								</Item.Content>
							</Item>
						</Item.Group>
					</div>
					<div>
						MY LISTS
						{/* <span>
									<Button floated="right">Manage Content</Button>
								</span> */}
						<Divider />
					</div>

					<Item.Group divided relaxed="very">
						{listData === "" ? (
							<div>
								<Loader active inline="centered" />
							</div>
						) : (
							listData.lists.map((item) => (
								// <Item key={item.id}>
								// 	<Item.Content>
								// 		<Item.Header as="a">{item.list_name}<Label as="a" color="orange" ribbon="right">
								// 					Specs
								// 					</Label></Item.Header>
								//  		<Item.Description>
								//  			{item.description}
								//  		</Item.Description>
								//  	</Item.Content>
								//  </Item>
								<Card
									fluid
									key={item.id}
									// color="yellow"
									style={
										{
											// "background-color": "#F5DD47",
											// boxShadow: "none",
										}
									}
								>
									{/* <Label color="red" floating icon="heart" /> */}
									<Card.Content>
										<Card.Header>
											<Header as="h2">{item.list_name}</Header>
											{/* <span>
														<Label as="a" color="orange" ribbon="right">
															Specs
														</Label>
													</span> */}
										</Card.Header>
									</Card.Content>

									<Card.Content
										description={item.description}
										style={{
											border: "none",
											"border-top": "none",
										}}
									/>
									<Card.Content
										style={{
											border: "none",
											"border-top": "none",
										}}
									>
										{/* <Image src={item.user.image_link} avatar />
													<span>
														<Link to={`/${item.curator_id}`}>
															{item.user.username}
														</Link>
													</span> */}
										{/* <Button floated="right" basic icon>
											<Icon name="twitter" />
										</Button> */}
										<Button
											size="tiny"
											floated="right"
											basic
											// onClick={() => {
											// 	var t = `/${item.curator_id}/lists/${item.id}`;
											// 	routeChange(t);
											// }}
										>
											<Link to={`/${item.curator_id}/lists/${item.id}`}>
												Read
											</Link>
										</Button>
									</Card.Content>
								</Card>
							))
						)}
					</Item.Group>
				</div>
			</Responsive>
			<Responsive minWidth={Responsive.onlyTablet.minWidth}>
				<div className="scrollyCuratorLanding">
					<div id="content" className="ui">
						<Container fluid>
							<Grid>
								<Grid.Column width={4} inverted></Grid.Column>
								<Grid.Column width={10} inverted>
									<div style={{ marginTop: "2rem", marginBottom: "2rem" }}>
										<Item.Group>
											<Item>
												<Item.Image avatar size="small" src={userProfile} />
												<Item.Content verticalAlign="middle">
													{/* <Header as="h1"> */}
													<Item.Header>{username}</Item.Header>
													{/* </Header> */}
													<Item.Meta></Item.Meta>
													<Item.Description>
														<ReactLinkify>{description}</ReactLinkify>
													</Item.Description>
													{/* <Item.Extra>Have added x unique items</Item.Extra> */}
												</Item.Content>
											</Item>
										</Item.Group>
									</div>
								</Grid.Column>
								<Grid.Column inverted width={2}></Grid.Column>
							</Grid>
						</Container>
					</div>
					<div id="content" className="ui">
						{/* <Container> */}
						<Grid fluid>
							<Grid.Column width={3}></Grid.Column>
							<Grid.Column width={10}>
								<div>
									MY LISTS
									{/* <span>
									<Button floated="right">Manage Content</Button>
								</span> */}
									<Divider />
								</div>

								{/* <Item.Group divided relaxed="very"> */}
								<StackGrid
									gutterWidth={20}
									gutterHeight={20}
									appearDelay={10}
									columnWidth={300}
									columnHeight={255}
								>
									{listData === "" ? (
										<div>
											<Loader active inline="centered" />
										</div>
									) : (
										listData.lists.map((item) => (
											// <Item key={item.id}>
											// 	<Item.Content>
											// 		<Item.Header as="a">{item.list_name}<Label as="a" color="orange" ribbon="right">
											// 					Specs
											// 					</Label></Item.Header>
											//  		<Item.Description>
											//  			{item.description}
											//  		</Item.Description>
											//  	</Item.Content>
											//  </Item>
											<Card
												fluid
												key={item.id}
												// color="yellow"
												style={
													{
														// "background-color": "#F5DD47",
														// boxShadow: "none",
													}
												}
											>
												{/* <Label color="red" floating icon="heart" /> */}
												<Card.Content>
													<Card.Header>
														<Header as="h2">{item.list_name}</Header>
														{/* <span>
														<Label as="a" color="orange" ribbon="right">
															Specs
														</Label>
													</span> */}
													</Card.Header>
												</Card.Content>

												<Card.Content
													description={item.description}
													style={{
														border: "none",
														"border-top": "none",
													}}
												/>
												<Card.Content
													style={{
														border: "none",
														"border-top": "none",
													}}
												>
													{/* <Image src={item.user.image_link} avatar />
													<span>
														<Link to={`/${item.curator_id}`}>
															{item.user.username}
														</Link>
													</span> */}

													<Button
														size="tiny"
														floated="right"
														basic
														// onClick={() => {
														// 	var t = `/${item.curator_id}/lists/${item.id}`;
														// 	routeChange(t);
														// }}
													>
														<Link to={`/${item.curator_id}/lists/${item.id}`}>
															Read
														</Link>
													</Button>
													{/* <Button size="tiny" floated="right" basic icon>
														<Icon color="blue" name="twitter" />
													</Button> */}
												</Card.Content>
											</Card>
										))
									)}
								</StackGrid>
								{/* </Item.Group> */}
							</Grid.Column>
							<Grid.Column width={3}>
								I CURATE ABOUT
								<Divider />
								{tagData !== "" &&
									tagData.tag.map((item) => (
										<>
											<Link to={`/${twitterNumber}/tags/${item.id}`}>
												# {item.name}
											</Link>
											<br />
										</>
									))}
							</Grid.Column>
						</Grid>
						{/* </Container> */}
					</div>
				</div>
			</Responsive>
		</>
	);
}

export default React.memo(CuratorLanding);
