# liqueur-js Advances examples

[Back to README](../README.md)

## Liqueur composition based on main alcohol

_(Creme de Cassis using a bottle of cognac)_

```js
// import { Liqueur, Alcohol, Syrup, Measure, round } from '/path/to/src/index.js';
const { Liqueur, Alcohol, Syrup, Measure, round } = LiqueurJS;

let CremeDeCassis = new Liqueur(
	new Alcohol(20, Measure.ABV), // 20% ABV
	new Syrup(0.4, Measure.WV) // 400 g/l
);
let composition = CremeDeCassis.make({
	alcohol: new Alcohol(40, Measure.ABV), // Cognac
	syrup: new Syrup(66.67, Measure.BRIX), // Rich syrup
	basis: {
		source: 'alcohol',
		value: 0.5,
		measure: Measure.L,
	},
});

let recipe = [];
for (let key in composition.components) {
	let component = composition.components[key];
	switch (key) {
		case 'alcohol':
			recipe.push(`Cognac: ${round(component.get(Measure.ML))}ml`);
			break;
		case 'syrup':
			recipe.push(`Rich syrup: ${round(component.get(Measure.ML))}ml`);
			break;
		case 'water':
			recipe.push(
				`Blackcurrant juice: ${round(component.get(Measure.ML))}ml`
			);
			break;
	}
}

console.log(recipe, composition.info());
```

```js
[
    'Cognac: 500ml',
    'Rich syrup: 452ml',
    'Blackcurrant juice: 48ml'
]
{
    volume: 1000,
    weight: 1121.3316113015176,
    density: 1.1213316113015175,
    abs_spirit: 200,
    abv: 0.2,
    sugar: 399.99999999999966
}
```

## Cherry liqueur

_(using every `ConstructFrom` parameter, virtual ingredients, attributes, rounding and Translator)_

```js
/*
import {
    Liqueur,
    Alcohol,
    Syrup,
    Water,
    VirtualIngredient,
    Measure,
    Component,
    round,
    Translator,
    Lang
} from '/path/to/src/index.js';
*/
const {
	Liqueur,
	Alcohol,
	Syrup,
	Water,
	VirtualIngredient,
	Measure,
	Component,
	round,
    Translator,
    Lang
} = LiqueurJS;

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
	let name = component.ingredient.getAttribute('name') || id,
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
```

```js
[
    'Cherry Syrup 66.67° Brix: 197.8ml, 262.5g',
    'Merlot 12% ABV: 117.4ml, 115.2g',
    'Cognac 40% ABV: 384.8ml, 364.4g',
    'Cherry juice: 0.1ml, 0.1g',
    'Cinnamon sticks: 1.8g',
    'Fresh or frozen cherries: 350g'
] {
    volume: 700,
    weight: 742.127,
    density: 1.06,
    abs_spirit: 168,
    abv: 0.24,
    sugar: 175
}
```
