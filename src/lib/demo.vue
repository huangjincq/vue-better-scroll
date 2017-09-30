<template>
  <div class="page">
    <main class="position-box">
      <b-scroll
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
      </b-scroll>
    </main>
  </div>
</template>
<script>
  import BScroll from '@/components/BScroll'
  let count = 1
  export default {
    components: { BScroll },
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
        scrollToY: -200,
        scrollToTime: 700,
        items: [],
        itemIndex: 0
      }
    },
    mounted () {
      this.onPullingDown()
    },
    methods: {
      scrollTo () {
        this.$refs.scroll.scrollTo(this.scrollToX, this.scrollToY, this.scrollToTime)
      },
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
        console.log('pulling down and load data')
        count = 0
        this.getData().then(res => {
          this.items = res
          this.$refs.scroll.forceUpdate(true)
        })
      },
      onPullingUp () {
        // 更新数据
        this.getData().then(res => {
          this.items = this.items.concat(res)
          this.$refs.scroll.forceUpdate(false)
        })
        /* setTimeout(() => {
         if (Math.random() > 0.5) {
         // 如果有新数据
         const newPage = []
         for (let i = 0; i < 10; i++) {
         newPage.push('我是第' + ++this.itemIndex + '行')
         }
         this.items = this.items.concat(newPage)
         this.$refs.scroll.forceUpdate(true)
         } else {
         // 如果没有新数据
         this.$refs.scroll.forceUpdate(false)
         }
         }, 2000)*/
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .page
    height 100%
    position relative
    .position-box
      position absolute
      top 40px
      left 0
      right 0
      bottom 0
      .wrapper
        height 100%
      .list-content
        position: relative
        z-index: 10
        background: #fff
        .list-item
          height: 60px
          line-height: 60px
          font-size: 18px
          padding-left: 20px
          border-bottom: 1px solid #e5e5e5
</style>

