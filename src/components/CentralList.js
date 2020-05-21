import React,{useContext} from 'react';
import { render } from '@testing-library/react';
import ContentCard from './ContentCard'
import ContentContext from '../context/ContentContext';


function CentralList(props){
    const [content,contentChange] = useContext(ContentContext)
    // contentChange(content=>({...content,listdescription:props.posts[0].description}))
    // console.log(props)
    return(
        props.posts.map(post=>(<ContentCard key={post.id} postdata={post}/>))
    )
}

export default CentralList;