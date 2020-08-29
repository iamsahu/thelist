import React, { useState } from "react";
import { Button, Icon } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import { UpdatePrivateStatus } from "../util/graphqlExecutor";

function PrivacyStatus(props) {
	const [privateState, setPrivateState] = useState(props.privatestate);
	// console.log("Privacy!");
	// console.log(props);
	// const [modifyPrivacy, { error }] = useMutation(UPDATEPRIVATESTATUS, {
	// 	variables: {
	// 		id: props.id,
	// 		private: privateState,
	// 	},
	// 	onError: (error) => {
	// 		console.log(error);
	// 	},
	// });

	function StateChange(privat) {
		// modifyPrivacy()
		setPrivateState(privat);
		UpdatePrivateStatus(props.id, privat);
	}
	return (
		<>
			{privateState ? (
				// <button class="lg:mx-0 gradient hover:bg-black hover:text-white font-bold rounded-md py-3 px-3 shadow-lg float-right ml-1 bg-white text-black border-gray-800">
				// 	<i class="fas fa-lock"></i>
				// </button>
				<Button
					icon
					size="tiny"
					floated="right"
					basic
					color="red"
					onClick={() => StateChange(false)}
				>
					<Icon color="red" name="lock" /> Private
				</Button>
			) : (
				// <button class="lg:mx-0 gradient hover:bg-black hover:text-white font-bold rounded-md py-3 px-3 shadow-lg float-right ml-1 bg-white text-black border-gray-800">
				// 	<i class="fas fa-lock-open"></i>
				// </button>
				<Button
					icon
					size="tiny"
					floated="right"
					basic
					color="black"
					onClick={() => StateChange(true)}
				>
					<Icon color="black" name="unlock" /> Public
				</Button>
			)}
		</>
	);
}

export default PrivacyStatus;
