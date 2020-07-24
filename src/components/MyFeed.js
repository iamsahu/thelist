import React from "react";
import { Responsive } from "semantic-ui-react";

function MyFeed(props) {
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
