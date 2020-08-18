import React from "react";
import Lottie from "react-lottie";
import * as animationData from "../assets/animations/simpleloader.json";

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
		<div class="content-center flex">
			<Lottie options={defaultOptions} height={100} width={100} />
		</div>
	);
}

export default CommonLoader;
