/*!
 * vue-dom-portal v0.1.7 
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
 * @return {Node} The target that the el will be added to
 */
function getTarget (node) {
  if ( node === void 0 ) node = document.body;

  if (node === true) { return document.body }
  return node instanceof window.Node ? node : document.querySelector(node)
}

/**
 * Move the bound Element to the target Node
 * @param {Node} source - The Node that the directive is bound to
 * @param {Node} target - The source will be added here
 * @param {string} [options.method = 'append'] the method of how the source will be added to the target
 * @return {undefined}
 */
function move (source, target, ref) {
  var method = ref.method; if ( method === void 0 ) method = 'append';

  if (method === 'append') {
    target.appendChild(source);
  } else if (method === 'prepend') {
    target.prependChild(source);
  }
}

function getMethod (ref) {
  if ( ref === void 0 ) ref = {};
  var append = ref.append; if ( append === void 0 ) append = true;
  var prepend = ref.prepend; if ( prepend === void 0 ) prepend = false;

  return prepend ? 'prepend' : 'append'
}

var homes = new Map();

var directive = {
  inserted: function inserted (el, ref, vnode) {
    var value = ref.value;
    var modifiers = ref.modifiers;

    var method = getMethod(modifiers);
    var parentNode = el.parentNode;
    var home = document.createComment('');
    var hasMovedOut = false;

    if (value !== false) {
      parentNode.replaceChild(home, el); // moving out, el is no longer in the document
      move(el, getTarget(value), { method: method }); // moving into new place
      hasMovedOut = true;
    }

    if (!homes.has(el)) { homes.set(el, { parentNode: parentNode, home: home, hasMovedOut: hasMovedOut }); } // remember where home is or should be
  },
  componentUpdated: function componentUpdated (el, ref) {
    var value = ref.value;
    var modifiers = ref.modifiers;
 // need to make sure children are done updating (vs. `update`)
    var method = getMethod(modifiers);
    var ref$1 = homes.get(el);
    var parentNode = ref$1.parentNode;
    var home = ref$1.home;
    var hasMovedOut = ref$1.hasMovedOut; // recall where home is

    if (!hasMovedOut && value) {
      // remove from document and leave placeholder
      parentNode.replaceChild(home, el);
      // append to target
      move(el, getTarget(value), { method: method });

      homes.set(el, Object.assign({}, homes.get(el), { hasMovedOut: true }));
    } else if (hasMovedOut && value === false) {
      // previously moved, coming back home
      parentNode.replaceChild(el, home);
      homes.set(el, Object.assign({}, homes.get(el), { hasMovedOut: false }));
    } else if (value) {
      // already moved, going somewhere else
      move(el, getTarget(value), { method: method });
    }
  },
  unbind: function unbind (el, ref) {
    var value = ref.value;

    var ref$1 = homes.get(el);
    var hasMovedOut = ref$1.hasMovedOut; // recall where home is
    if (hasMovedOut) { el.parentNode.removeChild(el); }
    homes.delete(el);
  }
};

function plugin (Vue, ref) {
  if ( ref === void 0 ) ref = {};
  var name = ref.name; if ( name === void 0 ) name = 'dom-portal';

  Vue.directive(name, directive);
}

plugin.version = '0.1.7';

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin);
}

return plugin;

})));
