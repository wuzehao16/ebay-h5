<template>
<div class="container">
	<mt-swipe :auto="5000" :speed="0" class="pre-banner">
	  <mt-swipe-item>1</mt-swipe-item>
	  <mt-swipe-item>2</mt-swipe-item>
	  <mt-swipe-item>3ff</mt-swipe-item>
	</mt-swipe>
	<mt-tabbar :fixed="true">
	  <mt-button type="primary" size="large" @click="backList">返回我的发布</mt-button>
	</mt-tabbar>
	<mt-cell :title="goodsInfo.productNane" 
		label="千颂伊星星色 纯口红 香港直邮">
	  <span class="love-it" @click="collected = !collected"><i class="iconfont" :class="{'icon-collect': !collected, 'icon-collect-color': collected}"></i><br/>收藏</span>
	</mt-cell>
	<mt-cell :title="'￥' + goodsInfo.productPrice"></mt-cell>
	
  	<dl>
	  	<dt>尺寸</dt>
	  	<dd>
	  	<ul>
	  		<li v-for="o in 10" :key="o" :class="{'height-light' : activeSize == o }"  
	  			@click='selectSize(o)'>dfda{{ o }}</li>
	  	</ul>
	  	</dd>
  	</dl>  	
  	<dl>
	  	<dt>颜色</dt>
	  	<dd>
	  	<ul>
	  		<li v-for="o in 10"  :class="{'height-light' : activeColor == o }"  
	  			@click='selectColor(o)'>{{ o }}色</li>
	  	</ul>
	  	</dd>
  	</dl>
  	<dl>
	  	<dt>数量</dt>
	  	<dd class="select-amount">
	  		<div class="iconfont icon-down" @click="amount > 1 ? amount-- : ''"></div>
	  		<div><input type="number" v-model="amount"></div>
	  		<div class="iconfont icon-up" @click="amount++"></div>
	  	</dd>

  	</dl>

  	<mt-cell title="商品介绍"></mt-cell>
  	<mt-cell v-for="d in detail" :key="d.key + d.value" :title="d.key + ' :'" :label="d.value"></mt-cell>



</div>
</template>

<script>

export default {
  data () {
  	return {
  		goodsInfo: {},

  		active: 'tab-container1',
  		selected: '1',
  		activeSize: '',
  		activeColor: '',
  		amount: 1,
  		collected: false,
  		detail: [{
  			key: '产品名称',
  			value: 'YSL/圣罗兰 迷魅纯漾润唇膏'
  		},{
  			key: '上市时间',
  			value: '2014年'
  		},{
  			key: '净含量',
  			value: '3.8g'
  		},{
  			key: '化妆品保质期',
  			value: '36个月'
  		},{
  			key: '是否为特殊用途化妆品',
  			value: '否'
  		},{
  			key: '颜色分类',
  			value: '51 52 19 27 208 FUCHSIA'
  		},{
  			key: '规格类型',
  			value: '正常规格'
  		},{
  			key: '品牌',
  			value: 'YSL/圣罗兰'
  		},{
  			key: '产地',
  			value: '法国'
  		}]
  	}
  },
  methods: {
  	selectSize(o) {
  		this.activeSize = o
  	},
  	selectColor(o) {
  		this.activeColor = o
  	},
  	backList() {
  		this.$router.push('/popularize/list')
  	}
  },
  mounted() {
  	this.$route.params.goodsInfo ? this.goodsInfo = this.$route.params.goodsInfo : ''
  }
}
</script>

<style lang='scss' scoped>

.pre-banner {
	.mint-swipe-item:nth-child(odd) {
		background: blue
	}
}
.container {
	margin-bottom: 42px;
}
.love-it {
	text-align: center;
	line-height: 20px;
	.icon-collect-color {
		color: #ffc107;
	}
}
.select-amount {
	padding: 10px;
	div {
		padding: 0 5px;
	}
	div:nth-child(odd) {
		border: 1px solid #999;

	}
	div:nth-child(even) {
		width: 40px;
		text-align: center;
		border-width: 1px 0 1px 0;
		border-color: #999;
		border-style: solid;
		input {
		    margin: 0;
		    padding: 0;
		    height: 100%;
		    width: 100%;
		    border: none;
		    background: transparent;
		    text-align: center;
		    &:focus {
		    	outline-style: none;
		    }
		}
	}
}
.height-light {
	background: #6c6c71!important;
}
.mint-swipe{
	height: 200px;
	background: red;
}
.mint-cell-value{
	padding: 10px;
}
dl {
	background: #fff;
	overflow: hidden;
	dt {
		width: 60px;
		float: left;
		padding: 10px;
	}
	dd {
		display: flex;
		ul {
			list-style-type: none;
			padding-left: 10px;
			li {
				float: left;
				margin: 0 6px 6px 0;
				background: #d6cece;
				border-radius: 4px;
				padding: 4px;
			}
		}
	}
}


</style>
