import React,{useContext, useState} from 'react';
import { client } from '../ApolloProvider';
import gql from 'graphql-tag'
import UserContext from '../context/UserContext';
import ContentContext from '../context/ContentContext';
import {FETCH_FEED_ITEMS} from './graphql' 



const tagTemplate ={
    posts_tags: {
        data: {
            item_id: "", 
            user_id: ""}
        }, 
    name: "", 
    user_id: ""
}

const oldTagTemplate= {item_id: "", tag_id: "", user_id: ""}

const TAG_ITEM = gql`
    mutation MyMutation($objects: [item_tag_insert_input!]! ) {
        insert_item_tag(objects: $objects) {
            returning {
                item_id
                tag_id
                user_id
                id
            }
        }
    }
`;

const INSERT_LIST = gql`
    mutation MyMutation($curator_id:String!,$list_name:String!,$description:String){
        insert_lists(objects: {curator_id: $curator_id, list_name: $list_name, description: $description}) {
            returning {
                curator_id
                id
                list_name
                description
            }
        }
    }
`;

const INSERT_TAGS = gql`
    mutation MyMutation($objects: [tag_insert_input!]! ) {
        insert_tag(objects: $objects) {
            returning {
                id
                name
                user_id
            }
        }
    }

`

const INSERT_ITEM=gql`
    mutation ($link:String,$name:String!,$description:String,$curator:String!,$list_id:uuid!) {
        insert_items(objects: {
            link: $link, 
            name: $name, 
            description: $description, 
            curator: $curator,
            list_id:$list_id}){
            affected_rows
            returning{
                appreciation_count
                bookmarks_count
                copy_count
                curator
                description
                id
                link
                name
                share_count
                view_count
                list_id
                user {
                    id
                }
            }
        }
    }
`

function InsertNewList(curator_id,list_name,listDescription){
    return client.mutate({
        mutation:INSERT_LIST,
        variables:{
            curator_id:curator_id,
            list_name:list_name,
            description:listDescription
        },update:(cache,{data})=>{
            const existingItems = cache.readQuery({
                query:COMBINED_FETCH,
                variables:{
                    user_id:curator_id
                },
            })
            // console.log(existingItems)
            const newItem = data.insert_lists.returning[0];
            // console.log(newItem)
            existingItems.lists.push(newItem)
            // console.log(existingItems)
            cache.writeQuery({
                query: COMBINED_FETCH,
                variables:{
                    user_id:curator_id
                },
                data: existingItems
            });
        }
    }).catch((error)=>{console.log(error)})
    // .then((response)=>({
    //     response   
    // }))
    // console.log(values.list_id)
}

function InsertNewTags(tags,curator_id){
    return client.mutate({
        mutation:INSERT_TAGS,
        variables:{
            objects:tags
        },update:(cache,{data})=>{
            const existingItems = cache.readQuery({
                query:COMBINED_FETCH,
                variables:{
                    user_id:curator_id
                },
            })
            const newItem = data.insert_tag.returning[0];
            existingItems.tag.push(newItem)
            cache.writeQuery({
                query: COMBINED_FETCH,
                variables:{
                    user_id:curator_id
                },
                data: existingItems
            });
        }
    }).catch((error)=>{
        console.log(error)
    })
}

