import React, { useContext } from "react";
import { List, Tab } from "semantic-ui-react";
import ContentContext from "../context/ContentContext";
import UserContext from "../context/UserContext";
import { useQuery } from "@apollo/react-hooks";
import { COMBINED_FETCH } from "../util/graphql";
import { GetTagsListsUsers, GetBookmarksOfUser } from "../util/graphqlExecutor";
import { Link } from "react-router-dom";
import { MixpanelConsumer } from "react-mixpanel";
import ReactGA from "react-ga";
import Mixpanel from "../util/mix";

function CurationList(props) {
	const [content, contentChange] = useContext(ContentContext);
	const [userC, userChange] = useContext(UserContext);
	// const tagData = useQuery(COMBINED_FETCH, {
	// 	variables: { user_id: userC.curator_id },
	// 	onCompleted: curationTags,
	// });
	// const loading = tagData["loading"];

	var posts;
	var lists;
	const panes = [
		{ menuItem: "Lists", render: () => <Tab.Pane loading>Lists</Tab.Pane> },
		{ menuItem: "Tags", render: () => <Tab.Pane loading> Tags</Tab.Pane> },
		{
			menuItem: "Bookmarks",
			render: () => <Tab.Pane loading> Bookmarks</Tab.Pane>,
		},
	];

	// function curationTags() {
	// 	posts = tagData["data"]["tag"];
	// 	const tempArr = posts.map((post) => ({
	// 		text: post.name,
	// 		key: post.name,
	// 		value: post.id,
	// 	}));

	// 	lists = tagData["data"]["lists"];
	// 	const tempArr2 = lists.map((item) => ({
	// 		text: item.list_name,
	// 		key: item.list_name,
	// 		value: item.id,
	// 		id: item.id,
	// 		list_name: item.list_name,
	// 		// description:item.description,
	// 		curator_id: item.curator_id,
	// 	}));
	// 	// console.log(tagData)
	// 	if (lists.length > 0) {
	// 		// console.log('This was executed')
	// 		// console.log(tagData)
	// 		contentChange((content) => ({
	// 			...content,
	// 			tags: tempArr,
	// 			lists: tempArr2,
	// 		}));
	// 		if (content.contentType === "lists" && content.currentListID === "") {
	// 			console.log("Auto setting list name");
	// 			contentChange((content) => ({
	// 				...content,
	// 				currentList: lists[0].list_name,
	// 				currentListID: lists[0].id,
	// 			}));
	// 		}
	// 	}
	// 	// curationLists()
	// }

	function curationLists() {
		// lists = tagData["data"]["lists"];
		// const tempArr = lists.map((item) => ({
		// 	id: item.id,
		// 	list_name: item.list_name,
		// 	description: item.description,
		// 	curator_id: item.curator_id,
		// }));
		// contentChange({ lists: tempArr });
		// console.log("lists loaded")
	}

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const loadData = () => {
		// console.log(userC.curator_id)
		GetTagsListsUsers({ curator_id: userC.curator_id }).then((data) => {});
	};

	const loadBookmarks = () => {
		GetBookmarksOfUser(props.curator_id)
			.then((data) => {})
			.catch((error) => {
				console.log(error);
			});
	};

	//   useEffect(()=>{
	//       loadData()
	//       // contentChange(content=>({...content,listdescription: posts.items[0].description}))
	//   },[loadData]);

	function RenderTags() {
		return (
			<List animated verticalAlign="middle">
				<div className="scrollyCuration">
					<List.Item key="all">
						{/* <MixpanelConsumer>
                        {mixpanel=> */}
						<List.Content
							onClick={(e) => {
								contentChange((content) => ({
									...content,
									currentTag: "all",
									currentTagID: "",
									contentType: "tags",
									currentListID: "",
								}));
								Mixpanel.track("Tag Click", { tag: "all", tagID: "" });
								if (process.env.REACT_APP_BASE_URL !== "http://localhost:3000")
									ReactGA.event({
										category: "Tag",
										action: "Click",
										// value:'all',
										transport: "beacon",
									});
							}}
						>
							<Link to={`/${userC.curator_id}/tags/`}># All</Link>
						</List.Content>
						{/* }
                    </MixpanelConsumer> */}
					</List.Item>
					{
						// (
						// posts = tagData["data"]["tag"]),
						content.tags.length > 0 ? (
							content.tags &&
							content.tags.map((post) => (
								<List.Item key={post.value}>
									{/* <MixpanelConsumer>
                        {mixpanel=> */}
									<List.Content
										onClick={(e) => {
											contentChange((content) => ({
												...content,
												currentTag: post.text,
												currentTagID: post.value,
												currentListID: "",
												contentType: "tags",
											}));
											Mixpanel.track("Tag Click", {
												tag: post.text,
												tagID: post.value,
											});
											if (
												process.env.REACT_APP_BASE_URL !==
												"http://localhost:3000"
											)
												ReactGA.event({
													category: "Tag",
													action: "Click",
													// value:post.text,
													transport: "beacon",
												});
										}}
									>
										<Link to={`/${userC.curator_id}/tags/${post.value}`}>
											# {post.text}
										</Link>
									</List.Content>
									{/* }
                            </MixpanelConsumer> */}
								</List.Item>
							))
						) : (
							<div>
								You have not created any tags. Use add item on the top right
								side to add an item and tag it!
							</div>
						)
					}
				</div>
			</List>
		);
	}

	function RenderLists() {
		return (
			<List animated verticalAlign="middle">
				<div className="scrollyCuration">
					{content.lists.length > 0 ? (
						// (lists = tagData["data"]["lists"]),
						content.lists.length > 0 ? (
							content.lists &&
							content.lists.map((post) => (
								<List.Item key={post.id}>
									{/* <MixpanelConsumer>
                        {mixpanel=> */}
									<List.Content
										onClick={(e) => {
											contentChange((content) => ({
												...content,
												currentList: post.list_name,
												currentListID: post.id,
												currentTagID: "",
												contentType: "lists",
											}));
											Mixpanel.track("List Click", {
												list: post.list_name,
												listID: post.id,
											});
											if (
												process.env.REACT_APP_BASE_URL !==
												"http://localhost:3000"
											)
												ReactGA.event({
													category: "List",
													action: "Click",
													// value:post.list_name,
													transport: "beacon",
												});
										}}
									>
										<Link to={`/${userC.curator_id}/lists/${post.id}`}>
											{post.list_name}
										</Link>
									</List.Content>
									{/* }
                             </MixpanelConsumer> */}
								</List.Item>
							))
						) : (
							<div>
								You have not created any lists. Use add item on the top right
								side to add an item and create a list.
							</div>
						)
					) : (
						<div>
							You don't seem to have any lists. Please add a list by clicking on
							the Add List button.
						</div>
					)}
				</div>
			</List>
		);
	}

	function RenderBookmarks() {
		return (
			// <div className="scrolly">
			<List animated verticalAlign="middle">
				<div className="scrollyCuration">
					{content.bookmarks.length > 0 ? (
						// (lists = tagData["data"]["item_bookmark"]),
						content.bookmarks.length > 0 ? (
							content.bookmarks &&
							content.bookmarks.map((post) => (
								<List.Item key={post.id}>
									{/* <MixpanelConsumer>
                        {mixpanel=> */}
									<List.Content
										onClick={(e) => {
											contentChange((content) => ({
												...content,
												currentList: post.name,
												currentListID: post.id,
												currentTagID: "",
												contentType: "bookmark",
											}));
											Mixpanel.track("Bookmark Click", {
												bookmark: post.name,
												listID: post.id,
											});
											if (
												process.env.REACT_APP_BASE_URL !==
												"http://localhost:3000"
											)
												ReactGA.event({
													category: "Bookmark",
													action: "Click",
													// value:post.list_name,
													transport: "beacon",
												});
										}}
									>
										<Link to={`/${userC.curator_id}/bookmark/${post.curator}`}>
											{post.username}
										</Link>
									</List.Content>
									{/* }
                             </MixpanelConsumer> */}
								</List.Item>
							))
						) : (
							<div>
								You have not created any Bookmarks. Explore your fellow
								curator's feed and bookmark something that you like
							</div>
						)
					) : (
						<div>No data</div>
					)}
				</div>
			</List>
		);
	}

	return (
		<>
			{/* {loading ? (
				<Tab menu={{ secondary: true, pointing: true }} panes={panes} />
			) : (
				// console.log(tagData['data']), */}
			<Tab
				menu={{ secondary: true, pointing: true }}
				panes={[
					{
						menuItem: "Lists",
						render: () => <Tab.Pane>{RenderLists()} </Tab.Pane>,
					},
					{
						menuItem: "Tags",
						render: () => <Tab.Pane>{RenderTags()}</Tab.Pane>,
					},
					{
						menuItem: "Bookmarks",
						render: () => <Tab.Pane> {RenderBookmarks()}</Tab.Pane>,
					},
				]}
			/>
			{/* )} */}
		</>
	);
}

export default CurationList;
