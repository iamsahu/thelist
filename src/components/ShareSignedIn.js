import React, { useContext, useState } from "react";
import UserContext from "../context/UserContext";
import { GetListsOfUser, createItem } from "../util/graphqlExecutor";
import { Form, Dropdown, Button } from "semantic-ui-react";
import useForm from "../util/hook";
import { connect } from "getstream";
import history from "../util/history";

function ShareSignedIn(props) {
	const [listData, setlistData] = useState("");
	const [userC, userChange] = useContext(UserContext);
	const [list_id, setlist_id] = useState("");
	const [seltags, setseltags] = useState("");
	const [allTags, setallTags] = useState("");
	// console.log(props);
	//Data from props to be filled in the form's appropriate field

	const { values, onChange, onSubmit } = useForm(createPostCallback, {
		name: props.title,
		link: props.url,
		description: "",
		curator: userC.loggedin_user_id,
	});

	const loadUser = (user) => {
		// if(tyuser)
		GetListsOfUser(user)
			.then((response) => {
				// console.log(response);

				const tempArr2 = response.lists.map((item) => ({
					text: item.list_name,
					key: item.list_name,
					value: item.id,
					id: item.id,
					list_name: item.list_name,
					// description: item.description,
					curator_id: item.curator_id,
				}));
				setlistData(tempArr2);
			})
			.catch((error) => console.log(error));
	};

	const handleChangeListAll = (e, { value }) => {
		setlist_id(value);
	};

	function createPostCallback() {
		var userToken;
		fetch(
			//"https://obzz0p3mah.execute-api.eu-west-3.amazonaws.com/default/getUserToken",
			"https://cors-anywhere.herokuapp.com/https://32mois0yg1.execute-api.eu-west-3.amazonaws.com/default/getUserTokenNode",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ user: userC.loggedin_user_id }),
			}
		)
			.then((r) => r.json())
			.then((data) => {
				//Write the code here for create item
				userToken = data["token"];
				console.log(userToken);
				// console.log(data);
				// console.log(process.env.REACT_APP_STREAM_API_KEY);
				const client2 = connect(
					// process.env.REACT_APP_STREAM_API_KEY,
					"pf7sgqtb4h3x",
					userToken,
					"86395"
					// process.env.REACT_APP_STREAM_APP_ID
				);
				var listfeed = client2.feed("user", userC.loggedin_user_id);
				console.log(values);
				console.log(list_id);
				console.log(userC.loggedin_user_id);

				createItem({
					...values,
					list_id: list_id,
					selTags: seltags,
					curator_id: userC.loggedin_user_id,
					tags: allTags,
					contentType: "dataentry",
					currentListID: "",
					currentTagID: "",
					listfeed,
				})
					.then((response) => {
						console.log(response);
						// console.log(response2)
						values.name = "";
						values.link = "";
						values.description = "";
						// setlistDescription(false);

						// window.close();
						history.push("/" + userC.loggedin_user_id + "/lists/" + list_id);
						window.location.href = window.location.href;
					})
					.catch((error) => {
						console.log(error);
					});
			});
	}

	function handleChangeListAddition(e, { value }) {}

	if (listData === "") loadUser(userC.loggedin_user_id);
	return (
		<>
			<Form onSubmit={onSubmit}>
				<Form.Field>
					<label>Title</label>
					<Form.Input
						name="name"
						placeholder="Title"
						onChange={onChange}
						value={values.name}
					/>
				</Form.Field>
				<Form.Field>
					<label>Link</label>
					<Form.Input
						name="link"
						placeholder="link"
						onChange={onChange}
						value={values.link}
					/>
				</Form.Field>
				<Form.Field>
					<label>Description</label>
					<Form.Input
						name="description"
						placeholder="You can add a description here"
						onChange={onChange}
						value={values.description}
					/>
				</Form.Field>
				<Form.Field>
					<label>List Name</label>
					<Dropdown
						label="List Name"
						name="list_name"
						options={Object.values(listData)}
						placeholder="Choose list name"
						search
						selection
						upward
						onChange={handleChangeListAll}
						onAddItem={handleChangeListAddition}
					/>
				</Form.Field>
				<Button primary type="submit">
					Submit
				</Button>
			</Form>
		</>
	);
}

export default ShareSignedIn;
