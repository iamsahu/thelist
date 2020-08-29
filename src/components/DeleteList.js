import React from "react";
import { DeleteList as DL } from "../util/graphqlExecutor";
import { Button } from "semantic-ui-react";
import { useHistory } from "react-router-dom";

function DeleteList(props) {
	const history = useHistory();

	return (
		<>
			<Button
				icon="trash"
				size="tiny"
				floated="right"
				basic
				color="black"
				onClick={() =>
					DL(props.id).then((response) => {
						console.log(response);
						history.push("/manage/" + props.user);
					})
				}
			/>
			{/* <button
				 	class="lg:mx-0 gradient hover:bg-black hover:text-white font-bold rounded-md py-3 px-3 shadow-lg float-right ml-1 bg-white text-black border-gray-800"
				 	onClick={() => SetModal(true)}
				 >
				 	<i class="fas fa-edit"></i>
				 </button> */}
		</>
	);
}

export default DeleteList;
