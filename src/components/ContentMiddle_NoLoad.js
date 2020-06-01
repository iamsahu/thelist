import React,{useContext,useState,useEffect} from 'react';
// import { useQuery } from '@apollo/react-hooks';
import {Menu,Button,Icon,Item,Placeholder,Modal,Image,Grid} from 'semantic-ui-react';
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  PocketShareButton,
  RedditShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  TwitterIcon,
  FacebookIcon,
  WhatsappIcon
} from "react-share";

import ContentContext from '../context/ContentContext';
// import ContentCard from './ContentCard'
import CentralList from './CentralList'
import AddItem from './AddItem'
// import {FETCH_FEED_ITEMS,FETCH_FEED_ITEMS_OFCURATOR} from '../util/graphql';
import UserContext from '../context/UserContext';
import {GetList,GetItemsUsers,GetItemsofTag,LikeList,UnlikeList,GetTagItems} from '../util/graphqlExecutor'
import MetaTags from 'react-meta-tags';
import ReactGA from 'react-ga';
import Mixpanel from '../util/mix'
import Tap from 'react-interactions'

function ContentMiddleNoLoad(props){
  // console.log(props)
  // console.log(process.env)
  // console.log(process.env.REACT_APP_BASE_URL)
  const [content] = useContext(ContentContext)
  const [posts,setPosts] = useState(null)
  const user = useContext(UserContext)
  const [shareUrl, setshareUrl] = useState(window.location.href)
  const [header, setheader] = useState('')
  const [description, setdescription] = useState('')
  const [listlike, setlistlike] = useState(-1)
  const [loadState, setloadState] = useState(-1)
  
  var activeItem = 'home';
  // console.log(props.propSent)
  // console.log(props.propSent.description)
  if(props.posts===null){
    return(<div>Loading</div>)
  }

  return(
    <>
    {/* <h1>{props.propSent.contentType==='lists'?content.currentList:content.currentTag}</h1> */}
    <Grid>
        <Grid.Column floated='left' width={6}>
        <h1>{props.title}</h1>
        </Grid.Column>
        <Grid.Column floated='right' width={6}>
          {
            props.propSent.contentType==='lists'&&(user.loggedin_user_id===props.propSent.curator_id)&&<AddItem/>
            // <Button circular icon='add' floated='right'/>
          }
        </Grid.Column>
    </Grid>

    {/* <!-- Open Graph / Facebook --> */}
    <MetaTags>
      <meta property="og:type" content="website"/>
      <meta property="og:url" content={shareUrl}/>
      <meta property="og:title" content={props.propSent.contentType==='tags'?content.currentTag:content.currentList}/>
      <meta property="og:description" content={props.propSent.contentType==='lists'?props.propSent.description:"A place for all your curations!"}/>
      <meta property="og:image" content={`${process.env.REACT_APP_BASE_URL}/thelistspace.png`}/>

      {/* <!-- Twitter --/> */}
      <meta property="twitter:card" content={`${process.env.REACT_APP_BASE_URL}/thelistspace.png`}/>
      <meta property="twitter:url" content={shareUrl}/>
      <meta property="twitter:title" content={props.propSent.contentType==='tags'?content.currentTag:content.currentList}/>
      <meta property="twitter:description" content={props.propSent.contentType==='lists'?props.propSent.description:"A place for all your curations!"}/>
      <meta property="twitter:image" content={`${process.env.REACT_APP_BASE_URL}/thelistspace.png`}/>
    </MetaTags>
    <Menu pointing secondary>
      <Menu.Item
        name="Home"
        active={activeItem === 'home'}
      />
      {
      /* <Menu.Item
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
      /> */}
      <Menu.Menu position='right'>
        <div className='icobutton'>
        {
          (props.propSent.contentType==='lists')&&(
            (listlike)?
            (<Button icon  floated='right' onClick={(e)=>{
              Mixpanel.track('Appreciate List',{"link":{shareUrl},"curator":props.propSent.curator_id,"name":content.currentList})
              ReactGA.event({
                  category: 'List',
                  action: 'Like',
                  transport: 'beacon'
              });
              setlistlike(false)
              // console.log('unlike')
              UnlikeList(props.propSent.contentID,user.loggedin_user_id)
              }}>
              <Icon color='red' name='like' />
              {/* <Tap waves /> */}
            </Button>):
            (
              <Button icon floated='right' onClick={(e)=>{
                Mixpanel.track('Appreciate List',{"link":{shareUrl},"curator":props.propSent.curator_id,"name":content.currentList})
                ReactGA.event({
                    category: 'List',
                    action: 'Unlike',
                    transport: 'beacon'
                });
                setlistlike(true)
                LikeList(props.propSent.contentID,user.loggedin_user_id)
                // console.log('unlike')
                }}>
                <Icon name='like' />
                {/* <Tap waves /> */}
              </Button>
            )
          )
        }
        {/* <Button icon >
            <Icon name='bell' />
        </Button> */}
        <Modal closeIcon trigger={<Button icon><Icon name='share alternate' /></Button>} centered={false}>
          <Modal.Header>Share on Social Media</Modal.Header>
          <Modal.Content >
            <div>
            <FacebookShareButton url={shareUrl} quote={props.propSent.description}>
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            {/* </div>
            <div> */}
            <TwitterShareButton
              url={shareUrl}
              title={props.propSent.description}>
              <TwitterIcon size={32} round />
            </TwitterShareButton>
            {/* </div>
            <div> */}
            <WhatsappShareButton
              url={shareUrl}
              title={props.propSent.description}
              separator=":: "
              className="Demo__some-network__share-button"
            >
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
            </div>
          </Modal.Content>
        </Modal>
        {/* <Button icon>
            <Icon name='share alternate' />
        </Button> */}
        </div>
      </Menu.Menu>
    </Menu>
    {
      <div className="scrolly">
        <Item.Group divided>
          {
            props.posts===null?
            (<Placeholder>
              <Placeholder.Header image>
                <Placeholder.Line />
                <Placeholder.Line />
              </Placeholder.Header>
            </Placeholder>):
            (
              (typeof(props.posts)!=='undefined')?
                (props.posts.length>0?
                  (<CentralList posts={props.posts} contentType={props.propSent.contentType} contentID={props.propSent.contentID}/>):
                  (
                    
                   <div className='imageFix'>
                     <Image centered src={`${process.env.REACT_APP_BASE_URL}/undraw_empty_xct9_F5DD47.png`} size='large' verticalAlign='middle' />
                     <br/>There is nothing here! Click on the add item button on the top right side to add an item to your list!
                  </div> 
                  )):
              (<div>No mojo as of now</div>)
            )
          }
        </Item.Group>
       </div>
    }
  </>
  )
}

export default ContentMiddleNoLoad;