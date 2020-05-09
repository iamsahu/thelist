import React,{useContext} from 'react';
import {Modal,Button,Header,Image,Icon,Form,Input} from 'semantic-ui-react';
import useForm from '../util/hook';
import {useMutation } from '@apollo/react-hooks';
import {CREATE_ITEM} from '../util/graphql';
import {FETCH_FEED_ITEMS} from '../util/graphql';
import UserContext from '../context/UserContext';

function AddItem(){
    const user = useContext(UserContext)
    const {values,onChange,onSubmit} = useForm(createPostCallback,{
        name:'',
        link:'',
        description:'',
        tag:'',
        curator:user.loggedin_user_id
    })
    
    const [createPost,{error}] = useMutation(CREATE_ITEM,{
        variables:values,
        update(proxy,result){
            const data =proxy.readQuery({
                query:FETCH_FEED_ITEMS
            })
            console.log(data)
            console.log(result)
            data.items = [result.data.insert_items.returning,...data.items];
            proxy.writeQuery({query:FETCH_FEED_ITEMS,data})
            values.reason="";
            values.name='';
            values.link='';
            values.description='';
            values.tag='';        
        }
    });
    
    function createPostCallback(){
        createPost()
    }

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
                            // error={error?true:false}
                        />
                    </Form.Field>
                    <Form.Field inline name="description">
                        <label>Description</label>
                        <Form.Input 
                            name='description' 
                            placeholder='Description'
                            onChange={onChange}
                            value={values.description}
                        />
                    </Form.Field>
                    <Form.Input
                        icon='tags'
                        iconPosition='left'
                        // label={{ tag: true, content: 'Add Tag' }}
                        labelPosition='right'
                        name='tag'
                        placeholder='Enter tags'
                        onChange={onChange}
                        value={values.tag}
                    />
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