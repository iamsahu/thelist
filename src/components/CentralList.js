import React,{useContext} from 'react';
import { render } from '@testing-library/react';
import ContentCard from './ContentCard'
import ContentContext from '../context/ContentContext';


function CentralList(props){
    const [content,contentChange] = useContext(ContentContext)
    // contentChange(content=>({...content,listdescription:props.posts[0].description}))
    // console.log(props)
    var temp ={}

    if(typeof(props.posts)==='undefined')
        return <div></div>
    if(props.contentType==='tags'){
        // console.log(typeof(props.posts[0]))
        // console.log(props.posts[0].__typename)
        switch (props.posts[0].__typename) {
            case 'items':
                temp=props.posts
                break;
            case 'item_tag':
                // console.log(props.posts)
                temp = props.posts.map(item=>item.item)
                // console.log(temp)
                break;
            default:
                break;
        }
        
        // console.log(temp)
    }
    else
        temp=props.posts

    return(
        temp.map(post=>(<ContentCard key={post.id} postdata={post} contentType={props.contentType} contentID={props.contentID}/>))
    )
}

export default CentralList;