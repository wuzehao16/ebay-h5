<template>

  <div id="app">
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
a {
    margin:0;
    padding:0;
    border:0;
    font-size:100%;
    vertical-align:baseline;
    text-decoration: none;
    background:transparent;
    outline:none;
    -webkit-tap-highlight-color:rgba(0,0,0,0);
}
ul{
  padding: 0;
  margin: 0;
}
.mint-indicator-mask {
  z-index: 1000;
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
  display: none;
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
.no-data{
  height: 100px;
  position: fixed;
  width: 100%;
  z-index: 1000;
  background: #eeeeee;
  padding-top: 40px;
  text-align: center;
  color: #999;
}  

</style>
