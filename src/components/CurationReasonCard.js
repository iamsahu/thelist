import React,{useContext, useState} from 'react'
import {Card} from 'semantic-ui-react'
import ContentContext from '../context/ContentContext';
import {GetListDescription} from '../util/graphqlExecutor'

function CurationReasonCard(props){
    const [content] = useContext(ContentContext)

    const [description,setDescription] = useState('')

    const loadData=()=>{
        GetListDescription({listid:content.currentListID}).then((response)=>{
            // console.log(response)
            if(typeof(response)!=='undefined')
            {setDescription(response.lists[0].description)}
        }).catch((error)=>console.log(error))
    }

    if(content.currentListID!==''){
        loadData()
    }
    return(
        <>
        <Card fluid>
            <Card.Content header='My Reason for this curation' />
            <Card.Content description={description} />
        </Card>
        </>
    )
}

export default CurationReasonCard;