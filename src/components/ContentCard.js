import React from 'react'
import {Item,Button,Icon} from 'semantic-ui-react'

function ContentCard(){
    return(
        <>
        <Item>
            <Item.Image size='small' src='https://react.semantic-ui.com/images/wireframe/image.png' />
            <Item.Content>
                <Item.Header as='a'>Cute Dog</Item.Header>
                <Button icon floated='right'>
                    <Icon name='bookmark outline' />
                </Button>
                <Button icon floated='right'>
                    <Icon name='copy' />
                </Button>
                
                <Button icon floated='right'>
                    <Icon name='certificate' />
                </Button>
                <Item.Description>
                <p></p>
                <p>
                    Many people also have their own barometers for what makes a cute
                    dog. Many people also have their own barometers for what makes a cute
                    dog. Many people also have their own barometers for what makes a cute
                    dog. Many people also have their own barometers for what makes a cute
                    dog. Many people also have their own barometers for what makes a cute
                    dog. Many people also have their own barometers for what makes a cute
                    dog. Many people also have their own barometers for what makes a cute
                    dog. Many people also have their own barometers for what makes a cute
                    dog.
                </p>
                </Item.Description>
                
            </Item.Content>
            </Item>
        </>
    )
}

export default ContentCard;