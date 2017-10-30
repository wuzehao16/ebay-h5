<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <!-- <top-bar v-show="showFooter" :name="$route.name"></top-bar> -->
    <top-bar></top-bar>
    <router-view/>
  </div>
</template>

<script>
import Topbar from '@/components/top_bar/topBar';
export default {
  name: 'app',
  components:{
    'top-bar':Topbar
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
}
.clearfix:after{
  content:"";
  height:0;
  line-height:0;
  display:block;
  visibility:hidden;
  clear:both;
}
a{
  text-decoration: none;
}
.mint-loadmore-bottom {
  margin: 0;
    position: fixed;
    bottom: -50px;
    background: #ccc;
    width: 100%;  
}
.mint-loadmore {
  overflow: inherit;
}
.container{
  margin-top: 100px;
}
.mint-tab-container {
    overflow: inherit;
}
h3 {
  font-weight: normal;
  font-size: 16px;
}
</style>
