import React from 'react';
import {Card,Image} from 'semantic-ui-react'

function ProfileCard(){
    return(
        <>
        <Card >
            <Card.Content>
                <Image
                floated='right'
                size='mini'
                src='https://react.semantic-ui.com/images/avatar/large/steve.jpg'
                />
                <Card.Header>Prafful Sahu</Card.Header>
                <Card.Meta>Friends of Elliot</Card.Meta>
                <Card.Description>
                A master procrastinator with with penchant for reading all that is unecessary!
                </Card.Description>
            </Card.Content>
        </Card>
        </>
    )
}

export default ProfileCard