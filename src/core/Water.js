import { Measure } from '../data/Measure.js';
import { Density } from '../data/Density.js';
import { CaloricContent } from '../data/CaloricContent.js';

import { Ingredient } from "./Ingredient.js";

/**
 * Plain water
 * (very useful ingredient)
 * 
 * @extends {Ingredient}
 */
export class Water extends Ingredient {
	density = Density.WATER;
	type = 'water';
	/**
	 * Get water measurement
	 * 
	 * Available measures:
	 * - Measure.DENSITY
	 * - Measure.CW
	 * 
	 * @override
	 */
	get(measure) {
		switch (measure) {
			case Measure.DENSITY:
				return this.density;
				break;
			case Measure.CW:
				return CaloricContent.WATER;
				break;
		}
	}
}