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
  'alcohol: 280ml /  226.9g',
  'syrup: 110.3ml /  175g',
  'buffer: 309.7ml /  309g'
] {
  volume: 700,
  weight: 710.9172580868906,
  density: 1.0155960829812722,
  abs_spirit: 265.9999999999999,
  abv: 37.999999999999986,
  sugar: 174.99999999999972,
  sugar_content: 0.24999999999999958,
  kcal: 2167.6445307999984
}

```
