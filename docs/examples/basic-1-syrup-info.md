## [liqueur-js](../../README.md) / [Examples](./index.md) / Syrup info

```js
const {  Syrup, Measure  } = LiqueurJS;

let SimpleSyrup = new Syrup(50, Measure.BRIX);
let info = {
    density: SimpleSyrup.get(Measure.DENSITY), // g/ml
    sugar_content: SimpleSyrup.get(Measure.WV), // weight-to-volume, g/ml
    sugar_percent: SimpleSyrup.get(Measure.WW) // weight-to-weight, g/g
};

console.log(SimpleSyrup, info);

```
Output:
```
Syrup { density: 1.23002, type: 'syrup', attributes: {} } { density: 1.23002, sugar_content: 0.61501, sugar_percent: 0.5 }

```
