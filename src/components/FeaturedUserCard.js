import React, { useContext, useState, Suspense, lazy } from "react";
import { DoesUserExists } from "../util/graphqlExecutor";
import UserContext from "../context/UserContext";
import Linkify from "react-linkify";

function FeaturedUserCard(props) {
	const [userC, userChange] = useContext(UserContext);
	const [userProfile, setuserProfile] = useState(
		"https://i.imgur.com/MwTfvwo.png"
	);
	const [username, setusername] = useState("Mojo Jojo");
	const [description, setdescription] = useState(
		"Something witty that tells how witty you are"
	);
	const [id, setid] = useState("");

	const loadUser = (user) => {
		// if(tyuser)
		DoesUserExists({ user_id: user })
			.then((response) => {
				// console.log(response)
				if (typeof response !== "undefined") {
					if (typeof response.user[0] !== "undefined") {
						// console.log(response.user[0]['image_link'])
						setuserProfile(response.user[0]["image_link"]);
						setusername(response.user[0]["username"]);
						setdescription(response.user[0]["description"]);
						setid(response.user[0].id);
					}
				}
			})
			.catch((error) => console.log(error));
	};
	if (props.user !== "") if (id === "") loadUser(props.user);
	return (
		<>
			<div
				class="bg-white border shadow-md mt-4 rounded-lg overflow-hidden text-gray-900 w-full font-sans"
				key={id}
			>
				<div class="flex h-40">
					<div class="flex w-1/4 max-h-full">
						<img class="object-cover" src={userProfile} />
					</div>
					<div class="p-2 w-3/4">
						<div class="h-32">
							<a
								class="font-normal text-lg md:text-xl text-gray-800 w-full"
								href={`${process.env.REACT_APP_BASE_URL}/${id}`}
							>
								{username}
							</a>
							<p class="font-thin text-gray-700 text-base lg:text-lg overflow-hidden md:h-24 h-32">
								<Linkify>{description}</Linkify>
							</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default FeaturedUserCard;
