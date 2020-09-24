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
				className="bg-white border shadow-md mt-4 rounded-lg overflow-hidden text-gray-900 w-full font-sans pb-2"
				key={props.item.id}
			>
				<div className="flex-wrap h-56">
					<div className="flex">
						<div className="w-2/12 h-20">
							<div className="rounded border-black p-2">
								{props.item.image_url === '""' ? (
									<img
										className="object-contain rounded-lg h-16"
										src="https://i.imgur.com/MwTfvwo.png"
									/>
								) : (
									<img
										className="object-contain rounded-lg h-16"
										src={props.item.image_url}
									/>
								)}
							</div>
						</div>
						<div className="w-10/12">
							<div className="p-2 text-2xl truncate">
								<a
									target="_blank"
									className="font-normal text-gray-800 w-full"
									href={"/" + props.item.curator_id + "/lists/" + props.item.id}
								>
									{props.item.list_name}
								</a>
							</div>
							<a
								target="_blank"
								href={"/" + props.item.curator_id}
								className="text-gray-800"
							>
								<div class="flex items-center pt-1 pl-2 text-gray-600">
									by{" "}
									<div className="pl-1">
										<img
											class="w-6 h-6 rounded-full"
											alt="sss"
											src={props.item.user.image_link}
										/>
									</div>
									<div class="ml-1">
										<p class="font-normal">{props.item.user.username}</p>
									</div>
								</div>
							</a>
						</div>
					</div>
					<div className="p-1 w-full h-32">
						<div className="h-24 ">
							{/* <div className="text-gray-700 text-base lg:text-lg font-thin overflow-hidden mb-1 pb-1 h-20 w-full">
								by{" "}
								<img
									src={props.item.user.image_link}
									className="rounded-full w-8 h-8"
								/>{" "}
								{props.item.user.username}
							</div> */}
							<p className="text-gray-700 text-base lg:text-lg font-light overflow-hidden mb-1 pb-1 h-24">
								{shrt}
							</p>
						</div>
					</div>
					<div className="w-full h-auto px-2 pb-2">
						<div className="text-gray-500 text-left uppercase tracking-widest text-sm md:text-base">
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

	return (
		<>
			<div
				className="bg-white border shadow-md mt-4 rounded-lg overflow-hidden text-gray-900 w-full font-sans"
				key={props.item.id}
			>
				<div className="flex h-64">
					<div className="w-2/12 h-64">
						<div className="rounded border-black p-2">
							{props.item.image_url === '""' ? (
								<img
									className="object-contain rounded-lg h-16"
									src="https://i.imgur.com/MwTfvwo.png"
								/>
							) : (
								<img
									className="object-contain rounded-lg h-16"
									src={props.item.image_url}
								/>
							)}
						</div>
					</div>
					<div className="p-2 w-10/12 h-64">
						<div className="mb-1 max-h-full h-40 flex-row">
							<div>
								<a
									target="_blank"
									className="font-normal text-gray-800 w-full text-xl md:text-xl"
									href={props.item.curator_id + "/lists/" + props.item.id}
								>
									{props.item.list_name}
								</a>
							</div>
							<a
								target="_blank"
								href={"/" + props.item.curator_id}
								className="text-gray-800"
							>
								<div class="flex items-center pt-1">
									{/* by{" "} */}
									<img
										class="w-6 h-6 rounded-full"
										alt="sss"
										src={props.item.user.image_link}
									/>
									<div class="ml-1">
										<p class="font-normal">{props.item.user.username}</p>
									</div>
								</div>
							</a>
							{/* <div className="text-gray-700 text-base lg:text-lg font-thin overflow-hidden max-h-full mb-1 pb-1 h-32 w-full">
								by{" "}
								<img
									src={props.item.user.image_link}
									className="rounded-full w-8 h-8"
								/>{" "}
								{props.item.user.username}
							</div> */}
							<p className="text-gray-700 text-sm lg:text-base font-thin overflow-hidden max-h-full mb-1 pb-1 h-32">
								{shrt}
							</p>
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

	return (
		<>
			<div class="md:flex shadow-lg  mx-6 md:mx-auto max-w-lg md:max-w-2xl h-64">
				{props.item.image_url === '""' ? (
					<img
						className="h-full w-full md:w-1/3  object-cover rounded-lg rounded-r-none pb-5/6"
						src="https://i.imgur.com/MwTfvwo.png"
					/>
				) : (
					<img
						className="h-full w-full md:w-1/3  object-cover rounded-lg rounded-r-none pb-5/6"
						src={props.item.image_url}
					/>
				)}
				{/* <img
					class="h-full w-full md:w-1/3  object-cover rounded-lg rounded-r-none pb-5/6"
					src="https://ik.imagekit.io/q5edmtudmz/FB_IMG_15658659197157667_wOd8n5yFyXI.jpg"
					alt="bag"
				/> */}
				<div class="w-full md:w-2/3 px-4 py-4 bg-white rounded-lg">
					<div class="flex items-center">
						<h2 class="text-xl text-gray-800 font-medium mr-auto">
							<a
								target="_blank"
								className="font-normal text-gray-800 w-full text-lg md:text-xl"
								href={props.item.curator_id + "/lists/" + props.item.id}
							>
								{props.item.list_name}
							</a>
						</h2>
						{/* <p class="text-gray-800 font-semibold tracking-tighter">
							only
							<i class="text-gray-600 line-through">60$</i>
							48$
						</p> */}
					</div>
					<p class="text-sm text-gray-700 mt-4">{shrt}</p>
					<div class="flex items-center justify-end mt-4 top-auto">
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
						{/* <button class="bg-white text-red-500 px-4 py-2 rounded mr-auto hover:underline">
							Delete
						</button>
						<button class=" bg-gray-200 text-blue-600 px-2 py-2 rounded-md mr-2">
							Edit
						</button>
						<button class=" bg-blue-600 text-gray-200 px-2 py-2 rounded-md ">
							Publish
						</button> */}
					</div>
				</div>
			</div>
		</>
	);
}

export default FollowSignUpCard;
