import { client } from "../ApolloProvider";
import gql from "graphql-tag";
import { COMBINED_FETCH } from "./graphql";

const tagTemplate = {
	posts_tags: {
		data: {
			item_id: "",
			user_id: "",
		},
	},
	name: "",
	user_id: "",
};

const oldTagTemplate = { item_id: "", tag_id: "", user_id: "" };

const TAG_ITEM = gql`
	mutation MyMutation($objects: [item_tag_insert_input!]!) {
		insert_item_tag(objects: $objects) {
			returning {
				item_id
				tag_id
				user_id
				id
				tag {
					name
				}
			}
		}
	}
`;

const INSERT_LIST = gql`
	mutation MyMutation(
		$curator_id: String!
		$list_name: String!
		$description: String
	) {
		insert_lists(
			objects: {
				curator_id: $curator_id
				list_name: $list_name
				description: $description
			}
		) {
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
	mutation MyMutation($objects: [tag_insert_input!]!) {
		insert_tag(objects: $objects) {
			returning {
				id
				name
				user_id
			}
		}
	}
`;

const INSERT_ITEM = gql`
	mutation(
		$link: String
		$name: String!
		$description: String
		$curator: String!
		$list_id: uuid!
		$suggestion: Boolean
		$auto_description: String
		$auto_image: String
	) {
		insert_items(
			objects: {
				link: $link
				name: $name
				description: $description
				curator: $curator
				list_id: $list_id
				suggestion: $suggestion
				auto_description: $auto_description
				auto_image: $auto_image
			}
		) {
			affected_rows
			returning {
				auto_description
				auto_image
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
				suggestion
				user {
					id
					username
				}
				list {
					description
					list_name
					like_lists_aggregate {
						aggregate {
							count
						}
					}
				}
				like_items_aggregate {
					aggregate {
						count
					}
				}
				like_items(where: { user_id: { _eq: $curator } }) {
					user_id
				}
			}
		}
	}
`;

function InsertNewList(curator_id, list_name, listDescription) {
	return client
		.mutate({
			mutation: INSERT_LIST,
			variables: {
				curator_id: curator_id,
				list_name: list_name,
				description: listDescription,
			},
			update: (cache, { data }) => {
				const existingItems = cache.readQuery({
					query: COMBINED_FETCH,
					variables: {
						user_id: curator_id,
					},
				});
				// console.log(existingItems)
				const newItem = data.insert_lists.returning[0];
				// console.log(newItem)
				existingItems.lists.push(newItem);
				// console.log(existingItems)
				cache.writeQuery({
					query: COMBINED_FETCH,
					variables: {
						user_id: curator_id,
					},
					data: existingItems,
				});
			},
			refetchQueries: [
				{
					query: COMBINED_FETCH,
					variables: {
						user_id: curator_id,
					},
				},
			],
		})
		.catch((error) => {
			console.log(error);
		});
	// .then((response)=>({
	//     response
	// }))
	// console.log(values.list_id)
}

function InsertNewTags(tags, curator_id) {
	return client
		.mutate({
			mutation: INSERT_TAGS,
			variables: {
				objects: tags,
			},
			update: (cache, { data }) => {
				const existingItems = cache.readQuery({
					query: COMBINED_FETCH,
					variables: {
						user_id: curator_id,
					},
				});
				const newItem = data.insert_tag.returning[0];
				existingItems.tag.push(newItem);
				cache.writeQuery({
					query: COMBINED_FETCH,
					variables: {
						user_id: curator_id,
					},
					data: existingItems,
				});
			},
			refetchQueries: [
				{
					query: COMBINED_FETCH,
					variables: {
						user_id: curator_id,
					},
				},
			],
		})
		.catch((error) => {
			console.log(error);
		});
}

function InsertItem(
	link,
	name,
	description,
	curator_id,
	list_id,
	contentType,
	currentListID,
	currentTagID,
	suggestion,
	auto_description,
	auto_image
) {
	// console.log(contentType)
	// console.log(currentListID)
	// console.log(currentTagID)
	// console.log(link)
	// console.log(name)
	// console.log(description)
	// console.log(curator_id)
	// console.log(list_id)
	var q;
	if (contentType === "lists") {
		if (currentListID === "") {
			q = [
				{
					query: GET_ITEMS_USER,
					variables: {
						userid: curator_id,
					},
				},
			];
		} else {
			console.log("Here list");
			q = [
				{
					query: GET_LIST,
					variables: {
						userid: curator_id,
						listid: currentListID,
					},
				},
			];
		}
	} else if (contentType === "tags") {
		if (currentTagID === "") {
			q = [
				{
					query: GET_ITEMS_USER,
					variables: {
						userid: curator_id,
					},
				},
			];
		} else {
			q = [
				{
					query: GTI,
					variables: {
						id: currentTagID,
						user_id: curator_id,
					},
				},
			];
		}
	} else {
		return client
			.mutate({
				mutation: INSERT_ITEM,
				variables: {
					link: link,
					name: name,
					description: description,
					curator: curator_id,
					list_id: list_id,
					suggestion: suggestion,
					auto_image: auto_image,
					auto_description: auto_description,
				},
			})
			.catch((error) => {
				console.log(error);
			});
	}

	return client
		.mutate({
			mutation: INSERT_ITEM,
			variables: {
				link: link,
				name: name,
				description: description,
				curator: curator_id,
				list_id: list_id,
				suggestion: suggestion,
				auto_image: auto_image,
				auto_description: auto_description,
			},
			update: (cache, { data }) => {
				if (contentType === "lists") {
					if (currentListID === "") {
						const existingItems = cache.readQuery({
							query: GET_ITEMS_USER,
							variables: {
								userid: curator_id,
							},
						});
						// console.log(existingItems)
						const newItem = data.insert_items.returning[0];
						cache.writeQuery({
							query: GET_ITEMS_USER,
							variables: {
								userid: curator_id,
							},
							data: { items: [newItem, ...existingItems.items] },
						});
					} else {
						// console.log('here')
						const existingItems = cache.readQuery({
							query: GET_LIST,
							variables: {
								userid: curator_id,
								listid: currentListID,
							},
						});
						const newItem = data.insert_items.returning[0];
						// console.log(newItem)
						cache.writeQuery({
							query: GET_LIST,
							variables: {
								userid: curator_id,
								listid: currentListID,
							},
							data: { items: [newItem, ...existingItems.items] },
						});
					}
				} else if (contentType === "tags") {
					if (currentTagID === "") {
						const existingItems = cache.readQuery({
							query: GET_ITEMS_USER,
							variables: {
								userid: curator_id,
							},
						});
						// console.log(existingItems)
						const newItem = data.insert_items.returning[0];
						cache.writeQuery({
							query: GET_ITEMS_USER,
							variables: {
								userid: curator_id,
							},
							data: { items: [newItem, ...existingItems.items] },
						});
					} else {
						//TODO: Tag based cache update
						// console.log('Here in tag')
						const itemidsoftag = cache.readQuery({
							query: GET_ITEMS_OF_TAG,
							variables: {
								tag_id: currentTagID,
								user_id: curator_id,
							},
						});
						// console.log(itemidsoftag)
						const itemids = itemidsoftag.item_tag.map((tag) => tag.item_id);
						const itemsoftag = cache.readQuery({
							query: GET_ITEMS,
							variables: {
								_in: itemids,
								user_id: curator_id,
							},
						});
						// console.log(data.insert_items.returning[0])
						// console.log(itemsoftag)
						cache.writeQuery({
							query: GET_ITEMS,
							variables: {
								_in: itemids,
								user_id: curator_id,
							},
							data: {
								items: [data.insert_items.returning[0], ...itemsoftag.items],
							},
						});
					}
				}
				// console.log(list_id);
				// console.log(listfeed);
				// var temp = listfeed.feed("listfeed", list_id);
				console.log(data.insert_items.returning);
				// listfeed
				// 	.addActivity({
				// 		// actor: listfeed.currentUser.client.currentUser.id,
				// 		actor: listfeed.client.id, //.currentUser,
				// 		verb: "additem",
				// 		object: data.insert_items.returning[0].id,
				// 		to: ["listfeed:" + list_id],
				// 		foreign_id: "item:" + data.insert_items.returning[0].id,
				// 	})
				// 	.then((response) => console.log(response));
			},
			refetchQueries: [
				{
					query: COMBINED_FETCH,
					variables: {
						user_id: curator_id,
					},
				},
			],
			// refetchQueries:q
			// ,fetchPolicy:"cache-and-network"
		})
		.catch((error) => {
			console.log(error);
		});
}

