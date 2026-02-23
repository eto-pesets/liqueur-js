import { Measure } from '../constants/Measure.js';

import { Ingredient } from "./Ingredient.js";
import { Conversion } from './Conversion.js';

/**
 * Ethanol and water solution
 */
export class Alcohol extends Ingredient {
	density = 1;
	value = null;
	type = 'alcohol';
	/**
	 * @param {number} value
	 * @param {MeasureVariant} measure
	 */
	constructor(value, measure) {
		super();
		this.density = Conversion.convert(
			'alcohol',
			measure,
			Measure.DENSITY,
			value
		);
		this.value = {
            code: 'format_'+Measure.ABV,
            data: this.get(Measure.ABV)
        }
	}
	/**
	 * @override
	 */
	get(measure) {
		return Conversion.convert(
			'alcohol',
			Measure.DENSITY,
			measure,
			this.density
		);
	}
	static mix(k1, abv1, abv2) {
		let k2 = 1 - k1;
		let result_abv = k1 * abv1 + k2 * abv2;
		return result_abv;
	}
}