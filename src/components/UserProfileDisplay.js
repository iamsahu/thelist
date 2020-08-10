import React, { useContext, useState } from "react";
import {
	DoesUserExists,
	GET_USER,
	CHANGEUSERDESCRIPTION,
	GetUserStats,
} from "../util/graphqlExecutor";
import { Item, Form, Modal, Button, Statistic } from "semantic-ui-react";
import UserContext from "../context/UserContext";
import useForm from "../util/hook";
import { useMutation } from "@apollo/react-hooks";
import ReactLinkify from "react-linkify";

function UserProfileDisplay(props) {
	const [userC, userChange] = useContext(UserContext);
	const [userProfile, setuserProfile] = useState(
		"https://react.semantic-ui.com/images/avatar/large/steve.jpg"
	);
	const [username, setusername] = useState("Mojo Jojo");
	const [description, setdescription] = useState(
		"Something witty that tells how witty you are"
	);
	const [twitterNumber, setTwitterNumber] = useState("1");
	const [showModal, SetModal] = useState(false);
	const [editState, seteditState] = useState(false);
	const [itemscount, setitemscount] = useState(0);
	const [listviewcount, setlistviewcount] = useState(0);
	const [listcount, setListcount] = useState(0);

	const { values, onChange, onSubmit } = useForm(createPostCallback, {
		description: "",
	});

	const loadUser = (user) => {
		// if(tyuser)
		DoesUserExists({ user_id: user })
			.then((response) => {
				// console.log(response)
				if (typeof response !== "undefined") {
					if (typeof response.user[0] !== "undefined") {
						// console.log(response.user[0]['image_link'])
						setuserProfile(response.user[0]["image_link"]);
						setusername(response.user[0]["username"]);
						setTwitterNumber(response.user[0]["id"]);
						if (response.user[0]["description"] !== null) {
							setdescription(response.user[0]["description"]);
							values.description = response.user[0]["description"];
						}
						if (response.user[0].id === userC.loggedin_user_id) {
							seteditState(true);
						} else {
							seteditState(false);
						}
					}
				}
			})
			.catch((error) => console.log(error));
		GetUserStats(user)
			.then((response) => {
				console.log(response);
				setitemscount(response.items_aggregate.aggregate.count);
				if (response.lists_aggregate.aggregate.sum.view_count === null) {
					setlistviewcount(0);
				} else {
					setlistviewcount(response.lists_aggregate.aggregate.sum.view_count);
				}
				setListcount(response.lists_aggregate.aggregate.count);
			})
			.catch((error) => console.log(error));
	};

	const updateCache = (cache, { data }) => {
		// Fetch the items from the cache
		const existingItems = cache.readQuery({
			query: GET_USER,
			variables: {
				user_id: props.user,
			},
		});
		// Add the new item to the cache
		console.log(existingItems);
		// const newItem = data.update_lists.returning[0];
		cache.writeQuery({
			query: GET_USER,
			data: existingItems,
		});
		values.description = "";
	};

	const [modifyList, { error }] = useMutation(CHANGEUSERDESCRIPTION, {
		variables: {
			id: props.user,
			description: values.description,
		},
		update: updateCache,
		onError: (error) => {
			console.log(error);
		},
	});

	function createPostCallback() {
		modifyList();
		SetModal(false);
	}

	function OnClose() {
		SetModal(false);
	}

	const editform = (
		<Modal
			open={showModal}
			closeOnDimmerClick={false}
			onClose={OnClose}
			closeIcon
			trigger={
				<Button
					icon="edit"
					size="tiny"
					floated="left"
					basic
					color="black"
					onClick={() => SetModal(true)}
				/>
			}
			size="large"
		>
			<Modal.Header>Edit Reason</Modal.Header>
			<Modal.Content>
				<Form onSubmit={onSubmit}>
					<Form.Group>
						<Form.Field inline name="description" width={10}>
							<label>Description</label>
							<Form.TextArea
								name="description"
								style={{ minHeight: 100 }}
								onChange={onChange}
								value={values.description}
								error={error ? true : false}
							/>
						</Form.Field>
					</Form.Group>
					<Button primary type="submit">
						Submit
					</Button>
				</Form>
			</Modal.Content>
		</Modal>
	);

	loadUser(props.user);
	return (
		<>
			<Item.Group>
				<Item>
					<Item.Image avatar size="small" src={userProfile} />
					<Item.Content verticalAlign="middle">
						{/* <Header as="h1"> */}
						<Item.Header>{username}</Item.Header>
						{/* </Header> */}

						<Item.Description>
							<ReactLinkify>{description}</ReactLinkify>
						</Item.Description>
						{props.user === userC.loggedin_user_id && (
							<Item.Extra>
								{editform}
								{/* <Button icon="edit" floated="left"></Button> */}
								{/* <div
									floated="right"
									dangerouslySetInnerHTML={{
										__html:
											'<link href="https://fonts.googleapis.com/css?family=Cookie" rel="stylesheet"><a class="bmc-button" target="_blank" href="https://www.buymeacoffee.com/' +
											props.user +
											'"><img src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg" alt="Buy me a coffee"><span style="margin-left:5px;font-size:28px !important;">Buy me a coffee</span></a>',
									}}
								/> */}
							</Item.Extra>
						)}
						<Item.Meta>
							<Statistic.Group size="mini" color="grey">
								<Statistic>
									<Statistic.Value>{listcount}</Statistic.Value>
									<Statistic.Label>Lists</Statistic.Label>
								</Statistic>
								<Statistic>
									<Statistic.Value>{listviewcount}</Statistic.Value>
									<Statistic.Label>Total List Views</Statistic.Label>
								</Statistic>
								<Statistic>
									<Statistic.Value>{itemscount}</Statistic.Value>
									<Statistic.Label>Items</Statistic.Label>
								</Statistic>
							</Statistic.Group>
						</Item.Meta>
						{/* <Item.Extra>Have added x unique items</Item.Extra> */}
					</Item.Content>
				</Item>
			</Item.Group>
		</>
	);
}

export default UserProfileDisplay;
