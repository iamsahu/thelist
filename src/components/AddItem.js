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
    const [singleTag,SetTag] = useState(false)
    const [multiTag,SetMultiTag] = useState([])
    const [showModal,SetModal] = useState(false)
    const [listID,SetListID] = useState('')
    const [newItemID,SetItemID] = useState('')
    const [tags_selection,SetTagSelection] = useState('')
    
    // console.log(user.loggedin_user_id)
    var tagSelection;
    var tagSelectionFinal={};

    const {values,onChange,onSubmit} = useForm(createPostCallback,{
        name:'',
        link:'',
        description:'',
        curator:user.loggedin_user_id
    })

    // const [createTag,{errorTag}] = useMutation(INSERT_TAG,{
    //     variables:singleTag,
    //     onError:(error,variables)=>{
    //         console.log(error)
    //     }
    // });

    // const [createTag,{errorTag}] = useMutation(INSERT_TAG_MULTI,{
    //     variables:multiTag,
    //     onError:(error,variables)=>{
    //         console.log(error)
    //         console.log(multiTag)
    //         console.log(variables)
    //     }
    // });

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
        MultiTagInsert(newItem.id)
    };
    
    const [createPost,{error}] = useMutation(CREATE_ITEM,{
        variables:{...values,list_id:listID},
        update:updateCache,
        onError:(error)=>{
            console.log(error)
    }});
    
    function createPostCallback(){
        createItem({...values,list_id:listID,selTags:content.selTags,loggedin_user_id:user.loggedin_user_id,tags:content.tags})
        .then((response,response2)=>{
            console.log(response)
            console.log(response2)
        })
        // console.log(multiTag)
        // console.log(listID)
        // createPost();//.then(TagInsert);
        // if(singleTag!==''){
        //     // createTag()
        // }
        SetModal(false)
    }

    // function TagInsert(data){
    //     console.log(data);
    //     var temp =[];
    //     if(content.selTags!==''){
    //         for(var a in content.selTags){
    //             console.log(a)
    //             tagTemplate['posts_tags']['data']['item_id']=item_id;
    //             tagTemplate['posts_tags']['data']['user_id'] = user.loggedin_user_id;
    //             tagTemplate['posts_tags']['name'] = FindTagName(content.selTags[a]);
    //             tagTemplate['posts_tags']['user_id'] = user.loggedin_user_id;
    //             SetMultiTag(multiTag.concat(tagTemplate))
    //             temp.push(tagTemplate)
    //         }
    //     }
    //     console.log(temp)

    // }
    

    const handleChange = (e, { value }) => {
        contentChange(content=>({...content,selTags:value}))
        // console.log(value)
        // SetTagSelection(value)
        // // console.log(tags_selection)
        // tagSelection = value
        // // console.log(value)
        // // console.log(tagSelection)
        // SetMultiTag([])
        // var temp;
        // if(tagSelection!==''){
        //     temp = tagSelection.map(tag=>(
        //         {
        //             posts_tags: {
        //                 data: {
        //                     item_id: "", 
        //                     user_id: user.loggedin_user_id}
        //                 }, 
        //             name: FindTagName(tag), 
        //             user_id: user.loggedin_user_id
        //         }
        //     ))
        //     SetMultiTag(multiTag.concat(temp))
        // }
        // MultiTagInsert("who is this")
    };

    const handleChangeList = (e, { value }) => {
        console.log(e)
        console.log(value)
        SetListID(value)
    };

    const tagTemplate ={
        posts_tags: {
            data: {
                item_id: "7abcdfc4-bb6a-43ec-8eea-b722312c38ac", 
                user_id: "26b4e98c-b5dc-4810-97b9-909ddc74c4f0"}
            }, 
        name: "insert 4", 
        user_id: "26b4e98c-b5dc-4810-97b9-909ddc74c4f0"
    }

    function MultiTagInsert(item_id){
        SetMultiTag([])
        var temp =[];
        if(content.selTags!==''){
            for(var a in content.selTags){
                console.log(a)
                tagTemplate['posts_tags']['data']['item_id']=item_id;
                tagTemplate['posts_tags']['data']['user_id'] = user.loggedin_user_id;
                tagTemplate['posts_tags']['name'] = FindTagName(content.selTags[a]);
                tagTemplate['posts_tags']['user_id'] = user.loggedin_user_id;
                SetMultiTag(multiTag.concat(tagTemplate))
                temp.push(tagTemplate)
            }
            // tagSelection = tags_selection.map(tag=>(
            //     tagTemplate['posts_tags']['data']['item_id']=item_id,
            //     tagTemplate['posts_tags']['data']['user_id'] = user.loggedin_user_id,
            //     tagTemplate['posts_tags']['name'] = FindTagName(tag),
            //     tagTemplate['posts_tags']['user_id'] = user.loggedin_user_id
            //     // {tag_id:tag,user_id:user.loggedin_user_id}
            // ))
            // console.log(tagSelection)
            // SetMultiTag(multiTag.concat(tagSelection))
            SetMultiTag(temp)
            contentChange(content=>({...content,finTag:temp}))
            console.log(temp)
            console.log(content.finTag)
            console.log(typeof(temp))
            SetTag(true);
            SetModal(false);
            // Test();
            MultiTagMutation(temp);
        }
    }
    // function Test(){
    //     console.log(multiTag)
    //     createTag();
    // }

    // if(singleTag){
    //     createTag();
    // }

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
                                            placeholder='Choose list name'
                                            fluid
                                            search
                                            selection
                                            options={Object.values(content.lists)}
                                            onChange={handleChangeList}
                                        />
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