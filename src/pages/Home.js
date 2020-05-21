import React,{useContext,useState} from 'react';

import {Grid} from 'semantic-ui-react';

import ContentMiddle from '../components/ContentMiddle'
import ContentRight from '../components/ContentRight'
import CurationList from '../components/CurationList'

import UserContext from '../context/UserContext';
import ContentContext from '../context/ContentContext'

function Home(){
    const user = useContext(UserContext);
    const [content] = useContext(ContentContext)
    
    // console.log('Home')
    // console.log(content);
    // console.log(user.curator_id)
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

export default Home;
