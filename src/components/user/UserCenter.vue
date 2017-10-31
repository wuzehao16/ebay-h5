<template>
<div class="container">

<div class="header" :style="{'background': 'url(' + require('../../assets/back.jpg') + 
		') no-repeat','background-size': 'cover'}">
	<div :style="{'background': 'url(' + require('../../assets/test.png') + 
		') no-repeat'}" class="head-pic"></div>
	<div class="head-r">
		<h3>你好，{{ user.userName }}</h3>
		<!-- <p>未激活会员（首次购买后自动激活）</p> -->
		<p>会员ID：{{ user.userWxOpenid }}</p>
		<!-- <p>邀请人：Jim</p> -->
	</div>
</div>

<mt-cell is-link title="我的订单" value="全部订单" to="/order/list">
	<i slot="icon" class="iconfont icon-order" style="color: red;"></i>
</mt-cell>
<mt-cell>
	<div slot="title" >
		<ul class="order-type clearfix">
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
	<mt-cell is-link title="我的钱包" to="/user/wallet">
		<i slot="icon" class="iconfont icon-wallet" style="color: #ff9800;"></i>
	</mt-cell>
	<mt-cell>
		<div slot="title" >
			<ul class="order-type clearfix">
				<li><p>{{ user.userBalance }}</p><span>账户余额</span></li>
				<li><p>{{ user.yIncome }}</p><span>昨日收益</span></li>
				<li><p>{{ user.hIncome }}</p><span>历史收益</span></li>
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
		<i slot="icon" class="iconfont icon-withdraw" style="color:#ff9800;"></i>
	</mt-cell>	
</template>
	<mt-cell title="我要下单" is-link to="/product/list">
		<i slot="icon" class="iconfont icon-order" style="color:#ff9800;"></i>
	</mt-cell>

</div>
</template>

<script>
import {reqUserInfo, reqMyCusCount} from '../../api'
import axios from 'axios'
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
  	let user = JSON.parse(sessionStorage.getItem('ebay-app'))
  	reqUserInfo(user).then((res) => {
  		console.log(res)
  		this.user = res.data.data
  	})
  	reqMyCusCount(user).then((res) => {
  		console.log(res.data.data)
  	})

  }
}
</script>


<style lang="scss" scoped>
.container {
	background: #fff;
	height: 100%;
}
.order-type {
    list-style-type: none;
    padding: 10px 0;
    li {
    	float: left;
    	width: 33%;
    	text-align: center;
    	line-height: 20px;
    }
    i {
    	font-size: 40px;
    }
    span {
    	color: gray;
    }
    p {
		color: #ef4f4f;
    	margin: 0 0 10px 0;
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
