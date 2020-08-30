import React, { useContext, useState, Suspense, lazy } from "react";
import { Container, Grid, Button, Responsive, Menu } from "semantic-ui-react";
import UserContext from "../context/UserContext";
import { DoesUserExists, GetTagsOfUser } from "../util/graphqlExecutor";
import { Link } from "react-router-dom";
// import ContentContext from "../context/ContentContext";
import history from "../util/history";
import { useAuth0 } from "../react-auth0-spa";
import CommonLoader from "../components/CommonLoader";
// import UserProfileDisplay from "../components/UserProfileDisplay";
// import MyLists from "../components/MyLists";
// import MyFeed from "../components/MyFeed";
// import YourActivities from "../components/YourActivities";
// import BuyMeCoffee from "../components/BuyMeCoffee";

const UserProfileDisplay = lazy(() =>
	import("../components/UserProfileDisplay")
);
const MyLists = lazy(() => import("../components/MyLists"));
const MyFeed = lazy(() => import("../components/MyFeed"));
const YourActivities = lazy(() => import("../components/YourActivities"));
const YourFollow = lazy(() => import("../components/YourFollow"));
const BuyMeCoffee = lazy(() => import("../components/BuyMeCoffee"));

function CuratorLanding(props) {
	// console.log(props);
	const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();
	const [userC, userChange] = useContext(UserContext);
	// const [content, contentChange] = useContext(ContentContext);
	const [userProfile, setuserProfile] = useState(
		"https://react.semantic-ui.com/images/avatar/large/steve.jpg"
	);
	const [username, setusername] = useState("Mojo Jojo");
	const [description, setdescription] = useState(
		"Something witty that tells how witty you are"
	);
	const [twitterNumber, setTwitterNumber] = useState("1");
	const [buymecoffee, setbuymecoffee] = useState("");
	// const [showModal, SetModal] = useState(false);
	// const [id, setid] = useState("");
	const [editState, seteditState] = useState(false);
	// const [listData, setlistData] = useState("");
	const [tagData, settagData] = useState("");
	var u;
	if (typeof props.user !== "undefined") u = props.user;
	else u = props.match.params.user;

	const [activeitem, setactiveitem] = useState(<MyLists user={u} />);
	const [activeTab, setactiveTab] = useState("mylists");

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
						setbuymecoffee(response.user[0]["buymeacoffee"]);
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

	loadUser(u);

	const routeChange = (t) => {
		history.push(t);
		window.location.href = window.location.href;
	};

	if (typeof tagData.tag === "undefined") return <CommonLoader />;

	// var activeItem = "mylists";

	const handleItemClickDesktop = (e, { name }) => {
		// dispatch({ activeItem:name })
		// console.log(name);
		switch (name) {
			case "My Lists":
				setactiveitem(<MyLists user={u} />);
				setactiveTab("mylists");
				break;
			case "Feed":
				setactiveitem(<MyFeed user={u} />);
				setactiveTab("feed");
				break;
			case "Activity":
				setactiveitem(<YourActivities user={u} />);
				setactiveTab("Activity");
				break;
			case "Following":
				setactiveitem(<YourFollow user={u} />);
				setactiveTab("Following");
				break;
		}
	};

	const handleItemClickMobile = (e, { name }) => {
		// dispatch({ activeItem:name })
		switch (name) {
			case "My Lists":
				setactiveitem(<MyLists user={u} />);
				setactiveTab("mylists");
				break;
			case "Feed":
				setactiveitem(<MyFeed user={u} />);
				setactiveTab("feed");
				break;
			case "Activity":
				setactiveitem(<YourActivities user={u} />);
				setactiveTab("Activity");
				break;
			case "Following":
				setactiveitem(<YourFollow user={u} />);
				setactiveTab("Following");
				break;
		}
	};

	return (
		<>
			<Responsive {...Responsive.onlyMobile}>
				<div class="bg-gray-100 w-full -mt-4">
					<UserProfileDisplay user={u} />

					<div class="p-2">
						{isAuthenticated && u === userC.loggedin_user_id && (
							// <button
							// 	class="mx-auto lg:mx-0 gradient mb-1 hover:bg-black hover:text-white font-bold rounded-md py-3 px-4 shadow-lg float-right ml-2 bg-white text-black border-gray-800"
							// 	onClick={() => {
							// 		var t = `/manage/${userC.loggedin_user_id}`;
							// 		routeChange(t);
							// 	}}
							// >
							// 	Manage Content
							// </button>
							<Button
								size="tiny"
								floated="right"
								basic
								color="black"
								onClick={() => {
									var t = `/manage/${userC.loggedin_user_id}`;
									routeChange(t);
								}}
							>
								Manage Content
							</Button>
						)}
						{<BuyMeCoffee coffee={buymecoffee} user={username} />}
						{/* {isAuthenticated &&
									u !== userC.loggedin_user_id &&
									"Buy me coffee"} */}
					</div>
					<Container fluid>
						<div class="mt-8">
							<Menu pointing secondary>
								<Menu.Item
									name="My Lists"
									active={activeTab === "mylists"}
									onClick={handleItemClickMobile}
								/>
								{isAuthenticated && u === userC.loggedin_user_id && (
									<Menu.Item
										name="Feed"
										active={activeTab === "feed"}
										onClick={handleItemClickMobile}
									/>
								)}

								<Menu.Item
									name="Activity"
									active={activeTab === "Activity"}
									onClick={handleItemClickMobile}
								/>
								<Menu.Item
									name="Following"
									active={activeTab === "Following"}
									onClick={handleItemClickMobile}
								/>

								{/* <Menu.Menu position="right">
							<div className="icobutton">
								{isAuthenticated && u === userC.loggedin_user_id && (
									<Button
										size="tiny"
										floated="right"
										basic
										color="black"
										onClick={() => {
											var t = `/manage/${userC.loggedin_user_id}`;
											routeChange(t);
										}}
										// style={{ marginBottom: "50px" }}
									>
										Manage Content
									</Button>
								)}
								{<BuyMeCoffee coffee={buymecoffee} user={username} />}
							</div>
						</Menu.Menu> */}
							</Menu>
						</div>

						{/* <div>
						MY LISTS
						<Divider />
					</div> */}
						<Suspense fallback={<CommonLoader />}>{activeitem}</Suspense>
					</Container>
				</div>
			</Responsive>
			<Responsive minWidth={Responsive.onlyTablet.minWidth}>
				<div className="scrollyCuratorLanding" class="bg-gray-100">
					<div id="content" className="ui">
						<Container fluid>
							{/* <Grid>
								<Grid.Column width={3}></Grid.Column>
								<Grid.Column width={10}>
									<div style={{ marginTop: "2rem", marginBottom: "2rem" }}> */}
							<UserProfileDisplay user={u} />
							{/* </div>
								</Grid.Column>
								<Grid.Column width={3}></Grid.Column>
							</Grid> */}
						</Container>
					</div>
					<div id="content" className="ui">
						{/* <Container> */}
						<Grid>
							<Grid.Column width={3}></Grid.Column>
							<Grid.Column width={10}>
								<Menu pointing secondary>
									<Menu.Item
										name="My Lists"
										active={activeTab === "mylists"}
										onClick={handleItemClickDesktop}
									/>
									{isAuthenticated && u === userC.loggedin_user_id && (
										<Menu.Item
											name="Feed"
											active={activeTab === "feed"}
											onClick={handleItemClickDesktop}
										/>
									)}

									<Menu.Item
										name="Activity"
										active={activeTab === "Activity"}
										onClick={handleItemClickDesktop}
									/>
									<Menu.Item
										name="Following"
										active={activeTab === "Following"}
										onClick={handleItemClickMobile}
									/>

									<Menu.Menu position="right">
										<div className="icobutton">
											{isAuthenticated && u === userC.loggedin_user_id && (
												// <button
												// 	class="mx-auto lg:mx-0 gradient mb-1 hover:bg-black hover:text-white font-bold rounded-md py-3 px-4 shadow-lg float-right ml-2 bg-white text-black border-gray-800"
												// 	onClick={() => {
												// 		var t = `/manage/${userC.loggedin_user_id}`;
												// 		routeChange(t);
												// 	}}
												// >
												// 	Manage Content
												// </button>
												<Button
													size="tiny"
													floated="right"
													basic
													color="black"
													onClick={() => {
														var t = `/manage/${userC.loggedin_user_id}`;
														routeChange(t);
													}}
													// style={{ marginBottom: "50px" }}
												>
													Manage Content
												</Button>
											)}
											{<BuyMeCoffee coffee={buymecoffee} user={username} />}
											{/* {isAuthenticated &&
												u !== userC.loggedin_user_id &&
												"Buy me coffee"} */}
										</div>
									</Menu.Menu>
								</Menu>
								{/* <div style={{ paddingBottom: "0.5em" }}>
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
								<Divider /> */}

								{/* <Item.Group divided relaxed="very"> */}
								{/* <StackGrid
									gutterWidth={20}
									gutterHeight={20}
									appearDelay={10}
									columnWidth={300}
									columnHeight={255}
								> */}
								<Suspense fallback={<CommonLoader />}>{activeitem}</Suspense>
								{/* </StackGrid> */}
								{/* </Item.Group> */}
							</Grid.Column>
							<Grid.Column width={3}>
								<Menu pointing secondary>
									<Menu.Item
										name="I Curate About"
										active={"I Curate About"}
										// onClick={handleItemClickDesktop}
									/>
								</Menu>
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
								{/* I CURATE ABOUT
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
									))} */}
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
