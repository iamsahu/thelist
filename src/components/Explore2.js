import React, { useState } from "react";
import { GetAllLists } from "../util/graphqlExecutor";
import SearchResultItem from "./SearchResultItem";
import { Link } from "react-router-dom";
import StackGrid from "react-stack-grid";
import { useHistory } from "react-router-dom";
import LandingPageCard from "./LandingPageCard";
import Follow from "./Follow";
import { Grid as GG } from "@material-ui/core";
import {
	Item,
	Responsive,
	Card,
	Label,
	Image,
	Container,
	Button,
	Header,
	Loader,
} from "semantic-ui-react";

function Explore() {
	const [loading, setloading] = useState(true);
	const [alllists, setalllists] = useState(null);
	const history = useHistory();
	const loadData = () => {
		GetAllLists().then((response) => {
			setalllists(response);
			setloading(false);
		});
	};

	loadData();

	// function CreateRows(lists) {
	// 	var count = 0;
	// 	for (result in lists) {
	// 		if (count % 3) {
	// 		}
	// 	}
	// }
	const routeChange = (t) => {
		history.push(t);
	};

	var clS = true;
	function randomColor() {
		// if (clS) {
		// 	clS = !clS;
		// 	return "#948FFF";
		// } else {
		// 	clS = !clS;
		// 	return "#F5DD47";
		// }
		const t = [
			"#FDF2A8",
			"#FCE7C4",
			"#FCD4C4",
			"#FDC1BF",
			"#FDBFE5",
			"#E6BFFD",
			"#BFC6FD",
			"#BFF4FD",
			"#BFFDCD",
			"#E3FDBF",
			"#FDF2A8",
		];
		return t[Math.floor(Math.random() * t.length)];
	} //F5DD47,#948FFF
	var col;

	return (
		<>
			{loading ? (
				<div>
					<Loader active inline="centered" />
				</div>
			) : (
				<>
					<Responsive {...Responsive.onlyMobile}>
						{/* <Item.Group fluid> */}

						{alllists.lists.map(
							(result) => (
								(col = randomColor()),
								(
									// <Card.Group stackable={true} doubling={true}>
									<LandingPageCard fluid result={result} />
								)
								// </Card.Group>

								//  <SearchResultItem key={result.id} props={result} />
							)
						)}
						{/* </Item.Group> */}
					</Responsive>
					<Responsive minWidth={Responsive.onlyTablet.minWidth}>
						{/* <Card.Group stackable={true} doubling={true}> */}
						{/* <Container> */}
						{/* <StackGrid
							gutterWidth={10}
							gutterHeight={10}
							appearDelay={10}
							columnWidth={300}
						> */}
						<GG container spacing={3}>
							{alllists.lists.map(
								(result) => (
									(col = randomColor()),
									(
										<GG item xs={3}>
											<LandingPageCard result={result} />
										</GG>
									)
								)
							)}
						</GG>
						{/* </StackGrid> */}
						{/* </Container> */}
						{/* </Card.Group> */}
					</Responsive>
				</>
			)}
		</>
	);
}

export default Explore;
