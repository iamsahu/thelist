import React,{useContext} from 'react'
import {Card} from 'semantic-ui-react'
import ContentContext from '../context/ContentContext';
import UserContext from '../context/UserContext';
import {GetListDescription} from '../util/graphqlExecutor'

function CurationReasonCard(props){
    const [content,contentChange] = useContext(ContentContext)
    const user = useContext(UserContext);
    return(
        <>
        <Card fluid>
            <Card.Content header='My Reason for this curation' />
            <Card.Content description={content.listdescription} />
        </Card>
        </>
    )
}

export default CurationReasonCard;