function InsertItem(link,name,description,curator_id,list_id,contentType,currentListID,currentTagID){
    // console.log(link)
    // console.log(name)
    // console.log(description)
    // console.log(curator_id)
    // console.log(list_id)
    return client.mutate({
        mutation:INSERT_ITEM,
        variables:{
            link:link,
            name:name,
            description:description,
            curator:curator_id,
            list_id:list_id
        },
        update:(cache,{data})=>{
            if(contentType==='lists'){
                if(currentListID===''){
                    const existingItems = cache.readQuery({
                        query:GET_ITEMS_USER,
                        variables:{
                            userid:curator_id
                        },
                    })
                    // console.log(existingItems)
                    const newItem = data.insert_items.returning[0];
                    cache.writeQuery({
                        query: GET_ITEMS_USER,
                        variables:{
                            userid:curator_id
                        },
                        data: {items: [newItem, ...existingItems.items]}
                    });
                }else{
                    // console.log('here')
                    const existingItems = cache.readQuery({
                        query:GET_LIST,
                            variables:{
                                userid:curator_id,
                                listid:currentListID
                            },
                    })
                    const newItem = data.insert_items.returning[0];
                    // console.log(newItem)
                    cache.writeQuery({
                        query: GET_LIST,
                        variables:{
                            userid:curator_id,
                            listid:currentListID
                        },
                        data: {items: [newItem, ...existingItems.items]}
                    });
                }
            }else if(contentType==='tags'){
                if(currentTagID===''){
                    const existingItems = cache.readQuery({
                        query:GET_ITEMS_USER,
                        variables:{
                            userid:curator_id
                        },
                    })
                    // console.log(existingItems)
                    const newItem = data.insert_items.returning[0];
                    cache.writeQuery({
                        query: GET_ITEMS_USER,
                        variables:{
                            userid:curator_id
                        },
                        data: {items: [newItem, ...existingItems.items]}
                    });
                }else{
                    //TODO: Tag based cache update
                }
            }
            // console.log(data)
            // const existingItems = cache.readQuery({
            //     query:GET_ITEMS_USER,
            //     variables:{
            //         userid:curator_id
            //     },
            // })
            // // console.log(existingItems)
            // const newItem = data.insert_items.returning[0];
            // cache.writeQuery({
            //     query: GET_ITEMS_USER,
            //     variables:{
            //         userid:curator_id
            //     },
            //     data: {items: [newItem, ...existingItems.items]}
            // });
        }
    }).catch((error)=>{console.log(error)})
}

function InsertTagPost(temp){
    return client.mutate({
        mutation:TAG_ITEM,
            variables:{
                objects:temp
            }
    }).catch((error)=>{console.log(error)})
}

