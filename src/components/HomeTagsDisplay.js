import React, { useState, useContext } from "react";
import { GetAllTags } from "../util/graphqlExecutor";
import SearchResultItem from "./SearchResultItem";
import { List, Responsive, Loader } from "semantic-ui-react";
import { Link } from "react-router-dom";
import StackGrid from "react-stack-grid";

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
					<div>
						<Loader active inline="centered" />
					</div>
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
								{/* <List animated verticalAlign="middle"> */}
								<StackGrid
									gutterWidth={10}
									gutterHeight={10}
									appearDelay={5}
									columnWidth={200}
								>
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
									{/* </List> */}
								</StackGrid>
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
