import React,{useContext,useState,useEffect} from 'react';
// import { useQuery } from '@apollo/react-hooks';
import {Menu,Button,Icon,Item,Placeholder} from 'semantic-ui-react';
import ContentContext from '../context/ContentContext';

// import ContentCard from './ContentCard'
import CentralList from './CentralList'
// import {FETCH_FEED_ITEMS,FETCH_FEED_ITEMS_OFCURATOR} from '../util/graphql';
import UserContext from '../context/UserContext';
import {GetItemsofTag,GetItemsUsers} from '../util/graphqlExecutor'

function ContentMiddleTag(props){
  const [content] = useContext(ContentContext)
  const [posts,setPosts] = useState(null)
  const user = useContext(UserContext)
  var activeItem = 'home';

  function handleItemClick(){

  }

  function ContentLoaded(){
      // console.log("Loaded")
  }
  
// console.log(props.curator_id)
  const loadData=()=>{
    
    (content.currentTag==="all"&&content.currentTagID==="")?
    (GetItemsUsers({curator_id:props.curator_id}).then((data)=>{
      setPosts(data)
      // console.log('Here')
    })):
    (GetItemsofTag({user_id:props.curator_id,tag_id:content.currentTagID})
    .then((data)=>{
        setPosts(data)
        // console.log('Here')
        // console.log(data.items.length)
        // console.log(typeof(data))
    })
    .catch((error)=>{}))
  }
  // loadData()
  useEffect(()=>{
      loadData()
      // contentChange(content=>({...content,listdescription: posts.items[0].description}))
  },[loadData]);

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
          {/* {loading?
              (<h1>Loading!!</h1>):
              (
                <CentralList posts={temp['data']['items']}/>
              )
          } */}
          {
            posts===null?
            (
              <Placeholder>
                <Placeholder.Header image>
                  <Placeholder.Line />
                  <Placeholder.Line />
                </Placeholder.Header>
              </Placeholder>
            ):
            (
                // <CentralList posts={posts.items}/>
                posts.items.length>0?(<CentralList posts={posts.items}/>):(<div>No Data</div>)
            )
          }
        </Item.Group>
      </div>
    }
  </>
  )
}

export default ContentMiddleTag;