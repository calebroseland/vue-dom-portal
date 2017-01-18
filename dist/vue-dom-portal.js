/*!
 * vue-dom-portal v0.1.1 
 * (c) 2017 Caleb Roseland
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.VueDomPortal = factory());
}(this, (function () { 'use strict';

/**
 * Get target DOM Node
 */
function getTarget (node) {
  if ( node === void 0 ) node = document.body;

  if (node === true) { return document.body }
  return node instanceof window.Node ? node : document.querySelector(node)
}

var homes = new Map();

var directive = {
  inserted: function inserted (el, ref, ref$1) {
    var value = ref.value;
    var key = ref$1.key;

    // el is home
    var parentNode = el.parentNode;
    var home = document.createComment();

    parentNode.replaceChild(home, el); // moving out, el is no longer in the document

    if (!homes.has(key)) { homes.set(key, { parentNode: parentNode, home: home }); } // remember where home is

    if (value !== false) {
      getTarget(value).appendChild(el); // moving out
    }
  },
  update: function update (el, ref, ref$1) {
    var value = ref.value;
    var key = ref$1.key;

    var ref$2 = homes.get(key);
    var parentNode = ref$2.parentNode;
    var home = ref$2.home;

    if (value === false) {
      parentNode.replaceChild(el, home); // moving home
      homes.delete(key); // no need to remember anymore
    } else {
      getTarget(value).appendChild(el); // moving somewhere else
    }
  },
  unbind: function unbind (el, binding, ref) {
    var key = ref.key;

    var ref$1 = homes.get(key);
    var parentNode = ref$1.parentNode;
    var home = ref$1.home;
    parentNode.replaceChild(el, home); // moving home
    homes.delete(key); // no need to remember anymore
  }
};

function plugin (Vue, ref) {
  if ( ref === void 0 ) ref = {};
  var name = ref.name; if ( name === void 0 ) name = 'dom-portal';

  Vue.directive(name, directive);
}

plugin.version = '0.1.2';

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin);
}

return plugin;

})));
