import React,{useState,useContext,useEffect} from 'react'
import {Item,Button,Icon,Placeholder} from 'semantic-ui-react'
import { useAuth0 } from '../react-auth0-spa'
import {FETCH_FEED_ITEMS,INSERT_TAG,DELETE_ITEM} from '../util/graphql';
import {useMutation} from '@apollo/react-hooks';
import UserContext from '../context/UserContext';
import grabity from 'grabity';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Tap from 'react-interactions'
import Reward from "react-rewards"
import {MixpanelConsumer } from 'react-mixpanel';
import ReactGA from 'react-ga';
import Mixpanel from '../util/mix'
import {DeleteItem,LikeItem,UnlikeItem} from '../util/graphqlExecutor'
import {client} from '../ApolloProvider'
import gql from 'graphql-tag'
import { useQuery } from "@apollo/react-hooks";

// const LIKE_ITEM=gql`
//     mutation MyMutation ($item_id:uuid!,$user_id:String!){
//         insert_like_item(objects: {item_id: $item_id, user_id: $user_id}) {
//             affected_rows
//         }
//     }
// `

// const LikeItem=(item_id,user_id)=>{
//     return client.mutate({
//         mutation:LIKE_ITEM,
//         variables:{
//             item_id:item_id,
//             user_id:user_id
//         },
//         refetchQueries: [
//             {
//               query: FETCH_ITEM_LIKES,
//               variables: { item_id: item_id, user_id: user_id }
//             }
//         ]
//     }).then((response)=>response.data).catch((error)=>console.log(error))
// }

// const UNLIKE_ITEM=gql`
//     mutation MyMutation($item_id:uuid!,$user_id:String!) {
//         delete_like_item(where: {item_id: {_eq: $item_id}, user_id: {_eq: $user_id}}) {
//             affected_rows
//         }
//     }
// `

// const UnlikeItem=(item_id,user_id)=>{
//     return client.mutate({
//         mutation:UNLIKE_ITEM,
//         variables:{
//             item_id:item_id,
//             user_id:user_id
//         },
//         refetchQueries: [
//             {
//               query: FETCH_ITEM_LIKES,
//               variables: { item_id: item_id, user_id: user_id }
//             }
//         ]
//     }).then((response)=>response.data).catch((error)=>console.log(error))
// }

// const FETCH_ITEM_LIKES=gql`
//     query MyQuery($item_id:uuid!,$user_id:String!) {
//         like_item_aggregate(where: {item_id: {_eq: $item_id}, user_id: {_eq: $user_id}}) {
//             aggregate {
//                 count
//             }
//         }
//     }
// `

