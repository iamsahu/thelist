import React, { useState, useContext } from "react";
import { Menu, Dropdown, Image, Button, Responsive } from "semantic-ui-react";

import AddList from "./AddList";
import TopSearch from "./TopSearch";
import { useAuth0 } from "../react-auth0-spa";
// import {MixpanelConsumer } from 'react-mixpanel';
import UserContext from "../context/UserContext";
import ContentContext from "../context/ContentContext";
import Mixpanel from "../util/mix";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

function MenuBar(props) {
	const {
		user,
		isAuthenticated,
		loading,
		loginWithRedirect,
		logout,
	} = useAuth0();
	const [activeItem, setActiveItem] = useState("");
	const handleItemClick = (e, { name }) => setActiveItem(name);
	const [name, setname] = useState("Find");
	const [image, setimage] = useState(1);
	const [visible, setvisible] = useState(false);
	const [content, contentChange] = useContext(ContentContext);
	const [tags, setTags] = useState(null);
	const [lists, setLists] = useState(null);
	const [userC, userChange] = useContext(UserContext);
	const history = useHistory();
	const [accState, setaccState] = useState(0);
	const [lastCurator, setlastCurator] = useState("");

	const options = [
		{ key: "user", text: "Your Page", icon: "user", value: "user" },
		{
			key: "manage",
			text: "Manage Content",
			icon: "clipboard list",
			value: "manage",
		},
		{ key: "settings", text: "Settings", icon: "setting", value: "settings" },
		{
			key: "feedback",
			text: "Request Feature",
			icon: "bug",
			value: "feedback",
		},
		{
			key: "pocket",
			text: "Pocket Consumption",
			icon: "setting",
			value: "pocket",
		},
		{ key: "sign-out", text: "Sign Out", icon: "sign out", value: "logout" },
	];

	const handleChangeList = (e, { value }) => {
		// console.log(value)
		switch (value) {
			case "user":
				history.push("/" + user["sub"].split("|")[1]);
				window.location.href = window.location.href;
				break;
			case "manage":
				history.push("/manage/" + user["sub"].split("|")[1]);
				break;
			case "settings":
				history.push("/settings/" + user["sub"].split("|")[1]);
				break;
			case "pocket":
				history.push("/pocketconsumption/" + user["sub"].split("|")[1]);
				break;
			case "feedback":
				history.push("/feedback");
				break;
			case "logout":
				//TODO: in the future write code here to handle the proper redirect
				userChange((userC) => {
					return { ...userC, loggedin_user_id: "" };
				});
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

	const mobileMenuAuthenticated = "";
	const mobileMenuNonAuthenticated = "";
	const desktopMenuAuthenticated = "";
	const desktopMenuNonAuthenticated = "";

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

	const routeChange = (t) => {
		history.push(t);
		window.location.href = window.location.href;
	};

	return (
		<div>
			<Responsive {...Responsive.onlyMobile}>
				<slide isOpen={false}>
					<a>Hello</a>
				</slide>
			</Responsive>

			<Responsive minWidth={Responsive.onlyTablet.minWidth}>
				<Menu
					fixed="top"
					borderless={true}
					stackable
					inverted
					style={{
						height: "60px",
						"box-shadow": "0px 0px 5px 0px rgba(0, 0, 0, 0.20)",
						// "height": "60px",
						// "box-shadow": "0px 0px 5px 0px rgba(0, 0, 0, 0.20)",
					}}
				>
					{/* <Link to={`/`}> */}
					<Menu.Item
						name="TheListSpace"
						active={activeItem === "curato"}
						onClick={() => history.push("/")}
					/>
					{/* </Link> */}
					<Menu.Item>
						<TopSearch />
					</Menu.Item>

					<Menu.Menu position="right">
						{!isAuthenticated && (
							<>
								<Menu.Item position="right">
									<button
										class="mx-auto lg:mx-0 gradient bg-white text-gray-700 font-bold rounded-md py-3 px-4 shadow-lg hover:bg-black hover:text-white"
										onClick={() => {
											var t = `/explore`;
											routeChange(t);
										}}
									>
										Explore
									</button>
									{/* <Button
										onClick={() => {
											var t = `/explore`;
											routeChange(t);
										}}
									>
										Explore
									</Button> */}
								</Menu.Item>
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
										loginWithRedirect({
											appState: {
												targetUrl: window.location.href.replace(
													process.env.REACT_APP_BASE_URL,
													""
												),
											},
										});
									}}
								>
									Login/Sign Up
								</Menu.Item>
							</>
						)}
						{isAuthenticated && !loading && (
							<>
								<Menu.Item position="right" fitted="vertically">
									<button
										className="mr-1 gradient bg-white text-black font-bold rounded-md py-3 px-4 shadow-lg hover:bg-black hover:text-white"
										onClick={() => {
											var t = `/explore`;
											routeChange(t);
										}}
									>
										Explore
									</button>
									{/* <Button
										onClick={() => {
											var t = `/explore`;
											routeChange(t);
										}}
										style={{
											background: "#ffffff",
										}}
									>
										Explore
									</Button> */}
									<AddList />
								</Menu.Item>
								{/* <Menu.Item position="right" fitted="vertically">
									
								</Menu.Item> */}
								{/* <Menu.Item position='right' fitted='vertically'>
              <AddItem/>
            </Menu.Item> */}
								<Menu.Item position="right">
									<Dropdown
										fluid
										// trigger={<><Image avatar src='https://react.semantic-ui.com/images/avatar/large/steve.jpg'/>{user.name}</>}
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
					</Menu.Menu>
				</Menu>
			</Responsive>
		</div>
	);
}

export default MenuBar;
