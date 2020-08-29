import React from "react";
// import Lottie from "react-lottie";
import * as animationData from "../assets/animations/simpleloader.json";
import { Loader } from "semantic-ui-react";

function CommonLoader() {
	const defaultOptions = {
		loop: true,
		autoplay: true,
		animationData: animationData,
		rendererSettings: {
			preserveAspectRatio: "xMidYMid slice",
		},
	};
	return (
		<div className="content-center flex">
			{/* <Lottie options={defaultOptions} height={100} width={100} /> */}
			<Loader active inline="centered" />
		</div>
	);
}

export default CommonLoader;
