import React from "react";
import { Button, Image, Icon } from "semantic-ui-react";

function BuyMeCoffee(props) {
	// console.log(props);
	if (props.coffee === "none") return <></>;
	return (
		<>
			<Button
				size="tiny"
				floated="right"
				basic
				color="black"
				as="a"
				href={"https://www.buymeacoffee.com/" + props.coffee}
				target="_blank"
			>
				<Icon name="coffee" />
				{/* <Image
					size="tiny"
					src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg"
				/> */}
				Buy {props.user} a coffee
			</Button>
		</>
	);
}

export default BuyMeCoffee;
