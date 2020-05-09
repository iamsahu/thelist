import React,{useContext} from 'react';
import {Divider,List} from 'semantic-ui-react'
import ContentContext from '../context/ContentContext';
import UserContext from '../context/UserContext';
import {useQuery} from '@apollo/react-hooks'
import {FETCH_TAGS} from '../util/graphql'

function CurationList(){
    const [contentTag,contentChange] = useContext(ContentContext)
    const user = useContext(UserContext)
    const temp = useQuery(FETCH_TAGS);
    const loading = temp['loading']
    var posts;
    
    return(
        <>
        My Curations
        <Divider/>
        {<List animated verticalAlign='middle'>
            {loading?(
                <h1>Loading!!</h1>
            ):(
                
                    posts = temp['data']['tag'],
                    posts && posts.map(post=>(
                        <List.Item key={post.id}>
                            <List.Content as='a' onClick={()=>contentChange(contentTag=>({...contentTag,currentTag:post.name}))}>
                                # {post.name}
                            </List.Content>
                        </List.Item>
                    ))
                
            )}
            </List>
            
        }
        </>
    )
}

export default CurationList;