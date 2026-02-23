import { Measure } from '../constants/Measure.js';
import { Density } from '../constants/Density.js';

import { Ingredient } from "./Ingredient.js";

/**
 * Plain water
 * (very useful ingredient)
 */
export class Water extends Ingredient {
	density = Density.WATER;
	type = 'water';
	/**
	 * @override
	 */
	get(measure) {
		switch (measure) {
			case Measure.DENSITY:
				return this.density;
				break;
		}
	}
}