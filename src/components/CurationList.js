import React,{useContext,useEffect} from 'react';
import {Divider,List,Tab} from 'semantic-ui-react'
import ContentContext from '../context/ContentContext';
import UserContext from '../context/UserContext';
import {useQuery} from '@apollo/react-hooks'
import {FETCH_TAGS,FETCH_LISTS,COMBINED_FETCH} from '../util/graphql'
import {GetTagsListsUsers} from '../util/graphqlExecutor'
import { Link } from 'react-router-dom';

function CurationList(props){
    const [content,contentChange] = useContext(ContentContext)
    const user = useContext(UserContext)
    const tagData = useQuery(COMBINED_FETCH,{variables:{user_id:user.curator_id},onCompleted:curationTags});
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
            value:post.id}))
        
        lists = tagData['data']['lists']
        const tempArr2 = lists.map(item=>({
            text:item.list_name,
            key:item.list_name,
            value:item.id,
            id:item.id,
            list_name:item.list_name,
            description:item.description,
            curator_id:item.curator_id
        }))
        // console.log(tagData)
        if(lists.length>0){
            // console.log('This was executed')
            // console.log(tagData)
            contentChange(content=>({...content,tags:tempArr,lists:tempArr2,currentList:lists[0].list_name,currentListID:lists[0].id}))
        }
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
        // console.log("lists loaded")
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const loadData=()=>{
        // console.log(user.curator_id)
        GetTagsListsUsers({curator_id:user.curator_id})
        .then((data)=>{
        })
    }
    
    //   useEffect(()=>{
    //       loadData()
    //       // contentChange(content=>({...content,listdescription: posts.items[0].description}))
    //   },[loadData]);

    function RenderTags(){
        return(
            <List animated verticalAlign='middle'>
                <List.Item key="all">
                            <List.Content onClick={()=>contentChange(content=>({...content,currentTag:"all",currentTagID:"",contentType:'tags',currentListID:''}))}>
                                <Link to={`/${user.curator_id}/tags/`}># All</Link>
                            </List.Content>
                    </List.Item>
                {
                    posts = tagData['data']['tag'],
                    
                    // content.tags = posts.map(post=>(post.name)),
                    posts && posts.map(post=>(
                        
                        <List.Item key={post.id}>
                            <List.Content onClick={()=>{contentChange(content=>({...content,currentTag:post.name,currentTagID:post.id,currentListID:'',contentType:'tags'}))
                        }}>
                                <Link to={`/${user.curator_id}/tags/${post.id}`}># {post.name}</Link>
                            </List.Content>
                        </List.Item>
                    ))
                }
            </List>
        )
    }

    function RenderLists(){
        return(
            // <div className="scrolly">
            <List animated verticalAlign='middle'>
                
                {
                    (typeof(tagData['data'])!=='undefined')?
                    (lists = tagData['data']['lists'],
                    // content.tags = lists.map(post=>(post.name)),
                    lists && lists.map(post=>(
                        <List.Item key={post.id}>
                            <List.Content onClick={()=>{contentChange(content=>({...content,currentList:post.list_name,currentListID:post.id,currentTagID:'',contentType:'lists'}))}}>
                                    <Link to={`/${user.curator_id}/lists/${post.id}`}>{post.list_name}</Link>
                            </List.Content>
                        </List.Item>
                    ))):(<div>No data</div>)
                }
                
            </List>
            // </div>
        )
    }

    return(
        <>
        {/* My Curations */}
        {/* <Divider/> */}
        {
            // (typeof(posts)!=='undefined')?
            // (posts.items.length>0?
            //   (<Tab menu={{ secondary: true, pointing: true }} panes={[
            //     {menuItem: 'Lists',render: () => <Tab.Pane>{RenderLists()} </Tab.Pane>},
            //     {menuItem: 'Tags', render: () => <Tab.Pane>{RenderTags()}</Tab.Pane> },
            //     { menuItem: 'Bookmarks', render: () => <Tab.Pane loading> Bookmarks</Tab.Pane> },
            // ]}/>):
            //   (<Tab menu={{ secondary: true, pointing: true }} panes={panes}/>)):
            //   (<Tab menu={{ secondary: true, pointing: true }} panes={panes}/>)
            
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