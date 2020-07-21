import React, { useContext, useState, useEffect } from "react";
// import { useQuery } from "@apollo/react-hooks";
import {
	Menu,
	Button,
	Icon,
	Item,
	Placeholder,
	Modal,
	Image,
	Grid,
	Responsive,
	Header,
	Label,
	Card,
	Divider,
	Loader,
} from "semantic-ui-react";
import {
	FacebookShareButton,
	TwitterShareButton,
	WhatsappShareButton,
	TwitterIcon,
	FacebookIcon,
	WhatsappIcon,
} from "react-share";

import ContentContext from "../context/ContentContext";
// import ContentCard from './ContentCard'
import CentralList from "./CentralList";
import AddItem2 from "./AddItem2";
// import {FETCH_FEED_ITEMS,FETCH_FEED_ITEMS_OFCURATOR} from '../util/graphql';
import UserContext from "../context/UserContext";
import {
	LikeList,
	UnlikeList,
	DoILike,
	InsertMultiple,
	FollowThisList,
	UnfollowThisList,
	DoIFollow,
} from "../util/graphqlExecutor";
import MetaTags from "react-meta-tags";
import ReactGA from "react-ga";
import Mixpanel from "../util/mix";
// import Tap from "react-interactions";
import { CSVReader } from "react-papaparse";
import StreamContext from "../context/StreamContext";

