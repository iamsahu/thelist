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
    mutation MyMutation($objects: [posts_tag_insert_input!]! ) {
        insert_posts_tag(objects: $objects) {
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
    mutation MyMutation($curator_id:uuid!,$list_name:String!,$description:String){
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
    mutation ($link:String,$name:String!,$description:String!,$curator:uuid!,$list_id:uuid!) {
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

function InsertNewList(loggedin_user_id,list_name,listDescription){
    return client.mutate({
        mutation:INSERT_LIST,
        variables:{
            curator_id:loggedin_user_id,
            list_name:list_name,
            description:listDescription
        }
    })
    // .then((response)=>({
    //     response   
    // }))
    // console.log(values.list_id)
}

function InsertNewTags(tags){
    return client.mutate({
        mutation:INSERT_TAGS,
        variables:{
            objects:tags
        }
    })
    // .then((response)=>({
    //     response   
    // }))
}

function InsertItem(link,name,description,loggedin_user_id,list_id){
    return client.mutate({
        mutation:INSERT_ITEM,
        variables:{
            link:link,
            name:name,
            description:description,
            curator:loggedin_user_id,
            list_id:list_id
        },
        update:(cache,{data})=>{
            const existingItems = cache.readQuery({
                query:FETCH_FEED_ITEMS,
            })
            const newItem = data.insert_items.returning[0];
            cache.writeQuery({
                query: FETCH_FEED_ITEMS,
                data: {items: [newItem, ...existingItems.items]}
            });
        }
    })
}

function InsertTagPost(temp){
    return client.mutate({
        mutation:TAG_ITEM,
            variables:{
                objects:temp
            }
        })    
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
                newTags.push({name: values.selTags[a], user_id: values.loggedin_user_id})
            }else{
                oldTag = true
                oldTags.push({ tag_id: values.selTags[a]})
            }
        }
    }
    if(newListID){
        if(newTag){
            if(oldTag){
                return InsertNewList(values.loggedin_user_id,values.list_id,values.listDescription).then((response)=>{
                    values.list_id = response.data.insert_lists.returning[0].id
                    return InsertItem(values.link,values.name,values.description,values.loggedin_user_id,values.list_id).then((response)=>{
                        const item = response.data.insert_items.returning[0];
                        console.log(response)
                        return InsertNewTags(newTags).then((response)=>{
                            // console.log(response)
                            // console.log(item.id)
                            const receivedTags = response.data.insert_tag.returning;
                            var temp = []
                            for(var x in receivedTags){
                                temp.push({item_id: item.id, tag_id: receivedTags[x].id, user_id: values.loggedin_user_id})
                            }
                            for(var y in oldTags){
                                temp.push({item_id: item.id, tag_id: oldTags[y].tag_id, user_id: values.loggedin_user_id})
                            }
                            return InsertTagPost(temp)

                        })
                    })
                })
                
            }else{
                return InsertNewList(values.loggedin_user_id,values.list_id,values.listDescription).then((response)=>{
                    values.list_id = response.data.insert_lists.returning[0].id
                    return InsertItem(values.link,values.name,values.description,values.loggedin_user_id,values.list_id).then((response)=>{
                        const item = response.data.insert_items.returning[0];
                        console.log(response)
                        return InsertNewTags(newTags).then((response)=>{
                            // console.log(response)
                            // console.log(item.id)
                            const receivedTags = response.data.insert_tag.returning;
                            var temp = []
                            for(var x in receivedTags){
                                temp.push({item_id: item.id, tag_id: receivedTags[x].id, user_id: values.loggedin_user_id})
                            }
                            return InsertTagPost(temp)

                        })
                    })
                })
            }
        }else{
            if(oldTag){
                return InsertNewList(values.loggedin_user_id,values.list_id,values.listDescription).then((response)=>{
                    values.list_id = response.data.insert_lists.returning[0].id
                    return InsertItem(values.link,values.name,values.description,values.loggedin_user_id,values.list_id).then((response)=>{
                        const item = response.data.insert_items.returning[0];
                        console.log(response)
                        var temp =[];
                        for(var a in oldTags){
                            temp.push({item_id: item.id, tag_id: oldTags[a].tag_id, user_id: values.loggedin_user_id})
                        }
                        return InsertTagPost(temp)
                        
                    })
                })
            }else{
                return InsertNewList(values.loggedin_user_id,values.list_id,values.listDescription).then((response)=>{
                    values.list_id = response.data.insert_lists.returning[0].id
                    return InsertItem(values.link,values.name,values.description,values.loggedin_user_id,values.list_id)
                })
            }
        }
    }else{
        if(newTag){
            if(oldTag){
                return InsertItem(values.link,values.name,values.description,values.loggedin_user_id,values.list_id).then((response)=>{
                    const item = response.data.insert_items.returning[0];
                    // console.log(response)
                    return InsertNewTags(newTags).then((response)=>{
                        // console.log(response)
                        // console.log(item.id)
                        const receivedTags = response.data.insert_tag.returning;
                        var temp = []
                        for(var x in receivedTags){
                            temp.push({item_id: item.id, tag_id: receivedTags[x].id, user_id: values.loggedin_user_id})
                        }
                        for(var y in oldTags){
                            temp.push({item_id: item.id, tag_id: oldTags[y].tag_id, user_id: values.loggedin_user_id})
                        }
                        return InsertTagPost(temp)
                    })
                })
            }else{
                return InsertItem(values.link,values.name,values.description,values.loggedin_user_id,values.list_id).then((response)=>{
                    const item = response.data.insert_items.returning[0];
                    // console.log(response)
                    return InsertNewTags(newTags).then((response)=>{
                        // console.log(response)
                        // console.log(item.id)
                        const receivedTags = response.data.insert_tag.returning;
                        var temp = []
                        for(var x in receivedTags){
                            temp.push({item_id: item.id, tag_id: receivedTags[x].id, user_id: values.loggedin_user_id})
                        }
                        return InsertTagPost(temp)
                    })
                })
            }
        }else{
            if(oldTag){
                return InsertItem(values.link,values.name,values.description,values.loggedin_user_id,values.list_id).then((response)=>{
                    const item = response.data.insert_items.returning[0];
                    console.log(response)
                    var temp =[];                    
                    for(var a in oldTags){
                        temp.push({item_id: item.id, tag_id: oldTags[a].tag_id, user_id: values.loggedin_user_id})
                    }
                    return InsertTagPost(temp)
                    
                })
            }else{
                return InsertItem(values.link,values.name,values.description,values.loggedin_user_id,values.list_id)
            }
        }
    }
}

export const GET_LIST = gql`
    query MyQuery($userid:uuid,$listid:uuid!) {
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
    return client.query({
        query:GET_LIST_DESCRIPTION,
        variables:{
            listid:listid
        }
    }).then((response) => response.data);
}

const GET_ITEMS_OF_TAG = gql`
    query MyQuery($tag_id:uuid!,$user_id:uuid!){
        posts_tag(where: {tag_id: {_eq: $tag_id},user_id: {_eq: $user_id}}) {
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
        const tags = response.data.posts_tag.map(tag=>tag.item_id)
        // console.log(tags)
        return client.query({
            query:GET_ITEMS,
            variables:{
                _in:tags
            }
        })
        .then((response)=>response.data).catch((error)=>{})

    })//.catch((error)=>console.log(error))
}

export {createItem,GetList,GetListDescription,GetItemsofTag};