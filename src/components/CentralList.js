import React, { useContext } from "react";
// import { render } from "@testing-library/react";
import ContentCard from "./ContentCard";
import ContentContext from "../context/ContentContext";

function CentralList(props) {
	const [content, contentChange] = useContext(ContentContext);
	// contentChange(content=>({...content,listdescription:props.posts[0].description}))
	// console.log(props);
	var temp = {};

	if (typeof props.posts === "undefined") return <div></div>;
	if (props.contentType === "tags") {
		// console.log(typeof(props.posts[0]))
		// console.log(props.posts[0].__typename)
		switch (props.posts[0].__typename) {
			case "items":
				temp = props.posts;
				// console.log("items");
				break;
			case "item_tag":
				// console.log(props.posts)
				temp = props.posts.map((item) => item.item);
				// console.log(temp)
				break;
			default:
				break;
		}

		// console.log(temp)
	} else if (props.contentType === "bookmark") {
		// console.log('Bookmark central list')
		temp = props.posts.map((item) => item.item);
		// console.log(temp)
	} else if (props.contentType === "lists") {
		temp = props.posts;
		// console.log("lists");
		// console.log(temp);
		var p = [];
		var sug = [];
		for (let index = 0; index < props.posts.length; index++) {
			const element = props.posts[index];
			if (element.suggestion) {
				sug.push(element);
			} else {
				// console.log("h");
				p.push(element);
			}
		}
		if (props.suggest) {
			temp = sug;
		} else {
			temp = p;
		}
		// console.log(temp);
	}

	return temp.map((post) => (
		<ContentCard
			key={post.id}
			postdata={post}
			contentType={props.contentType}
			contentID={props.contentID}
		/>
	));
}

export default CentralList;
