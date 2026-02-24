# liqueur-js

README
- [Installation](#installation)
- [Quick start](#quick-start)
- [API](../README.md)
- [Basic examples](./basic-examples.md)
- [Advanced examples](./advanced-examples.md)

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

## Physical model

## License

Apache-2.0
