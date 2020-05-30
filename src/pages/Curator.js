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
    if(typeof(props.user)!=='undefined'){
        user.curator_id = props.user
        propSent = {curator_id:props.user}
    }
    else
    if(typeof(props.match.params)!=='undefined'){
            // console.log("here undefined")
            userid = props.match.params.user
            user.curator_id=userid
            if(props.match.params.contenttype==='lists'){
                content.contentType='lists'
                content.currentListID = props.match.params.listid
                // console.log('here lists')
            }else if(props.match.params.contenttype==='tags'){
                content.contentType='tags'
                content.currentTagID = props.match.params.listid//Listid is used instead of tag id as we are using single way to detect the id 
            }
            propSent = {curator_id:userid,contentType:props.match.params.contenttype,contentID:props.match.params.listid}
    }
    console.log(content)
    // return <div>loading</div>
    return(
        <div id="content" className="ui">
            <Grid stackable columns={3} >
                <Grid.Column width={3}>
                    <CurationList curator_id={user.curator_id} />
                </Grid.Column>
                <Grid.Column width={9}>
                    <ContentMiddle curator_id={user.curator_id} propSent={propSent}/>
                </Grid.Column>
                <Grid.Column width={4}>
                    <ContentRight curator_id={user.curator_id}/>
                </Grid.Column>
            </Grid>
        </div>
    )
}

export default Curator;
//contentType={props.match.params.contenttype} contentID={props.match.params.listid}
