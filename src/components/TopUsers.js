import React, { useState } from "react";
import CommonLoader from "../components/CommonLoader";
import { GetAllUsers } from "../util/graphqlExecutor";

function TopUsers() {
	const [loading, setloading] = useState("-1");
	const [allusers, setallusers] = useState(null);

	if (loading === "-1") {
		GetAllUsers().then((response) => {
			setallusers(response);
			// console.log(response);
			setloading("0");
		});
	}
	if (loading === "-1") {
		return <CommonLoader />;
	}

	return (
		<div className="flex-wrap">
			<div className="mx-2 text-2xl font-normal">Top Curators</div>
			<div className="flex-wrap border mt-4 rounded-md shadow-md p-2 md:mx-0 mx-2 border-gray-300 divide-y">
				{allusers.user.slice(0, 5).map((ite) => (
					<a href={ite.id} className="text-gray-700">
						<div className="flex my-4">
							<div className="sm:w-1/6 md:w-1/12 flex-none">
								<img className="h-10 w-10 rounded-full" src={ite.image_link} />
							</div>
							<div className=" text-xl font-light px-3 sm:w-5/6 md:w-11/12 justify-center text-center align-middle">
								{ite.username}
							</div>
						</div>
					</a>
				))}
				<a href="/explore2#curators" className="text-orange-600">
					<div className="text-center text-xl p-2">
						+ {allusers.user.length - 5} More
					</div>
				</a>
			</div>
		</div>
	);
}

export default TopUsers;
