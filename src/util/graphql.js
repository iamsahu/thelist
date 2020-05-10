import gql from 'graphql-tag'

export const CREATE_POST_MUTATION = gql`
    mutation ($reason:String!,$link:String){
        insert_posts(objects:{reason:$reason,link:"asdfdfhgjgads"}){
            affected_rows
            returning{
                id
                createdAt
            }
        }
    }
`

export const FETCH_POSTS_QUERY= gql`
    {       
        posts{
            id
            reason
            createdAt
            username
        }
    }
`

export const FETCH_FEED_ITEMS = gql`
    {
        items(order_by: {created_at: desc}) {
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
            user {
                id
            }
        }
    }
`

// export const FETCH_TAGS = gql`
//     {
//         tag(where: {user_tags: {user_id: {_eq: "26b4e98c-b5dc-4810-97b9-909ddc74c4f0"}}}) {
//             user_tags {
//             id
//             }
//             id
//             name
//         }
//     }
// `

export const FETCH_TAGS = gql `
query($user_id:uuid!){
    tag(where: {user_id: {_eq: $user_id}}) {
    name
    id
  }
}
`

export const CREATE_ITEM=gql`
    mutation ($curator:uuid!,$description:String!,$link:String!,$name:String!,$tag:String!) {
        insert_items(objects: {link: $link, name: $name, description: $description, curator: $curator}){
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
            }
        }
    }
`

export const DELETE_ITEM=gql`
    mutation ($item_id:uuid!,$curator:uuid!){
        delete_items(where: {id: {_eq: $item_id},curator: {_eq: $curator}})
    }
`

export const INSERT_TAG=gql`
    mutation ($tag:String!,$curator:uuid!){
        insert_tag(objects: {name: $tag, user_id: $curator}) {
            returning {
            id
            }
        }
    }
`

// export const CREATE_ITEM=gql`
//     mutation($curator:uuid!,$description:String!,$link:String!,$name:String!,$tag:String!){
//         insert_items(objects: 
//         {
//             curator: $curator,
//             description: $description, 
//             link: $link, 
//             name: $name, 
//             user: {
//                 data: {
//                     user_tags: {
//                         data: {
//                             tag: {
//                                 data: {
//                                     name: $tag, 
//                                     user_tags: {
//                                         data: {
//                                             tag: {
//                                                 data: {
//                                                     name: $tag
//                                                 }
//                                             }
//                                             }
//                                         }
//                                     }
//                                 }
//                             }
//                         }
//                     }
//                 }
//             }
//         ) 
//         {
//             affected_rows
//             returning {
//             id
//             description
//             link
//             name
//             }
//         }
//     }

// `