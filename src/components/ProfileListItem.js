import React from 'react'
import {List,Image} from 'semantic-ui-react'

function ProfileListItem(props){
    return(
        <>
        <List.Item>
            <Image avatar src={props.image_link} />
            <List.Content>
                <List.Header as='a' href={`${process.env.REACT_APP_BASE_URL}/${props.id}`}>{props.username}</List.Header>
                <List.Description>
                {props.description}
                </List.Description>
            </List.Content>
        </List.Item>
        </>
    )
}

export default ProfileListItem;