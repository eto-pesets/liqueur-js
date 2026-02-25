# liqueur-js

README
- [liqueur-js](#liqueur-js)
  - [Installation](#installation)
    - [Composer](#composer)
    - [Laravel](#laravel)
  - [Quick start](#quick-start)
  - [API](#api)
  - [Basic examples](#basic-examples)
  - [Advanced examples](#advanced-examples)
  - [Physical model](#physical-model)
  - [License](#license)

## Installation

### Composer

Use `composer` to install the library

```
composer require eto-pesets/liqueur-js
```

### Laravel

To use with Laravel you should publish library files to assets. For example: _(change paths to fit your project's structure)_

1. Add this code to `AppServiceProvider::boot()`

```php
$this->publishes([
    // modules
    __DIR__.'/../../vendor/eto-pesets/liqueur-js/src' => public_path('assets/js/eto-pesets/liqueur-js/src'),
    // browser bundle
    __DIR__.'/../../vendor/eto-pesets/liqueur-js/dist' => public_path('assets/js/eto-pesets/liqueur-js/dist'),
], 'public');
```

2. Publish the files

```shell
php artisan vendor:publish --tag=public
```

## Quick start

Import the main file:

Module:

```js
import { Liqueur, Syrup, Alcohol /*, ... */ } from '/path/to/src/index.js';
```

Browser bundle: 

```html
<script src="/path/to/dist/bundle.js"></script>
<script>
	const { Liqueur, Syrup, Alcohol /*, ... */ } = LiqueurJS;
</script>
```

## API


See [API](docs/api.md) and [local](docs/jsdoc/index.html) and [hosted](https://pesets.tech/liqueur-js-docs) JSDoc reference

## Basic examples

See [Basic examples](docs/basic-examples.md)

## Advanced examples

See [Advanced examples](docs/advanced-examples.md)

## Physical model

## License

Apache-2.0
