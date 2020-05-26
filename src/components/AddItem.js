import React,{useContext, useState} from 'react';
import {Modal,Button,Form,Dropdown,Divider,Segment, Grid,Icon} from 'semantic-ui-react';
import useForm from '../util/hook';
import {useMutation } from '@apollo/react-hooks';
import {CREATE_ITEM,INSERT_TAG_MULTI} from '../util/graphql';
import {FETCH_FEED_ITEMS,INSERT_TAG,INSERT_ITEM_OLD_TAG_MULTI} from '../util/graphql';
import UserContext from '../context/UserContext';
import ContentContext from '../context/ContentContext';
import {createItem} from '../util/graphqlExecutor';
import Tap from 'react-interactions'
import Reward from "react-rewards"

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
}

function AddItem(){
    const [content,contentChange] = useContext(ContentContext)
    const user = useContext(UserContext)
    const [multiTag,SetMultiTag] = useState([])
    const [showModal,SetModal] = useState(false)
    const [listID,SetListID] = useState('')
    const [newItemID,SetItemID] = useState('')
    const [dropTag,SetDropTag] = useState(content.tags)
    const [dropList,SetDropList] = useState(content.lists)
    const [listDescription, setlistDescription] = useState(false)
    const [reward, setreward] = useState(null)
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
            if(validURL(values.link)){
                setErrorLink(false)
            }else{
                setErrorLink(true)
                errors=true
            }
        }
        if(values.description===""){
            setErrorDescription(true)
            errors=true
        }else{
            setErrorDescription(false)
        }

        if(content.contentType==='tags'){
            //If the added tag to article also has the tag with which the current content is being displayed
        }else if(content.contentType==='lists'){
            //If current list is open is the list to which the new item is being added
        }
        
        if(!errors){
            createItem({...values,
                list_id:content.list_id,
                selTags:content.selTags,
                curator_id:user.curator_id,
                tags:content.tags,
                contentType:content.contentType,
                currentListID:content.currentListID,
                currentTagID:content.currentTagID})
            .then((response,response2)=>{
                // console.log(response)
                // console.log(response2)
            })
            SetModal(false)
            reward.rewardMe();
        }
    }

    const handleChange = (e, { value }) => {
        contentChange(content=>({...content,selTags:value}))
    };

    function handleAddition(e,{value}){
        console.log(value)
        if(dropTag.length>0){
            SetDropTag(dropTag=>([...dropTag,{text:value,value}]))
        }else{
            SetDropTag(dropTag=>([{text:value,value}]))
        }
    }

    const handleChangeList = (e, { value }) => {
        // console.log(e)
        // console.log(value)
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
    
    return(
        <>
        <Reward ref={(ref) => { setreward(ref) }} type='confetti'>
        <Modal open={showModal} closeOnDimmerClick={false} onClose={OnClose} closeIcon trigger={<Button onClick={()=>{
            SetModal(true)
            SetDropTag(content.tags)
            SetDropList(content.lists)
            }}>Add Item<Tap scale fade waves /></Button>} >
            <Modal.Header>
                Add Item
                {/* <Button icon position="right" onClick={()=>{
                    setErrorList(false)
                    setErrorDescription(false)
                    setErrorLink(false)
                    setErrorName(false)
                    SetModal(false)}}>
                    <Icon name='close' />
                </Button> */}
            </Modal.Header>
            <Modal.Content image scrolling>
                <Form onSubmit={onSubmit}>
                    <Form.Field inline name="name">
                        <label>Title</label>
                        <Form.Input 
                            name='name'
                            placeholder='name' 
                            onChange={onChange}
                            value={values.name}
                            error={errorName?"Please Enter Name":false}
                        />
                    </Form.Field>
                    <Form.Field inline name="link">
                        <label>Link</label>
                        <Form.Input 
                            name='link'
                            placeholder='Link' 
                            onChange={onChange}
                            value={values.link}
                            error={errorLink?"Please add a link":false}
                        />
                    </Form.Field>
                    <Form.Field inline name="description">
                        <label>Description</label>
                        <Form.TextArea 
                            name='description' 
                            placeholder='Description'
                            style={{ minHeight: 100 }} 
                            onChange={onChange}
                            value={values.description}
                            error={errorDescription?"Please add a description":false}
                        />
                    </Form.Field>
                    <Form.Field inline name="tag">
                        <label>Tags</label>
                        <Form.Input>
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
                            />
                        </Form.Input>
                    </Form.Field>
                    <label>List Name</label>
                    <Form.Input>
                        <Dropdown
                            name='list_name'
                            options={Object.values(dropList)}
                            placeholder='Choose list name'
                            search
                            selection
                            fluid
                            allowAdditions
                            onAddItem={handleChangeListAddition}
                            onChange={handleChangeList}
                            error={errorList}//?"Please choose a list":false}
                            />
                    </Form.Input>
                    {listDescription?
                        
                        <Form.Field inline name="listDescription">
                        <label>List Description</label>
                        <Form.TextArea 
                            name='listDescription' 
                            placeholder='Description'
                            style={{ minHeight: 100 }} 
                            onChange={onChange}
                            value={values.listDescription}
                            error={errorDescription?"Please add a description":false}
                        />
                        </Form.Field>
                        :<div></div>
                    }
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