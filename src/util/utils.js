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

export function GiveMeDate(data) {
	var temp = new Date(data);
	return (
		temp.getDate() + " " + mlist[temp.getMonth()] + " " + temp.getFullYear()
	);
}

export function GiveMeDate2(data) {
	var temp = new Date(data);
	return mlist[temp.getMonth()] + " " + temp.getDate();
}
