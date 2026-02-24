import { Measure } from '../constants/Measure.js';

import { Ingredient } from "./Ingredient.js";
import { Conversion } from './Conversion.js';

/**
 * Special ingredient that scales up but does not count in total weight/volume
 */
export class VirtualIngredient extends Ingredient {
	density = 1;
	type = 'virtual';
	/**
	 * @param {number} value
	 * @param {MeasureVariant} measure
	 */
	constructor(value, measure) {
		super();
	}
	/**
	 * @override
	 */
	get(measure) {
        if (measure == Measure.DENSITY)
            return 1;
        return 0;
	}
}