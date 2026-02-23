import { Measure } from '../constants/Measure.js';
import round from './round.js';

/**
 * Base class for all ingredients
 */
export class Ingredient {
	/** @prop {number} density */
	density = 1;
	/** @prop {string} type */
	type = 'ingredient';
	/**
	 * Get Ingredient measurement
	 *
	 * @param {MeasureVariant} measure
	 * @returns {number}
	 */
	get(measure) {
		switch (measure) {
			case Measure.DENSITY:
				return this.density;
				break;
		}
	}
	/**
	 * Ingredient-specific formatting
	 *
	 * @param {MeasureVariant} measure
	 * @returns {string}
	 */
	format(measure) {
		return '';
	}
	/**
	 * Get human-readable Ingredient measurment with a given precision
	 *
	 * @param {MeasureVariant} measure
	 * @param {number} [precision=0.01]
	 * @returns {string}
	 */
	fget(measure, precision) {
		switch (measure) {
			default:
				return {
                    code: 'ingredient_'+measure,
                    data: round(this.get(measure), precision || 0.01)
                }
				break;
		}
	}
}