import React, { useState, useContext } from "react";
import {
	Menu,
	Dropdown,
	Image,
	Button,
	Responsive,
	Sidebar,
	Icon,
	Accordion,
} from "semantic-ui-react";
import AddItem from "./AddItem";
import AddList from "./AddList";
import TopSearch from "./TopSearch";
import { useAuth0 } from "../react-auth0-spa";
// import {MixpanelConsumer } from 'react-mixpanel';
import UserContext from "../context/UserContext";
import ContentContext from "../context/ContentContext";
import Mixpanel from "../util/mix";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { slide } from "react-burger-menu";

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

	return (
		<div>
			<Responsive {...Responsive.onlyMobile}>
				<slide isOpen={false}>
					<a>Hello</a>
					{/* <Accordion as={Menu} vertical inverted>
          <Menu.Item>
            <Accordion.Title
            active={accState === 0}
            content='Tags'
            index={0}
            onClick={handleClick}/>
            <Accordion.Content active={accState === 0} content={(tags!==null)&&tags.map( item => (
            <Menu.Item {...item} />
          ))} />
          </Menu.Item>
          <Menu.Item>
            <Accordion.Title
            active={accState === 1}
            content='Lists'
            index={1}
            onClick={handleClick}/>
            <Accordion.Content active={accState === 1} content={(lists!==null)&&lists.map( item => (
            <Menu.Item {...item} />
          ))} />
          </Menu.Item>
        </Accordion> */}
				</slide>
				{/* <Sidebar.Pushable>
        <Sidebar as={Menu}
        animation="overlay"
        icon="labeled"
        inverted
        // items={leftItems}
        vertical
        visible={visible}
        
      >
        <Menu.Item position='right'>
          <Button>
            <Link to='/explore'> Explore</Link>
          </Button>
        </Menu.Item>

        <Accordion as={Menu} vertical inverted>
          <Menu.Item>
            <Accordion.Title
            active={accState === 0}
            content='Tags'
            index={0}
            onClick={handleClick}/>
            <Accordion.Content active={accState === 0} content={(tags!==null)&&tags.map( item => (
            <Menu.Item {...item} />
          ))} />
          </Menu.Item>
          <Menu.Item>
            <Accordion.Title
            active={accState === 1}
            content='Lists'
            index={1}
            onClick={handleClick}/>
            <Accordion.Content active={accState === 1} content={(lists!==null)&&lists.map( item => (
            <Menu.Item {...item} />
          ))} />
          </Menu.Item>
        </Accordion>

      </Sidebar>

      <Sidebar.Pusher dimmed={visible}
        onClick={onPusherClick}
        style={{ minHeight: "10vh" }}
      >
        <Menu fixed="top" inverted>
          <Menu.Item>
            <Image size="mini" src={`${process.env.REACT_APP_BASE_URL}/thelistspace.png`} />
          </Menu.Item>
          <Menu.Item onClick={onToggle}>
            <Icon name="sidebar" />
          </Menu.Item>
          <Menu.Menu position="right">
            
            <Menu.Item>
            {!isAuthenticated && (
              <>
              <Menu.Item position='right'
                name='Login'
                active={activeItem === 'Login'}
                onClick={()=>{
                  console.log("Login")
                  Mixpanel.track("Login", {"genre": "hip-hop", "duration in seconds": 42});
                  loginWithRedirect({})
                }}
              />
              </>
            )}
            {isAuthenticated &&!loading&& (
              <>
                <Menu.Item position='right' fitted='vertically'>
                  <AddList/>
                </Menu.Item>
                
                <Menu.Item position='right'>
                  <Dropdown
                    fluid
                    trigger={<><Image avatar src={user.picture}/>{user.name}</>}
                    options={options}
                    pointing='top right'
                    icon={null}
                    onChange={handleChangeList}
                  />
                </Menu.Item>
              </>
            )}
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </Sidebar.Pusher>
      </Sidebar.Pushable> */}
			</Responsive>

			<Responsive minWidth={Responsive.onlyTablet.minWidth}>
				<Menu fixed="top" borderless={true} inverted stackable>
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
									<Button>
										<Link to="/explore"> Explore</Link>
									</Button>
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
										loginWithRedirect({});
									}}
								/>
							</>
						)}
						{isAuthenticated && !loading && (
							<>
								<Menu.Item position="right" fitted="vertically">
									<Button>
										<Link to="/explore"> Explore</Link>
									</Button>
								</Menu.Item>
								<Menu.Item position="right" fitted="vertically">
									<AddList />
								</Menu.Item>
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
