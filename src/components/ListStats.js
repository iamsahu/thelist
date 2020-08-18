import React from "react";
import { Card, Statistic, Loader } from "semantic-ui-react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import CommonLoader from "./CommonLoader";

const GET_STATS = gql`
	query MyQuery($list_id: uuid!) {
		like_list_aggregate(where: { list_id: { _eq: $list_id } }) {
			aggregate {
				count
			}
		}
		like_item_aggregate(where: { item: { list_id: { _eq: $list_id } } }) {
			aggregate {
				count
			}
		}
		lists(where: { id: { _eq: $list_id } }) {
			view_count
		}
	}
`;

function ListStats(props) {
	const { loading, error, data } = useQuery(GET_STATS, {
		variables: { list_id: props.listid },
	});

	if (loading) {
		return <CommonLoader />;
	}
	if (error) {
		console.log(error);
		return <div></div>;
	}

	// return(<div>Loaded</div>)
	return (
		<>
			<Card fluid>
				<Card.Content header="How are people finding this list?" />
				<Card.Content>
					<Statistic.Group horizontal>
						<Statistic>
							<Statistic.Value>
								{data.like_list_aggregate.aggregate.count}
							</Statistic.Value>
							<Statistic.Label>List Likes</Statistic.Label>
						</Statistic>
						<Statistic>
							<Statistic.Value>{data.lists[0].view_count}</Statistic.Value>
							<Statistic.Label>List Views</Statistic.Label>
						</Statistic>
						<Statistic>
							<Statistic.Value>
								{data.like_item_aggregate.aggregate.count}
							</Statistic.Value>
							<Statistic.Label>Item Likes</Statistic.Label>
						</Statistic>
					</Statistic.Group>
				</Card.Content>
			</Card>
		</>
	);
}

export default ListStats;
