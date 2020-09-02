import axios from "axios";
import React, { useState } from "react";
import { Formik } from "formik";

function Waitlist() {
	const [reflink, setReflink] = useState("");
	return (
		<div className="flex justify-center w-screen p-10">
			<div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
				<Formik
					initialValues={{ email: "" }}
					validate={(values) => {
						const errors = {};
						if (!values.email) {
							errors.email = "Required";
						} else if (
							!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
						) {
							errors.email = "Invalid email address";
						}
						return errors;
					}}
					onSubmit={(values, { setSubmitting }) => {
						var body = {
							email: values.email,
							api_key: "N4DCYL",
							referral_link: window.location.href,
						};

						axios
							.post("https://www.getwaitlist.com/waitlist", body)
							.then((response) => {
								console.log(response);
								var registered_email = response["data"]["registered_email"];
								var current_priority = response["data"]["current_priority"];
								var total_waiters_currently =
									response["data"]["total_waiters_currently"];
								var referral_link = response["data"]["referral_link"];
								setReflink(referral_link);
							})
							.catch((error) => {
								console.log(error.response);
							});
					}}
				>
					{({
						values,
						errors,
						touched,
						handleChange,
						handleBlur,
						handleSubmit,
						isSubmitting,
						/* and other goodies */
					}) => (
						<form onSubmit={handleSubmit} className="p-10 m-10 w-4/5">
							<div class="mb-4">
								<label
									class="block text-gray-700 text-sm font-bold mb-2"
									for="email"
								>
									Email
								</label>
								<input
									class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
									id="email"
									type="email"
									placeholder="Email"
									name="email"
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.email}
								/>
							</div>
							{/* <input
								id="email"
								type="email"
								name="email"
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.email}
								className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
							/> */}
							<div class="flex items-center justify-between">
								<button
									type="submit"
									disabled={isSubmitting}
									className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
								>
									Submit
								</button>
							</div>
						</form>
					)}
				</Formik>
				<div>{reflink !== "" ? "Referral link: " + { reflink } : <></>}</div>
			</div>
		</div>
	);
}

// class Waitlist extends React.Component {
// 	constructor(props) {
// 		super(props);
// 		this.state = {
// 			value: "",
// 			priority_number: "",
// 			email_submitted: "",
// 			total_users: "",
// 			ref_link: "",
// 			error_info: "",
// 		};

// 		this.handleChange = this.handleChange.bind(this);
// 		this.handleSubmit = this.handleSubmit.bind(this);
// 	}

// 	handleChange(event) {
// 		this.setState({ value: event.target.value });
// 	}

// 	handleSubmit(event) {
// 		console.log("A name was submitted: " + this.state.value);
// 		event.preventDefault();
// 		var body = {
// 			email: this.state.value,
// 			api_key: "N4DCYL",
// 			referral_link: window.location.href,
// 		};

// 		axios
// 			.post("https://www.getwaitlist.com/waitlist", body)
// 			.then((response) => {
// 				console.log(response);
// 				var registered_email = response["data"]["registered_email"];
// 				var current_priority = response["data"]["current_priority"];
// 				var total_waiters_currently =
// 					response["data"]["total_waiters_currently"];
// 				var referral_link = response["data"]["referral_link"];
// 				this.setState({
// 					email_submitted: registered_email,
// 					priority_number: current_priority,
// 					total_users: total_waiters_currently,
// 					ref_link: referral_link,
// 				});
// 			})
// 			.catch((error) => {
// 				this.setState({
// 					error_info:
// 						"Some error occured unfortunately. Check your value or let me know: bani (at) banisingh.io",
// 				});
// 				console.log(error.response);
// 			});
// 	}
// }

export default Waitlist;
