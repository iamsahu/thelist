import React, { useState } from "react";
import { GiveMeDate2 } from "../util/utils";
import CommonLoader from "../components/CommonLoader";
import {
	GetItemsMain,
	GetAllUsers,
	GetTopLists,
} from "../util/graphqlExecutor";
import Follow from "../components/Follow";
import TopCurations from "../components/TopCurations";
import TopUsers from "../components/TopUsers";

function LandingPageAlt(props) {
	const [loading, setloading] = useState("-1");
	const [activityData, setactivityData] = useState("");

	if (loading === "-1") {
		GetItemsMain()
			.then((response) => {
				// console.log(response);
				if (response.grp_items.length > 0) {
					setactivityData(response);
					setloading("0");
				}
			})
			.catch((error) => console.log(error));
	}

	if (loading === "-1") {
		return <CommonLoader />;
	}

	function Activity(item) {
		// console.log(item);
		return (
			<div class="flex h-32 w-full border">
				<div class="bg-white overflow-hidden text-gray-900 w-full">
					<div className="flex h-32">
						<div class="w-2/12 max-w-full h-32 justify-center place-content-center">
							<img
								class=" h-32 w-32 object-cover object-center p-2"
								src={
									item.auto_image !== "none" && item.auto_image !== ""
										? item.auto_image
										: "https://picsum.photos/400/500?blur=2&random=" +
										  Math.floor(Math.random() * 101)
								}
								onError={(e) => {
									e.target.onerror = null;
									e.target.src =
										"https://picsum.photos/400/500?blur=2&random=" +
										Math.floor(Math.random() * 101);
								}}
							/>
						</div>
						<div class="w-10/12 h-32 flex">
							<div class="overflow-hidden h-32 w-10/12 p-2">
								{/* <h4 class="font-semibold text-xl text-gray-800 truncate"> */}
								<a
									class="font-medium text-gray-800 w-full text-base md:text-lg"
									target="_blank"
									href={item.link}
								>
									{item.name}
								</a>
								<span class="text-gray-500 text-sm te md:text-base font-thin">
									{" "}
									in{" "}
									<a
										href={item.curator + "/lists/" + item.list.id}
										class="text-gray-700"
									>
										{item.list.list_name}
									</a>
								</span>
							</div>
							<div className="w-2/12 flex p-2">
								<div className="border h-24 w-32 p-2 rounded"> Hello</div>
							</div>
						</div>
					</div>
					{/* <div className="w-2/12 p-1"> hello</div> */}
				</div>
			</div>
			// </div>
		);
	}
	var lastDate;

	function IndiDate() {
		var list_id = "";
		var pack = [];
		var packs = [];
		if (typeof activityData !== "undefined") {
			for (let index = 0; index < activityData.grp_items.length; index++) {
				const element = activityData.grp_items[index];
				if (list_id === "") {
					list_id = element["list"]["id"];
					pack.push(element);
				} else if (list_id !== element["list"]["id"]) {
					packs.push(pack);
					pack = [];
					list_id = element["list"]["id"];
					pack.push(element);
				} else {
					pack.push(element);
				}
			}

			// console.log(packs);
			const d = packs.map((item) => {
				if (item.length > 3) {
					return (
						<>
							{lastDate === "" ? (
								((lastDate = GiveMeDate2(item[0].created_at)),
								(
									<h1 className="px-1 text-lg ml-2 font-normal border-gray-300">
										{lastDate}
									</h1>
								))
							) : lastDate === GiveMeDate2(item[0].created_at) ? (
								<></>
							) : (
								((lastDate = GiveMeDate2(item[0].created_at)),
								(
									<h1 className="px-1 text-lg ml-2 font-normal border-gray-300">
										{lastDate}
									</h1>
								))
							)}
							<div className="flex-wrap border mt-4 rounded-md shadow-md p-2 md:mx-0 mx-2 border-gray-300">
								<div className="border-b flex text-xl p-2">
									<div className=" text-2xl font-medium align-text-top flex w-full">
										<div className="w-3/4 flex-none">
											<a
												href={item[0].curator + "/lists/" + item[0].id}
												className="text-gray-800"
											>
												{item[0].list.list_name}
											</a>{" "}
											<br />
											<span className="text-base font-light">
												{" "}
												by{" "}
												<a href={item[0].curator} className="text-gray-800">
													{item[0].user.username}
												</a>
											</span>
										</div>
										<div className="float-right w-1/4 flex-1">
											<Follow contentID={item[0].list.id} />
										</div>
									</div>
								</div>
								<div className="border-b">
									{item.slice(0, 3).map((ite) => (
										<a href={ite.link} className="text-gray-700">
											<div className="flex m-2" key={ite.id}>
												<div className="sm:w-1/6 md:w-1/12 flex-none">
													<img
														className="rounded h-16 w-16 object-cover"
														src={ite.auto_image}
														onError={(e) => {
															e.target.onerror = null;
															e.target.src =
																"https://picsum.photos/100?blur=2&random=" +
																Math.floor(Math.random() * 101);
														}}
													/>
												</div>
												<div className=" text-lg px-3 sm:w-5/6 md:w-11/12">
													{ite.name}
												</div>
											</div>
										</a>
									))}
								</div>
								<a
									href={item[0].curator + "/lists/" + item[0].id}
									className="text-orange-600"
								>
									<div className="text-center text-xl p-2">
										+ {item.length - 3} More
									</div>
								</a>
							</div>
						</>
					);
				} else {
					return (
						<>
							{lastDate === "" ? (
								((lastDate = GiveMeDate2(item[0].created_at)),
								(
									<h1 className="text-lg px-1 ml-2 font-normal border-gray-300">
										{lastDate}
									</h1>
								))
							) : lastDate === GiveMeDate2(item[0].created_at) ? (
								<></>
							) : (
								((lastDate = GiveMeDate2(item[0].created_at)),
								(
									<h1 className="text-lg px-1 ml-2 font-normal border-gray-300">
										{lastDate}
									</h1>
								))
							)}
							<div className="flex-wrap border mt-4 rounded-md shadow-md p-2 md:mx-0 mx-2 border-gray-300">
								<div className="border-b flex text-xl p-2">
									<div className=" text-2xl font-medium align-text-top flex-wrap">
										<a
											href={item[0].curator + "/lists/" + item[0].id}
											className="text-gray-800"
										>
											{item[0].list.list_name}
										</a>
										<br />
										<span className="text-base font-light">
											by{" "}
											<a href={item[0].curator} className="text-gray-800">
												{item[0].user.username}
											</a>
										</span>
									</div>
									<div className="float-right w-1/4 flex-1">
										<Follow contentID={item[0].list.id} />
									</div>
								</div>
								<div>
									{item.map((ite) => (
										<a href={ite.link} className="text-gray-700">
											<div className="flex m-2 text-base" key={ite.id}>
												<div className="sm:w-1/6 md:w-1/12 flex-none">
													<img
														className="rounded h-16 w-16 object-cover"
														src={ite.auto_image}
														onError={(e) => {
															e.target.onerror = null;
															e.target.src =
																"https://picsum.photos/100?blur=2&random=" +
																Math.floor(Math.random() * 101);
														}}
													/>
												</div>
												<div className=" text-lg px-3 sm:w-5/6 md:w-11/12">
													{ite.name}
												</div>
											</div>
										</a>
									))}
								</div>
							</div>
						</>
					);
				}
			});
			return d;
		}
	}
	function Login() {}

	return (
		<div className=" w-screen text-gray-700 font-light mt-20 font-sans flex-wrap">
			{/* <div className="w-full h-full flex-wrap"> */}
			{/* <div className="w-full flex">
				<div className="w-1/4"></div>
				<div className="w-2/4 sm:w-full">
					<div className="container px-3 mx-auto flex flex-wrap flex-col md:flex-row items-center">
						<div className="flex flex-col w-full md:w-2/5 justify-center items-start text-center md:text-left">
							<h1 className="my-4 text-5xl font-bold leading-tight">
								A place for curators!
							</h1>
							<p className="leading-normal text-2xl mb-8">
								Start your curations. Build a following. Discover amazing
								curations.
								<br />
								You can make as many curations as you want.
							</p>

							<button
								className="mx-auto lg:mx-0 bg-black text-white font-bold rounded-lg my-6 py-4 px-8 shadow-lg"
								onClick={Login}
							>
								Start Curating!
							</button>
						</div>

						<div className="w-full md:w-3/5 py-6 text-center">
							<img
								className="w-full md:w-4/5 z-50"
								src="https://i.imgur.com/PbKxSvT.png"
							/>
						</div>
					</div>
				</div>
				<div className="w-1/4"></div>
			</div> */}

			<div className="flex w-full h-full mt-8 pt-8">
				{/* <div className="flex w-full"> */}
				<div className="md:w-3/12 h-full flex-1 hidden md:block"></div>
				<div className=" md:w-4/12 h-full divide-y flex-wrap md:flex-none">
					{IndiDate()}
				</div>
				<div className="md:w-3/12 h-full flex-1 hidden md:block">
					<TopUsers />
					<TopCurations />
				</div>
				<div className="md:w-2/12 h-full flex-1 hidden md:block"></div>
			</div>

			{/* </div> */}
			{/* </div> */}
		</div>
	);
}

export default LandingPageAlt;
