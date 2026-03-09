## [liqueur-js](../../README.md) / [Examples](./index.md) / Alcohol info

```js
const {  Alcohol, Measure  } = LiqueurJS;

let Vodka = new Alcohol(40, Measure.ABV);
let info = {
    density: Vodka.get(Measure.DENSITY),
    alcohol_to_weight: Vodka.get(Measure.WW), // weight-to-weight, g/g
    concentration: Vodka.get(Measure.WV) // weight-to-volume, g/ml
};

console.log(Vodka, info);

```
Output:
```
Alcohol {
  density: 0.9469833333333333,
  type: 'alcohol',
  attributes: {}
} {
  density: 0.9469833333333333,
  alcohol_to_weight: 0.33299999999999996,
  concentration: 0.3153451666666667
}

```
