<template>
<div class="container">	
<div class="c2">
<mt-cell class="address" >
	<div slot="title" @click="chooseAddress" class="receiver">
		<template v-if="receiver_info.name">
			<p>{{ receiver_info.name }} {{ receiver_info.phone }}</p>
			<span>{{ receiver_info.address.replace(/@/g, "") }}</span>
		</template>
		<template v-if="!receiver_info.name">
			<div class="choose">请选择地址<i class="iconfont icon-add"></i></div>
		</template>
	</div>
</mt-cell>
<div class="buying-goods">	
<mt-cell v-for="(order, index) in order_info.items" :key="index" style="margin-bottom: 10px;">
	<div slot="title" class="order-container" :style="{'background': 
		'url(' + order.productIcon + ') left center no-repeat'}">
		<h3>{{ order.productName }}</h3>
		<!-- <p>{{ order_info.des }}</p> -->
		<div><span class="price">￥{{ order.productPrice }}</span>
		<span class="amount">x{{ order.productQuantity }}</span></div>
	</div>
</mt-cell>
</div>

<mt-cell title="商品金额">
	<div class="red-color">￥{{ goods_all_price }}</div>
</mt-cell>
<mt-cell title="运费">
	<div class="red-color">包邮<!-- ￥{{ carriage }} --></div>
</mt-cell>
<mt-cell title="税费">
	<div class="red-color">包税</div>
</mt-cell>

<mt-cell>
	<div>实付金额：<span class="red-color">￥{{ total_money }}</span></div>
</mt-cell>
<div class='to-wechat'>
<mt-button size="large" @click="submitOrder" :disabled="payStatus">微信支付</mt-button>
</div>

</div>
</div>
</template>

<script>
import {reqBuyerOrderCreate, baseUrl, reqPayCreate, reqBuyerOrderEdit,
	reqAddressList, reqCartDelete, reqBuyerOrderDetail} from '../../api'