function InsertTagPost(temp) {
	return client
		.mutate({
			mutation: TAG_ITEM,
			variables: {
				objects: temp,
			},
		})
		.catch((error) => {
			console.log(error);
		});
}

const createItem = (values) => {
	console.log(values);
	function FindTagName(id) {
		for (var tag in values.tags) {
			if (values.tags[tag]["value"] === id) {
				return values.tags[tag]["text"];
				break;
			}
		}
		return "";
	}
	var newListID = false;
	var newTag = false;
	var oldTag = false;
	var newTags = [];
	var oldTags = [];
	if (
		/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
			values.list_id
		)
	) {
		//The supplied list_id works
	} else {
		//New list name has to be inserted
		console.log(values.list_id);
		newListID = true;
	}
	if (values.selTags !== "") {
		for (var a in values.selTags) {
			if (FindTagName(values.selTags[a]) === "") {
				newTag = true;
				newTags.push({ name: values.selTags[a], user_id: values.curator_id });
			} else {
				oldTag = true;
				oldTags.push({ tag_id: values.selTags[a] });
			}
		}
	}

	if (values.contentType === "tags") {
		//If the added tag to article also has the tag with which the current content is being displayed
	} else if (values.contentType === "lists") {
		//If current list is open is the list to which the new item is being added
	}

	if (newListID) {
		if (newTag) {
			if (oldTag) {
				return InsertNewList(
					values.curator_id,
					values.list_id,
					values.listDescription
				)
					.then((response) => {
						values.list_id = response.data.insert_lists.returning[0].id;
						return InsertItem(
							values.link,
							values.name,
							values.description,
							values.curator_id,
							values.list_id,
							values.contentType,
							values.currentListID,
							values.currentTagID,
							values.suggestion,
							values.auto_description,
							values.auto_image
						)
							.then((response) => {
								const item = response.data.insert_items.returning[0];
								console.log(response);
								return InsertNewTags(newTags, values.curator_id)
									.then((response) => {
										// console.log(response)
										// console.log(item.id)
										const receivedTags = response.data.insert_tag.returning;
										var temp = [];
										for (var x in receivedTags) {
											temp.push({
												item_id: item.id,
												tag_id: receivedTags[x].id,
												user_id: values.curator_id,
											});
										}
										for (var y in oldTags) {
											temp.push({
												item_id: item.id,
												tag_id: oldTags[y].tag_id,
												user_id: values.curator_id,
											});
										}
										return InsertTagPost(temp).catch((error) => {
											console.log(error);
										});
									})
									.catch((error) => {
										console.log(error);
									});
							})
							.catch((error) => {
								console.log(error);
							});
					})
					.catch((error) => {
						console.log(error);
					});
			} else {
				return InsertNewList(
					values.curator_id,
					values.list_id,
					values.listDescription
				)
					.then((response) => {
						values.list_id = response.data.insert_lists.returning[0].id;
						return InsertItem(
							values.link,
							values.name,
							values.description,
							values.curator_id,
							values.list_id,
							values.contentType,
							values.currentListID,
							values.currentTagID,
							values.suggestion,
							values.auto_description,
							values.auto_image
						)
							.then((response) => {
								const item = response.data.insert_items.returning[0];
								// console.log(response)
								return InsertNewTags(newTags, values.curator_id)
									.then((response) => {
										// console.log(response)
										// console.log(item.id)
										const receivedTags = response.data.insert_tag.returning;
										var temp = [];
										for (var x in receivedTags) {
											temp.push({
												item_id: item.id,
												tag_id: receivedTags[x].id,
												user_id: values.curator_id,
											});
										}
										// console.log(temp)
										return InsertTagPost(temp).catch((error) => {
											console.log(error);
										});
									})
									.catch((error) => {
										console.log(error);
									});
							})
							.catch((error) => {
								console.log(error);
							});
					})
					.catch((error) => {
						console.log(error);
					});
			}
		} else {
			if (oldTag) {
				return InsertNewList(
					values.curator_id,
					values.list_id,
					values.listDescription
				)
					.then((response) => {
						values.list_id = response.data.insert_lists.returning[0].id;
						return InsertItem(
							values.link,
							values.name,
							values.description,
							values.curator_id,
							values.list_id,
							values.contentType,
							values.currentListID,
							values.currentTagID,
							values.suggestion,
							values.auto_description,
							values.auto_image
						)
							.then((response) => {
								const item = response.data.insert_items.returning[0];
								console.log(response);
								var temp = [];
								for (var a in oldTags) {
									temp.push({
										item_id: item.id,
										tag_id: oldTags[a].tag_id,
										user_id: values.curator_id,
									});
								}
								return InsertTagPost(temp).catch((error) => {
									console.log(error);
								});
							})
							.catch((error) => {
								console.log(error);
							});
					})
					.catch((error) => {
						console.log(error);
					});
			} else {
				return InsertNewList(
					values.curator_id,
					values.list_id,
					values.listDescription
				)
					.then((response) => {
						values.list_id = response.data.insert_lists.returning[0].id;
						return InsertItem(
							values.link,
							values.name,
							values.description,
							values.curator_id,
							values.list_id,
							values.contentType,
							values.currentListID,
							values.currentTagID,
							values.suggestion,
							values.auto_description,
							values.auto_image
						).catch((error) => {
							console.log(error);
						});
					})
					.catch((error) => {
						console.log(error);
					});
			}
		}
	} else {
		if (newTag) {
			if (oldTag) {
				return InsertItem(
					values.link,
					values.name,
					values.description,
					values.curator_id,
					values.list_id,
					values.contentType,
					values.currentListID,
					values.currentTagID,
					values.suggestion,
					values.auto_description,
					values.auto_image
				)
					.then((response) => {
						const item = response.data.insert_items.returning[0];
						// console.log(response)
						return InsertNewTags(newTags, values.curator_id)
							.then((response) => {
								// console.log(response)
								// console.log(item.id)
								const receivedTags = response.data.insert_tag.returning;
								var temp = [];
								for (var x in receivedTags) {
									temp.push({
										item_id: item.id,
										tag_id: receivedTags[x].id,
										user_id: values.curator_id,
									});
								}
								for (var y in oldTags) {
									temp.push({
										item_id: item.id,
										tag_id: oldTags[y].tag_id,
										user_id: values.curator_id,
									});
								}
								return InsertTagPost(temp).catch((error) => {
									console.log(error);
								});
							})
							.catch((error) => {
								console.log(error);
							});
					})
					.catch((error) => {
						console.log(error);
					});
			} else {
				return InsertItem(
					values.link,
					values.name,
					values.description,
					values.curator_id,
					values.list_id,
					values.contentType,
					values.currentListID,
					values.currentTagID,
					values.suggestion,
					values.auto_description,
					values.auto_image
				)
					.then((response) => {
						const item = response.data.insert_items.returning[0];
						// console.log(response)
						return InsertNewTags(newTags, values.curator_id)
							.then((response) => {
								// console.log(response)
								// console.log(item.id)
								const receivedTags = response.data.insert_tag.returning;
								var temp = [];
								for (var x in receivedTags) {
									temp.push({
										item_id: item.id,
										tag_id: receivedTags[x].id,
										user_id: values.curator_id,
									});
								}
								return InsertTagPost(temp);
							})
							.catch((error) => {
								console.log(error);
							});
					})
					.catch((error) => {
						console.log(error);
					});
			}
		} else {
			if (oldTag) {
				return InsertItem(
					values.link,
					values.name,
					values.description,
					values.curator_id,
					values.list_id,
					values.contentType,
					values.currentListID,
					values.currentTagID,
					values.suggestion,
					values.auto_description,
					values.auto_image
				)
					.then((response) => {
						const item = response.data.insert_items.returning[0];
						// console.log(response)
						var temp = [];
						for (var a in oldTags) {
							temp.push({
								item_id: item.id,
								tag_id: oldTags[a].tag_id,
								user_id: values.curator_id,
							});
						}
						return InsertTagPost(temp);
					})
					.catch((error) => console.log(error));
			} else {
				return InsertItem(
					values.link,
					values.name,
					values.description,
					values.curator_id,
					values.list_id,
					values.contentType,
					values.currentListID,
					values.currentTagID,
					values.suggestion,
					values.auto_description,
					values.auto_image
				).catch((error) => {
					console.log(error);
				});
			}
		}
	}
};

