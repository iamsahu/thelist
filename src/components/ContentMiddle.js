import React,{useContext,useState,useEffect} from 'react';
// import { useQuery } from '@apollo/react-hooks';
import {Menu,Button,Icon,Item,Placeholder,Modal,Image} from 'semantic-ui-react';
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
// import {FETCH_FEED_ITEMS,FETCH_FEED_ITEMS_OFCURATOR} from '../util/graphql';
import UserContext from '../context/UserContext';
import {GetList,GetItemsUsers,GetItemsofTag,LikeList,UnlikeList} from '../util/graphqlExecutor'
import MetaTags from 'react-meta-tags';
import ReactGA from 'react-ga';
import Mixpanel from '../util/mix'
import Tap from 'react-interactions'

function ContentMiddle(props){
  // console.log(process.env)
  // console.log(process.env.REACT_APP_BASE_URL)
  const [content] = useContext(ContentContext)
  const [posts,setPosts] = useState(null)
  const user = useContext(UserContext)
  const [shareUrl, setshareUrl] = useState(window.location.href)
  const [header, setheader] = useState('')
  const [description, setdescription] = useState('')
  const [listlike, setlistlike] = useState(-1)
  
  var activeItem = 'home';

  function handleItemClick(){

  }

  function ContentLoaded(){
      // console.log("Loaded")
  }
  
  // const temp = useQuery(FETCH_FEED_ITEMS,{
  //     onCompleted:ContentLoaded(),
  // });

  // const loading = temp['loading']
  // var posts;
  // console.log(props.curator_id)
  // console.log(content)
  const loadData=()=>{
    (content.contentType==='lists')?
      ((content.currentListID==='')?(GetItemsUsers({curator_id:user.curator_id}).then((data)=>{
        setPosts(data)        
      })):
      (GetList({userid:user.curator_id,listid:content.currentListID}).then((data)=>{
        // console.log(data)
        setPosts(data)
        if(typeof(data)!=='undefined'){
          if(data.items.length>0){
            setheader(data.items[0]['list']['list_name'])
            setdescription(data.items[0]['list']['description'])
          }
        }

        if(posts.like_list.length>0){
          // console.log("setting likes")
          setlistlike(true)
        }else{
          setlistlike(false)
        }
      }).catch((error)=>console.log(error)))):
    (
      (content.contentType==='tags')?
      ((content.currentTagID==="")?(GetItemsUsers({curator_id:user.curator_id}).then((data)=>{setPosts(data)})):
      (GetItemsofTag({user_id:user.curator_id,tag_id:content.currentTagID}).then((data)=>{setPosts(data)}))):
      (console.log("Not a valid content"))
    )
    // (content.contentType==='Lists'&&content.currentListID==='')?
    // (GetItemsUsers({curator_id:props.curator_id}).then((data)=>{
    //   setPosts(data)
    // })):
    // (GetList({userid:props.curator_id,listid:content.currentListID}).then((data)=>{
    //     setPosts(data)
    // }).catch((error)=>console.log(error)))
  }

  loadData()

  
  // useEffect(()=>{
  //     loadData()
  //     // contentChange(content=>({...content,listdescription: posts.items[0].description}))
  // },[loadData]);
  // if(posts!==null)
  // if(listlike===-1){
  //   if(posts.like_list.length>0){
  //     setlistlike(true)
  //   }
  // }

  return(
    <>
    <h1>{content.contentType==='lists'?content.currentList:content.currentTag}</h1>
    {/* <!-- Open Graph / Facebook --> */}
    <MetaTags>
      <meta property="og:type" content="website"/>
      <meta property="og:url" content={shareUrl}/>
      <meta property="og:title" content={content.contentType==='tags'?content.currentTag:content.currentList}/>
      <meta property="og:description" content={content.contentType==='lists'?{description}:"A place for all your curations!"}/>
      <meta property="og:image" content={`${process.env.REACT_APP_BASE_URL}/thelistspace.png`}/>

      {/* <!-- Twitter --/> */}
      <meta property="twitter:card" content={`${process.env.REACT_APP_BASE_URL}/thelistspace.png`}/>
      <meta property="twitter:url" content={shareUrl}/>
      <meta property="twitter:title" content={content.contentType==='tags'?content.currentTag:content.currentList}/>
      <meta property="twitter:description" content={content.contentType==='lists'?{description}:"A place for all your curations!"}/>
      <meta property="twitter:image" content={`${process.env.REACT_APP_BASE_URL}/thelistspace.png`}/>
    </MetaTags>
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
      />
      <Menu.Item
        name='Bookmarked'
        active={activeItem === 'Bookmarked'}
        onClick={handleItemClick}
      /> */}
      <Menu.Menu position='right'>
        <div className='icobutton'>
        {
          (content.contentType==='lists')&&(
            (listlike)?
            (<Button icon  floated='right' onClick={(e)=>{
              Mixpanel.track('Appreciate List',{"link":{shareUrl},"curator":user.curator_id,"name":content.currentList})
              ReactGA.event({
                  category: 'List',
                  action: 'Like',
                  transport: 'beacon'
              });
              setlistlike(false)
              // console.log('unlike')
              UnlikeList(content.currentListID,user.loggedin_user_id)
              }}>
              <Icon color='red' name='like' />
              {/* <Tap waves /> */}
            </Button>):
            (
              <Button icon floated='right' onClick={(e)=>{
                Mixpanel.track('Appreciate List',{"link":{shareUrl},"curator":user.curator_id,"name":content.currentList})
                ReactGA.event({
                    category: 'List',
                    action: 'Unlike',
                    transport: 'beacon'
                });
                setlistlike(true)
                LikeList(content.currentListID,user.loggedin_user_id)
                // console.log('unlike')
                }}>
                <Icon name='like' />
                {/* <Tap waves /> */}
              </Button>
            )
          )
        }
        <Button icon >
            <Icon name='bell' />
        </Button>
        <Modal closeIcon trigger={<Button icon><Icon name='share alternate' /></Button>} centered={false}>
          <Modal.Header>Share on Social Media</Modal.Header>
          <Modal.Content >
            <div>
            <FacebookShareButton url={shareUrl} quote={content.contentDescription}>
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            {/* </div>
            <div> */}
            <TwitterShareButton
              url={shareUrl}
              title='Title'>
              <TwitterIcon size={32} round />
            </TwitterShareButton>
            {/* </div>
            <div> */}
            <WhatsappShareButton
              url={shareUrl}
              title={content.contentDescription}
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
        <Item.Group >
          {
            posts===null?
            (<Placeholder>
              <Placeholder.Header image>
                <Placeholder.Line />
                <Placeholder.Line />
              </Placeholder.Header>
            </Placeholder>):
            (
              (typeof(posts)!=='undefined')?
                (posts.items.length>0?
                  (<CentralList posts={posts.items}/>):
                  (
                    
                   <div className='imageFix'>
                     <Image centered src={`${process.env.REACT_APP_BASE_URL}/undraw_empty_xct9.png`} size='large' verticalAlign='middle' />
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

export default ContentMiddle;