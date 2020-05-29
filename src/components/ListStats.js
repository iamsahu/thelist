import React from 'react'
import {Card,Statistic} from 'semantic-ui-react'

function ListStats(){
    return(
        <>
        <Card fluid>
            <Card.Content header='How are people finding your list?' />
            <Card.Content>
                <Statistic.Group horizontal>
                    <Statistic>
                    <Statistic.Value>2,204</Statistic.Value>
                    <Statistic.Label>Likes</Statistic.Label>
                    </Statistic>
                    <Statistic>
                    <Statistic.Value>3,322</Statistic.Value>
                    <Statistic.Label>Copy</Statistic.Label>
                    </Statistic>
                    <Statistic>
                    <Statistic.Value>22</Statistic.Value>
                    <Statistic.Label>Bookmarks</Statistic.Label>
                    </Statistic>
                </Statistic.Group>
            </Card.Content>
        </Card>
        </>
    )
}

export default ListStats;