import React, { useState } from "react";
import { GetAllLists } from "../util/graphqlExecutor";
import SearchResultItem from "./SearchResultItem";
import { Link } from "react-router-dom";
import StackGrid from "react-stack-grid";
import { useHistory } from "react-router-dom";

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
					{/* <Responsive {...Responsive.onlyMobile}>Hell</Responsive>
					<Responsive minWidth={Responsive.onlyTablet.minWidth}> */}
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
											<Card.Group stackable={true} doubling={true}>
												<Card key={result.id}>
													<Card.Content>
														{result.image_url === '""' ? (
															<Image
																floated="left"
																size="mini"
																rounded
																src="https://react.semantic-ui.com/images/wireframe/square-image.png"
															/>
														) : (
															<Image
																floated="left"
																size="mini"
																rounded
																src={result.image_url}
															/>
														)}
														<Card.Header>
															<Header as="h3">{result.list_name}</Header>
														</Card.Header>
													</Card.Content>
													{/* <Card.Content header={result.list_name} /> */}
													<Card.Content
														description={result.description}
														style={{
															border: "none",
															"border-top": "none",
														}}
													/>
													<Card.Content
														style={{
															border: "none",
															"border-top": "none",
														}}
														extra
													>
														<Label
															image
															size="tiny"
															floated="left"
															basic
															as="a"
															href={`/${result.curator_id}`}
														>
															<img src={result.user.image_link} />
															{result.user.username}
														</Label>
														<Button
															size="tiny"
															floated="right"
															basic
															color="black"
															onClick={() => {
																var t = `/${result.curator_id}/lists/${result.id}`;
																routeChange(t);
															}}
														>
															Read
														</Button>
													</Card.Content>
												</Card>
											</Card.Group>
										</GG>
									)

									//  <SearchResultItem key={result.id} props={result} />
								)
							)}
						</GG>
						{/* </StackGrid> */}
					</Container>
					{/* </Card.Group> */}

					{/* </Responsive> */}
				</>
			)}
		</>
	);
}

export default Explore3;
