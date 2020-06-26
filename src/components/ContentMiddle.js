import React, { useContext, useState, useEffect } from "react";
// import { useQuery } from '@apollo/react-hooks';
import {
	Menu,
	Button,
	Icon,
	Item,
	Placeholder,
	Modal,
	Image,
	Loader,
} from "semantic-ui-react";
import {
	EmailShareButton,
	FacebookShareButton,
	LinkedinShareButton,
	PocketShareButton,
	RedditShareButton,
	TwitterShareButton,
	WhatsappShareButton,
	TwitterIcon,
	FacebookIcon,
	WhatsappIcon,
} from "react-share";

import ContentContext from "../context/ContentContext";
// import ContentCard from './ContentCard'
import CentralList from "./CentralList";
// import {FETCH_FEED_ITEMS,FETCH_FEED_ITEMS_OFCURATOR} from '../util/graphql';
import UserContext from "../context/UserContext";
import {
	GetList,
	GetItemsUsers,
	GetItemsofTag,
	LikeList,
	UnlikeList,
	GetTagItems,
} from "../util/graphqlExecutor";
import MetaTags from "react-meta-tags";
import ReactGA from "react-ga";
import Mixpanel from "../util/mix";
import Tap from "react-interactions";

function ContentMiddle(props) {
	// console.log(props)
	// console.log(process.env)
	// console.log(process.env.REACT_APP_BASE_URL)
	const [content] = useContext(ContentContext);
	const [posts, setPosts] = useState(null);
	const user = useContext(UserContext);
	const [shareUrl, setshareUrl] = useState(window.location.href);
	const [header, setheader] = useState("");
	const [description, setdescription] = useState("");
	const [listlike, setlistlike] = useState(-1);
	const [loadState, setloadState] = useState(-1);

	var activeItem = "home";

	const loadData = () => {
		content.contentType === "lists"
			? content.currentListID === ""
				? GetItemsUsers({ curator_id: user.curator_id }).then((data) => {
						setPosts(data);
						setloadState(1);
				  })
				: GetList({ userid: user.curator_id, listid: content.currentListID })
						.then((data) => {
							console.log(data);
							setPosts(data);
							setloadState(1);
							if (typeof data !== "undefined") {
								if (data.items.length > 0) {
									setheader(data.items[0]["list"]["list_name"]);
									setdescription(data.items[0]["list"]["description"]);
								}
							}
							if (data.like_list.length > 0) {
								// console.log("setting likes")
								setlistlike(true);
							} else {
								setlistlike(false);
							}
						})
						.catch((error) => console.log(error))
			: content.contentType === "tags"
			? content.currentTagID === ""
				? GetItemsUsers({ curator_id: user.curator_id }).then((data) => {
						setPosts(data);
				  })
				: GetItemsofTag({
						user_id: user.curator_id,
						tag_id: content.currentTagID,
				  }).then((data) => {
						setPosts(data);
				  })
			: console.log("Not a valid content");
	};

	//Loading data through props passed parameters
	const loadData2 = () => {
		props.propSent.contentType === "lists"
			? props.propSent.contentID === ""
				? GetItemsUsers({ curator_id: props.propSent.curator_id }).then(
						(data) => {
							setPosts(data.items);
							setloadState(1);
						}
				  )
				: GetList({
						userid: props.propSent.curator_id,
						listid: props.propSent.contentID,
				  })
						.then((data) => {
							// console.log(data)
							setPosts(data.items);
							setloadState(1);
							if (typeof data !== "undefined") {
								if (data.items.length > 0) {
									setheader(data.items[0]["list"]["list_name"]);
									setdescription(data.items[0]["list"]["description"]);
									// console.log(data.items[0]['list']['description'])
								}
							}
							if (data.like_list.length > 0) {
								//Change this to take value from latest data
								// console.log("setting likes")
								setlistlike(true);
							} else {
								setlistlike(false);
							}
						})
						.catch((error) => console.log(error))
			: props.propSent.contentType === "tags"
			? props.propSent.contentID === ""
				? GetItemsUsers({ curator_id: props.propSent.curator_id }).then(
						(data) => {
							setPosts(data.items);
						}
				  )
				: // console.log('Tag with no all')
				  // GetItemsofTag({user_id:props.propSent.curator_id,tag_id:props.propSent.contentID}).then((data)=>{setPosts(data)})
				  GetTagItems({
						user_id: props.propSent.curator_id,
						tag_id: props.propSent.contentID,
				  }).then((data) => {
						console.log(data.tag[0]["item_tags"]);
						// var temp = data.tag[0]['item_tags'].map(item=>item.item)
						setPosts(data.tag[0]["item_tags"]);
				  })
			: console.log("Not a valid content");
	};
	// console.log('asdf')
	// console.log(content)
	// if(loadState===-1){
	loadData2();
	//   setloadState(1)
	// }
	// useEffect(()=>{
	//     loadData()
	//     // contentChange(content=>({...content,listdescription: posts.items[0].description}))
	// },[loadData]);
	// if(posts!==null)
	// if(listlike===-1){
	//   if(posts.like_list.length>0){
	//     setlistlike(true)
	//   }
	// }

	if (posts === null) {
		return (
			<div>
				<Loader active inline="centered" />
			</div>
		);
	}

	return (
		<>
			<h1>
				{props.propSent.contentType === "lists"
					? content.currentList
					: content.currentTag}
			</h1>
			{/* <!-- Open Graph / Facebook --> */}
			<MetaTags>
				<meta property="og:type" content="website" />
				<meta property="og:url" content={shareUrl} />
				<meta
					property="og:title"
					content={
						props.propSent.contentType === "tags"
							? content.currentTag
							: content.currentList
					}
				/>
				<meta
					property="og:description"
					content={
						props.propSent.contentType === "lists"
							? { description }
							: "A place for all your curations!"
					}
				/>
				<meta
					property="og:image"
					content={`${process.env.REACT_APP_BASE_URL}/thelistspace.png`}
				/>

				{/* <!-- Twitter --/> */}
				<meta
					property="twitter:card"
					content={`${process.env.REACT_APP_BASE_URL}/thelistspace.png`}
				/>
				<meta property="twitter:url" content={shareUrl} />
				<meta
					property="twitter:title"
					content={
						props.propSent.contentType === "tags"
							? content.currentTag
							: content.currentList
					}
				/>
				<meta
					property="twitter:description"
					content={
						props.propSent.contentType === "lists"
							? { description }
							: "A place for all your curations!"
					}
				/>
				<meta
					property="twitter:image"
					content={`${process.env.REACT_APP_BASE_URL}/thelistspace.png`}
				/>
			</MetaTags>
			<Menu pointing secondary>
				<Menu.Item name="Home" active={activeItem === "home"} />
				{/* <Menu.Item
        name='Latest'
        active={activeItem === 'Latest'}
        onClick={handleItemClick}
      />
      <Menu.Item
        name='Most Appreciated'
        active={activeItem === 'Most Appreciated'}
        onClick={handleItemClick}
      />
      <Menu.Item
        name='Lost in time'
        active={activeItem === 'Lost in time'}
        onClick={handleItemClick}
      />
      <Menu.Item
        name='All'
        active={activeItem === 'All'}
        onClick={handleItemClick}
      />
      <Menu.Item
        name='Bookmarked'
        active={activeItem === 'Bookmarked'}
        onClick={handleItemClick}
      /> */}
				<Menu.Menu position="right">
					<div className="icobutton">
						{props.propSent.contentType === "lists" &&
							(listlike ? (
								<Button
									icon
									floated="right"
									onClick={(e) => {
										Mixpanel.track("Appreciate List", {
											link: { shareUrl },
											curator: props.propSent.curator_id,
											name: content.currentList,
										});
										if (
											process.env.REACT_APP_BASE_URL !== "http://localhost:3000"
										)
											ReactGA.event({
												category: "List",
												action: "Like",
												transport: "beacon",
											});
										setlistlike(false);
										// console.log('unlike')
										UnlikeList(props.propSent.contentID, user.loggedin_user_id);
									}}
								>
									<Icon color="red" name="like" />
									{/* <Tap waves /> */}
								</Button>
							) : (
								<Button
									icon
									floated="right"
									onClick={(e) => {
										Mixpanel.track("Appreciate List", {
											link: { shareUrl },
											curator: props.propSent.curator_id,
											name: content.currentList,
										});
										if (
											process.env.REACT_APP_BASE_URL !== "http://localhost:3000"
										)
											ReactGA.event({
												category: "List",
												action: "Unlike",
												transport: "beacon",
											});
										setlistlike(true);
										LikeList(props.propSent.contentID, user.loggedin_user_id);
										// console.log('unlike')
									}}
								>
									<Icon name="like" />
									{/* <Tap waves /> */}
								</Button>
							))}
						<Button icon>
							<Icon name="bell" />
						</Button>
						<Modal
							closeIcon
							trigger={
								<Button icon>
									<Icon name="share alternate" />
								</Button>
							}
							centered={false}
						>
							<Modal.Header>Share on Social Media</Modal.Header>
							<Modal.Content>
								<div>
									<FacebookShareButton
										url={shareUrl}
										quote={content.contentDescription}
									>
										<FacebookIcon size={32} round />
									</FacebookShareButton>
									{/* </div>
            <div> */}
									<TwitterShareButton url={shareUrl} title="Title">
										<TwitterIcon size={32} round />
									</TwitterShareButton>
									{/* </div>
            <div> */}
									<WhatsappShareButton
										url={shareUrl}
										title={content.contentDescription}
										separator=":: "
										className="Demo__some-network__share-button"
									>
										<WhatsappIcon size={32} round />
									</WhatsappShareButton>
								</div>
							</Modal.Content>
						</Modal>
						{/* <Button icon>
            <Icon name='share alternate' />
        </Button> */}
					</div>
				</Menu.Menu>
			</Menu>
			{
				<div className="scrolly">
					<Item.Group>
						{posts === null ? (
							<Placeholder>
								<Placeholder.Header image>
									<Placeholder.Line />
									<Placeholder.Line />
								</Placeholder.Header>
							</Placeholder>
						) : typeof posts !== "undefined" ? (
							posts.length > 0 ? (
								<CentralList
									posts={posts}
									contentType={props.propSent.contentType}
								/>
							) : (
								<div className="imageFix">
									<Image
										centered
										src={`${process.env.REACT_APP_BASE_URL}/undraw_empty_xct9.png`}
										size="large"
										verticalAlign="middle"
									/>
								</div>
							)
						) : (
							<div>No mojo as of now</div>
						)}
					</Item.Group>
				</div>
			}
		</>
	);
}

export default ContentMiddle;
