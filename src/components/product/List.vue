<template>
<div class="container">	
<mt-search v-model="value" v-if="scrollTop"></mt-search>
<mt-loadmore :auto-fill="false" :top-method="getProductList" 
:bottom-method="getProductList" 
	:bottom-all-loaded="allLoaded" ref="loadmore">
		<div> 
    <mt-cell class='set-shadow' v-for="d in pro_list" :key="d.created">
    	<div slot="title" class="goods-list" >
        <div class="avatar" :style="{'background': 'url(' + d.productIcon + ') no-repeat center center'}"></div>
        <div class="right">
          <div class="title">{{ d.productNane }}</div>
          <div class="price">￥{{ d.productPrice }}</div>
          <mt-button type="primary" @click="goDetail(d.id)" size="small">立即购买</mt-button>
        </div>
    	</div>
    </mt-cell>
		</div>
</mt-loadmore>

  <div class="to-top" @click="toTop">
    <i class="iconfont icon-top"></i>
  </div>
    <bottom></bottom>
</div>
</template>

<script>
import {reqProductList} from '../../api'
import Footer from '@/components/footer/footer';
export default {
  data () {
  	return {
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
        openid: 'xxxfff'
      },
      value:"",
      page: 0,
      page_size: 16,
      pro_list: [],
      Offset:0
  	}
  },
  components:{
    'bottom':Footer
  },
  computed:{
    scrollTop:function () {
      this.Offset = document.getElementById('app').scrollTop
      console.log(document.getElementById('app').scrollTop)
    }
  },
  methods: {
    getProductList() {
      reqProductList({page:this.page, size: this.page_size}).then((res) => {

        let arr = res.data.data
        if(arr.length) {
          for(let el of arr) {
            this.pro_list.push(el)
          }
          this.page++
        }
        this.$refs.loadmore.onTopLoaded()
        this.$refs.loadmore.onBottomLoaded()
      }).catch((err) => {
        console.log(err)
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
    }
  },
  mounted() {
    this.getProductList()
    this.$nextTick(() => {
      setTimeout(() => {
        this.toTop()
      }, 300)
    })
  }
}
</script>

<style lang="scss" >
$ebay-blue :#0099f7;
$shadow-color: #eaeaea;
.mint-search {
    position: fixed;
    width: 100%;
    top: 0;
    overflow: hidden;
    z-index: 1;
}
.mint-cell{
  border-bottom:node; 
}
.set-shadow .mint-cell-wrapper{
  background-image:none;
  margin-bottom: -5px;
  .mint-cell-title{
    margin: 10px 0 10px 0;
    box-shadow: 0 2px 16px $shadow-color, 0 0 1px $shadow-color, 0 0 1px $shadow-color;	
  }
}
.mint-tab-item-label{
	font-size: 18px;

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
    .title {
        overflow: hidden;
        font-size: 14px;
        width: 233px;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-wrap: break-word;	
        word-break: break-all;	
    }
    .price{
      color:$ebay-blue;
      margin-top: 20px;
    }
    button {
      position: absolute;
      bottom: 16px;
      height: 27px;
    }
  }
}

</style>
