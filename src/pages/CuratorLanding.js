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
import { Grid as GG, Card as CC } from "@material-ui/core";
import { useAuth0 } from "../react-auth0-spa";
import UserProfileDisplay from "../components/UserProfileDisplay";
import CuratorLandingCard from "../components/CuratorLandingCard";

function CuratorLanding(props) {
	// console.log(props);
	const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();
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
		window.location.href = window.location.href;
	};

	if (typeof tagData.tag === "undefined") return <div>Loading</div>;
	return (
		<>
			<Responsive {...Responsive.onlyMobile}>
				<div>
					<div style={{ marginTop: "2rem", marginBottom: "2rem" }}>
						<UserProfileDisplay user={u} />
						{/* <Item.Group>
							<Item>
								<Item.Image avatar size="small" src={userProfile} />
								<Item.Content verticalAlign="middle">
									<Item.Header>{username}</Item.Header>
									<Item.Meta></Item.Meta>
									<Item.Description>
										<ReactLinkify>{description}</ReactLinkify>
									</Item.Description>
									<Item.Extra>
										<Button icon="edit" floated="right"></Button>
									</Item.Extra>
								</Item.Content>
							</Item>
						</Item.Group> */}
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
							<div key="unique">
								<Loader active inline="centered" />
							</div>
						) : (
							listData.lists.map((item) => (
								<CuratorLandingCard item={item} key={item.id} />
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
								<Grid.Column width={4}></Grid.Column>
								<Grid.Column width={10}>
									<div style={{ marginTop: "2rem", marginBottom: "2rem" }}>
										<UserProfileDisplay user={u} />
									</div>
								</Grid.Column>
								<Grid.Column width={2}></Grid.Column>
							</Grid>
						</Container>
					</div>
					<div id="content" className="ui">
						{/* <Container> */}
						<Grid>
							<Grid.Column width={3}></Grid.Column>
							<Grid.Column width={10}>
								<div style={{ paddingBottom: "0.5em" }}>
									MY LISTS
									{isAuthenticated && u === userC.loggedin_user_id && (
										<Button
											floated="right"
											onClick={() => {
												var t = `/manage/${userC.loggedin_user_id}`;
												routeChange(t);
											}}
											// style={{ marginBottom: "50px" }}
										>
											Manage Content
										</Button>
									)}
								</div>
								<Divider />

								{/* <Item.Group divided relaxed="very"> */}
								{/* <StackGrid
									gutterWidth={20}
									gutterHeight={20}
									appearDelay={10}
									columnWidth={300}
									columnHeight={255}
								> */}
								<GG container spacing={3}>
									{listData === "" ? (
										<div>
											<Loader active inline="centered" />
										</div>
									) : (
										listData.lists.map((item) => (
											<GG key={item.id} item xs={4}>
												<CuratorLandingCard item={item} key={item.id} />
											</GG>
										))
									)}
								</GG>
								{/* </StackGrid> */}
								{/* </Item.Group> */}
							</Grid.Column>
							<Grid.Column width={3}>
								I CURATE ABOUT
								<Divider />
								{tagData !== "" &&
									tagData.tag.map((item) => (
										<>
											<Link
												key={item.id}
												to={`/${twitterNumber}/tags/${item.id}`}
											>
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
