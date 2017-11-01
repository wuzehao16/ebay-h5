<template>
<div class="container">	
	<mt-navbar v-model="selected" class="my-nav" :fixed="true">
	  <mt-tab-item id="published">已发布商品</mt-tab-item>
	  <mt-tab-item id="wait_audit">待审核商品</mt-tab-item>
	</mt-navbar>

	<!-- tab-container -->
	<mt-tab-container v-model="selected" class="mtc">
	  <mt-tab-container-item id="published">
		<mt-loadmore :auto-fill="false" :top-method="getPublishedList" 
      :bottom-method="getPublishedList" 
			:bottom-all-loaded="allLoaded" ref="loadmore">
      <div> 
		    <mt-cell class='set-shadow' v-for="d in publishedGoods" :key="d.created">
          <div slot="title" class="goods-list" >
            <div class="avatar" :style="{'background': 'url(' + d.productIcon + ') no-repeat center center'}"></div>
            <div class="right">
              <div class="title">{{ d.productNane }}</div>
              <div class="price">￥{{ d.productPrice }}</div>
              <mt-button type="primary" @click="goPreview(d.id)" size="small">立即预览</mt-button>
            </div>
          </div>
		    </mt-cell>
      </div>
		</mt-loadmore>
	  </mt-tab-container-item>
	  <mt-tab-container-item id="wait_audit">
		<mt-loadmore :auto-fill="false" :top-method="getWaitedList"  :bottom-method="getWaitedList" 
			:bottom-all-loaded="allLoaded_2" ref="loadmore2">	  
		    <mt-cell class='set-shadow' v-for="(d, index) in waitedGoods" :key="d.created">
          <div slot="title" class="goods-list" >
            <div class="avatar" :style="{'background': 'url(' + d.productIcon + ') no-repeat center center'}"></div>
            <div class="right">
              <div class="title">{{ d.productNane }}</div>
              <div class="price">￥{{ d.productPrice }}</div>
              <mt-button type="primary" @click="goPreview(d)" size="small">立即预览</mt-button>
            </div>
          </div>
          <div class="no-data" v-if="!waitedGoods ||waitedGoods.length <1">您没有待收货的订单</div>
		    </mt-cell>
		</mt-loadmore>

	  </mt-tab-container-item>
	</mt-tab-container>

  <div class="to-top" @click="toTop">
    <i class="iconfont icon-top"></i>
  </div>

	<mt-tabbar :fixed="true">
	  <mt-button type="primary" size="large" @click="addNew" class="addProduct">新增商品<i class="iconfont icon-add"></i></mt-button>
	</mt-tabbar>

</div>
</template>

<script>
import {reqSellerProList} from '../../api'
export default {
  data () {
  	return {
  		selected: 'published',
  		goods: {
  			name: 'hahaha YSL DDDDD CHANNEL CHANNELCHANNELCHANNELCHANNELCHANNEL',
  			price: '￥9999.99',
  			left: '已售70%',
  			img: require('../../assets/test.png')
  		},
  		allLoaded: false,
  		allLoaded_2: false,
      reqListObj: {
        size: 10,
        userId: JSON.parse( sessionStorage.getItem('ebay-app') ).userWxOpenid,//此处userId传openId
      },
      publishedPage: 0,
      WaitedAuditPage: 0,

      publishedGoods: [],
      waitedGoods: []
  	}
  },
  methods: {
    getPublishedList() {
      let obj = Object.assign({}, this.reqListObj, {auditStatus: '1', 
          page: this.publishedPage})
      reqSellerProList(obj).then((res) => {
        let arr = res.data.data
        if(arr.length) {
          for(let el of arr) {
            this.publishedGoods.push(el)
          }
          this.publishedPage++
        }
        this.$refs.loadmore.onTopLoaded()
        this.$refs.loadmore.onBottomLoaded()
      })
    },
    getWaitedList() {
      console.log(1)
      let obj = Object.assign({}, this.reqListObj, {auditStatus: '0',
         page: this.WaitedAuditPage})
      reqSellerProList(obj).then((res) => {
        let arr = res.data.productInfoPage.content
        if(arr.length) {
          for(let el of arr) {
            this.waitedGoods.push(el)
          }
          this.WaitedAuditPage++
        }
        console.log(res)
        this.$refs.loadmore2.onTopLoaded()
        this.$refs.loadmore2.onBottomLoaded()
      })      
    },
  	toTop (val) {
      document.getElementById('app').scrollTop = 0
  	},
  	addNew() {
  		this.$router.push("/popularize/add")
  	},
    goPreview(val) {
      this.$router.push({
        name: 'PorductDetail',
        params: {
          id: val,
          isPreview: true
        }
      })
    }
  },
  mounted() {
    this.getPublishedList()
    // this.getWaitedList()
    
    this.$nextTick(() => {
      setTimeout(() => {
        this.toTop()
      }, 300)
    })
  },
  watch: {
    selected() {
      this.toTop()
    }
  }
}
</script>

<style lang="scss" scoped>
$ebay-blue :#0099f7;
$shadow-color: #aaa;
.set-shadow .mint-cell-title{
    margin: 10px 0 10px 0;
    box-shadow: 0 2px 16px $shadow-color, 0 0 1px $shadow-color, 0 0 1px $shadow-color;	
}
.mint-tab-item-label{
	font-size: 16px;
}
.no-data {
    height: 100px;
    position: absolute;
    width: 100%;
    z-index: 1000;
    background: #EEEEEE;
    padding-top: 40px;
    text-align: center;
    color: #000;  
}
.mtc {
	margin: 54px 0 42px 0;
}
.set-shadow .mint-cell-wrapper{
  background-image:none;
  margin-bottom: -5px;
  .mint-cell-title{
    margin: 10px 0 10px 0;
    box-shadow: 0 2px 16px $shadow-color, 0 0 1px $shadow-color, 0 0 1px $shadow-color;	
  }
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

.goods-list {
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
      color:$ebay-blue;
      font-size: 14px;
    }
    button {
      position: absolute;
      bottom: 16px;
      height: 27px;
    }
  }
}
.addProduct{
  height: 50px;
  border-radius: 0;
  background-color: #0099f7;
}
</style>
