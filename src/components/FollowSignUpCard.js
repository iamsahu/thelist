import React from "react";
import { Card, Button, Image, Header } from "semantic-ui-react";
import history from "../util/history";
import FollowCard from "./FollowCard";

function FollowSignUpCard(props) {
	const routeChange = (t) => {
		history.push(t);
		window.location.href = window.location.href;
	};
	var str = props.item.description;
	var shrt = str.length > 130 ? str.substr(0, 130) + "..." : str;

	return (
		<>
			<div
				className="bg-white border shadow-md mt-4 rounded-lg overflow-hidden text-gray-900 w-full font-sans"
				key={props.item.id}
			>
				<div className="flex h-56">
					<div className="w-1/3 h-56">
						<div className="rounded border-black p-2">
							{props.item.image_url === '""' ? (
								<img
									className="object-contain rounded-lg"
									src="https://i.imgur.com/MwTfvwo.png"
								/>
							) : (
								<img
									className="object-contain rounded-lg"
									src={props.item.image_url}
								/>
							)}
							{props.item.private ? (
								<span className="inline-block bg-teal-200 text-teal-800 text-xs px-2 rounded-full uppercase font-semibold tracking-wide mt-1">
									<i className="fas fa-lock text-teal-800"></i> Private
								</span>
							) : (
								<></>
							)}
						</div>
					</div>
					<div className="p-2 w-2/3 h-56">
						<div className="mb-1 max-h-full h-40 flex-row">
							<div>
								<a
									className="font-normal text-gray-800 w-full text-lg md:text-xl"
									href={props.item.curator_id + "/lists/" + props.item.id}
								>
									{props.item.list_name}
								</a>
							</div>
							{/* by */}
							{/* <div class="flex items-center pt-3">
								<img
									class="w-12 h-12 rounded-full"
									alt="sss"
									src={props.item.user.image_link}
								/>
								<div class="ml-1">
									<p class="font-bold">{props.item.user.username}</p>
								</div>
							</div> */}
							{/* <div className="text-gray-700 text-base lg:text-lg font-thin overflow-hidden max-h-full mb-1 pb-1 h-32 w-full">
								by{" "}
								<img
									src={props.item.user.image_link}
									className="rounded-full w-8 h-8"
								/>{" "}
								{props.item.user.username}
							</div> */}
						</div>
						<div className="text-gray-500 mb-8 text-left uppercase tracking-widest text-sm md:text-base">
							<FollowCard
								curator_id={props.item.curator_id}
								contentID={props.item.id}
							/>
							<button
								className="gradient hover:bg-black hover:text-white font-bold rounded-md py-3 px-4 shadow-lg float-right mr-1 bg-white text-black border-gray-800"
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

export default FollowSignUpCard;