export const GET_LIST = gql`
	query MyQuery($userid: String, $listid: uuid!) {
		items(
			order_by: { created_at: desc_nulls_last }
			where: { list_id: { _eq: $listid } }
		) {
			auto_description
			auto_image
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
			suggestion
			view_count
			user {
				id
				username
			}
			list {
				description
				list_name
				like_lists_aggregate {
					aggregate {
						count
					}
				}
			}
			like_items_aggregate {
				aggregate {
					count
				}
			}
			like_items(where: { user_id: { _eq: $userid } }) {
				user_id
			}
			item_bookmarks(where: { user_id: { _eq: $userid } }) {
				item_id
			}
		}
		like_list(where: { list_id: { _eq: $listid }, user_id: { _eq: $userid } }) {
			list_id
			user_id
			id
		}
		lists(where: { id: { _eq: $listid } }) {
			description
			list_name
			id
			image_url
			like_lists_aggregate {
				aggregate {
					count
				}
			}
		}
	}
`;

const GetList = (values) => {
	return client
		.query({
			query: GET_LIST,
			variables: {
				userid: values.userid,
				listid: values.listid,
			},
		})
		.then((response) => response.data);
};

export const GET_LIST_DESCRIPTION = gql`
	query MyQuery($listid: uuid) {
		lists(where: { id: { _eq: $listid } }) {
			curator_id
			description
			id
			list_name
		}
	}
`;

const GetListDescription = (listid) => {
	// console.log(listid.listid)
	return client
		.query({
			query: GET_LIST_DESCRIPTION,
			variables: {
				listid: listid.listid,
			},
		})
		.then((response) => response.data)
		.catch((error) => console.log(error));
};

const GET_ITEMS_OF_TAG = gql`
	query MyQuery($tag_id: uuid!, $user_id: String!) {
		item_tag(where: { tag_id: { _eq: $tag_id }, user_id: { _eq: $user_id } }) {
			item_id
		}
	}
`;

const GET_ITEMS = gql`
	query MyQuery($_in: [uuid!]!, $user_id: String!) {
		items(where: { id: { _in: $_in } }) {
			auto_description
			auto_image
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
			suggestion
			view_count
			user {
				id
				username
			}
			list {
				description
				list_name
				like_lists_aggregate {
					aggregate {
						count
					}
				}
			}
			like_items_aggregate {
				aggregate {
					count
				}
			}
			like_items(where: { user_id: { _eq: $user_id } }) {
				user_id
			}
			item_bookmarks(where: { user_id: { _eq: $user_id } }) {
				item_id
			}
		}
	}
`;

const GetItemsofTag = (values) => {
	// console.log(values)
	return client
		.query({
			query: GET_ITEMS_OF_TAG,
			variables: {
				tag_id: values.tag_id,
				user_id: values.user_id,
			},
		})
		.then((response) => {
			// console.log(response)
			const items = response.data.item_tag.map((tag) => tag.item_id);
			return client
				.query({
					query: GET_ITEMS,
					variables: {
						_in: items,
						user_id: values.user_id,
					},
				})
				.then((response) => response.data)
				.catch((error) => {
					console.log(error);
				});
		})
		.catch((error) => console.log(error));
};

