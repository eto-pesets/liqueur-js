/**
 * Round with a given precision
 * 
 * @param {number} value 
 * @param {number} [precision=1]
 * @returns {number}
 * 
 * @example
 * // returns 10
 * round(9.5317);
 * 
 * // returns 9.5317
 * round(9.5317, 0.000001);
 * 
 * // returns 9.5
 * round(9.5317, 0.1); 
 * 
 * // returns 9.6
 * round(9.5317, 0.2); 
 */
function round(value, precision) {
    precision = precision || 1;
	let n = Math.ceil(Math.log(precision) / Math.log(0.1));
	return (Math.round(value / precision) * precision).toFixed(Math.max(0, n)) * 1;
}

export default round;