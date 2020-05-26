import React,{useState} from 'react'
import {GetAllLists} from '../util/graphqlExecutor'
import SearchResultItem from './SearchResultItem'
import {Item} from 'semantic-ui-react'

function HomeListsDisplay(){
    const [loading, setloading] = useState(true)
    const [searchResult, setsearchResult] = useState(null)

    const loadData = ()=>{
        GetAllLists().then((response)=>{
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
            (<Item.Group >{
            (searchResult.lists.map(result=><SearchResultItem key={result.id} props={result}/>))
            }</Item.Group>
            )
        }
        </>
    )

}

export default HomeListsDisplay;