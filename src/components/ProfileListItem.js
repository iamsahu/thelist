import React from 'react'
import {List,Image,Item} from 'semantic-ui-react'

function ProfileListItem(props){
    return(
        <>
        <Item key={props.id}>
            <Item.Image avatar size='tiny' src={props.image_link} />
            <Item.Content verticalAlign='middle'>
                <Item.Header as='a' href={`${process.env.REACT_APP_BASE_URL}/${props.id}`}>{props.username}</Item.Header>
                <Item.Description>{props.description}</Item.Description>
            </Item.Content>
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