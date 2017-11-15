<template>
<div class="container">	
<div>
<mt-search v-model="filters.productName"></mt-search>  
</div>
<mt-loadmore 
  :auto-fill="false"
  :top-method="getProductList" 
  :bottom-method="getProductList" 
	:bottom-all-loaded="allLoaded" 
  ref="loadmore" 
  class="main-wrapper" 
  style="margin:42px 0;min-height: 50vh;">
  <div class="no-data" v-if='tip_flag'>{{ tip_text }}</div>

  <div> 
    <mt-cell 
      class='set-shadow' 
      v-for="d in pro_list" 
      :key="d.created" >
      <div 
      slot="title" 
      class="goodss-list" 
      @click="goDetail(d.id)">
        <div class="avatar" :style="{'background': 'url(' + d.productIcon + ') no-repeat center center'}"></div>
        <div class="right" >
          <div class="title">{{ d.productNane }}</div>
          <div class="price">￥{{ d.productPrice }}</div>
          <mt-button type="primary"  size="small">立即购买</mt-button>
        </div>
      </div>
    </mt-cell>
	</div>
</mt-loadmore>

  <div class="to-top" @click="toTop">
    <i class="iconfont icon-top"></i>
  </div>
</div>
</template>

<script>
import {reqProductList} from '../../api'
import {Indicator} from 'mint-ui'
import debounce from 'lodash/debounce'
export default {
  data () {
  	return {
  		allLoaded: false,
      filters: {
        page: 0,
        size: 10,
        auditStatus: '1',
        productName: ''
      },
      pro_list: [],
      tip_flag: false,
      tip_text: ''
  	}
  },
  methods: {
    showSpinner() {
      this.tip_flag = false
      Indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      })      
    },
    getProductList() {
      this.showSpinner()
      reqProductList(this.filters).then((res) => {
        let arr = res.data.data.content
        if(arr.length) {
          for(let el of arr) {
            this.pro_list.push(el)
          }
          this.filters.page++
        }
        if (this.pro_list.length == 0) {
          if (this.filters.productName == '') {
            this.tip_text = '还没有商品哦~敬请期待'
          } else {
            this.tip_text = '未搜索到符合查询条件的商品'
          }
          this.tip_flag = true
        }
        this.$refs.loadmore.onTopLoaded()
        if (this.$refs.loadmore.bottomStatus == 'loading') {
          this.$refs.loadmore.onBottomLoaded()
        }
        Indicator.close()
      }).catch((err) => {
        console.log(err)
        Indicator.close()
      })
    },
  	toTop (val) {
      document.getElementById('app').scrollTop = 0
  	},
    goDetail(val) {
      this.$router.push({
        name: 'PorductDetail',
        params: {
          id: val
        }
      })
    },
    searchByName: debounce(function(){
        this.pro_list = []
        this.filters.page = 0
        this.getProductList()
    }, 500)
  },
  mounted() {
    this.getProductList()
  },
  watch: {
    'filters.productName' (val) {
        this.searchByName()
    }
  }
}
</script>

<style lang="scss" >
$ebay-blue :#0099f7;
$shadow-color: #ececec;
.mint-searchbar{
  background-color: $ebay-blue;
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
    // overflow: hidden;
    // z-index: 1;
}
.main-wrapper{
  background-color: #EEEEEE;
}
.mint-cell{
  border-bottom:node; 
}
.set-shadow .mint-cell-wrapper{
  background-image:none;
  margin-bottom: -5px;
  .mint-cell-title{
    margin: 10px 0 10px 0;
    box-shadow: 0px 2px 3px rgba(34, 25, 25, 0.2), 0 0 1px $shadow-color, 0 0 1px $shadow-color;	
  }
}
.mint-tab-item-label{
	font-size: 16px !important;

}
.mint-navbar .mint-tab-item.is-selected {
    border-bottom: 2px solid #0099f7;
    margin-bottom: -2px;
}
.mtc {
	margin: 54px 0 42px 0;
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
    padding: 5px ;
    height: 110px;
    width: 110px;
    line-height: 26px;
    display: flex;
  .avatar{
    flex: 0 0 100px;
    background-size: 100px auto!important;
  }
  .right{
    flex: 1 0 auto;
    padding-left: 20px;
    padding-top: 6px;
    .title {
        overflow: hidden;
        font-size: 16px;
        line-height: 20px;
        width: 220px;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-wrap: break-word;	
        word-break: break-all;	
    }
    .price{
      font-size: 14px;
      color:$ebay-blue;
    }
    button {
      position: absolute;
      bottom: 16px;
      height: 27px;
    }
  }
}

</style>
