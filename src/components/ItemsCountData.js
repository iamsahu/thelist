import React, { useState } from "react";
import { GetItemsData } from "../util/graphqlExecutor";

function ItemsCountData() {
	const [data, setData] = useState("");
	if (data === "") {
		setData(1);
		if (data !== 1) {
			GetItemsData().then((data) => {
				console.log(data);
				setData(data);
			});
		}
	}
	if (data !== "" && data !== 1) {
		return (
			<div className="font-thin">
				Did you know curators have added {data.items_aggregate.aggregate.count}{" "}
				items to different curations!
			</div>
		);
	}
	return <></>;
}

export default ItemsCountData;
