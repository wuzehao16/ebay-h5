<template>
<div class="container">	
	<mt-navbar v-model="selected" class="my-nav" :fixed="true">
	  <mt-tab-item id="all_orders">全部订单</mt-tab-item>
    <mt-tab-item id="to_pay">待付款</mt-tab-item>
	  <mt-tab-item id="to_receive">待收货</mt-tab-item>
	</mt-navbar>
	<!-- tab-container -->
	<mt-tab-container v-model="selected" class="mtc">
   <div class="no-data" v-if='tip_flag'>{{ tip_text }}</div>
    <!-- 全部订单 -->
    <mt-tab-container-item id="all_orders">
  		<mt-loadmore :auto-fill="false" :top-method="getAllList" :bottom-method="getAllList" 
  			:bottom-all-loaded="allLoaded" ref="loadmore">	  
        <div v-for="(d,index) in all_list" :key="d.orderNo" class='cell-margin'>
          <mt-cell>
            <div slot="title" class="order-des">
              <div><label>状态：</label><span style="color: #ef4f4f;">
                <template v-if="d.orderStatus == '1'">待支付</template>
                <template v-if="d.orderStatus == '2'">已取消</template>
                <template v-if="d.orderStatus == '3'">已支付</template>
                <template v-if="d.orderStatus == '4'">已发货</template>
                <template v-if="d.orderStatus == '5'">已完成</template>
                <template v-if="d.orderStatus == '6'">退款中</template>
                <template v-if="d.orderStatus == '7'">已退款</template>
                <template v-if="d.orderStatus == '9'">已删除</template>
              </span></div>
              <div><label>总价：</label><span>￥{{d.orderAmount}}</span></div>
            </div>
            <div v-if="d.orderStatus == '1'">
              <mt-button type="primary" size="small" class="pay-b" @click="buyIt(index)">去支付</mt-button>
            </div>
          </mt-cell>
          <template v-for='i in d.productList'>
            <mt-cell style="padding-bottom: 10px;">
              <div slot="title" class="goods-list" >
                <div class="avatar" :style="{'background': 'url(' + i.productIcon + ') no-repeat center center'}"></div>
                <div class="right">
                  <div class="title">{{ i.productNane }}</div>
                  <div class="num">x{{i.orderDetail.productQuantity}}</div>
                </div>
              </div>
            </mt-cell>            
          </template>
        </div>
        <!-- <div class="no-data" v-if="!all_list.length">您没有订单</div> -->
  		</mt-loadmore>
	  </mt-tab-container-item>

    <!-- 待付款 -->
	  <mt-tab-container-item id="to_pay">
  		<mt-loadmore :auto-fill="false" :top-method="getToPayList" :bottom-method="getToPayList" 
  			:bottom-all-loaded="allLoaded_2" ref="loadmore2">
        <div v-for="(d,index) in to_pay_list" :key="d.orderNo" class='cell-margin'>
          <mt-cell>
            <div slot="title" class="order-des">
              <div><label>状态：</label><span style="color: #ef4f4f;">待支付</span></div>
              <div><label>总价：</label><span>￥{{d.orderAmount}}</span></div>
            </div>
            <div>
              <mt-button type="primary" size="small" class="pay-b" @click="buyItForNopay(index)">去支付</mt-button>
            </div>
          </mt-cell>
          <template v-for='i in d.productList'>
            <mt-cell style="padding-bottom: 10px;">
              <div slot="title" class="goods-list" >
                <div class="avatar" :style="{'background': 'url(' + i.productIcon + ') no-repeat center center'}"></div>
                <div class="right">
                  <div class="title">{{ i.productNane }}</div>
                  <div class="num">x{{i.orderDetail.productQuantity}}</div>
                </div>
              </div>
            </mt-cell>            
          </template>
        </div>
        <!-- <div class="no-data" v-if="!to_pay_list.length">您没有待支付的订单</div> -->
  		</mt-loadmore>
    </mt-tab-container-item>

    <!-- 待收货 -->
    <mt-tab-container-item id="to_receive">
      <mt-loadmore :auto-fill="false" :top-method="getToReceiveList" :bottom-method="getToReceiveList" 
        :bottom-all-loaded="allLoaded_3" ref="loadmore3">   
        <div  v-for="d in to_receive_list" :key="d.orderNo" class='cell-margin'>
          <mt-cell>
            <div slot="title" class="order-des">
              <div><label>状态：</label><span class="order-status">
                <template v-if="d.orderStatus == '3'">已支付</template>
                <template v-if="d.orderStatus == '4'">已发货</template>
              </span></div>
              <div><label>总价：</label><span>￥{{d.orderAmount}}</span></div>
            </div>
          
          </mt-cell>

          <template v-for='i in  d.productList'>
            <mt-cell style="padding-bottom: 10px;">
              <div slot="title" class="goods-list" >
                <div class="avatar" :style="{'background': 'url(' + i.productIcon + ') no-repeat center center'}"></div>
                <div class="right">
                  <div class="title">{{ i.orderDetail.productQuantity }}</div>
                </div>
              </div>
            </mt-cell>            
          </template>
        </div>
        <!-- <div class="no-data" v-if="!to_receive_list.length">您没有待收货的订单</div> -->
      </mt-loadmore>
	  </mt-tab-container-item>
	</mt-tab-container>
  <div class="to-top" @click="scrollTop">
    <i class="iconfont icon-top"></i>
  </div>
  <bottom></bottom>
</div>
</template>

