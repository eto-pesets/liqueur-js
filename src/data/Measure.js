/** @typedef {string} MeasureVariant */
/**
 * Measures.
 * 
 * @summary
 *  - Measure.DENSITY: density, g/ml, [0..Inf]
 *  - Measure.ABV: alcohol by volume, % ABV, [0..100]
 *  - Measure.BRIX: brix degree, ° Brix, [0..100]
 *  - Measure.WW: mass fraction, %w/w, [0..1]
 *  - Measure.WV: mass_concentration, %w/v, [0..Inf]
 *  - Measure.VV: volume fraction, %v/v, [0..1]
 *  - Measure.L: liter
 *  - Measure.ML: milliliter
 *  - Measure.OZ: US fluid ounce
 *  - Measure.G: gram
 *  - Measure.KG: kilogram
 * @readonly
 * @type {Map<string, MeasureVariant>}
 */
export const Measure = {
	DENSITY: 'density',
	ABV: 'alcohol_by_volume',
	BRIX: 'brix',
	WW: 'mass_fraction',
	WV: 'mass_concentration',
	VV: 'volume_fraction',
	L: 'volume_liter',
	ML: 'volume_milliliter',
	OZ: 'volume_ounce',
	G: 'mass_gram',
	KG: 'mass_kilogram',
};