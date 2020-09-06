import React from "react";
import { List, Image, Item, Statistic, Card, Header } from "semantic-ui-react";
import Linkify from "react-linkify";
import { useHistory } from "react-router-dom";

function ProfileListItem(props) {
	const history = useHistory();
	const routeChange = (t) => {
		history.push(t);
	};
	return (
		<>
			{/* <div class="mr-1 ml-1 w-full" key={props.id}>
				<div class="container mx-auto max-w-sm rounded-lg overflow-hidden shadow-lg my-2 bg-white">
					<div
						class="relative z-10"
						style={{
							clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 5vw))",
						}}
					>
						{props.image_link === '""' ? (
							<img class="w-full" src="https://i.imgur.com/MwTfvwo.png" />
						) : (
							<img class="w-full" src={props.image_link} />
						)}
						<div class="text-center absolute w-full" style={{ bottom: "4rem" }}>
							<p class="text-white tracking-wide uppercase text-lg font-bold">
							</p>
						</div>
					</div>
					<div class="relative flex justify-between items-center flex-row px-6 z-50 -mt-10">
						
					</div>
					<div class="pt-6 pb-8 text-gray-600 text-center">
						<p>
							<a
								class="font-normal text-lg md:text-xl text-gray-800 w-full"
								href={`${process.env.REACT_APP_BASE_URL}/${props.id}`}
							>
								{props.username}
							</a>{" "}
						</p>
						<p class="text-sm">
							<Linkify>{props.description}</Linkify>
						</p>
					</div>

					<div class="pb-10 uppercase text-center tracking-wide flex justify-around">
						<div class="posts">
							<p class="text-gray-400 text-sm">Posts</p>
							<p class="text-lg font-semibold text-blue-300">76</p>
						</div>
						<div class="followers">
							<p class="text-gray-400 text-sm">Followers</p>
							<p class="text-lg font-semibold text-blue-300">964</p>
						</div>
						<div class="following">
							<p class="text-gray-400 text-sm">Following</p>
							<p class="text-lg font-semibold text-blue-300">34</p>
						</div>
					</div>
				</div>
			</div> */}
			<div
				class="bg-white border shadow-md mt-4 rounded-lg overflow-hidden text-gray-900 w-full font-sans"
				key={props.id}
			>
				<div class="flex h-40">
					<div class="flex w-1/4 max-h-full">
						{props.image_link === '""' ? (
							<img
								class="object-cover"
								src="https://i.imgur.com/MwTfvwo.png"
								onError={(e) => {
									e.target.onerror = null;
									e.target.src = "https://i.imgur.com/MwTfvwo.png";
								}}
							/>
						) : (
							<img
								class="object-cover"
								src={props.image_link}
								onError={(e) => {
									e.target.onerror = null;
									e.target.src = "https://i.imgur.com/MwTfvwo.png";
								}}
							/>
						)}
					</div>
					<div class="p-2 w-3/4">
						<div class="h-32">
							<a
								class="font-normal text-lg md:text-xl text-gray-800 w-full"
								href={`${process.env.REACT_APP_BASE_URL}/${props.id}`}
							>
								{props.username}
								<p class="font-thin text-gray-700 text-base lg:text-lg overflow-hidden md:h-24 h-32">
									<Linkify>{props.description}</Linkify>
								</p>
							</a>
						</div>
						<div class="text-gray-600 mb-8 text-left uppercase tracking-widest object-bottom text-xs font-thin">
							{props.viewcount === null ? 0 : props.viewcount} Views{" "}
							{props.listcount} Lists{" "}
							{props.itemscount === null ? 0 : props.itemscount} Items
						</div>
					</div>
				</div>
			</div>
			{/* <Item key={props.id} style={{ height: "100%" }}>
				<Item.Image avatar size="tiny" src={props.image_link} />
				<Item.Content verticalAlign="middle">
					<Item.Header
						as="a"
						href={`${process.env.REACT_APP_BASE_URL}/${props.id}`}
					>
						{props.username}
					</Item.Header>
					<Item.Description>
						<Linkify>{props.description}</Linkify>
					</Item.Description>
				</Item.Content>
			</Item> */}

			{/* <Card key={props.id} fluid style={{ height: "100%" }}>
				<Card.Content>
					{props.image_url === '""' ? (
						<Image
							floated="left"
							size="mini"
							circular
							src="https://react.semantic-ui.com/images/wireframe/square-image.png"
						/>
					) : (
						<Image floated="left" size="mini" circular src={props.image_link} />
					)}
					<Card.Header>
						<Header
							as="a"
							href={`${process.env.REACT_APP_BASE_URL}/${props.id}`}
						>
							{props.username}
						</Header>
					</Card.Header>
					<Card.Description>
						<Linkify>{props.description}</Linkify>
					</Card.Description>
				</Card.Content>
				<Card.Content
					style={{
						border: "none",
						"border-top": "none",
					}}
					extra
				>
					Views {props.viewcount} Lists {props.listcount} Items{" "}
					{props.itemscount}
				</Card.Content>
			</Card> */}
		</>
	);
}

export default ProfileListItem;
