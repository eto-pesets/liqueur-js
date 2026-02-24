# liqueur-js API

[Back to README](../README.md)

## 1. API Overview

The library exports classes for representing ingredients, mixtures,
and target solutions.

Basic exports:

- `Liqueur` — target solution with alcohol and sugar content
- `Alcohol` — ethanol–water solution
- `Syrup` — sucrose–water solution
- `Water` — water

Additional ingredients:

- `Ingredient` — base class for all ingredients
- `VirtualIngredient` — a special ingredient that scales with the composition, but doesn't impact total weight/volume

Composition:

- `Composition` — collection of components
- `Component` — ingredient with quantity

I18n and formatting:

- `Translator` — translation/formatting service
- `Lang` - a collection of localized templates

Data:

- `Measure` — measurement units
- `Density` - densities of pure substances at 20°C
- `AlcoholTable` — data table for ethanol-water solutions
- `SyrupTable` — data table for sucrose-water solutions

Conversions:

- `Conversion` - class that holds all validation and conversion functions

Misc:
- `round` — function for rounding numbers with a given precision


## 2. Classes

### Liqueur

Represents a target liqueur defined by alcohol content and sugar concentration.

A union of syrup and alcohol solution.

Takes "sugar content" from syrup and "alcohol content" from alcohol and creates a liqueur with both characteristics combined.

Internally normalised to 1000 mL reference volume.

```js
new Liqueur(Alcohol alcohol?, Syrup syrup?);
```

### Alcohol

Ethanol-water solution

```js
new Alcohol(Number quantity, String measure)
```

### Syrup

Sucrose-water solution

```js
new Syrup(Number quantity, String measure)
```

### Water

Just water. Used in compositions as buffer.

```js
new Water()
```

### Ingredient

Base class for all ingredients. Not used directly.

### VirtualIngredient
A special ingredient that scales with the composition, but doesn't impact total weight/volume

```js
new VirtualIngredient()
```

### Composition
Collection of components

```js
new Composition()
```
### Component
Ingredient with quantity

Quantity is converted to weight based on ingredient's density

```js
new Component(Ingredient ingredient, Number quantity, String measure)
```

### Translator
Translation/formatting service.

Ready for customization.

```js
new Translator(String code, Lang data)
```

### Lang
A collection of localized templates 

### Measure
Measurement units

### Density
Densities of pure substances at 20°C

### AlcoholTable
Data table for ethanol-water solutions

### SyrupTable
Data table for sucrose-water solutions

### Conversion
Class that holds all validation and conversion functions

### round
Function for rounding numbers with a given precision

```js
round(Number value, Number precision)
```