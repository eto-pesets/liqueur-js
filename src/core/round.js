export default function(value, precision) {
    precision = precision || 1;
	let n = Math.ceil(Math.log(precision) / Math.log(0.1));
	return (Math.round(value / precision) * precision).toFixed(Math.max(0, n)) * 1;
}