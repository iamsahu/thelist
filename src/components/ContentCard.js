import React, { useState, useContext } from "react";
import {
	Item,
	Icon,
	Popup,
	Image,
	Button,
	Responsive,
} from "semantic-ui-react";
import { useAuth0 } from "../react-auth0-spa";
// import { FETCH_FEED_ITEMS, INSERT_TAG, DELETE_ITEM } from "../util/graphql";
import { useMutation } from "@apollo/react-hooks";
import UserContext from "../context/UserContext";
// import grabity from "grabity";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Tap from "react-interactions";
// import Reward from "react-rewards";
// import { MixpanelConsumer } from "react-mixpanel";
import ReactGA from "react-ga";
import Mixpanel from "../util/mix";
import {
	DeleteItem,
	// LikeItem,
	// UnlikeItem,
	// InsertBookmark,
	// DeleteBookmark,
} from "../util/graphqlExecutor";
// import { client } from "../ApolloProvider";
import gql from "graphql-tag";
import ContentContext from "../context/ContentContext";
// import { useQuery } from "@apollo/react-hooks";
import Linkify from "react-linkify";
import LikeArticle from "./LikeArticle";
import BookMarkItem from "./BookMarkItem";

const COPY_COUNT = gql`
	mutation MyMutation($id: uuid) {
		update_items(where: { id: { _eq: $id } }, _inc: { copy_count: 1 }) {
			affected_rows
		}
	}
`;