import { Toast, MessageBox } from 'mint-ui'
export default {
  data () {
  	return {
  		payStatus: false,
  		order_info: {},
  		carriage: 0.00,
  		receiver_info: {
  			name: '',
  			phone: '',
  			address: ''
  		},
  		pay_info: {
  			orderId: '',
		 	returnUrl: baseUrl + '/user/usercenter'
  		},
  		userId: ''
  	}
  },
  methods: {
  	chooseAddress() {
  		this.$router.push({
  			name: 'AddressList',
  			params: {
				order_info: this.order_info,
				seleceted: this.receiver_info,
				radio_value: 1
  			}
  		})
  	},
  	onBridgeReady(payResponse) {
  		let _this = this
		WeixinJSBridge.invoke(
			'getBrandWCPayRequest', {
			"appId" : payResponse.appId, //公众号名称，由商户传入
			"timeStamp" : payResponse.timeStamp, //时间戳，自1970年以来的秒数
			"nonceStr" : payResponse.nonceStr, //随机串
			"package" : payResponse.package,
			"signType" : "MD5", //微信签名方式：
			"paySign" : payResponse.paySign //微信签名
		},
		function (res) {
			if(res.err_msg == "get_brand_wcpay_request:ok" ) {
				Toast('您已成功支付')
				_this.$router.push('/user/usercenter')
			} else if (res.err_msg == 'get_brand_wcpay_request:cancel') {
				Toast('您已取消支付')
				_this.payStatus = false
			} else {
				console.log('支付失败')
				_this.payStatus = false
			}
		})
  	},
  	wechatPay(payResponse) {
  		let _this = this
		if (typeof WeixinJSBridge == "undefined") {
			console.debug("WeixinJSBridge is undefined!");
			if (document.addEventListener) {
				document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady(payResponse), false);
			} else if (document.attachEvent) {
				document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady(payResponse));
				document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady(payResponse));
			}
		} else {
			this.onBridgeReady(payResponse)
		}
  	},
  	submitOrder() {
  		if(!this.receiver_info.name) {
	        Toast({
	          message: '请选择地址',
	          position: 'top'
	        })
	        return false
  		}
  		this.payStatus = true

  		Object.assign(this.order_info, this.receiver_info, {
  			openid: this.ebay_app.userWxOpenid,
  			carriage: this.carriage
  		})  		
  		if (this.pay_info.orderId) {//已建订单
  			Object.assign(this.order_info, {orderMasterId: this.orderMasterId})
  			reqBuyerOrderEdit(this.order_info).then((res) => {
  				if (res.data.code == 0) {
					reqPayCreate(this.pay_info).then((res) => {
						if (res.data.code == 0) {
							this.wechatPay(res.data.data.payResponse)
						}
					})    					
  				}
  			})
  		} else {//未建订单
	  		reqBuyerOrderCreate(this.order_info).then((res) => {
	  			if(res.data.code == 0) {
	  				this.pay_info.orderId = res.data.data.orderId

	  				//如已下单商存在于购物车中，则去掉
					for (let i of this.order_info.items) {
						reqCartDelete({
							productId: i.productId, 
							userId: this.userId
						}).then((res) => {}).catch(err => {})			
					}
					this.$store.commit('changeCartAmount')
					this.$store.commit('setCartRefresh')

	  				reqPayCreate(this.pay_info).then((res) => {
	  					if (res.data.code == 0) {
	  						this.wechatPay(res.data.data.payResponse)
	  					}
	  				})
	  			}
	  		})
  		}
  	}
  },
  computed: {
  	goods_all_price() {
  		let all_price = 0
  		if(this.order_info.items) {
	  		for (let i of this.order_info.items) {
	  			all_price += i.productPrice * i.productQuantity
	  		}
  		}
  		return all_price
  	},
    total_money() {
      return (Number.parseFloat(this.goods_all_price) + this.carriage ).toFixed(2)
    }
  },
  beforeRouteEnter(to, from, next) {
  	if (from.name) {
  		console.log(from)
  		next(vm => {
	  		if (from.name == 'OrderList') {
			  	vm.pay_info.orderId = vm.$route.params.orderId
				reqBuyerOrderDetail({
					openid: vm.ebay_app.userWxOpenid,
					orderId: vm.pay_info.orderId
				}).then((res) => {
					if (res.data.code == 0) {
						vm.orderMasterId = res.data.data.id
					} else {
						Toast('找不到订单ID')
						vm.$router.push('/order/list')
					}
				})
	  		}  			
  		})
  	} else {
  		next('/order/list')
  	}
  },
  activated () {
  	this.order_info = JSON.parse(sessionStorage.getItem('order_info'))
  	if (!this.order_info) {
  		this.$router.push('/product/list')
  	}
  	let a = this.$route.params.receiver_info
  	if (a) {
  		this.receiver_info.name = a.cneeName
  		this.receiver_info.phone = a.cneePhone
  		this.receiver_info.address = a.cneeAddress
  	}
  },
  deactivated() {
  	this.payStatus = false
  	if (this.$route.name != 'AddressList') {
  		this.pay_info.orderId = ''
  		sessionStorage.setItem('order_info', JSON.stringify({}))
  	}
  },
  mounted() {
  	  this.ebay_app = JSON.parse(sessionStorage.getItem("ebay-app"))
  	  this.userId = this.ebay_app.id
      let obj = {
        userId: this.userId,
        page: 0,
        size: 100
      }

      if (!this.$route.params.receiver_info) {
	      reqAddressList(obj).then(res => {
	      	if (res.data.code == 0) {
	        	let list = res.data.data.content
	        	let cnee = {updated: 0}
	        	if (list.length > 0) {
		        	list.forEach((v, i, a) => {
		        		if (v.isDefaute == 'Y' && v.updated > cnee.updated) {
		        			cnee = v
		        		}
		        	})
		        	if (!cnee.id) {
		        		cnee = list[0]
		        	}
			  		this.receiver_info.name = cnee.cneeName
			  		this.receiver_info.phone = cnee.cneePhone
			  		this.receiver_info.address = cnee.cneeAddress
	        	}

	      	}
	      })      	
      }

  }
}	
</script>

<style lang="scss" scoped>
.buying-goods {
	margin-top: 86px;
}
.address{
		position: fixed;
		top: 0;
		width: 100%;
		z-index: 10;
		height: 80px;
		margin-bottom: 10px;
    	background-color: #fff !important;
		background: url("../../assets/stripe.png") bottom center repeat-x;
		background-size: 50px 4px;
		.mint-cell-wrapper{
			background-image: none;
		}
}
.receiver {
	.choose{
		margin-top: 20px;
		text-align: center;
	}
	p {
		margin: 15px 0 5px 0;
		font-size: 16px
	}
	span {
		font-size: 14px;
		color: gray;
	}
}
$red-color: #ef4f4f;
.to-wechat {
	margin: 10px 20px;
	button {
	    background: #22b722;
	    color: #fff;		
	}
}
.red-color {
	color: $red-color;
}
.container{
    background: #EEEEEE;
    height: 100%;
}
.c2 {
    margin-bottom: 60px;
}
</style>
