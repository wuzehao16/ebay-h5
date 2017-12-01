<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <!-- <transition name="fade"> -->
      <keep-alive>
        <router-view class="child-view"></router-view>
      </keep-alive>
    <!-- </transition> -->
    <foot v-if="$store.state.showFoot"></foot>
  </div>
</template>
<script>
import Footer from '@/components/footer/footer'
export default {
  name: 'app',
  components:{
    'foot':Footer
  },
}
</script>

<style lang="scss">
$ebay-blue :#0099f7;
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // height: 100vh;
  background-color: #EEEEEE;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
/*   position: absolute;
  width: 100%; */
}

 .fade-leave-active {
  transition: opacity .2s;
}
.fade-enter-active {
  transition:  opacity .6s;
}

.fade-enter, .fade-leave {
  opacity: 0;
}

.child-view {
  // position: absolute;
  width: 100vw;
  height: 100vh;
  // transition: all 1s cubic-bezier(.55,0,.1,1);
}
.slide-left-enter, .slide-right-leave-active {
  opacity: 0;
  -webkit-transform: translate(30px, 0);
  transform: translate(30px, 0); 
}
.slide-left-leave-active, .slide-right-enter {
  opacity: 0;
  -webkit-transform: translate(-30px, 0);
  transform: translate(-30px, 0); 
}
.slide-left-enter, .slide-right-leave-active,
.slide-left-leave-active, .slide-right-enter {
  .foot-cart {
    transform: scale(0);
  }
}

.mint-searchbar{
  background-color: #0099f7!important;
  height: 42px;
  .mint-searchbar-inner{
    border-radius: 25px;
    i{
      font-size: 16px;
      margin-left: 8px;
    }
  }
  .mint-searchbar-cancel{
    color: #fff;
  }
}
.mint-search {
  height: 53px !important;
    z-index: 11;
    position: fixed;
    width: 100%;
    top: 0;
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
  z-index: -1;
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
.order-container {
    padding: 10px 0 10px 80px;
    background-size: 70px auto!important;
    height: 80px;
    line-height: 34px;
  h3, p {
    margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      word-wrap: break-word;  
      word-break: break-all;  
  } 
  h3 {
    margin-top: -6px;
  }
  p {
    -webkit-line-clamp: 1;
    color: gray;
  }
  .price {
    color: #0099f7;
  }
  .amount {
    float: right;
    font-size: 14px;
    color: gray;
  }
}
</style>
