<template>
<div class="container">	
<mt-cell :class="{'no-address': !receiver_info.name}">
	<div slot="title" @click="chooseAddress" class="receiver">
		<template v-if="receiver_info.name">
			<p>{{ receiver_info.name }} {{ receiver_info.phone }}</p>
			<span>{{ receiver_info.address.replace(/@/g, "") }}</span>
		</template>
		<template v-if="!receiver_info.name">
			<div>选择地址</div>
		</template>
	</div>
</mt-cell>
<mt-cell v-for="order in order_info.items">
	<div slot="title" class="order-container" :style="{'background': 
		'url(' + order.productIcon + ') left center no-repeat'}">
		<h3>{{ order.productName }}L</h3>
		<!-- <p>{{ order_info.des }}</p> -->
		<div><span class="price">￥{{ order.productPrice }}</span>
		<span class="amount">X&nbsp;{{ order.productQuantity }}</span></div>
	</div>
</mt-cell>

<mt-cell title="商品金额">
	<div class="red-color">￥{{ goods_all_price }}</div>
</mt-cell>
<mt-cell title="运费">
	<div class="red-color">￥{{ carriage }}</div>
</mt-cell>
<mt-cell>
	<div>实付金额：<span class="red-color">￥{{ goods_all_price + carriage }}</span></div>
</mt-cell>
<div class='to-wechat'>
<mt-button size="large" @click="submitOrder">确认订单</mt-button>
</div>


</div>
</template>

<script>
import {reqBuyerOrderCreate} from '../../api'
import { Toast, MessageBox } from 'mint-ui'
export default {
  data () {
  	return {

  		order_info: {

  		},
  		carriage: 50.00,
  		receiver_info: {
  			name: '',
  			phone: '',
  			address: ''
  		}
  		
  		
  	}
  },
  methods: {
  	chooseAddress() {
  		console.log(this.order_info)
  		this.$router.push({
  			name: 'AddressList',
  			params: {
  				order_info: this.order_info
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
  		console.log(this.order_info)
  		

  		reqBuyerOrderCreate(this.order_info).then((res) => {
  			console.log(res)
  			if(res.status == 200) {
  				MessageBox('提示','微信接口待联调')
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
  	}
  },
  mounted () {
  	this.order_info = JSON.parse(sessionStorage.getItem('order_info'))
  	if (!this.order_info) {
  		this.$router.push('/product/list')
  	}

  	let a = this.$route.params.receiver_info
  	console.log(a)
  	if (a) {
  		this.receiver_info.name = a.cneeName
  		this.receiver_info.phone = a.cneePhone
  		this.receiver_info.address = a.cneeAddress
  	}

  }
}	
</script>

<style lang="scss" scoped>
.no-address{
    background: #c3c0c0;
    color: #fff;
    text-align: center;	
}
.receiver {
	p {
		margin: 0;
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
    background: #fff;
    height: 100%;	
}
.order-container {
    padding: 10px 0 10px 120px;
    background-size: 100px auto!important;
    height: 110px;
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
		color: $red-color;
	}
	.amount {
		float: right;
		color: gray;
	}
}
</style>
