import React from "react";
import { Card, Button, Image, Header } from "semantic-ui-react";
import history from "../util/history";
import FollowCard from "./FollowCard";

function CuratorLandingCard(props) {
	const routeChange = (t) => {
		history.push(t);
		window.location.href = window.location.href;
	};
	var str = props.item.description;
	var shrt = str.length > 130 ? str.substr(0, 130) + "..." : str;

	return (
		<>
			<div
				class="bg-white border shadow-md mt-4 rounded-lg overflow-hidden mr-1 ml-1 text-gray-900 w-full font-sans"
				key={props.item.id}
			>
				<div class="flex h-56">
					<div class="w-1/3 h-56">
						<div class="rounded border-black p-2">
							{props.item.image_url === '""' ? (
								<img
									class="object-contain rounded-lg"
									src="https://i.imgur.com/MwTfvwo.png"
								/>
							) : (
								<img
									class="object-contain rounded-lg"
									src={props.item.image_url}
								/>
							)}
							{props.item.private ? (
								<span class="inline-block bg-teal-200 text-teal-800 text-xs px-2 rounded-full uppercase font-semibold tracking-wide mt-1">
									<i class="fas fa-lock text-teal-800"></i> Private
								</span>
							) : (
								<></>
							)}
						</div>
					</div>
					<div class="p-2 w-2/3 h-56">
						<div class="mb-1 max-h-full h-40">
							<a
								class="font-normal text-gray-800 w-full text-lg md:text-xl"
								href={props.item.curator_id + "/lists/" + props.item.id}
							>
								{props.item.list_name}
							</a>
							<p class="text-gray-700 text-base lg:text-lg font-thin overflow-hidden max-h-full mb-1 pb-1 h-32">
								{shrt}
							</p>
						</div>
						<div class="text-gray-500 mb-8 text-left uppercase tracking-widest text-sm md:text-base">
							<FollowCard
								curator_id={props.item.curator_id}
								contentID={props.item.id}
							/>
							<button
								class="gradient hover:bg-black hover:text-white font-bold rounded-md py-3 px-4 shadow-lg float-right mr-1 bg-white text-black border-gray-800"
								onClick={() => {
									var t = `/${props.item.curator_id}/lists/${props.item.id}`;
									routeChange(t);
								}}
							>
								Read
							</button>
							{/* <Button
								size="tiny"
								floated="right"
								basic
								color="black"
								onClick={() => {
									var t = `/${props.item.curator_id}/lists/${props.item.id}`;
									routeChange(t);
								}}
							>
								Read
							</Button> */}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default CuratorLandingCard;
