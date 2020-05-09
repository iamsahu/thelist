import React from 'react'
import {List,Divider} from 'semantic-ui-react'

import ProfileListItem from './ProfileListItem';

function PopularProfile(){
    return(
        <>
        Popular curations 
        <Divider/>
        <List>
            <ProfileListItem/>
            <ProfileListItem/>
            <ProfileListItem/>
        </List>
        </>
    )
}

export default PopularProfile;