const GET_ITEMS_USER = gql`
	query MyQuery($userid: String!) {
		items(
			order_by: { created_at: desc_nulls_last }
			where: { user: { id: { _eq: $userid } } }
		) {
			auto_description
			auto_image
			appreciation_count
			copy_count
			bookmarks_count
			curator
			description
			id
			link
			list_id
			name
			suggestion
			user {
				id
				username
			}
			share_count
			view_count
			like_items(where: { user_id: { _eq: $userid } }) {
				user_id
			}
			list {
				description
				list_name
				like_lists_aggregate {
					aggregate {
						count
					}
				}
			}
			like_items_aggregate {
				aggregate {
					count
				}
			}
			item_bookmarks(where: { user_id: { _eq: $userid } }) {
				item_id
			}
		}
	}
`;

const GetItemsUsers = (values) => {
	// console.log(values)
	return client
		.query({
			query: GET_ITEMS_USER,
			variables: {
				userid: values.curator_id,
			},
		})
		.then((response) => response.data)
		.catch((error) => {
			console.log(error);
		});
};

// const COMBINED_FETCH = gql`
//     query  ($user_id:String!){
//         lists(where: {curator_id: {_eq: $user_id}}) {
//             list_name
//             id
//             description
//             curator_id
//         }
//         tag(where: {user_id: {_eq: $user_id}}) {
//             id
//             name
//             user_id
//         }
//     }
// `

const GetTagsListsUsers = (values) => {
	// console.log(values);
	return client
		.query({
			query: COMBINED_FETCH,
			variables: {
				user_id: values.curator_id,
			},
		})
		.then((response) => response.data)
		.catch((error) => console.log(error));
};

export const MODIFY_USER = gql`
	mutation MyMutation($user_id: String, $description: String) {
		update_user(
			where: { id: { _eq: $user_id } }
			_set: { description: $description }
		) {
			returning {
				id
				description
				image_link
				username
			}
		}
	}
`;

export const GET_USER = gql`
	query MyQuery($user_id: String) {
		user(where: { id: { _eq: $user_id } }) {
			id
			image_link
			description
			username
			buymeacoffee
		}
	}
`;

const DoesUserExists = (values) => {
	// console.log(values)
	return client
		.query({
			query: GET_USER,
			variables: {
				user_id: values.user_id,
			},
		})
		.then((response) => response.data)
		.catch((error) => console.log(error));
};

const INSERT_USER = gql`
	mutation MyMutation($id: String, $image_link: String, $username: String) {
		insert_user(
			objects: { id: $id, image_link: $image_link, username: $username }
		) {
			returning {
				id
				image_link
				description
				username
			}
		}
	}
`;

const InsertUser = (values) => {
	return client
		.mutate({
			mutation: INSERT_USER,
			variables: {
				id: values.id,
				image_link: values.image_link,
				username: values.username,
			},
		})
		.then((response) => response.data)
		.catch((error) => console.log(error));
};

const SEARCH = gql`
	query MyQuery($search: String) {
		search_lists(args: { search: $search }) {
			list_name
			id
			description
			curator_id
			user {
				username
				description
				image_link
			}
		}
	}
`;

const Search = (values) => {
	return client
		.query({
			query: SEARCH,
			variables: {
				search: values.search,
			},
		})
		.then((response) => response.data)
		.catch((error) => console.log(error));
};

const GET_ALL_LISTS = gql`
	query MyQuery {
		lists(order_by: { view_count: desc }) {
			description
			id
			curator_id
			list_name
			image_url
			user {
				username
				image_link
			}
		}
	}
`;

const GetAllLists = () => {
	return client
		.query({
			query: GET_ALL_LISTS,
		})
		.then((response) => response.data)
		.catch((error) => console.log(error));
};

const GET_ALL_TAGS = gql`
	query MyQuery {
		tag(order_by: { name: asc }) {
			id
			name
			user_id
			user {
				username
			}
		}
	}
`;

const GetAllTags = () => {
	return client
		.query({
			query: GET_ALL_TAGS,
		})
		.then((response) => response.data)
		.catch((error) => console.log(error));
};

const GET_ALL_USERS = gql`
	query MyQuery {
		user(
			order_by: { created_at: desc_nulls_last }
			where: { delete_status: { _eq: false } }
		) {
			description
			id
			image_link
			username
			lists_aggregate {
				aggregate {
					count
					sum {
						view_count
					}
				}
			}
			items_aggregate {
				aggregate {
					count
					sum {
						appreciation_count
					}
				}
			}
		}
	}
`;

const GetAllUsers = () => {
	return client
		.query({
			query: GET_ALL_USERS,
		})
		.then((response) => response.data);
};

const DELETE_ITEM = gql`
	mutation MyMutation($id: uuid!) {
		delete_item_tag(where: { item_id: { _eq: $id } }) {
			affected_rows
		}
		delete_items(where: { id: { _eq: $id } }) {
			returning {
				auto_description
				auto_image
				appreciation_count
				copy_count
				bookmarks_count
				curator
				description
				id
				link
				list_id
				name
				suggestion
				user {
					id
					username
				}
				share_count
				view_count
				list {
					description
					list_name
					like_lists_aggregate {
						aggregate {
							count
						}
					}
				}
				like_items_aggregate {
					aggregate {
						count
					}
				}
			}
			affected_rows
		}
	}
`;

const DeleteItem = (id) => {
	// console.log(id)
	// return "0"

	var q, q2;
	if (id.contentType === "lists") {
		if (id.contentID === "") {
			q = [
				{
					query: GET_ITEMS_USER,
					variables: {
						userid: id.curator,
					},
				},
			];
			q2 = {
				query: GET_ITEMS_USER,
				variables: {
					userid: id.curator,
				},
			};
		} else {
			console.log("This one");
			q = [
				{
					query: GET_LIST,
					variables: {
						userid: id.curator,
						listid: id.contentID,
					},
				},
			];
			q2 = {
				query: GET_LIST,
				variables: {
					userid: id.curator,
					listid: id.contentID,
				},
			};
		}
	} else {
		if (id.contentID === "") {
			q = [
				{
					query: GET_ITEMS_USER,
					variables: {
						userid: id.curator,
					},
				},
			];
			q2 = {
				query: GET_ITEMS_USER,
				variables: {
					userid: id.curator,
				},
			};
		} else {
			q = [
				{
					query: GTI,
					variables: {
						id: id.contentID,
						user_id: id.curator,
					},
				},
			];
			q2 = {
				query: GTI,
				variables: {
					id: id.contentID,
					user_id: id.curator,
				},
			};
		}
	}

	return client
		.mutate({
			mutation: DELETE_ITEM,
			variables: {
				id: id.id,
			},
			update: (cache, { data }) => {
				const existingItems = cache.readQuery(q2);
				// console.log(existingItems)
				// console.log(data.delete_items.returning[0])
				var id = data.delete_items.returning[0].id;
				existingItems.items = existingItems.items.filter(function (e) {
					return e.id !== id;
				});
				// console.log(existingItems)
				q2["data"] = existingItems;
				// console.log(q2)
				//Don't know why this is not needed
				// cache.writeQuery({
				//     q2
				// })
			},

			refetchQueries: q,
		})
		.then((response) => response.data)
		.catch((error) => console.log(error));
};

