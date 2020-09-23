import React, { useState, useContext } from "react";
import {
	GetPocketData,
	GetPocketDataDate,
	GetListsOfUser,
	GetPocketStatus,
} from "../util/graphqlExecutor";
import CommonLoader from "../components/CommonLoader";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import PocketConsumptionItem from "../components/PocketConsumptionItem";
import { Grid as GG } from "@material-ui/core";
import UserContext from "../context/UserContext";

function PocketConsumption(props) {
	const [data, setData] = useState("");
	const [listData, setListData] = useState("");
	const [fetch, setfetch] = useState("");
	const [date, setdate] = useState([new Date(), new Date()]);
	const [userC, userChange] = useContext(UserContext);
	const [pocketState, setpocketState] = useState("");

	if (pocketState === "") {
		setpocketState("1");
		GetPocketStatus(userC.loggedin_user_id).then((response) => {
			console.log(response);
			if (response.user.length > 0) {
				// console.log(response.user[0].pocket_username);
				if (response.user[0].pocket_username === "") {
					console.log("buga");
					setpocketState("2");
				} else if (response.user[0].pocket_username === null) {
					setpocketState("2");
					console.log("buga");
				} else {
					setpocketState("3");
					console.log("abuga");
				}
			}
		});
	} else if (fetch === "" || fetch !== props.match.params.user) {
		setfetch(props.match.params.user);
		GetPocketData(userC.loggedin_user_id).then((data) => {
			// console.log(data);
			setData(data);
		});
		GetListsOfUser(userC.loggedin_user_id).then((data) => {
			// console.log(data);
			var tp = data.lists.map((item) => ({
				key: item.id,
				text: item.list_name,
				value: item.id,
			}));
			setListData(tp);
		});
	}
	if (
		data === "" ||
		listData === "" ||
		pocketState === "1" ||
		pocketState === ""
	) {
		return (
			<div className="mt-10">
				<CommonLoader />
			</div>
		);
	}

	if (pocketState === "2") {
		//User has to connect
		return (
			<div className="mt-24">
				Please connect your pocket account by going into settings!
			</div>
		);
	}

	function onChange(values) {
		// console.log(values);
		// console.log(new Date(Date.parse(values[0])).toISOString());
		setdate([new Date(Date.parse(values[0])), new Date(Date.parse(values[1]))]);
		GetPocketDataDate(
			userC.loggedin_user_id,
			new Date(Date.parse(values[0])),
			new Date(Date.parse(values[1]))
		).then((data) => {
			// console.log(data);
			setData(data);
		});
	}

	if (typeof data.pocket_data === "undefined") {
		return (
			<div className="mt-24">
				Either you don't have any items in your pocket or the application has
				<br />
				not yet synced. Please check back in 24 hours to see the data.
			</div>
		);
	}

	return (
		<>
			<div className="mt-24">
				<div className="w-full mt-10">
					Calendar
					<DateRangePicker onChange={onChange} value={date} />
				</div>
				<div className="w-full mt-4">
					<GG container spacing={1}>
						{data.pocket_data.map((item) => (
							<GG item xs={3}>
								<PocketConsumptionItem item={item} lists={listData} />
							</GG>
						))}
					</GG>
				</div>
			</div>
		</>
	);
}

export default React.memo(PocketConsumption);
