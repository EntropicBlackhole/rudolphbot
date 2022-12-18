exports.randomColor = randomColor
exports.sortObject = sortObject

function randomColor() {
	return '#' + Math.floor(Math.random() * 16777215).toString(16);
}
function sortObject(obj) {
	var newObj = {};
	var array = Object.keys(obj).map(function (key) {
		return [key, obj[key]];
	}).sort(function (a, b) {
		return a[1] - b[1];
	}).map(function (item) {
		return item[0];
	}).reverse();
	for (i of array)
		newObj[i] = obj[i]
	return newObj
}