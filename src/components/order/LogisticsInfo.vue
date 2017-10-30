<template>
<div class="container">	

<mt-cell class="logi-title">
	<div slot="title">
		<span>订单编号：</span>
		<span>65415463615464</span>
	</div>
</mt-cell>

<div>
	<mt-cell v-for="i in 10" :key="i">
		<div slot="title" class="logi-info">
			<div>您的订单已进入第三方卖家库房，等待发货</div>
			<div>2017-12-12 12:12:12</div>
		</div>
		<div slot="icon" class="logi-circle" :class="{'first-circle': i == 1 }"></div>
	</mt-cell>
</div>


</div>
</template>

<style lang="scss" scoped>
.container {
	height: 100%;
	.logi-title {
		margin-bottom: 10px;
		span:nth-child(1) {
			color: gray;
		}
	}
	.logi-circle{
		height: 10px;
		width: 10px;
		// background: #ef4f4f;
		background: gray;
		position: absolute;
		left: 10px;
		top: 12px;
		border-radius: 50%;
	}
	.first-circle {
	    height: 6px;
	    width: 6px;
	    background: red;
	    border: 1px solid red;
	    background-clip: content-box;
	    padding: 2px;		
	}
	.logi-info {
		margin: 10px 20px;
		line-height: 20px;
		div:nth-child(2) {
			margin-top: 10px;
			font-size: 14px;
			color: gray;
		}
	}
}
</style>