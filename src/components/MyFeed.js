import React, { useContext, useState } from "react";
import { Responsive, Loader } from "semantic-ui-react";
import StreamContext from "../context/StreamContext";
import { connect } from "getstream";
import { GetFeedItems } from "../util/graphqlExecutor";

function MyFeed(props) {
	const [streamClient, streamuserFeed] = useContext(StreamContext);
	const [activities, setActivities] = useState("");
	// console.log(streamClient);

	function Activity(item) {
		return (
			<div class="flex h-48">
				<div class="bg-white border shadow-md mt-4 rounded-lg overflow-hidden mr-1 ml-1 text-gray-900 w-full">
					<div class="flex h-48">
						<div class="w-1/4 max-w-full h-48 relative">
							<img
								class="absolute h-48 w-full object-cover object-center"
								src={item.auto_image}
							/>
						</div>
						<div class="p-2 w-3/4 h-48">
							<div class="overflow-hidden h-48">
								{/* <h4 class="font-semibold text-xl text-gray-800 truncate"> */}
								<a
									class="font-normal text-gray-800 w-full text-lg md:text-xl"
									target="_blank"
									href={item.link}
								>
									{item.name}
								</a>
								<div class="text-gray-500 text-sm md:text-base font-thin">
									in{" "}
									<a
										href={item.curator + "/lists/" + item.list.id}
										class="text-blue-500"
									>
										{item.list.list_name}
									</a>
								</div>
								{/* </h4> */}
								<Responsive {...Responsive.onlyMobile}>
									<p class="text-gray-700 mt-1 overflow-hidden font-thin text-base lg:text-lg">
										{item.description !== ""
											? item.description.substring(0, 100)
											: item.auto_description === "none"
											? ""
											: item.auto_description.substring(0, 100)}
										...
									</p>
								</Responsive>
								<Responsive minWidth={Responsive.onlyTablet.minWidth}>
									<p class="text-gray-700 mt-1 overflow-hidden font-thin text-base lg:text-lg">
										{item.description !== ""
											? item.description.substring(0, 336)
											: item.auto_description === "none"
											? ""
											: item.auto_description.substring(0, 336)}
									</p>
								</Responsive>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	function ParseResults(activities) {
		var itemIDs = activities.results.map((item) => item.object);
		// console.log(itemIDs);
		GetFeedItems(itemIDs).then((response) => {
			console.log(response);
			setActivities(response);
		});
	}
	if (streamClient !== "") {
		var feed = streamClient.feed("timeline", props.user);
		feed.get().then((activitiesSuccess) => {
			console.log(activitiesSuccess);
			ParseResults(activitiesSuccess);
		});
	} else {
		fetch(
			//"https://obzz0p3mah.execute-api.eu-west-3.amazonaws.com/default/getUserToken",
			"https://cors-anywhere.herokuapp.com/https://32mois0yg1.execute-api.eu-west-3.amazonaws.com/default/getUserTokenNode",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ user: props.user }),
			}
		)
			.then((r) => r.json())
			.then((data) => {
				var userToken = data["token"];
				const client2 = connect(
					// process.env.REACT_APP_STREAM_API_KEY,
					"pf7sgqtb4h3x",
					userToken,
					"86395"
					// process.env.REACT_APP_STREAM_APP_ID
				);
				var feed = client2.feed("timeline", props.user);
				feed.get().then((activitiesSuccess) => {
					console.log(activitiesSuccess);
					ParseResults(activitiesSuccess);
				});
			});
	}

	return (
		<>
			<Responsive {...Responsive.onlyMobile}>
				{activities === "" ? (
					<div>Loading</div>
				) : activities.items.length > 0 ? (
					activities.items.map((item) => Activity(item))
				) : (
					<div class="content-center">
						<Loader active inline="centered" />
					</div>
				)}
			</Responsive>
			<Responsive minWidth={Responsive.onlyTablet.minWidth}>
				{activities === "" ? (
					<div>Loading</div>
				) : activities.items.length > 0 ? (
					activities.items.map((item) => Activity(item))
				) : (
					<div class="content-center">
						<Loader active inline="centered" />
					</div>
				)}
			</Responsive>
		</>
	);
}

export default MyFeed;
