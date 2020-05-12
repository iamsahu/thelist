import React,{useContext} from 'react';
import {Divider,List,Tab} from 'semantic-ui-react'
import ContentContext from '../context/ContentContext';
import UserContext from '../context/UserContext';
import {useQuery} from '@apollo/react-hooks'
import {FETCH_TAGS,FETCH_LISTS,COMBINED_FETCH} from '../util/graphql'

function CurationList(){
    const [content,contentChange] = useContext(ContentContext)
    const user = useContext(UserContext)
    const tagData = useQuery(COMBINED_FETCH,{variables:{user_id:user.loggedin_user_id},onCompleted:curationTags});
    const loading = tagData['loading']
    // const loadingList =listData['loading']
    // console.log(listData)
    var posts;
    var lists;
    const panes = [
        { menuItem: 'Lists',render: () => <Tab.Pane loading>Lists</Tab.Pane>},
        { menuItem: 'Tags', render: () => <Tab.Pane loading> Tags</Tab.Pane> },
        { menuItem: 'Bookmarks', render: () => <Tab.Pane loading> Bookmarks</Tab.Pane> },
      ]
    
    function curationTags(){
        posts = tagData['data']['tag']
        const tempArr = posts.map(post=>({
            text:post.name,
            key:post.name,
            value:post.name}))
        
        lists = tagData['data']['lists']
        const tempArr2 = lists.map(item=>({
            text:item.list_name,
            key:item.list_name,
            value:item.list_name,
            id:item.id,
            list_name:item.list_name,
            description:item.description,
            curator_id:item.curator_id
        }))

        contentChange({tags:tempArr,lists:tempArr2,currentList:lists[0].list_name})
        // curationLists()
    }

    function curationLists(){
        lists = tagData['data']['lists']
        const tempArr = lists.map(item=>({
            id:item.id,
            list_name:item.list_name,
            description:item.description,
            curator_id:item.curator_id
        }))
        contentChange({lists:tempArr})
        console.log("lists loaded")
    }

    function RenderTags(){
        return(
            <List animated verticalAlign='middle'>
                <List.Item key="all">
                            <List.Content as='a' onClick={()=>contentChange(content=>({...content,currentTag:"all"}))}>
                                # All
                            </List.Content>
                    </List.Item>
                {
                    posts = tagData['data']['tag'],
                    
                    // content.tags = posts.map(post=>(post.name)),
                    posts && posts.map(post=>(
                        <List.Item key={post.id}>
                            <List.Content as='a' onClick={()=>contentChange(content=>({...content,currentTag:post.name,currentTagID:post.id}))}>
                                # {post.name}
                            </List.Content>
                        </List.Item>
                    ))
                }
            </List>
        )
    }

    function RenderLists(){
        return(
            <List animated verticalAlign='middle'>
                {
                    lists = tagData['data']['lists'],
                    // content.tags = lists.map(post=>(post.name)),
                    lists && lists.map(post=>(
                        <List.Item key={post.id}>
                            <List.Content as='a' onClick={()=>contentChange(content=>({...content,currentList:post.list_name,currentListID:post.id}))}>
                                # {post.list_name}
                            </List.Content>
                        </List.Item>
                    ))
                }
            </List>
        )
    }

    return(
        <>
        {/* My Curations */}
        {/* <Divider/> */}
        {
            (loading)?(
                <Tab menu={{ secondary: true, pointing: true }} panes={panes}/>
            ):(
                // console.log(tagData['data']),
                <Tab menu={{ secondary: true, pointing: true }} panes={[
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