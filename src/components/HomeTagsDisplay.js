import React, { useState, useContext } from "react";
import { GetAllTags } from "../util/graphqlExecutor";
import SearchResultItem from "./SearchResultItem";
import { List, Responsive } from "semantic-ui-react";
import { Link } from "react-router-dom";

import ContentContext from "../context/ContentContext";

function HomeTagsDisplay() {
	const [content, contentChange] = useContext(ContentContext);
	const [loading, setloading] = useState(true);
	const [searchResult, setsearchResult] = useState(null);

	const loadData = () => {
		GetAllTags().then((response) => {
			setsearchResult(response);
			setloading(false);
		});
	};

	loadData();
	return (
		<>
			{
				loading ? (
					<div>Loading</div>
				) : (
					<>
						<Responsive {...Responsive.onlyMobile}>
							<div>
								<List animated verticalAlign="middle">
									{searchResult.tag.map((result) => (
										<List.Item key={result.id}>
											<List.Content
												onClick={() => {
													contentChange((content) => ({
														...content,
														currentTag: result.name,
														currentTagID: result.id,
														currentListID: "",
														contentType: "tags",
													}));
												}}
											>
												<Link to={`/${result.user_id}/tags/${result.id}`}>
													# {result.name}
												</Link>
											</List.Content>
										</List.Item>
									))}
								</List>
							</div>
						</Responsive>
						<Responsive minWidth={Responsive.onlyTablet.minWidth}>
							<div className="scrollyExplore">
								<List animated verticalAlign="middle">
									{searchResult.tag.map((result) => (
										<List.Item key={result.id}>
											<List.Content
												onClick={() => {
													contentChange((content) => ({
														...content,
														currentTag: result.name,
														currentTagID: result.id,
														currentListID: "",
														contentType: "tags",
													}));
												}}
											>
												<Link to={`/${result.user_id}/tags/${result.id}`}>
													# {result.name}
												</Link>
											</List.Content>
										</List.Item>
									))}
								</List>
							</div>
						</Responsive>
					</>
				)

				// <SearchResultItem key={result.id} props={result}/>))
			}
		</>
	);
}

export default HomeTagsDisplay;
