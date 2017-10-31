<template>
<div class="container">
	<mt-swipe :auto="5000" :speed="0" class="pre-banner">
	  <mt-swipe-item v-for="url in productInfo.pic">
	  	<div :style="{'background': 'url(' + url + ') no-repeat center',
	  		'background-size': 'cover',
	  		'height': '100%', 'width': '100%'}"></div>
	  </mt-swipe-item>
	
	</mt-swipe>
	<mt-tabbar :fixed="true">
	<template v-if="!isPreview">
	  <mt-button type="danger" @click="addToCart">加入购物车</mt-button>
	  <mt-button type="primary"
	  	@click="buyIt">立即购买</mt-button>
	</template>
	  <mt-button v-if="isPreview" type="primary" size="large" 
	  	@click="backList">返回我的发布</mt-button>
	</mt-tabbar>
	<mt-cell :title="productInfo.name" 
		label="">
	  <span class="love-it" @click="collected = !collected"><i class="iconfont" :class="{'icon-collect': !collected, 'icon-collect-color': collected}"></i><br/>收藏</span>
	</mt-cell>
	<mt-cell :title="'￥' + productInfo.price" style="color:red"></mt-cell>
	
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
	  		<div class="fa fa-minus" @click="amount > 1 ? amount-- : ''" :class="{'disabled' : amount == 1 }"></div>
	  		<div><input type="number" @blur="amount?'':amount = 1" v-model="amount"></div>
	  		<div class="fa  fa-plus" @click="amount++"></div>
	  	</dd>

  	</dl>

  	<mt-cell title="商品介绍"></mt-cell>
  	<mt-cell v-for="d in productInfo.productAttr" :key="d.created" :title="d.attrName + ' :'" :label="d.attrValue + ''"></mt-cell>



</div>
</template>

<script>
import {reqProductDetail, reqAddToShoppingCart} from '../../api'
import {Toast} from 'mint-ui'
export default {
  data () {
  	return {
  		productInfo: {},
  		active: 'tab-container1',
  		selected: '1',
  		activeSize: '',
  		activeColor: '',
  		amount: 1,
  		collected: false,
  		items: [],
  		isPreview: false
  	}
  },
  methods: {
  	addToCart() {
  		let userId = JSON.parse( sessionStorage.getItem('ebay-app') ).userWxOpenid
  		// let userId = '1'
  		let goodCarForm = {
  			productId: this.productInfo.id,
  			productName: this.productInfo.name,
  			productPrice: this.productInfo.price,
  			productQuantity: this.amount,
  			productIcon: this.productInfo.icon  			
  		}
  		console.log({userId, goodCarForm})
  		reqAddToShoppingCart({userId, goodCarForm}).then((res) => {
			if (res.data.code == 0 && res.data.msg == '成功') {
				Toast('已加入购物车')
			} else {
				Toast(res.data.msg)
			}
  		})
  	},
  	selectSize(o) {
  		this.activeSize = o
  	},
  	selectColor(o) {
  		this.activeColor = o
  	},
  	buyIt() {
  		this.items.push({
  			productId: this.productInfo.id,
  			productName: this.productInfo.name,
  			productPrice: this.productInfo.price,
  			productQuantity: this.amount,
  			productIcon: this.productInfo.icon
  		})
  		let order_info = {
  			items: this.items
  		}
  		sessionStorage.setItem('order_info', JSON.stringify(order_info))
  		this.$router.push({
  			name: 'SettleOrder'
  		})
  	},
  	backList() {
  		this.$router.push('/popularize/list')
  	}
  },
  mounted() {
  	if (this.$route.params.id) {
	  	reqProductDetail({productId: this.$route.params.id}).then((res) => {
			this.productInfo = res.data.data
			console.log(this.productInfo)
	  	})
  	} else {
  		this.$router.push('/product/list')
  	}
  	if (this.$route.params.isPreview) {
  		this.isPreview = this.$route.params.isPreview
  	}

  }
}
</script>

<style lang='scss' scoped>
$bg-red : #f23030;
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
	.fa{
		padding-top: 3px;
	}
	padding: 10px;
	div {
		padding: 0 5px;
	}
	div:nth-child(odd) {
		border: 1px solid #999;

	}
	.disabled{
		color: #cbcbcb;
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
	background: $bg-red;
	color:#fff;
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
		width: 30px;
		float: left;
		padding: 10px;
		font-size: 14px;
		color:#81838e;
	}
	dd {
		display: flex;
		ul {
			list-style-type: none;
			li {
				float: left;
				margin: 0 6px 6px 0;
				background: #f7f8fa;
				color: #000;
				border-radius: 4px;
				padding: 4px;
			}
		}
	}
}


</style>
