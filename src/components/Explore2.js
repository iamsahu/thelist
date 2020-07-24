import React, { useState } from "react";
import { GetAllLists } from "../util/graphqlExecutor";
import SearchResultItem from "./SearchResultItem";
import { Link } from "react-router-dom";
import StackGrid from "react-stack-grid";
import { useHistory } from "react-router-dom";
import LandingPageCard from "./LandingPageCard";

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
					{/* <Responsive {...Responsive.onlyMobile}>Hell</Responsive>
					<Responsive minWidth={Responsive.onlyTablet.minWidth}> */}

					{/* <Card.Group stackable={true} doubling={true}> */}
					{/* <Container> */}
					<StackGrid
						gutterWidth={10}
						gutterHeight={10}
						appearDelay={30}
						columnWidth={300}
					>
						{searchResult.lists.map(
							(result) => (
								(col = randomColor()), (<LandingPageCard result={result} />)
								// <Card fluid raised key={result.id}>
								// 	<Card.Content>
								// 		{result.image_url === '""' ? (
								// 			<Image
								// 				floated="left"
								// 				size="mini"
								// 				rounded
								// 				src="https://react.semantic-ui.com/images/wireframe/square-image.png"
								// 			/>
								// 		) : (
								// 			<Image
								// 				floated="left"
								// 				size="mini"
								// 				rounded
								// 				src={result.image_url}
								// 			/>
								// 		)}
								// 		<Card.Header>
								// 			<Header as="h3">{result.list_name}</Header>
								// 		</Card.Header>
								// 	</Card.Content>
								// 	<Card.Content
								// 		description={result.description}
								// 		style={{
								// 			border: "none",
								// 			"border-top": "none",
								// 		}}
								// 	/>
								// 	<Card.Content
								// 		style={{
								// 			border: "none",
								// 			"border-top": "none",
								// 		}}
								// 	>
								// 		<Image src={result.user.image_link} avatar />
								// 		<span>
								// 			<Link to={`/${result.curator_id}`}>
								// 				{result.user.username}
								// 			</Link>
								// 		</span>
								// 		<Button
								// 			size="tiny"
								// 			floated="right"
								// 			basic
								// 			color="black"
								// 			onClick={() => {
								// 				var t = `/${result.curator_id}/lists/${result.id}`;
								// 				routeChange(t);
								// 			}}
								// 		>
								// 			Read
								// 		</Button>
								// 	</Card.Content>
								// </Card>

								//  <SearchResultItem key={result.id} props={result} />
							)
						)}
					</StackGrid>
					{/* </Container> */}
					{/* </Card.Group> */}

					{/* </Responsive> */}
				</>
			)}
		</>
	);
}

export default Explore;
