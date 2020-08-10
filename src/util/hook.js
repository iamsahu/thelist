import { useState } from "react";

//
function useForm(callback, initialState = {}) {
	const [values, setValues] = useState(initialState);

	function onChange(event) {
		// console.log(values);
		setValues({ ...values, [event.target.name]: event.target.value });
		// console.log(values);
	}

	function onSubmit(event) {
		event.preventDefault();
		callback();
	}

	return {
		onChange,
		onSubmit,
		values,
	};
}

export default useForm;
