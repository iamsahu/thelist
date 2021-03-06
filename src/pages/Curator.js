import React,{useContext} from 'react';

import {Grid} from 'semantic-ui-react';

import ContentMiddle from '../components/ContentMiddle'
import ContentRight from '../components/ContentRight'
import CurationList from '../components/CurationList'

import UserContext from '../context/UserContext';
import ContentContext from '../context/ContentContext'

function Curator(props){
    // console.log(props)
    
    // const listid = props.match.params.listid
    const user = useContext(UserContext);
    const [content,contentChange] = useContext(ContentContext)
    var userid;
    var propSent = {}
    
    console.log(props.match.params)
    if(typeof(props.match.params)!=='undefined'){
            // console.log("here undefined")
            console.log(props.match.params.contenttype)
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

    


    // console.log(content)
    // return <div>loading</div>
    return(
        <div id="content" className="ui">
            <Grid stackable columns={3} >
                <Grid.Column width={3}>
                    <CurationList curator_id={user.curator_id} />
                </Grid.Column>
                <Grid.Column width={9}>
                    <ContentMiddle propSent={propSent}/>
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
