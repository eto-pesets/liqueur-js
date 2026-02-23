import { Measure } from "../constants/Measure.js";

import { Component } from "./Component.js";
import { Alcohol } from "./Alcohol.js";
import { Syrup } from "./Syrup.js";

/**
 * A collection of ingredients
 */
export class Composition {
	components = {};
	/**
	 * Make a composition
	 *
	 * @constructor
	 * @param {Object} components
	 *
	 * @example
	 * let MyMix = new Composition({
	 * 	alcohol: new Component(new Alcohol(0.80, Measure.PV), 500, Measure.ML),
	 * 	water: new Component(new Water, 500, Measure.ML)
	 * });
	 */
	constructor(components) {
		for (let key in components) this.add(key, components[key]);
	}
	/**
	 * Add a Component to Composition
	 *
	 * @param {string} key
	 * @param {Component} component
	 */
	add(key, component) {
		this.components[key] = component;
	}
	/**
	 * Remove Component from Composition
	 *
	 * @param {string} key
	 */
	remove(key) {
		delete this.components[key];
	}
	/**
	 * Get Component from Composition
	 *
	 * @param {string} key
	 * @returns {(Component|null)}
	 */
	get(key) {
		return this.components[key] || null;
	}
	/**
	 * Multiply quantities of all Components by K
	 *
	 * @param {number} k
	 * @returns {void}
	 */
	multiply(k) {
		for (let key in this.components) this.components[key].multiply(k);
	}
	/**
	 * Get total quantity of all Components with a specific measure
	 *
	 * @param {MeasureVariant} measure
	 * @returns {void}
	 */
	total(measure) {
		let result = 0;
		for (let key in this.components)
			result += this.components[key].get(measure);
		return result;
	}
	/**
	 * Get reference info (per 1L)
	 *
	 * @returns {CompositionInfo}
	 */
	reference() {
		let k = 1000 / this.total(Measure.ML);
		this.multiply(k);
		let result = this.info();
		this.multiply(1 / k);
		return result;
	}
	/**
	 * Get info (for real volume)
	 *
	 * @returns {CompositionInfo}
	 */
	info() {
		/** @var {CompositionInfo} result */
		let result = {
			volume: 0,
			weight: 0,
			density: 0,
			abs_spirit: 0,
			abv: 0,
			sugar: 0,
		};
		for (let key in this.components) {
			let c = this.components[key];
			if (c.is(Alcohol))
				result.abs_spirit += c.get(Measure.ML) * c.get(Measure.PV);
			if (c.is(Syrup))
				result.sugar += c.get(Measure.ML) * c.get(Measure.WV);
			result.weight += c.get(Measure.G);
			result.volume += c.get(Measure.ML);
		}

		result.abv = result.abs_spirit / result.volume;
		result.density = result.weight / result.volume;
		return result;
	}
}