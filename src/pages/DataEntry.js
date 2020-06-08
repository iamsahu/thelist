import React,{ useState} from 'react';
import {Button,Form,Dropdown,Divider} from 'semantic-ui-react';
import useForm from '../util/hook';
// import {useMutation, useQuery } from '@apollo/react-hooks';
// import {CREATE_ITEM,INSERT_TAG_MULTI} from '../util/graphql';
// import {FETCH_FEED_ITEMS,INSERT_TAG,INSERT_ITEM_OLD_TAG_MULTI} from '../util/graphql';
// import UserContext from '../context/UserContext';
// import ContentContext from '../context/ContentContext';
import {createItem} from '../util/graphqlExecutor';
// import Tap from 'react-interactions'
// import Reward from "react-rewards"
// import ReactGA from 'react-ga';
// import Mixpanel from '../util/mix'
// import useClippy from 'use-clippy';
import gql from 'graphql-tag'
import {GetAllUsers,GetTagsListsUsers} from '../util/graphqlExecutor'
// import {COMBINED_FETCH} from '../util/graphql'

const GETLISTSOFUSER=gql`
    query MyQuery($user_id:String) {
        lists(where: {curator_id: {_eq: $user_id}}) {
            curator_id
            id
            list_name
        }
  }
`

function DataEntry(){
    const [listDescription, setlistDescription] = useState(false)
    const [dropTag,SetDropTag] = useState('')
    const [dropList,SetDropList] = useState('')
    const [dropUsers, setdropUsers] = useState('')
    const [seltags, setseltags] = useState('')
    const [list_id, setlist_id] = useState('')
    const [currentUser, setcurrentUser] = useState('')
    const [allTags, setallTags] = useState('')
    var listID;
    
    const {values,onChange,onSubmit} = useForm(createPostCallback,{
        name:'',
        link:'',
        listDescription:'',
        description:'',
        curator:''
    })

    const loadData = ()=>{
        GetAllUsers().then((response)=>{
            const temp =response.user.map(user=>({
                        text:user.username,
                        key:user.username,
                        value:user.id
                })
            )
            setdropUsers(temp)
        })
        // GetAllTags().then((response)=>{
        //     const temp =response.user.map(user=>({
        //         text:user.username,
        //         key:user.username,
        //         value:user.id
        //         })
        //     )
        //     SetDropTag(temp)
        // })
    }
    if(dropUsers==='')
        loadData()

    const loadListsOfUser = (id)=>{
        GetTagsListsUsers({curator_id:id}).then((data)=>{
            // console.log(data)
            const tempArr = data.tag.map(post=>({
                text:post.name,
                key:post.name,
                value:post.id}))
            
            // lists = tagData['data']['lists']
            const tempArr2 = data.lists.map(item=>({
                text:item.list_name,
                key:item.list_name,
                value:item.id,
                id:item.id,
                list_name:item.list_name,
                description:item.description,
                curator_id:item.curator_id
            }))
            // console.log(tempArr)
            // console.log(tempArr2)
            SetDropList(tempArr2)
            SetDropTag(tempArr)
            setallTags(tempArr)
        })
    }

    const handleChange = (e, { value }) => {
        // contentChange(content=>({...content,selTags:value}))
        setseltags(value)
    };

    function handleAddition(e,{value}){
        // console.log(value)
        if(dropTag.length>0){
            SetDropTag(dropTag=>([...dropTag,{text:value,value}]))
        }else{
            SetDropTag(dropTag=>([{text:value,value}]))
        }
    }

    const handleChangeList = (e, { value }) => {
        // console.log(e)
        // console.log(value)
        if(!(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value))){
            setlistDescription(true)
            listID=''
        }else{
            setlistDescription(false)
            listID=value
            values.listDescription =''
        }
        // contentChange(content=>({...content,list_id:value}))
        // console.log(dropList)
        setlist_id(value)
    };

    function handleChangeListAddition(e,{value}){
        // console.log(e)
        // console.log(value)
        if(!(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value))){
            setlistDescription(true)
        }else{
            setlistDescription(false)
            values.listDescription =''
        }
        if(dropList.length>0){
            SetDropList(dropList=>([...dropList,{text:value,value}]))
        }else{
            SetDropList(dropList=>([{text:value,value}]))
        }
    }

    function handleUserChange(e,{value}){
        // console.log(value)
        setcurrentUser(value)
        loadListsOfUser(value)
    }
    function createPostCallback(){
        createItem({...values,
            list_id:list_id,
            selTags:seltags,
            curator_id:currentUser,
            tags:allTags,
            contentType:'dataentry',
            currentListID:'',
            currentTagID:''
            })
        .then((response,response2)=>{
            // console.log(response)
            // console.log(response2)  
        }).catch((error)=>{
            console.log(error)
        })
        values.reason='';
        values.name='';
        values.link='';
        values.description='';
        setlistDescription(false)
    }
    return(
        <div className="scrollEntry">
            <Form onSubmit={onSubmit} size='large' >
            <Form.Group widths='equal'>
                <Form.Field inline name="name">
                    <label>Title for item</label>
                    <Form.Input 
                        name='name'
                        placeholder='name' 
                        onChange={onChange}
                        value={values.name}
                        
                        
                    />
                </Form.Field>
                <Form.Field inline name="link">
                    <label>Link of the item</label>
                    <Form.Input 
                        name='link'
                        placeholder='Link' 
                        onChange={(e,{value})=>{
                            onChange(e)
                            }}
                        value={values.link}
                        
                        
                    />
                </Form.Field>
            </Form.Group>
            <Form.Field inline name="description">
                {/* <label>Description</label> */}
                <Form.TextArea 
                    label='Description'
                    name='description' 
                    placeholder='Describe what your consumers should expect from this content. (If you are feeling lazy leave this upto us)'
                    style={{ minHeight: 100 }} 
                    onChange={onChange}
                    value={values.description}
                    
                />
            </Form.Field>
            <Form.Group >
                <Form.Field inline name="user">
                    <label>User</label>
                    <Form.Input>
                        {/* {loading?<Dropdown text='Dropdown' loading />: */}
                        <Dropdown
                            name='user'
                            options={Object.values(dropUsers)}
                            placeholder='User'
                            search
                            selection
                            fluid
                            
                            onChange={handleUserChange}
                            upward
                        />
                        {/* } */}
                    </Form.Input>
                </Form.Field>
                
            </Form.Group>
            <Form.Group >
                <Form.Field inline name="tag">
                    <label>Tags</label>
                    <Form.Input>
                        {/* {loading?<Dropdown text='Dropdown' loading />: */}
                        <Dropdown
                            name='tag'
                            options={Object.values(dropTag)}
                            placeholder='Tags'
                            search
                            selection
                            fluid
                            multiple
                            allowAdditions
                            // value={currentValues}
                            onAddItem={handleAddition}
                            onChange={handleChange}
                            upward
                        />
                        {/* } */}
                    </Form.Input>
                </Form.Field>
                
            </Form.Group>
            <Divider/>
            <Form.Group>
                <Form.Field inline name="listname">
                    <label>List Name</label>
                    <Form.Input >
                        <Dropdown
                            label='List Name'
                            name='list_name'
                            options={Object.values(dropList)}
                            placeholder='Choose list name'
                            search
                            selection
                            upward
                            allowAdditions
                            onAddItem={handleChangeListAddition}
                            onChange={handleChangeList}
                            
                            />
                    </Form.Input>
                </Form.Field>
                {listDescription?
                <Form.Field inline name="listDescription">
                <label>List Description</label>
                <Form.TextArea 
                    name='listDescription' 
                    placeholder='Write about why are you creating this list'
                    style={{ minHeight: 100 }} 
                    onChange={onChange}
                    value={values.listDescription}
                    
                />
                </Form.Field>
                :<div></div>
            }
            </Form.Group>
            
            <br/>
            <Button primary type='submit' >
                Submit
            </Button>
        </Form>
        </div>
    )
}

export default DataEntry
