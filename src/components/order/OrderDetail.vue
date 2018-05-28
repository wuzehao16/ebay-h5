<template>
<div class="container">
<template v-if=' Number.parseInt(order.orderStatus) >= 3 '>
<mt-cell :title='logistics[0].trackingMessage'
	 v-if="logistics[0] && logistics[0].trackingMessage"
	 :label='logistics[0].trackingTime'
	 :is-link="true" @click.native='goLogi' style="padding-top: 10px;">
</mt-cell>
<mt-cell v-else title="尚无物流配送信息。">

</mt-cell>
</template>
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
		<li><i>预计到货时间：</i><span>{{ formatTime(order.arrivalTime,'yy-MM-dd hh:mm:ss') }}</span></li>
	</ul>
</mt-cell>

<mt-cell>
	<ul slot='title' class="wrap-one">
		<li><i>商品金额：</i><span>￥{{ goodsMoney }}</span></li>
		<li><i>收货地址：</i><span>{{ order.cneeAddress ? order.cneeAddress.replace(/@/g, '') : '' }}</span></li>
		<li><i>收货人：</i><span>{{ order.cneeName }}&nbsp;&nbsp;{{ order.cneePhone }}</span></li>
	</ul>
</mt-cell>

<div style="margin: 10px 0;">
<mt-cell v-if='order.productList'  v-for="(o, index) in order.productList" :key="index">
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
			<span class="high-light">￥{{ goodsMoney }}</span></li>
		<li><i>税费（包含于商品金额）：</i><span class="high-light">￥{{ taxFee }}</span></li>
		<li><i>运费（包含于商品金额）：</i><span class="high-light">￥{{ cFee }}</span></li>
	</ul>
</mt-cell>

<mt-cell>
	<div>实付金额：<span class="high-light font-b">￥{{ order.orderAmount }}</span></div>
</mt-cell>

</div>
</template>

<script>
import {reqLogistics, reqBuyerOrderDetail} from '../../api'
export default {
  data() {
  	return {
  		order: {},
  		logistics: []
  	}
  },
  beforeRouteEnter (to, from, next) {
  	if (from.name == 'OrderList' || from.name == 'DistriOrderList') {
	    next(vm => {  
		  	vm.order = to.params.order
		    console.log('vm.order',vm.order)
            console.log('2:', vm.order.orderDetailList)
		  	//   '17091924161'
		  	reqLogistics({logisticsNo: vm.order.logisticsNo}).then((res) => {
		  		let r = res.data.data
		  		if (typeof r == 'object') {
		  			vm.logistics = r
		  		}
		  	}).catch(err => {})
  		})
  	} else if (from.name == 'LogisticsInfo') {
  		next()
  	} else {
  		next('/order/list')
  	}
  },
  computed: {
  	goodsMoney() {
  		// return (this.order.orderAmount - this.order.carriageFee - this.order.taxFee).toFixed(2)
        return this.order.orderAmount
  	},
    taxFee() {
        let a = this.order.productList
        if (a) {
            return a[0].taxFee * a[0].orderDetail.productQuantity
        } else {
            return 0
        }
    },
    cFee() {
        let a = this.order.productList
        if (a) {
            return a[0].carriageFee * a[0].orderDetail.productQuantity
        } else {
            return 0
        }       
    }
  },
  methods: {
  	goLogi() {
  		this.$router.push({
  			name: "LogisticsInfo",
  			params: {
  				logistics: this.logistics,
  				orderNo: this.order.orderNo
  			}
  		})
  	}
  },
  activated() {
  	let a = this.$route.params.order
    if (!a) {
        this.$router.push('/order/list')
    }
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
