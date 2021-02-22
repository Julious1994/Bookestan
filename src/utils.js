import moment from "moment";

export function getInitial(txt = '') {
	return txt.substring(0, 1);
}

export function isExpired(expDate) {
	const d = moment(expDate, "YYYY-MM-DD");
	if(d.isAfter(moment.now())) {
		return false;
	}
	return true;
}