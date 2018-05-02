<template>
  <div class="container">
    <div>
      <mt-search v-model="filters.productName"></mt-search>
    </div>
    <mt-swipe :auto="0" class="index-banner">
      <mt-swipe-item v-for="i in bannerList" :key="i.id">
        <div :style="{'background-image': 'url(' + i.imageUrl + ')'}" @click="toUrl(i.clickUrl)"></div>
      </mt-swipe-item>
    </mt-swipe>
    <!-- 分类 -->
    <mt-cell class="index-type no-bg" style="z-index: 0;">
      <div slot="title">
        <ul class="list-type">
          <li v-for="p in categoryList" @click="go_spe_list(p.id)" :key="p.id">
            <i>
              <img :src=p.imageUrl alt="">
            </i>
            <br/><span>{{p.name}}</span></li>
          <li @click="go_spe_list('8')">
            <i>
              <img :src="staticBase + '/resource/more.png'">
            </i>
            <br/><span>更多</span></li>
        </ul>
      </div>
    </mt-cell>
   
    <mt-loadmore :auto-fill="false" :bottom-method="getProductList" :bottom-all-loaded="allLoaded" ref="loadmore" class="main-wrapper">
      <div>
        <!-- <div style="height: 42px;"></div> -->
        <mt-cell class='set-shadow' v-for="d in pro_list" :key="d.created">
          <div slot="title" class="goodss-list" @click="goDetail(d.id)">
            <div class="avatar" :style="{'background': 'url(' + d.productIcon + ') no-repeat center center'}"></div>
            <div class="right">
              <div class="title">{{ d.productNane }}</div>
              <div class="price">￥{{ d.productPrice }}</div>
              <mt-button type="primary" size="small">立即购买</mt-button>
            </div>
          </div>
        </mt-cell>
        <div style="height: 50px;"></div>
      </div>
    </mt-loadmore>
    <div class="to-top" @click="goTop">
      <i class="iconfont icon-top"></i>
    </div>
    <mt-popup :modal="false" class="popup-search" v-model="popupVisible" position="right">
      <div class="no-data" v-if='tip_flag' style="background:none;">{{ tip_text }}</div>
      <div v-if="showSearched" style="margin-bottom: 50px;">
        <mt-cell class='set-shadow' v-for="d in pro_search_list" :key="d.created">
          <div slot="title" class="goodss-list" @click="goDetail(d.id)">
            <div class="avatar" :style="{'background': 'url(' + d.productIcon + ') no-repeat center center'}"></div>
            <div class="right">
              <div class="title">{{ d.productNane }}</div>
              <div class="price">￥{{ d.productPrice }}</div>
              <mt-button type="primary" size="small">立即购买</mt-button>
            </div>
          </div>
        </mt-cell>
      </div>
    </mt-popup>
  </div>
