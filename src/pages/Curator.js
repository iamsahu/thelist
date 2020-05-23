import React,{useContext,useState} from 'react';

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
    // user.curator_id=userid
    // content.contentType='Lists'
    // content.currentListID = listid
    // console.log('Home')
    // console.log(content);
    // console.log(user.curator_id)
    // console.log(typeof(props.match.params.length))
    var userid,listid,tagid;
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
    }
    // console.log(content)

    // content.contentType='Tags'
    // content.currentTagID = tagid
    return(
        <div id="content" className="ui">
            <Grid columns={3} >
                <Grid.Column width={3}>
                    <CurationList curator_id={user.curator_id}/>
                </Grid.Column>
                <Grid.Column width={9}>
                    {
                        <ContentMiddle curator_id={user.curator_id}/>
                    }
                </Grid.Column>
                <Grid.Column width={4}>
                    <ContentRight curator_id={user.curator_id}/>
                </Grid.Column>
            </Grid>
        </div>
    )
}

export default Curator;
