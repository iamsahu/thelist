import React,{useContext, useState} from 'react';
import {Modal,Button,Form,Dropdown,Divider,Segment, Grid,Icon} from 'semantic-ui-react';
import useForm from '../util/hook';
import {useMutation, useQuery } from '@apollo/react-hooks';
import {CREATE_ITEM,INSERT_TAG_MULTI} from '../util/graphql';
import {FETCH_FEED_ITEMS,INSERT_TAG,INSERT_ITEM_OLD_TAG_MULTI} from '../util/graphql';
import UserContext from '../context/UserContext';
import ContentContext from '../context/ContentContext';
import {createItem} from '../util/graphqlExecutor';
import Tap from 'react-interactions'
import Reward from "react-rewards"
import ReactGA from 'react-ga';
import Mixpanel from '../util/mix'
import useClippy from 'use-clippy';
import gql from 'graphql-tag'

const ALL_TAGS=gql`
    query MyQuery {
        tag {
            id
            name
        }
    }
`

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
}

function isValidURL(string) {
    var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
  };

function AddItem(){
    const [content,contentChange] = useContext(ContentContext)
    const [clipboard, setClipboard] = useClippy();
    const user = useContext(UserContext)
    const [multiTag,SetMultiTag] = useState([])
    const [showModal,SetModal] = useState(false)
    const [listID,SetListID] = useState('')
    const [newItemID,SetItemID] = useState('')
    const [dropTag,SetDropTag] = useState(content.tags)
    const [dropList,SetDropList] = useState(content.lists)
    const [listDescription, setlistDescription] = useState(false)
    const [reward, setreward] = useState(null)
    const [refetch, setRefetch] = useState(false)
    //Figure out how to add content to thte dropTag
    

    const [errorList,setErrorList]=useState(false);
    const [errorLink,setErrorLink]=useState(false);
    const [errorName,setErrorName]=useState(false);
    const [errorDescription,setErrorDescription]=useState(false);
    
    
    const {values,onChange,onSubmit} = useForm(createPostCallback,{
        name:'',
        link:'',
        listDescription:'',
        description:'',
        curator:user.loggedin_user_id
    })

    // const { loading, error, data } = useQuery(ALL_TAGS,{ fetchPolicy: "network-only" })

    // if(!loading){
    //     // console.log(data)
    //     const tempArr = data.tag.map(post=>({
    //         text:post.name,
    //         key:post.name,
    //         value:post.id}))
    //     console.log(tempArr)
    // }

    function MultiTagMutation(taged_data){
        const [createTag,{errorTag}] = useMutation(INSERT_TAG_MULTI,{
            variables:taged_data,
            onError:(error,variables)=>{
                console.log(error)
                console.log(multiTag)
                console.log(variables)
            }
        });
        // console.log("Multitagmutation")
        createTag();
    }

    const updateCache = (cache, {data}) => {
        // Fetch the items from the cache
        const existingItems = cache.readQuery({
          query: FETCH_FEED_ITEMS
        });
        // Add the new item to the cache
        const newItem = data.insert_items.returning[0];
        cache.writeQuery({
          query: FETCH_FEED_ITEMS,
          data: {items: [newItem, ...existingItems.items]}
        });
        values.reason='';
        values.name='';
        values.link='';
        values.description='';
        values.data = SetItemID(newItem.id)
    };
    
    // const [createPost,{error}] = useMutation(CREATE_ITEM,{
    //     variables:{...values,list_id:listID},
    //     update:updateCache,
    //     onError:(error)=>{
    //         console.log(error)
    // }});
    
    function createPostCallback(){
        
        // console.log(content.list_id)
        var errors = false
        if(typeof(content.list_id)==='undefined')
        {
            setErrorList(true)
            errors=true
        }else{
            setErrorList(false)
        }
        if(values.name===""){
            setErrorName(true)
            errors=true
        }else{
            setErrorName(false)
        }
        if(values.link===""){
            setErrorLink(true)
            errors=true
        }else{
            if(isValidURL(values.link)||validURL(values.link)){
                setErrorLink(false)
            }else{
                setErrorLink(true)
                errors=true
            }
        }
        // if(values.description===""){
        //     setErrorDescription(true)
        //     errors=true
        // }else{
        //     setErrorDescription(false)
        // }

        if(content.contentType==='tags'){
            //If the added tag to article also has the tag with which the current content is being displayed
        }else if(content.contentType==='lists'){
            //If current list is open is the list to which the new item is being added
        }
        
        if(!errors){
            createItem({...values,
                list_id:content.list_id,
                selTags:content.selTags,
                curator_id:user.loggedin_user_id,
                tags:content.tags,
                contentType:content.contentType,
                currentListID:content.currentListID,
                currentTagID:content.currentTagID})
            .then((response,response2)=>{
                console.log(response)
                console.log(response2)
                contentChange(content=>({...content,add:'ad'}))
            })
            SetModal(false)
            reward.rewardMe();
            ReactGA.event({
                category: 'Item',
                action: 'Create',
                transport: 'beacon'
            });
            Mixpanel.track('Item Created')

            values.reason='';
            values.name='';
            values.link='';
            values.description='';
            setlistDescription(false)
        }
    }

    const handleChange = (e, { value }) => {
        contentChange(content=>({...content,selTags:value}))
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
        }else{
            setlistDescription(false)
            values.listDescription =''
        }
        contentChange(content=>({...content,list_id:value}))
        // console.log(dropList)
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
    
    function FindTagName(id){
        for(var tag in content.tags){
            if(content.tags[tag]['value']===id){
                return content.tags[tag]['text']
            }
        }
        return ''
    }

    function OnClose(){
        setErrorList(false)
        setErrorDescription(false)
        setErrorLink(false)
        setErrorName(false)
        SetModal(false)
    }

    function onClick(event){
        // console.log(clipboard)
        // if(clipboard!==''){
            

        //     if(isValidURL(clipboard)){
        //         alert({clipboard})
        //     }
        // }
        SetModal(true)
        SetDropTag(content.tags)
        // if(!loading){
        //     // console.log(data)
        //     const tempArr = data.tag.map(post=>({
        //         text:post.name,
        //         key:post.name,
        //         value:post.id}))
        //     SetDropTag(tempArr)
        // }

        SetDropList(content.lists)
    }

    
    
    return(
        <>
        <Reward ref={(ref) => { setreward(ref) }} type='confetti'>
        <Modal size='small' open={showModal} closeOnDimmerClick={false} onClose={OnClose} closeIcon trigger={<Button  floated='right' onClick={onClick}>
            <Tap scale fade waves />Add Item</Button>
            } >
            <Modal.Header>
                Add Item
            </Modal.Header>
            <Modal.Content image scrolling>
                <Form onSubmit={onSubmit} size='large' >
                    <Form.Group widths='equal'>
                        <Form.Field inline name="name">
                            <label>Title for item</label>
                            <Form.Input 
                                name='name'
                                placeholder='name' 
                                onChange={onChange}
                                value={values.name}
                                error={errorName?"Please Enter Name":false}
                                
                            />
                        </Form.Field>
                        <Form.Field inline name="link">
                            <label>Link of the item</label>
                            <Form.Input 
                                name='link'
                                placeholder='Link' 
                                onChange={onChange}
                                value={values.link}
                                error={errorLink?"Please add a link":false}
                                
                            />
                        </Form.Field>
                    </Form.Group>
                    <Form.Field inline name="description">
                        {/* <label>Description</label> */}
                        <Form.TextArea 
                            label='Description'
                            name='description' 
                            placeholder='Describe what your consumers should expect from this content'
                            style={{ minHeight: 100 }} 
                            onChange={onChange}
                            value={values.description}
                            error={errorDescription?"Please add a description":false}
                        />
                    </Form.Field>
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
                                    error={errorList}//?"Please choose a list":false}
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
                            error={errorDescription?"Please add a description":false}
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
            </Modal.Content>
        </Modal>
        </Reward>
        </>
    )
}

export default AddItem;