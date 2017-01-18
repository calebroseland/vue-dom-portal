/*!
 * vue-dom-portal v0.1.4 
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
 * @param {(Node|string|Boolean)} [node=document.body] DOM Node, CSS selector, or Boolean
 * @return {Node} The target that the el will be appended to
 */
function getTarget (node) {
  if ( node === void 0 ) node = document.body;

  if (node === true) { return document.body }
  return node instanceof window.Node ? node : document.querySelector(node)
}

var homes = new Map();

var directive = {
  inserted: function inserted (el, ref, vnode) {
    var value = ref.value;

    var parentNode = el.parentNode;
    var home = document.createComment('');
    var hasMovedOut = false;

    if (value !== false) {
      parentNode.replaceChild(home, el); // moving out, el is no longer in the document
      getTarget(value).appendChild(el); // moving into new place
      hasMovedOut = true;
    }

    if (!homes.has(el)) { homes.set(el, { parentNode: parentNode, home: home, hasMovedOut: hasMovedOut }); } // remember where home is or should be
  },
  componentUpdated: function componentUpdated (el, ref) {
    var value = ref.value;
 // need to make sure children are done updating (vs. `update`)
    var ref$1 = homes.get(el);
    var parentNode = ref$1.parentNode;
    var home = ref$1.home;
    var hasMovedOut = ref$1.hasMovedOut; // recall where home is

    if (!hasMovedOut && value) {
      // never moved out on initial insert; value must have started out false
      parentNode.replaceChild(home, el);
      getTarget(value).appendChild(el); // moving into new place
      homes.set(el, Object.assign.apply(Object, [ {} ].concat( homes.get(el), [{ hasMovedOut: true }] ))); // indicate that we've moved out
    } else if (hasMovedOut && value === false) {
      // already moved out, moving back home
      parentNode.replaceChild(el, home);
      homes.set(el, Object.assign({}, homes.get(el), { hasMovedOut: false })); // indicate that we've moved back home
      // homes.delete(el)
    } else if (value) {
      // already moved out, moving somewhere else
      getTarget(value).appendChild(el);
    }
  },
  unbind: function unbind (el, binding) {
    homes.delete(el); // no need to remember anymore
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