function ContentCard(postdata) {
	// console.log(postdata);
	// console.log(postdata.postdata['like_items'].length)
	const [content, contentChange] = useContext(ContentContext);
	const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();
	const [userC, userChange] = useContext(UserContext);
	var post = postdata.postdata;
	const [reward, setreward] = useState(null);
	const notify = () => toast("Link Copied!");
	const [liked, setLiked] = useState(-1);
	const [bookmark, setbookmark] = useState(-1);
	// if(user){
	//     console.log(user['sub'])
	// }
	//post.user.id //Would be useful for checking if the post beind deleted belongs to the person
	// const [deleteItem] = useMutation(DELETE_ITEM,{
	//     variables:{item_id:post.id,curator:userC.loggedin_user_id},
	//     update: (cache) => {
	//         const existingItems = cache.readQuery({
	//             query: FETCH_FEED_ITEMS
	//         });
	//         const newItems = existingItems.items.filter(t => (t.id !== post.id));
	//         cache.writeQuery({
	//             query: FETCH_FEED_ITEMS,
	//             data: {items: newItems}
	//         });
	//     }
	// })

	const [copyItem] = useMutation(COPY_COUNT, {
		variables: {
			id: postdata.postdata.id,
		},
	});

	const deleteitem = (id) => {
		DeleteItem({
			id: id,
			curator: userC.loggedin_user_id,
			contentType: postdata.contentType,
			contentID: postdata.contentID,
		}).then((response) => {
			console.log(response);
			contentChange((content) => ({ ...content, add: "ad" }));
		});
	};

	const [thumbImage, thumbImageSet] = useState(
		"https://react.semantic-ui.com/images/wireframe/image.png"
	);

	const [token, setToken] = useState("");
	// console.log(postdata)
	//Fetches thumbnail image
	// const thumb = async () => {
	// 	let it = await grabity.grabIt(
	// 		"https://cors-anywhere.herokuapp.com/" + postdata.postdata.link
	// 	);
	// 	// console.log(it)
	// 	if (it["favicon"]) {
	// 		if (it["favicon"]) {
	// 			thumbImageSet(it["favicon"]);
	// 		}
	// 	} else if (it["image"]) {
	// 		thumbImageSet(it["image"]);
	// 	}
	// 	if (postdata.postdata.description === "") {
	// 		if (it["description"]) {
	// 			postdata.postdata.description = it["description"];
	// 		}
	// 	}
	// 	// console.log(postdata.postdata.link)
	// 	// console.log(it)
	// 	setToken("l");
	// };
	if (postdata.postdata.auto_image === "none") {
		try {
			// thumb()
		} catch (e) {
			// console.log(e)
		}
	}

	function R() {
		// reward.rewardMe()
	}

	if (typeof postdata.postdata === "undefined") return <div></div>;
	else {
		// console.log(postdata.postdata)
	}

	if (liked === -1) {
		// console.log(postdata)
		if (typeof postdata.postdata !== "undefined")
			if (typeof postdata.postdata["like_items"] !== "undefined")
				if (postdata.postdata["like_items"].length > 0) {
					setLiked(true);
				} else {
					setLiked(false);
				}
	}

	if (bookmark === -1) {
		if (typeof postdata.postdata !== "undefined") {
			// console.log(postdata)
			if (typeof postdata.postdata["item_bookmarks"] !== "undefined")
				if (postdata.postdata["item_bookmarks"].length > 0) {
					setbookmark(true);
				} else {
					setbookmark(false);
				}
		}
	}

	// console.log(postdata);
	//Fix for list->tag->list crash bug
	if (typeof postdata === "undefined") return <></>;
	if (typeof postdata.postdata === "undefined") return <></>;
	if (typeof postdata.postdata.name === "undefined") return <></>;
	var postName = postdata.postdata.name.substring(0, 70);

	return (
		<>
			<div class="flex h-48">
				<div class="bg-white border shadow-md mt-4 rounded-lg overflow-hidden text-gray-900 w-full">
					<div class="flex h-48">
						<div class="w-1/4 max-w-full h-48 relative">
							<img
								class="absolute h-48 w-full object-cover object-center"
								src={
									postdata.postdata.auto_image !== "none"
										? postdata.postdata.auto_image
										: thumbImage
								}
							/>
						</div>
						<div class="p-2 w-3/4 h-48">
							<div class="overflow-hidden h-32">
								{/* <h4 class="font-semibold text-xl text-gray-800 truncate"> */}
								<a
									class="font-normal text-gray-800 w-full text-lg md:text-xl"
									target="_blank"
									href={postdata.postdata.link}
								>
									{postName}
								</a>
								{/* </h4> */}
								<Responsive minWidth={Responsive.onlyTablet.minWidth}>
									<p class="text-gray-700 mt-1 overflow-hidden font-thin text-base lg:text-lg">
										<Linkify>
											{postdata.postdata.description !== ""
												? postdata.postdata.description
												: postdata.postdata.auto_description === "none"
												? ""
												: postdata.postdata.auto_description.substring(0, 336)}
										</Linkify>
									</p>
								</Responsive>
							</div>
							<div class="max-w-full max-h-full relative h-8">
								{isAuthenticated &&
									postdata.postdata.user.id === userC.loggedin_user_id && (
										<img
											class="h-4 float-right mr-1 object-bottom"
											src={`${process.env.REACT_APP_BASE_URL}/close.svg`}
											alt="Kiwi standing on oval"
											onClick={(e) => {
												deleteitem(postdata.postdata.id);
												Mixpanel.track("Delete Item", {
													link: postdata.postdata.link,
													curator: postdata.postdata.user.id,
													name: postdata.postdata.name,
												});
												if (
													process.env.REACT_APP_BASE_URL !==
													"http://localhost:3000"
												)
													ReactGA.event({
														category: "Item",
														action: "Delete",
														label: postdata.postdata.name,
														transport: "beacon",
													});
											}}
										/>
									)}
								{/* <img
									class="h-4 float-right mr-1 object-bottom"
									src={`${process.env.REACT_APP_BASE_URL}/close.svg`}
									alt="Kiwi standing on oval"
								/> */}

								<CopyToClipboard
									text={postdata.postdata.link}
									onCopy={(e) => {
										notify();
										copyItem();
										Mixpanel.track("Copy Item", {
											link: postdata.postdata.link,
											curator: postdata.postdata.user.id,
											name: postdata.postdata.name,
										});
										if (
											process.env.REACT_APP_BASE_URL !== "http://localhost:3000"
										)
											ReactGA.event({
												category: "Item",
												action: "Copy",
												label: postdata.postdata.name,
												transport: "beacon",
											});
									}}
								>
									<img
										class="h-4 float-right mr-1 object-bottom"
										src={`${process.env.REACT_APP_BASE_URL}/copy.svg`}
										alt="Kiwi standing on oval"
									/>
								</CopyToClipboard>
								{/* <img
									class="h-4 float-right mr-1 object-bottom"
									src={`${process.env.REACT_APP_BASE_URL}/copy.svg`}
									alt="Kiwi standing on oval"
								/> */}
								{isAuthenticated &&
									postdata.postdata.user.id !== userC.loggedin_user_id && (
										<BookMarkItem postdata={postdata} />
									)}
								{/* <img
									class="h-4 float-right mr-1 object-bottom"
									src={`${process.env.REACT_APP_BASE_URL}/bookmark.svg`}
									alt="Kiwi standing on oval"
								/> */}
								{isAuthenticated &&
									postdata.postdata.user.id !== userC.loggedin_user_id && (
										<LikeArticle postdata={postdata} />
									)}
								{/* <img
									class="h-4 float-right mr-1 object-bottom"
									src={`${process.env.REACT_APP_BASE_URL}/heart.svg`}
									alt="Kiwi standing on oval"
								/> */}
								{/* <button class="object-bottom absolute inset-x-0 bottom-0 object-none inline-block px-5 py-3 rounded-lg shadow border text-sm">
									hello
								</button> */}
							</div>
						</div>
					</div>
				</div>
				{/* <div class="w-1/12">
					<div class="max-w-full h-full mt-4 items-center">
						
						{isAuthenticated &&
							postdata.postdata.user.id === userC.loggedin_user_id && (
								<Button
									icon
									floated="right"
									size="tiny"
									basic
									color="black"
									onClick={(e) => {
										deleteitem(postdata.postdata.id);
										Mixpanel.track("Delete Item", {
											link: postdata.postdata.link,
											curator: postdata.postdata.user.id,
											name: postdata.postdata.name,
										});
										if (
											process.env.REACT_APP_BASE_URL !== "http://localhost:3000"
										)
											ReactGA.event({
												category: "Item",
												action: "Delete",
												label: postdata.postdata.name,
												transport: "beacon",
											});
									}}
								>
									<Icon name="delete" />
									<Tap waves />
								</Button>
							)}
						{isAuthenticated &&
							postdata.postdata.user.id !== userC.loggedin_user_id && (
								<BookMarkItem postdata={postdata} />
							)}
						<CopyToClipboard
							text={postdata.postdata.link}
							onCopy={(e) => {
								notify();
								copyItem();
								Mixpanel.track("Copy Item", {
									link: postdata.postdata.link,
									curator: postdata.postdata.user.id,
									name: postdata.postdata.name,
								});
								if (process.env.REACT_APP_BASE_URL !== "http://localhost:3000")
									ReactGA.event({
										category: "Item",
										action: "Copy",
										label: postdata.postdata.name,
										transport: "beacon",
									});
							}}
						>
							<Button icon size="tiny" floated="right" basic color="black">
								<Icon name="copy" />
								<Tap waves />
							</Button>
						</CopyToClipboard>

						{isAuthenticated &&
							postdata.postdata.user.id !== userC.loggedin_user_id && (
								<LikeArticle postdata={postdata} />
							)}
						{isAuthenticated &&
							postdata.postdata.user.id === userC.loggedin_user_id && (
								<Button
									icon
									size="tiny"
									floated="right"
									basic
									color="black"
									onClick={(e) => {
										Mixpanel.track("Edit Item", {
											link: postdata.postdata.link,
											curator: postdata.postdata.user.id,
											name: postdata.postdata.name,
										});
										if (
											process.env.REACT_APP_BASE_URL !== "http://localhost:3000"
										)
											ReactGA.event({
												category: "Item",
												action: "Edit",
												label: postdata.postdata.name,
												transport: "beacon",
											});
									}}
								>
									<Icon name="edit" />
									<Tap waves />
								</Button>
							)}
					</div>
				</div> */}
			</div>
			{/* <Item background="white">
				<Item.Image
					size="tiny"
					floated="left"
					src={
						postdata.postdata.auto_image !== "none"
							? postdata.postdata.auto_image
							: thumbImage
					}
				/>
				<Item.Content>
					<Item.Header as="a" target="_blank" href={postdata.postdata.link}>
						{postName}
					</Item.Header>

					{isAuthenticated &&
						postdata.postdata.user.id === userC.loggedin_user_id && (
							<Button
								icon
								floated="right"
								size="tiny"
								basic
								color="black"
								onClick={(e) => {
									deleteitem(postdata.postdata.id);
									Mixpanel.track("Delete Item", {
										link: postdata.postdata.link,
										curator: postdata.postdata.user.id,
										name: postdata.postdata.name,
									});
									if (
										process.env.REACT_APP_BASE_URL !== "http://localhost:3000"
									)
										ReactGA.event({
											category: "Item",
											action: "Delete",
											label: postdata.postdata.name,
											transport: "beacon",
										});
								}}
							>
								<Icon name="delete" />
								<Tap waves />
							</Button>
						)}
					{isAuthenticated &&
						postdata.postdata.user.id !== userC.loggedin_user_id && (
							<BookMarkItem postdata={postdata} />
						)}
					<CopyToClipboard
						text={postdata.postdata.link}
						onCopy={(e) => {
							notify();
							copyItem();
							Mixpanel.track("Copy Item", {
								link: postdata.postdata.link,
								curator: postdata.postdata.user.id,
								name: postdata.postdata.name,
							});
							if (process.env.REACT_APP_BASE_URL !== "http://localhost:3000")
								ReactGA.event({
									category: "Item",
									action: "Copy",
									label: postdata.postdata.name,
									transport: "beacon",
								});
						}}
					>
						<Button icon size="tiny" floated="right" basic color="black">
							<Icon name="copy" />
							<Tap waves />
						</Button>
					</CopyToClipboard>

					{isAuthenticated &&
						postdata.postdata.user.id !== userC.loggedin_user_id && (
							<LikeArticle postdata={postdata} />
						)}
					{isAuthenticated &&
						postdata.postdata.user.id === userC.loggedin_user_id && (
							<Button
								icon
								size="tiny"
								floated="right"
								basic
								color="black"
								onClick={(e) => {
									Mixpanel.track("Edit Item", {
										link: postdata.postdata.link,
										curator: postdata.postdata.user.id,
										name: postdata.postdata.name,
									});
									if (
										process.env.REACT_APP_BASE_URL !== "http://localhost:3000"
									)
										ReactGA.event({
											category: "Item",
											action: "Edit",
											label: postdata.postdata.name,
											transport: "beacon",
										});
								}}
							>
								<Icon name="edit" />
								<Tap waves />
							</Button>
						)}

					<Popup
						trigger={
							<Item.Description>
								<Linkify>
									<p>
										{postdata.postdata.description !== ""
											? postdata.postdata.description
											: postdata.postdata.auto_description === "none"
											? ""
											: postdata.postdata.auto_description.substring(0, 336)}
									</p>
								</Linkify>
							</Item.Description>
						}
						mouseEnterDelay={500}
						content={
							postdata.postdata.description !== ""
								? postdata.postdata.description
								: postdata.postdata.auto_description === "none"
								? ""
								: postdata.postdata.auto_description
						}
						hideOnScroll
					/>
				</Item.Content>
			</Item> */}
		</>
	);
}

export default ContentCard;
