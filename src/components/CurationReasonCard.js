import React,{useContext, useState} from 'react'
import {Card,Button,Modal,Form} from 'semantic-ui-react'
import ContentContext from '../context/ContentContext';
import {GetListDescription,ChangeListDescription,GET_LIST_DESCRIPTION,CHANGE_LIST_DESCRIPTION} from '../util/graphqlExecutor'
import UserContext from '../context/UserContext';
import useForm from '../util/hook';
import {useMutation } from '@apollo/react-hooks';

function CurationReasonCard(props){
    const [content,contentChange] = useContext(ContentContext)
    const user = useContext(UserContext);
    const [id, setid] = useState('')
    const [description,setDescription] = useState('')
    const [editState, seteditState] = useState(false)
    const [showModal,SetModal] = useState(false)

    const {values,onChange,onSubmit} = useForm(createPostCallback,{
        description:'',
    })

    const loadData=()=>{
        GetListDescription({listid:content.currentListID}).then((response)=>{
            // console.log(response)
            if(typeof(response)!=='undefined')
            {
                setDescription(response.lists[0].description)
                setid(response.lists[0].id)
                if(values.description==='')
                    values.description=response.lists[0].description
                if(response.lists[0].curator_id===user.loggedin_user_id){
                    seteditState(true)
                }else{
                    seteditState(false)
                }
            }
            // contentChange(content=>({...content,contentDescription:response.lists[0].description}))
        }).catch((error)=>console.log(error))
    }

    const updateCache = (cache, {data}) => {
        // Fetch the items from the cache
        const existingItems = cache.readQuery({
          query: GET_LIST_DESCRIPTION,
            variables:{
                listid:id
            }
        });
        // Add the new item to the cache
        const newItem = data.update_lists.returning[0];
        cache.writeQuery({
          query: GET_LIST_DESCRIPTION,
          data: {lists: [newItem]}
        });
        values.description='';
    };

    const [modifyList,{error}] = useMutation(CHANGE_LIST_DESCRIPTION,{
        variables:{
            id:id,
            description:values.description
        },update:updateCache,
        onError:(error)=>{
            console.log(error)
        }
        
    });

    function createPostCallback(){
        modifyList()
        SetModal(false)
    }

    function OnClose(){
        SetModal(false)
    }

    const editform=(
        <Modal open={showModal} closeOnDimmerClick={false} onClose={OnClose} closeIcon trigger={<Button icon='edit'  floated='right' onClick={()=>SetModal(true)}/>} >
            <Modal.Header>
                Edit Reason
            </Modal.Header>
            <Modal.Content image scrolling>
                <Form onSubmit={onSubmit}>
                    <Form.Field inline name="description">
                        <label>Description</label>
                        <Form.TextArea 
                            name='description' 
                            
                            style={{ minHeight: 100 }} 
                            onChange={onChange}
                            value={values.description}
                            error={error?true:false}
                        />
                    </Form.Field>
                    <Button primary type='submit' >
                        Submit
                    </Button>
                </Form>
            </Modal.Content>
        </Modal>
    )

    if(content.currentListID!==''){
        loadData()
    }
    return(
        <>
        <Card fluid>
            <Card.Content header='My Reason for this curation' />
            <Card.Content description={description} />
            {
                editState&&(
                    <Card.Content extra>
                        {editform}
                    </Card.Content>
                )
            }
            
        </Card>
        </>
    )
}

export default CurationReasonCard;