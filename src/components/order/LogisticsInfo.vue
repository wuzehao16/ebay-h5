<template>
<div class="container">	

<mt-cell class="logi-title">
	<div slot="title">
		<span>订单编号：</span>
		<span>{{ $route.params.orderNo }}</span>
	</div>
</mt-cell>

<div>
	<mt-cell v-for="(a, index) in $route.params.logistics" :key="index">
		<div slot="title" class="logi-info" :class="{'height-light': index == 0 }">
			<div>{{ a.trackingMessage }}</div>
			<div>{{ a.trackingTime }}</div>
		</div>
		<div slot="icon" class="logi-circle" :class="{'first-circle': index == 0 }"></div>
	</mt-cell>
</div>


</div>
</template>

<script>
export default {
  data() {
  	return {
  		orderNo: '',
  		logistics: []
  	}
  },
  beforeRouteEnter(to, from, next) {
  	if (from.name != 'OrderDetail') {
  		next('/order/list')
  	} else {
  		next()
  	}
  },
  activated() {
  	console.log(this.$route)
  	this.orderNo = this.$route.params.orderNo
  	this.logistics = this.$route.params.logistics
  }
}
</script>

<style lang="scss" scoped>
$red: red;
.container {
	.logi-title {
		margin-bottom: 10px;
		span:nth-child(1) {
			color: gray;
		}
	}
	.logi-circle{
		height: 10px;
		width: 10px;
		background: gray;
		position: absolute;
		left: 10px;
		top: 12px;
		border-radius: 50%;
	}
	.first-circle {
	    height: 6px;
	    width: 6px;
	    background: $red;
	    border: 1px solid $red;
	    background-clip: content-box;
	    padding: 2px;		
	}
	.logi-info {
		margin: 10px 0 10px 20px;
		line-height: 20px;
		div:nth-child(2) {
			margin-top: 10px;
			font-size: 14px;
			color: gray;
		}
	}
	.height-light {
		div {
			color: $red!important;
		}
	}
}
</style>