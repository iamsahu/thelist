import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
// import 'semantic-ui-forest-themes/semantic.lumen.min.css'
import "semantic-ui-css/semantic.min.css"; //readable
import "./App.css";
import "react-interactions/dist/main.css";
import mixpanel from "mixpanel-browser";
import { MixpanelProvider } from "react-mixpanel";
import {
	Accordion,
	Menu,
	Button,
	Sidebar,
	Image,
	Icon,
	Dropdown,
} from "semantic-ui-react";
import { UserProvider } from "./context/UserContext";
import { ContentProvider } from "./context/ContentContext";
import MenuBar from "./components/menu";
import BottomBar from "./components/BottomBar";
import AddList from "./components/AddList";
import Home2 from "./pages/Home2";
import Home from "./pages/Home";
import HomeNoLogin from "./pages/HomeNoLogin";
import Curator from "./pages/Curator";
import Curator2 from "./pages/Curator2";
import ExploreMobile from "./pages/ExploreMobile";
import SearchResults from "./pages/SearchResults";
import DataEntry from "./pages/DataEntry";
// import SignUpComplete from './pages/SignUpComplete'
// import ListDisplay from './pages/ListDisplay'
// import TagDisplay from './pages/TagDisplay'
import history from "./util/history";
import { useAuth0 } from "./react-auth0-spa";
import { toast } from "react-toastify";
import { DoesUserExists, InsertUser } from "./util/graphqlExecutor";
import { Container, Responsive } from "semantic-ui-react";
import Mixpanel from "./util/mix";

import ReactGA from "react-ga";