const createItem =(values) => {
    function FindTagName(id){
        for(var tag in values.tags){
            if(values.tags[tag]['value']===id){
                return values.tags[tag]['text']
                break
            }
        }
        return ''
    }
    var newListID = false
    var newTag = false
    var oldTag = false
    var newTags = []
    var oldTags = []
    if(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(values.list_id)){
        //The supplied list_id works
    }else{
        //New list name has to be inserted
        console.log(values.list_id)
        newListID = true
    }
    if(values.selTags!==''){
        for(var a in values.selTags){
            if(FindTagName(values.selTags[a])===''){
                newTag=true
                newTags.push({name: values.selTags[a], user_id: values.curator_id})
            }else{
                oldTag = true
                oldTags.push({ tag_id: values.selTags[a]})
            }
        }
    }

    if(values.contentType==='tags'){
        //If the added tag to article also has the tag with which the current content is being displayed
    }else if(values.contentType==='lists'){
        //If current list is open is the list to which the new item is being added
    }

    if(newListID){
        if(newTag){
            if(oldTag){
                return InsertNewList(values.curator_id,values.list_id,values.listDescription).then((response)=>{
                    values.list_id = response.data.insert_lists.returning[0].id
                    return InsertItem(values.link,values.name,values.description,values.curator_id,values.list_id,values.contentType,values.currentListID,values.currentTagID).then((response)=>{
                        const item = response.data.insert_items.returning[0];
                        console.log(response)
                        return InsertNewTags(newTags,values.curator_id).then((response)=>{
                            // console.log(response)
                            // console.log(item.id)
                            const receivedTags = response.data.insert_tag.returning;
                            var temp = []
                            for(var x in receivedTags){
                                temp.push({item_id: item.id, tag_id: receivedTags[x].id, user_id: values.curator_id})
                            }
                            for(var y in oldTags){
                                temp.push({item_id: item.id, tag_id: oldTags[y].tag_id, user_id: values.curator_id})
                            }
                            return InsertTagPost(temp).catch((error)=>{console.log(error)})

                        }).catch((error)=>{console.log(error)})
                    }).catch((error)=>{console.log(error)})
                }).catch((error)=>{console.log(error)})
                
            }else{
                return InsertNewList(values.curator_id,values.list_id,values.listDescription).then((response)=>{
                    values.list_id = response.data.insert_lists.returning[0].id
                    return InsertItem(values.link,values.name,values.description,values.curator_id,values.list_id,values.contentType,values.currentListID,values.currentTagID).then((response)=>{
                        const item = response.data.insert_items.returning[0];
                        // console.log(response)
                        return InsertNewTags(newTags,values.curator_id).then((response)=>{
                            // console.log(response)
                            // console.log(item.id)
                            const receivedTags = response.data.insert_tag.returning;
                            var temp = []
                            for(var x in receivedTags){
                                temp.push({item_id: item.id, tag_id: receivedTags[x].id, user_id: values.curator_id})
                            }
                            // console.log(temp)
                            return InsertTagPost(temp).catch((error)=>{console.log(error)})

                        }).catch((error)=>{console.log(error)})
                    }).catch((error)=>{console.log(error)})
                }).catch((error)=>{console.log(error)})
            }
        }else{
            if(oldTag){
                return InsertNewList(values.curator_id,values.list_id,values.listDescription).then((response)=>{
                    values.list_id = response.data.insert_lists.returning[0].id
                    return InsertItem(values.link,values.name,values.description,values.curator_id,values.list_id,values.contentType,values.currentListID,values.currentTagID).then((response)=>{
                        const item = response.data.insert_items.returning[0];
                        console.log(response)
                        var temp =[];
                        for(var a in oldTags){
                            temp.push({item_id: item.id, tag_id: oldTags[a].tag_id, user_id: values.curator_id})
                        }
                        return InsertTagPost(temp).catch((error)=>{console.log(error)})
                        
                    }).catch((error)=>{console.log(error)})
                }).catch((error)=>{console.log(error)})
            }else{
                return InsertNewList(values.curator_id,values.list_id,values.listDescription).then((response)=>{
                    values.list_id = response.data.insert_lists.returning[0].id
                    return InsertItem(values.link,values.name,values.description,values.curator_id,values.list_id,values.contentType,values.currentListID,values.currentTagID)
                    .catch((error)=>{console.log(error)})
                }).catch((error)=>{console.log(error)})
            }
        }
    }else{
        if(newTag){
            if(oldTag){
                return InsertItem(values.link,values.name,values.description,values.curator_id,values.list_id,values.contentType,values.currentListID,values.currentTagID).then((response)=>{
                    const item = response.data.insert_items.returning[0];
                    // console.log(response)
                    return InsertNewTags(newTags,values.curator_id).then((response)=>{
                        // console.log(response)
                        // console.log(item.id)
                        const receivedTags = response.data.insert_tag.returning;
                        var temp = []
                        for(var x in receivedTags){
                            temp.push({item_id: item.id, tag_id: receivedTags[x].id, user_id: values.curator_id})
                        }
                        for(var y in oldTags){
                            temp.push({item_id: item.id, tag_id: oldTags[y].tag_id, user_id: values.curator_id})
                        }
                        return InsertTagPost(temp).catch((error)=>{console.log(error)})
                    }).catch((error)=>{console.log(error)})
                }).catch((error)=>{console.log(error)})
            }else{
                return InsertItem(values.link,values.name,values.description,values.curator_id,values.list_id,values.contentType,values.currentListID,values.currentTagID).then((response)=>{
                    const item = response.data.insert_items.returning[0];
                    // console.log(response)
                    return InsertNewTags(newTags,values.curator_id).then((response)=>{
                        // console.log(response)
                        // console.log(item.id)
                        const receivedTags = response.data.insert_tag.returning;
                        var temp = []
                        for(var x in receivedTags){
                            temp.push({item_id: item.id, tag_id: receivedTags[x].id, user_id: values.curator_id})
                        }
                        return InsertTagPost(temp)
                    }).catch((error)=>{console.log(error)})
                }).catch((error)=>{console.log(error)})
            }
        }else{
            if(oldTag){
                return InsertItem(values.link,values.name,values.description,values.curator_id,values.list_id,values.contentType,values.currentListID,values.currentTagID).then((response)=>{
                    const item = response.data.insert_items.returning[0];
                    // console.log(response)
                    var temp =[];                    
                    for(var a in oldTags){
                        temp.push({item_id: item.id, tag_id: oldTags[a].tag_id, user_id: values.curator_id})
                    }
                    return InsertTagPost(temp)
                    
                }).catch((error)=>console.log(error))
            }else{
                return InsertItem(values.link,values.name,values.description,values.curator_id,values.list_id,values.contentType,values.currentListID,values.currentTagID).catch((error)=>{console.log(error)})
            }
        }
    }
}

export const GET_LIST = gql`
    query MyQuery($userid:String,$listid:uuid!) {
        items(order_by: {created_at: desc_nulls_last}, where: {user: {id: {_eq: $userid}}, list_id: {_eq: $listid}}) {
            appreciation_count
            bookmarks_count
            copy_count
            curator
            description
            id
            link
            list_id
            name
            share_count
            view_count
            user {
                id
            }
        }
    }
`

