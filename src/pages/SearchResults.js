import React, { useState } from "react";
import { Search } from "../util/graphqlExecutor";
import SearchResultItem from "../components/SearchResultItem";
import {
	Item,
	Grid,
	Header,
	Divider,
	Loader,
	Image,
	Responsive,
} from "semantic-ui-react";
import algoliasearch from "algoliasearch/lite";

const client = algoliasearch("NSPJOE2NY1", "5b52961578844b8b542039deb20c8f87");

function SearchResults(props) {
	const [searchResult, setsearchResult] = useState(null);
	const [loading, setloading] = useState(true);
	const [items, setItems] = useState("");
	const [lists, setLists] = useState("");
	const [lastSearch, setLastSearch] = useState("");
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
	// client.multipleQueries(queries).then(({ results }) => {
	// 	console.log(results);
	// 	setItems(results[1].hits);
	// 	setLists(results[0].hits);
	// });

	const loaddata = () => {
		if (typeof foo !== "undefined") {
			Search({ search: foo }).then((response) => {
				// console.log(response)
				setsearchResult(response);
				setloading(false);
			});
		}
	};

	const algoLoad = () => {
		if (lastSearch !== foo) {
			client.multipleQueries(queries).then(({ results }) => {
				console.log(results);
				setItems(results[1].hits);
				setLists(results[0].hits);
				setloading(false);
				setLastSearch(foo);
			});
		}
	};

	if (typeof foo !== "undefined") {
		// loaddata();
		algoLoad();
	}

	function ListItem(item) {
		return (
			<div class="bg-white border shadow-md mt-4 rounded-lg overflow-hidden mr-1 ml-1 text-gray-900 w-full font-sans">
				<div class="flex h-40">
					<div class="w-1/4 h-40 p-2">
						<div class="rounded border-black">
							{item.image_url === '""' ? (
								<img
									class="object-cover rounded-lg h-32"
									src="https://i.imgur.com/MwTfvwo.png"
								/>
							) : (
								<img
									class="object-cover rounded-lg h-32"
									src={item.image_url}
								/>
							)}
						</div>
					</div>
					<div class="p-2 w-3/4 h-40">
						<div class="mb-1 max-h-full">
							<a
								class="font-normal text-gray-800 w-full text-lg md:text-xl"
								href={item.curator_id + "/lists/" + item.objectID}
							>
								{item.list_name}
							</a>
							<p class="text-gray-700 font-thin overflow-hidden max-h-full mb-1 pb-1 h-40 text-base lg:text-lg">
								{item.description}
							</p>
						</div>
						{/* <div class="text-gray-500 mb-8 text-left uppercase tracking-widest object-bottom text-sm md:text-base">
							{props.viewcount === null ? 0 : props.viewcount} Views{" "}
							{props.listcount} Lists{" "}
							{props.itemscount === null ? 0 : props.itemscount} Items
						</div> */}
					</div>
				</div>
			</div>
		);
	}

	function Item2(item) {
		return (
			<div class="flex h-48">
				<div class="bg-white border shadow-md mt-4 rounded-lg overflow-hidden mr-1 ml-1 text-gray-900 w-full">
					<div class="flex h-48">
						<div class="w-1/4 max-w-full h-48 relative">
							<img
								class="absolute h-48 w-full object-cover object-center"
								src={item.auto_image}
								onError={(e) => {
									e.target.onerror = null;
									e.target.src = "https://i.imgur.com/MwTfvwo.png";
								}}
							/>
						</div>
						<div class="p-2 w-3/4 h-48">
							<div class="overflow-hidden h-48">
								{/* <h4 class="font-semibold text-xl text-gray-800 truncate"> */}
								<a
									class="font-normal text-gray-800 w-full text-lg md:text-xl"
									target="_blank"
									href={item.link}
								>
									{item.name}
								</a>
								{/* <div class="text-gray-500 text-sm md:text-base font-thin">
									in{" "}
									<a
										href={item.curator + "/lists/" + item.list_id}
										class="text-blue-500"
									>
										{item.list_name}
									</a>
								</div> */}
								{/* </h4> */}
								<Responsive {...Responsive.onlyMobile}>
									<p class="text-gray-700 mt-1 overflow-hidden font-thin text-base lg:text-lg">
										{item.description !== ""
											? item.description.substring(0, 100)
											: item.auto_description === "none"
											? ""
											: item.auto_description.substring(0, 100)}
										...
									</p>
								</Responsive>
								<Responsive minWidth={Responsive.onlyTablet.minWidth}>
									<p class="text-gray-700 mt-1 overflow-hidden font-thin text-base lg:text-lg">
										{item.description !== ""
											? item.description.substring(0, 336)
											: item.auto_description === "none"
											? ""
											: item.auto_description.substring(0, 336)}
									</p>
								</Responsive>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div class="mt-8 pt-20">
			<Grid columns={3}>
				<Grid.Column width={3} />
				<Grid.Column width={10}>
					<Header as="h2">Results for "{foo}" </Header>
					<Image
						src="https://res.cloudinary.com/hilnmyskv/image/upload/q_auto/v1595410010/Algolia_com_Website_assets/images/shared/algolia_logo/search-by-algolia-light-background.png"
						size="small"
						spaced
					/>

					<Divider />
					<Item.Group>
						{items === "" ? (
							<div>
								<Loader active inline="centered" />
							</div>
						) : (
							items.map((item) => Item2(item))
						)}
						{lists === "" ? (
							<div>
								<Loader active inline="centered" />
							</div>
						) : (
							lists.map((list) => ListItem(list))
						)}
						{/* {loading ? (
							<div>
								<Loader active inline="centered" />
							</div>
						) : searchResult !== null ? (
							searchResult.search_lists.map((result) => (
								<SearchResultItem key={result.id} props={result} />
							))
						) : (
							"No results"
						)} */}
					</Item.Group>
				</Grid.Column>
				<Grid.Column width={3} />
			</Grid>
		</div>
	);
}

export default SearchResults;

//<SearchResultItem key={result.id} props={result}/>
