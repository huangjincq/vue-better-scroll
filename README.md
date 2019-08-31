# [vue-better-scroll](https://github.com/huangjincq/vue-better-scroll)

> A vue plugins based on [better-scroll](https://github.com/ustbhuangyi/better-scroll)

> 最近写移动端项目，下拉刷新、上拉加载的场景很常见，发现 [mint-ui](https://github.com/ElemeFE/mint-ui) 的 Loadmore 组件效果体验不尽如人意， [Vux](https://github.com/airyland/vux) 的 Scroller 组件作者不推荐使用也停止维护了，最后决定根据better-scroll封装成自己的vue组件，作者也提供了详细的教程。

# Example
[Demo Page](https://huangjincq.github.io/vue-better-scroll/)

# 滚动原理

由于 better-scroll 的滚动原理为：在滚动方向上，第一个子元素的长度超过了容器的长度。

那么对于 Scroll 组件，其实就是内容元素 .list-content 在滚动方向上的长度必须大于容器元素 .wrapper。

任何时候如果出现无法滚动的情况，都应该首先查看内容元素 .list-content 的元素高度/宽度是否大于容器元素 .wrapper 的高度/宽度。这是内容能够滚动的前提条件。如果内容存在图片的情况，可能会出现 DOM 元素渲染时图片还未下载，因此内容元素的高度小于预期，出现滚动不正常的情况。此时你应该在图片加载完成后，比如 onload 事件回调中，手动调用 vue-better-scroll 组件的 refresh() 方法，它会重新计算滚动距离。

# Use Setup

### Install vue2-better-scroll
```javascript
yarn add vue2-better-scroll
// or
npm install vue2-better-scroll -s
```

### Vue mount

```javascript
// import
import Vue from 'vue'
import VueBetterScroll from 'vue2-better-scroll'

// or require
var Vue = require('vue')
var VueBetterScroll = require('vue2-better-scroll')

// mount with global
Vue.use(VueBetterScroll)

// mount with component(can't work in Nuxt.js/SSR)
import { VueBetterScroll } from 'vue2-better-scroll'

export default {
  components: {
    VueBetterScroll
  }
}


// 或者直接导入js文件
<script src="./dist/vue-better-scroll.js"></script>

```

### Use in SPA
```html
<template>
  <div id="app">
    <header>vue-better-scroll demo</header>
    <main class="position-box">  <!-- 需要一个创建一个父容器 组件高度默认等于父容器的高度 -->
      <vue-better-scroll class="wrapper"
                         ref="scroll"
                         :scrollbar="scrollbarObj"
                         :pullDownRefresh="pullDownRefreshObj"
                         :pullUpLoad="pullUpLoadObj"
                         :startY="parseInt(startY)"
                         @pulling-down="onPullingDown"
                         @pullin-up="onPullingUp">
        <ul class="list-content">
          <li class="list-item"
              v-for="item in items">{{item}}</li>
        </ul>
      </vue-better-scroll>
    </main>
    <button class="go-top"
            @click="scrollTo">返回顶部</button>
  </div>
</template>

<script>
  import VueBetterScroll from '../dist/vue-better-scroll'
  // import VueBetterScroll from './lib'

  let count = 1
  export default {
    name: 'app',
    components: { VueBetterScroll },
    data() {
      return {
        // 这个配置可以开启滚动条，默认为 false。当设置为 true 或者是一个 Object 的时候，都会开启滚动条，默认是会 fade 的
        scrollbarObj: {
          fade: true
        },
        // 这个配置用于做下拉刷新功能，默认为 false。当设置为 true 或者是一个 Object 的时候，可以开启下拉刷新，可以配置顶部下拉的距离（threshold） 来决定刷新时机以及回弹停留的距离（stop）
        pullDownRefreshObj: {
          threshold: 90,
          stop: 40
        },
        // 这个配置用于做上拉加载功能，默认为 false。当设置为 true 或者是一个 Object 的时候，可以开启上拉加载，可以配置离底部距离阈值（threshold）来决定开始加载的时机
        pullUpLoadObj: {
          threshold: 0,
          txt: {
            more: '加载更多',
            noMore: '没有更多数据了'
          }
        },
        startY: 0, // 纵轴方向初始化位置
        scrollToX: 0,
        scrollToY: 0,
        scrollToTime: 700,
        items: []
      }
    },
    mounted() {
      this.onPullingDown()
    },
    methods: {
      // 滚动到页面顶部
      scrollTo() {
        this.$refs.scroll.scrollTo(this.scrollToX, this.scrollToY, this.scrollToTime)
      },
      // 模拟数据请求
      getData() {
        return new Promise(resolve => {
          setTimeout(() => {
            const arr = []
            for (let i = 0; i < 10; i++) {
              arr.push(count++)
            }
            resolve(arr)
          }, 1000)
        })
      },
      onPullingDown() {
        // 模拟下拉刷新
        console.log('下拉刷新')
        count = 0
        this.getData().then(res => {
          this.items = res
          this.$refs.scroll.forceUpdate(true)
        })
      },
      onPullingUp() {
        // 模拟上拉 加载更多数据
        console.log('上拉加载')
        this.getData().then(res => {
          this.items = this.items.concat(res)
          if (count < 30) {
            this.$refs.scroll.forceUpdate(true)
          } else {
            this.$refs.scroll.forceUpdate(false)
          }
        })
      }
    }
  }
</script>

<style>
  .position-box {
    position: fixed;
    top: 40px;
    left: 0;
    right: 0;
    bottom: 0;
  }
</style>

```

### Attributes:

参数 | 说明 | 类型 | 可选值 | 默认值
|---|---|---|---|---|
probeType | 派发scroll事件的条件 | Number | 1、2、3 | 1 |
click | better-scroll 会派发一个 click 事件 | Boolean |  | true
listenScroll | 是否监听滚动，开启后才能派发scroll事件| Boolean |  | false
listenBeforeScroll | 是否监听滚动之前，开启后才能派发before-scroll-start事件| Boolean |  | false
scrollbar | 这个配置可以开启滚动条。当设置为 true 或者是一个 Object 的时候，都会开启滚动条，默认是会 fade 的 | Boolean or Object | {fade: true},  | false
pullDownRefresh | 这个配置用于做下拉刷新功能。当设置为 true 或者是一个 Object 的时候，可以开启下拉刷新，可以配置顶部下拉的距离（threshold） 来决定刷新时机以及回弹停留的距离（stop）| Boolean or Object | {threshold: 90,stop: 40}, | false
pullUpLoad | 这个配置用于做上拉加载功能。当设置为 true 或者是一个 Object 的时候，可以开启上拉加载，可以配置离底部距离阈值（threshold）来决定开始加载的时机| Boolean or Object | { threshold: 0, txt: { more: '加载更多',noMore:'没有更多数据了'} } | false
startY | 纵轴方向初始化位置 | Number |  | 0
freeScroll | 有些场景我们需要支持横向和纵向同时滚动，而不仅限制在某个方向，这个时候我们只要设置 freeScroll 为 true 即可 | Boolean |  | false
options | 可自行根据 better-scroll 官方文档 扩展参数 例：`:options="{stopPropagation:true}"` | Object | 官方文档的所有参数（注：props传入的相同的属性会覆盖options传入的） | {}

### Slots:

name | 说明
|---|---|
default | 滚动的主体内容区域
pulldown | 下拉刷新的内容
pullup |  上拉加载的内容

### Methods:
方法名 | 说明 | 参数
|---|---|---|
initScroll | 初始化scroll组件 | |
disable | 禁用 better-scroll，DOM 事件（如 touchstart、touchmove、touchend）的回调函数不再响应 | |
enable | 启用 better-scroll, 默认 开启 | |
refresh | 重新计算 better-scroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常（当页面无法滚动时，可尝试调用此方法）| |
scrollTo | 滚动到指定的位置 | (scrollToX, scrollToY, scrollToTime, easing)接收4个参数，1.x横轴坐标(px) 2.y 纵轴坐标(px) 3.滚动动画执行的时长(ms) 4.easing 缓动函数，一般不建议修改
scrollToElement | 滚动到指定的目标元素 | (el, time, offsetX , offsetY )接收4个参数 详情请查看: [scrollToElement](https://ustbhuangyi.github.io/better-scroll/doc/zh-hans/api.html#scrolltoelementel-time-offsetx-offsety-easing)
destroy | 销毁 better-scroll，解绑事件
**forceUpdate** | 数据跟新后强制更新页面 | (dirty)接收1个 boolean 类型的参数，如果参数为true，说明还可以触发下拉或者上拉事件，若参数为false表示之后不可拉动，一般用于数据加载全部了

### Events:
事件名称 | 说明 | 回调参数
|---|---|---|
scroll | 触发时机：滚动过程中，具体时机取决于选项中的 probeType (触发事件在参数中需要开启 **listenScroll** ) | 共1个参数,类型Object, {x, y} 滚动的实时坐标
before-scroll-start | 触发时机：滚动开始之前 (触发事件在参数中需要开启 **listenBeforeScroll** ) | 无
pulling-down | 触发时机：在一次下拉刷新的动作后，这个时机一般用来去后端请求数据。(触发事件在参数中需要开启 **pullDownRefresh** 相关配置 ) | 无
pullin-up | 触发时机：在一次上拉加载的动作后，这个时机一般用来去后端请求数据。(触发事件在参数中需要开启 **pullingUp** 相关配置 ) | 无


---
> 目前只提供了以上常用方法、Api,如有额外需要请 issue

# More detailed settings, please visit
[better-scroll document](https://ustbhuangyi.github.io/better-scroll/doc/)

# Author Blog

[Gold_Gold](https://juejin.im/user/5972b4386fb9a06bb5406eac)