const GetList = (values)=>{
    return client.query({
        query:GET_LIST,
        variables:{
            userid:values.userid,
            listid:values.listid
        }
    }).then((response) => response.data);
}

export const GET_LIST_DESCRIPTION = gql`
    query MyQuery($listid:uuid){lists(where: {id: {_eq: $listid}}) {
    curator_id
    description
    id
    list_name
  }}
`

const GetListDescription = (listid)=>{
    // console.log(listid.listid)
    return client.query({
        query:GET_LIST_DESCRIPTION,
        variables:{
            listid:listid.listid
        }
    }).then((response) => response.data).catch((error)=>console.log(error));
}

const GET_ITEMS_OF_TAG = gql`
    query MyQuery($tag_id:uuid!,$user_id:String!){
        item_tag(where: {tag_id: {_eq: $tag_id},user_id: {_eq: $user_id}}) {
            item_id
        }
    }
`

const GET_ITEMS = gql`
    query MyQuery($_in: [uuid!]!){
        items(where: {id: {_in: $_in}}) {
            appreciation_count
            bookmarks_count
            copy_count
            created_at
            curator
            description
            id
            link
            list_id
            name
            share_count
            view_count
            user {
                id
            }
        }
    }
`

const GetItemsofTag=(values)=>{
    // console.log(values)
    return client.query({
        query:GET_ITEMS_OF_TAG,
        variables:{
            tag_id:values.tag_id,
            user_id:values.user_id
        }
    })
    .then((response)=>{
        
        // console.log(response)
        const tags = response.data.item_tag.map(tag=>tag.item_id)
        return client.query({
            query:GET_ITEMS,
            variables:{
                _in:tags
            }
        })
        .then((response)=>response.data).catch((error)=>{console.log(error)})

    }).catch((error)=>console.log(error))
}

const GET_ITEMS_USER=gql`
    query MyQuery($userid:String!) {
    items(order_by: {created_at: desc_nulls_last},where: {user: {id: {_eq: $userid}}}) {
        appreciation_count
        copy_count
        bookmarks_count
        curator
        description
        id
        link
        list_id
        name
        user {
        id
        }
        share_count
        view_count
    }
    }
`

const GetItemsUsers=(values)=>{
    // console.log(values)
    return client.query({
        query:GET_ITEMS_USER,
        variables:{
            userid:values.curator_id
        }
    })
    .then((response)=>response.data).catch((error)=>{console.log(error)})
}

const COMBINED_FETCH = gql`
    query  ($user_id:String!){
        lists(where: {curator_id: {_eq: $user_id}}) {
            list_name
            id
            description
            curator_id
        }
        tag(where: {user_id: {_eq: $user_id}}) {
            id
            name
            user_id
        }
    }
`



const GetTagsListsUsers = (values)=>{
    // console.log(values)
    return client.query({
        query:COMBINED_FETCH,
        variables:{
            user_id:values.curator_id
        }
    }).then((response)=>response.data).catch((error)=>console.log(error))
}

const GET_USER = gql`
    query MyQuery ($user_id:String){
        user(where: {id: {_eq: $user_id}}) {
            id
            image_link
            description
            username
        }
    }
`

const DoesUserExists = (values)=>{
    // console.log(values)
    return client.query({
        query:GET_USER,
        variables:{
            user_id:values.user_id
        }
    }).then((response)=>response.data).catch((error)=>console.log(error))
}

const INSERT_USER=gql`
mutation MyMutation ($id:String,$image_link:String,$username:String){
  insert_user(objects: {id: $id, image_link: $image_link, username: $username}) {
    returning {
      id
      image_link
      description
      username
    }
  }
}
`

const InsertUser = (values)=>{
    return client.mutate({
        mutation:INSERT_USER,
        variables:{
            id:values.id,
            image_link:values.image_link,
            username:values.username
        }
    }).then((response)=>response.data).catch((error)=>console.log(error))
}

const SEARCH=gql`
    query MyQuery ($search:String){
        search_lists(args: {search: $search}) {
            list_name
            id
            description
            curator_id
            user {
                username
                description
            }
        }
    }
`

const Search = (values)=>{
    return client.query({
        query:SEARCH,
        variables:{
            search:values.search
        }
    }).then((response)=>response.data).catch((error)=>console.log(error))
}

export {createItem,GetList,GetListDescription,GetItemsofTag,GetItemsUsers,GetTagsListsUsers,DoesUserExists,InsertUser,Search};
