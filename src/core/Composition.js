import { Measure } from "../data/Measure.js";

import { Component } from "./Component.js";
import { Alcohol } from "./Alcohol.js";
import { Syrup } from "./Syrup.js";
import { VirtualIngredient } from "./VirtualIngredient.js";
import round from "./round.js";

/**
 * Collection of ingredients
 */
export class Composition {
	components = [];
	/**
	 * Add a Component to Composition
	 *
	 * @param {string} id
	 * @param {Component} component
	 */
	add(id, component) {
		if (this.component(id))
			throw new Error('Duplicate ID');
		this.components.push({ id, component });
	}
	/**
	 * Remove Component from Composition
	 *
	 * @param {string} id
	 */
	remove(id) {
		this.components = this.components.filter((item, index) => {
			return item.id != id;
		});
	}
	/**
	 * Get Component from Composition
	 *
	 * @param {string} id
	 * @returns {(Component|null)}
	 */
	component(id) {
		for (let i in this.components) {
			if (this.components[i].id == id)
				return this.components[i].component;
		}
		return null;
	}
	/**
	 * Scale quantities of all Components by K
	 *
	 * @param {number} k
	 * @returns {void}
	 */
	scale(k) {
		this.components.forEach((item, index) => {
			item.component.scale(k);
		});
	}
	/**
	 * Scale quantities of all Components to total measure
	 *
	 * @param {number} quantity
	 * @param {MeasureVariant} measure
	 * @returns {void}
	 */
	scaleTo(quantity, measure) {
		let total = this.total(measure),
			k = quantity/total;
		this.scale(k);
	}
	/**
	 * Get total quantity of all Components with a specific measure
	 *
	 * @param {MeasureVariant} measure
	 * @returns {void}
	 */
	total(measure) {
		let result = 0;
		this.components.forEach(({ id, component }, index) => {
			if (! component.is(VirtualIngredient))
				result += component.get(measure);
		});
		return result;
	}
	/**
	 * Get reference info (per 1L)
	 *
	 * @returns {CompositionInfo}
	 */
	reference() {
		let k = 1000 / this.total(Measure.ML);
		this.scale(k);
		let result = this.info();
		this.scale(1 / k);
		return result;
	}
	/**
	 * Get info (for real volume)
	 *
	 * @param {number} [precision]
	 * @returns {CompositionInfo}
	 */
	info(precision) {
		let result = {
			volume: this.total(Measure.ML),
			weight: this.total(Measure.G),
			density: 0,
			abs_spirit: 0,
			abv: 0,
			sugar: 0,
		};
		this.components.forEach(({ id, component }, index) => {
			if (component.is(Alcohol))
				result.abs_spirit += component.get(Measure.ML) * component.get(Measure.VV);
			if (component.is(Syrup))
				result.sugar += component.get(Measure.ML) * component.get(Measure.WV);
		})

		result.abv = result.abs_spirit / result.volume;
		result.density = result.weight / result.volume;
		if (precision) {
			for (let key in result)
				result[key] = round(result[key], precision);
		}
		return result;
	}
}
/**
 * @typedef {Object} CompositionInfo
 * @property {number} volume - total volume, ml
 * @property {number} weight - total weight, g
 * @property {number} density - density, g/ml
 * @property {number} abs_spirit - absolute spirit, ml
 * @property {number} abv - alcohol by volume, %
 * @property {number} sugar - total sugar, g
 */