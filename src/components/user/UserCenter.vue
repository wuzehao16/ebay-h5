<template>
<div class="container">

<div class="header" :style="{'background': 'url(' + require('../../assets/back.jpg') + 
		') no-repeat','background-size': 'cover'}">
<template v-if="user.userWxPicture">
	<div :style="{'background': 'url(' + user.userWxPicture + 
		') no-repeat,url(' + require('../../assets/test.png') + ') no-repeat'}" class="head-pic"></div>
	<div class="head-r">
		<h3>你好，{{ user.userWxName }}</h3>
		<p>会员ID：{{ user.userWxOpenid }}</p>
	</div>
</template>
</div>

<mt-cell is-link title="我的订单" to="/order/list" style="z-index: 100">
	<i slot="icon" class="iconfont icon-order" style="color: #26a2ff;"></i>
	<span style="font-size: 12px;">查看更多订单</span>
</mt-cell>
<mt-cell class="no-bg">
	<div slot="title" >
		<ul class="order-type  clearfix">
			<li @click="goOrderList('all_orders')">
				<i class="iconfont icon-all"></i><br/><span>全部</span></li>
			<li @click="goOrderList('to_pay')">
				<i class="iconfont icon-to-pay"></i><br/><span>待付款</span></li>
			<li @click="goOrderList('to_receive')">
				<i class="iconfont icon-to-receive"></i><br/><span>待收货</span></li>
		</ul>
	</div>
</mt-cell>
<template v-if="user.userCtype == '1'">
	<mt-cell is-link title="我的钱包" to="/user/wallet" style="z-index: 100;">
		<i slot="icon" class="iconfont icon-wallet" style="color: #ff9800;"></i>
	</mt-cell>
	<mt-cell class="no-bg">
		<div slot="title" >
			<ul class="order-type clearfix">
				<li><p>￥{{ user.userBalance }}</p><span>账户余额</span></li>
				<li><p>￥{{ user.yIncome }}</p><span>昨日收益</span></li>
				<li><p>￥{{ user.hIncome }}</p><span>历史收益</span></li>
			</ul>
		</div>
	</mt-cell>
	<mt-cell title="我的客户" :value="count == '' ? 0 : count" is-link to="/user/client">
		<i slot="icon" class="iconfont icon-client" style="color:#009688;"></i>
	</mt-cell>
	<mt-cell title="我要提现" is-link to="/user/withdraw">
		<i slot="icon" class="iconfont icon-withdraw" style="color:#ff9800;"></i>
	</mt-cell>
	<mt-cell title="我要推广" is-link to="/popularize/list">
		<i slot="icon" class="iconfont icon-popularize" style="color:#4caf50;font-size: 10px;margin-left: -3px;"></i>
	</mt-cell>	
</template>
<mt-cell title="我要下单" is-link to="/product/list">
	<i slot="icon" class="iconfont icon-go-buy" style="color:#2196f3;"></i>
</mt-cell>
</div>
</template>

<script>
import {reqUserInfo, reqMyCusCount, reqWechatAuth, baseUrl} from '../../api'
import { Indicator, Toast } from "mint-ui"
export default {
  data () {
  	return {
  		user: {},
  		count: ''
  	}
  },
  methods: {
  	goOrderList(val) {
  		this.$router.push({
  			name: 'OrderList',
  			params: {
  				active_tab: val
  			}
  		})
  	}
  },
  mounted() {
    Indicator.open({
      spinnerType: "fading-circle"
    })
  	this.user = JSON.parse(sessionStorage.getItem('ebay-app'))
  	
  	reqUserInfo({id: this.user.id}).then((res) => {
  		if (res.data.code == 0) {
  			this.user = res.data.data
  			if (this.user.userCtype == '1') {
			  	reqMyCusCount(this.user).then((res) => {
			  		if (res.data.data) {
			  			this.count = res.data.data
			  		}
			  	})  				
  			}
  		} else {
  			Toast(res.data.msg)
  		}
  		Indicator.close()
  	}).catch((err) => { Indicator.close() })
  }
}
</script>
<style lang="scss">
.no-bg {
	z-index: 101;
	margin-top: -10px;
	margin-bottom: 10px;
	.mint-cell-wrapper {
		background-size: 0;
	}
}
.mint-cell-allow-right::after {
	border-top-width: 1px;
	border-right-width: 1px;
	width: 8px;
	height: 8px;
}
.mint-cell-text {
	color: #666;
	font-size: 14px;
}
</style>
<style lang="scss" scoped>
.iconfont {
	vertical-align: middle;
	font-size: 18px;
}
.container {
	background: #eee;
	height: 100%;
}
.order-type {
    list-style-type: none;
    padding: 0px 0;
    li {
    	float: left;
    	width: 33%;
    	text-align: center;
    	line-height: 20px;
    	font-size: 12px;
    	color: red;
	    &:active{
    		background: lightgrey;
    	}
    }
    i {
    	font-size: 24px;
    	padding: 4px 0;
    	display: inline-block;
    }
    span {
    	color: gray;
    	margin-bottom: 4px;
    	display: inline-block;
    }
    p {
		color: #ef4f4f;
    	margin: 0 0 4px 0;
    }
}
.header{
	background: #999;
	overflow: hidden;
	.head-pic {
		height: 20vw;
		width: 20vw;
		background-size: contain!important;
		border-radius: 50%;
		margin: 5vw;
		float: left;
	}
	.head-r {
		float: left;
		width: 70vw;
		color: #fbfbfb;
		p {
			margin: 6px 0;
			font-size: 14px;
		}
	}
}	
</style>
