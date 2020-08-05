import React from "react";
import { GetUserDetails } from "../util/graphqlExecutor";
import { Form, Button, Input } from "semantic-ui-react";
import useForm from "../util/hook";

function UserSettings(props) {
	console.log(props);

	const { values, onChange, onSubmit } = useForm(createPostCallback, {
		name: "",
		image: "",
		description: "",
		coffee: "",
	});

	function createPostCallback() {}

	const load = (id) => {
		GetUserDetails(id).then((data) => {
			// console.log(data);
			values.name = data.user[0].username;
			values.image = data.user[0].image_link;
			values.description = data.user[0].description;
			values.coffee = data.user[0].buymeacoffee;
			console.log("complete");
		});
	};
	if (typeof props.match.params.id !== "undefined") load(props.match.params.id);

	const form = (
		<Form onSubmit={onSubmit}>
			<Form.Field>
				<label>User Name</label>
				<Form.Input
					name="name"
					placeholder="User Name"
					onChange={onChange}
					value={values.name}
				/>
			</Form.Field>
			<Form.Field>
				<label>Description</label>
				<Form.Input
					name="description"
					placeholder="Description"
					onChange={onChange}
					value={values.description}
				/>
			</Form.Field>
			<Form.Field>
				<label>Image Link</label>
				<Form.Input
					name="image"
					placeholder="Image Link"
					onChange={onChange}
					value={values.image}
				/>
			</Form.Field>

			<Form.Field>
				<label>Buy Me A Coffee </label>
				<Input
					label="buymeacoff.ee/"
					name="coffee"
					placeholder="Buy Me a coffee name"
					onChange={onChange}
					value={values.coffee}
				/>
			</Form.Field>

			<Button primary type="submit">
				Submit
			</Button>
		</Form>
	);

	if (values.description === "") return <>Hello</>;

	return (
		<>
			{form}
			{/* <Responsive minWidth={Responsive.onlyMobile.minWidth}>{form}</Responsive>
			<Responsive minWidth={Responsive.onlyTablet.minWidth}>{form}</Responsive> */}
		</>
	);
}

export default UserSettings;
