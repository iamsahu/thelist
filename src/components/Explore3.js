import React, { useState } from "react";
import { GetAllLists } from "../util/graphqlExecutor";
import SearchResultItem from "./SearchResultItem";
import { Link } from "react-router-dom";
import StackGrid from "react-stack-grid";
import { useHistory } from "react-router-dom";
import LandingPageCard from "./LandingPageCard";

import {
	Icon,
	Responsive,
	Card,
	Label,
	Image,
	Container,
	Button,
	Loader,
	Header,
	Item,
} from "semantic-ui-react";
import { Grid as GG, Card as CC } from "@material-ui/core";
function Explore3() {
	const [loading, setloading] = useState(true);
	const [searchResult, setsearchResult] = useState(null);
	const history = useHistory();
	const loadData = () => {
		GetAllLists().then((response) => {
			setsearchResult(response);
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

	function randomColor() {
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
	}
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
						{/* <Item.Group> */}
						{searchResult.lists.map(
							(result) => (
								(col = randomColor()),
								(
									// <GG item xs={4}>
									// <Card.Group stackable={true} doubling={true} fluid>
									<LandingPageCard result={result} key={result.id} />
								)
								// </Card.Group>

								//  <SearchResultItem key={result.id} props={result} />
							)
						)}
						{/* </Item.Group> */}
					</Responsive>
					<Responsive minWidth={Responsive.onlyTablet.minWidth}>
						{/* <Card.Group stackable={true} doubling={true}> */}
						<Container>
							{/* <StackGrid
						gutterWidth={10}
						gutterHeight={10}
						appearDelay={50}
						columnWidth={250}
					> */}
							<GG container spacing={3}>
								{searchResult.lists.map(
									(result) => (
										(col = randomColor()),
										(
											<GG item xs={4}>
												{/* <Card.Group stackable={true} doubling={true}> */}
												<LandingPageCard result={result} key={result.id} />
												{/* </Card.Group> */}
											</GG>
										)
									)
								)}
							</GG>
							{/* </StackGrid> */}
						</Container>
						{/* </Card.Group> */}
					</Responsive>
				</>
			)}
		</>
	);
}

export default Explore3;
