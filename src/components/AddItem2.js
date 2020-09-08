import React, { useContext, useState } from "react";
import {
	Modal,
	Button,
	Form,
	Dropdown,
	Dimmer,
	Loader,
	Segment,
} from "semantic-ui-react";
import useForm from "../util/hook";
// import { useMutation, useQuery } from "@apollo/react-hooks";
// import { CREATE_ITEM, INSERT_TAG_MULTI } from "../util/graphql";
import {
	FETCH_FEED_ITEMS,
	// INSERT_TAG,
	// INSERT_ITEM_OLD_TAG_MULTI,
} from "../util/graphql";
import UserContext from "../context/UserContext";
import ContentContext from "../context/ContentContext";
import { createItem } from "../util/graphqlExecutor";
import StreamContext from "../context/StreamContext";
// import Tap from "react-interactions";
// import Reward from "react-rewards";
import ReactGA from "react-ga";
import Mixpanel from "../util/mix";
import useClippy from "use-clippy";
import gql from "graphql-tag";

const ALL_TAGS = gql`
	query MyQuery {
		tag {
			id
			name
		}
	}
`;

function GetDetails(link) {
	var data = { key: process.env.REACT_APP_LINKPREVIEW, q: link };
	// console.log(data);
	return fetch("https://api.linkpreview.net", {
		method: "POST",
		mode: "cors",
		body: JSON.stringify(data),
	});
}

function GetDetails1(link, signal) {
	var data = { key: process.env.REACT_APP_LINKPREVIEW, q: link };
	console.log(data);
	// return fetch('https://api.linkpreview.net', {
	//   method: 'POST',
	//   mode: 'cors',
	//   body: JSON.stringify(data),
	// })

	return fetch("https://api.linkpreview.net", {
		method: "POST",
		signal: signal,
		mode: "cors",
		body: JSON.stringify(data),
	});
}

function validURL(str) {
	var pattern = new RegExp(
		"^(https?:\\/\\/)?" + // protocol
		"((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
		"((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
		"(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
		"(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
			"(\\#[-a-z\\d_]*)?$",
		"i"
	); // fragment locator
	return !!pattern.test(str);
}

function isValidURL(string) {
	var res = string.match(
		/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
	);
	return res !== null;
}

let controller;
controller = new AbortController();
const signal = controller.signal;

