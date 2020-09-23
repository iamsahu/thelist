import React from "react";
import { InsertItem2 } from "../util/graphqlExecutor";
import { Dropdown, Button } from "semantic-ui-react";

function AddPocketItemToList(props) {
	// const listsD = _.map((item) => ({ key: "", text: "", value: "" }));
	const vt = [
		{ key: "213", text: "213", value: "213" },
		{ key: "542", text: "542", value: "542" },
		{ key: "9345", text: "9345", value: "9345" },
	];
	return (
		<>
			<Dropdown placeholder="Add to List" search selection options={vt} />{" "}
			<Button primary>Primary</Button>
		</>
	);
}

export default AddPocketItemToList;
