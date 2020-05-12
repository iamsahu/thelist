import React,{useState,useContext,useEffect} from 'react'
import {Item,Button,Icon} from 'semantic-ui-react'
import { useAuth0 } from '../react-auth0-spa'
import {FETCH_FEED_ITEMS,INSERT_TAG,DELETE_ITEM} from '../util/graphql';
import {useMutation} from '@apollo/react-hooks'
import UserContext from '../context/UserContext';
import grabity from 'grabity'

function ContentCard(postdata){
    const { isAuthenticated,user, loginWithRedirect, logout } = useAuth0();
    const userC = useContext(UserContext)
    const post = postdata.postdata
    // if(user){
    //     console.log(user['sub'])
    // }
    //post.user.id //Would be useful for checking if the post beind deleted belongs to the person
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

    const [thumbImage,thumbImageSet] = useState('https://react.semantic-ui.com/images/wireframe/image.png')

    const [token, setToken] = useState('');

    //Fetches thumbnail image
    try{
        const thumb =async () => {
            let it = await grabity.grabIt("https://cors-anywhere.herokuapp.com/"+post.link);
            // console.log(it)
            if(it['favicon']){
                thumbImageSet(it['favicon'])
            }else if(it['image']){
                thumbImageSet(it['image'])
            }
            // console.log(post.link)
            // console.log(it)
            setToken('l')
        };
        useEffect(() => {
            // You need to restrict it at some point
            // This is just dummy code and should be replaced by actual
            if (!token) {
                thumb();
            }
        }, [thumb, token]);
    }catch (e){
        // console.log(e)
    }
    
    return(
        <>
        <Item>
            <Item.Image size='tiny' src={thumbImage}/>
            <Item.Content>
                <Item.Header as='a' target='_blank' href={post.link}>{post.name}</Item.Header>
                {isAuthenticated&&(post.user.id===userC.loggedin_user_id)&&(
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