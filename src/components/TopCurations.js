import React, { useState } from "react";
import CommonLoader from "../components/CommonLoader";
import { GetTopLists } from "../util/graphqlExecutor";

function TopCurations() {
	const [loading, setloading] = useState("-1");
	const [topCurations, settopCurations] = useState("");
	const [totalCurations, setTotalCurations] = useState("");

	if (loading === "-1") {
		GetTopLists().then((response) => {
			// console.log(response);
			settopCurations(response["lists"]);
			setTotalCurations(response["lists_aggregate"]["aggregate"]["count"]);
			setloading("0");
		});
	}
	if (loading === "-1") {
		return <CommonLoader />;
	}

	return (
		<div className="flex-wrap mt-4">
			<div className="mx-2 text-2xl font-normal">Top Curations</div>
			<div className="flex-wrap border mt-4 rounded-md shadow-md p-2 md:mx-0 mx-2 border-gray-300 divide-y">
				{topCurations.map((ite) => (
					<a href={ite.id} className="text-gray-700">
						<div className="flex my-2">
							<div className="sm:w-1/6 md:w-1/12 ">
								<img
									className="h-10 w-10 rounded object-cover"
									src={ite.image_url}
									onError={(e) => {
										e.target.onerror = null;
										e.target.src = "https://i.imgur.com/MwTfvwo.png";
										// "https://picsum.photos/100?blur=2&random=" +
										// Math.floor(Math.random() * 101);
									}}
								/>
							</div>
							<div className=" text-xl font-light px-3 sm:w-5/6 md:w-11/12 align-middle">
								{ite.list_name}
							</div>
						</div>
					</a>
				))}
				<a href="/explore2#lists" className="text-orange-600">
					<div className="text-center text-xl p-2">
						+ {totalCurations - 10} More
					</div>
				</a>
			</div>
		</div>
	);
}

export default TopCurations;
