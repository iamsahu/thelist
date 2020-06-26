import React, { useContext, useState } from "react";
import { Modal, Button, Form, Icon } from "semantic-ui-react";
import useForm from "../util/hook";
import { useMutation } from "@apollo/react-hooks";
import {
	CREATE_LIST,
	FETCH_LISTS,
	COMBINED_FETCH,
	FETCH_ALL,
} from "../util/graphql";
import UserContext from "../context/UserContext";
import ContentContext from "../context/ContentContext";
import history from "../util/history";

function AddList() {
	const [content, contentChange] = useContext(ContentContext);
	const [listName, SetListName] = useState("");
	const [showModal, SetModal] = useState(false);
	const [userC, userChange] = useContext(UserContext);

	const { values, onChange, onSubmit } = useForm(createPostCallback, {
		list_name: "",
		description: "",
		curator: userC.loggedin_user_id,
	});

	const updateCache = (cache, { data }) => {
		const existingItems = cache.readQuery({
			query: COMBINED_FETCH,
			variables: {
				user_id: userC.loggedin_user_id,
			},
		});
		// console.log(existingItems)
		const newItem = data.insert_lists.returning[0];
		// console.log(newItem)
		existingItems.lists.push(newItem);
		// console.log(existingItems)
		cache.writeQuery({
			query: COMBINED_FETCH,
			variables: {
				user_id: userC.loggedin_user_id,
			},
			data: existingItems,
		});

		// Fetch the items from the cache
		// const existingItems = cache.readQuery({
		//   query: COMBINED_FETCH,
		//   variables: {
		//     where: { curator_id: user.loggedin_user_id}
		//   }
		// });
		// Add the new item to the cache
		// console.log(data)
		// console.log("List Insert")
		// const newItem = data.insert_lists.returning[0];
		// cache.writeQuery({
		//   query: FETCH_ALL,
		//   data: {lists: [newItem, ...existingItems.lists]}
		// });
		values.id = "";
		values.list_name = "";
		// // values.curator='';
		values.description = "";

		var newList = {
			text: newItem.list_name,
			key: newItem.list_name,
			value: newItem.id,
			id: newItem.id,
			list_name: newItem.list_name,
			// description:newItem.description,
			curator_id: newItem.curator_id,
		};
		var temp = content.lists;
		temp.push(newList);
		// console.log(temp);
		contentChange((content) => ({
			...content,
			lists: temp,
		}));
		// contentChange(content=>({...content,currentList:newItem.list_name,currentListID:newItem.id}))
		// contentChange({currentList:newItem.list_name,tags:content.tags,lists:content.lists})
		// console.log(content)

		history.push("/" + userC.loggedin_user_id + "/lists/" + newItem.id);
	};

	const [createList, { error }] = useMutation(CREATE_LIST, {
		variables: values,
		update: updateCache,
		onError: (error) => {
			console.log(error);
		},
		refetchQueries: [
			{
				query: COMBINED_FETCH,
				variables: {
					user_id: userC.loggedin_user_id,
				},
			},
		],
	});

	function createPostCallback() {
		// console.log(values)
		// console.log(user.loggedin_user_id)
		createList();
		SetModal(false);
	}

	function OnClose() {
		SetModal(false);
	}

	return (
		<>
			<Modal
				open={showModal}
				closeOnDimmerClick={false}
				onClose={OnClose}
				closeIcon
				trigger={
					<div className="icobutton">
						<Button onClick={() => SetModal(true)}>Add List</Button>
					</div>
				}
			>
				<Modal.Header>Add List</Modal.Header>
				<Modal.Content image scrolling>
					<Form onSubmit={onSubmit}>
						<Form.Field inline name="list_name">
							<label>Title</label>
							<Form.Input
								name="list_name"
								placeholder="name"
								onChange={onChange}
								value={values.list_name}
								error={error ? true : false}
							/>
						</Form.Field>
						<Form.Field inline name="description">
							<label>Description</label>
							<Form.TextArea
								name="description"
								placeholder="Description"
								style={{ minHeight: 100 }}
								onChange={onChange}
								value={values.description}
								error={error ? true : false}
							/>
							{/* <Form.Input 
                            name='description' 
                            placeholder='Description'
                            onChange={onChange}
                            value={values.description}
                            error={error?true:false}
                        /> */}
						</Form.Field>
						<Button primary type="submit">
							Submit
						</Button>
					</Form>
				</Modal.Content>
			</Modal>
		</>
	);
}

export default AddList;
