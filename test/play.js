
import { Liqueur, Alcohol, Syrup, Water, VirtualIngredient, Component, Measure, round, Translator, Lang } from '../src/index.js';
// const { Liqueur, Alcohol, Syrup, Measure, round } = LiqueurJS;

// initialize the Translator
let t = new Translator('en', Lang.en);

// set liqueur data (24% ABV, sugar 250g/l)
let CherryLiqueur = new Liqueur(
	new Alcohol(24, Measure.ABV),
	new Syrup(0.25, Measure.WV)
);

// define ingredients with 'name' attribute
    // Merlot wine at 12% ABV
let Wine = new Alcohol(12, Measure.ABV).attr({ name: 'Merlot' }),
	// Cognac at 40% ABV
	Cognac = new Alcohol(40, Measure.ABV).attr({ name: 'Cognac' }),
	// Rich cherry syrup (2:1 or 66.67% sugar:juice)
	CherrySyrup = new Syrup(66.67, Measure.BRIX).attr({ name: 'Cherry Syrup' }),
	// Just sugar, 100% sucrose
	Sugar = new Syrup(100, Measure.BRIX).attr({ name: 'Good old sugar' }),
	// Cherry juice treated as buffer
	CherryJuice = new Water().attr({ name: 'Cherry juice' }),
	// Cinnamon sticks (virtual)
	Cinnamon = new VirtualIngredient().attr({ name: 'Cinnamon sticks' }),
	// Cherries (virtual)
	Cherries = new VirtualIngredient().attr({
		name: 'Fresh or frozen cherries',
	});

// Make a composition from real ingredients
let composition = CherryLiqueur.make({
	alcohol: Wine, // main alcohol
	syrup: CherrySyrup, // main syrup
	fallback: {
		alcohol: Cognac, // - used when the main is not strong enough
		syrup: Sugar, // - used when the main is not sugary enough
	},
	priority: 'syrup', // what goes in first and fills up all the space
	buffer: CherryJuice, // used to fill up the space
	basis: {
		// everything is scaled to fit basis
		source: 'total',
		value: 1,
		measure: Measure.L,
	},
});

// add virtual ingredients
composition.add('cinnamon', new Component(Cinnamon, 2.5, Measure.G));
composition.add('cherries', new Component(Cherries, 500, Measure.G));

// scale everything to 700ml
composition.scaleTo(700, Measure.ML);

// gather ingredients to a readable recipe
// all values are rounded to 0.1
let recipe = [];
composition.components.forEach(({ id, component }, index) => {
	let name = component.ingredient.attr('name') || id,
		quantity =
			(component.is(VirtualIngredient)
				? ''
				: `${t.translate(component.fget(Measure.ML, 0.1))}, `) +
			`${t.translate(component.fget(Measure.G, 0.1))}`;

    let value = '';
    if (component.is(Syrup))
        value = ' '+t.translate(component.fget(Measure.BRIX));
    if (component.is(Alcohol))
        value = ' '+t.translate(component.fget(Measure.ABV));

	recipe.push(`${name}${value}: ${quantity}`);
});

// show recipe and info with values rounded to 0.001
console.log(recipe, composition.info(0.001));