import { Measure } from "../constants/Measure.js";
import { Density } from "../constants/Density.js";

import { Component } from "./Component.js";
import { CalculationError } from "./CalculationError.js";

import AlcoholTable from "../data/alcohol.table.js";
import SyrupTable from "../data/syrup.table.js";

/**
 * Conversions between units
 */
export class Conversion {
	/**
	 * @prop {number} correction - multiplier for complex compositions to avoid rounding errors while mixing
	 */
	static correction = 0.99;
	/**
	 * Facade function for converting frome anything to anything
	 *
	 * @param {string} ingredient - lowercase of a class (Syrup -> "syrup")
	 * @param {MeasureVariant} from
	 * @param {MeasureVariant} to
	 */
	static convert(ingredient, from, to, value) {
		if (from == to) return value;
		if (
			typeof Conversion.conversion_map[ingredient][from][to] != 'function'
		)
			throw new CalculationError('CONVERSION_UNAVAILABLE');
		if (typeof Conversion.validation_map[ingredient][from] == 'function') {
			if (!Conversion.validation_map[ingredient][from](value))
				throw new CalculationError('INVALID_VALUE', value);
		}
		let result = Conversion.conversion_map[ingredient][from][to](value);
		return result;
	}
	/**
	 * Validation functions
	 *
	 * @static
	 * @var {Object} validation_map
	 * @property {MeasureVariant} validation_map
	 * @param {MeasureVariant} to
	 */
	static validation_map = {
		syrup: {
			[Measure.DENSITY]: (value) =>
				value >= Density.WATER && value <= Density.SUCROSE,
			[Measure.WV]: (value) => value >= 0 || value <= Density.SUCROSE,
			[Measure.BRIX]: (value) => value >= 0 && value <= 100,
			[Measure.PV]: (value) => value >= 0 && value <= 1,
		},
		alcohol: {
			[Measure.DENSITY]: (value) =>
				value <= Density.WATER && value >= Density.ETHANOL,
			[Measure.WV]: (value) => value >= 0 || value <= Density.ETHANOL,
			[Measure.PV]: (value) => value >= 0 && value <= 1,
			[Measure.ABV]: (value) => value >= 0 && value <= 100,
			[Measure.PW]: (value) => value >= 0 && value <= 1,
		},
	};
	static conversion_map = {
		ingredient: {},
		syrup: {
			[Measure.DENSITY]: {
				[Measure.PW]: (value) => SyrupTable.lookup(value, 1, 0),
				[Measure.WV]: (value) => SyrupTable.lookup(value, 1, 2),
				[Measure.BRIX]: (value) =>
					Conversion.convert(
						'syrup',
						Measure.DENSITY,
						Measure.PW,
						value
					) * 100,
				[Measure.PV]: (value) => SyrupTable.lookup(value, 1, 3),
			},
			[Measure.PW]: {
				[Measure.DENSITY]: (value) => SyrupTable.lookup(value, 0, 1),
				[Measure.WV]: (value) => SyrupTable.lookup(value, 0, 2),
				[Measure.BRIX]: (value) => value * 100,
				[Measure.PV]: (value) => SyrupTable.lookup(value, 0, 3),
			},
			[Measure.BRIX]: {
				[Measure.DENSITY]: (value) =>
					Conversion.convert(
						'syrup',
						Measure.PW,
						Measure.DENSITY,
						value * 0.01
					),
				[Measure.WV]: (value) =>
					Conversion.convert(
						'syrup',
						Measure.PW,
						Measure.WV,
						value * 0.01
					),
				[Measure.PW]: (value) => value * 0.01,
				[Measure.PV]: (value) =>
					Conversion.convert(
						'syrup',
						Measure.PW,
						Measure.PV,
						value * 0.01
					),
			},
			[Measure.WV]: {
				[Measure.DENSITY]: (value) => SyrupTable.lookup(value, 2, 1),
				[Measure.PW]: (value) => SyrupTable.lookup(value, 2, 0),
				[Measure.BRIX]: (value) =>
					Conversion.convert('syrup', Measure.WV, Measure.PW, value) *
					100,
				[Measure.PV]: (value) => SyrupTable.lookup(value, 2, 3),
			},
			[Measure.PV]: {
				[Measure.DENSITY]: (value) => SyrupTable.lookup(value, 3, 1),
				[Measure.PW]: (value) => SyrupTable.lookup(value, 3, 0),
				[Measure.BRIX]: (value) =>
					Conversion.convert(Syrup, Measure.PV, Measure.PW, value) *
					100,
				[Measure.WV]: (value) => SyrupTable.lookup(value, 3, 2),
			},
		},
		alcohol: {
			[Measure.DENSITY]: {
				[Measure.ABV]: (value) => AlcoholTable.lookup(value, 2, 0, true) * 100,
				[Measure.PV]: (value) => AlcoholTable.lookup(value, 2, 0, true),
				[Measure.PW]: (value) => AlcoholTable.lookup(value, 2, 1, true),
				[Measure.WV]: (value) => AlcoholTable.lookup(value, 2, 3, true),
			},
			[Measure.PV]: {
				[Measure.ABV]: (value) => value * 100,
				[Measure.DENSITY]: (value) => AlcoholTable.lookup(value, 0, 2),
				[Measure.PW]: (value) => AlcoholTable.lookup(value, 0, 1, true),
				[Measure.WV]: (value) => AlcoholTable.lookup(value, 0, 3, true),
			},
			[Measure.ABV]: {
				[Measure.DENSITY]: (value) => AlcoholTable.lookup(value * 0.01, 0, 2),
				[Measure.PW]: (value) => AlcoholTable.lookup(value * 0.01, 0, 1, true),
				[Measure.WV]: (value) => AlcoholTable.lookup(value * 0.01, 0, 3, true),
				[Measure.PV]: (value) => value * 0.01,
			},
			[Measure.PW]: {
				[Measure.ABV]: (value) => AlcoholTable.lookup(value, 1, 0, true) * 100,
				[Measure.DENSITY]: (value) => AlcoholTable.lookup(value, 1, 2),
				[Measure.PV]: (value) => AlcoholTable.lookup(value, 1, 0, true),
				[Measure.WV]: (value) => AlcoholTable.lookup(value, 1, 3, true),
			},
			[Measure.WV]: {
				[Measure.ABV]: (value) => AlcoholTable.lookup(value, 3, 0, true) * 100,
				[Measure.DENSITY]: (value) =>
					AlcoholTable.lookup(value, 3, 2, true),
				[Measure.PW]: (value) => AlcoholTable.lookup(value, 3, 1, true),
				[Measure.PV]: (value) => AlcoholTable.lookup(value, 3, 0, true),
			},
		},
	};
	/**
	 *
	 * @param {Function} callback - callback function, must take 1 number argument
	 * @param {number} target - value to get from closure
	 * @param {number} min - min value of argument to search
	 * @param {number} max - max value of argument
	 * @param {number} [precision=0.00001] - precision to target
	 * @param {boolean} [inverse=false] - inverse search (if result is bigger than target, the argument gets smaller)
	 * @returns
	 */
	static binary_search(callback, target, min, max, precision, inverse) {
		precision = precision || 0.00001;
		let result, now, diff;
		let m = inverse ? -1 : 1;
		let gmin = min,
			gmax = max;
		let iteration_limit = 100;
		do {
			result = (min + max) * 0.5;
			now = callback(result);
			diff = Math.abs(now - target);
			if (diff < precision) break;
			if (
				Math.abs(result - gmin) < precision ||
				Math.abs(result - gmax) < precision
			) {
				console.log(' -- binary search failed at: ', {
					now,
					target,
					result,
					diff,
					precision,
				});
				throw new CalculationError('ERROR_BINARY_SEARCH_OUT_OF_BOUNDS');
			}
			if (m * now > m * target) {
				max = result;
			} else {
				min = result;
			}
			iteration_limit--;
			if (iteration_limit <= 0) {
				console.log(' -- binary search failed at: ', {
					now,
					target,
					result,
					diff,
					precision,
				});
				throw new CalculationError('ERROR_BINARY_SEARCH_OUT_OF_BOUNDS');
			}
		} while (diff > precision);
		return Math.round(result / precision) * precision;
	}
}