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
	Form,
	Reveal,
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
import LikeList from "./LikeList";
import ListIcon from "./ListIcon";
// import {FETCH_FEED_ITEMS,FETCH_FEED_ITEMS_OFCURATOR} from '../util/graphql';
import UserContext from "../context/UserContext";
import {
	// LikeList,
	UnlikeList,
	DoILike,
	InsertMultiple,
	FollowThisList,
	UnfollowThisList,
	DoIFollow,
	GET_LIST_DESCRIPTION,
	CHANGE_LIST_DESCRIPTION,
} from "../util/graphqlExecutor";
import MetaTags from "react-meta-tags";
import ReactGA from "react-ga";
import Mixpanel from "../util/mix";
// import Tap from "react-interactions";
import { CSVReader } from "react-papaparse";
import StreamContext from "../context/StreamContext";
import { useAuth0 } from "../react-auth0-spa";
import useForm from "../util/hook";
import CurationReasonCard from "./CurationReasonCard";
import Follow from "./Follow";

function ContentMiddleNoLoad(props) {
	// console.log(props);
	// console.log(process.env)
	// console.log(process.env.REACT_APP_BASE_URL)
	const [content] = useContext(ContentContext);
	// const [posts, setPosts] = useState(null);
	const [userC, userChange] = useContext(UserContext);
	const [shareUrl, setshareUrl] = useState(window.location.href);
	// const [header, setheader] = useState("");
	const [description, setdescription] = useState("");
	// const [listlike, setlistlike] = useState(false);
	// const [loadState, setloadState] = useState(-1);
	const [fileUpload, setfileUpload] = useState("0");
	const [streamClient, streamuserFeed] = useContext(StreamContext);
	const [follow, setfollow] = useState(0);
	const [open, setopen] = useState(false);
	var activeItem = "home";
	// console.log(props.propSent)
	// console.log(props.propSent.description)

	const {
		user,
		isAuthenticated,
		loading,
		loginWithRedirect,
		logout,
	} = useAuth0();

	// useEffect(() => {
	// 	window.scrollTo(0, 0);
	// }, []);

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

	function OnClose() {
		setopen(false);
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
						{props.propSent.contentType === "tags" ? (
							<></>
						) : (
							<ListIcon id={props.contID} image_url={props.image_url} />
						)}

						<span>
							{props.title} <b>by</b>{" "}
							<Label as="a" image href={`/${props.propSent.curator_id}`}>
								<img src={props.userImage} />
								{props.userName}
							</Label>
						</span>
					</Header>
					{/* <p>by {props.userName}</p> */}
					{props.propSent.contentType === "lists" ? (
						<CurationReasonCard id={props.contID} />
					) : (
						<></>
					)}
					{/* <Card fluid>
						<Card.Content>
							<Card.Description>{props.desc}</Card.Description>
							{userC.loggedin_user_id !== props.propSent.curator_id && (
								<Card.Content extra>{editform}</Card.Content>
							)}
						</Card.Content>
					</Card> */}
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

			<Menu pointing secondary style={{ background: "white" }}>
				<Menu.Item
					name="Home"
					active={activeItem === "home"}
					style={{ background: "white" }}
				/>
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
					{/* <meta
						property="og:image"
						content={`${process.env.REACT_APP_BASE_URL}/thelistspace.png`}
					/> */}
					{props.propSent.contentType === "tags"
						? ((
								<meta
									property="og:image"
									content={`${process.env.REACT_APP_BASE_URL}/thelistspace.png`}
								/>
						  ),
						  (<meta name="image" content="%PUBLIC_URL%/thelistspace.png" />))
						: ((<meta property="og:image" content={props.image_url} />),
						  (<meta name="image" content={props.image_url} />))}

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
						name="title"
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
					{/* <meta
						name="og:image"
						content={`${process.env.REACT_APP_BASE_URL}/thelistspace.png`}
					/> */}

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
					{/* <meta
						name="twitter:image"
						content={`${process.env.REACT_APP_BASE_URL}/thelistspace.png`}
					/> */}
					{props.propSent.contentType === "tags" ? (
						<meta
							name="twitter:image"
							content={`${process.env.REACT_APP_BASE_URL}/thelistspace.png`}
						/>
					) : (
						<meta name="twitter:image" content={props.image_url} />
					)}
				</MetaTags>
				<Menu.Menu position="right">
					<div className="icobutton" style={{ background: "white" }}>
						{userC.loggedin_user_id !== props.propSent.curator_id &&
						content.contentType === "lists" ? (
							<LikeList props={props.propSent.contentID} />
						) : (
							<></>
						)}

						{/* {content.contentType === "lists" &&
							userC.loggedin_user_id === props.propSent.curator_id && (
								<AddItem2 />
							)} */}
						<Follow
							curator_id={props.propSent.curator_id}
							contentID={props.propSent.contentID}
						/>
						{/* {userC.loggedin_user_id !== props.propSent.curator_id &&
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
										Follow
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
										Unfollow
									</Button>
								)
							) : (
								<Modal
									open={open}
									onClose={OnClose}
									trigger={
										<Button icon onClick={() => setopen(true)}>
											<Icon name="feed" />
											Follow
										</Button>
									}
									basic
									size="small"
								>
									<Header icon="feed" content="Sign Up/Sign In" />
									<Modal.Content>
										<p>
											To subscribe you will have to sign in. Do you want to
											proceed to sign in?
										</p>
									</Modal.Content>
									<Modal.Actions>
										<Button basic color="red" inverted onClick={OnClose}>
											<Icon name="remove" /> No
										</Button>
										<Button
											color="green"
											inverted
											onClick={() => loginWithRedirect(window.location.href)}
										>
											<Icon name="checkmark" /> Yes
										</Button>
									</Modal.Actions>
								</Modal>
							))} */}

						{
							props.propSent.contentType === "lists" &&
								userC.loggedin_user_id === props.propSent.curator_id && (
									<>
										<AddItem2 listID={props.propSent.contentID} />
										{/* */}
										<Modal
											closeIcon
											trigger={
												<Button
													size="tiny"
													// floated="right"
													basic
													color="black"
												>
													Upload CSV
												</Button>
											}
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
								<Button icon size="tiny" floated="right" basic color="black">
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
								<div className="imageFix" style={{ background: "white" }}>
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
