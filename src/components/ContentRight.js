import React, { useContext } from "react";
import ContentContext from "../context/ContentContext";
import UserContext from "../context/UserContext";

import ProfileCard from "./ProfileCard";
import PopularProfile from "./PopularProfile";
import CurationReasonCard from "./CurationReasonCard";
import ListStats from "./ListStats";

function ContentRight(props) {
	const [content, contentChange] = useContext(ContentContext);
	const [userC, userChange] = useContext(UserContext);
	const val = props.propSent.curator_id === userC.loggedin_user_id;
	// console.log("Content right");
	// console.log(props);
	return (
		<>
			<ProfileCard userid={props.propSent.curator_id} />
			{props.propSent.contentType === "lists" ? (
				<>
					{/* <CurationReasonCard listid={props.propSent.contentID}/> */}
					{/* {props.propSent.curator_id === userC.loggedin_user_id &&
						(console.log("here "),
						( */}
					<ListStats userid={props.propSent.curator_id} listid={props.contID} />
					{/* ))} */}
				</>
			) : (
				<div></div>
			)}

			{/* <PopularProfile/> */}
		</>
	);
}

export default ContentRight;
