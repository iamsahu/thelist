import React,{useState,useContext} from 'react'
import {GetAllTags} from '../util/graphqlExecutor'
import SearchResultItem from './SearchResultItem'
import {List} from 'semantic-ui-react'
import { Link } from 'react-router-dom';

import ContentContext from '../context/ContentContext';

function HomeTagsDisplay(){
    const [content,contentChange] = useContext(ContentContext)
    const [loading, setloading] = useState(true)
    const [searchResult, setsearchResult] = useState(null)

    const loadData = ()=>{
        GetAllTags().then((response)=>{
            setsearchResult(response)
            setloading(false)
        })
    }

    loadData()
    return(
        <>
        {
            (loading)?
            (<div>Loading</div>):
            (
                <List animated verticalAlign='middle'>
            {
                searchResult.tag.map(result=>(
                    <List.Item key={result.id}>
                        <List.Content onClick={()=>{
                            contentChange(content=>({...content,currentTag:result.name,currentTagID:result.id,currentListID:'',contentType:'tags'}))
                    }}>
                            <Link to={`/${result.user_id}/tags/${result.id}`}># {result.name}</Link>
                        </List.Content>
                    </List.Item>
                ))
            }
            </List>
            )
            
            // <SearchResultItem key={result.id} props={result}/>))
            
        }
        </>
    )

}

export default HomeTagsDisplay;