toast.configure();
function App() {
	// mixpanel.init("4521493075a15cf75d66df3581c5410e");
	ReactGA.initialize("UA-166934260-1");
	history.listen((location) => {
		ReactGA.set({ page: location.pathname });
		ReactGA.pageview(location.pathname);
	});

	//   history.listen((location) => {
	//     if(location.pathname.includes('/user')) {
	//       let rootURL = location.pathname.split('/')[1]
	//       let userPage = location.pathname.split('/')[3]

	//       let pageHit = `/${rootURL}/${userPage}`
	//       ReactGA.pageview(pageHit)
	//     } else {
	//       ReactGA.set({ page: location.pathname });
	//       ReactGA.pageview(location.pathname)
	//     }
	//  });

	const userC = { curator_id: "", loggedin_user_id: "", image_link: "" };
	const [content, contentChange] = useState({
		currentTag: "None",
		contentType: "lists",
		lists: {},
		tags: {},
		currentList: "",
		currentTagID: "",
		currentListID: "",
	}); //Passing a function so that the consumer can change the content
	const {
		loading,
		isAuthenticated,
		user,
		loginWithRedirect,
		logout,
	} = useAuth0();
	const [userExists, SetExists] = useState(false);
	const [loadingT, setloading] = useState(true);
	const [userCheckStatus, setuserCheckStatus] = useState(true);
	// mixpanel.identify(userC.loggedin_user_id)
	// mixpanel.track("Video play", {"genre": "hip-hop", "duration in seconds": 42});

	const callback = (list) => {
		list.getEntries().forEach((entry) => {
			ReactGA.timing({
				category: "Load Performace",
				variable: "Server Latency",
				value: entry.responseStart - entry.requestStart,
			});
		});
	};

	var observer = new PerformanceObserver(callback);
	observer.observe({ entryTypes: ["navigation"] });

	const checkUser = (user_id) => {
		DoesUserExists({ user_id: user_id }).then((response) => {
			if (response.user.length > 0) {
				// console.log("more")
				SetExists(true);
				// mixpanel.identify(userC.loggedin_user_id)
			} else {
				SetExists(false);
				if (!userExists) {
					InsertUser({
						id: user_id,
						image_link: user.picture,
						username: user.name,
					})
						.then((response) => {
							console.log(response);
						})
						.catch((error) => {
							// console.log(error)
						});
				}
			}
			setloading(false);
		});
		// console.log("UserCheck")
	};

	if (!loading && userCheckStatus) {
		if (typeof user !== "undefined") {
			// console.log(user)
			var userID = user["sub"].split("|")[1];
			userC["curator_id"] = userID;
			userC["loggedin_user_id"] = userID;
			userC["name"] = user["name"];
			userC["nickname"] = user["nickname"];
			userC["image_link"] = user["picture"];
			// setuserCheckStatus(false)
			checkUser(userID);
			Mixpanel.identify(userID);
			// var props = {user:userID}
			// console.log("here")
		}
	}
	// console.log(userID)
	// console.log("App")
	const [accState, setaccState] = useState(0);
	const [lastCurator, setlastCurator] = useState("");
	const [visible, setvisible] = useState(false);
	const [tags, setTags] = useState(null);
	const [lists, setLists] = useState(null);
	const [activeItem, setActiveItem] = useState("");

	const options = [
		{ key: "user", text: "Account", icon: "user", value: "user" },
		{ key: "settings", text: "Settings", icon: "settings", value: "settings" },
		{ key: "sign-out", text: "Sign Out", icon: "sign out", value: "logout" },
	];

	const handleChangeList = (e, { value }) => {
		// console.log(value)
		switch (value) {
			case "user":
				history.push("/" + user["sub"].split("|")[1]);
				break;
			case "settings":
				break;
			case "logout":
				//TODO: in the future write code here to handle the proper redirect
				logout({ returnTo: process.env.REACT_APP_BASE_URL });
				break;
			default:
				break;
		}
	};

	if (content.tags.length > 0 && tags === null && userC.curator_id !== "") {
		// console.log('here')
		// console.log(userC)
		// console.log(content.tags)
		if (lastCurator === "" || lastCurator !== userC.curator_id) {
			// console.log('New Fetch')
			var tagsTemp = content.tags.map((tag) => ({
				as: "a",
				content: tag.text,
				key: tag.key,
				href: `/${userC.curator_id}/tags/${tag.value}`,
			}));
			var listsTemp;
			if (content.lists.length > 0) {
				// console.log(content.lists)
				listsTemp = content.lists.map((list) => ({
					as: "a",
					content: list.text,
					key: list.key,
					href: `/${userC.curator_id}/lists/${list.id}`,
				}));
			}
			setlastCurator(userC.curator_id);
			setTags(tagsTemp);
			setLists(listsTemp);
		}
		// console.log(tagsTemp)
	}

	function onToggle() {
		setvisible(!visible);
	}

	const onPusherClick = () => {
		if (visible) setvisible(false);
	};

	const handleClick = (e, titleProps) => {
		console.log(titleProps);
		const { index } = titleProps;
		const { activeIndex } = accState;
		const newIndex = activeIndex === index ? -1 : index;
		setaccState(newIndex);
		// this.setState({ activeIndex: newIndex })
	};

	return (
		// <MixpanelProvider mixpanel={mixpanel}>
		<UserProvider value={userC}>
			<ContentProvider value={[content, contentChange]}>
				<Router history={history}>
					<Responsive {...Responsive.onlyMobile}>
						<Sidebar.Pushable>
							<Sidebar
								as={Menu}
								animation="overlay"
								icon="labeled"
								inverted
								// items={leftItems}
								vertical
								visible={visible}
							>
								<Menu.Item position="right">
									<Button>
										<Link to="/explore"> Explore</Link>
									</Button>
								</Menu.Item>

								<Accordion as={Menu} vertical inverted>
									<Menu.Item>
										<Accordion.Title
											active={accState === 0}
											content="Tags"
											index={0}
											onClick={handleClick}
										/>
										<Accordion.Content
											active={accState === 0}
											content={
												tags !== null &&
												tags.map((item) => <Menu.Item {...item} />)
											}
										/>
									</Menu.Item>
									<Menu.Item>
										<Accordion.Title
											active={accState === 1}
											content="Lists"
											index={1}
											onClick={handleClick}
										/>
										<Accordion.Content
											active={accState === 1}
											content={
												lists !== null &&
												lists.map((item) => <Menu.Item {...item} />)
											}
										/>
									</Menu.Item>
								</Accordion>
							</Sidebar>

							<Sidebar.Pusher
								dimmed={visible}
								onClick={onPusherClick}
								style={{ minHeight: "10vh" }}
							>
								<Menu fixed="top" inverted>
									<Menu.Item>
										<Image
											size="mini"
											src={`${process.env.REACT_APP_BASE_URL}/thelistspace.png`}
										/>
									</Menu.Item>
									<Menu.Item onClick={onToggle}>
										<Icon name="sidebar" />
									</Menu.Item>
									<Menu.Menu position="right">
										<Menu.Item>
											{!isAuthenticated && (
												<>
													<Menu.Item
														position="right"
														name="Login"
														active={activeItem === "Login"}
														onClick={() => {
															console.log("Login");
															Mixpanel.track("Login", {
																genre: "hip-hop",
																"duration in seconds": 42,
															});
															loginWithRedirect({});
														}}
													/>
												</>
											)}
											{isAuthenticated && !loading && (
												<>
													<Menu.Item position="right" fitted="vertically">
														<AddList />
													</Menu.Item>

													<Menu.Item position="right">
														<Dropdown
															fluid
															trigger={
																<>
																	<Image avatar src={user.picture} />
																	{user.name}
																</>
															}
															options={options}
															pointing="top right"
															icon={null}
															onChange={handleChangeList}
														/>
													</Menu.Item>
												</>
											)}
										</Menu.Item>
									</Menu.Menu>
								</Menu>
								<div style={{ marginTop: "3em" }}>
									<Container style={{ marginTop: "3em" }} fluid>
										<Switch>
											<Route exact path="/explore" component={Home2} />
											<Route exact path="/dataentry" component={DataEntry} />
											<Route exact path="/search" component={SearchResults} />
											<Route
												exact
												path="/:user/:contenttype/:contentid"
												component={Curator2}
											/>
											<Route
												exact
												path="/:user/:contenttype"
												component={Curator2}
											/>
											<Route exact path="/:user" component={Curator2} />
											{isAuthenticated && !loading && !loadingT ? (
												<Route
													path="/"
													render={(props) => (
														<Curator2
															user={userC["curator_id"]}
															isAuthed={true}
														/>
													)}
												/>
											) : (
												<Route exact path="/" component={HomeNoLogin} />
											)}
										</Switch>
									</Container>
								</div>
							</Sidebar.Pusher>
						</Sidebar.Pushable>
					</Responsive>
					<Responsive minWidth={Responsive.onlyTablet.minWidth}>
						<MenuBar user={user} />
						<div className="novscroll">
							<Container style={{ marginTop: "3em", height: "85vh" }} fluid>
								<Switch>
									<Route exact path="/explore" component={Home2} />
									<Route exact path="/dataentry" component={DataEntry} />
									<Route exact path="/search" component={SearchResults} />
									<Route
										exact
										path="/:user/:contenttype/:contentid"
										component={Curator2}
									/>
									<Route
										exact
										path="/:user/:contenttype"
										component={Curator2}
									/>
									<Route exact path="/:user" component={Curator2} />
									{isAuthenticated && !loading && !loadingT ? (
										<Route
											path="/"
											render={(props) => (
												<Curator2 user={userC["curator_id"]} isAuthed={true} />
											)}
										/>
									) : (
										<Route exact path="/" component={HomeNoLogin} />
									)}
								</Switch>
							</Container>
						</div>
					</Responsive>
				</Router>
			</ContentProvider>
		</UserProvider>
		// </MixpanelProvider>
	);
}

export default App;
