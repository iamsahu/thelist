import React from 'react'
import {List,Image} from 'semantic-ui-react'

function ProfileListItem(){
    return(
        <>
        <List.Item>
            <Image avatar src='https://react.semantic-ui.com/images/avatar/small/rachel.png' />
            <List.Content>
                <List.Header as='a'>Rachel</List.Header>
                <List.Description>
                Last seen watching{' '}
                <a>
                    <b>Arrested Development</b>
                </a>{' '}
                just now.
                </List.Description>
            </List.Content>
        </List.Item>
        </>
    )
}

export default ProfileListItem;