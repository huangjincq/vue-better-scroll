
import BScroll from './BScroll.vue'

/* istanbul ignore next */
BScroll.install = function (Vue) {
  Vue.component(BScroll.name, BScroll)
}

export default BScroll


if (typeof window !== 'undefined' && window.Vue) { window.Vue.use(BScroll); }