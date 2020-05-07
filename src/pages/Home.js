import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import {Grid,Segment,Placeholder} from 'semantic-ui-react';
import SearchLeft from '../components/SearchLeft'
import ContentMiddle from '../components/ContentMiddle'
import ContentRight from '../components/ContentRight'

function Home(){
    return(
        <div id="content" className="ui">
        <Grid columns={3} >
            <Grid.Column width={3}>
                <SearchLeft/>
            </Grid.Column>
            <Grid.Column width={9}>
                <ContentMiddle/>
            </Grid.Column>
            <Grid.Column width={3}>
                <ContentRight/>
            </Grid.Column>
      </Grid>
      </div>
    )
}

export default Home;