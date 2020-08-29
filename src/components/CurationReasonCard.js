import React, { useContext, useState } from "react";
import { Card, Button, Modal, Form } from "semantic-ui-react";
import ContentContext from "../context/ContentContext";
import {
	GetListDescription,
	ChangeListDescription,
	GET_LIST_DESCRIPTION,
	CHANGE_LIST_DESCRIPTION,
} from "../util/graphqlExecutor";
import UserContext from "../context/UserContext";
import useForm from "../util/hook";
import { useMutation } from "@apollo/react-hooks";
import PrivacyStatus from "./PrivacyStatus";
import DeleteList from "./DeleteList";

function CurationReasonCard(props) {
	const [content, contentChange] = useContext(ContentContext);
	const [userC, userChange] = useContext(UserContext);
	const [id, setid] = useState("");
	const [description, setDescription] = useState("");
	const [editState, seteditState] = useState(false);
	const [privatestate, setprivatestate] = useState(false);
	const [paid, setPaid] = useState(false);
	const [showModal, SetModal] = useState(false);
	// console.log(props);
	const { values, onChange, onSubmit } = useForm(createPostCallback, {
		description: "",
	});

	const loadData = () => {
		// GetListDescription({ listid: content.currentListID })
		GetListDescription({ listid: props.id })
			.then((response) => {
				// console.log(response);
				if (typeof response !== "undefined") {
					setDescription(response.lists[0].description);
					setid(response.lists[0].id);
					// if (values.description === "")
					values.description = response.lists[0].description;
					setprivatestate(response.lists[0].private);
					setPaid(response.lists[0].paid);
					if (response.lists[0].curator_id === userC.loggedin_user_id) {
						seteditState(true);
					} else {
						seteditState(false);
					}
				}
				// contentChange(content=>({...content,contentDescription:response.lists[0].description}))
			})
			.catch((error) => console.log(error));
	};

	const updateCache = (cache, { data }) => {
		// Fetch the items from the cache
		const existingItems = cache.readQuery({
			query: GET_LIST_DESCRIPTION,
			variables: {
				listid: id,
			},
		});
		// Add the new item to the cache
		const newItem = data.update_lists.returning[0];
		cache.writeQuery({
			query: GET_LIST_DESCRIPTION,
			data: { lists: [newItem] },
		});
		values.description = "";
	};

	const [modifyList, { error }] = useMutation(CHANGE_LIST_DESCRIPTION, {
		variables: {
			id: id,
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

	// if (content.currentListID !== "" || props.id !== "") {
	if (props.id !== "") {
		loadData();
	}
	return (
		<>
			<Card fluid>
				{/* <Card.Content header="My Reason for this curation" /> */}
				<Card.Content description={description} />
				{/* <Card.Content>
					<Card.Description>
						<div class="font-normal text-base md:text-xl text-gray-800 w-full">
							{description}
						</div>
					</Card.Description>
				</Card.Content> */}
				{editState && (
					<Card.Content extra>
						<PrivacyStatus
							id={props.id}
							privatestate={privatestate}
							user={userC.loggedin_user_id}
						/>
						<DeleteList id={props.id} />
						{editform}
					</Card.Content>
				)}
			</Card>
		</>
	);
}

export default CurationReasonCard;
