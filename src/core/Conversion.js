import { Measure } from "../data/Measure.js";
import { Density } from "../data/Density.js";

import { Component } from "./Component.js";
import { CalculationError } from "./CalculationError.js";

import { AlcoholTable } from "../data/alcohol.table.js";
import { SyrupTable } from "../data/syrup.table.js";

/**
 * Conversions between units
 * 
 * @hideconstructor
 */
class Conversion {
	/**
	 * @static
	 * @prop {number} correction - multiplier for complex compositions to avoid rounding errors while mixing
	 */
	static correction = 0.9999;
	/**
	 * Facade function for converting from anything to anything
	 *
	 * @static
	 * @param {IngredientType} ingredient
	 * @param {MeasureVariant} from
	 * @param {MeasureVariant} to
	 * @param {number} value
	 * @returns {number}
	 * @throws {CalculationError}
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
	static validation_map = {
		syrup: {
			[Measure.DENSITY]: (value) =>
				value >= Density.WATER && value <= Density.SUCROSE,
			[Measure.WV]: (value) => value >= 0 || value <= Density.SUCROSE,
			[Measure.BRIX]: (value) => value >= 0 && value <= 100,
			[Measure.VV]: (value) => value >= 0 && value <= 1,
		},
		alcohol: {
			[Measure.DENSITY]: (value) =>
				value <= Density.WATER && value >= Density.ETHANOL,
			[Measure.WV]: (value) => value >= 0 || value <= Density.ETHANOL,
			[Measure.VV]: (value) => value >= 0 && value <= 1,
			[Measure.ABV]: (value) => value >= 0 && value <= 100,
			[Measure.WW]: (value) => value >= 0 && value <= 1,
		},
	};
	static conversion_map = {
		ingredient: {},
		syrup: {
			[Measure.DENSITY]: {
				[Measure.WW]: (value) => SyrupTable.lookup(value, SyrupTable.COL_DENSITY, SyrupTable.COL_WW),
				[Measure.WV]: (value) => SyrupTable.lookup(value, SyrupTable.COL_DENSITY, SyrupTable.COL_WV),
				[Measure.BRIX]: (value) => SyrupTable.lookup(value, SyrupTable.COL_DENSITY, SyrupTable.COL_WW) * 100,
				[Measure.VV]: (value) => SyrupTable.lookup(value, SyrupTable.COL_DENSITY, SyrupTable.COL_VV),
			},
			[Measure.WW]: {
				[Measure.DENSITY]: (value) => SyrupTable.lookup(value, SyrupTable.COL_WW, SyrupTable.COL_DENSITY),
				[Measure.WV]: (value) => SyrupTable.lookup(value, SyrupTable.COL_WW, SyrupTable.COL_WV),
				[Measure.BRIX]: (value) => value * 100,
				[Measure.VV]: (value) => SyrupTable.lookup(value, SyrupTable.COL_WW, SyrupTable.COL_VV),
			},
			[Measure.BRIX]: {
				[Measure.DENSITY]: (value) => SyrupTable.lookup(value * 0.01, SyrupTable.COL_WW, SyrupTable.COL_DENSITY),
				[Measure.WV]: (value) => SyrupTable.lookup(value * 0.01, SyrupTable.COL_WW, SyrupTable.COL_WV),
				[Measure.WW]: (value) => value * 0.01,
				[Measure.VV]: (value) => SyrupTable.lookup(value * 0.01, SyrupTable.COL_WW, SyrupTable.COL_VV),
			},
			[Measure.WV]: {
				[Measure.DENSITY]: (value) => SyrupTable.lookup(value, SyrupTable.COL_WV, SyrupTable.COL_DENSITY),
				[Measure.WW]: (value) => SyrupTable.lookup(value, SyrupTable.COL_WV, SyrupTable.COL_WW),
				[Measure.BRIX]: (value) => SyrupTable.lookup(value, SyrupTable.COL_WV, SyrupTable.COL_WW) * 100,
				[Measure.VV]: (value) => SyrupTable.lookup(value, SyrupTable.COL_WV, SyrupTable.COL_VV),
			},
			[Measure.VV]: {
				[Measure.DENSITY]: (value) => SyrupTable.lookup(value, SyrupTable.COL_VV, SyrupTable.COL_DENSITY),
				[Measure.WW]: (value) => SyrupTable.lookup(value, SyrupTable.COL_VV, SyrupTable.COL_WW),
				[Measure.BRIX]: (value) => SyrupTable.lookup(value, SyrupTable.COL_VV, SyrupTable.COL_WW) * 100,
				[Measure.WV]: (value) => SyrupTable.lookup(value, SyrupTable.COL_VV, SyrupTable.COL_WV),
			},
		},
		alcohol: {
			[Measure.DENSITY]: {
				[Measure.ABV]: (value) => AlcoholTable.lookup(value, AlcoholTable.COL_DENSITY, AlcoholTable.COL_VV, true) * 100,
				[Measure.VV]: (value) => AlcoholTable.lookup(value, AlcoholTable.COL_DENSITY, AlcoholTable.COL_VV, true),
				[Measure.WW]: (value) => AlcoholTable.lookup(value, AlcoholTable.COL_DENSITY, AlcoholTable.COL_WW, true),
				[Measure.WV]: (value) => AlcoholTable.lookup(value, AlcoholTable.COL_DENSITY, AlcoholTable.COL_WV, true),
			},
			[Measure.VV]: {
				[Measure.ABV]: (value) => value * 100,
				[Measure.DENSITY]: (value) => AlcoholTable.lookup(value, AlcoholTable.COL_VV, AlcoholTable.COL_DENSITY),
				[Measure.WW]: (value) => AlcoholTable.lookup(value, AlcoholTable.COL_VV, AlcoholTable.COL_WW, true),
				[Measure.WV]: (value) => AlcoholTable.lookup(value, AlcoholTable.COL_VV, AlcoholTable.COL_WV, true),
			},
			[Measure.ABV]: {
				[Measure.DENSITY]: (value) => AlcoholTable.lookup(value * 0.01, AlcoholTable.COL_VV, AlcoholTable.COL_DENSITY),
				[Measure.WW]: (value) => AlcoholTable.lookup(value * 0.01, AlcoholTable.COL_VV, AlcoholTable.COL_WW, true),
				[Measure.WV]: (value) => AlcoholTable.lookup(value * 0.01, AlcoholTable.COL_VV, AlcoholTable.COL_WV, true),
				[Measure.VV]: (value) => value * 0.01,
			},
			[Measure.WW]: {
				[Measure.ABV]: (value) => AlcoholTable.lookup(value, AlcoholTable.COL_WW, AlcoholTable.COL_VV, true) * 100,
				[Measure.DENSITY]: (value) => AlcoholTable.lookup(value, AlcoholTable.COL_WW, AlcoholTable.COL_DENSITY),
				[Measure.VV]: (value) => AlcoholTable.lookup(value, AlcoholTable.COL_WW, AlcoholTable.COL_VV, true),
				[Measure.WV]: (value) => AlcoholTable.lookup(value, AlcoholTable.COL_WW, AlcoholTable.COL_WV, true),
			},
			[Measure.WV]: {
				[Measure.ABV]: (value) => AlcoholTable.lookup(value, AlcoholTable.COL_WV, AlcoholTable.COL_VV, true) * 100,
				[Measure.DENSITY]: (value) => AlcoholTable.lookup(value, AlcoholTable.COL_WV, AlcoholTable.COL_DENSITY, true),
				[Measure.WW]: (value) => AlcoholTable.lookup(value, AlcoholTable.COL_WV, AlcoholTable.COL_WW, true),
				[Measure.VV]: (value) => AlcoholTable.lookup(value, AlcoholTable.COL_WV, AlcoholTable.COL_VV, true),
			},
		},
	};
	/**
	 * Binary search method for really complex things
	 *
	 * @static
	 * @param {Function} callback - callback function, must take 1 number argument
	 * @param {number} target - value to get from closure
	 * @param {number} min - min value of argument to search
	 * @param {number} max - max value of argument
	 * @param {number} [precision=0.00001] - precision to target
	 * @param {boolean} [inverse=false] - inverse search (if result is bigger than target, the argument gets smaller)
	 * 
	 * @returns {number}
	 * @throws {CalculationError}
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
				console.error(' -- binary search failed at: ', {
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
				console.error(' -- binary search failed at: ', {
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

export { Conversion };