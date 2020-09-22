import React from "react";
import { Responsive } from "semantic-ui-react";
import AddPocketItemToList from "./AddPocketItemToList";

function PocketConsumptionItem(props) {
	return (
		<div class="flex h-48">
			<div class="bg-white border shadow-md mt-4 rounded-lg overflow-hidden mr-1 ml-1 text-gray-900 w-full">
				<div class="flex h-48">
					<div class="w-1/4 max-w-full h-48 relative">
						<img
							class="absolute h-48 w-full object-cover object-center"
							src={
								props.item.top_image_url !== "none"
									? props.item.top_image_url
									: "https://i.imgur.com/MwTfvwo.png"
							}
							onError={(e) => {
								e.target.onerror = null;
								e.target.src = "https://i.imgur.com/MwTfvwo.png";
							}}
						/>
					</div>
					<div class="p-2 w-3/4 h-48">
						<div class="overflow-hidden h-24">
							{/* <h4 class="font-semibold text-xl text-gray-800 truncate"> */}
							<a
								class="font-normal text-gray-800 w-full text-lg md:text-xl"
								target="_blank"
								href={props.item.resolved_url}
							>
								{props.item.given_title !== ""
									? props.item.given_title
									: "No title available"}

								{/* </h4> */}
								<Responsive {...Responsive.onlyMobile}>
									<p class="text-gray-700 mt-1 overflow-hidden font-thin text-base lg:text-lg">
										{props.item.excerpt.substring(0, 100)}
										...
									</p>
								</Responsive>
								<Responsive minWidth={Responsive.onlyTablet.minWidth}>
									<p class="text-gray-700 mt-1 overflow-hidden font-thin text-base lg:text-lg">
										{props.item.excerpt.substring(0, 336)}
									</p>
								</Responsive>
							</a>
						</div>
						<div class="max-w-full max-h-full relative h-10 pb-8">
							<AddPocketItemToList />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default PocketConsumptionItem;
