import React, { useContext, useState, useEffect } from "react";

import { Grid } from "semantic-ui-react";

import ContentMiddleNoLoad from "../components/ContentMiddle_NoLoad";
import ContentMiddleLists from "../components/ContentMiddleLists";
import ContentRight from "../components/ContentRight";
import CurationList from "../components/CurationList";

import UserContext from "../context/UserContext";
import ContentContext from "../context/ContentContext";
import { Responsive } from "semantic-ui-react";
import {
	GetList,
	GetItemsUsers,
	GetTagItems,
	GetAllBookmarkItems,
	GetBookmarkItemsOfCurator,
	DoesUserExists,
	GetTagsListsUsers,
} from "../util/graphqlExecutor";

function Curator(props) {
	// console.log(props)

	// const listid = props.match.params.listid
	const [userC, userChange] = useContext(UserContext);
	const [content, contentChange] = useContext(ContentContext);
	const [lastCurator, setlastCurator] = useState("");
	const [reload, setreload] = useState(false);
	var userid;
	var propSent = {};

	// console.log(props);
	// console.log(userC);
	if (typeof props.user !== "undefined") {
		// userC.curator_id = props.user;
		if (userC.curator_id !== props.user) {
			// if (userC.lastCurator !== props.user) {
			setreload(true);
			// 	userChange((userC) => {
			// 		return { ...userC, curator_id: userid, lastCurator: userid };
			// 	});
			// } else {
			userChange((userC) => {
				return { ...userC, curator_id: props.user };
			});
			// }
			setlastCurator(userid);
		}
		propSent = { curator_id: props.user, contentType: "lists", contentID: "" };
	} else if (typeof props.match.params !== "undefined") {
		// console.log("here undefined");
		// console.log(props.match.params.contenttype)
		userid = props.match.params.user;
		// userC.curator_id = userid;
		if (userC.curator_id !== userid) {
			userC.curator_id = userid;
			console.log("assign");
			// if (userC.lastCurator !== userid) {
			setreload(true);
			// 	userChange((userC) => {
			// 		return { ...userC, curator_id: userid, lastCurator: userid };
			// 	});
			// } else {
			userChange((userC) => {
				return { ...userC, curator_id: userid };
			});
			// }
			setlastCurator(userid);
		}
		if (props.match.params.contenttype === "lists") {
			content.contentType = "lists";
			content.currentListID = props.match.params.contentid;
			// console.log('here lists')
			if (typeof props.match.params.contentid === "undefined")
				propSent = {
					curator_id: userid,
					contentType: props.match.params.contenttype,
					contentID: "",
				};
			else
				propSent = {
					curator_id: userid,
					contentType: props.match.params.contenttype,
					contentID: props.match.params.contentid,
				};
		} else if (props.match.params.contenttype === "tags") {
			// console.log('tags')
			content.contentType = "tags";
			content.currentTagID = props.match.params.contentid; //Listid is used instead of tag id as we are using single way to detect the id
			if (typeof props.match.params.contentid === "undefined")
				propSent = {
					curator_id: userid,
					contentType: props.match.params.contenttype,
					contentID: "",
				};
			else
				propSent = {
					curator_id: userid,
					contentType: props.match.params.contenttype,
					contentID: props.match.params.contentid,
				};
		} else if (props.match.params.contenttype == "bookmark") {
			content.contentType = "bookmark";
			content.currentListID = props.match.params.contentid;
			if (typeof props.match.params.contentid === "undefined")
				propSent = {
					curator_id: userid,
					contentType: props.match.params.contenttype,
					contentID: "",
				};
			else
				propSent = {
					curator_id: userid,
					contentType: props.match.params.contenttype,
					contentID: props.match.params.contentid,
				};
		} else if (typeof props.match.params.contentType === "undefined") {
			//This is the default loading case
			propSent = { curator_id: userid, contentType: "lists", contentID: "" };
		}

		// console.log(propSent)
	}

	const [listlike, setlistlike] = useState(-1);
	const [loadState, setloadState] = useState(-1);
	const [posts, setPosts] = useState(null);
	const [header, setheader] = useState("");
	const [description, setdescription] = useState("");

	const loadData2 = () => {
		propSent.contentType === "lists"
			? propSent.contentID === ""
				? GetItemsUsers({ curator_id: propSent.curator_id })
						.then((data) => {
							console.log("loading lists empty");
							setPosts(data.items);
							setloadState(1);
							if (data.items.length > 0) {
								setheader(data.items[0]["list"]["list_name"]);
								setdescription(data.items[0]["list"]["description"]);
								propSent["description"] = data.items[0]["list"]["description"];
							}
						})
						.catch((error) => console.log(error))
				: GetList({ userid: propSent.curator_id, listid: propSent.contentID })
						.then((data) => {
							// console.log("loading lists ");s
							// console.log(data)
							setPosts(data.items);
							setloadState(1);
							if (typeof data !== "undefined") {
								if (data.items.length > 0) {
									setheader(data.items[0]["list"]["list_name"]);
									setdescription(data.items[0]["list"]["description"]);
									propSent["description"] =
										data.items[0]["list"]["description"];
									// console.log(data.items[0]['list']['description'])
								}
							}
							// if(data.like_list.length>0){//Change this to take value from latest data
							//   // console.log("setting likes")
							//   setlistlike(true)
							// }else{
							//   setlistlike(false)
							// }
						})
						.catch((error) => console.log(error))
			: propSent.contentType === "tags"
			? propSent.contentID === ""
				? GetItemsUsers({ curator_id: propSent.curator_id })
						.then((data) => {
							console.log("loading tags empty");
							setPosts(data.items);
							setheader("All");
							setdescription("A place for all your curations!");
							propSent["description"] = "";
						})
						.catch((error) => console.log(error))
				: // console.log('Tag with no all')
				  // GetItemsofTag({user_id:propSent.curator_id,tag_id:propSent.contentID}).then((data)=>{setPosts(data)})
				  GetTagItems({
						user_id: propSent.curator_id,
						tag_id: propSent.contentID,
				  })
						.then((data) => {
							console.log("loading tags");
							//   console.log(data.tag[0]['item_tags'])
							//   var temp = data.tag[0]['item_tags'].map(item=>item.item)
							//   temp = props.posts.map(item=>item.item)
							if (data.tag.length > 0) {
								setPosts(data.tag[0]["item_tags"]);
								setheader(data.tag[0]["name"]);
								setdescription("A place for all your curations!");
								propSent["description"] = "";
								// setPosts(temp)
							}
						})
						.catch((error) => console.log(error))
			: propSent.contentType === "bookmark"
			? propSent.contentID === ""
				? GetAllBookmarkItems(propSent.curator_id)
						.then((data) => {
							console.log("loading bookmarks empty");
							console.log(data.item_bookmark.item);
						})
						.catch((error) => {
							console.log(error);
						})
				: GetBookmarkItemsOfCurator(propSent.curator_id, propSent.contentID)
						.then((data) => {
							console.log("loading bookmarks");
							// console.log(data)
							// setheader()
							setPosts(data.item_bookmark);
							if (typeof data.item_bookmark !== "undefined")
								if (data.item_bookmark.length > 0) {
									// console.log(data.item_bookmark[0].item)
									setheader(
										data.item_bookmark[0].item.item_bookmarks[0].user.username
									);
								}
						})
						.catch((error) => {
							console.log(error);
						})
			: console.log("Not a valid content");
	};
	// useEffect(()=>{
	//     loadData2()
	// })

	loadData2();

	const [userProfile, setuserProfile] = useState(
		"https://react.semantic-ui.com/images/avatar/large/steve.jpg"
	);
	const [username, setusername] = useState("Mojo Jojo");
	const [descriptionU, setdescriptionU] = useState(
		"Something witty that tells how witty you are"
	);
	const [twitterNumber, setTwitterNumber] = useState("1");
	const [editState, seteditState] = useState(false);

	async function loadUser() {
		await DoesUserExists({ user_id: userC.curator_id }).then((response) => {
			// console.log(response)
			if (typeof response !== "undefined") {
				if (typeof response.user[0] !== "undefined") {
					// console.log(response.user[0]['image_link'])
					setuserProfile(response.user[0]["image_link"]);
					setusername(response.user[0]["username"]);
					setTwitterNumber(response.user[0]["id"]);
					if (response.user[0]["description"] !== null) {
						setdescriptionU(response.user[0]["description"]);
						// values.description = response.user[0]["description"];
					}
					if (response.user[0].id === userC.loggedin_user_id) {
						seteditState(true);
					} else {
						seteditState(false);
					}
				}
			}
		});
	}

	loadUser();

	async function fetchTagsLists(id) {
		await GetTagsListsUsers({ curator_id: id }).then((data) => {
			// console.log(data);
			curationTags(data);
		});
	}

	function curationTags(tagData) {
		var posts = tagData["tag"];
		const tempArr = posts.map((post) => ({
			text: post.name,
			key: post.name,
			value: post.id,
		}));

		var tp = [];
		posts.forEach(function (element, index, array) {
			if (element.user_id === props.match.params.user)
				tp.push({
					text: element.name,
					key: element.name,
					value: element.id,
				});
		});

		// lists = tagData["lists"];
		const tempArr2 = tagData["lists"].map((item) => ({
			text: item.list_name,
			key: item.list_name,
			value: item.id,
			id: item.id,
			list_name: item.list_name,
			// description:item.description,
			curator_id: item.curator_id,
		}));

		const bookmarkTemp = tagData["item_bookmark"].map((bookmark) => ({
			name: bookmark.name,
			curator: bookmark.curator,
			id: bookmark.id,
			username: bookmark.user.username,
		}));
		// console.log(tagData)
		// console.log("hereeee");
		if (tagData["lists"].length > 0) {
			contentChange((content) => ({
				...content,
				tags: tp,
				lists: tempArr2,
				bookmarks: bookmarkTemp,
			}));

			// setTags(tagsTemp);
			// setLists(listsTemp);
			// setbookmark(bookmarkTemp);
		}
		// curationLists()
	}

	if (reload) {
		setreload(false);
		if (typeof props.user !== "undefined") {
			console.log("Fetching1");
			// fetchTagsLists(props.user);
		}
		if (typeof props.match.params !== "undefined") {
			// console.log("Fetching");
			fetchTagsLists(props.match.params.user);
		}
	}
	// console.log(content)
	// return <div>loading</div>
	return (
		<>
			<Responsive {...Responsive.onlyMobile}>
				<div>
					<ContentMiddleNoLoad
						propSent={propSent}
						posts={posts}
						title={header}
						desc={description}
						userName={username}
						userImage={userProfile}
					/>
				</div>
			</Responsive>
			<Responsive minWidth={Responsive.onlyTablet.minWidth}>
				<div id="content" className="ui">
					<Grid stackable columns={3}>
						<Grid.Column width={3}>
							<CurationList
								curator_id={userC.curator_id}
								contentType={propSent.contentType}
							/>
						</Grid.Column>
						<Grid.Column width={9}>
							{/* {
							content.contentType==='lists'?
							<ContentMiddleLists propSent={propSent} posts={posts} title={header}/>:
							} */}
							<ContentMiddleNoLoad
								propSent={propSent}
								posts={posts}
								title={header}
								desc={description}
								userName={username}
								userImage={userProfile}
							/>
						</Grid.Column>
						<Grid.Column width={4}>
							<ContentRight curator_id={userC.curator_id} propSent={propSent} />
						</Grid.Column>
					</Grid>
				</div>
			</Responsive>
		</>
	);
}

export default Curator;
//contentType={props.match.params.contenttype} contentID={props.match.params.listid}
