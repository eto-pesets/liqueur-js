import { Measure } from "../constants/Measure.js";
import round from './round.js';

export class Component {
	weight = 0;
	ingredient = null;
	/**
	 * @param {Ingredient} ingredient
	 * @param {number} quantity
	 * @param {Measure} measure
	 */
	constructor(ingredient, quantity, measure) {
		this.ingredient = ingredient;
		this.#fromMeasure(quantity, measure);
	}
	/**
	 * Scale all ingredients by K
	 *
	 * @param {number} k
	 */
	scale(k) {
		this.weight *= k;
	}
	/**
	 * Whether ingredient is of this class
	 *
	 * Usage: myComponent.is(Alcohol)
	 * @param {Constructor} constructor
	 */
	is(constructor) {
		return this.ingredient instanceof constructor;
	}
	/**
	 * Calculates weight from a givent quantity and measure
	 *
	 * @private
	 * @param {number} quantity
	 * @param {MeasureVariant} measure
	 */
	#fromMeasure(quantity, measure) {
		switch (measure) {
			case Measure.G:
				this.weight = quantity;
				break;
			case Measure.KG:
				this.weight = quantity * 1000;
				break;
			case Measure.ML:
				this.weight = quantity * this.ingredient.get(Measure.DENSITY);
				break;
			case Measure.L:
				this.weight =
					quantity * this.ingredient.get(Measure.DENSITY) * 1000;
				break;
			case Measure.OZ:
				this.weight =
					quantity *
					this.ingredient.get(Measure.DENSITY) *
					29.5735295625;
				break;
		}
	}
	/**
	 * Get Component or Ingredient measurement
	 *
	 * @param {MeasureVariant} measure
	 */
	get(measure) {
		switch (measure) {
			case Measure.G:
				return this.weight;
				break;
			case Measure.KG:
				return this.weight * 0.001;
				break;
			case Measure.ML:
				return this.weight / this.ingredient.get(Measure.DENSITY);
				break;
			case Measure.L:
				return (
					(this.weight / this.ingredient.get(Measure.DENSITY)) * 0.001
				);
				break;
			case Measure.OZ:
				return (
					this.weight /
					this.ingredient.get(Measure.DENSITY) /
					29.5735295625
				);
				break;
			default:
				return this.ingredient.get(measure);
				break;
		}
	}
	/**
	 * Get human-readable Component or Ingredient measurement with a given precision
	 *
	 * @param {MeasureVariant} measure
	 * @param {number} precision
	 */
	fget(measure, precision) {
		switch (measure) {
			case Measure.G:
			case Measure.KG:
			case Measure.ML:
			case Measure.L:
			case Measure.OZ:
				return {
                    code: 'format_'+measure,
                    data: round(this.get(measure), precision || 0.01)
                };
				break;
			default:
				return {
                    code: 'format_'+measure,
                    data: round(this.ingredient.get(measure), precision || 0.01)
                }
				break;
		}
	}
}