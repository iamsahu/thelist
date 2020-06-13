import gql from "graphql-tag";

export const CREATE_POST_MUTATION = gql`
	mutation($reason: String!, $link: String) {
		insert_posts(objects: { reason: $reason, link: "asdfdfhgjgads" }) {
			affected_rows
			returning {
				id
				createdAt
			}
		}
	}
`;

export const FETCH_POSTS_QUERY = gql`
	{
		posts {
			id
			reason
			createdAt
			username
		}
	}
`;

export const FETCH_FEED_ITEMS = gql`
	{
		items(order_by: { created_at: desc }) {
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
`;

export const FETCH_FEED_ITEMS_OFCURATOR = gql`
	query FETCH_FEED_ITEMS_OFCURATOR($curator_id: String!) {
		items(
			where: { user: { id: { _eq: $curator_id } } }
			order_by: { created_at: desc }
		) {
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
			posts_tags(where: {}) {
				tag_id
			}
			share_count
			view_count
			user {
				id
			}
		}
	}
`;

export const FETCH_FEED_ITEMS_OFCURATOR_LISTID = gql`
	query MyQuery($curator_id: String!, $list_id: uuid!) {
		items(
			where: { user: { id: { _eq: $curator_id } }, list_id: { _eq: $list_id } }
			order_by: { created_at: desc }
		) {
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
			posts_tags(where: {}) {
				tag_id
			}
			share_count
			view_count
			user {
				id
			}
		}
	}
`;

export const COMBINED_FETCH = gql`
	query($user_id: String!) {
		lists(
			where: { curator_id: { _eq: $user_id } }
			order_by: { list_name: asc }
		) {
			list_name
			id
			description
			curator_id
		}
		tag(order_by: { name: asc }) {
			id
			name
			user_id
		}
		item_bookmark(
			where: { user_id: { _eq: $user_id } }
			order_by: { created_at: desc_nulls_last }
		) {
			curator
			id
			user {
				id
				username
			}
		}
	}
`;

export const FETCH_ALL = gql`
	query {
		lists {
			list_name
			id
			description
			curator_id
		}
		tag {
			id
			name
			user_id
		}
	}
`;

export const FETCH_TAGS = gql`
	query($user_id: String!) {
		tag(where: { user_id: { _eq: $user_id } }) {
			name
			id
		}
	}
`;

export const FETCH_LISTS = gql`
	query($curator_id: String!) {
		lists(where: { user_id: { _eq: $curator_id } }) {
			id
			list_name
			curator_id
			description
		}
	}
`;

export const CREATE_ITEM = gql`
	mutation(
		$curator: uuid!
		$description: String!
		$link: String!
		$name: String!
		$list_id: uuid
	) {
		insert_items(
			objects: {
				link: $link
				name: $name
				description: $description
				curator: $curator
				list_id: $list_id
			}
		) {
			affected_rows
			returning {
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
`;

export const CREATE_LIST = gql`
	mutation($list_name: String!, $description: String!, $curator: String!) {
		insert_lists(
			objects: {
				list_name: $list_name
				description: $description
				curator_id: $curator
			}
		) {
			returning {
				id
				description
				list_name
				curator_id
			}
		}
	}
`;

export const DELETE_ITEM = gql`
	mutation($item_id: uuid!, $curator: uuid!) {
		delete_items(where: { id: { _eq: $item_id }, curator: { _eq: $curator } }) {
			returning {
				id
			}
		}
	}
`;

export const INSERT_TAG = gql`
	mutation($tag: String!, $curator: uuid!) {
		insert_tag(objects: { name: $tag, user_id: $curator }) {
			returning {
				id
			}
		}
	}
`;

// gql`type tag_insert_input{
//     name:String!
//     user_id:uuid!
// }``

export const INSERT_TAGS = gql`
	mutation($objects: [tag_insert_input!]!) {
		insert_tags(objects: $objects) {
			returning {
				id
			}
		}
	}
`;

export const INSERT_TAGS2 = gql`
	mutation MyMutation($objects: [tag_insert_input!]!) {
		insert_tag(objects: $objects) {
			returning {
				name
			}
		}
	}
`;

//Inserting new tag
export const INSERT_TAG_ARTICLE = gql`
	mutation MyMutation($name: String!, $curator_id: String!, $item_id: uuid!) {
		insert_tag(
			objects: {
				name: $name
				user_id: $curator_id
				posts_tags: { data: { user_id: $curator_id, item_id: $item_id } }
			}
		) {
			returning {
				id
				name
				user_id
			}
		}
	}
`;

export const INSERT_ITEM_OLD_TAG = gql`
	mutation MyMutation(
		$curator: uuid!
		$description: String!
		$link: String!
		$name: String!
		$list_id: uuid
		$tag_id: uuid!
	) {
		insert_items(
			objects: {
				description: $description
				curator: $curator
				link: $link
				list_id: $list_id
				name: $name
				posts_tags: { data: { tag_id: $tag_id } }
			}
		) {
			returning {
				appreciation_count
				bookmarks_count
				copy_count
				curator
				description
				id
				link
				list_id
				share_count
				view_count
				name
			}
		}
	}
`;

// var xyz=gql`type posts_tag_insert_input {
//     tag_id: uuid!
// }`

export const INSERT_ITEM_OLD_TAG_MULTI = gql`
	mutation MyMutation(
		$data: [posts_tag_insert_input!]!
		$curator: uuid!
		$description: String!
		$link: String!
		$name: String!
		$list_id: uuid
	) {
		insert_items(
			objects: {
				description: $description
				curator: $curator
				link: $link
				list_id: $list_id
				name: $name
				posts_tags: { data: $data }
			}
		) {
			returning {
				appreciation_count
				bookmarks_count
				copy_count
				curator
				description
				id
				link
				list_id
				share_count
				view_count
				name
				user {
					id
				}
			}
		}
	}
`;

export const INSERT_TAG_MULTI = gql`
	mutation MyMutation($objects: [tag_insert_input!]!) {
		insert_tag(objects: $objects) {
			returning {
				id
			}
			affected_rows
		}
	}
`;
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
