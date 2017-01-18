/**
 * Get target DOM Node
 */
function getTarget (node = document.body) {
  if (node === true) return document.body
  return node instanceof window.Node ? node : document.querySelector(node)
}

const homes = new Map()

const directive = {
  inserted (el, { value }, { key }) {
    // el is home
    const { parentNode } = el
    const home = document.createCommend('')

    parentNode.replaceChild(home, el) // moving out, el is no longer in the document

    if (!homes.has(key)) homes.set(key, { parentNode, home }) // remember where home is

    if (value !== false) {
      getTarget(value).appendChild(el) // moving out
    }
  },
  update (el, { value }, { key }) {
    const { parentNode, home } = homes.get(key)

    if (value === false) {
      parentNode.replaceChild(el, home) // moving home
      homes.delete(key) // no need to remember anymore
    } else {
      getTarget(value).appendChild(el) // moving somewhere else
    }
  },
  unbind (el, binding, { key }) {
    const { parentNode, home } = homes.get(key)
    parentNode.replaceChild(el, home) // moving home
    homes.delete(key) // no need to remember anymore
  }
}

function plugin (Vue, { name = 'dom-portal' } = {}) {
  Vue.directive(name, directive)
}

plugin.version = '0.1.2'

export default plugin

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}
