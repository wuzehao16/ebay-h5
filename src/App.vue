<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
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
.mint-tab-container {
    overflow: inherit;
}
h3 {
  font-weight: normal;
  font-size: 16px;
}
</style>
