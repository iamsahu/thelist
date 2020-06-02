import React from 'react'
import {List,Image,Item,Statistic} from 'semantic-ui-react'

function ProfileListItem(props){
    return(
        <>
        <Item key={props.id}>
            <Item.Image avatar size='tiny' src={props.image_link} />
            <Item.Content verticalAlign='middle' fluid>
                <Item.Header as='a' href={`${process.env.REACT_APP_BASE_URL}/${props.id}`}>{props.username}</Item.Header>
                <Item.Description>{props.description}</Item.Description>
            </Item.Content>
            <Item.Extra position='right' floated='right'>
                <Statistic.Group size='mini'>
                    <Statistic>
                        <Statistic.Value>22</Statistic.Value>
                        <Statistic.Label>Faves</Statistic.Label>
                    </Statistic>
                    <Statistic>
                        <Statistic.Value>31,200</Statistic.Value>
                        <Statistic.Label>Views</Statistic.Label>
                    </Statistic>
                    <Statistic>
                        <Statistic.Value>22</Statistic.Value>
                        <Statistic.Label>Members</Statistic.Label>
                    </Statistic>
                </Statistic.Group>
            </Item.Extra>
        </Item>
        {/* <List.Item key={props.id}>
            <Image avatar src={props.image_link} />
            <List.Content>
                <List.Header as='a' href={`${process.env.REACT_APP_BASE_URL}/${props.id}`}>{props.username}</List.Header>
                <List.Description>
                {props.description}
                </List.Description>
            </List.Content>
        </List.Item> */}
        </>
    )
}

export default ProfileListItem;