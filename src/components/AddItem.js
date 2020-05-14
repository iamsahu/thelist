import React,{useContext, useState} from 'react';
import {Modal,Button,Form,Dropdown,Divider,Segment, Grid,Icon} from 'semantic-ui-react';
import useForm from '../util/hook';
import {useMutation } from '@apollo/react-hooks';
import {CREATE_ITEM,INSERT_TAG_MULTI} from '../util/graphql';
import {FETCH_FEED_ITEMS,INSERT_TAG,INSERT_ITEM_OLD_TAG_MULTI} from '../util/graphql';
import UserContext from '../context/UserContext';
import ContentContext from '../context/ContentContext';
import {createItem} from '../util/graphqlExecutor';

function AddItem(){
    const [content,contentChange] = useContext(ContentContext)
    const user = useContext(UserContext)
    const [dropTag,SetDropTag] = useState(content.tags)
    const [multiTag,SetMultiTag] = useState([])
    const [showModal,SetModal] = useState(false)
    const [listID,SetListID] = useState('')
    const [newItemID,SetItemID] = useState('')
    const [dropList,SetDropList] = useState(content.lists)
    
    // SetDropTag(content.tags)
    // console.log(user.loggedin_user_id)
    var tagSelection;
    var tagSelectionFinal={};

    const {values,onChange,onSubmit} = useForm(createPostCallback,{
        name:'',
        link:'',
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
        console.log("Multitagmutation")
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
        values.data = 
        SetItemID(newItem.id)
        
    };
    
    const [createPost,{error}] = useMutation(CREATE_ITEM,{
        variables:{...values,list_id:listID},
        update:updateCache,
        onError:(error)=>{
            console.log(error)
    }});
    
    function createPostCallback(){
        createItem({...values,list_id:content.list_id,selTags:content.selTags,loggedin_user_id:user.loggedin_user_id,tags:content.tags})
        .then((response,response2)=>{
            console.log(response)
            console.log(response2)
        })
        SetModal(false)
    }

    const handleChange = (e, { value }) => {
        contentChange(content=>({...content,selTags:value}))
    };

    function handleAddition(e,{value}){
        console.log(value)
        SetDropTag(dropTag=>([...dropTag,{text:value,value}]))
    }

    const handleChangeList = (e, { value }) => {
        console.log(e)
        console.log(value)
        // SetListID(value)
        contentChange(content=>({...content,list_id:value}))
        console.log(dropList)
        // SetDropList(dropList=>([...dropList,{text:value,value}]))
        
    };

    function handleChangeListAddition(e,{value}){
        console.log(e)
        console.log(value)
        SetDropList(dropList=>([...dropList,{text:value,value}]))
    }
    
    function FindTagName(id){
        for(var tag in content.tags){
            if(content.tags[tag]['value']===id){
                return content.tags[tag]['text']
            }
        }
        return ''
    }
    
    return(
        <>
        <Modal open={showModal} trigger={<div className='icobutton'><Button onClick={()=>SetModal(true)}>Add Item</Button></div>} >
            <Modal.Header>
                Add Item
                <Button icon position="right" onClick={()=>SetModal(false)}>
                    <Icon name='close' />
                </Button>
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
                            error={error?true:false}
                        />
                    </Form.Field>
                    <Form.Field inline name="link">
                        <label>Link</label>
                        <Form.Input 
                            name='link'
                            placeholder='Link' 
                            onChange={onChange}
                            value={values.link}
                            error={error?true:false}
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
                            error={error?true:false}
                        />
                            
                        {/* <Form.Input 
                            name='description' 
                            placeholder='Description'
                            
                        /> */}
                    </Form.Field>                    
                        {/* <Grid columns={2} relaxed='very' stackable>
                            <Grid.Column> */}
                                {/* <Segment placeholder> */}
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
                                            {/* <Dropdown
                                                name='tag'
                                                placeholder='Tags'
                                                fluid
                                                multiple
                                                search
                                                selection
                                                options={Object.values(content.tags)}
                                                onChange={handleChange}
                                                // value={values.tag}
                                            /> */}
                                        </Form.Input>
                                </Form.Field>
                                {/* <Divider horizontal>Or</Divider>
                                <Form.Field inline name="tag">
                                        <Form.Input
                                            // icon='tags'
                                            // iconPosition='left'
                                            // label={{ tag: true, content: 'Add Tag' }}
                                            labelPosition='right'
                                            name='tag'
                                            placeholder='Enter new tags'
                                            onChange={handleChange}
                                            // value={values.tag}
                                            // errorTag={errorTag?true:false}
                                        /> 
                                    </Form.Field>
                                    </Segment> */}
                            {/* </Grid.Column>
                            <Grid.Column> */}
                                {/* <Segment placeholder><Form.Field> */}
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
                                            />
                                        {/* <Dropdown
                                            name='list_name'
                                            placeholder='Choose list name'
                                            fluid
                                            search
                                            selection
                                            options={Object.values(content.lists)}
                                            onChange={handleChangeList}
                                        /> */}
                                    </Form.Input>
                                    {/* <Divider horizontal>Or</Divider>
                                    <Form.Input
                                        icon='list ol'
                                        iconPosition='left'
                                        // label={{ tag: true, content: 'Add Tag' }}
                                        labelPosition='right'
                                        name='newlistname'
                                        placeholder='Enter new name'
                                        // onChange={handleChange}
                                        // value={values.tag}
                                        // errorTag={errorTag?true:false}
                                        /> 
                                    </Form.Field> */}
                                {/* </Segment> */}
                            {/* </Grid.Column>
                        </Grid> */}
                        {/* <Divider vertical>Or</Divider> */}
                        <br/>
                        <Button primary type='submit' >
                            Submit
                        </Button>
                </Form>

            </Modal.Content>
            <Modal.Actions>
                
            </Modal.Actions>
        </Modal>
        </>
    )
}

export default AddItem;