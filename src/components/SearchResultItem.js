import React,{useContext} from 'react'
import {Item,Image} from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import ContentContext from '../context/ContentContext';
import UserContext from '../context/UserContext';

function SearchResultItem(props){
    const user = useContext(UserContext)
    const [content,contentChange] = useContext(ContentContext)
    // console.log(props)
    return(
        <Item key={props.props.id}>
            <Item.Content>
                <Item.Header onClick={()=>{
                        contentChange(content=>({...content,currentList:props.props.list_name,
                                                            currentListID:props.props.id,
                                                            currentTagID:'',
                                                            contentType:'Lists'}))
                        user.curator_id = props.props.curator_id
                                                            }}>
                    <Link to={`/${props.props.curator_id}/lists/${props.props.id}`} >
                            {props.props.list_name}
                    </Link>
                </Item.Header>
                {/* <Item.Meta>by {props.props.user.username}</Item.Meta> */}
                <Item.Meta>by <Link to={`/${props.props.curator_id}`}>{props.props.user.username}</Link></Item.Meta>
                <Item.Description>
                {props.props.description}
                </Item.Description>
                {/* <Item.Extra>Additional Details</Item.Extra> */}
            </Item.Content>
        </Item>
    )
}

export default SearchResultItem;