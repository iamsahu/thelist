import React,{useContext} from 'react'
import ContentContext from '../context/ContentContext';
import UserContext from '../context/UserContext';

import ProfileCard from './ProfileCard'
import PopularProfile from './PopularProfile'
import CurationReasonCard from './CurationReasonCard'

function ContentRight(){
    const [contentTag,contentChange] = useContext(ContentContext)
    const user = useContext(UserContext);
    return(
        <>
        <ProfileCard/>
        <CurationReasonCard/>
        {/* <PopularProfile/> */}
        </>
    )
}

export default ContentRight;