const LIKE_LIST = gql`
	mutation MyMutation($list_id: uuid!, $user_id: String!) {
		insert_like_list(objects: { list_id: $list_id, user_id: $user_id }) {
			affected_rows
			returning {
				list_id
				user_id
				id
			}
		}
	}
`;

const LikeList = (list_id, user_id) => {
	if (list_id === "" || user_id === "") return;
	return client
		.mutate({
			mutation: LIKE_LIST,
			variables: {
				list_id: list_id,
				user_id: user_id,
			},
			update: (cache, { data }) => {
				const existingItems = cache.readQuery({
					query: GET_LIST,
					variables: {
						userid: user_id,
						listid: list_id,
					},
				});
				console.log(existingItems);
				console.log(data);
				const newItem = data.insert_like_list.returning[0];
				// console.log(newItem)
				existingItems.like_list.push(newItem);
				// console.log(existingItems)
				cache.writeQuery({
					query: GET_LIST,
					variables: {
						userid: user_id,
						listid: list_id,
					},
					data: existingItems,
				});
			},
		})
		.then((response) => response.data)
		.catch((error) => console.log(error));
};

const UNLIKE_LIST = gql`
	mutation MyMutation($list_id: uuid!, $user_id: String!) {
		delete_like_list(
			where: { list_id: { _eq: $list_id }, user_id: { _eq: $user_id } }
		) {
			affected_rows
		}
	}
`;

const UnlikeList = (list_id, user_id) => {
	return client
		.mutate({
			mutation: UNLIKE_LIST,
			variables: {
				list_id: list_id,
				user_id: user_id,
			},
			update: (cache, { data }) => {
				const existingItems = cache.readQuery({
					query: GET_LIST,
					variables: {
						userid: user_id,
						listid: list_id,
					},
				});
				console.log(existingItems);
				console.log(data);
				// const newItem = data.delete_like_list.returning[0];
				// console.log(newItem)
				existingItems.like_list.length = 0;
				// console.log(existingItems)
				cache.writeQuery({
					query: GET_LIST,
					variables: {
						userid: user_id,
						listid: list_id,
					},
					data: existingItems,
				});
			},
		})
		.then((response) => response.data)
		.catch((error) => console.log(error));
};

const LIKE_ITEM = gql`
	mutation MyMutation($item_id: uuid!, $user_id: String!) {
		insert_like_item(objects: { item_id: $item_id, user_id: $user_id }) {
			affected_rows
		}
	}
`;

const LikeItem = (item_id, user_id) => {
	return client
		.mutate({
			mutation: LIKE_ITEM,
			variables: {
				item_id: item_id,
				user_id: user_id,
			},
		})
		.then((response) => response.data)
		.catch((error) => console.log(error));
};

const UNLIKE_ITEM = gql`
	mutation MyMutation($item_id: uuid!, $user_id: String!) {
		delete_like_item(
			where: { item_id: { _eq: $item_id }, user_id: { _eq: $user_id } }
		) {
			affected_rows
		}
	}
`;

const UnlikeItem = (item_id, user_id) => {
	return client
		.mutate({
			mutation: UNLIKE_ITEM,
			variables: {
				item_id: item_id,
				user_id: user_id,
			},
		})
		.then((response) => response.data)
		.catch((error) => console.log(error));
};

const FETCH_ITEM_LIKES = gql`
	query MyQuery($item_id: uuid!, $user_id: String!) {
		like_item_aggregate(
			where: { item_id: { _eq: $item_id }, user_id: { _eq: $user_id } }
		) {
			aggregate {
				count
			}
		}
	}
`;

const GTI = gql`
	query MyQuery($id: uuid, $user_id: String) {
		tag(where: { id: { _eq: $id } }, order_by: { name: asc }) {
			id
			name
			item_tags {
				item {
					appreciation_count
					auto_description
					auto_image
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
					suggestion
					user {
						id
						username
					}
					list {
						description
						list_name
						like_lists_aggregate {
							aggregate {
								count
							}
						}
					}
					like_items_aggregate {
						aggregate {
							count
						}
					}
					like_items(where: { user_id: { _eq: $user_id } }) {
						user_id
					}
					item_bookmarks(where: { user_id: { _eq: $user_id } }) {
						item_id
					}
				}
			}
		}
	}
`;

const GetTagItems = (values) => {
	return client
		.query({
			query: GTI,
			variables: {
				id: values.tag_id,
				user_id: values.user_id,
			},
		})
		.then((response) => response.data)
		.catch((error) => console.log(error));
};

const DOILIKE = gql`
	query DOILIKE($list_id: uuid, $user_id: String) {
		like_list(
			where: { list_id: { _eq: $list_id }, user_id: { _eq: $user_id } }
		) {
			id
		}
	}
`;

const DoILike = (values) => {
	// console.log(values);
	return client
		.query({
			query: DOILIKE,
			variables: {
				list_id: values.list_id,
				user_id: values.user_id,
			},
		})
		.then((response) => response.data)
		.catch((error) => {
			console.log(error);
		});
};

export const CHANGE_LIST_DESCRIPTION = gql`
	mutation MyMutation($id: uuid, $description: String) {
		update_lists(
			where: { id: { _eq: $id } }
			_set: { description: $description }
		) {
			affected_rows
			returning {
				id
				description
				list_name
				curator_id
			}
		}
	}
`;

const ChangeListDescription = (id, description) => {
	return client.mutate({
		mutation: CHANGE_LIST_DESCRIPTION,
		variables: {
			id: id,
			description: description,
		},
	});
};

const INSERT_BOOKMARK = gql`
	mutation MyMutation(
		$curator: String
		$item_id: uuid
		$user_id: String
		$list_id: uuid
	) {
		insert_item_bookmark(
			objects: {
				curator: $curator
				item_id: $item_id
				user_id: $user_id
				list_id: $list_id
			}
		) {
			affected_rows
			returning {
				item_id
				user_id
				curator
				id
			}
		}
	}
`;

