# liqueur-js Basic examples

[Back to README](../README.md)

### Syrup info:

```js
// import { Syrup, Measure } from '/path/to/src/index.js';
const { Syrup, Measure } = LiqueurJS;

let SimpleSyrup = new Syrup(50, Measure.BRIX);
let info = {
    density: SimpleSyrup.get(Measure.DENSITY), // g/ml
    sugar_content: SimpleSyrup.get(Measure.WV), // weight-to-volume, g/ml
    sugar_percent: SimpleSyrup.get(Measure.WW) // weight-to-weight, g/g
};

console.log(SimpleSyrup, info);
```
```js
{
    density: 1.23002,
    sugar_content: 0.61501,
    sugar_percent: 0.5
}
```

### Alcohol info:

```js
// import { Alcohol, Measure } from '/path/to/src/index.js';
const { Alcohol, Measure } = LiqueurJS;

let Vodka = new Alcohol(40, Measure.ABV);
let info = {
    density: Vodka.get(Measure.DENSITY),
    alcohol_to_weight: Vodka.get(Measure.WW), // weight-to-weight, g/g
    concentration: Vodka.get(Measure.WV) // weight-to-volume, g/ml
};

console.log(Vodka, info);
```
```js
{
    alcohol_to_weight: 0.33299999999999996,
    concentration: 0.3153451666666667,
    density: 0.9469833333333333
}
```

### Liqueur composition:

```js
// import { Liqueur, Alcohol, Syrup, Measure, round } from '/path/to/src/index.js';
const { Liqueur, Alcohol, Syrup, Measure, round } = LiqueurJS;

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
    recipe.push(`${id}: ${round(component.get(Measure.ML), 0.1)}ml /  ${round(component.get(Measure.G), 0.1)}ml`);
});

console.log(recipe, composition.info());
```
```js
[
    'alcohol: 280ml /  226.9ml',
    'syrup: 110.3ml /  175ml',
    'buffer: 309.7ml /  309ml'
] {
    volume: 700,
    weight: 710.9172580868906,
    density: 1.0155960829812722,
    abs_spirit: 266.00000000000006,
    abv: 0.38000000000000006,
    sugar: 174.99999999999972
}
```