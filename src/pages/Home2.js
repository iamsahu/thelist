import React, { useState, useReducer, Suspense, lazy } from "react";

import {
	Card,
	Grid,
	Divider,
	Header,
	Message,
	Responsive,
	Menu,
	Container,
} from "semantic-ui-react";

// import PopularProfile from "../components/PopularProfile";
// import HomeListsDisplay from "../components/HomeListsDisplay";
// import HomeTagsDisplay from "../components/HomeTagsDisplay";
// import Explore2 from "../components/Explore2";
import CommonLoader from "../components/CommonLoader";
const PopularProfile = lazy(() => import("../components/PopularProfile"));
const HomeListsDisplay = lazy(() => import("../components/HomeListsDisplay"));
const HomeTagsDisplay = lazy(() => import("../components/HomeTagsDisplay"));
const Explore2 = lazy(() => import("../components/Explore2"));

function Home2(props) {
	const [welcomeBox, setwelcomeBox] = useState(true);
	const [activeItem, setactiveItem] = useState(<PopularProfile />);
	const [activeTab, setactiveTab] = useState("curators");

	// function reducer(state, action) {
	//     switch (action.type) {
	//       case 'lists':
	//         return <HomeListsDisplay/>
	//       case 'tags':
	//         return <HomeTagsDisplay/>
	//     case 'curators':
	//         return <PopularProfile/>
	//       default:
	//         throw new Error();
	//     }
	// }

	// const [state, dispatch] = useReducer(
	//     reducer,
	//     {activeItem: 'lists'}
	// );

	function handleDismiss() {
		setwelcomeBox(false);
	}

	const items = [
		"List Space is a place where you can curate digital content from multiple sources in one place to share.",
		"You can also find interesting curations done by our selection of tastemakers.",
		"Browse content by lists or find interesting tags to browse.",
	];

	const handleItemClick = (e, { name }) => {
		// dispatch({ activeItem:name })
		switch (name) {
			case "lists":
				setactiveItem(<Explore2 />);
				setactiveTab("lists");
				break;
			case "tags":
				setactiveItem(<HomeTagsDisplay />);
				setactiveTab("tags");
				break;
			case "curators":
				setactiveItem(<PopularProfile />);
				setactiveTab("curators");
				break;
			default:
				throw new Error();
		}
	};
	// content.contentType='Tags'
	// content.currentTagID = tagid

	return (
		<>
			<Responsive {...Responsive.onlyMobile}>
				<Container style={{ marginTop: "5em" }} fluid>
					<div class="bg-gray-100">
						{/* {welcomeBox ? (
						<Message onDismiss={handleDismiss}>
							<Message.Header>Welcome to List Space</Message.Header>
							<Message.List items={items} />
						</Message>
					) : (
						<div></div>
					)} */}

						<Menu pointing secondary>
							<Menu.Item
								name="curators"
								active={activeTab === "curators"}
								onClick={handleItemClick}
							/>
							<Menu.Item
								name="lists"
								active={activeTab === "lists"}
								onClick={handleItemClick}
							/>
							<Menu.Item
								name="tags"
								active={activeTab === "tags"}
								onClick={handleItemClick}
							/>
						</Menu>
						<Suspense fallback={<CommonLoader />}>{activeItem}</Suspense>
					</div>
				</Container>
			</Responsive>
			<Responsive minWidth={Responsive.onlyTablet.minWidth}>
				{/* {welcomeBox ? (
					<Message onDismiss={handleDismiss}>
						<Message.Header>Welcome to List Space</Message.Header>
						<Message.List items={items} />
					</Message>
				) : (
					<div></div>
				)} */}
				<Grid
					style={{
						"padding-top": "20px",
					}}
				>
					{/* <Grid.Column width={3}>
						{/* <Header as='h3'>Tags</Header>
                    <Divider/>
                    <HomeTagsDisplay/> */}
					{/* </Grid.Column> */}
					<Grid.Column>
						<Menu pointing secondary>
							<Menu.Item
								name="curators"
								active={activeTab === "curators"}
								onClick={handleItemClick}
							/>
							<Menu.Item
								name="lists"
								active={activeTab === "lists"}
								onClick={handleItemClick}
							/>
							<Menu.Item
								name="tags"
								active={activeTab === "tags"}
								onClick={handleItemClick}
							/>
						</Menu>
						{/* <Header as='h3'>Lists</Header>
                    <Divider/>
                    <HomeListsDisplay/> */}
						<div className="scrollyExplore pl-2 pr-2 mr-2 bg-gray-100">
							<Suspense fallback={<CommonLoader />}>{activeItem}</Suspense>
						</div>
					</Grid.Column>
					{/* <Grid.Column width={4}> */}
					{/* <Header as='h3'>Curators</Header>
                    <Divider/>
                    <PopularProfile/> */}
					{/* </Grid.Column> */}
				</Grid>
				{/* </div> */}
			</Responsive>
		</>
	);
}

export default React.memo(Home2);
