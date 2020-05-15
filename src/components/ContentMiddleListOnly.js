import React,{useState,useContext, useEffect} from 'react';
import { useQuery } from '@apollo/react-hooks';
import {Grid,Segment,Placeholder,Divider,Menu,Button,Icon,Item} from 'semantic-ui-react';
import ContentContext from '../context/ContentContext';

import ContentCard from './ContentCard'
import {FETCH_FEED_ITEMS,FETCH_FEED_ITEMS_OFCURATOR} from '../util/graphql';
import UserContext from '../context/UserContext';
import {GetList} from '../util/graphqlExecutor'

function ContentMiddleListOnly(props){
    const [content] = useContext(ContentContext)
    const [posts,setPosts] = useState(null)
    // const [loading,setLoading] = useState(true)
    const user = useContext(UserContext)
    var activeItem = 'home';
    // console.log(props)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const loadData=()=>{
        GetList({userid:props.userid,listid:props.listid}).then((data)=>{
            setPosts(data)
        })
    }

    useEffect(()=>{
        loadData()
    },[loadData, posts]);

    function handleItemClick(){

    }

    return(
        <>
        {/* <h1>{content.currentTag}</h1> */}
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
            {
                posts===null?
                (<h1>Loading!!</h1>):
                (
                    posts.items.map(post=>(<ContentCard key={post.id} postdata={post}/>))
                )
            }
            </Item.Group>
        </div>
        }
      </>
    )
}

export default ContentMiddleListOnly;
