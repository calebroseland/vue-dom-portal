/*!
 * vue-dom-portal v0.1.0 
 * (c) 2017 Caleb Roseland
 * Released under the MIT License.
 */
'use strict';

/**
 * Get target DOM Node
 */
function getTarget (val) {
  if ( val === void 0 ) val = document.body;

  if (val === true) { return document.body }
  return val instanceof window.Node ? val : document.querySelector(val)
}

var homes = new Map();

var directive = {
  inserted: function inserted (el, ref, ref$1) {
    var value = ref.value;
    var key = ref$1.key;

    if (!homes.has(key)) { homes.set(key, el.parentNode); } // map el to its home
    if (value === false) { return false } // on init, nothing to do if false
    getTarget(value).appendChild(el); // moving out
  },
  update: function update (el, ref, ref$1) {
    var value = ref.value;
    var key = ref$1.key;

    var target = value === false ? homes.get(key) : getTarget(value); // decide to move somewhere else, or back home
    target.appendChild(el); // then the move
  },
  unbind: function unbind (el, binding, ref) {
    var key = ref.key;

    homes.delete(key); // clean up
  }
};

function plugin (Vue, ref) {
  if ( ref === void 0 ) ref = {};
  var name = ref.name; if ( name === void 0 ) name = 'dom-portal';

  Vue.directive(name, directive);
}

plugin.version = require('./package.json').version;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin);
}

module.exports = plugin;
