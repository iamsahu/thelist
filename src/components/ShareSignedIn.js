import React, { useContext, useState } from "react";
import UserContext from "../context/UserContext";
import { GetListsOfUser } from "../util/graphqlExecutor";
import { Form, Dropdown, Button } from "semantic-ui-react";
import useForm from "../util/hook";

function ShareSignedIn(props) {
	const [listData, setlistData] = useState("");
	const [userC, userChange] = useContext(UserContext);
	const [list_id, setlist_id] = useState("");
	console.log(props);
	//Data from props to be filled in the form's appropriate field

	const { values, onChange, onSubmit } = useForm(createPostCallback, {
		name: "",
		link: "",
		description: "",
		curator: "",
	});

	const loadUser = (user) => {
		// if(tyuser)
		GetListsOfUser(user)
			.then((response) => {
				console.log(response);

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

	function createPostCallback() {}

	if (listData === "") loadUser(userC.loggedin_user_id);
	return (
		<>
			<Form>
				<Form.Field>
					<Form.Input
						name="name"
						placeholder="name"
						onChange={onChange}
						value={values.name}
					/>
				</Form.Field>
				<Form.Field>
					<Form.Input
						name="name"
						placeholder="name"
						onChange={onChange}
						value={values.link}
					/>
				</Form.Field>
				<Form.Field>
					<Form.Input
						name="name"
						placeholder="name"
						onChange={onChange}
						value={values.description}
					/>
				</Form.Field>
				<Form.Input>
					<Dropdown
						label="List Name"
						name="list_name"
						options={Object.values(listData)}
						placeholder="Choose list name"
						search
						selection
						upward
						onChange={handleChangeListAll}
					/>
				</Form.Input>
				<Button type="submit">Submit</Button>
			</Form>
		</>
	);
}

export default ShareSignedIn;
