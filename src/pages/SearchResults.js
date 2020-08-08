import React, { useState } from "react";
import { Search } from "../util/graphqlExecutor";
import SearchResultItem from "../components/SearchResultItem";
import { Item, Grid, Header, Divider, Loader, Image } from "semantic-ui-react";
import algoliasearch from "algoliasearch/lite";

const client = algoliasearch("NSPJOE2NY1", "5b52961578844b8b542039deb20c8f87");

function SearchResults(props) {
	const [searchResult, setsearchResult] = useState(null);
	const [loading, setloading] = useState(true);
	const search = window.location.search;
	const params = new URLSearchParams(search);
	const foo = params.get("query");
	// console.log(foo)

	const queries = [
		{
			indexName: "lists",
			query: foo,
			params: {
				hitsPerPage: 10,
			},
		},
		{
			indexName: "items",
			query: foo,
			params: {
				hitsPerPage: 10,
			},
		},
	];

	// perform 3 queries in a single API call:
	//  - 1st query targets index `categories`
	//  - 2nd and 3rd queries target index `products`
	client.multipleQueries(queries).then(({ results }) => {
		console.log(results);
	});

	const loaddata = () => {
		if (typeof foo !== "undefined") {
			Search({ search: foo }).then((response) => {
				// console.log(response)
				setsearchResult(response);
				setloading(false);
			});
		}
	};

	if (typeof foo !== "undefined") {
		loaddata();
	}

	return (
		<div id="content" className="ui">
			<Grid columns={3}>
				<Grid.Column width={3} />
				<Grid.Column width={9}>
					<Header as="h2">Results for {foo} </Header>
					<Image
						src="https://res.cloudinary.com/hilnmyskv/image/upload/q_auto/v1595410010/Algolia_com_Website_assets/images/shared/algolia_logo/search-by-algolia-light-background.png"
						size="small"
						spaced="right"
					/>
					<Divider />
					<Item.Group>
						{loading ? (
							<div>
								<Loader active inline="centered" />
							</div>
						) : searchResult !== null ? (
							searchResult.search_lists.map((result) => (
								<SearchResultItem key={result.id} props={result} />
							))
						) : (
							"No results"
						)}
					</Item.Group>
				</Grid.Column>
				<Grid.Column width={4} />
			</Grid>
		</div>
	);
}

export default SearchResults;

//<SearchResultItem key={result.id} props={result}/>
