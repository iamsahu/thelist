import React,{useContext, useState} from 'react';
import {Modal,Button,Form,Dropdown,Divider,Segment, Grid} from 'semantic-ui-react';
import useForm from '../util/hook';
import {useMutation } from '@apollo/react-hooks';
import {CREATE_ITEM} from '../util/graphql';
import {FETCH_FEED_ITEMS,INSERT_TAG} from '../util/graphql';
import UserContext from '../context/UserContext';
import ContentContext from '../context/ContentContext';

function AddItem(){
    const [content,contentChange] = useContext(ContentContext)
    const [singleTag,SetTag] = useState('')
    const user = useContext(UserContext)
    console.log(user.loggedin_user_id)
    var tagSelection = {};
    var tagSelectionFinal={};

    const {values,onChange,onSubmit} = useForm(createPostCallback,{
        name:'',
        link:'',
        description:'',
        curator:user.loggedin_user_id
    })

    const [createTag,{errorTag}] = useMutation(INSERT_TAG,{
        variables:singleTag,//[{tag: "test1", curator: "26b4e98c-b5dc-4810-97b9-909ddc74c4f0"},{tag: "test2", curator: "26b4e98c-b5dc-4810-97b9-909ddc74c4f0"}],
        onError:(error,variables)=>{
            console.log(error)
            // console.log(variables)
        }
    });

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
        values.reason="";
        values.name='';
        values.link='';
        values.description='';
    };
    
    const [createPost,{error}] = useMutation(CREATE_ITEM,{
        variables:values,update:updateCache,onError:(error)=>{
            console.log(error)
    }});
    
    function createPostCallback(){
        console.log(values)
        createPost();
        if(tagSelection!==''){
            createTag()
        }
    }

    const handleChange = (e, { value }) => {
        tagSelection = value
        console.log(tagSelection)
        if(tagSelection!==''){
            tagSelection = tagSelection.map(tag=>(
                {tag:tag,curator:user.loggedin_user_id}
            ))
            for (var a in tagSelection){
                tagSelectionFinal = tagSelection[a]
                SetTag(tagSelectionFinal)
                console.log(tagSelectionFinal)
                break
            }
        }
    };

    return(
        <>
        <Modal trigger={<div className='icobutton'><Button>Add Item</Button></div>} >
            <Modal.Header>Add Item</Modal.Header>
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
                        <Form.Input 
                            name='description' 
                            placeholder='Description'
                            onChange={onChange}
                            value={values.description}
                            error={error?true:false}
                        />
                    </Form.Field>

                    
                        <Grid columns={2} relaxed='very' stackable>
                            <Grid.Column>
                            <Segment placeholder>
                                <Form.Field inline name="tag">
                                    <label>Tags</label>
                                    <Form.Input>
                                        <Dropdown
                                            name='tag'
                                            placeholder='Tags'
                                            fluid
                                            multiple
                                            search
                                            selection
                                            options={Object.values(content.tags)}
                                            onChange={handleChange}
                                            // value={values.tag}
                                        />
                                    </Form.Input>
                            </Form.Field>
                            <Divider horizontal>Or</Divider>
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
                                </Segment>
                            </Grid.Column>
                            <Grid.Column>
                            <Segment placeholder><Form.Field>
                                    <label>List Name</label>
                                    {/* <Form.Input>
                                        <Dropdown
                                            name='list_name'
                                            placeholder='Choose list name'
                                            fluid
                                            multiple
                                            search
                                            selection
                                        />
                                    </Form.Input> */}
                                    <Divider horizontal>Or</Divider>
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
                                </Form.Field>
                                
                                </Segment>
                            </Grid.Column>
                        </Grid>
                        {/* <Divider vertical>Or</Divider> */}
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