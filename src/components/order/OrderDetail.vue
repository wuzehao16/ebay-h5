<template>
<div class="container">

<mt-cell title='三少爷的剑啊已收到，感谢使用天速物流！' label='2017-11-30 23:59:59'
	 is-link :to='{name: "LogisticsInfo"}'>
</mt-cell>
<mt-cell>
	<ul slot='title' class="wrap-one">
		<li><i>状态：</i><span>
            <template v-if="order.orderStatus == '1'">待支付</template>
            <template v-if="order.orderStatus == '2'">已取消</template>
            <template v-if="order.orderStatus == '3'">已支付</template>
            <template v-if="order.orderStatus == '4'">已发货</template>
            <template v-if="order.orderStatus == '5'">已完成</template>
            <template v-if="order.orderStatus == '6'">退款中</template>
            <template v-if="order.orderStatus == '7'">已退款</template>
            <template v-if="order.orderStatus == '9'">已删除</template>			
		</span></li>
		<li><i>订单编号：</i><span>{{ order.orderNo }}</span></li>
		<li><i>下单时间：</i><span>{{ formatTime(order.created, 'yy-MM-dd hh:mm:ss')  }}</span></li>
	</ul>
</mt-cell>

<mt-cell>
	<ul slot='title' class="wrap-one">
		<li><i>商品金额：</i><span>￥{{ order.orderAmount }}（微信支付）</span></li>
		<li><i>收货地址：</i><span>{{ order.cneeAddress ? order.cneeAddress.replace(/@/g, '') : '' }}</span></li>
		<li><i>收货人：</i><span>{{ order.cneeName }}&nbsp;&nbsp;{{ order.cneePhone }}</span></li>
	</ul>
</mt-cell>

<div style="margin: 10px 0;">	
<!-- <mt-cell title='万邑淘' value='共计xxx件商品'></mt-cell> -->
<mt-cell v-for="(o, index) in order.productList" :key="index">
	<div slot="title" class="order-container" :style="{'background': 
		'url(' + o.orderDetail.productIcon + ') left center no-repeat'}">
		<h3>{{ o.orderDetail.productName }}</h3>
		<div><span class="price">￥{{ o.orderDetail.productPrice }}</span>
		<span class="amount">x{{ o.orderDetail.productQuantity }}</span></div>
	</div>
</mt-cell>
</div>

<mt-cell>
	<ul slot='title' class="wrap-one just-spe">
		<li><i>商品金额：</i>
			<span class="high-light">￥{{ order.orderAmount }}</span></li>
		<li><i>税费：</i><span class="high-light">￥{{ order.carriageFee }}</span></li>
		<li><i>运费：</i><span class="high-light">￥{{ order.taxFee }}</span></li>
	</ul>
</mt-cell>

<mt-cell>
	<div>实付金额：<span class="high-light font-b">￥{{ totalMoney }}</span></div>
</mt-cell>

</div>	
</template>

<script>
import {reqLogistics, reqBuyerOrderDetail} from '../../api'
export default {
  data() {
  	return {
  		order: {}
  	}
  },
  beforeRouteEnter (to, from, next) {
  	if (from.name == 'OrderList') {
  		next(vm => {
		  	vm.order = to.params.order
		  	console.log(vm.order)
		  	reqLogistics({orderNo: vm.order.orderNo}).then((res) => {

		  	}).catch(err => {})
  		})
  	} else if (from.name == 'LogisticsInfo') {
  		next()
  	} else {
  		next('/order/list')
  	}
  },
  computed: {
  	totalMoney() {
  		return this.order.orderAmount + this.order.carriageFee + this.order.taxFee
  	}
  },
  mounted() {
/*  	let a = this.$route.params.order
  	reqBuyerOrderDetail({
  		openid: a.buyerOpenid,
  		orderId: a.orderNo
  	}).then((res) => {
  		
  	})*/
  }
}
</script>

<style lang="scss">
.wrap-one {
	padding: 10px 0;
	line-height: 18px;
	font-size: 14px;
	li {
		display: flex;
	}
	i {
		flex: none;
		color: #888;
		font-style: normal;
	}
	span {
		color: #666;
	}
}
.high-light {
	color: #0099f7!important;
}
.font-b {
	font-weight: bold;
}
.just-spe {
	li {
		justify-content: space-between;
	}
}
</style>