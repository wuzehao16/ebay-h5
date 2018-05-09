<template>
  <div class="container index-container">
    <section class="left-w" id="wrapper_menu" ref="wrapperMenu">
      <ul>
        <li v-for="(v, i) in menuList" :class="{'activity_menu': (menuIndex == v.id)}" @click="chooseMenu(v.id)" :key="i">
          <img :src="v.imageUrl" style="width:10px;height:10px" alt="">
          <span>{{ v.name }}</span>
        </li>
      </ul>
    </section>
    <section class="right-w" ref="menuGoodList">
      <ul>
        <template v-for="item in menuList">
          <transition name="slide-fade">
            <li v-show='menuIndex == item.id'>
              <header class="menu_detail_header">
                <section class="menu_detail_header_left">
                  <img :src="item.bigImageUrl" class="big-image">
                  <p class="menu_item_title">{{item.name}}分类</p>
                  <span class="menu_item_description">{{item.description}}</span>
                </section>
              </header>
              <section v-for="(goods,goodindex) in item.goods" :key="goodindex" class="menu_detail_list">
                <keep-alive>
                  <router-link :to="{name: 'SpeTypeList', params: { id: goods.id }}" tag="div" class="menu_detail_link">
                    <img :src="goods.imageUrl" alt="">
                    <div class="goods_name">
                      {{goods.name}}
                    </div>
                  </router-link>
                </keep-alive>
              </section>
            </li>
          </transition>
        </template>
      </ul>
    </section>
  </div>
</template>
<script>
import { reqCategoryList } from '../../api'
export default {
  data() {
    return {
      menuList: [], //商品列表
      menuIndex: 0, //已选菜单索引值，默认为0
    }
  },
  async created() {
    this.menuList = (await reqCategoryList({ pid: 0 })).data.data;
    var arr = [];
    var i = 0;
    for (const item of this.menuList) {
      arr[i++] = {
        ...this.menuList[i],
        goods: (await reqCategoryList({ pid: item.id })).data.data
      }
    }
    this.menuList = arr;
  },
  mounted() {
    this.menuIndex = this.$route.params.index
  },
  methods: {
    chooseMenu(index) {
      this.menuIndex = index;
    }
  },
  activated() {
  }
}

</script>
<style lang="scss">
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */

.slide-fade-enter-active {
  transition: all .5s ease;
}

.slide-fade-leave-active {
  transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter,
.slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */

{
  transform: translateY(10px);
  opacity: 0;
}

li {
  list-style-type: none;
}

.index-container {
  overflow: hidden;
  background: #fff;
  display: flex;
  .left-w {
    padding-bottom: 56px;
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
      padding-right: 4px;
      border-right: .025rem solid #ededed;
      li {
        padding: .7rem .3rem; // border-bottom: .025rem solid #ededed;
        box-sizing: border-box;
        border-left: .15rem solid #f8f8f8;
        position: relative;
        span {
          font-size: 12px;
        }
      }
    }
  }
  .right-w {
    flex: 1;
    position: relative;
    margin: 8px 0 80px 20px;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    .goods_name {
      font-size: 12px;
    }
    .menu_detail_header_left {
      text-align: center;
      margin-bottom: 30px;
      padding-top: 10px;
      font-size: 14px;
    }
    .menu_detail_list {
      width: 33%;
      display: inline-block;
    }
    .menu_detail_link {
      text-align: center;
    }
    ul {
      list-style-type: none; // display: flex;
    }
    .big-image {
      width: 90%;
      height: auto;
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