function ContentMiddleNoLoad(props) {
	// console.log(props)
	// console.log(process.env)
	// console.log(process.env.REACT_APP_BASE_URL)
	const [content] = useContext(ContentContext);
	const [posts, setPosts] = useState(null);
	const [userC, userChange] = useContext(UserContext);
	const [shareUrl, setshareUrl] = useState(window.location.href);
	const [header, setheader] = useState("");
	const [description, setdescription] = useState("");
	const [listlike, setlistlike] = useState(false);
	const [loadState, setloadState] = useState(-1);
	const [fileUpload, setfileUpload] = useState("0");
	const [streamClient, streamuserFeed] = useContext(StreamContext);
	const [follow, setfollow] = useState(0);

	var activeItem = "home";
	// console.log(props.propSent)
	// console.log(props.propSent.description)

	if (props.posts === null) {
		return (
			<div>
				<Loader active inline="centered" />
			</div>
		);
	}

	if (props.propSent.contentType === "lists") {
		if (description === "") {
			// console.log(props.propSent.description)
			if (props.propSent.description !== undefined)
				setdescription(props.propSent.description);
		}
		if (userC.loggedin_user_id !== "") {
			// if(listlike===1){
			DoILike({
				list_id: props.propSent.contentID,
				user_id: userC.loggedin_user_id,
			}).then((response) => {
				// if (typeof response !== "undefined")
				// 	if (typeof response.like_list !== "undefined")
				// 		if (response.like_list.length > 0) {
				// 			setlistlike(true);
				// 		} else {
				// 			setlistlike(false);
				// 		}
			});
			// }
		}
	}

	if (props.posts.length > 0) {
		// props.posts[0][]
	}

	const handleOnDrop = (data) => {
		// console.log("---------------------------");
		// console.log(data);
		// console.log("---------------------------");
		var items = [];
		for (let index = 1; index < data.length; index++) {
			const element = data[index];
			// console.log(element.data);
			if (element.data !== "") {
				items.push({
					list_id: props.propSent.contentID,
					link: element.data[2],
					description: element.data[1],
					name: element.data[0],
					curator: props.propSent.curator_id,
				});
			}
		}
		setfileUpload("1");
		InsertMultiple(items)
			.then((response) => console.log(response))
			.catch((error) => console.log(error));
	};

	const handleOnError = (err, file, inputElem, reason) => {
		console.log(err);
	};

	const handleOnRemoveFile = (data) => {
		console.log("---------------------------");
		console.log(data);
		console.log("---------------------------");
	};
	if (userC.loggedin_user_id !== props.propSent.curator_id)
		if (userC.loggedin_user_id !== "") {
			DoIFollow(props.propSent.contentID, userC.loggedin_user_id).then(
				(response) => {
					// console.log(response.list_follow_aggregate.aggregate.count);
					if (typeof response !== "undefined")
						if (typeof response.list_follow_aggregate !== "undefined")
							if (response.list_follow_aggregate.aggregate.count > 0) {
								setfollow(1);
							}
				}
			);
		}

	return (
		<>
			{/* <h1>{props.propSent.contentType==='lists'?content.currentList:content.currentTag}</h1> */}

			<Grid>
				<Grid.Column floated="left">
					{/* <h1>
						{props.propSent.contentType === "lists"
							? "List"
							: props.propSent.contentType === "tags"
							? "Tag"
							: "Bookmark"}{" "}
						:
					</h1> */}
					<Header as="h1">
						{props.title} <b>by</b>{" "}
						<Label as="a" image>
							<img src={props.userImage} />
							{props.userName}
						</Label>
					</Header>
					{/* <p>by {props.userName}</p> */}
					<Card fluid>
						<Card.Content>
							<Card.Description>{props.desc}</Card.Description>
						</Card.Content>
					</Card>
					{/* <p>{props.desc}</p> */}
				</Grid.Column>
				{/* <Grid.Column floated="right" width={3}>
					{
						props.propSent.contentType === "lists" &&
							userC.loggedin_user_id === props.propSent.curator_id && (
								<AddItem2 />
							)
						// <Button circular icon='add' floated='right'/>
					}
				</Grid.Column> */}
			</Grid>

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
				{/* <!-- Open Graph / Facebook --> */}
				<MetaTags>
					<meta property="og:type" content="website" />
					<meta property="og:url" content={shareUrl} />
					<meta
						property="og:title"
						content={
							props.propSent.contentType === "tags"
								? content.currentTag
								: props.title
						}
					/>
					<meta
						property="og:description"
						content={
							props.propSent.contentType === "lists"
								? props.desc
								: "A place for all your curations!"
						}
					/>
					<meta
						property="og:image"
						content={`${process.env.REACT_APP_BASE_URL}/thelistspace.png`}
					/>

					<meta name="og:type" content="website" />
					<meta name="og:url" content={shareUrl} />
					<meta
						name="og:title"
						content={
							props.propSent.contentType === "tags"
								? content.currentTag
								: props.title
						}
					/>
					<meta
						name="og:description"
						content={
							props.propSent.contentType === "lists"
								? props.desc
								: "A place for all your curations!"
						}
					/>
					<meta
						name="og:image"
						content={`${process.env.REACT_APP_BASE_URL}/thelistspace.png`}
					/>

					{/* <!-- Twitter --/> */}

					<meta
						name="twitter:card"
						content={`${process.env.REACT_APP_BASE_URL}/thelistspace.png`}
					/>
					<meta name="twitter:url" content={shareUrl} />
					<meta
						name="twitter:title"
						content={
							props.propSent.contentType === "tags"
								? content.currentTag
								: props.title
						}
					/>
					<meta
						name="twitter:description"
						content={
							props.propSent.contentType === "lists"
								? props.desc
								: "A place for all your curations!"
						}
					/>
					<meta
						name="twitter:image"
						content={`${process.env.REACT_APP_BASE_URL}/thelistspace.png`}
					/>
				</MetaTags>
				<Menu.Menu position="right">
					<div className="icobutton">
						{listlike ? (
							content.contentType === "lists" ? (
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
										UnlikeList(
											props.propSent.contentID,
											userC.loggedin_user_id
										);
									}}
								>
									<Icon color="red" name="like" />
									{/* <Tap waves /> */}
								</Button>
							) : (
								<></>
							)
						) : content.contentType === "lists" ? (
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
									LikeList(props.propSent.contentID, userC.loggedin_user_id);
									// console.log('unlike')
								}}
							>
								<Icon name="like" />
								{/* <Tap waves /> */}
							</Button>
						) : (
							<></>
						)}
						{/* {content.contentType === "lists" &&
							userC.loggedin_user_id === props.propSent.curator_id && (
								<AddItem2 />
							)} */}
						{userC.loggedin_user_id !== props.propSent.curator_id &&
							(userC.loggedin_user_id !== "" ? (
								follow === 0 ? (
									<Button
										icon
										onClick={() => {
											streamClient
												.feed("timeline", userC.loggedin_user_id)
												.follow("listfeed", props.propSent.contentID);
											FollowThisList(
												props.propSent.contentID,
												userC.loggedin_user_id
											);
											setfollow(1);
										}}
									>
										<Icon name="feed" />
									</Button>
								) : (
									//Unfollow
									<Button
										icon
										onClick={() => {
											streamClient
												.feed("timeline", userC.loggedin_user_id)
												.unfollow("listfeed", props.propSent.contentID);
											UnfollowThisList(
												props.propSent.contentID,
												userC.loggedin_user_id
											);
											setfollow(0);
										}}
									>
										<Icon color="red" name="feed" />
									</Button>
								)
							) : (
								<Button
									icon
									onClick={() => {
										//Take user to signin/up
									}}
								>
									<Icon name="feed" />
								</Button>
							))}

						{
							props.propSent.contentType === "lists" &&
								userC.loggedin_user_id === props.propSent.curator_id && (
									<>
										<AddItem2 listID={props.propSent.contentID} />
										{/* */}
										<Modal
											closeIcon
											trigger={<Button>Upload CSV</Button>}
											centered={false}
										>
											<Modal.Header>Upload CSV</Modal.Header>
											<Modal.Content>
												<Button>Download Sample</Button>
												<Divider />
												<CSVReader
													onDrop={handleOnDrop}
													onError={handleOnError}
													noDrag
													onRemoveFile={handleOnRemoveFile}
												>
													<span>Drop the file here</span>
												</CSVReader>
												<br />
												{fileUpload === "1" && <Button>Upload This</Button>}
											</Modal.Content>
										</Modal>
									</>
								)
							// <Button circular icon='add' floated='right'/>
						}
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
									<FacebookShareButton url={shareUrl} quote={props.desc}>
										<FacebookIcon size={32} round />
									</FacebookShareButton>
									<TwitterShareButton url={shareUrl} title={props.desc}>
										<TwitterIcon size={32} round />
									</TwitterShareButton>
									<WhatsappShareButton
										url={shareUrl}
										title={props.desc}
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

			<Responsive {...Responsive.onlyMobile}>
				<div style={{ paddingTop: "20px" }}>
					<Item.Group divided relaxed="very">
						{props.posts === null ? (
							<Placeholder>
								<Placeholder.Header image>
									<Placeholder.Line />
									<Placeholder.Line />
								</Placeholder.Header>
							</Placeholder>
						) : typeof props.posts !== "undefined" ? (
							props.posts.length > 0 ? (
								<CentralList
									posts={props.posts}
									contentType={props.propSent.contentType}
									contentID={props.propSent.contentID}
								/>
							) : (
								<div className="imageFix">
									<Image
										centered
										src={`${process.env.REACT_APP_BASE_URL}/undraw_empty_xct9_F5DD47.png`}
										size="large"
										verticalAlign="middle"
									/>
									<br />
									There is nothing here! Click on the add item button on the top
									right side to add an item to your list!
								</div>
							)
						) : (
							<div>No mojo as of now</div>
						)}
					</Item.Group>
				</div>
			</Responsive>
			<Responsive minWidth={Responsive.onlyTablet.minWidth}>
				<div className="scrolly">
					<Item.Group divided relaxed="very">
						{props.posts === null ? (
							<Placeholder>
								<Placeholder.Header image>
									<Placeholder.Line />
									<Placeholder.Line />
								</Placeholder.Header>
							</Placeholder>
						) : typeof props.posts !== "undefined" ? (
							props.posts.length > 0 ? (
								<CentralList
									posts={props.posts}
									contentType={props.propSent.contentType}
									contentID={props.propSent.contentID}
								/>
							) : (
								<div className="imageFix">
									<Image
										centered
										src={`${process.env.REACT_APP_BASE_URL}/undraw_empty_xct9_F5DD47.png`}
										size="large"
										verticalAlign="middle"
									/>
									<br />
									There is nothing here! Click on the add item button on the top
									right side to add an item to your list!
								</div>
							)
						) : (
							<div>No mojo as of now</div>
						)}
					</Item.Group>
				</div>
			</Responsive>
		</>
	);
}

export default ContentMiddleNoLoad;
