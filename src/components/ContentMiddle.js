import React,{useContext} from 'react';
import { useQuery } from '@apollo/react-hooks';
import {Grid,Segment,Placeholder,Divider,Menu,Button,Icon,Item} from 'semantic-ui-react';
import ContentContext from '../context/ContentContext';

import ContentCard from './ContentCard'
import {FETCH_FEED_ITEMS,FETCH_FEED_ITEMS_OFCURATOR} from '../util/graphql';
import UserContext from '../context/UserContext';

function ContentMiddle(props){
    const [content] = useContext(ContentContext)
    const user = useContext(UserContext)
    var activeItem = 'home';
    
    function handleItemClick(){

    }

    function ContentLoaded(){
        // console.log("Loaded")
    }
    
    const temp = useQuery(FETCH_FEED_ITEMS,{
        onCompleted:ContentLoaded(),
    });

    // const temp = useQuery(FETCH_FEED_ITEMS_OFCURATOR,{
    //   variables:{curator_id:user.curator_id},
    //   onCompleted:ContentLoaded(),
    // });

    const loading = temp['loading']
    var posts;

    return(
        <>
        <h1>{content.currentTag}</h1>
        <Menu pointing secondary>
          <Menu.Item
            name="Home"
            active={activeItem === 'home'}
          />
          {/* <Menu.Item
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
          /> */}
          <Menu.Item
            name='Bookmarked'
            active={activeItem === 'Bookmarked'}
            onClick={handleItemClick}
          />
          <Menu.Menu position='right'>
              <div className='icobutton'>
            <Button icon >
                <Icon name='bell' />
            </Button>
            <Button icon>
                <Icon name='share alternate' />
            </Button>
            </div>
          </Menu.Menu>
        </Menu>
          {
            <div className="scrolly">
              <Item.Group >
                {loading?
                    (<h1>Loading!!</h1>):
                    (
                        posts = temp['data']['items'],
                        posts && posts.map(post=>(
                            
                              <ContentCard key={post.id} postdata={post}/>
                            
                            
                        ))
                    )
                }
              </Item.Group>
            </div>
          }
      </>
    )
}

export default ContentMiddle;