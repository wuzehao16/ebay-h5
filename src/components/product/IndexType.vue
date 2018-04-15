<template>
  <div class="container index-container">
      <section class="left-w" id="wrapper_menu" ref="wrapperMenu">
        <ul>
          <li v-for="(v, i) in menuList" :class="{'activity_menu': (menuIndex == i)}" @click="chooseMenu(i)" :key="i">
            <img :src="v.imageUrl" style="width:10px;height:10px" alt="">

            <span>{{ v.name }}</span>

          </li>
        </ul>
      </section>

    <section class="right-w" ref="menuGoodList">
      <ul>
        <li v-for="(item,index) in menuList" :key="index">
        <header class="menu_detail_header">
            <section class="menu_detail_header_left">
                <strong class="menu_item_title">{{item.name}}</strong>
                <span class="menu_item_description">{{item.description}}</span>
            </section>
        </header>
        <section v-for="(goods,goodindex) in item.goods" :key="goodindex" class="menu_detail_list">
            <router-link  :to="{name: 'ProductList1', params: { id: goods.id }}"  tag="div" class="menu_detail_link">
              <!-- <li> -->
                <img :src="goods.imageUrl" alt="">
                <div class="goods_name">
                  {{goods.name}}
                </div>
              <!-- </li> -->
              </router-link>

          </section>
      </li>
      </ul>

    </section>
  </div>
</template>
<script>

import { staticBase,reqCategoryList } from '../../api'
import BScroll from 'better-scroll'
export default {
  data() {
    return {
      staticBase: staticBase,
      shopListTop: [], //商品列表的高度集合
      menuList: [], //商品列表
      menuIndex: 0, //已选菜单索引值，默认为0
      menuIndexChange: true,//解决选中index时，scroll监听事件重复判断设置index的bug
    }
  },
  async created() {
    this.menuList = (await reqCategoryList({pid:0})).data.data;
    var arr = [];
    var i = 0;
    for (const item of this.menuList) {
      arr[i++] = {
        ...this.menuList[i],
        goods:(await reqCategoryList({pid:item.id})).data.data
      }
    }
    this.menuList = arr;
  },
  mounted() {
    setTimeout(()=>{
      this.getGoodListHeight();
    },1000)
  },
  methods: {
    //获取食品列表的高度，存入shopListTop
    getGoodListHeight(){
        const listContainer = this.$refs.menuGoodList;
        const listArr = Array.from(listContainer.children[0].children);
        listArr.forEach((item, index) => {
            this.shopListTop[index] = item.offsetTop;
        });
        this.listenScroll(listContainer)
    },
    //点击左侧食品列表标题，相应列表移动到最顶层
    chooseMenu(index){
        this.menuIndex = index;
        //menuIndexChange解决运动时listenScroll依然监听的bug
        this.menuIndexChange = false;
        this.goodScroll.scrollTo(0, -this.shopListTop[index], 400);
        this.goodScroll.on('scrollEnd', () => {
            this.menuIndexChange = true;
        })
    },
    //当滑动商品列表时，监听其scrollTop值来设置对应的商品列表标题的样式
    listenScroll(element){
        this.goodScroll = new BScroll(element, {
            probeType: 3,
            deceleration: 0.001,
            bounce: false,
            swipeTime: 2000,
            click: true,
        });
        const wrapperMenu = new BScroll('#wrapper_menu', {
            click: true,
        });
        const wrapMenuHeight = this.$refs.wrapperMenu.clientHeight;
        this.goodScroll.on('scroll', (pos) => {
            if (!this.$refs.wrapperMenu) {
                return
            }
            this.shopListTop.forEach((item, index) => {
                if (this.menuIndexChange && Math.abs(Math.round(pos.y)) >= item) {
                    this.menuIndex = index;
                    const menuList=this.$refs.wrapperMenu.querySelectorAll('.activity_menu');
                    const el = menuList[0];
                    wrapperMenu.scrollToElement(el, 800, 0, -(wrapMenuHeight/2 - 50));
                }
            })
        })
    },
  },
  activated() {
    this.menuIndex = this.$route.params.index
  }
}

</script>
<style lang="scss">

li{
  list-style-type: none;
}
.index-container {
  background: #fff;
  display: flex;
  .left-w {
    .activity_menu {
      color: #3190e8;
      border-left: 2px solid #3190e8;
    }
    flex-shrink: 0;
    ul {
      overflow: auto;
      height: 100%;
      margin-bottom: 53px;
      list-style: none;
      font-style: normal;
      text-decoration: none;
      border: none;
      color: #333;
      font-weight: 400;
      font-family: Microsoft Yahei;
      li {
        padding: .7rem .3rem;
        border-bottom: .025rem solid #ededed;
        box-sizing: border-box;
        border-left: .15rem solid #f8f8f8;
        position: relative;
      }
    }
  }
  .right-w {
    flex: 1;
    osition: relative;
    margin: 8px 0 80px 20px;
    .goods_name{
      font-size: 13px;
    }
    .menu_detail_header_left{
      text-align: center;
      margin-bottom: 30px;
      padding-top: 30px;
      font-size: 14px;
    }
    .menu_detail_list{
      width: 33%;
      display: inline-block;
    }
    .menu_detail_link{
      text-align: center;
    }
    ul {
      list-style-type: none;
      // display: flex;

    }
    li {
      img {
        width: 60px;
        height: 60px;
      }
    }
  }
}

</style>
