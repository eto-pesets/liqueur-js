import { Measure } from '../constants/Measure.js';

import { Ingredient } from "./Ingredient.js";
import { Conversion } from './Conversion.js';

/**
 * Sucrose and water solution
 */
export class Syrup extends Ingredient {
	density = 1;
	type = 'syrup';
	/**
	 * @param {number} value
	 * @param {MeasureVariant} measure
	 */
	constructor(value, measure) {
		super();
		this.density = Conversion.convert(
			'syrup',
			measure,
			Measure.DENSITY,
			value
		);
	}
	/**
	 * @override
	 */
	get(measure) {
		return Conversion.convert(
			'syrup',
			Measure.DENSITY,
			measure,
			this.density
		);
	}
	static mix(k1, content1, content2) {
		let k2 = 1 - k1;
		let result_content = k1 * content1 + k2 * content2;
		return result_content;
	}
}