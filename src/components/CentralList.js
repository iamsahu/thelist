import React from 'react';
import { render } from '@testing-library/react';
import ContentCard from './ContentCard'

function CentralList(props){
    console.log(props)
    return(
        props.posts.map(post=>(<ContentCard key={post.id} postdata={post}/>))
    )
}

export default CentralList;