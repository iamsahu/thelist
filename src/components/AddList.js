import React, { useContext, useState } from "react";
import { Modal, Button, Form } from "semantic-ui-react";
import useForm from "../util/hook";
import { useMutation } from "@apollo/react-hooks";
import { CREATE_LIST, COMBINED_FETCH } from "../util/graphql";
import UserContext from "../context/UserContext";
import ContentContext from "../context/ContentContext";
import history from "../util/history";
import { Formik } from "formik";

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
		// const existingItems = cache.readQuery({
		// 	query: COMBINED_FETCH,
		// 	variables: {
		// 		user_id: userC.loggedin_user_id,
		// 	},
		// });
		// console.log(existingItems);
		const newItem = data.insert_lists.returning[0];
		// console.log(newItem)
		// existingItems.lists.push(newItem);
		// console.log(existingItems);
		// cache.writeQuery({
		// 	query: COMBINED_FETCH,
		// 	variables: {
		// 		user_id: userC.loggedin_user_id,
		// 	},
		// 	data: existingItems,
		// });

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
		// values.id = "";
		// values.list_name = "";
		// // values.curator='';
		// values.description = "";

		// var newList = {
		// 	text: newItem.list_name,
		// 	key: newItem.list_name,
		// 	value: newItem.id,
		// 	id: newItem.id,
		// 	list_name: newItem.list_name,
		// description:newItem.description,
		// 	curator_id: newItem.curator_id,
		// };
		// var temp = content.lists;
		// console.log(temp);
		// temp.push(newList);
		// console.log(temp);
		// contentChange((content) => ({
		// 	...content,
		// 	lists: temp,
		// }));
		// contentChange(content=>({...content,currentList:newItem.list_name,currentListID:newItem.id}))
		// contentChange({currentList:newItem.list_name,tags:content.tags,lists:content.lists})
		console.log("list creation!");

		history.push("/" + userC.loggedin_user_id + "/lists/" + newItem.id);
		window.location.href = window.location.href;
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

	// return (
	// 	<>
	// 		<button
	// 			className="bg-white text-gray-800 active:bg-gray-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
	// 			type="button"
	// 			style={{ transition: "all .15s ease" }}
	// 			onClick={() => SetModal(true)}
	// 		>
	// 			Add List
	// 		</button>
	// 		{showModal ? (
	// 			<>
	// 				<div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
	// 					<div className="relative w-auto my-6 mx-auto max-w-6xl">
	// 						{/*content*/}
	// 						<div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
	// 							{/*header*/}
	// 							<div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
	// 								<h3 className="text-2xl font-semibold text-gray-900">
	// 									Add List
	// 								</h3>
	// 								<button
	// 									className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
	// 									onClick={() => SetModal(false)}
	// 								>
	// 									<span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
	// 										×
	// 									</span>
	// 								</button>
	// 							</div>
	// 							{/*body*/}
	// 							<div className="relative p-6 flex-auto">
	// 								<p className="my-4 text-gray-600 text-lg leading-relaxed">
	// 									<Formik
	// 										initialValues={{ email: "", password: "" }}
	// 										validate={(values) => {
	// 											const errors = {};
	// 											if (!values.email) {
	// 												errors.email = "Required";
	// 											} else if (
	// 												!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
	// 													values.email
	// 												)
	// 											) {
	// 												errors.email = "Invalid email address";
	// 											}
	// 											return errors;
	// 										}}
	// 										onSubmit={(values, { setSubmitting }) => {
	// 											setTimeout(() => {
	// 												alert(JSON.stringify(values, null, 2));
	// 												setSubmitting(false);
	// 											}, 400);
	// 										}}
	// 									>
	// 										{({
	// 											values,
	// 											errors,
	// 											touched,
	// 											handleChange,
	// 											handleBlur,
	// 											handleSubmit,
	// 											isSubmitting,
	// 											/* and other goodies */
	// 										}) => (
	// 											<form onSubmit={handleSubmit}>
	// 												<input
	// 													class="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal mb-4"
	// 													placeholder="List Name"
	// 												></input>
	// 												<textarea
	// 													class="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
	// 													placeholder="Description"
	// 												></textarea>
	// 												{/* <button type="submit" disabled={isSubmitting}>
	// 													Submit
	// 												</button> */}
	// 											</form>
	// 										)}
	// 									</Formik>
	// 								</p>
	// 							</div>
	// 							{/*footer*/}
	// 							<div className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
	// 								<button
	// 									className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
	// 									type="button"
	// 									style={{ transition: "all .15s ease" }}
	// 									onClick={() => SetModal(false)}
	// 								>
	// 									Close
	// 								</button>
	// 								<button
	// 									className="bg-green-500 text-white active:bg-green-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
	// 									type="button"
	// 									style={{ transition: "all .15s ease" }}
	// 									onClick={() => SetModal(false)}
	// 								>
	// 									Add
	// 								</button>
	// 							</div>
	// 						</div>
	// 					</div>
	// 				</div>
	// 				<div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
	// 			</>
	// 		) : null}
	// 	</>
	// );

	return (
		<>
			<Modal
				open={showModal}
				closeOnDimmerClick={false}
				onClose={OnClose}
				closeIcon
				trigger={
					<div className="icobutton">
						{/* <Button
							onClick={() => SetModal(true)}
							style={{
								background: "#ffffff",
								// "border-radius": "30px",
							}}
						>
							Add List
						</Button> */}
						<button
							class="mx-auto lg:mx-0 gradient hover:bg-black hover:text-white font-bold rounded-md py-3 px-4 shadow-lg float-right ml-2 bg-white text-black border-gray-800"
							onClick={() => SetModal(true)}
						>
							Add List
						</button>
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