function ContentCard(postdata){
    // console.log(postdata.postdata['like_items'].length)
    const { isAuthenticated,user, loginWithRedirect, logout } = useAuth0();
    const userC = useContext(UserContext)
    const post = postdata.postdata
    const [reward, setreward] = useState(null)
    const notify = () => toast("Link Copied!");
    const [liked, setLiked] = useState(-1)
    // if(user){
    //     console.log(user['sub'])
    // }
    //post.user.id //Would be useful for checking if the post beind deleted belongs to the person
    // const [deleteItem] = useMutation(DELETE_ITEM,{
    //     variables:{item_id:post.id,curator:userC.loggedin_user_id},
    //     update: (cache) => {
    //         const existingItems = cache.readQuery({
    //             query: FETCH_FEED_ITEMS
    //         });
    //         const newItems = existingItems.items.filter(t => (t.id !== post.id));
    //         cache.writeQuery({
    //             query: FETCH_FEED_ITEMS,
    //             data: {items: newItems}
    //         });
    //     }
    // })

    const deleteitem = (id)=>{
        DeleteItem({id:id}).then((response)=>{
            console.log(response)
        })
    }

    const [thumbImage,thumbImageSet] = useState('https://react.semantic-ui.com/images/wireframe/image.png')

    const [token, setToken] = useState('');
    // console.log(postdata)
    //Fetches thumbnail image
    // try{
    //     const thumb =async () => {
    //         let it = await grabity.grabIt("https://cors-anywhere.herokuapp.com/"+post.link);
    //         // console.log(it)
    //         if(it['favicon']){
    //             if(it['favicon']){
    //                 thumbImageSet(it['favicon'])
    //             }
    //         }else if(it['image']){
    //             thumbImageSet(it['image'])
    //         }
    //         if(post.description===""){
    //             if(it['description']){
    //                 post.description=it['description']
    //             }
    //         }
    //         // console.log(post.link)
    //         // console.log(it)
    //         setToken('l')
    //     };
    //     useEffect(() => {
    //         // You need to restrict it at some point
    //         // This is just dummy code and should be replaced by actual
    //         if (!token) {
    //             thumb();
    //         }
    //     }, [thumb, token]);
    // }catch (e){
    //     // console.log(e)
    // }

    function R(){
        // reward.rewardMe()
    }

    if(liked===-1){
        if(postdata.postdata['like_items'].length>0){
            setLiked(true)
        }else{
            setLiked(false)
        }
    }

    
    
    return(
        <>
        {/* <MixpanelConsumer>
                        {mixpanel=> */}
        <Item>
            <Item.Image size='tiny' src={(post.auto_image!=='none')?post.auto_image:thumbImage}/>
            <Item.Content>
                <Item.Header as='a' target='_blank' href={post.link} onClick={Mixpanel.track('Link Click',{"link":post.link,"curator":post.user.id,"name":post.name})}>{post.name}</Item.Header>
                {isAuthenticated&&(post.user.id===userC.loggedin_user_id)&&(
                    <Button icon floated='right' onClick={(e)=>{
                        deleteitem(post.id)
                        Mixpanel.track('Delete Item',{"link":post.link,"curator":post.user.id,"name":post.name})
                        ReactGA.event({
                            category: 'Item',
                            action: 'Delete',
                            label:post.name,
                            transport: 'beacon'
                        });
                        }
                    }>
                        <Icon name='delete' />
                        <Tap waves />
                    </Button>
                )}
                <Button icon floated='right'>
                    <Icon name='bookmark outline' />
                    <Tap waves />
                </Button>
                <CopyToClipboard text={post.link} onCopy={(e)=>{
                    notify()
                    Mixpanel.track('Copy Item',{"link":post.link,"curator":post.user.id,"name":post.name})
                    ReactGA.event({
                        category: 'Item',
                        action: 'Copy',
                        label:post.name,
                        transport: 'beacon'
                    });
                    }}>
                    <Button icon floated='right'>
                        <Icon name='copy' />
                        <Tap waves />
                    </Button>
                </CopyToClipboard>
                {/* <Reward ref={(ref) => { setreward(ref) }} type='confetti' config={{springAnimation:false}}> */}
                {isAuthenticated&&(
                    (liked)?
                    (
                        <Button color='red' icon floated='right' onClick={(e)=>{
                            R()
                            UnlikeItem(post.id,userC.loggedin_user_id)
                            setLiked(false)
                            Mixpanel.track('Appreciate Item',{"link":post.link,"curator":post.user.id,"name":post.name})
                            ReactGA.event({
                                category: 'Item',
                                action: 'Appreciate',
                                label:post.name,
                                transport: 'beacon'
                            });
                        }}>
                            <Icon name='like' />
                            <Tap waves />
                        </Button>
                    ):
                    (<Button icon floated='right' onClick={(e)=>{
                        R()
                        LikeItem(post.id,userC.loggedin_user_id)
                        setLiked(true)
                        Mixpanel.track('Appreciate Item',{"link":post.link,"curator":post.user.id,"name":post.name})
                        ReactGA.event({
                            category: 'Item',
                            action: 'Appreciate',
                            label:post.name,
                            transport: 'beacon'
                        });
                    }}>
                        <Icon name='like' />
                        <Tap waves />
                    </Button>)
                    )
                }
                {/* </Reward> */}
                <Item.Description>
                <p>
                    {post.description!==" "?post.description:post.auto_description}
                </p>
                </Item.Description>
            </Item.Content>
        </Item>
        {/* }
        </MixpanelConsumer> */}
        </>
    )
}

export default ContentCard;