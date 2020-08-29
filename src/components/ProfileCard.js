import React, { useContext, useState } from "react";
import { Card, Image, Modal, Form, Button } from "semantic-ui-react";
import { DoesUserExists, GET_USER, MODIFY_USER } from "../util/graphqlExecutor";
import UserContext from "../context/UserContext";
import Linkify from "react-linkify";
import useForm from "../util/hook";
import { useMutation } from "@apollo/react-hooks";

function ProfileCard() {
	const [userC, userChange] = useContext(UserContext);
	const [userProfile, setuserProfile] = useState(
		"https://react.semantic-ui.com/images/avatar/large/steve.jpg"
	);
	const [username, setusername] = useState("Mojo Jojo");
	const [description, setdescription] = useState(
		"Something witty that tells how witty you are"
	);
	// const [twitterNumber, setTwitterNumber] = useState("1");
	const [showModal, SetModal] = useState(false);
	// const [id, setid] = useState("");
	const [editState, seteditState] = useState(false);

	const { values, onChange, onSubmit } = useForm(createPostCallback, {
		description: "",
	});

	const loadUser = () => {
		DoesUserExists({ user_id: userC.curator_id }).then((response) => {
			// console.log(response)
			if (typeof response !== "undefined") {
				if (typeof response.user[0] !== "undefined") {
					// console.log(response.user[0]['image_link'])
					setuserProfile(response.user[0]["image_link"]);
					setusername(response.user[0]["username"]);
					// setTwitterNumber(response.user[0]["id"]);
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
		});
	};

	loadUser();

	const updateCache = (cache, { data }) => {
		// Fetch the items from the cache
		// const existingItems = cache.readQuery({
		// 	query: GET_USER,
		// 	variables: {
		// 		user_id: userC.loggedin_user_id,
		// 	},
		// });
		// Add the new item to the cache
		const newItem = data.update_lists.returning[0];
		cache.writeQuery({
			query: GET_USER,
			data: { user: [newItem] },
		});
		values.description = "";
	};

	const [modifyDescription, { error }] = useMutation(MODIFY_USER, {
		variables: {
			user_id: userC.loggedin_user_id,
			description: values.description,
		},
		update: updateCache,
		onError: (error) => {
			console.log(error);
		},
	});

	function createPostCallback() {
		modifyDescription();
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
					floated="right"
					basic
					color="black"
					onClick={() => SetModal(true)}
				/>
				// <button
				// 	class="lg:mx-0 gradient hover:bg-black hover:text-white font-bold rounded-md py-3 px-3 shadow-lg float-right ml-1 bg-white text-black border-gray-800"
				// 	onClick={() => SetModal(true)}
				// >
				// 	<i class="fas fa-edit"></i>
				// </button>
			}
		>
			<Modal.Header>Edit Reason</Modal.Header>
			<Modal.Content image scrolling>
				<Form onSubmit={onSubmit}>
					<Form.Field inline name="description">
						<label>Description</label>
						<Form.TextArea
							name="description"
							style={{ minHeight: 100 }}
							onChange={onChange}
							value={values.description}
							error={error ? true : false}
						/>
					</Form.Field>
					<Button primary type="submit">
						Submit
					</Button>
				</Form>
			</Modal.Content>
		</Modal>
	);

	return (
		<>
			<div>
				<Card fluid>
					<Card.Content>
						<Image floated="left" size="mini" src={userProfile} circular />
						<Card.Header>{username}</Card.Header>
						{/* <Card.Meta>You are twitter user # {twitterNumber}</Card.Meta> */}
						<Card.Description>
							<Linkify>{description}</Linkify>
						</Card.Description>
						{editState && <Card.Content extra>{editform}</Card.Content>}
					</Card.Content>
				</Card>
			</div>
		</>
	);
}

export default ProfileCard;
