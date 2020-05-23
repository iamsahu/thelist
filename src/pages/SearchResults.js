import React,{useState} from 'react'
import {Search} from '../util/graphqlExecutor'
import SearchResultItem from '../components/SearchResultItem'
import {Item,Grid,Header,Divider} from 'semantic-ui-react'

function SearchResults(props){
    const [searchResult, setsearchResult] = useState(null)
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const foo = params.get('query');
    // console.log(foo)

    const loaddata =()=>{
        if(typeof(foo)!=='undefined'){
            Search({search:foo}).then((response)=>{
                // console.log(response)
                setsearchResult(response)
            })
        }
    }

    if(typeof(foo)!=='undefined'){
        loaddata()
    }

    return(
        <div id="content" className="ui">
            <Grid columns={3} >
                <Grid.Column width={3}/>
                <Grid.Column width={9}>
                    <Header as='h2'>Results for {foo}</Header>
                    <Divider/>
                    <Item.Group >
                    {
                        (searchResult!==null)?
                        (searchResult.search_lists.map(result=><SearchResultItem key={result.id} props={result}/>)):
                        ("No results")
                    }
                    </Item.Group>
                </Grid.Column>
                <Grid.Column width={4}/>
            </Grid>
        </div>
    )
}

export default SearchResults;

//<SearchResultItem key={result.id} props={result}/>