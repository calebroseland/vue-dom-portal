# Installation

## Direct Download

See [dist folder](https://github.com/calebroseland/vue-dom-portal/tree/dev/dist). Note the dist files are always the latest stable - it's not update-to-date with the dev branch source.

## NPM

### stable version

    $ npm install vue-dom-portal

### development version

    $ git clone https://github.com/calebroseland/vue-dom-portal.git node_modules/vue-dom-portal
    $ cd node_modules/vue-dom-portal
    $ npm install
    $ npm run build

When used in CommonJS, you must explicitly install the validator via `Vue.use()`:


```javascript
const Vue = require('vue')
const VueDomPortal = require('vue-dom-portal')

Vue.use(VueDomPortal)
```

You don't need to do this when using the standalone build, as it installs itself automatically.
