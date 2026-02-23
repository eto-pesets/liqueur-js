/**
 * @fileoverview A library for mixing liquids (ethanol-water, sucrose-water and ethanol-sucrose-water solutions)
 * @author Pesets <info@pesets.tech>
 * @since 1.0.0
 * @license Apache-2.0
 */

import AlcoholTable from './data/alcohol.table.js';
import SyrupTable from './data/syrup.table.js';

import Translator from './i18n/Translator.js';
import Lang from './i18n/index.js';

import { Measure } from './constants/Measure.js';
import { Density } from './constants/Density.js';

import { Ingredient } from './core/Ingredient.js';
import { Water } from './core/Water.js';
import { Alcohol } from './core/Alcohol.js';
import { Syrup } from './core/Syrup.js';
import { Liqueur } from './core/Liqueur.js';

import { Component } from './core/Component.js';
import { Composition } from './core/Composition.js';

import { Conversion } from './core/Conversion.js';

import round from './core/round.js';

export {
	Measure,
	Density,
	AlcoholTable,
	SyrupTable,

	Ingredient,
	Water,
	Alcohol,
	Syrup,
	Liqueur,

	Component,
	Composition,

	Conversion,
	round,

	Translator,
	Lang
};

/**
 * @typedef {Object} ConstructFrom
 * @property {Alcohol} [alcohol] - main alcohol
 * @property {Syrup} [syrup] - main syrup/sugar
 * @property {CalculationBasis} [basis] - calculation basis
 * @property {ConstructionFallback} [fallback] - fallback ingredients
 *
 * @typedef {Object} CalculationBasis
 * @property {('alcohol'|'syrup'|'total')} source
 * @property {number} value - value
 * @property {MeasureVariant} measure - Measure.*
 *
 * @typedef {Object} ConstructionFallback
 * @property {Alcohol} [alcohol] - fallback alcohol
 * @property {Syrup} [syrup] - fallback syrup/sugar
 *
 * @typedef {Object} LiqueurInfo
 * @property {(string|null)} sugar - human-readable sugar content
 * @property {(string|null)} abv - human-readable alcohol content
 * @property {(string|null)} density - human-readable ddensity
 *
 * @typedef {Object} CompositionInfo
 * @property {number} volume - total volume, ml
 * @property {number} weight - total weight, g
 * @property {number} density - density, g/ml
 * @property {number} abs_spirit - absolute spirit, ml
 * @property {number} abv - alcohol by volume, %
 * @property {number} sugar - total sugar, g
 *
 * @callback ValidationMethod
 * @param {number} value
 * @returns {boolean}
 *
 * @typedef {Object} ValidationMap - { [Syrup]: { [Measure.PW]: (v) => (v >= 0 && v <= 100) } }
 * @property {Constructor} key
 * @property {Object} value
 * @property {MeasureVariant} value.key
 * @property {ValidationMethod} value.value
 */