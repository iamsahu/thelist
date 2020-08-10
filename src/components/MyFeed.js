import React, { useContext } from "react";
import { Responsive } from "semantic-ui-react";
import StreamContext from "../context/StreamContext";

function MyFeed(props) {
	const [streamClient, streamuserFeed] = useContext(StreamContext);
	var feed = streamClient.feed("timeline", props.user);
	feed.get().then((activitiesSuccess) => {
		console.log(activitiesSuccess);
	});
	return (
		<>
			<Responsive {...Responsive.onlyMobile}>Coming Soon!</Responsive>
			<Responsive minWidth={Responsive.onlyTablet.minWidth}>
				Coming Soon!
			</Responsive>
		</>
	);
}

export default MyFeed;
