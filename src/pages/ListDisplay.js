// import React,{useContext,useState} from 'react';
// import {Grid} from 'semantic-ui-react'
// import ContentRight from '../components/ContentRight'
// import ContentMiddleListOnly from '../components/ContentMiddleListOnly'

// function ListDisplay(props){
//     const userid = props.match.params.user
//     const listid = props.match.params.listid
//     return (
//         <div id="content" className="ui">
//             <Grid columns={3} >
//                 <Grid.Column width={3}>
//                     </Grid.Column>
//                 <Grid.Column width={9}>
//                     <ContentMiddleListOnly userid={userid} listid={listid}/>
//                 </Grid.Column>
//                 <Grid.Column width={4}>
//                     <ContentRight userid={userid} listid={listid}/>
//                 </Grid.Column>
//             </Grid>
//         </div>
//     )
// }

// export default ListDisplay;

import React,{useContext,useState} from 'react';

import {Grid} from 'semantic-ui-react';

import ContentMiddle from '../components/ContentMiddle'
import ContentRight from '../components/ContentRight'
import CurationList from '../components/CurationList'

import UserContext from '../context/UserContext';
import ContentContext from '../context/ContentContext'

function ListDisplay(props){
    const userid = props.match.params.user
    const listid = props.match.params.listid
    const user = useContext(UserContext);
    const [content,contentChange] = useContext(ContentContext)
    user.curator_id=userid
    content.contentType='Lists'
    content.currentListID = listid

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

export default ListDisplay;
