import React, { useContext, useState, Suspense, lazy } from "react";
import {
	DoesUserExists,
	GET_USER,
	CHANGEUSERDESCRIPTION,
	GetUserStats,
} from "../util/graphqlExecutor";
import { Item, Form, Modal, Button, Statistic } from "semantic-ui-react";
import UserContext from "../context/UserContext";
import useForm from "../util/hook";
import { useMutation } from "@apollo/react-hooks";
import ReactLinkify from "react-linkify";
const Profile = lazy(() => import("../components/Profile"));

function UserProfileDisplay(props) {
	const [userC, userChange] = useContext(UserContext);
	const [userProfile, setuserProfile] = useState(
		"https://react.semantic-ui.com/images/avatar/large/steve.jpg"
	);
	const [username, setusername] = useState("Mojo Jojo");
	const [description, setdescription] = useState(
		"Something witty that tells how witty you are"
	);
	const [twitterNumber, setTwitterNumber] = useState("1");
	const [showModal, SetModal] = useState(false);
	const [editState, seteditState] = useState(false);
	const [itemscount, setitemscount] = useState(0);
	const [listviewcount, setlistviewcount] = useState(0);
	const [listcount, setListcount] = useState(0);

	const { values, onChange, onSubmit } = useForm(createPostCallback, {
		description: "",
		image_link: "",
	});

	const loadUser = (user) => {
		// if(tyuser)
		DoesUserExists({ user_id: user })
			.then((response) => {
				// console.log(response)
				if (typeof response !== "undefined") {
					if (typeof response.user[0] !== "undefined") {
						// console.log(response.user[0]['image_link'])
						setuserProfile(response.user[0]["image_link"]);
						setusername(response.user[0]["username"]);
						setTwitterNumber(response.user[0]["id"]);
						if (response.user[0]["description"] !== null) {
							setdescription(response.user[0]["description"]);
							values.description = response.user[0]["description"];
						}
						if (response.user[0]["image_link"] !== null) {
							values.image_link = response.user[0]["image_link"];
						}
						if (response.user[0].id === userC.loggedin_user_id) {
							seteditState(true);
						} else {
							seteditState(false);
						}
					}
				}
			})
			.catch((error) => console.log(error));
		GetUserStats(user)
			.then((response) => {
				console.log(response);
				setitemscount(response.items_aggregate.aggregate.count);
				if (response.lists_aggregate.aggregate.sum.view_count === null) {
					setlistviewcount(0);
				} else {
					setlistviewcount(response.lists_aggregate.aggregate.sum.view_count);
				}
				setListcount(response.lists_aggregate.aggregate.count);
			})
			.catch((error) => console.log(error));
	};

	const updateCache = (cache, { data }) => {
		// Fetch the items from the cache
		const existingItems = cache.readQuery({
			query: GET_USER,
			variables: {
				user_id: props.user,
			},
		});
		// Add the new item to the cache
		console.log(existingItems);
		// const newItem = data.update_lists.returning[0];
		cache.writeQuery({
			query: GET_USER,
			data: existingItems,
		});
		setdescription(values.description);
		values.description = "";
	};

	const [modifyList, { error }] = useMutation(CHANGEUSERDESCRIPTION, {
		variables: {
			id: props.user,
			description: values.description,
			image_link: values.image_link,
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
						<Form.Field inline name="image_link" width={10}>
							<label>Profile Image</label>
							<Form.TextArea
								name="image_link"
								style={{ minHeight: 100 }}
								onChange={onChange}
								value={values.image_link}
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

	if (props.user !== "") if (values.image_link === "") loadUser(props.user);
	return (
		<>
			{/* <Profile /> */}
			<main className="profile-page">
				<section
					className="relative block"
					style={{ height: "400px", width: "100%" }}
				>
					<div
						className="absolute top-0 w-full h-full bg-center bg-cover"
						style={{
							backgroundImage:
								"url('https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2710&q=80')",
						}}
					>
						<span
							id="blackOverlay"
							className="w-full h-full absolute opacity-50 bg-black"
						></span>
					</div>
					<div
						className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden"
						style={{ height: "70px", transform: "translateZ(0)" }}
					>
						<svg
							className="absolute bottom-0 overflow-hidden"
							xmlns="http://www.w3.org/2000/svg"
							preserveAspectRatio="none"
							version="1.1"
							viewBox="0 0 2560 100"
							x="0"
							y="0"
						>
							<polygon
								className="text-gray-100 fill-current"
								points="2560 0 2560 100 0 100"
							></polygon>
						</svg>
					</div>
				</section>
				<section className="relative py-2 bg-gray-100">
					<div className="container mx-auto px-4">
						<div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
							<div className="px-6">
								<div className="flex flex-wrap justify-center">
									<div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
										<div className="relative">
											<img
												alt="..."
												src={userProfile}
												className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-20"
												style={{ maxWidth: "150px" }}
											/>
										</div>
									</div>
								</div>
								<div className="text-center mt-32 w-full">
									<h3 className="text-4xl font-semibold leading-normal mt-10 mb-2 text-gray-800">
										{username}
									</h3>
									<div className="w-full lg:w-4/12 px-4 lg:order-1 container mx-auto">
										<div className="flex py-4 lg:pt-2 pt-4 justify-center">
											<div className=" p-3 text-center">
												<span className="text-xl font-bold block uppercase tracking-wide text-gray-700">
													{listcount}
												</span>
												<span className="text-sm text-gray-500">Lists</span>
											</div>
											<div className=" p-3 text-center">
												<span className="text-xl font-bold block uppercase tracking-wide text-gray-700">
													{listviewcount}
												</span>
												<span className="text-sm text-gray-500">
													Total List Views
												</span>
											</div>
											<div className=" p-3 text-center">
												<span className="text-xl font-bold block uppercase tracking-wide text-gray-700">
													{itemscount}
												</span>
												<span className="text-sm text-gray-500">Items</span>
											</div>
										</div>
									</div>
								</div>
								<div className="mt-2 py-10 border-t border-gray-300 text-center">
									<div className="flex flex-wrap justify-center">
										<div className="w-full lg:w-9/12 px-4">
											<p className="mb-2 text-lg leading-relaxed text-gray-800">
												<ReactLinkify>{description}</ReactLinkify>
											</p>
											{props.user === userC.loggedin_user_id && editform}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>

			{/* <Item.Group>
				<Item>
					<Item.Image avatar size="small" src={userProfile} />
					<Item.Content verticalAlign="middle">
						<Item.Header>{username}</Item.Header>
						<Item.Description>
							<ReactLinkify>{description}</ReactLinkify>
						</Item.Description>
						{props.user === userC.loggedin_user_id && (
							<Item.Extra>{editform}</Item.Extra>
						)}
						<Item.Meta>
							<Statistic.Group size="mini" color="grey">
								<Statistic>
									<Statistic.Value>{listcount}</Statistic.Value>
									<Statistic.Label>Lists</Statistic.Label>
								</Statistic>
								<Statistic>
									<Statistic.Value>{listviewcount}</Statistic.Value>
									<Statistic.Label>Total List Views</Statistic.Label>
								</Statistic>
								<Statistic>
									<Statistic.Value>{itemscount}</Statistic.Value>
									<Statistic.Label>Items</Statistic.Label>
								</Statistic>
							</Statistic.Group>
						</Item.Meta>
					</Item.Content>
				</Item>
			</Item.Group> */}
		</>
	);
}

export default UserProfileDisplay;
