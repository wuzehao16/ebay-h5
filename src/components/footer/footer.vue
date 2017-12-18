<template>
  <div  class="footer">
    <ul class="tab3">
      <li>
        <router-link class="col" :to="{name: 'ProductList'}">
          <i class="iconfont icon-home"></i>
        <span class="nd-p">首页</span>
        </router-link>
      </li>
      <li>
        <router-link class="col" :to="{name: 'Shoppingcart'}" >
          <i class="iconfont icon-cart"></i>
        <span class="nd-p"> 购物车</span>
        </router-link>
      </li>
      <li>
        <router-link class="col " :to="{name: 'PopularizeList'} ">
          <i class="iconfont icon-share"></i>
          <span class="nd-p">发布商品</span>
        </router-link>
      </li>
      <li>
        <router-link class="col" :to="{name: 'UserCenter'}" >
          <i class="iconfont icon-user"></i>
        <span class="nd-p">会员中心</span>
        </router-link>
      </li>  
    </ul>
      
</div>


</template>

<script>

export default {
  props: ['name'],
  data () {
    return {
      showAddsdMenu: false,
      showMenuWrap: false
    }
  },
  watch: {
    showAddsdMenu (val) {
      if (val) {
        this.showMenuWrap = true
      } else {
        setTimeout(() => {
          this.showMenuWrap = false
        }, 400)
      }
    }
  },
  methods: {
    toAddSd () {
      this.$router.push('')
    },
    i () {
      this.showAddsdMenu = false
    }
  }
}
</script>
<style scoped lang="scss">

.footer{
  position: fixed;
  bottom: 0;
  height: 50px;
  width:100%;
  background-color: #fff;
/*     box-shadow: 0 0 10PX 0 rgba(155,143,143,0.6);
  -webkit-box-shadow: 0 0 10PX 0 rgba(155,143,143,0.6); */
  z-index: 1000;
}
.tab3{
  width: 100%;
  position: relative;
  background-color: #fff;
  display: flex;
}
.tab3 li{
  font-size: 18px;
    list-style-type: none;
    text-align: center;
    flex: 1;
    margin-top: 10px;
    a{
      position: relative;
      color: #999;
      .nd-p{
        font-size: 12px;
        display: block;
        margin-top: -4px;
      }
    }
    a.router-link-active{
      color: #0099f7;
    }
}
</style>
