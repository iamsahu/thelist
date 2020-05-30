import React,{useContext,useState, useEffect} from 'react';

import {Grid} from 'semantic-ui-react';

import ContentMiddleNoLoad from '../components/ContentMiddle_NoLoad'
import ContentRight from '../components/ContentRight'
import CurationList from '../components/CurationList'

import UserContext from '../context/UserContext';
import ContentContext from '../context/ContentContext'

import {GetList,GetItemsUsers,GetItemsofTag,LikeList,UnlikeList,GetTagItems} from '../util/graphqlExecutor' 

function Curator(props){
    // console.log(props)
    
    // const listid = props.match.params.listid
    const user = useContext(UserContext);
    const [content,contentChange] = useContext(ContentContext)
    var userid;
    var propSent = {}
    
    // console.log(props.match.params)
    if(typeof(props.match.params)!=='undefined'){
            // console.log("here undefined")
            // console.log(props.match.params.contenttype)
            userid = props.match.params.user
            user.curator_id=userid
            if(props.match.params.contenttype==='lists'){
                content.contentType='lists'
                content.currentListID = props.match.params.contentid
                // console.log('here lists')
                if(typeof(props.match.params.contentid)==='undefined')
                propSent = {curator_id:userid,contentType:props.match.params.contenttype,contentID:''}
                else
                propSent = {curator_id:userid,contentType:props.match.params.contenttype,contentID:props.match.params.contentid}
            }else if(props.match.params.contenttype==='tags'){
                // console.log('tags')
                content.contentType='tags'
                content.currentTagID = props.match.params.contentid//Listid is used instead of tag id as we are using single way to detect the id 
                if(typeof(props.match.params.contentid)==='undefined')
                    propSent = {curator_id:userid,contentType:props.match.params.contenttype,contentID:''}
                else
                    propSent = {curator_id:userid,contentType:props.match.params.contenttype,contentID:props.match.params.contentid}
            }else if(typeof(props.match.params.contentType)==='undefined'){
                propSent = {curator_id:userid,contentType:'lists',contentID:''}
            }
            
            // console.log(propSent)
    }
    else if(typeof(props.user)!=='undefined'){
        user.curator_id = props.user
        propSent = {curator_id:props.user,contentType:'lists',contentID:''}
    }
    const [listlike, setlistlike] = useState(-1)
    const [loadState, setloadState] = useState(-1)
    const [posts,setPosts] = useState(null)
    const [header, setheader] = useState('')
    const [description, setdescription] = useState('')

    const loadData2=()=>{
        (propSent.contentType==='lists')?
          ((propSent.contentID==='')?(GetItemsUsers({curator_id:propSent.curator_id}).then((data)=>{
            setPosts(data.items)
            setloadState(1)
          })):
          (GetList({userid:propSent.curator_id,listid:propSent.contentID}).then((data)=>{
            // console.log(data)
            setPosts(data.items)
            setloadState(1)
            if(typeof(data)!=='undefined'){
              if(data.items.length>0){
                setheader(data.items[0]['list']['list_name'])
                setdescription(data.items[0]['list']['description'])
                // console.log(data.items[0]['list']['description'])
              }
            }
            if(data.like_list.length>0){//Change this to take value from latest data
              // console.log("setting likes")
              setlistlike(true)
            }else{
              setlistlike(false)
            }
          }).catch((error)=>console.log(error)))):
        (
          (propSent.contentType==='tags')?
          ((propSent.contentID==="")?(
            GetItemsUsers({curator_id:propSent.curator_id}).then((data)=>{setPosts(data.items)})
            // console.log('Tag with no all')
          ):
          (
            // GetItemsofTag({user_id:propSent.curator_id,tag_id:propSent.contentID}).then((data)=>{setPosts(data)})
            GetTagItems({user_id:propSent.curator_id,tag_id:propSent.contentID}).then((data)=>{
            //   console.log(data.tag[0]['item_tags'])
            //   var temp = data.tag[0]['item_tags'].map(item=>item.item)
            //   temp = props.posts.map(item=>item.item)
              setPosts(data.tag[0]['item_tags'])
            // setPosts(temp)
            })
            
          )):
          (console.log("Not a valid content"))
        )
      }
    
    // useEffect(()=>{
    //     loadData2()
    // })
    
    loadData2()

    // console.log(content)
    // return <div>loading</div>
    return(
        <div id="content" className="ui">
            <Grid stackable columns={3} >
                <Grid.Column width={3}>
                    <CurationList curator_id={user.curator_id} />
                </Grid.Column>
                <Grid.Column width={9}>
                    <ContentMiddleNoLoad propSent={propSent} posts={posts}/>
                </Grid.Column>
                <Grid.Column width={4}>
                    <ContentRight curator_id={user.curator_id} propSent={propSent}/>
                </Grid.Column>
            </Grid>
        </div>
    )
}

export default Curator;
//contentType={props.match.params.contenttype} contentID={props.match.params.listid}
