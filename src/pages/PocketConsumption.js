import React, { useState } from "react";
import { GetPocketData } from "../util/graphqlExecutor";
import CommonLoader from "../components/CommonLoader";

import PocketConsumptionItem from "../components/PocketConsumptionItem";

function PocketConsumption(props) {
	const [data, setData] = useState("");
	const [fetch, setfetch] = useState("");
	if (fetch === "" || fetch !== props.match.params.user) {
		setfetch(props.match.params.user);
		GetPocketData(props.match.params.user).then((data) => {
			console.log(data);
			setData(data);
		});
	}
	if (data === "") {
		return (
			<div className="mt-10">
				<CommonLoader />
			</div>
		);
	}
	return (
		<>
			<div className="mt-10">
				{data.pocket_data.map((item) => (
					<PocketConsumptionItem item={item} />
				))}
			</div>
		</>
	);
}

export default React.memo(PocketConsumption);
