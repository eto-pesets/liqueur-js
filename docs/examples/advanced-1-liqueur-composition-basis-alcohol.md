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
[ 'Cognac: 500ml', 'Rich syrup: 452ml', 'Blackcurrant juice: 48ml' ] {
  volume: 1000.0000000000005,
  weight: 1121.3316113015183,
  density: 1.1213316113015177,
  abs_spirit: 200.00000000000006,
  abv: 19.999999999999996,
  sugar: 399.99999999999983,
  sugar_content: 0.39999999999999963,
  kcal: 2703.7092719060965
}

```
