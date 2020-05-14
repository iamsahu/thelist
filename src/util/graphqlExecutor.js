import React,{useContext, useState} from 'react';
import { client } from '../ApolloProvider';
import gql from 'graphql-tag'
import UserContext from '../context/UserContext';
import ContentContext from '../context/ContentContext';
import {FETCH_FEED_ITEMS} from './graphql' 
export {createItem};


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

const createItem =(values) => {
    function FindTagName(id){
        for(var tag in values.tags){
            if(values.tags[tag]['value']===id){
                return values.tags[tag]['text']
            }
        }
        return ''
    }
    
    return client.mutate({
        mutation:gql`
            mutation  {
                insert_items(objects: {
                    link: "${values.link}", 
                    name: "${values.name}", 
                    description: "${values.description}", 
                    curator: "${values.curator}",
                    list_id:"${values.list_id}"}){
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
        `,
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
    }).then((response)=>{
        const item = response.data.insert_items.returning[0];
        console.log(response)
        var temp =[];
        if(values.selTags!==''){
            for(var a in values.selTags){
                // console.log(a)
                tagTemplate['posts_tags']['data']['item_id']=item.id;
                tagTemplate['posts_tags']['data']['user_id'] = values.loggedin_user_id;
                tagTemplate['posts_tags']['name'] = FindTagName(values.selTags[a]);
                tagTemplate['posts_tags']['user_id'] = values.loggedin_user_id;
                // temp.push(tagTemplate)
                temp.push({item_id: item.id, tag_id: values.selTags[a], user_id: values.loggedin_user_id})
            }
        }

        //Write code here to add the new tag as well
        // if(thereIsNewTags){
        //     Add new tag and then add them to posts_tag
        // }

        return client.mutate({
            mutation:gql`
                mutation MyMutation($objects: [posts_tag_insert_input!]! ) {
                    insert_posts_tag(objects: $objects) {
                        returning {
                            item_id
                            tag_id
                            user_id
                            id
                        }
                    }
                }`,
                variables:{
                    objects:temp
                }

            }).then((response)=>({
                response
                
            })).catch(error => { 
                console.log(error) 
        })
        
    }).catch(error=>{
        console.log(error)
    })
}
