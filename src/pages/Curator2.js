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
} from "../util/graphqlExecutor";

function Curator(props) {
	// console.log(props)

	// const listid = props.match.params.listid
	const [userC, userChange] = useContext(UserContext);
	const [content, contentChange] = useContext(ContentContext);
	const [lastCurator, setlastCurator] = useState("");
	var userid;
	var propSent = {};

	// console.log(props);
	if (typeof props.user !== "undefined") {
		// userC.curator_id = props.user;
		if (userC.curator_id !== props.user) {
			userChange((userC) => {
				return { ...userC, curator_id: props.use };
			});
			setlastCurator(userid);
		}
		propSent = { curator_id: props.user, contentType: "lists", contentID: "" };
	} else if (typeof props.match.params !== "undefined") {
		// console.log("here undefined")
		// console.log(props.match.params.contenttype)
		userid = props.match.params.user;
		userC.curator_id = userid;
		if (userC.curator_id !== userid) {
			userChange((userC) => {
				return { ...userC, curator_id: userid };
			});
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
							console.log(data.item_bookmark.item);
						})
						.catch((error) => {
							console.log(error);
						})
				: GetBookmarkItemsOfCurator(propSent.curator_id, propSent.contentID)
						.then((data) => {
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
