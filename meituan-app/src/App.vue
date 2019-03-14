<template>
  <div id="app">
    <!-- 使用引入的组件（自定义标签） -->
    <!-- header -->
    <!-- 利用props 父组件给子组件传值 -->
    <app-header :poiInfo="poiInfo"></app-header>

    <!-- navigation -->
    <app-nav :commentNum="commentNum"></app-nav>

    <!-- content -->
    <!-- 展示路由的页面 -->
    <!-- <keep-alive>作用：缓存不活动的组件实例，保留组件状态，而不是在切换的时候销毁他们，避免重新渲染。 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
// 引入头部和导航栏组件
import Header from './components/header/Header'
import Nav from '@/components/nav/Nav'

export default {
  name: 'App',
  data(){
    return{
      poiInfo:{}, //网络请求获取的数据
      commentNum:0
    }
  },
  // 注册引入的组件
  components: {
    "app-header":Header,
    "app-nav":Nav
  },

  // 钩子函数created
  // 利用ES6的fetch请求数据
  created(){
    // 请求goods
    fetch("/api/goods")
      .then(res => {
        return res.json()
      })
      .then(response =>{
        if(response.code == 0){
          this.poiInfo = response.data.poi_info  //将获取的数据存储到data中
        }
      })

    // 请求ratings
    fetch("/api/ratings")
      .then(res => {
        return res.json()
      })
      .then(response =>{
        if(response.code == 0){
          this.commentNum = response.data.comment_num
        }
      })
  }
}
</script>

<style>

</style>
