# vue-dom-portal

[![npm](https://img.shields.io/npm/v/vue-dom-portal.svg)](https://www.npmjs.com/package/vue-dom-portal)
[![vue2](https://img.shields.io/badge/vue-2.x-brightgreen.svg)](https://vuejs.org/)

An escape hatch for DOM Elements in Vue.js components.

The directive `v-dom-portal` will move DOM Nodes from their current place in a Vue component to a target DOM Node via `appendChild`.
Similar to [vue-transfer-dom](https://github.com/rhyzx/vue-transfer-dom), but updated for `vue@2.x`

## Setup

```
npm install vue-dom-portal --save
```


```
import DomPortal from 'vue-dom-portal'
Vue.use(DomPortal)
```




## Usage


The `target` is the DOM Node that the target will be appened to.
To determine this, we can pass a `value` to the directive,
which must be of the following:

- `String`- this will be passed to `document.querySelector(value)` to determine the `target`
- `DOM Node` - this will skip the `querySelector` call and set the `target` explicitly
- `Boolean` - will either appened to `document.body` if `true`, or return to where it came from if `false`
- `undefined` - will behave as `true`, appending to `document.body`

```
<!--will be appended to document.body-->
<div v-dom-portal></div>
<div v-dom-portal="true"></div>

<!--nothing will happen, left in-place-->
<div v-dom-portal="false"></div>

<!--will appended to document.querySelector(#app) -->
<div v-dom-portal="'#app'"></div>
```

If you can't make up your mind on where you want the DOM Node to go,
you can toss it around the page at will with a variable.

```
const vm = new Vue({
  template: `
    <div>
      <div v-dom-portal="selector"></div>
    </div>
  `,
  data: {
    selector: 'body'
  }
})

setTimeout(() => {
  vm.selector = '#app'
}, 500)

setTimeout(() => {
  vm.selector = false
}, 1000)

setTimeout(() => {
  vm.selector = '#another-id'
}, 1500)

```

Since it's just a simple directive, it still works with transitions and directives.

const vm = new Vue({
  template: `
    <div>
      <transition name="fade">
        <div v-dom-portal="selector" v-show="isVisible" class="overlay"></div>
      </transition>
    </div>
  `,
  data: {
    selector: 'body',
    isVisible: false
  }
})
```

<!--
## :book: Documentation
See [here](http://calebroseland.github.io/vue-dom-portal/)

## :scroll: Changelog
Details changes for each release are documented in the [CHANGELOG.md](https://github.com/calebroseland/vue-dom-portal/blob/dev/CHANGELOG.md).-->

Use at your own risk! No tests have been written, but it seems to be working.

If you find any problems please write up an issue!


## :copyright: License

[MIT](http://opensource.org/licenses/MIT)
