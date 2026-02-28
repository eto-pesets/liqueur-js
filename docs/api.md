# [liqueur-js](../README.md) / API

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

For specification look at [jsdoc reference](./jsdoc/index.html) 