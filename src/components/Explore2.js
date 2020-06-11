import React, { useState } from "react";
import { GetAllLists } from "../util/graphqlExecutor";
import SearchResultItem from "./SearchResultItem";
import { Link } from "react-router-dom";

import {
	Item,
	Responsive,
	Card,
	Label,
	Image,
	Container,
} from "semantic-ui-react";

function Explore() {
	const [loading, setloading] = useState(true);
	const [searchResult, setsearchResult] = useState(null);

	const loadData = () => {
		GetAllLists().then((response) => {
			setsearchResult(response);
			setloading(false);
		});
	};

	loadData();

	return (
		<>
			{loading ? (
				<div>Loading</div>
			) : (
				<>
					{/* <Responsive {...Responsive.onlyMobile}>Hell</Responsive>
					<Responsive minWidth={Responsive.onlyTablet.minWidth}> */}
					<Container>
						<Card.Group itemsPerRow={4} stackable>
							{searchResult.lists.map((result) => (
								<Card raised key={result.id}>
									<Card.Content>
										<Card.Header>
											<Link to={`/${result.curator_id}/lists/${result.id}`}>
												{result.list_name}
											</Link>
										</Card.Header>
										<Card.Meta>
											by{" "}
											<Label image>
												<img src={result.user.image_link} />
												<Link to={`/${result.curator_id}`}>
													{result.user.username}
												</Link>
											</Label>
										</Card.Meta>

										<Card.Description>{result.description}</Card.Description>
									</Card.Content>
								</Card>

								//  <SearchResultItem key={result.id} props={result} />
							))}
						</Card.Group>
					</Container>
					{/* </Responsive> */}
				</>
			)}
		</>
	);
}

export default Explore;
