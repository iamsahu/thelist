import React,{useContext,useState} from 'react';

import {Grid} from 'semantic-ui-react';

import ContentMiddle from '../components/ContentMiddle'
import ContentRight from '../components/ContentRight'
import CurationList from '../components/CurationList'

import UserContext from '../context/UserContext';


function Home(){
    const user = useContext(UserContext);


    // console.log('Home')
    // console.log(content);
    return(

            <div id="content" className="ui">
                <Grid columns={3} >
                    <Grid.Column width={3}>
                        <CurationList />
                    </Grid.Column>
                    <Grid.Column width={9}>
                        <ContentMiddle/>
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <ContentRight/>
                    </Grid.Column>
                </Grid>
            </div>

    )
}

export default Home;
