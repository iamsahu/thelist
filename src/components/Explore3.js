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
} from "semantic-ui-react";

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
				<div>Loading</div>
			) : (
				<>
					{/* <Responsive {...Responsive.onlyMobile}>Hell</Responsive>
					<Responsive minWidth={Responsive.onlyTablet.minWidth}> */}

					{/* <Card.Group stackable={true} doubling={true}> */}
					<Container text>
						{/* <StackGrid
						gutterWidth={10}
						gutterHeight={10}
						appearDelay={50}
						columnWidth={250}
					> */}
						{searchResult.lists.map(
							(result) => (
								(col = randomColor()),
								(
									<Card.Group stackable={true} doubling={true}>
										<Card
											key={result.id}
											style={{ "background-color": col, "box-shadow": "none" }}
										>
											{/* <Card.Content> */}
											<Card.Content header={result.list_name} />
											{/* <Link to={`/${result.curator_id}/lists/${result.id}`}> */}

											{/* </Link> */}
											{/* </Card.Content> */}
											{/* <Card.Meta>
											by{" "}

										</Card.Meta> */}

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
													{/* <Link to={`/${result.curator_id}`}> */}
													{result.user.username}
													{/* </Link> */}
												</Label>
												{/* <Icon floated="right" name="twitter" color="black" /> */}
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
													{/* <Link to={`/${result.curator_id}/lists/${result.id}`}> */}
													Read
													{/* </Link> */}
												</Button>
											</Card.Content>
											{/* </Card.Content> */}
										</Card>
									</Card.Group>
								)

								//  <SearchResultItem key={result.id} props={result} />
							)
						)}
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
