# [liqueur-js](../README.md) / Physical model

The library models liqueur as a liquid mixture composed of three
physical subsystems:

-   ethanol-water solution (alcohol phase)
-   sucrose-water solution (syrup phase)
-   optional composite ingredients (e.g. liqueurs), which are internally
    reduced to alcohol and syrup during calculations

The model is empirical and table-driven. All physical properties are
derived from reference density data and mass balance.

## Composition structure

A liqueur may be composed of multiple ingredients.\
Ingredients may include other liqueurs, but during calculation every
liqueur is reduced to its physical basis:

-   ethanol-water mixture
-   sucrose-water mixture

No recursive thermodynamic modelling is performed.\
Composite ingredients are flattened into their base phases before
physical properties are computed.

## Components

A **Component** represents:

-   an ingredient
-   its mass
-   volume calculated from mass and density of the ingredient

Volume is computed from density using the selected measurement system.\
Supported measures include both mass and volume units (e.g. ml, l, g,
kg, oz), with conversions handled explicitly.

## Density model

Mixture properties are computed from tabulated reference data.

### Ethanol-water table

The ethanol-water table is generated from mixture density values with a
resolution of **0.1 g/L**, covering the full range:

-   100% ethanol - density 0.78816 g/mL
-   100% water - density 0.998 g/mL

The table represents calculated composition values derived from density.

### Sucrose-water table

The sucrose-water table is generated from sucrose mass fraction with a
resolution of **0.1% (w/w)**, covering:

-   0% to 80% sucrose - tabulated values
-   80% to 100% - linear interpolation (reduced accuracy)

High-concentration syrup (above \~80%) is physically unstable and
rapidly crystallizes, making precise modelling in this range unnecessary
for practical production.

A concentration of 100% corresponds to solid crystalline sucrose with
the density of sucrose.

Granulated sugar must be measured **by mass only**, since bulk density
varies significantly with crystal size and packing.

## Reference conditions

Both reference tables are defined at:

-   temperature: **20 °C**
-   pressure: **normal atmospheric pressure**

All calculations assume these conditions.

## Mass and volume behaviour

The model accounts for:

-   concentration-dependent density
-   non-additive volumes in liquid mixtures
-   conversion between mass and volume using tabulated densities

Mixture properties are determined by:

-   component mass
-   reference density tables
-   interpolation within tabulated ranges

## Data sources

Sucrose-water reference data:\
USDA Sugar Series - *Sucrose Conversion Table XV*, May 2025\
https://www.ams.usda.gov/sites/default/files/media/SucroseConversionTableXV.pdf

Ethanol-water reference data:\
Laboratory Alcohol Tables, November 2023\
https://www.gov.uk/government/publications/laboratory-alcohol-table

## Scope and limitations

The model is intended for practical beverage formulation and process
calculations.\
It is not a general thermodynamic simulation.

Accuracy is limited by:

-   tabulated resolution
-   interpolation outside measured ranges
-   assumption of constant temperature and pressure
-   restriction to ethanol, water and sucrose systems
