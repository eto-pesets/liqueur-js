import { Measure } from '../data/Measure.js';

import { Ingredient } from './Ingredient.js';
import { Water } from './Water.js';
import { Alcohol } from './Alcohol.js';
import { Syrup } from './Syrup.js';

import { Component } from './Component.js';
import { Composition } from './Composition.js';
import { Conversion } from './Conversion.js';

import { CalculationError } from './CalculationError.js';

/**
 * A union of syrup and alcohol solution.
 * Takes "sugar content" from syrup and "alcohol content" from alcohol
 * and creates a liqueur with both characteristics combined.
 * 
 * @extends {Ingredient}
 */
export class Liqueur extends Ingredient {
	alcohol = null;
	syrup = null;
	sugar = null;
	spirit = null;
	water = null;
	density = null;
	type = 'liqueur';
	/**
	 * Make a liqueur
	 *
	 * @constructor
	 * @param {(Alcohol|null)} [alcohol=null]
	 * @param {(Syrup|null)} [syrup=null]
	 *
	 * @example
	 * let CremeDeCassis = new Liqueur(
	 * 	new Alcohol(0.20, Measure.VV),
	 * 	new Syrup(0.400, Measure.WV),
	 * );
	 */
	constructor(alcohol, syrup) {
		super();
		let volume_left = 1000;

		if (syrup) {
			this.syrup = syrup;
			this.sugar = new Component(
				new Syrup(1, Measure.WW),
				this.syrup.get(Measure.WV) * volume_left,
				Measure.G
			);
			volume_left -= this.sugar.get(Measure.ML);
			if (volume_left < 0)
				throw new CalculationError('IMPOSSIBLE_COMBINATION');
		} else {
			this.syrup = new Component(new Syrup(1, Measure.VV), 0, Measure.G);
		}

		if (alcohol) {
			this.alcohol = alcohol;

			let target_abv = alcohol.get(Measure.VV) * (1000 / volume_left);

			if (target_abv > 1)
				throw new CalculationError('IMPOSSIBLE_COMBINATION');

			let real_alcohol = new Alcohol(target_abv, Measure.VV),
				volume = volume_left * real_alcohol.get(Measure.VV);

			this.spirit = new Component(
				new Alcohol(1, Measure.VV),
				volume,
				Measure.ML
			);

			volume_left -= this.spirit.get(Measure.ML);
			if (volume_left < 0)
				throw new CalculationError('IMPOSSIBLE_COMBINATION');
		} else {
			this.spirit = new Component(
				new Alcohol(1, Measure.VV),
				0,
				Measure.ML
			);
		}

		this.water = new Component(new Water(), volume_left, Measure.ML);

		this.density =
			(this.water.get(Measure.G) +
				this.sugar.get(Measure.G) +
				this.spirit.get(Measure.G)) /
			1000;
	}
	/**
	 * Get basic information
	 *
	 * @returns {LiqueurInfo}
	 */
	info(precision) {
		precision = precision || 0.01;
		return {
			sugar: this.syrup
				? {
                    code: 'syrup_format_'+Measure.WV,
                    data: round(this.syrup.get(Measure.WV), precision)
                } : null,
			abv: this.alcohol
				? {
                    code: 'format_'+Measure.ABV,
                    data: round(this.alcohol.get(Measure.ABV), precision)
                } : null,
			density: {
                    code: 'format_'+Measure.DENSITY,
                    data: round(this.density, precision * 0.01)
                }
		};
	}

