import React, { useContext, useState } from "react";
import {
	Form,
	Button,
	Item,
	Responsive,
	Grid,
	Loader,
	Dimmer,
} from "semantic-ui-react";
import useForm from "../util/hook";
import { UpdateUserDetails, GetTopLists } from "../util/graphqlExecutor";
import UserContext from "../context/UserContext";
import { Grid as GG, Card as CC } from "@material-ui/core";
import FollowSignUpCard from "../components/FollowSignUpCard";
import history from "../util/history";

function SignUpProfilePage(props) {
	const [userC, userChange] = useContext(UserContext);
	const [topLists, settopLists] = useState("");
	const [displayTopLists, setdisplayTopLists] = useState(false);
	const { values, onChange, onSubmit } = useForm(createPostCallback, {
		name: userC.name,
		image: userC.image_link,
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
			""
		).then((response) => {
			console.log(response);
			setdisplayTopLists(true);
		});
	}

	const form = (
		<Form onSubmit={onSubmit} className="p-4">
			<Form.Field>
				<label>Display Name</label>
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
				<label>Profile Photo</label>
				<Form.Input
					name="image"
					placeholder="Image Link"
					onChange={onChange}
					value={values.image}
				/>
			</Form.Field>

			{/* <Form.Field name="coffee">
				<label>Buy Me A Coffee </label>
				<Input
					label="buymeacoff.ee/"
					name="coffee"
					placeholder="Buy Me a coffee name"
					onChange={onChange}
					value={values.coffee}
				/>
			</Form.Field> */}

			<Button secondary type="submit">
				Submit
			</Button>
			<Button basic color="black" onClick={() => setdisplayTopLists(true)}>
				Skip
			</Button>
		</Form>
	);

	if (topLists === "") {
		settopLists("1");
		GetTopLists().then((response) => {
			settopLists(response["lists"]);
		});
	}

	// if (topLists === "" || topLists === "1") {
	// 	return <div></div>;
	// }

	return (
		<div className="w-full p-10 content-center items-center flex justify-center lg:justify-center xl:justify-center md:justify-center">
			<div className="px-4 pt-6 pb-8 md:w-2/3">
				{displayTopLists ? (
					<div className="py-2 font-normal text-3xl mb-4">
						Follow some of the popular curations!{" "}
					</div>
				) : (
					<div className="py-2 font-normal text-3xl mb-4">
						Welcome to The List Space!
					</div>
				)}
				<div className="bg-white shadow-md rounded px-2 pt-2 pb-2 mt-20 flex align-middle">
					{displayTopLists ? (
						<>
							<div className="px-2 md:px-2">
								<Responsive {...Responsive.onlyMobile}>
									<Item.Group divided relaxed="very">
										{topLists.map((item) => (
											<FollowSignUpCard item={item} key={item.id} />
										))}
									</Item.Group>
								</Responsive>
								<Responsive minWidth={Responsive.onlyTablet.minWidth}>
									<GG container spacing={2}>
										{topLists.map((item) => (
											<GG key={item.id} item xs={4}>
												<FollowSignUpCard item={item} key={item.id} />
											</GG>
										))}
									</GG>
								</Responsive>
								<button
									className="mx-auto lg:mx-0 gradient bg-black text-white font-bold rounded-lg py-4 px-8 shadow-lg mt-2 hover:bg-white hover:text-black"
									onClick={() => {
										history.push("/" + userC.loggedin_user_id);
										window.location.href = window.location.href;
									}}
								>
									Continue
								</button>
							</div>
						</>
					) : (
						<>
							<div className="w-full ">{form}</div>
							<div className="hidden md:inline w-1/2"></div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}

export default SignUpProfilePage;
