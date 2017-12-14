# [vue-better-scroll](https://github.com/huangjincq/vue-better-scroll)

> A vue plugins based on [better-scroll](https://github.com/ustbhuangyi/better-scroll)

> 最近写移动端项目，下拉刷新、上拉加载的场景很常见，发现 [mint-ui](https://github.com/ElemeFE/mint-ui) 的 Loadmore 组件效果体验不尽如人意， [Vux](https://github.com/airyland/vux) 的 Scroller 组件作者不推荐使用也停止维护了，最后决定根据better-scroll封装成自己的vue组件，作者也提供了详细的教程。

# Example
[Demo Page](https://huangjincq.github.io/vue-better-scroll/)

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
<vue-better-scroll
    style="height:300px"  // 需要规定滚动的容器的高度，不然无法初始化
    class="wrapper"
    ref="scroll"
    :scrollbar="scrollbarObj"
    :pullDownRefresh="pullDownRefreshObj"
    :pullUpLoad="pullUpLoadObj"
    :startY="parseInt(startY)"
    @pullingDown="onPullingDown"
    @pullingUp="onPullingUp">
    <ul ref="list" class="list-content">
        <li class="list-item" v-for="item in items">{{item}}</li>
    </ul>
</vue-better-scroll>

<script>
  import VueBetterScroll from 'vue2-better-scroll'

  let count = 1
  export default {
    name: 'app',
    components: { VueBetterScroll },
    data () {
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
        startY: 0,  // 纵轴方向初始化位置
        scrollToX: 0,
        scrollToY: 0,
        scrollToTime: 700,
        items: []
      }
    },
    mounted () {
      this.onPullingDown()
    },
    methods: {
      // 滚动到页面顶部
      scrollTo () {
        this.$refs.scroll.scrollTo(this.scrollToX, this.scrollToY, this.scrollToTime)
      },
      // 模拟数据请求
      getData () {
        return new Promise(resolve => {
          setTimeout(() => {
            const arr = []
            for (let i = 0; i < 20; i++) {
              arr.push(count++)
            }
            resolve(arr)
          }, 1000)
        })
      },
      onPullingDown () {
        // 模拟下拉刷新
        console.log('下拉刷新')
        count = 0
        this.getData().then(res => {
          this.items = res
          this.$refs.scroll.forceUpdate(true)
        })
      },
      onPullingUp () {
        // 模拟上拉 加载更多数据
        console.log('上拉加载')
        this.getData().then(res => {
          this.items = this.items.concat(res)
          if(count<50){
            this.$refs.scroll.forceUpdate(true)
          }else{
            this.$refs.scroll.forceUpdate(false)
          }
        })
      }
    }
  }
</script>
```

### Attributes:

参数 | 说明 | 类型 | 可选值 | 默认值
|---|---|---|---|---|
probeType | 派发scroll事件的条件 | Number | 1、2、3 | 1 |
click | better-scroll 会派发一个 click 事件 | Boolean |  | true
listenScroll | 是否监听滚动，开启后才能派发scroll事件| Boolean |  | false
listenBeforeScroll | 是否监听滚动之前，开启后才能派发beforeScrollStart事件| Boolean |  | false
direction | 滚动方向| String | horizontal、vertical | vertical
scrollbar | 这个配置可以开启滚动条。当设置为 true 或者是一个 Object 的时候，都会开启滚动条，默认是会 fade 的 | Boolean or Object | {fade: true},  | false
pullDownRefresh | 这个配置用于做下拉刷新功能。当设置为 true 或者是一个 Object 的时候，可以开启下拉刷新，可以配置顶部下拉的距离（threshold） 来决定刷新时机以及回弹停留的距离（stop）| Boolean or Object | {threshold: 90,stop: 40}, | false
pullUpLoad | 这个配置用于做上拉加载功能。当设置为 true 或者是一个 Object 的时候，可以开启上拉加载，可以配置离底部距离阈值（threshold）来决定开始加载的时机| Boolean or Object | { threshold: 0, txt: { more: '加载更多',noMore:'没有更多数据了'} } | false
startY | 纵轴方向初始化位置 | Number |  | 0
freeScroll | 有些场景我们需要支持横向和纵向同时滚动，而不仅限制在某个方向，这个时候我们只要设置 freeScroll 为 true 即可 | Boolean |  | false

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
beforeScrollStart | 触发时机：滚动开始之前 (触发事件在参数中需要开启 **listenBeforeScroll** ) | 无
pullingDown | 触发时机：在一次下拉刷新的动作后，这个时机一般用来去后端请求数据。(触发事件在参数中需要开启 **pullDownRefresh** 相关配置 ) | 无
pullingUp | 触发时机：在一次上拉加载的动作后，这个时机一般用来去后端请求数据。(触发事件在参数中需要开启 **pullingUp** 相关配置 ) | 无


---
> 目前只提供了以上常用方法、Api,如有额外需要请 issue

# More detailed settings, please visit
[better-scroll document](https://ustbhuangyi.github.io/better-scroll/doc/)

# Author Blog

[Gold_Gold](https://juejin.im/user/5972b4386fb9a06bb5406eac)