	#composeSugar(composition, data, KV) {
		if (this.sugar.get(Measure.G) > 0) {
			// solution contains sugar
			if (data.syrup) {
				if (KV.syrup < KV.max_syrup) {
					// main ingredient ok
					composition.add(
						'syrup',
						new Component(data.syrup, KV.syrup * 1000, Measure.ML)
					);
					KV.max_alcohol = 1 - KV.syrup;
				} else {
					// mixing
					if (data.fallback.syrup) {
						let mild_k = Math.max(
							KV.min_syrup,
							KV.max_syrup * Conversion.correction
						);

						let goal_sugar =
								(0.001 *
									this.sugar.get(Measure.G).toFixed(2) *
									1) /
								mild_k,
							wv1 = data.syrup.get(Measure.WV),
							wv2 = data.fallback.syrup.get(Measure.WV);

						let k_main =
								mild_k *
								Conversion.binary_search(
									(k) => Syrup.mix(k, wv1, wv2),
									goal_sugar,
									0,
									1,
									0.0000001,
									wv1 < wv2
								),
							k_fallback = mild_k - k_main;

						composition.add(
							'syrup',
							new Component(data.syrup, 1000 * k_main, Measure.ML)
						);

						composition.add(
							'fallback_syrup',
							new Component(
								data.fallback.syrup,
								1000 * k_fallback,
								Measure.ML
							)
						);
						KV.max_syrup = 1 - mild_k;
					} else throw new CalculationError('INSUFFICIENT_SUGAR');
				}
			} else throw new CalculationError('INSUFFICIENT_SUGAR');
		}
	}
	#composeAlcohol(composition, data, KV) {
		if (this.spirit.get(Measure.G) > 0) {
			// solution contains alcohol
			if (data.alcohol) {
				if (KV.alcohol < KV.max_alcohol) {
					// main ingredient ok
					composition.add(
						'alcohol',
						new Component(
							data.alcohol,
							KV.alcohol * 1000,
							Measure.ML
						)
					);
					KV.max_syrup = 1 - KV.alcohol;
				} else {
					// mixing
					if (data.fallback.alcohol) {
						let mild_k = Math.max(
							KV.min_alcohol,
							KV.max_alcohol * Conversion.correction
						);
						let abv = {
							main: data.alcohol.get(Measure.VV),
							fallback: data.fallback.alcohol.get(Measure.VV),
							target_mild: this.alcohol.get(Measure.VV) / mild_k,
						};
						let k_main =
								mild_k *
								Conversion.binary_search(
									(k) =>
										Alcohol.mix(k, abv.main, abv.fallback),
									abv.target_mild,
									0,
									1,
									0.000001,
									true
								),
							k_fallback = mild_k - k_main;

						composition.add(
							'alcohol',
							new Component(
								data.alcohol,
								1000 * k_main,
								Measure.ML
							)
						);

						composition.add(
							'fallback_alcohol',
							new Component(
								data.fallback.alcohol,
								1000 * k_fallback,
								Measure.ML
							)
						);
						KV.max_syrup = 1 - mild_k;
					} else throw new CalculationError('INSUFFICIENT_ALCOHOL');
				}
			} else throw new CalculationError('INSUFFICIENT_ALCOHOL');
		}
	}
	/**
	 * Make a composition
	 *
	 * @param {MakeFrom} data
	 * @returns {Composition}
	 *
	 * @example
	 * let HomemadeCremeDeCassis = CremeDeCassis.make({
	 * 	alcohol: new Alcohol(0.4, Measure.WV)
	 * 	syrup: new Syrup(1, Measure.WV)
	 * })
	 */
	make(data) {
		let composition = new Composition();

		let KV = {
			alcohol: 0,
			fallback_alcohol: 0,
			min_alcohol: 0,
			max_alcohol: 0,
			syrup: 0,
			fallback_syrup: 0,
			min_syrup: 0,
			max_syrup: 0,
		};

		if (!data.alcohol && data.fallback.alcohol) {
			data.alcohol = data.fallback.alcohol;
			data.fallback.alcohol = null;
		}

		if (!data.syrup && data.fallback.syrup) {
			data.syrup = data.fallback.syrup;
			data.fallback.syrup = null;
		}

		if (this.spirit.get(Measure.G) > 0) {
			let target_abv = this.alcohol.get(Measure.VV);
			if (data.alcohol) {
				KV.alcohol = target_abv / data.alcohol.get(Measure.VV);
			}
			if (data.fallback?.alcohol) {
				KV.fallback_alcohol =
					target_abv / data.fallback.alcohol.get(Measure.VV);
			}
			if (KV.alcohol > 0) {
				KV.min_alcohol = KV.alcohol;
				if (
					KV.fallback_alcohol > 0 &&
					KV.fallback_alcohol < KV.min_alcohol
				)
					KV.min_alcohol = KV.fallback_alcohol;
			} else if (KV.fallback_alcohol > 0) {
				KV.min_alcohol = KV.fallback_alcohol;
			}
		}
		if (this.sugar.get(Measure.G) > 0) {
			let target_sugar = this.syrup.get(Measure.WV);
			if (data.syrup) {
				KV.syrup = target_sugar / data.syrup.get(Measure.WV);
			}
			if (data.fallback?.syrup) {
				KV.fallback_syrup =
					target_sugar / data.fallback.syrup.get(Measure.WV);
			}
			if (KV.syrup > 0) {
				KV.min_syrup = KV.syrup;
				if (KV.fallback_syrup > 0 && KV.fallback_syrup < KV.min_syrup)
					KV.min_syrup = KV.fallback_syrup;
			} else if (KV.fallback_syrup > 0) {
				KV.min_syrup = KV.fallback_syrup;
			}
		}

		if (KV.min_alcohol + KV.min_syrup > 1)
			throw new CalculationError('IMPOSSIBLE_COMBINATION');

		KV.max_alcohol = 1 - KV.min_syrup;
		KV.max_syrup = 1 - KV.min_alcohol;

		if (data.priority && data.priority == 'syrup') {
			this.#composeSugar(composition, data, KV);
			this.#composeAlcohol(composition, data, KV);
		} else {
			this.#composeAlcohol(composition, data, KV);
			this.#composeSugar(composition, data, KV);
		}

		let volume_left = 1000;
		volume_left -=
			(composition.component('alcohol')?.get(Measure.ML) || 0) +
			(composition.component('fallback_alcohol')?.get(Measure.ML) || 0) +
			(composition.component('syrup')?.get(Measure.ML) || 0) +
			(composition.component('fallback_syrup')?.get(Measure.ML) || 0);
		
		let buffer = data.buffer || new Water;
		composition.add(
			'buffer',
			new Component(
				buffer,
				volume_left,
				Measure.ML
			)
		);

		let reference = composition.info();
		let current = 0;
		switch (data.basis.source) {
			case 'alcohol':
                if (!composition.component('alcohol'))
                    throw new CalculationError('BASIS_ALCOHOL_WITHOUT_ALCOHOL');
				current = composition.component('alcohol').get(data.basis.measure);
				break;
			case 'syrup':
                if (!composition.component('syrup'))
                    throw new CalculationError('BASIS_SUGAR_WITHOUT_SUGAR');
				current = composition.component('syrup').get(data.basis.measure);
				break;
			default:
				current = composition.total(data.basis.measure);
				break;
		}
		let k = data.basis.value / current;

		composition.scale(k);

		return composition;
	}
}

/**
 * @typedef {Object} MakeFrom
 * @property {Alcohol} [alcohol] - main alcohol
 * @property {Syrup} [syrup] - main syrup/sugar
 * @property {('alcohol'|'syrup')} [priority='alcohol'] - priority in constructions
 * @property {Object} [basis] - calculation basis
 * @property {('alcohol'|'syrup'|'total')} basis.source
 * @property {number} basis.value - value
 * @property {MeasureVariant} basis.measure - Measure.*
 * @property {Object} [fallback] - fallback ingredients
 * @property {Alcohol} [fallback.alcohol] - fallback alcohol
 * @property {Syrup} [fallback.syrup] - fallback syrup/sugar
 */
/**
 * @typedef {Object} LiqueurInfo
 * @property {(string|null)} sugar - human-readable sugar content
 * @property {(string|null)} abv - human-readable alcohol content
 * @property {string} density - human-readable ddensity
 */