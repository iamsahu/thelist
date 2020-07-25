import React, { useContext, useState } from "react";
import StreamContext from "../context/StreamContext";
import { Loader, Header, Item } from "semantic-ui-react";
import { GetItemsActivity } from "../util/graphqlExecutor";
import { useHistory } from "react-router-dom";

function YourActivities(props) {
	const [streamClient, streamuserFeed] = useContext(StreamContext);
	const [loading, setloading] = useState("-1");
	const [activityData, setactivityData] = useState("");
	// var feed = streamClient.feed("user", props.user);
	// console.log(streamClient);
	var t = streamClient.feed("user", props.user);
	const history = useHistory();
	const routeChange = (t) => {
		history.push(t);
	};

	if (loading === "-1")
		t.get()
			.then((activitiesSuccess) => {
				if (activitiesSuccess.results.length > 0) {
					// setactivityData(activitiesSuccess);
					var ids = [];
					for (
						let index = 0;
						index < activitiesSuccess.results.length;
						index++
					) {
						const element = activitiesSuccess.results[index];
						ids.push(element["object"]);
					}
					// console.log(ids);
					GetItemsActivity(ids).then((response) => {
						// console.log(response);
						if (response.items.length > 0) {
							setactivityData(response);
							setloading("0");
						}
					});
				}
			})
			.catch((activitiesError) => console.log(activitiesError));
	if (loading === "-1") {
		return (
			<div>
				<Loader active inline="centered" />
			</div>
		);
	}
	// console.log(activityData.items);

	var lastDate;
	return (
		<>
			<Item.Group divided relaxed>
				{activityData.items.map((item) =>
					// console.log(item.list.list_name)
					lastDate === "" ? (
						((lastDate = GiveMeDate(item.created_at)),
						(
							<>
								<Header as="h2">{lastDate}</Header>
								<Item key={item.id}>
									<Item.Image size="tiny" src={item.auto_image} />
									<Item.Content>
										<Item.Header target="_blank" as="a" href={item.link}>
											{item.name}
										</Item.Header>{" "}
										<Item.Meta
											as="a"
											onClick={() => {
												var t = `/${item.curator}/lists/${item.list.id}`;
												routeChange(t);
											}}
										>
											in {item.list.list_name}
										</Item.Meta>
										<Item.Description>
											<p>{item.auto_description.substring(0, 240)}</p>
										</Item.Description>
										{/* <Item.Extra>
                                <Checkbox
                                    id={item.id}
                                    label="Add to newsletter"
                                    data={item}
                                    onChange={onChange}
                                />
                            </Item.Extra> */}
									</Item.Content>
								</Item>
							</>
						))
					) : lastDate === GiveMeDate(item.created_at) ? (
						<Item key={item.id}>
							<Item.Image size="tiny" src={item.auto_image} />
							<Item.Content>
								<Item.Header target="_blank" as="a" href={item.link}>
									{item.name}
								</Item.Header>{" "}
								<Item.Meta
									as="a"
									onClick={() => {
										var t = `/${item.curator}/lists/${item.list.id}`;
										routeChange(t);
									}}
								>
									in {item.list.list_name}
								</Item.Meta>
								<Item.Description>
									<p>{item.auto_description.substring(0, 240)}</p>
								</Item.Description>
								{/* <Item.Extra>
                        <Checkbox
                            id={item.id}
                            label="Add to newsletter"
                            data={item}
                            onChange={onChange}
                        />
                    </Item.Extra> */}
							</Item.Content>
						</Item>
					) : (
						((lastDate = GiveMeDate(item.created_at)),
						(
							<>
								<Header as="h2">{lastDate}</Header>
								<Item key={item.id}>
									<Item.Image size="tiny" src={item.auto_image} />
									<Item.Content>
										<Item.Header target="_blank" as="a" href={item.link}>
											{item.name}
										</Item.Header>{" "}
										<Item.Meta
											as="a"
											onClick={() => {
												var t = `/${item.curator}/lists/${item.list.id}`;
												routeChange(t);
											}}
										>
											in {item.list.list_name}
										</Item.Meta>
										<Item.Description>
											<p>{item.auto_description.substring(0, 240)}</p>
										</Item.Description>
										{/* <Item.Extra>
                                <Checkbox
                                    id={item.id}
                                    label="Add to newsletter"
                                    data={item}
                                    onChange={onChange}
                                />
                            </Item.Extra> */}
									</Item.Content>
								</Item>
							</>
						))
					)
				)}
			</Item.Group>
		</>
	);
}

const mlist = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

function GiveMeDate(data) {
	var temp = new Date(data);
	return (
		temp.getDate() + " " + mlist[temp.getMonth()] + " " + temp.getFullYear()
	);
}

export default YourActivities;
