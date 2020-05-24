import _ from 'lodash'
import faker from 'faker'
import React,{useState} from 'react'
import { Search, Grid, Header, Segment,Input } from 'semantic-ui-react'
import { useQuery } from '@apollo/react-hooks';
import {FETCH_ALL} from '../util/graphql'
import { useHistory } from 'react-router-dom';

const source = _.times(5, () => ({
  title: faker.company.companyName(),
  description: faker.company.catchPhrase(),
  image: faker.internet.avatar(),
  price: faker.finance.amount(0, 100, 2, '$'),
}))

const initialState = { isLoading: false, results: [], value: '' }

function TopSearch() {
  const [state,setState] = useState(initialState)
  const { loading, error, data } = useQuery(FETCH_ALL);
  const [searchquery, setsearchquery] = useState('')
  const history = useHistory();
  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  const handleResultSelect = (e, { result }) => setState({ value: result.title })

  const handleSearchChange = (e, { value }) => {
    setState({ isLoading: true, value })

    setTimeout(() => {
      if (state.value.length < 1) return setState(initialState)

      const re = new RegExp(_.escapeRegExp(state.value), 'i')
      const isMatch = (result) => re.test(result.title)

      setState({
        isLoading: false,
        results: _.filter(source, isMatch),
      })
    }, 300)
  }

  function KeyPress(ev){
    if(ev.key==='Enter'){
      // console.log("EnterKey!!")
      if(searchquery!==""){
        routeChange()
      }
    }
  }

  function ChangeHandle(event,data){
    // console.log(event)
    // console.log(data)
    setsearchquery(data.value)
  }

  function routeChange() {
    let path = `/search?query=${searchquery}`;
    history.push(path);
  }

  const { isLoading, value, results } = state

  return (
    <Input size='small' icon='search' placeholder='You find what you look for' onKeyPress={KeyPress} onChange={ChangeHandle}/>
        // <Search
        //   fluid
        //   loading={isLoading}
        //   onResultSelect={handleResultSelect}
        //   onSearchChange={_.debounce(handleSearchChange, 500, {
        //     leading: true,
        //   })}
        //   results={results}
        //   value={value}
        //   // {...props}
        // />
      
  )
  
}

export default TopSearch;