const InsertBookmark = (item_id, user_id, curator, list_id) => {
	return client
		.mutate({
			mutation: INSERT_BOOKMARK,
			variables: {
				item_id: item_id,
				user_id: user_id,
				curator: curator,
				list_id: list_id,
			},
			update: (cache, { data }) => {
				const existingItems = cache.readQuery({
					query: HAVEIBOOKMARKED,
					variables: {
						item_id: item_id,
						user_id: user_id,
					},
				});
				console.log(existingItems);
				// const newItem = data.insert_lists.returning[0];
				// console.log(newItem);
				// existingItems.lists.push(newItem);
				// console.log(existingItems)
				// existingItems.item_bookmark_aggregate.aggregate.count = 1;
				cache.writeQuery({
					query: HAVEIBOOKMARKED,
					variables: {
						item_id: item_id,
						user_id: user_id,
					},
					data: existingItems,
				});
			},
			refetchQueries: [
				{
					query: HAVEIBOOKMARKED,
					variables: {
						item_id: item_id,
						user_id: user_id,
					},
				},
			],
		})
		.then((response) => response.data)
		.catch((error) => console.log(error));
};

const DELETE_BOOKMARK = gql`
	mutation MyMutation($curator: String, $item_id: uuid, $user_id: String) {
		delete_item_bookmark(
			where: {
				item_id: { _eq: $item_id }
				curator: { _eq: $curator }
				user_id: { _eq: $user_id }
			}
		) {
			affected_rows
		}
	}
`;

const DeleteBookmark = (item_id, user_id, curator) => {
	return client
		.mutate({
			mutation: DELETE_BOOKMARK,
			variables: {
				item_id: item_id,
				user_id: user_id,
				curator: curator,
			},
		})
		.then((response) => response.data)
		.catch((error) => console.log(error));
};

const GETALL_BOOKMARK_ITEMS = gql`
	query MyQuery($user_id: String) {
		item_bookmark(where: { user_id: { _eq: $user_id } }) {
			item {
				auto_description
				auto_image
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
				suggestion
				view_count
				user {
					id
					username
				}
				list {
					description
					list_name
					like_lists_aggregate {
						aggregate {
							count
						}
					}
				}
				like_items_aggregate {
					aggregate {
						count
					}
				}
				like_items(where: { user_id: { _eq: $user_id } }) {
					user_id
				}
			}
		}
	}
`;

const GetAllBookmarkItems = (user_id) => {
	return client
		.query({
			query: GETALL_BOOKMARK_ITEMS,
			variables: {
				user_id: user_id,
			},
		})
		.then((response) => response.data)
		.catch((error) => console.log(error));
};

const GETBOOKMARKSOFCURATOR = gql`
	query MyQuery($user_id: String, $curator: String) {
		item_bookmark(
			where: { user_id: { _eq: $user_id }, curator: { _eq: $curator } }
			order_by: { created_at: desc_nulls_last }
		) {
			item {
				auto_description
				auto_image
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
				suggestion
				view_count
				user {
					id
					username
				}
				list {
					description
					list_name
					like_lists_aggregate {
						aggregate {
							count
						}
					}
				}
				like_items_aggregate {
					aggregate {
						count
					}
				}
				like_items(where: { user_id: { _eq: $user_id } }) {
					user_id
				}
				item_bookmarks(where: { user_id: { _eq: $user_id } }) {
					item_id
					user {
						username
					}
				}
			}
		}
	}
`;

const GetBookmarkItemsOfCurator = (user_id, curator) => {
	return client
		.query({
			query: GETBOOKMARKSOFCURATOR,
			variables: {
				user_id: user_id,
				curator: curator,
			},
		})
		.then((response) => response.data)
		.catch((error) => console.log(error));
};

const BOOKMARKS = gql`
	query MyQuery($user_id: String) {
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

const GetBookmarksOfUser = (user_id) => {
	return client
		.query({
			query: BOOKMARKS,
			variables: {
				user_id: user_id,
			},
		})
		.then((response) => response.data)
		.catch((error) => console.log(error));
};

const CURRENTCONSUMPTION = gql`
	query MyQuery($user_id: String) {
		items_youtube(
			where: { user_id: { _eq: $user_id } }
			order_by: { created_at: desc_nulls_last }
		) {
			auto_description
			created_at
			description
			embed
			id
			link
			title
			user_id
		}
		items_twitter(
			where: { user_id: { _eq: $user_id } }
			order_by: { created_at: desc_nulls_last }
		) {
			user_name
			user_id
			link
			id
			embed
			description
			created_at
		}
		items_pocket(
			where: { user_id: { _eq: $user_id } }
			order_by: { created_at: desc_nulls_last }
		) {
			user_id
			title
			link
			id
			description
			created_at
			auto_image
			auto_description
		}
		items_medium(
			order_by: { created_at: desc_nulls_last }
			where: { user_id: { _eq: $user_id } }
		) {
			user_id
			title
			link
			id
			description
			created_at
			auto_description
		}
	}
`;

const GetConsumptionOfUser = (user_id) => {
	return client
		.query({
			query: CURRENTCONSUMPTION,
			variables: {
				user_id: user_id,
			},
		})
		.then((response) => response.data)
		.catch((error) => console.log(error));
};

const GETCONTENTBETWEEN = gql`
	query MyQuery($start: timestamptz, $end: timestamptz, $user_id: String) {
		items_medium(
			where: {
				created_at: { _gte: $start, _lte: $end }
				user_id: { _eq: $user_id }
			}
			order_by: { created_at: desc_nulls_last }
		) {
			user_id
			title
			link
			id
			description
			created_at
			auto_description
			image
		}
		items_youtube(
			where: {
				created_at: { _gte: $start, _lte: $end }
				user_id: { _eq: $user_id }
			}
			order_by: { created_at: desc_nulls_last }
		) {
			auto_description
			created_at
			description
			embed
			id
			link
			title
			user_id
			image
		}
		items_twitter(
			where: {
				created_at: { _gte: $start, _lte: $end }
				user_id: { _eq: $user_id }
			}
			order_by: { created_at: desc_nulls_last }
		) {
			user_name
			user_id
			link
			id
			embed
			description
			created_at
		}
		items_pocket(
			where: {
				user_id: { _eq: $user_id }
				created_at: { _gte: $start, _lte: $end }
			}
			order_by: { created_at: desc_nulls_last }
		) {
			user_id
			title
			link
			id
			description
			created_at
			auto_image
			auto_description
		}
	}
`;

const GetConsumptionOfUserBetween = (start, end, user_id) => {
	return client
		.query({
			query: GETCONTENTBETWEEN,
			variables: {
				start: start,
				end: end,
				user_id: user_id,
			},
		})
		.then((response) => response.data)
		.catch((error) => console.log(error));
};

const GETLISTSOFUSER = gql`
	query MyQuery($user_id: String) {
		lists(
			order_by: { created_at: desc_nulls_last }
			where: { user: { id: { _eq: $user_id } } }
		) {
			created_at
			curator_id
			description
			id
			list_name
			image_url
			view_count
			like_lists_aggregate {
				aggregate {
					count
				}
			}
			items {
				like_items_aggregate {
					aggregate {
						count
					}
				}
			}
			user {
				username
				description
				image_link
			}
		}
	}
