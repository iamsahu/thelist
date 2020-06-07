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


function DataEntry(){
    const [listDescription, setlistDescription] = useState(false)
    const [dropTag,SetDropTag] = useState('')
    const [dropList,SetDropList] = useState('')
    const {values,onChange,onSubmit} = useForm(createPostCallback,{
        name:'',
        link:'',
        listDescription:'',
        description:'',
        curator:''
    })

    const handleChange = (e, { value }) => {
        // contentChange(content=>({...content,selTags:value}))
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
        // contentChange(content=>({...content,list_id:value}))
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
    function createPostCallback(){}
    return(<div>
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
    </div>)
}

export default DataEntry
