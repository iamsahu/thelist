import React, { useState } from "react";

import { Loader, Header, Item, Responsive } from "semantic-ui-react";
import { GetItemsActivity } from "../util/graphqlExecutor";
import { useHistory } from "react-router-dom";
import CommonLoader from "./CommonLoader";
function YourActivities(props) {
	const [loading, setloading] = useState("-1");
	const [activityData, setactivityData] = useState("");
	// var feed = streamClient.feed("user", props.user);
	// console.log(streamClient);
	// var t = streamClient.feed("user", props.user);
	const history = useHistory();
	const routeChange = (t) => {
		history.push(t);
	};

	if (loading === "-1")
		GetItemsActivity(props.user)
			.then((response) => {
				// console.log(response);
				if (response.items.length > 0) {
					setactivityData(response);
					setloading("0");
				}
			})
			.catch((error) => console.log(error));

	if (loading === "-1") {
		return <CommonLoader />;
	}

	if (activityData.items.length < 1) {
		// console.log("Activity Data");
		return (
			<div>
				<Loader active inline="centered" />
			</div>
		);
	}
	// console.log(activityData.items);
	function Activity(item) {
		return (
			<div class="flex h-48">
				<div class="bg-white border shadow-md mt-4 rounded-lg overflow-hidden mr-1 ml-1 text-gray-900 w-full">
					<div class="flex h-48">
						<div class="w-1/4 max-w-full h-48 relative">
							<img
								class="absolute h-48 w-full object-cover object-center"
								src={
									item.auto_image !== "none" && item.auto_image !== ""
										? item.auto_image
										: "https://i.imgur.com/MwTfvwo.png"
								}
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
							{/* <div class="max-w-full max-h-full relative h-8">
						{isAuthenticated &&
							postdata.postdata.user.id === userC.loggedin_user_id && (
								<img
									class="h-4 float-right mr-1 object-bottom"
									src={`${process.env.REACT_APP_BASE_URL}/close.svg`}
									alt="Kiwi standing on oval"
									onClick={(e) => {
										deleteitem(postdata.postdata.id);
										Mixpanel.track("Delete Item", {
											link: postdata.postdata.link,
											curator: postdata.postdata.user.id,
											name: postdata.postdata.name,
										});
										if (
											process.env.REACT_APP_BASE_URL !==
											"http://localhost:3000"
										)
											ReactGA.event({
												category: "Item",
												action: "Delete",
												label: postdata.postdata.name,
												transport: "beacon",
											});
									}}
								/>
							)}
						<CopyToClipboard
							text={postdata.postdata.link}
							onCopy={(e) => {
								notify();
								copyItem();
								Mixpanel.track("Copy Item", {
									link: postdata.postdata.link,
									curator: postdata.postdata.user.id,
									name: postdata.postdata.name,
								});
								if (
									process.env.REACT_APP_BASE_URL !== "http://localhost:3000"
								)
									ReactGA.event({
										category: "Item",
										action: "Copy",
										label: postdata.postdata.name,
										transport: "beacon",
									});
							}}
						>
							<img
								class="h-4 float-right mr-1 object-bottom"
								src={`${process.env.REACT_APP_BASE_URL}/copy.svg`}
								alt="Kiwi standing on oval"
							/>
						</CopyToClipboard>
						{isAuthenticated &&
							postdata.postdata.user.id !== userC.loggedin_user_id && (
								<BookMarkItem postdata={postdata} />
							)}
						{isAuthenticated &&
							postdata.postdata.user.id !== userC.loggedin_user_id && (
								<LikeArticle postdata={postdata} />
							)}
					</div> */}
						</div>
					</div>
				</div>
			</div>
		);
	}

	function OldActivity(item) {
		return (
			<>
				<Item key={item.id}>
					<Item.Image size="tiny" src={item.auto_image} />
					<Item.Content>
						<Item.Header target="_blank" as="a" href={item.link}>
							{item.name}
						</Item.Header>{" "}
						<Item.Meta
							as="a"
							onClick={() => {
								var t = `/${item.curator}/lists/${item.list.id}`;
								routeChange(t);
							}}
						>
							in {item.list.list_name}
						</Item.Meta>
						<Item.Description>
							<p>{item.auto_description.substring(0, 240)}</p>
						</Item.Description>
					</Item.Content>
				</Item>
			</>
		);
	}

	var lastDate;
	return (
		<>
			<Item.Group divided relaxed>
				{activityData.items.map((item) =>
					lastDate === ""
						? ((lastDate = GiveMeDate(item.created_at)),
						  (
								<>
									<Header as="h2">{lastDate}</Header>
									{Activity(item)}
								</>
						  ))
						: lastDate === GiveMeDate(item.created_at)
						? Activity(item)
						: ((lastDate = GiveMeDate(item.created_at)),
						  (
								<>
									<Header as="h2">{lastDate}</Header>
									{Activity(item)}
								</>
						  ))
				)}
			</Item.Group>
		</>
	);
}

const mlist = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

function GiveMeDate(data) {
	var temp = new Date(data);
	return (
		temp.getDate() + " " + mlist[temp.getMonth()] + " " + temp.getFullYear()
	);
}

export default YourActivities;
