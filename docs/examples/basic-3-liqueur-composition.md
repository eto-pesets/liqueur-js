## [liqueur-js](../../README.md) / [Examples](./index.md) / Liqueur composition

```js
const {  Liqueur, Alcohol, Syrup, Measure, round  } = LiqueurJS;

let TripleSec = new Liqueur(
    new Alcohol(38, Measure.ABV),
    new Syrup(0.250, Measure.WV),
);
let composition = TripleSec.make({
    alcohol: new Alcohol(95, Measure.ABV), // Everclear
    syrup: new Syrup(100, Measure.BRIX), // Plain sugar
    basis: {
        source: 'total',
        value: 700,
        measure: Measure.ML
    }
});

let recipe = [];
composition.components.forEach(({ id, component }, index) => {
    recipe.push(`${id}: ${round(component.get(Measure.ML), 0.1)}ml /  ${round(component.get(Measure.G), 0.1)}g`);
});

console.log(recipe, composition.info());

```
Output:
```
[
  'syrup: 110.3ml /  175g',
  'alcohol: 280.1ml /  226.9g',
  'buffer: 329.2ml /  328.6g'
] {
  volume: 700,
  weight: 730.4921293505151,
  density: 1.0435601847864502,
  abs_spirit: 266.05365817051353,
  abv: 38.0076654529305,
  sugar: 174.99764669907765,
  sugar_content: 0.2499966381415395,
  kcal: 2167.931174440246
}

```
