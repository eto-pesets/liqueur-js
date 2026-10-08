## [liqueur-js](../../README.md) / [Examples](./index.md) / Liqueur composition based on main alcohol

_(Creme de Cassis using a bottle of cognac)_

```js
const {  Liqueur, Alcohol, Syrup, Measure, round  } = LiqueurJS;

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
composition.components.forEach(({ id, component }, index) => {
	switch (id) {
		case 'alcohol':
			recipe.push(`Cognac: ${round(component.get(Measure.ML))}ml`);
			break;
		case 'syrup':
			recipe.push(`Rich syrup: ${round(component.get(Measure.ML))}ml`);
			break;
		case 'buffer':
			recipe.push(
				`Blackcurrant juice: ${round(component.get(Measure.ML))}ml`
			);
			break;
	}
});

console.log(recipe, composition.info());

```
Output:
```
[ 'Rich syrup: 452ml', 'Cognac: 500ml', 'Blackcurrant juice: 52ml' ] {
  volume: 1000.0740633112628,
  weight: 1125.8016238292191,
  density: 1.125718249408119,
  abs_spirit: 200.00000000000003,
  abv: 19.998518843474105,
  sugar: 400.03024273545446,
  sugar_content: 0.40000061736522524,
  kcal: 2703.830242862802
}

```
