import React from 'react'
import {Card,Statistic} from 'semantic-ui-react'
import gql from 'graphql-tag'
import { useQuery } from "@apollo/react-hooks";

const GET_STATS=gql`
    query MyQuery($list_id:uuid!) {
        like_list_aggregate(where: {list_id: {_eq: $list_id}}) {
            aggregate {
                count
            }
        }
        like_item_aggregate(where: {item: {list_id: {_eq: $list_id}}}) {
            aggregate {
               count
            }
        }
    }
`

function ListStats(props){
    // console.log(props)
    const { loading, error, data } = useQuery(GET_STATS, {
        variables: { list_id: props.listid }
    });

    if(loading){
        return(<div>Statistic</div>)
    }
    if(error){
        console.log(error)
        return <div></div>
    }
    // console.log(data)
    // return(<div>Loaded</div>)
    return(
        <>
        <Card fluid>
            <Card.Content header='How are people finding your list?' />
            <Card.Content>
                <Statistic.Group horizontal>
                    <Statistic>
                        <Statistic.Value>{data.like_list_aggregate.aggregate.count}</Statistic.Value>
                        <Statistic.Label>List Likes</Statistic.Label>
                    </Statistic>
                    <Statistic>
                        <Statistic.Value>3,322</Statistic.Value>
                        <Statistic.Label>Copy</Statistic.Label>
                    </Statistic>
                    <Statistic>
                        <Statistic.Value>{data.like_item_aggregate.aggregate.count}</Statistic.Value>
                        <Statistic.Label>Item Likes</Statistic.Label>
                    </Statistic>
                </Statistic.Group>
            </Card.Content>
        </Card>
        </>
    )
}

export default ListStats;