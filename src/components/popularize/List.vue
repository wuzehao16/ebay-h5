<template>
<div class="container">	
	<mt-navbar v-model="selected" class="my-nav" :fixed="true">
	  <mt-tab-item id="published">已发布商品</mt-tab-item>
	  <mt-tab-item id="wait_audit">待审核商品</mt-tab-item>
	</mt-navbar>

	<!-- tab-container -->
	<mt-tab-container v-model="selected" class="mtc">
    <div class="no-data" v-if='tip_flag'>{{ tip_text }}</div>
	  <mt-tab-container-item id="published">
		<mt-loadmore :auto-fill="false" :top-method="getPublishedList" 
      :bottom-method="getPublishedList" 
			:bottom-all-loaded="allLoaded" ref="loadmore">
      <div> 
		    <mt-cell class='set-shadow' v-for="d in publishedGoods" :key="d.created">
          <div slot="title" class="popularize-list" >
            <div class="avatar" :style="{'background': 'url(' + d.productIcon + ') no-repeat center center'}"></div>
              <div class="right">
                <div class="title">{{ d.productNane }}</div>
                <div class="price">￥{{ d.productPrice }}</div>
                <mt-button type="primary" @click="goPreview(d.id)" size="small">分享朋友圈</mt-button>
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
          <div slot="title" class="popularize-list" >
            <div class="avatar" :style="{'background': 'url(' + d.productIcon + ') no-repeat center center'}"></div>
            <div class="right">
              <div class="title">{{ d.productNane }}</div>
              <div class="price">￥{{ d.productPrice }}</div>
              <div class="button-box">
              <mt-button type="primary" @click="goPreview(d.id)" size="small">立即预览</mt-button>
              <mt-button type="primary" @click="goEdit(d)" size="small">编辑</mt-button>
                
              </div>
            </div>
          </div>
		    </mt-cell>
		</mt-loadmore>

	  </mt-tab-container-item>
	</mt-tab-container>

  <div class="to-top" @click="toTop">
    <i class="iconfont icon-top"></i>
  </div>

	<mt-tabbar :fixed="true">
	  <mt-button type="primary" size="large" @click="addNew" class="addProduct">新增商品<i class="iconfont icon-add" style="font-size:18px;padding-left:5px;"></i></mt-button>
	</mt-tabbar>

</div>
</template>

<script>
import {reqSellerProList} from '../../api'
import { Indicator } from 'mint-ui'

export default {
  data () {
  	return {
  		selected: 'published',
  		allLoaded: false,
  		allLoaded_2: false,
      reqListObj: {
        size: 10,
        userWxOpenid: JSON.parse( sessionStorage.getItem('ebay-app') ).userWxOpenid,
      },
      publishedPage: 0,
      WaitedAuditPage: 0,

      publishedGoods: [],
      waitedGoods: [],
      tip_flag: false,
      tip_text: ''
  	}
  },
  activated(){
    let justAdded = this.$route.params.justAdded
    if (justAdded) {
      this.selected = 'wait_audit'
      if (this.waitedGoods.length != 0) {
          this.WaitedAuditPage = 0
          this.waitedGoods = []
          this.getWaitedList()
      }
    }
  },
  methods: {
    goEdit(row) {
      this.$router.push({
        name: 'AddGoods',
        params: {
          productId: row.id,
          ebayItemid: row.ebayItemid
        }
      })

    },
    showSpinner() {
      Indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      })      
    },
    getPublishedList() {
      this.showSpinner()
      let obj = Object.assign({}, this.reqListObj, {auditStatus: '1', 
          page: this.publishedPage})
      reqSellerProList(obj).then((res) => {
        let arr = res.data.data.content
        if(arr.length) {
          for(let el of arr) {
            this.publishedGoods.push(el)
          }
          this.publishedPage++
        }
        if (this.publishedGoods.length == 0) {
          this.tip_text = '您没有已发布的商品'
          this.tip_flag = true
        }
        this.$refs.loadmore.onTopLoaded()
        if (this.$refs.loadmore.bottomStatus == 'loading') {
          this.$refs.loadmore.onBottomLoaded()
        }
        Indicator.close()
      })
    },
    getWaitedList() {
      this.showSpinner()
      let obj = Object.assign({}, this.reqListObj, {auditStatus: '0',
         page: this.WaitedAuditPage})
      reqSellerProList(obj).then((res) => {
        let arr = res.data.data.content
        if(arr.length) {
          for(let el of arr) {
            this.waitedGoods.push(el)
          }
          this.WaitedAuditPage++
        }
        if (this.waitedGoods.length == 0) {
          this.tip_text = '您没有待审核的商品'
          this.tip_flag = true
        }        
        this.$refs.loadmore2.onTopLoaded()
        if (this.$refs.loadmore2.bottomStatus == 'loading') {
          this.$refs.loadmore2.onBottomLoaded()
        }
        Indicator.close()
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
    },
    init() {
      this.tip_flag = false
      if (this.selected == 'wait_audit' && this.waitedGoods.length == 0) {
        this.getWaitedList()
      } else if (this.selected == 'published' && this.publishedGoods.length == 0) {
        this.getPublishedList()
      }     
    }    
  },
  mounted() {
      this.init()
  },
  watch: {
    selected(val) {
      this.init()
    }
  }
}
</script>

<style lang="scss" scoped>
$ebay-blue :#0099f7;
$shadow-color: #aaa;
.set-shadow .mint-cell-title{
    margin: 10px 0 10px 0;
    box-shadow: 0px 2px 3px rgba(34, 25, 25, 0.2), 0 0 1px $shadow-color, 0 0 1px $shadow-color;
}
.my-nav{
  font-size: 16px!important;
} 
.mtc {
	margin: 54px 0 42px 0;
}
.set-shadow .mint-cell-wrapper{
  background-image:none;
  margin-bottom: -5px;
  .mint-cell-title{
    margin: 10px 0 10px 0;
    box-shadow: 0px 2px 3px rgba(34, 25, 25, 0.2), 0 0 1px $shadow-color, 0 0 1px $shadow-color;
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

.popularize-list {
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
    .button-box {
  /*     position: absolute;
      bottom: 16px; */
      button {
        height: 27px;
      }
    }
  }
}
.addProduct{
  height: 50px;
  border-radius: 0;
  background-color: #0099f7;
}
</style>
