<template>
  <div id="app">
    <ul class="tab">
      <li @click="handletoggle(1)">tab1</li>
      <li @click="handletoggle(2)">tab2</li>
    </ul>
    <main class="position-box">
      <div v-if="toggle===1" style="height: 100%">
        <vue-better-scroll
            class="wrapper"
            ref="scroll1"
            :scrollbar="scrollbarObj"
            :pullDownRefresh="pullDownRefreshObj"
            :pullUpLoad="pullUpLoadObj"
            :startY="parseInt(startY)"
            @pullingDown="onPullingDown"
            @pullingUp="onPullingUp">
          <ul ref="list" class="list-content" style="min-height: 95vh">
            <li>tab1</li>
            <li class="list-item" v-for="item in items1">{{item}}</li>
          </ul>
        </vue-better-scroll>
      </div>
      <div v-if="toggle===2" style="height: 100%">
        <vue-better-scroll
            class="wrapper"
            ref="scroll2"
            :scrollbar="scrollbarObj"
            :pullDownRefresh="pullDownRefreshObj"
            :pullUpLoad="pullUpLoadObj"
            @pullingDown="onPullingDown2"
            @pullingUp="onPullingUp2">
          <ul ref="list" class="list-content" style="min-height: 95vh">
            <li>tab2</li>
            <li v-for="item in items2">{{item}}</li>
          </ul>
        </vue-better-scroll>
      </div>
    </main>
    <button class="go-top" @click="scrollTo">返回顶部</button>
  </div>
</template>

<script>
  import VueBetterScroll from './lib'

  let count = 1
  export default {
    name: 'app',
    components: { VueBetterScroll },
    data () {
      return {
        toggle:1,
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
        items1: [],
        items2: []
      }
    },
    mounted () {
      //this.onPullingDown()
      //this.onPullingDown2()
    },
    methods: {
      // 滚动到页面顶部
      scrollTo () {
        this.$refs.scroll.scrollTo(this.scrollToX, this.scrollToY, this.scrollToTime)
      },
      handletoggle(val){
        this.toggle = val
        if(val==1){
          this.onPullingDown()
          this.$nextTick(()=>{
            this.$refs.scroll1.refresh()
          })
        }else{
          this.onPullingDown2()
          this.$nextTick(()=>{
            this.$refs.scroll2.refresh()
          })
        }

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
        console.log('下拉刷新1')
        count = 0
        this.getData().then(res => {
          this.items1 = res
          this.$refs.scroll1.forceUpdate(true)
        })
      },
      onPullingUp () {
        // 模拟上拉 加载更多数据
        console.log('上拉加载1')
        this.getData().then(res => {
          this.items1 = this.items1.concat(res)
          if(count<50){
            this.$refs.scroll1.forceUpdate(true)
          }else{
            this.$refs.scroll1.forceUpdate(false)
          }
        })
      },
      onPullingDown2 () {
        // 模拟下拉刷新
        console.log('下拉刷新2')
        count = 0
        this.getData().then(res => {
          this.items2 = res
          this.$refs.scroll2.forceUpdate(true)
        })
      },
      onPullingUp2 () {
        // 模拟上拉 加载更多数据
        console.log('上拉加载2')
        this.getData().then(res => {
          this.items2 = this.items2.concat(res)
          if(count<50){
            this.$refs.scroll2.forceUpdate(true)
          }else{
            this.$refs.scroll2.forceUpdate(false)
          }
        })
      },
    }
  }
</script>

<style>
  * {
    padding: 0;
    margin: 0;
  }

  body, html {
    height: 100%;
    overflow: hidden;
  }

  #app {
    font-family: '微软雅黑', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
  ul.tab{
    position: fixed;
    top: 0px;
    right: 0;
    left: 0;
    height: 40px;
    z-index: 9;
    background-color: yellowgreen;
    display: flex;
    list-style: none;
    border-bottom: 1px solid #000;
  }
  ul.tab li{
    border-right: 1px solid #000;
    width: 50%;
  }
  .position-box{
    position: fixed;
    top: 40px;
    right: 0;
    left: 0;
    bottom: 0;
  }

  .wrapper{
    height: 100%;
  }
  .list-content {
    list-style: none;
    background: #fff;
  }

  .list-item {
    height: 60px;
    line-height: 60px;
    font-size: 18px;
    padding-left: 20px;
    border-bottom: 1px solid #e5e5e5;
  }
  .go-top{
    position: fixed;
    right: 20px;
    bottom: 20px;
    background-color: #009a61;
    border-radius: 5px;
    border: 1px solid #fff;
    color: #fff;
    padding: 10px 15px;
  }
</style>