`;

const GetListsOfUser = (user_id) => {
	return client
		.query({
			query: GETLISTSOFUSER,
			variables: {
				user_id: user_id,
			},
		})
		.then((response) => response.data)
		.catch((error) => console.log(error));
};

const TAGSBYUSER = gql`
	query MyQuery($user_id: String) {
		tag(where: { user_id: { _eq: $user_id } }) {
			name
			id
		}
	}
`;

const GetTagsOfUser = (user_id) => {
	return client
		.query({
			query: TAGSBYUSER,
			variables: {
				user_id: user_id,
			},
		})
		.then((response) => response.data)
		.catch((error) => console.log(error));
};

const GETONELIST = gql`
	query MyQuery($curator_id: String!) {
		lists(
			limit: 1
			where: { curator_id: { _eq: $curator_id } }
			order_by: { created_at: desc_nulls_last }
		) {
			created_at
			curator_id
			description
			id
			list_name
			view_count
			image_url
			items(order_by: { created_at: desc_nulls_last }) {
				appreciation_count
				auto_description
				auto_image
				bookmarks_count
				copy_count
				created_at
				curator
				description
				id
				link
				name
				share_count
				view_count
				suggestion
				user {
					id
					username
				}
			}
		}
	}
`;

const GetOneListOfUser = (curator_id) => {
	return client
		.query({
			query: GETONELIST,
			variables: {
				curator_id: curator_id,
			},
		})
		.then((response) => response.data)
		.catch((error) => console.log(error));
};

const INCREMENT_LIST_VIEW = gql`
	mutation INCREMENT_LIST_VIEW($list_id: uuid) {
		update_lists(where: { id: { _eq: $list_id } }, _inc: { view_count: 1 }) {
			affected_rows
			returning {
				id
			}
		}
	}
`;

const IncrementListView = (list_id) => {
	return client
		.mutate({
			mutation: INCREMENT_LIST_VIEW,
			variables: {
				list_id: list_id,
			},
		})
		.then((response) => response.data)
		.catch((error) => console.log(error));
};
// = {list_id: "", link: "", description: "", name: ""}
const INSERT_MULTIPLE_ITEMS = gql`
	mutation MyMutation($objects: [items_insert_input!]!) {
		insert_items(objects: $objects) {
			returning {
				id
				appreciation_count
				auto_description
				auto_image
				bookmarks_count
				copy_count
				created_at
				curator
				description
				suggestion
				link
				user {
					id
					username
				}
				name
				list_id
				share_count
				view_count
			}
		}
	}
`;

const InsertMultiple = (items) => {
	return client
		.mutate({
			mutation: INSERT_MULTIPLE_ITEMS,
			variables: {
				objects: items,
			},
		})
		.catch((error) => console.log(error));
};

const GETITEMNOTES = gql`
	query MyQuery($curator: String) {
		items(
			where: { list_id: { _is_null: true }, curator: { _eq: $curator } }
			order_by: { created_at: desc_nulls_last }
		) {
			curator
			description
			id
			copy_count
			created_at
			bookmarks_count
			auto_image
			auto_description
			appreciation_count
			link
			name
			share_count
			view_count
			suggestion
			user {
				id
				username
			}
			notes(order_by: { created_at: desc_nulls_last }) {
				comment
				id
				text
				item {
					link
				}
			}
		}
	}
`;

const GetItemNotesOfUser = (curator_id) => {
	return client
		.query({
			query: GETITEMNOTES,
			variables: {
				curator: curator_id,
			},
		})
		.then((response) => response.data)
		.catch((error) => console.log(error));
};

const FOLLOWLIST = gql`
	mutation MyMutation($list_id: uuid, $user_id: String) {
		insert_list_follow(objects: { list_id: $list_id, user_id: $user_id }) {
			returning {
				id
			}
		}
	}
`;

const FollowThisList = (list_id, user_id) => {
	return client
		.mutate({
			mutation: FOLLOWLIST,
			variables: {
				list_id: list_id,
				user_id: user_id,
			},
		})
		.catch((error) => console.log(error));
};

const UNFOLLOWLIST = gql`
	mutation MyMutation($list_id: uuid, $user_id: String) {
		delete_list_follow(
			where: {
				_and: { list_id: { _eq: $list_id }, user_id: { _eq: $user_id } }
			}
		) {
			affected_rows
			returning {
				id
			}
		}
	}
`;

const UnfollowThisList = (list_id, user_id) => {
	return client
		.mutate({
			mutation: UNFOLLOWLIST,
			variables: {
				list_id: list_id,
				user_id: user_id,
			},
		})
		.catch((error) => console.log(error));
};

const DOIFOLLOW = gql`
	query MyQuery($list_id: uuid, $user_id: String) {
		list_follow_aggregate(
			where: {
				_and: { list_id: { _eq: $list_id }, user_id: { _eq: $user_id } }
			}
		) {
			aggregate {
				count
			}
		}
	}
`;

const DoIFollow = (list_id, user_id) => {
	return client
		.query({
			query: DOIFOLLOW,
			variables: {
				list_id: list_id,
				user_id: user_id,
			},
		})
		.then((response) => response.data)
		.catch((error) => console.log(error));
};

const HAVEIBOOKMARKED = gql`
	query MyQuery($item_id: uuid, $user_id: String) {
		item_bookmark_aggregate(
			where: {
				_and: { item_id: { _eq: $item_id }, user_id: { _eq: $user_id } }
			}
		) {
			aggregate {
				count
			}
		}
	}
`;

const HaveIBookmarked = (item_id, user_id) => {
	return client
		.query({
			query: HAVEIBOOKMARKED,
			variables: {
				item_id: item_id,
				user_id: user_id,
			},
			update: (cache, { data }) => {
				const existingItems = cache.readQuery({
					query: HAVEIBOOKMARKED,
					variables: {
						item_id: item_id,
						user_id: user_id,
					},
				});
				console.log(existingItems);
				const newItem = data.insert_lists.returning[0];
				console.log(newItem);
				// existingItems.lists.push(newItem);
				// console.log(existingItems)
				// cache.writeQuery({
				// 	query: HAVEIBOOKMARKED,
				// 	variables: {
				// 		item_id: item_id,
				// 		user_id: user_id,
				// 	},
				// 	data: existingItems,
				// });
			},
			refetchQueries: [
				{
					query: HAVEIBOOKMARKED,
					variables: {
						item_id: item_id,
						user_id: user_id,
					},
				},
			],
		})
		.then((response) => response.data)
		.catch((error) => console.log(error));
};

const GETLIKES = gql`
	query MyQuery {
		like_list_aggregate(
			where: { list_id: { _eq: "c07f8859-a81a-48eb-8803-1c307bfeb81b" } }
		) {
			aggregate {
				count
			}
		}
		like_item_aggregate(
			where: {
				item: { list_id: { _eq: "c07f8859-a81a-48eb-8803-1c307bfeb81b" } }
			}
		) {
			aggregate {
				count
			}
		}
		lists(where: { id: { _eq: "c07f8859-a81a-48eb-8803-1c307bfeb81b" } }) {
			view_count
		}
	}
