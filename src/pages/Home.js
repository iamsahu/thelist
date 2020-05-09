import React,{useContext,useState} from 'react';
import { useQuery } from '@apollo/react-hooks';
import {Grid,Segment,Placeholder} from 'semantic-ui-react';
import SearchLeft from '../components/SearchLeft'
import ContentMiddle from '../components/ContentMiddle'
import ContentRight from '../components/ContentRight'
import CurationList from '../components/CurationList'

import UserContext from '../context/UserContext';
import {ContentProvider} from '../context/ContentContext';

function Home(){
    const user = useContext(UserContext);
    const [contentTag,contentChange] = useState({currentTag:'None'})//Passing a function so that the consumer can change the contentTag
    console.log('Home')
    console.log(contentTag);
    return(
        <ContentProvider value={[contentTag,contentChange]}>
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
        </ContentProvider>
    )
}

export default Home;
