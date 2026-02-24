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
	attributes = {};
	/**
	 * Set custom attributes
	 *
	 * @param {string} name
	 * @param {any} value
	 * @returns {this}
	 */
	setAttribute(name, value) {
		this.attributes[ name ] = value;
		return this;
	}
	/**
	 * Set custom attributes from an object
	 *
	 * @param {(Object.<string, any>|string)} attributes
	 * @returns {this}
	 */
	setAttributes(attributes) {
		for (let name in attributes)
			this.setAttribute(name, attributes[name]);
		return this;
	}
	/**
	 * Set custom attributes from an object
	 *
	 * @param {(Object.<string, any>|string)} attributes
	 * @returns {this}
	 */
	getAttribute(name) {
		return this.attributes[name] || null;
	}
	/**
	 * Shorthand getter/setter for attributes
	 *
	 * @param {(Object.<string, any>|string)} name
	 * @param {any} [value]
	 * @returns {this}
	 * @example 
	 * ingredient.attr({ name: 'syrup', type: 'fruit' }); // set multiple
	 * ingredient.attr('name', 'syrup'); // set
	 * ingredient.attr('name'); // get
	 */
	attr(name, value) {
		if (typeof name == 'object') {
			return this.setAttributes(name);
		} else if (typeof value != 'undefined') {
			return this.setAttribute(name, value);
		}
		return this.getAttribute(name);
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