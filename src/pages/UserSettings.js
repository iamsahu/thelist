import React, { useState, useContext } from "react";
import {
	GetUserDetails,
	UpdateUserDetails,
	GetUserData,
} from "../util/graphqlExecutor";
import {
	Form,
	Button,
	Input,
	Responsive,
	Grid,
	Loader,
	Dimmer,
} from "semantic-ui-react";
import useForm from "../util/hook";
import PocketSignIn from "../components/PocketSignIn";
import { CSVLink, CSVDownload } from "react-csv";
import UserContext from "../context/UserContext";

function UserSettings(props) {
	// console.log(props);
	const [loaded, setLoaded] = useState("");
	const [pocket_token, setPocket_token] = useState("");
	const [pocket_username, setPocket_username] = useState("");
	const [downloadData, setDownloadData] = useState("");
	const [loadingbut, setloadingbut] = useState(false);
	const [dimmer, setdimmer] = useState(false);
	const [userC, userChange] = useContext(UserContext);
	const { values, onChange, onSubmit } = useForm(createPostCallback, {
		name: "",
		image: "",
		description: "",
		coffee: "",
	});

	function createPostCallback() {
		// console.log(values);
		UpdateUserDetails(
			userC.loggedin_user_id,
			values.image,
			values.name,
			values.description,
			values.coffee
		).then((response) => {
			console.log(response);
		});
	}

	function GetData() {
		setdimmer(true);
		GetUserData(userC.loggedin_user_id)
			.then((data) => {
				console.log(data);
				setDownloadData(data.items);
				setdimmer(false);
			})
			.catch((errors) => console.log(errors));
	}

	const load = (id) => {
		GetUserDetails(id).then((data) => {
			// console.log(data);
			values.name = data.user[0].username;
			values.image = data.user[0].image_link;
			values.description = data.user[0].description;
			values.coffee = data.user[0].buymeacoffee;
			setPocket_token(data.user[0].pocket_token);
			setPocket_username(data.user[0].pocket_username);
			setLoaded("loaded");
			console.log("complete");
		});
	};
	if (typeof userC.loggedin_user_id !== "undefined")
		if (values.name === "") load(userC.loggedin_user_id);
	if (loaded === "")
		return (
			<div style={{ paddingTop: "40px" }}>
				<Loader active inline="centered" />
			</div>
		);
	const form = (
		<Form onSubmit={onSubmit} className="p-4">
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
	const dd = (
		<Dimmer.Dimmable dimmed={dimmer} inverted className="p-4">
			<div>
				<Button onClick={GetData} primary type="submit">
					Download Your Data
				</Button>
				{downloadData !== "" && (
					<CSVLink
						data={downloadData}
						filename={"my-data.csv"}
						className="btn btn-primary"
						target="_blank"
					>
						Download CSV
					</CSVLink>
					// <CSVDownload data={downloadData} target="_blank" />
				)}
				<Dimmer active={dimmer} inverted>
					<Loader />
					Saving
				</Dimmer>
			</div>
		</Dimmer.Dimmable>
	);
	return (
		<>
			{/* {form} */}
			<Responsive {...Responsive.onlyMobile}>
				{form}
				{dd}
				{
					<PocketSignIn
						className="p-4"
						pocket_token={pocket_token}
						pocket_username={pocket_username}
					/>
				}
			</Responsive>
			<Responsive minWidth={Responsive.onlyTablet.minWidth}>
				<Grid
					verticalAlign="middle"
					style={{ background: "white", height: "100%", paddingTop: "40px" }}
				>
					<Grid.Column width={3}></Grid.Column>
					<Grid.Column width={10}>
						<div>
							{form}
							{dd}
							{
								<PocketSignIn
									className="p-4 justify-center ml-4"
									pocket_token={pocket_token}
									pocket_username={pocket_username}
								/>
							}
							{/* {process.env.REACT_APP_BASE_URL === "http://localhost:3000" ? (
								<PocketSignIn
									className="p-4"
									pocket_token={pocket_token}
									pocket_username={pocket_username}
								/>
							) : (
								<></>
							)} */}
						</div>
					</Grid.Column>
					<Grid.Column width={3}></Grid.Column>
				</Grid>
			</Responsive>
		</>
	);
}

export default UserSettings;
