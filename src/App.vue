<template>

  <div id="app">
    <meta name="viewport" content="width=device-width,height=device-height,inital-scale=1.0,maximum-scale=1.0,user-scalable=no;">
    <!-- <img src="./assets/logo.png"> -->

    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app',
}
</script>

<style <style lang="scss">

$ebay-blue :#0099f7;
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  overflow: scroll;
  background-color: #EEEEEE;
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
ul{
  padding: 0;
  margin: 0;
}
.mint-tab-item-label{
  font-size: 16px;
}
.mint-navbar .mint-tab-item.is-selected {
    border-bottom: 3px solid #0099f7;
    color: #0099f7;
    margin-bottom: -3px
}
.mint-loadmore-bottom {
  margin: 0;
    position: fixed;
    bottom: -50px;
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
