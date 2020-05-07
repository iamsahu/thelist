import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import {Grid,Segment,Placeholder,Divider,Menu,Button,Icon,Item} from 'semantic-ui-react';

import ContentCard from './ContentCard'

function ContentMiddle(){
    var activeItem = 'home';
    function handleItemClick(){

    }
    return(
        <>
        <Menu pointing secondary>
          <Menu.Item
            name='Blockchain'
            active={activeItem === 'home'}
          />
          <Menu.Item
            name='Latest'
            active={activeItem === 'Latest'}
            onClick={handleItemClick}
          />
          <Menu.Item
            name='Most Appreciated'
            active={activeItem === 'Most Appreciated'}
            onClick={handleItemClick}
          />
          <Menu.Item
            name='Lost in time'
            active={activeItem === 'Lost in time'}
            onClick={handleItemClick}
          />
          <Menu.Item
            name='All'
            active={activeItem === 'All'}
            onClick={handleItemClick}
          />
          <Menu.Item
            name='Bookmarked'
            active={activeItem === 'Bookmarked'}
            onClick={handleItemClick}
          />
          <Menu.Menu position='right'>
            <Button icon>
                <Icon name='bell' />
            </Button>
            <Button icon>
                <Icon name='share alternate' />
            </Button>
          </Menu.Menu>
        </Menu>
        <Divider/>
        <Item.Group>
            <ContentCard/>
            <ContentCard/>
            <ContentCard/>
            <ContentCard/>
            <ContentCard/>
            <ContentCard/>
            <ContentCard/>
            <ContentCard/>

        </Item.Group>
        {/* <Grid columns={1}>
            <Grid.Column>
                <Segment raised>
                    <Placeholder>
                    <Placeholder.Header image>
                        <Placeholder.Line />
                        <Placeholder.Line />
                    </Placeholder.Header>
                    <Placeholder.Paragraph>
                        <Placeholder.Line length='medium' />
                        <Placeholder.Line length='short' />
                    </Placeholder.Paragraph>
                    </Placeholder>
                </Segment>
            </Grid.Column>
            <Grid.Column>
                <Segment raised>
                    <Placeholder>
                    <Placeholder.Header image>
                        <Placeholder.Line />
                        <Placeholder.Line />
                    </Placeholder.Header>
                    <Placeholder.Paragraph>
                        <Placeholder.Line length='medium' />
                        <Placeholder.Line length='short' />
                    </Placeholder.Paragraph>
                    </Placeholder>
                </Segment>
            </Grid.Column>
            <Grid.Column>
                <Segment raised>
                    <Placeholder>
                    <Placeholder.Header image>
                        <Placeholder.Line />
                        <Placeholder.Line />
                    </Placeholder.Header>
                    <Placeholder.Paragraph>
                        <Placeholder.Line length='medium' />
                        <Placeholder.Line length='short' />
                    </Placeholder.Paragraph>
                    </Placeholder>
                </Segment>
            </Grid.Column>
        </Grid> */}
        </>
    )
}

export default ContentMiddle;