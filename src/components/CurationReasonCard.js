import React,{useContext} from 'react'
import {Card} from 'semantic-ui-react'
import ContentContext from '../context/ContentContext';
import UserContext from '../context/UserContext';

function CurationReasonCard(props){
    const [contentTag,contentChange] = useContext(ContentContext)
    const user = useContext(UserContext);
    return(
        <>
        <Card fluid>
            <Card.Content header='My Reason for this curation' />
            <Card.Content description="Blockchain is something that I find fascinating and I believe is something that is going to change how businesses are modeled in the future. I curate this list to keep track of technological development happening in this area and new businesses I find running on this technology" />
        </Card>
        </>
    )
}

export default CurationReasonCard;