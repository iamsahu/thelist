import React, { useState, useContext } from "react";
import { Image, Dimmer, Button, Modal, Form } from "semantic-ui-react";
import {
	UpdateListImage,
	GetListImage,
	GETLISTIMAGE,
	UPDATEIMAGE,
} from "../util/graphqlExecutor";
import useForm from "../util/hook";
import { useMutation } from "@apollo/react-hooks";
import UserContext from "../context/UserContext";

function ListIcon(props) {
	const [userC, userChange] = useContext(UserContext);
	const [active, setactive] = useState(false);
	const [showModal, SetModal] = useState(false);
	const [imageurl, setimageurl] = useState(
		"https://react.semantic-ui.com/images/wireframe/square-image.png"
	);
	const [editstate, seteditstate] = useState(false);

	const handleShow = () => setactive(true);
	const handleHide = () => setactive(false);

	const loadData = () => {
		// console.log(props);
		GetListImage(props.id).then((response) => {
			// console.log(response);
			if (response.lists[0].image_url === '""') {
				setimageurl(
					"https://react.semantic-ui.com/images/wireframe/square-image.png"
				);
				values.image_url = "";
			} else {
				setimageurl(response.lists[0].image_url);
				values.image_url = response.lists[0].image_url;
			}

			if (response.lists[0].curator_id === userC.loggedin_user_id) {
				seteditstate(true);
			} else {
				seteditstate(false);
			}
		});
	};

	if (props.id !== "") {
		loadData();
	}

	const updateCache = (cache, { data }) => {
		// Fetch the items from the cache
		const existingItems = cache.readQuery({
			query: GETLISTIMAGE,
			variables: {
				id: props.id,
			},
		});
		// console.log(existingItems);
		// Add the new item to the cache
		// const newItem = data.update_lists.returning[0];
		cache.writeQuery({
			query: GETLISTIMAGE,
			data: existingItems,
		});
		values.image_url = "";
	};

	const { values, onChange, onSubmit } = useForm(createPostCallback, {
		image_url: "",
	});

	const [modifyImage, { error }] = useMutation(UPDATEIMAGE, {
		variables: {
			id: props.id,
			image_url: values.image_url,
		},
		update: updateCache,
		onError: (error) => {
			console.log(error);
		},
	});

	// if(imageurl===-1){
	//     if(props.image_url==='""'){
	//         setimageurl("https://react.semantic-ui.com/images/wireframe/square-image.png")
	//     }else{
	//         setimageurl(props.image_url)
	//     }
	// }else if(imageurl!==props.image_url){

	// }
	//     setimageurl(props.image_url)

	function createPostCallback() {
		modifyImage();
		SetModal(false);
		handleHide();
	}

	function OnClose() {
		SetModal(false);
		handleHide();
	}

	const editform = (
		<Modal
			open={showModal}
			closeOnDimmerClick={false}
			onClose={OnClose}
			closeIcon
			trigger={
				<Button icon="edit" floated="right" onClick={() => SetModal(true)} />
			}
			size="large"
		>
			<Modal.Header>Edit List Image</Modal.Header>
			<Modal.Content>
				<Form onSubmit={onSubmit}>
					<Form.Group>
						<Form.Field inline name="image_url" width={10}>
							<label>Image URL</label>
							<Form.TextArea
								name="image_url"
								style={{ minHeight: 50 }}
								onChange={onChange}
								value={values.image_url}
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

	const content = editform; //<Button icon="edit" />;

	return (
		<>
			{editstate ? (
				<Dimmer.Dimmable
					as={Image}
					dimmed={active}
					dimmer={{ active, content }}
					onMouseEnter={handleShow}
					onMouseLeave={handleHide}
					// size="medium"
					avatar
					src={imageurl}
				/>
			) : (
				<Image src={imageurl} avatar />
			)}
		</>
	);

	return (
		<>
			{props.image_url === '""' ? (
				// <Image
				// 	src="https://react.semantic-ui.com/images/wireframe/square-image.png"
				// 	avatar
				// />
				<Dimmer.Dimmable
					as={Image}
					dimmed={active}
					dimmer={{ active, content }}
					onMouseEnter={handleShow}
					onMouseLeave={handleHide}
					// size="medium"
					avatar
					src="https://react.semantic-ui.com/images/wireframe/square-image.png"
				/>
			) : (
				<Dimmer.Dimmable
					as={Image}
					dimmed={active}
					dimmer={{ active, content }}
					onMouseEnter={handleShow}
					onMouseLeave={handleHide}
					// size="medium"
					avatar
					src={props.image_url}
				/>
				// <Image src={props.image_url} avatar />
			)}
		</>
	);
}

export default ListIcon;
