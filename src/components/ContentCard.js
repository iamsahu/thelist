import React,{useState,useContext} from 'react'
import {Item,Button,Icon} from 'semantic-ui-react'
import { useAuth0 } from '../react-auth0-spa'
import {FETCH_FEED_ITEMS,INSERT_TAG,DELETE_ITEM} from '../util/graphql';
import {useMutation} from '@apollo/react-hooks'
import UserContext from '../context/UserContext';

function ContentCard(postdata){
    const { isAuthenticated,user, loginWithRedirect, logout } = useAuth0();
    const userC = useContext(UserContext)
    const post = postdata.postdata
    // if(user){
    //     console.log(user['sub'])
    // }
    //post.user.id //Would be useful for checking if the post beind deleted belongs to the person
    const [itemID,SetID] = useState('')
    const [deleteItem] = useMutation(DELETE_ITEM,{
        variables:{item_id:post.id,curator:userC.loggedin_user_id},
        update: (cache) => {
            const existingItems = cache.readQuery({
                query: FETCH_FEED_ITEMS
            });
            const newItems = existingItems.items.filter(t => (t.id !== post.id));
            cache.writeQuery({
                query: FETCH_FEED_ITEMS,
                data: {items: newItems}
            });
        }
    })
    
    
    // SetID(post.user.id)
    return(
        <>
        <Item>
            <Item.Image size='small' src='https://react.semantic-ui.com/images/wireframe/image.png' />
            <Item.Content>
                <Item.Header as='a' href={post.link}>{post.name}</Item.Header>
                {isAuthenticated&&(
                    <Button icon floated='right' onClick={deleteItem}>
                        <Icon name='delete' />
                    </Button>
                )}
                <Button icon floated='right'>
                    <Icon name='bookmark outline' />
                </Button>
                <Button icon floated='right'>
                    <Icon name='copy' />
                </Button>
                
                <Button icon floated='right'>
                    <Icon name='certificate' />
                </Button>
                <Item.Description>
                <p></p>
                <p>
                    {post.description}
                </p>
                </Item.Description>
                
            </Item.Content>
            </Item>
        </>
    )
}

export default ContentCard;