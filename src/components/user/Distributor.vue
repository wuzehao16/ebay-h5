<template>
<div class="container">
	<div>
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
		<!-- 分销商订单 -->
		<mt-cell title="分销商订单" is-link to="/order/distrilist">
			<i slot="icon" class="iconfont icon-order" style="color: #26a2ff;"></i>
		</mt-cell>
	</div>
</div>
</template>

<script>
import {reqMyCusCount} from '../../api'
export default {
	data () {
		return {
			user: {},
			count: ''
		}
	},
	mounted() {
		this.user = JSON.parse(sessionStorage.getItem('ebay-app'))
	  	reqMyCusCount(this.user).then((res) => {
	  		if (res.data.data) {
	  			this.count = res.data.data
	  		}
	  	})  				

	}
}	
</script>

<style lang="scss" scoped>
.iconfont {
	vertical-align: middle;
	font-size: 18px;
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
</style>