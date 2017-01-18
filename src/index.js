/**
 * Get target DOM Node
 */
function getTarget (val = document.body) {
  if (val === true) return document.body
  return val instanceof window.Node ? val : document.querySelector(val)
}

const homes = new Map()

const directive = {
  inserted (el, {value}, {key}) {
    if (!homes.has(key)) homes.set(key, el.parentNode) // map el to its home
    if (value === false) return false // on init, nothing to do if false
    getTarget(value).appendChild(el) // moving out
  },
  update (el, {value}, {key}) {
    const target = value === false ? homes.get(key) : getTarget(value) // decide to move somewhere else, or back home
    target.appendChild(el) // then the move
  },
  unbind (el, binding, {key}) {
    homes.delete(key) // clean up
  }
}

function plugin (Vue, {name = 'dom-portal'} = {}) {
  Vue.directive(name, directive)
}

plugin.version = '0.1.1'

export default plugin

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}
