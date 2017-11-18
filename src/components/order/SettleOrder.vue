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
		<h3>{{ order.productName }}L</h3>
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
	<div class="red-color">￥{{ carriage }}</div>
</mt-cell>
<mt-cell>
	<div>实付金额：<span class="red-color">￥{{ total_money }}</span></div>
</mt-cell>
<div class='to-wechat'>
<mt-button size="large" @click="submitOrder">微信支付</mt-button>
</div>

</div>
</div>
</template>

<script>
import {reqBuyerOrderCreate, baseUrl, reqPayCreate} from '../../api'
import { Toast, MessageBox } from 'mint-ui'
export default {
  data () {
  	return {
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
  		}
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
  	submitOrder() {
  		if(!this.receiver_info.name) {
	        Toast({
	          message: '请选择地址',
	          position: 'top'
	        })
	        return false
  		}
  		Object.assign(this.order_info, this.receiver_info, {
  			openid: JSON.parse( sessionStorage.getItem('ebay-app') ).userWxOpenid,
  			carriage: this.carriage
  		})
  		reqBuyerOrderCreate(this.order_info).then((res) => {
  			if(res.data.code == 0) {
  				this.pay_info.orderId = res.data.data.orderId
  				console.log(this.pay_info)
  				reqPayCreate(this.pay_info).then((res) => {

  				})

  				// MessageBox('提示','微信接口待联调')
  			}
  		})
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
		margin: 15px 0 5px 10px;
		font-size: 16px
	}
	span {
		margin-left: 10px;
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
.order-container {
    padding: 10px 0 10px 80px;
    background-size: 70px auto!important;
    height: 80px;
    line-height: 34px;
	h3, p {
		margin: 0;
	    overflow: hidden;
	    text-overflow: ellipsis;
	    display: -webkit-box;
	    -webkit-line-clamp: 2;
	    -webkit-box-orient: vertical;
	    word-wrap: break-word;	
	    word-break: break-all;	
	} 
	h3 {
		margin-top: -6px;
	}
	p {
		-webkit-line-clamp: 1;
		color: gray;
	}
	.price {
		color: #0099f7;
	}
	.amount {
		float: right;
		font-size: 14px;
		color: gray;
	}
}
</style>
