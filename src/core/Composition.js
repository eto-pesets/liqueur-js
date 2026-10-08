import { Measure } from "../data/Measure.js";

import { Component } from "./Component.js";
import { Liqueur } from "./Liqueur.js";
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
		switch (measure) {
			case Measure.ML:
				return this.#volume();
			case Measure.L:
				return this.#volume() * 0.001;
			case Measure.OZ:
				return this.#volume() / 29.5735295625;
		}
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
	 * Quantities that are preserved while mixing
	 *
	 * @returns {{weight: number, sugar: number, abs_spirit: number, volume: number}} volume is additive (initial guess only)
	 */
	#contents() {
		let result = { weight: 0, sugar: 0, abs_spirit: 0, volume: 0 };
		this.components.forEach(({ id, component }, index) => {
			if (component.is(VirtualIngredient))
				return;
			let ml = component.get(Measure.ML);
			result.weight += component.get(Measure.G);
			result.volume += ml;
			if (component.is(Alcohol))
				result.abs_spirit += ml * component.get(Measure.VV);
			if (component.is(Syrup))
				result.sugar += ml * component.get(Measure.WV);
			if (component.is(Liqueur)) {
				let info = component.ingredient.composition.info();
				result.sugar += info.sugar_content * ml;
				result.abs_spirit += (info.abv * 0.01) * ml;
			}
		});
		return result;
	}
	/**
	 * Real volume of the mixture, ml
	 *
	 * Volumes are not additive, so the volume is found as a fixed point:
	 * a liqueur with the same absolute spirit and sugar per this volume has the same weight
	 *
	 * @param {Object} [contents]
	 * @returns {number}
	 */
	#volume(contents) {
		let c = contents || this.#contents(),
			volume = c.volume;
		if (c.weight <= 0)
			return 0;
		for (let i = 0; i < 50; i++) {
			let liqueur = new Liqueur(
				c.abs_spirit > 0 ? new Alcohol(c.abs_spirit / volume * 100, Measure.ABV) : null,
				c.sugar > 0 ? new Syrup(c.sugar / volume, Measure.WV) : null
			);
			let next = c.weight / liqueur.get(Measure.DENSITY);
			if (Math.abs(next - volume) < volume * 1e-12)
				return next;
			volume = next;
		}
		return volume;
	}	
	/**
	 * Get info (for real volume)
	 *
	 * @param {number} [precision]
	 * @returns {CompositionInfo}
	 */
	info(precision) {
		let c = this.#contents(),
			volume = this.#volume(c);
		let result = {
			volume: volume,
			weight: c.weight,
			density: c.weight / volume,
			abs_spirit: c.abs_spirit,
			abv: c.abs_spirit / volume * 100,
			sugar: c.sugar,
			sugar_content: c.sugar / volume,
			kcal: this.total(Measure.KCAL)
		};
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