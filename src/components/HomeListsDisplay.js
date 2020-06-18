import React, { useState } from "react";
import { GetAllLists } from "../util/graphqlExecutor";
import SearchResultItem from "./SearchResultItem";
import { Item, Responsive, Loader } from "semantic-ui-react";

function HomeListsDisplay() {
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
				<div>
					<Loader active inline="centered" />
				</div>
			) : (
				<>
					<Responsive {...Responsive.onlyMobile}>
						<div>
							<Item.Group divided>
								{searchResult.lists.map((result) => (
									<SearchResultItem key={result.id} props={result} />
								))}
							</Item.Group>
						</div>
					</Responsive>
					<Responsive minWidth={Responsive.onlyTablet.minWidth}>
						<div className="scrollyExplore">
							<Item.Group divided>
								{searchResult.lists.map((result) => (
									<SearchResultItem key={result.id} props={result} />
								))}
							</Item.Group>
						</div>
					</Responsive>
				</>
			)}
		</>
	);
}

export default HomeListsDisplay;
