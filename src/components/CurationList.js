import React,{useContext} from 'react';
import {Divider,List,Tab} from 'semantic-ui-react'
import ContentContext from '../context/ContentContext';
import UserContext from '../context/UserContext';
import {useQuery} from '@apollo/react-hooks'
import {FETCH_TAGS} from '../util/graphql'

function CurationList(){
    const [content,contentChange] = useContext(ContentContext)
    const user = useContext(UserContext)
    const tagData = useQuery(FETCH_TAGS,{variables:{user_id:user.loggedin_user_id},onCompleted:curationTags
        
    });
    const loading = tagData['loading']
    var posts;
    
    const panes = [
        {
          menuItem: 'Lists',
          render: () => <Tab.Pane loading>Lists</Tab.Pane>,
        },
        { menuItem: 'Tags', render: () => <Tab.Pane loading> Tags</Tab.Pane> },
        { menuItem: 'Bookmarks', render: () => <Tab.Pane loading> Bookmarks</Tab.Pane> },
      ]
    
    function curationTags(){
        posts = tagData['data']['tag']
        const tempArr = posts.map(post=>({text:post.name,key:post.name,value:post.name}))
        // console.log("Curation Tags")
        // console.log(tempArr)
        contentChange({tags:tempArr})
    }


    function RenderTags(){
        return(
            <List animated verticalAlign='middle'>
                {
                    posts = tagData['data']['tag'],
                    // content.tags = posts.map(post=>(post.name)),
                    posts && posts.map(post=>(
                        <List.Item key={post.id}>
                            <List.Content as='a' onClick={()=>contentChange(content=>({...content,currentTag:post.name}))}>
                                # {post.name}
                            </List.Content>
                        </List.Item>
                    ))
                }
            </List>
        )
    }

    function RenderLists(){
        return(<div></div>)
    }

    return(
        <>
        My Curations
        {/* <Divider/> */}
        {
            loading?(
                <Tab panes={panes}/>
            ):(
                // console.log(tagData['data']),
                <Tab panes={[
                    {menuItem: 'Lists',render: () => <Tab.Pane>{RenderLists()} </Tab.Pane>},
                    {menuItem: 'Tags', render: () => <Tab.Pane>{RenderTags()}</Tab.Pane> },
                    { menuItem: 'Bookmarks', render: () => <Tab.Pane loading> Bookmarks</Tab.Pane> },
                ]}/>
            )
        }
        </>
    )
}

export default CurationList;