<script>
import {reqBuyerOrderList} from '../../api'
import { Indicator } from 'mint-ui'
import Footer from '@/components/footer/footer';
export default {
  components:{
    'bottom':Footer
  },
  data () {
  	return {
  		selected: '',
  		allLoaded: false,
      allLoaded_2: false,
  		allLoaded_3: false,
      all_list: [],
      all_page: 0,
      pa: {
        userWxOpenid: '',
        size: 10
      },
      to_pay_list: [],
      to_pay_page: 0,
      to_receive_list: [],
      to_receive_page: 0,

      tip_flag: false,
      tip_text: '',
      items:[]
  	}
  },
  methods: {
    buyIt(index){
      let detail = this.all_list[index].productList[0].orderDetail;
        this.items.push({
  			productId: this.all_list[index].productList[0].orderDetail.id,
  			productName: this.all_list[index].productList[0].orderDetail.productName,
  			productPrice: this.all_list[index].productList[0].orderDetail.productPrice,
  			productQuantity: this.all_list[index].productList[0].orderDetail.productQuantity,
  			productIcon: this.all_list[index].productList[0].orderDetail.productIcon
  		})
  		let order_info = {
  			items: this.items
  		}
  		sessionStorage.setItem('order_info', JSON.stringify(order_info))
  		this.$router.push({
  			name: 'SettleOrder'
  		})
    },
    buyItForNopay(index){
      let detail = this.to_pay_list[index].productList[0].orderDetail;
        this.items.push({
  			productId: detail.id,
  			productName: detail.productName,
  			productPrice: detail.productPrice,
  			productQuantity: detail.productQuantity,
  			productIcon: detail.productIcon
  		})
  		let order_info = {
  			items: this.items
  		}
  		sessionStorage.setItem('order_info', JSON.stringify(order_info))
  		this.$router.push({
  			name: 'SettleOrder'
  		})
    },
  	scrollTop (val) {
      document.getElementById('app').scrollTop = 0
  	},
    showSpinner() {
      Indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      })      
    },
    getAllList(val) {
      this.showSpinner()
      let obj = Object.assign({}, this.pa, {page: this.all_page})
      reqBuyerOrderList(obj).then((res) => {
        if (res.data.code == 0) {
          for (let i of res.data.data.content) {
            this.all_list.push(i)
          }
          this.all_page++
        }
        if (this.all_list.length == 0) {
          this.tip_text = '您还没有订单'
          this.tip_flag = true
        } 
        this.$refs.loadmore.onTopLoaded()
        if (this.$refs.loadmore.bottomStatus == 'loading') {
          this.$refs.loadmore.onBottomLoaded()
        }
        Indicator.close()
      })
    },
    getToPayList() {
      this.showSpinner()      
      let obj = Object.assign({}, this.pa, {page: this.to_pay_page, orderStatus: '1'})
      reqBuyerOrderList(obj).then((res) => {
        if (res.data.code == 0) {
          for (let i of res.data.data.content) {
            this.to_pay_list.push(i)
          }
          this.to_pay_page++
        }
        if (this.to_pay_list.length == 0) {
          this.tip_text = '您没有待支付的订单'
          this.tip_flag = true
        } 
        this.$refs.loadmore2.onTopLoaded()
        if (this.$refs.loadmore2.bottomStatus == 'loading') {
          this.$refs.loadmore2.onBottomLoaded()
        }        
        Indicator.close()
      })
    },
    getToReceiveList() {
      this.showSpinner()
      let obj = Object.assign({}, this.pa, 
        {page: this.to_receive_page, orderStatus: '3,4'})
      reqBuyerOrderList(obj).then((res) => {
        if (res.data.code == 0) {
          for (let i of res.data.data.content) {
            this.to_receive_list.push(i)
          }
          this.to_receive_page++
        }
        if (this.to_receive_list.length == 0) {
          this.tip_text = '您没有待收货的订单'
          this.tip_flag = true
        }         
        this.$refs.loadmore3.onTopLoaded()
        if (this.$refs.loadmore3.bottomStatus == 'loading') {
          this.$refs.loadmore3.onBottomLoaded()
        }           
        Indicator.close()
      })
    },
    init() {
      this.tip_flag = false
      if (this.selected == 'all_orders' && this.all_list.length == 0) {
        this.getAllList()
      } else if (this.selected == 'to_pay' && this.to_pay_list.length == 0) {
        this.getToPayList()
      } else if (this.selected == 'to_receive' && this.to_receive_list.length == 0) {
        this.getToReceiveList()
      }      
    }
  },
  mounted() {
      this.selected = this.$route.params.active_tab || 'all_orders'
      this.userWxOpenid = JSON.parse( sessionStorage.getItem('ebay-app') ).userWxOpenid
      this.init()
  },
  watch: {
    selected(val) {
      this.init()
    }
  }
}

</script>

<style lang="scss">
.order-flow {
  padding: 10px 0;
}
.pay-b{
  height: 28px;
    width: 80px;
}
.order-des {
  margin: 12px 0;
  font-size: 14px;
  div {
    margin: 8px 0;
    label {
      color: gray;
    }
  }
  .order-status {
    color: #ef4f4f;
  }
}
.cell-margin{
    margin: 10px 0 10px 0;
}
.mint-navbar .mint-tab-item.is-selected {
    border-bottom: 2px solid #0099f7;
    margin-bottom: -2px;
}
.mint-tab-item-label{
	font-size: 16px !important;

}
.mtc {
	margin-top: 54px;
  margin-bottom: 52px;
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
    height: 86px;
    width: 110px;
    line-height: 26px;
    display: flex;
  .avatar{
    flex: 0 0 70px;
    background-size: 70px auto!important;
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
    .num{
      margin-top: 5px;
      color:#999;
    }
    .price{
      color:#ef4f4f;
    }
    button {
      position: absolute;
      bottom: 16px;
      height: 27px;
      width: 100px;
    }
  }
}

</style>
