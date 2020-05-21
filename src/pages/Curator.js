import React,{useContext} from 'react';

import {Grid} from 'semantic-ui-react';

import ContentMiddle from '../components/ContentMiddle'
import ContentMiddleTag from '../components/ContentMiddleTag'
import ContentRight from '../components/ContentRight'
import CurationList from '../components/CurationList'

import UserContext from '../context/UserContext';
import ContentContext from '../context/ContentContext'

function Curator(props){
    const user = useContext(UserContext);
    // const [content,contentChange] = useContext(ContentContext)
    // setUser(user=>({...user,curator_id:props.match.params.user}))
    user.curator_id=props.match.params.user
    // const userid = props.match.params.user
    // console.log('Home')
    // console.log(content);
    return(
        <div id="content" className="ui">
            <Grid columns={3} >
                <Grid.Column width={3}>
                    <CurationList />
                </Grid.Column>
                <Grid.Column width={9}>
                    {
                        // content.contentType==='Lists'?
                        <ContentMiddle userid={user.curator_id}/>
                        // (<ContentMiddleTag userid={user.curator_id}/>)
                    }
                </Grid.Column>
                <Grid.Column width={4}>
                    <ContentRight/>
                </Grid.Column>
            </Grid>
        </div>
    )
}

export default Curator;
