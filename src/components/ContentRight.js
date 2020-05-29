import React,{useContext} from 'react'
import ContentContext from '../context/ContentContext';
import UserContext from '../context/UserContext';

import ProfileCard from './ProfileCard'
import PopularProfile from './PopularProfile'
import CurationReasonCard from './CurationReasonCard'
import ListStats from './ListStats'

function ContentRight(props){
    const [content,contentChange] = useContext(ContentContext)
    const user = useContext(UserContext);
    return(
        <>
        <ProfileCard userid={props.userid}/>
        {content.contentType==="lists"?(
        <>
        <CurationReasonCard listid={content.currentListID}/>
        <ListStats/>
        </>
        )
        :(<div></div>)}
        
        {/* <PopularProfile/> */}
        </>
    )
}

export default ContentRight;