`;

export const CHANGEUSERDESCRIPTION = gql`
	mutation MyMutation($id: String, $description: String, $image_link: String) {
		update_user(
			where: { id: { _eq: $id } }
			_set: { description: $description, image_link: $image_link }
		) {
			returning {
				description
				id
				image_link
				username
			}
		}
	}
`;

export const UPDATEIMAGE = gql`
	mutation MyMutation($id: uuid, $image_url: String) {
		update_lists(where: { id: { _eq: $id } }, _set: { image_url: $image_url }) {
			returning {
				id
				image_url
				curator_id
			}
		}
	}
`;

const UpdateListImage = (id, image_url) => {
	return client
		.mutate({
			mutation: UPDATEIMAGE,
			variables: {
				id: id,
				image_url: image_url,
			},
		})
		.then((response) => response.data)
		.catch((error) => console.log(error));
};

export const GETLISTIMAGE = gql`
	query MyQuery($id: uuid) {
		lists(where: { id: { _eq: $id } }) {
			image_url
			id
			curator_id
		}
	}
`;

const GetListImage = (id) => {
	// console.log(id);
	return client
		.query({
			query: GETLISTIMAGE,
			variables: {
				id: id,
			},
		})
		.then((response) => response.data)
		.catch((error) => console.log(error));
};

const GETITEMS = gql`
	query MyQuery($id: String) {
		items(
			order_by: { created_at: desc }
			where: { curator: { _eq: $id } }
			limit: 20
		) {
			appreciation_count
			auto_description
			auto_image
			bookmarks_count
			copy_count
			created_at
			curator
			description
			id
			link
			name
			share_count
			suggestion
			view_count
			list {
				id
				list_name
			}
		}
	}
`;

const GetItemsActivity = (id) => {
	// console.log(id);
	return client
		.query({
			query: GETITEMS,
			variables: {
				id: id,
			},
		})
		.then((response) => response.data)
		.catch((error) => console.log(error));
};

const USERDETAILS = gql`
	query MyQuery($id: String) {
		user(where: { id: { _eq: $id } }) {
			buymeacoffee
			description
			image_link
			patreon_id
			username
		}
	}
`;

const GetUserDetails = (id) => {
	// console.log(id);
	return client
		.query({
			query: USERDETAILS,
			variables: {
				id: id,
			},
		})
		.then((response) => response.data)
		.catch((error) => console.log(error));
};

const UPDATEUSERDETAILS = gql`
	mutation MyMutation(
		$id: String
		$buymeacoffee: String
		$description: String
		$image_link: String
		$username: String
	) {
		update_user(
			where: { id: { _eq: $id } }
			_set: {
				buymeacoffee: $buymeacoffee
				description: $description
				image_link: $image_link
				username: $username
			}
		) {
			affected_rows
			returning {
				buymeacoffee
				description
				image_link
				patreon_id
				username
			}
		}
	}
`;

const UpdateUserDetails = (
	id,
	image_link,
	username,
	description,
	buymeacoffee
) => {
	return client
		.mutate({
			mutation: UPDATEUSERDETAILS,
			variables: {
				id: id,
				image_link: image_link,
				username: username,
				description: description,
				buymeacoffee: buymeacoffee,
			},
		})
		.then((response) => response.data)
		.catch((error) => console.log(error));
};

const GETUSERSTATS = gql`
	query MyQuery($id: String) {
		lists_aggregate(where: { curator_id: { _eq: $id } }) {
			aggregate {
				count
				sum {
					view_count
				}
			}
		}
		items_aggregate(where: { curator: { _eq: $id } }) {
			aggregate {
				count
				sum {
					view_count
					share_count
					copy_count
					bookmarks_count
					appreciation_count
				}
			}
		}
	}
`;

const GetUserStats = (id) => {
	// console.log(id);
	return client
		.query({
			query: GETUSERSTATS,
			variables: {
				id: id,
			},
		})
		.then((response) => response.data)
		.catch((error) => console.log(error));
};

const GETFOLLOWOFUSER = gql`
	query MyQuery($user_id: String) {
		list_follow(
			where: { user_id: { _eq: $user_id } }
			order_by: { created_at: desc_nulls_last }
		) {
			list {
				id
				list_name
				image_url
				description
				curator_id
				user {
					id
					image_link
					username
				}
			}
		}
	}
`;

const GetFollowOfUser = (user_id) => {
	// console.log(id);
	return client
		.query({
			query: GETFOLLOWOFUSER,
			variables: {
				user_id: user_id,
			},
		})
		.then((response) => response.data)
		.catch((error) => console.log(error));
};

export {
	createItem,
	GetList,
	GetListDescription,
	GetItemsofTag,
	GetItemsUsers,
	GetTagsListsUsers,
	DoesUserExists,
	InsertUser,
	Search,
	GetAllLists,
	GetAllTags,
	GetAllUsers,
	DeleteItem,
	LikeList,
	UnlikeList,
	LikeItem,
	UnlikeItem,
	GetTagItems,
	DoILike,
	ChangeListDescription,
	InsertBookmark,
	DeleteBookmark,
	GetAllBookmarkItems,
	GetBookmarkItemsOfCurator,
	GetBookmarksOfUser,
	GetConsumptionOfUser,
	GetConsumptionOfUserBetween,
	GetListsOfUser,
	GetTagsOfUser,
	GetOneListOfUser,
	IncrementListView,
	InsertMultiple,
	GetItemNotesOfUser,
	FollowThisList,
	UnfollowThisList,
	DoIFollow,
	HaveIBookmarked,
	UpdateListImage,
	GetListImage,
	GetItemsActivity,
	GetUserDetails,
	UpdateUserDetails,
	GetUserStats,
	GetFollowOfUser,
};

export const DELETE_LIST = gql`
	mutation MyMutation($list_id: uuid) {
		delete_item_tag(where: { item: { list_id: { _eq: $list_id } } }) {
			affected_rows
		}
		delete_like_item(where: { item: { list_id: { _eq: $list_id } } }) {
			affected_rows
		}
		delete_items(where: { list_id: { _eq: $list_id } }) {
			affected_rows
		}
		delete_like_list(where: { list_id: { _eq: $list_id } }) {
			affected_rows
		}
		delete_item_bookmark(where: { list_id: { _eq: $list_id } }) {
			affected_rows
		}
		delete_lists(where: { id: { _eq: $list_id } }) {
			returning {
				curator_id
				description
				id
				list_name
			}
			affected_rows
		}
	}
`;
