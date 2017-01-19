/**
 * Get target DOM Node
 * @param {(Node|string|Boolean)} [node=document.body] DOM Node, CSS selector, or Boolean
 * @return {Node} The target that the el will be appended to
 */
function getTarget (node = document.body) {
  if (node === true) return document.body
  return node instanceof window.Node ? node : document.querySelector(node)
}

const homes = new Map()

const directive = {
  inserted (el, { value }, vnode) {
    const { parentNode } = el
    const home = document.createComment('')
    let hasMovedOut = false

    if (value !== false) {
      parentNode.replaceChild(home, el) // moving out, el is no longer in the document
      getTarget(value).appendChild(el) // moving into new place
      hasMovedOut = true
    }

    if (!homes.has(el)) homes.set(el, { parentNode, home, hasMovedOut }) // remember where home is or should be
  },
  componentUpdated (el, { value }) { // need to make sure children are done updating (vs. `update`)
    const { parentNode, home, hasMovedOut } = homes.get(el) // recall where home is

    if (!hasMovedOut && value) {

      parentNode.replaceChild(home, el) // remove from document and leave placeholder
      getTarget(value).appendChild(el) // append to target
      homes.set(el, Object.assign({}, homes.get(el), { hasMovedOut: true }))
    } else if (hasMovedOut && value === false) {
      // previously moved, coming back home
      parentNode.replaceChild(el, home)
      homes.set(el, Object.assign({}, homes.get(el), { hasMovedOut: false }))
    } else if (value) {
      // already moved, moving somewhere else
      getTarget(value).appendChild(el)
    }
  },
  unbind (el, binding) {
    homes.delete(el)
  }
}

function plugin (Vue, { name = 'dom-portal' } = {}) {
  Vue.directive(name, directive)
}

plugin.version = '0.1.5'

export default plugin

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}