function AddItem2(props) {
	// console.log(props);
	const [content, contentChange] = useContext(ContentContext);
	const [clipboard, setClipboard] = useClippy();
	const [userC, userChange] = useContext(UserContext);
	const [multiTag, SetMultiTag] = useState([]);
	const [showModal, SetModal] = useState(false);
	const [dimmer, setDimmer] = useState(false);
	const [newItemID, SetItemID] = useState("");
	const [dropTag, SetDropTag] = useState(content.alltags);
	const [dropList, SetDropList] = useState(content.lists);
	const [listDescription, setlistDescription] = useState(false);

	//Figure out how to add content to thte dropTag

	const [errorList, setErrorList] = useState(false);
	const [errorLink, setErrorLink] = useState(false);
	const [errorName, setErrorName] = useState(false);
	const [errorDescription, setErrorDescription] = useState(false);
	const [streamClient, streamuserFeed] = useContext(StreamContext);
	const { values, onChange, onSubmit } = useForm(createPostCallback, {
		name: "",
		link: "",
		listDescription: "",
		description: "",
		curator: userC.loggedin_user_id,
		suggestion: false,
	});

	// const { loading, error, data } = useQuery(ALL_TAGS,{ fetchPolicy: "network-only" })

	// if(!loading){
	//     // console.log(data)
	//     const tempArr = data.tag.map(post=>({
	//         text:post.name,
	//         key:post.name,
	//         value:post.id}))
	//     console.log(tempArr)
	// }

	const updateCache = (cache, { data }) => {
		// Fetch the items from the cache
		const existingItems = cache.readQuery({
			query: FETCH_FEED_ITEMS,
		});
		// Add the new item to the cache
		const newItem = data.insert_items.returning[0];
		cache.writeQuery({
			query: FETCH_FEED_ITEMS,
			data: { items: [newItem, ...existingItems.items] },
		});
		values.reason = "";
		values.name = "";
		values.link = "";
		values.description = "";
		values.data = SetItemID(newItem.id);
	};

	// const [createPost,{error}] = useMutation(CREATE_ITEM,{
	//     variables:{...values,list_id:listID},
	//     update:updateCache,
	//     onError:(error)=>{
	//         console.log(error)
	// }});

	function createPostCallback() {
		// console.log(content.list_id)
		console.log(values);
		var errors = false;
		// if (typeof content.list_id === "undefined") {
		// 	setErrorList(true);
		// 	errors = true;
		// } else {
		// 	setErrorList(false);
		// }
		// if (values.name === "") {
		// 	setErrorName(true);
		// 	errors = true;
		// } else {
		// 	setErrorName(false);
		// }
		if (values.link === "") {
			setErrorLink(true);
			errors = true;
		} else {
			if (isValidURL(values.link) || validURL(values.link)) {
				setErrorLink(false);
			} else {
				setErrorLink(true);
				errors = true;
			}
		}
		// if(values.description===""){
		//     setErrorDescription(true)
		//     errors=true
		// }else{
		//     setErrorDescription(false)
		// }

		if (content.contentType === "tags") {
			//If the added tag to article also has the tag with which the current content is being displayed
		} else if (content.contentType === "lists") {
			//If current list is open is the list to which the new item is being added
		}
		var auto_description = "";
		var auto_image = "";

		console.log(props.listID);
		if (!errors) {
			setDimmer(true);
			GetDetails(values.link)
				.then(function (response) {
					return response.text();
				})
				.then((data) => {
					// var data = response.text();
					// console.log(data);

					data = JSON.parse(data);
					// console.log(data["description"]);
					if (data["description"] === "Invalid response status code (0)") {
					} else if (data["description"] === "Linkpreview service denied") {
					} else if (
						data["description"] === "Too many requests / rate limit exceeded"
					) {
					} else {
						// console.log(data["description"]);
						auto_description = data["description"];
						auto_image = data["image"];
						if (values.name !== "") values.name = data["title"];
					}
					// return "hello";
					console.log(values);
					createItem({
						...values,
						list_id: props.listID,
						selTags: content.selTags,
						curator_id: userC.loggedin_user_id,
						tags: content.alltags,
						contentType: content.contentType,
						currentListID: content.currentListID,
						currentTagID: content.currentTagID,
						auto_description,
						auto_image,
					}).then((response) => {
						// console.log(response);
						if (typeof response.data.insert_item_tag !== "undefined") {
							if (response.data.insert_item_tag.returning.length > 0) {
								var tempTag = content.tags;
								var tempAllTags = content.alltags;
								for (
									let index = 0;
									index < response.data.insert_item_tag.returning.length;
									index++
								) {
									tempTag.push({
										text:
											response.data.insert_item_tag.returning[index].tag.name,
										key:
											response.data.insert_item_tag.returning[index].tag.name,
										value: response.data.insert_item_tag.returning[index].id,
									});
									tempAllTags.push({
										text:
											response.data.insert_item_tag.returning[index].tag.name,
										key:
											response.data.insert_item_tag.returning[index].tag.name,
										value: response.data.insert_item_tag.returning[index].id,
									});
								}
								contentChange((content) => ({
									...content,
									tags: tempTag,
									alltags: tempAllTags,
								}));
							}
						}
						contentChange((content) => ({ ...content, add: "ad" }));
						SetModal(false);
						if (process.env.REACT_APP_BASE_URL !== "http://localhost:3000")
							ReactGA.event({
								category: "Item",
								action: "Create",
								transport: "beacon",
							});
						Mixpanel.track("Item Created");

						values.reason = "";
						values.name = "";
						values.link = "";
						values.description = "";
						setlistDescription(false);
					});
				});

			// reward.rewardMe();
		}
	}

	const handleChange = (e, { value }) => {
		contentChange((content) => ({ ...content, selTags: value }));
	};

	function handleAddition(e, { value }) {
		// console.log(value)
		if (dropTag.length > 0) {
			SetDropTag((dropTag) => [...dropTag, { text: value, value }]);
		} else {
			SetDropTag((dropTag) => [{ text: value, value }]);
		}
	}

	const handleChangeList = (e, { value }) => {
		// console.log(e)
		// console.log(value)
		if (
			!/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
				value
			)
		) {
			setlistDescription(true);
		} else {
			setlistDescription(false);
			values.listDescription = "";
		}
		contentChange((content) => ({ ...content, list_id: value }));
		// console.log(dropList)
	};

	function handleChangeListAddition(e, { value }) {
		// console.log(e)
		// console.log(value)
		if (
			!/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
				value
			)
		) {
			setlistDescription(true);
		} else {
			setlistDescription(false);
			values.listDescription = "";
		}
		if (dropList.length > 0) {
			SetDropList((dropList) => [...dropList, { text: value, value }]);
		} else {
			SetDropList((dropList) => [{ text: value, value }]);
		}
	}

	function FindTagName(id) {
		for (var tag in content.tags) {
			if (content.tags[tag]["value"] === id) {
				return content.tags[tag]["text"];
			}
		}
		return "";
	}

	function OnClose() {
		setErrorList(false);
		setErrorDescription(false);
		setErrorLink(false);
		setErrorName(false);
		SetModal(false);
		setDimmer(false);
	}

	function onClick(event) {
		// console.log(clipboard)
		// if(clipboard!==''){

		//     if(isValidURL(clipboard)){
		//         alert({clipboard})
		//     }
		// }
		SetModal(true);
		setDimmer(false);
		SetDropTag(content.alltags);
		// if(!loading){
		//     // console.log(data)
		//     const tempArr = data.tag.map(post=>({
		//         text:post.name,
		//         key:post.name,
		//         value:post.id}))
		//     SetDropTag(tempArr)
		// }

		SetDropList(content.lists);
	}

	function linkCheck(event, { value }) {
		// if(isValidURL(value)||validURL(value)){
		//TODO Realtime fetch and display
		// controller.abort()
		// GetDetails(value,signal).then(function(response) {
		//     return response.text();
		//   }).then(function(data) {
		//     console.log(data); // this will be a string
		//     values.name=data['title']
		//     values.description=data['description']
		//   });
		// }
	}

	function OpenHandle() {
		SetDropList(content.lists);
		SetDropTag(content.alltags);
		contentChange((content) => ({ ...content, selTags: "" }));
		console.log("Open Modal");
	}
	// if (typeof dropTag === "undefined") return <></>;

	return (
		<>
			{/* <Reward
				ref={(ref) => {
					setreward(ref);
				}}
				type="confetti"
			> */}

			<Modal
				size="small"
				open={showModal}
				closeOnDimmerClick={false}
				onClose={OnClose}
				closeIcon
				centered={false}
				onOpen={OpenHandle}
				trigger={
					<Button
						size="tiny"
						// floated="right"
						basic
						color="black"
						onClick={onClick}
					>
						Add Item
					</Button>
					// <button
					// 	class="mx-auto lg:mx-0 gradient hover:bg-black hover:text-white font-bold rounded-md py-3 px-4 shadow-lg float-right ml-1 bg-white text-black border-gray-800"
					// 	onClick={onClick}
					// >
					// 	Add Item
					// </button>
				}
			>
				<Modal.Header>Add Item</Modal.Header>

				<Modal.Content image scrolling>
					<Dimmer.Dimmable dimmed={dimmer} inverted>
						<Form onSubmit={onSubmit} size="large">
							<Form.Group widths="equal">
								<Form.Field inline name="name">
									<label>Title for item</label>
									<Form.Input
										name="name"
										placeholder="name"
										onChange={onChange}
										value={values.name}
										error={errorName ? "Please Enter Name" : false}
									/>
								</Form.Field>
								<Form.Field inline name="link">
									<label>Link of the item</label>
									<Form.Input
										name="link"
										placeholder="Link"
										onChange={(e, { value }) => {
											onChange(e);
											linkCheck(e, { value });
										}}
										value={values.link}
										error={errorLink ? "Please add a link" : false}
									/>
								</Form.Field>
							</Form.Group>
							<Form.Field inline name="description">
								{/* <label>Description</label> */}
								<Form.TextArea
									label="Description"
									name="description"
									placeholder="Describe what your consumers should expect from this content. (If you are feeling lazy leave this upto us)"
									style={{ minHeight: 100 }}
									onChange={onChange}
									value={values.description}
									error={errorDescription ? "Please add a description" : false}
								/>
							</Form.Field>
							<Form.Group>
								<Form.Field inline name="tag">
									<label>Tags</label>
									<Form.Input>
										{/* {loading?<Dropdown text='Dropdown' loading />: */}
										<Dropdown
											name="tag"
											options={Object.values(dropTag)}
											placeholder="Tags"
											search
											selection
											fluid
											multiple
											allowAdditions
											// value={currentValues}
											onAddItem={handleAddition}
											onChange={handleChange}
											upward
										/>
										{/* } */}
									</Form.Input>
								</Form.Field>
							</Form.Group>
							<br />
							<Button primary type="submit">
								Submit
							</Button>
						</Form>
						<Dimmer active={dimmer} inverted>
							<Loader />
							Fetching data
						</Dimmer>
					</Dimmer.Dimmable>
				</Modal.Content>
			</Modal>

			{/* </Reward> */}
		</>
	);
}

export default AddItem2;
