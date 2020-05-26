import React,{useContext,useState} from 'react';

import {Card,Grid, Divider,Header,Message,Container} from 'semantic-ui-react';

import ContentMiddle from '../components/ContentMiddle'
import ContentRight from '../components/ContentRight'
import CurationList from '../components/CurationList'
import PopularProfile from '../components/PopularProfile'
import HomeListsDisplay from '../components/HomeListsDisplay'
import HomeTagsDisplay from '../components/HomeTagsDisplay'

import UserContext from '../context/UserContext';
import ContentContext from '../context/ContentContext'

import {GetTagsListsUsers} from '../util/graphqlExecutor'

function Home(props){
    // console.log(props.match.params)
    
    // const listid = props.match.params.listid
    const user = useContext(UserContext);
    const [content,contentChange] = useContext(ContentContext)
    const [welcomeBox, setwelcomeBox] = useState(true)
    // user.curator_id=userid
    // content.contentType='Lists'
    // content.currentListID = listid
    // console.log('Home')
    // console.log(content);
    // console.log(user.curator_id)
    // var userid,listid,tagid;
    // if(typeof(props.match.params.length)!=='undefined'){
    //     userid = props.match.params.user
    //     user.curator_id=userid
    //     if(props.match.params.contenttype==='lists'){
    //         content.contentType='Lists'
    //         listid = props.match.params.listid
    //     }else if(props.match.params.contenttype==='tags'){
    //         content.contentType='Tags'
    //         tagid = props.match.params.tagid
    //     }
    // }

    const loadData=()=>{
        // console.log(user.curator_id)
        GetTagsListsUsers({curator_id:user.curator_id})
        .then((data)=>{
            // console.log(data)
            // posts = tagData['data']['tag']
        const tempArr = data.lists.map(post=>({
            text:post.name,
            key:post.name,
            value:post.id}))
        
        // lists = tagData['data']['lists']
        const tempArr2 = data.tag.map(item=>({
            text:item.list_name,
            key:item.list_name,
            value:item.id,
            id:item.id,
            list_name:item.list_name,
            description:item.description,
            curator_id:item.curator_id
        }))
        // console.log(tagData)
        if(data.lists.length>0){
            // console.log('This was executed')
            // console.log(tagData)
            // contentChange(content=>({...content,tags:tempArr,lists:tempArr2}))
        }
        })
    }

    loadData()

    function handleDismiss(){
        setwelcomeBox(false)
    }
    
    const items=[
        'List Space is a place where you can curate digital content from multiple sources in one place to share.',
        'You can also find interesting curations done by our selection of tastemakers.',
        'Browse content by lists or find interesting tags to browse.'
    ]

    // content.contentType='Tags'
    // content.currentTagID = tagid
    return(
        <div id="content" className="ui">
            {(welcomeBox)?
            (
                <Message onDismiss={handleDismiss}>
                    <Message.Header>Welcome to List Space</Message.Header>
                    <Message.List items={items}/>
                </Message>
            ):(<div></div>)
            }
            <Grid columns={3} >
                <Grid.Column width={3}>
                <Header as='h3'>Tags</Header>
                    <Divider/>
                    <HomeTagsDisplay/>
                </Grid.Column>
                <Grid.Column width={9}>
                    {/*  */}
                    <Header as='h3'>Lists</Header>
                    <Divider/>
                    <HomeListsDisplay/>
                </Grid.Column>
                <Grid.Column width={4}>
                <Header as='h3'>Curators</Header>
                    <Divider/>
                    <PopularProfile/>
                </Grid.Column>
            </Grid>
        </div>
    )
}

export default Home;
