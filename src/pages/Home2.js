import React, { useState, useReducer } from "react";

import {
	Card,
	Grid,
	Divider,
	Header,
	Message,
	Responsive,
	Menu,
} from "semantic-ui-react";

import PopularProfile from "../components/PopularProfile";
import HomeListsDisplay from "../components/HomeListsDisplay";
import HomeTagsDisplay from "../components/HomeTagsDisplay";

function Home2(props) {
	const [welcomeBox, setwelcomeBox] = useState(true);
	const [activeItem, setactiveItem] = useState(<HomeListsDisplay />);
	const [activeTab, setactiveTab] = useState("lists");

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
				setactiveItem(<HomeListsDisplay />);
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
				<div>
					{welcomeBox ? (
						<Message onDismiss={handleDismiss}>
							<Message.Header>Welcome to List Space</Message.Header>
							<Message.List items={items} />
						</Message>
					) : (
						<div></div>
					)}

					<Menu pointing secondary>
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
						<Menu.Item
							name="curators"
							active={activeTab === "curators"}
							onClick={handleItemClick}
						/>
					</Menu>

					{activeItem}
				</div>
			</Responsive>
			<Responsive minWidth={Responsive.onlyTablet.minWidth}>
				<div id="content" className="ui">
					{welcomeBox ? (
						<Message onDismiss={handleDismiss}>
							<Message.Header>Welcome to List Space</Message.Header>
							<Message.List items={items} />
						</Message>
					) : (
						<div></div>
					)}
					<Grid columns={3}>
						<Grid.Column width={3}>
							{/* <Header as='h3'>Tags</Header>
                    <Divider/>
                    <HomeTagsDisplay/> */}
						</Grid.Column>
						<Grid.Column width={9}>
							<Menu pointing secondary>
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
								<Menu.Item
									name="curators"
									active={activeTab === "curators"}
									onClick={handleItemClick}
								/>
							</Menu>
							{/* <Header as='h3'>Lists</Header>
                    <Divider/>
                    <HomeListsDisplay/> */}
							{activeItem}
						</Grid.Column>
						<Grid.Column width={4}>
							{/* <Header as='h3'>Curators</Header>
                    <Divider/>
                    <PopularProfile/> */}
						</Grid.Column>
					</Grid>
				</div>
			</Responsive>
		</>
	);
}

export default Home2;