</template>
<script>
import { reqProductList, staticBase, reqBannerList } from '../../api'
import { Indicator, Popup, Toast } from 'mint-ui'
import debounce from 'lodash/debounce'
export default {
  data() {
    return {
      staticBase: staticBase,
      allLoaded: false,
      filters: {
        page: 0,
        size: 10,
        auditStatus: '1',
        productName: ''
      },
      pro_list: [],
      tip_flag: false,
      tip_text: '',
      popupVisible: false,
      showSearched: false,
      pro_search_list: [],
      categoryList: [],
      bannerList: []
    }
  },
  methods: {
    toUrl(url) {
      window.location = url;
    },
    showSpinner() {
      this.tip_flag = false
      Indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      })
    },
    async getBannerList() {
      const res = (await reqBannerList()).data.data;
      this.categoryList = res.categoryList;
      this.bannerList = res.bannerList;
    },
    getProductList() {
      this.showSpinner()
      let obj
      if (this.popupVisible) {
        obj = {
          page: 0,
          size: 1000,
          auditStatus: '1',
          productName: this.filters.productName
        }
      } else {
        obj = this.filters
      }
      reqProductList(obj).then((res) => {
        Indicator.close()
        if (res.data.code == 0) {
          let arr = res.data.data.content
          if (arr.length && !this.popupVisible) {
            for (let el of arr) {
              this.pro_list.push(el)
            }
            this.filters.page++
          } else {
            this.pro_search_list = arr
            if (arr.length == 0) {
              this.tip_text = '未搜索到符合查询条件的商品'
              this.tip_flag = true
            }
            this.showSearched = true
          }
        } else {
          Toast(res.data.msg)
        }
        this.$refs.loadmore.onTopLoaded()
        if (this.$refs.loadmore.bottomStatus == 'loading') {
          this.$refs.loadmore.onBottomLoaded()
        }
      }).catch((err) => {
        console.log(err)
        Indicator.close()
      })
    },
    go_spe_list(val) {
      this.$router.push({
        name: 'IndexType',
        params: {
          index: val
        }
      })
    },
    goDetail(val) {
      this.$router.push({
        name: 'PorductDetail',
        params: {
          id: val
        }
      })
    },
    searchByName: debounce(function() {
      this.showSearched = false
      this.getProductList()
    }, 500)
  },
  mounted() {
    this.getProductList()
    this.getBannerList()
    let _this = this
    let el = document.getElementsByClassName("mint-searchbar-core")[0]
    let el2 = document.getElementsByClassName("mint-searchbar-cancel")[0]
    el.addEventListener('focus', function() {
      _this.popupVisible = true
      if (_this.filters.productName == '') {
        _this.tip_text = '请输入关键词搜索'
        _this.tip_flag = true
      }
    })
    el2.addEventListener('click', function() {
      _this.popupVisible = false
    })
  },
  watch: {
    'filters.productName' (val) {
      if (val) {
        this.searchByName()
      } else {
        this.tip_text = '请输入关键词搜索'
        this.tip_flag = true
        this.showSearched = false
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.popupVisible && to.name != 'PorductDetail') {
      this.popupVisible = false
      next(false)
    } else {
      next()
    }
  }
}

</script>
<style lang="scss">
$ebay-blue :#0099f7;
$shadow-color: #ececec;
.index-banner {
  height: 46vw;
  // background: pink;
  margin-top: 42px;
  .mint-swipe-item {
    >div {
      background-size: cover;
      height: 100%;
    }
  }
}

.mint-searchbar {
  background-color: $ebay-blue;
  height: 42px;
  .mint-searchbar-inner {
    border-radius: 25px;
    i {
      font-size: 16px;
      margin-left: 8px;
    }
  }
  .mint-searchbar-cancel {
    color: #fff;
  }
}

.index-type {
  padding: 26px 0;
  .list-type {
    list-style-type: none;
    padding: 0px 0;
    li {
      float: left;
      width: 25%;
      margin-top: 10px;
      text-align: center;
      line-height: 20px;
      font-size: 12px;
      i {
        font-size: 26px;
        img {
          height: 20px;
          width: 20px;
        }
      }
    }
  }
}

.popup-search {
  height: 100%;
  width: 100%;
  margin-top: 42px;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
}

.main-wrapper {
  background-color: #EEEEEE;
}

.mint-cell {
  border-bottom: none;
}

.set-shadow .mint-cell-wrapper {
  background-image: none;
  margin-bottom: -5px;
  .mint-cell-title {
    margin: 10px 0 10px 0;
    box-shadow: 0px 2px 3px rgba(34, 25, 25, 0.2), 0 0 1px $shadow-color, 0 0 1px $shadow-color;
  }
}

.mint-tab-item-label {
  font-size: 16px !important;
}

.mint-navbar .mint-tab-item.is-selected {
  border-bottom: 2px solid #0099f7;
  margin-bottom: -2px;
}

.to-top {
  position: fixed;
  width: 32px;
  height: 24px;
  bottom: 82px;
  right: 16px;
  color: rgb(255, 255, 255);
  background: rgba(51, 51, 51, .6);
  text-align: center;
  padding-top: 8px;
   :active {
    background: #504444;
  }
}

.goodss-list {
  padding: 5px;
  height: 110px; // width: 110px;
  line-height: 26px;
  display: flex;
  .avatar {
    flex: 0 0 100px;
    background-size: 100px auto!important;
  }
  .right {
    // flex: 1 0 auto;
    padding-left: 20px;
    padding-top: 6px;
    .title {
      overflow: hidden;
      font-size: 16px;
      line-height: 20px; // width: 220px;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      word-wrap: break-word;
      word-break: break-all;
    }
    .price {
      font-size: 14px;
      color: $ebay-blue;
    }
    button {
      position: absolute;
      bottom: 16px;
      height: 27px;
    }
  }
}

</style>
