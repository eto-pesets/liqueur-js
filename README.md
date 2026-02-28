# liqueur-js

- [liqueur-js](#liqueur-js)
  - [Installation](#installation)
    - [Composer](#composer)
    - [Laravel](#laravel)
  - [Quick start](#quick-start)
  - [Documentation](#documentation)
  - [Demo applications](#demo-applications)
    - [Contributing](#contributing)
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
    __DIR__.'/../../vendor/eto-pesets/liqueur-js/src' => public_path('assets/js/liqueur-js/src'),
    // browser bundle
    __DIR__.'/../../vendor/eto-pesets/liqueur-js/dist' => public_path('assets/js/liqueur-js/dist'),
], 'liqueur-js');
```

2. Publish the files

```shell
php artisan vendor:publish --tag=liqueur-js
```

Or add this script to `composer.json` so it will run automatically after `composer update`

```js

"post-update-cmd": [
    ...,
    "@php artisan vendor:publish --tag=liqueur-js"
],
            
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

## Documentation

Conceptual and technical documentation is available in the following sections:

 - **API**  
    - [API overview](docs/api.md)
    - [local](docs/jsdoc/index.html) or [hosted](https://pesets.tech/liqueur-js/jsdoc) JSDoc reference
 - **Examples**
   - [Basic examples](docs/basic-examples.md)
   - [Advanced examples](docs/advanced-examples.md)
 - **Model description**
   - [Physical model](docs/physical-model.md)

## Demo applications

See [Composition demo](https://pesets.tech/liqueur-js/composition) and [Liqueur calculator](https://pesets.tech/liqueur-js/calculator)

### Contributing

Contributions are welcome.

If you would like to help improve the project, the most valuable contributions at the moment are:

- **Language files**  (`i18n/{code}.js`)  
  Expanding and improving translations.

- **Documentation improvements** (`*.md`, `JSDoc`)  
  Enhancements to Markdown documentation and JSDoc reference:
  - clarifications
  - examples
  - corrections
  - structural improvements

## License

Apache-2.0
