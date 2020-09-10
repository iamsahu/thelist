import React, { useState, useContext } from "react";
import { Modal, Button } from "semantic-ui-react";
import { Formik } from "formik";
import { UpdateItem } from "../util/graphqlExecutor";
import ContentContext from "../context/ContentContext";

function EditItem(props) {
	console.log(props);
	const [showModal, SetModal] = useState(false);
	const [content, contentChange] = useContext(ContentContext);
	function OnClose() {
		SetModal(false);
	}

	return (
		<Modal
			open={showModal}
			closeOnDimmerClick={false}
			onClose={OnClose}
			closeIcon
			trigger={
				<img
					class="h-4 float-right mr-1 object-bottom"
					src={`${process.env.REACT_APP_BASE_URL}/edit-regular.svg`}
					onClick={() => {
						SetModal(true);
					}}
				/>
				// <Button
				// 	icon="edit"
				// 	size="tiny"
				// 	floated="right"
				// 	basic
				// 	color="black"
				// 	onClick={() => SetModal(true)}
				// />
				// <button
				// 	class="lg:mx-0 gradient hover:bg-black hover:text-white font-bold rounded-md py-3 px-3 shadow-lg float-right ml-1 bg-white text-black border-gray-800"
				// 	onClick={() => SetModal(true)}
				// >
				// 	<i class="fas fa-edit"></i>
				// </button>
			}
			size="large"
		>
			<Modal.Header>Edit Item</Modal.Header>
			<Modal.Content>
				<Formik
					initialValues={{
						title: props.item.name,
						link: props.item.link,
						image: props.item.auto_image,
						description:
							props.item.description === ""
								? props.item.auto_description
								: props.item.description,
					}}
					// validate={(values) => {
					// 	const errors = {};
					// 	if (!values.email) {
					// 		errors.email = "Required";
					// 	} else if (
					// 		!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
					// 	) {
					// 		errors.email = "Invalid email address";
					// 	}
					// 	return errors;
					// }}
					onSubmit={(values, { setSubmitting }) => {
						console.log("Here");
						UpdateItem(
							props.item.id,
							values.link,
							values.description,
							values.description,
							values.image,
							values.title,
							props.item.list_id,
							props.item.curator
						)
							.then((data) => {
								console.log(data);
								SetModal(false);
								contentChange((content) => ({ ...content, add: "ad" }));
							})
							.catch((error) => console.log(error));
						// setTimeout(() => {
						// 	alert(JSON.stringify(values, null, 2));
						// 	setSubmitting(false);
						// }, 400);
					}}
				>
					{({
						values,
						errors,
						touched,
						handleChange,
						handleBlur,
						handleSubmit,
						isSubmitting,
						/* and other goodies */
					}) => (
						<form onSubmit={handleSubmit}>
							<label className="font-semibold">Title</label>
							<input
								className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal mb-4"
								placeholder="Title"
								name="title"
								onChange={handleChange}
								value={values.title}
							/>
							<label className="font-semibold">Link</label>
							<input
								className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal mb-4"
								placeholder="Link"
								onChange={handleChange}
								name="link"
								value={values.link}
							/>
							<label className="font-semibold">Image Link</label>
							<input
								className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal mb-4"
								placeholder="image"
								onChange={handleChange}
								name="image"
								value={values.image}
							/>
							<label className="font-semibold">Description</label>
							<textarea
								className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal h-32"
								placeholder="Description"
								onChange={handleChange}
								name="description"
								value={values.description}
							/>
							<button
								type="submit"
								disabled={isSubmitting}
								className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
							>
								Submit
							</button>
						</form>
					)}
				</Formik>
			</Modal.Content>
		</Modal>
	);
}

export default EditItem;
