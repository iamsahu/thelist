import React, { useState } from "react";
import { GetCurationStats } from "../util/graphqlExecutor";

function CurationEncouragement() {
	const [data, setData] = useState("");
	if (data === "") {
		setData(1);
		if (data !== 1) {
			GetCurationStats().then((data) => {
				console.log(data);
				setData(data);
			});
		}
	}
	if (data !== "" && data !== 1) {
		return (
			<div className="font-thin">
				Did you know curators have created{" "}
				{data.lists_aggregate.aggregate.count} curations which have got{" "}
				{data.lists_aggregate.aggregate.sum.view_count} views on The List Space
			</div>
		);
	}
	return <></>;
}

export default CurationEncouragement;
