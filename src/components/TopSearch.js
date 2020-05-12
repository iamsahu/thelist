import _ from 'lodash'
import faker from 'faker'
import React,{useState} from 'react'
import { Search, Grid, Header, Segment } from 'semantic-ui-react'
import { useQuery } from '@apollo/react-hooks';
import {FETCH_ALL} from '../util/graphql'

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

  
    const { isLoading, value, results } = state

    return (
      
          <Search
            fluid
            loading={isLoading}
            onResultSelect={handleResultSelect}
            onSearchChange={_.debounce(handleSearchChange, 500, {
              leading: true,
            })}
            results={results}
            value={value}
            // {...props}
          />
       
    )
  
}

export default TopSearch;