import React, { useState } from "react";
import { GetUserDetails, UpdateUserDetails } from "../util/graphqlExecutor";
import {
	Form,
	Button,
	Input,
	Responsive,
	Grid,
	Loader,
} from "semantic-ui-react";
import useForm from "../util/hook";

function UserSettings(props) {
	// console.log(props);
	const [loaded, setLoaded] = useState("");

	const { values, onChange, onSubmit } = useForm(createPostCallback, {
		name: "",
		image: "",
		description: "",
		coffee: "",
	});

	function createPostCallback() {
		// console.log(values);
		UpdateUserDetails(
			props.match.params.id,
			values.image,
			values.name,
			values.description,
			values.coffee
		).then((response) => {
			console.log(response);
		});
	}

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
	if (typeof props.match.params.id !== "undefined")
		if (values.name === "") load(props.match.params.id);
	if (loaded === "")
		return (
			<div style={{ paddingTop: "40px" }}>
				<Loader active inline="centered" />
			</div>
		);
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

			<Form.Field name="coffee">
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

	// if (values.description === "") return <>Hello</>;

	return (
		<>
			{/* {form} */}
			<Responsive {...Responsive.onlyMobile}>{form}</Responsive>
			<Responsive minWidth={Responsive.onlyTablet.minWidth}>
				<Grid
					verticalAlign="middle"
					style={{ background: "white", height: "100%", paddingTop: "40px" }}
				>
					<Grid.Column width={3}></Grid.Column>
					<Grid.Column width={10}>{form}</Grid.Column>
					<Grid.Column width={3}></Grid.Column>
				</Grid>
			</Responsive>
		</>
	);
}

export default UserSettings;
