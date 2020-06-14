import React, { useContext } from "react";
import ContentContext from "../context/ContentContext";
import UserContext from "../context/UserContext";

import ProfileCard from "./ProfileCard";
import PopularProfile from "./PopularProfile";
import CurationReasonCard from "./CurationReasonCard";
import ListStats from "./ListStats";

function ContentRight(props) {
	const [content, contentChange] = useContext(ContentContext);
	const user = useContext(UserContext);
	const val = props.propSent.curator_id === user.loggedin_user_id;
	return (
		<>
			<ProfileCard userid={props.propSent.curator_id} />
			{props.propSent.contentType === "lists" ? (
				<>
					{/* <CurationReasonCard listid={props.propSent.contentID}/> */}
					{props.propSent.curator_id === user.loggedin_user_id && (
						<ListStats
							userid={props.propSent.curator_id}
							listid={props.propSent.contentID}
						/>
					)}
				</>
			) : (
				<div></div>
			)}

			{/* <PopularProfile/> */}
		</>
	);
}

export default ContentRight;
