/**
 * Get target DOM Node
 * @param {(Node|string|Boolean)} [node=document.body] DOM Node, CSS selector, or Boolean
 * @return {Node} The target that the el will be added to
 */
function getTarget (node = document.body) {
  if (node === true) return document.body
  return node instanceof window.Node ? node : document.querySelector(node)
}

/**
 * Move the bound Element to the target Node
 * @param {Node} source - The Node that the directive is bound to
 * @param {Node} target - The source will be added here
 * @param {string} [options.method = 'append'] the method of how the source will be added to the target
 * @return {undefined}
 */
function move (source, target, { method = 'append' /* or prepend */ }) {
  if (method === 'append') {
    target.appendChild(source)
  } else if (method === 'prepend') {
    target.prependChild(source)
  }
}

function getMethod ({ append = true, prepend = false } = {}) {
  return prepend ? 'prepend' : 'append'
}

const homes = new Map()

const directive = {
  inserted (el, { value, modifiers }, vnode) {
    const method = getMethod(modifiers)
    const { parentNode } = el
    const home = document.createComment('')
    let hasMovedOut = false

    if (value !== false) {
      parentNode.replaceChild(home, el) // moving out, el is no longer in the document
      move(el, getTarget(value), { method }) // moving into new place
      hasMovedOut = true
    }

    if (!homes.has(el)) homes.set(el, { parentNode, home, hasMovedOut }) // remember where home is or should be
  },
  componentUpdated (el, { value, modifiers }) { // need to make sure children are done updating (vs. `update`)
    const method = getMethod(modifiers)
    const { parentNode, home, hasMovedOut } = homes.get(el) // recall where home is

    if (!hasMovedOut && value) {
      // remove from document and leave placeholder
      parentNode.replaceChild(home, el)
      // append to target
      move(el, getTarget(value), { method })

      homes.set(el, Object.assign({}, homes.get(el), { hasMovedOut: true }))
    } else if (hasMovedOut && value === false) {
      // previously moved, coming back home
      parentNode.replaceChild(el, home)
      homes.set(el, Object.assign({}, homes.get(el), { hasMovedOut: false }))
    } else if (value) {
      // already moved, going somewhere else
      move(el, getTarget(value), { method })
    }
  },
  unbind (el, { value }) {
    const { hasMovedOut } = homes.get(el) // recall where home is
    if (hasMovedOut) el.parentNode.removeChild(el)
    homes.delete(el)
  }
}

function plugin (Vue, { name = 'dom-portal' } = {}) {
  Vue.directive(name, directive)
}

plugin.version = '0.1.7'

export default plugin

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}
