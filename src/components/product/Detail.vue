<template>
<div class="container">
	<mt-swipe :auto="5000" :speed="0" class="pre-banner" style="background: #fff;">
	  <mt-swipe-item v-for="(url,index) in productInfo.pic">
	  	<div :style="{'background-image': 'url(' + url + ')'}" class="wrapper">
				<span v-if="productInfo.pic && productInfo.pic.length> 0" class="page-nub">
					
					<span class="num1">{{index+1}}</span>
					<span class="bg">/</span>		
					<span class="num2">{{productInfo.pic.length}}</span>
					</span>
				</div>
	  </mt-swipe-item>
	
	</mt-swipe>
	<mt-tabbar :fixed="true" class="addCart">
	<template v-if="!isPreview">
		<div class="cart">
			<i class="fa fa-cart-plus" @click="toCart"></i>
			<!-- <mt-badge type="danger" size="small" class="num">10</mt-badge> -->
			<span class="num">{{ pro_in_cart < 100 ? pro_in_cart : '99+' }}</span>
		</div>
	  <mt-button type="danger" @click="addToCart">加入购物车</mt-button>
	  <mt-button type="primary"
	  	@click="buyIt">立即购买</mt-button>
	</template>
	  <mt-button v-if="isPreview" type="primary" size="large" 
	  	@click="backList">返回我的发布</mt-button>
	</mt-tabbar>
	<mt-cell :title="productInfo.name" label="" style="padding-top:10px">
	  <span class="love-it" @click="collected = !collected"><i class="iconfont" :class="{'icon-collect': !collected, 'icon-collect-color': collected}"></i><br/>收藏</span>
	</mt-cell>
	<div class="price">￥{{productInfo.price}}</div>
	
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
	  	<dt class="number-title">数量</dt>
	  	<dd class="select-amount">
	  		<div class="f decrease"  @click="amount > 1 ? amount-- : ''" :class="{'disabled' : amount == 1 }">-</div>
	  		<div><input type="number" @blur="amount?'':amount = 1" v-model="amount"></div>
	  		<div class="f increase" @click="amount++">+</div>
	  	</dd>

  	</dl>

  	<mt-cell title="商品介绍"></mt-cell>
  	<mt-cell v-for="d in productInfo.productAttr" :key="d.created" :title="d.attrName + ' :'" :label="d.attrValue + ''"></mt-cell>



</div>
</template>

<script>
import {reqProductDetail, reqAddToShoppingCart, reqShoppingCartList} from '../../api'
import {Toast} from 'mint-ui'
import util from '../../api/util'
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
  		isPreview: false,
  		pro_in_cart: 0
  	}
  },
  methods: {
  	addToCart() {
  		let userId = JSON.parse( sessionStorage.getItem('ebay-app') ).userWxOpenid
  		let goodCarForm = {
  			productId: this.productInfo.id,
  			productName: this.productInfo.name,
  			productPrice: this.productInfo.price,
  			productQuantity: this.amount,
  			productIcon: this.productInfo.icon  			
  		}
  		reqAddToShoppingCart({userId, goodCarForm}).then((res) => {
			if (res.data.code == 0 && res.data.msg == '成功') {
				Toast('已加入购物车')
				this.pro_in_cart++
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
		},
		toCart(){
			this.$router.push('/order/shoppingcart')
		}
  },
  mounted() {
  	if (util.getQueryStringByName('pc_preview')) {
  		this.isPreview = true
  	}

  	if (this.$route.params.id || this.isPreview) {
  		let productId = this.$route.params.id || util.getQueryStringByName('pc_preview')
	  	reqProductDetail({productId}).then((res) => {
			this.productInfo = res.data.data
			console.log(this.productInfo)
	  	})
  	} else {
  		this.$router.push('/product/list')
  	}
  	if (this.$route.params.isPreview) {
  		this.isPreview = this.$route.params.isPreview
  	}

  	//获取购物车中商品总数
  	let userId = JSON.parse( sessionStorage.getItem('ebay-app') ).userWxOpenid
	reqShoppingCartList({userId}).then((res) => {
		let added_list = res.data.data
		for (let i of added_list ) {
			this.pro_in_cart += i.productQuantity
		}
	})
  }
}
</script>

<style lang='scss' scoped>
$bg-red : #f23030;
.mint-swipe{
	background: #fff;
}
.mint-swipe-indicator.is-active {
    background: red;
}
.pre-banner {
	.mint-swipe-item:nth-child(odd) {
		background: #fff;
	}
	.mint-swipe-item:nth-child(even) {
		background: #fff;
	}
	.wrapper{
		height: 205px;
		width: 200px;
		margin: 0 auto;
		background-size:auto 190px;
		background-repeat:no-repeat;
		background-position: center;
	}
}
.container {
	margin-bottom: 42px;
	.addCart{
		display: flex;
		div{
			flex:0 0 50px;
			color: #999;
			font-size: 30px;
			line-height: 48px;
			position: relative;
			.num{
				position: absolute;
				right: 4px;
				top: 4px;
				color: #fff;
				display: inline-block;
				top: 4px;
				background-color: #f23030;
				line-height: 10px;
				font-style: normal;
				border-radius: 8px;
				padding: 1px 4px;
				font-size: 10px;
				border: 1px solid #fff;
			}
		}
		button{
			border-radius: 0;
			height: 48px;
			flex: 1 0 auto;
			
		}
		button:nth-child(2){
			background-color: #ffb03f;
			margin-right: -2px;
		}
	}
	.price{
		font-size: 23px;
		background-color: #fff;
		color:red;
		padding-bottom: 10px;	
  }
}
.love-it {
	text-align: center;
	line-height: 20px;
	.icon-collect-color {
		color: #ffc107;
	}
}
.number-title{
	padding: 12px 5px 0 12px;
}
.select-amount {
	.decrease{
		border-top-left-radius: 5px;
		border-bottom-left-radius: 5px;
	}
	.increase{
				border-top-right-radius: 5px;
		border-bottom-right-radius: 5px;
	}
	.f{
    outline: 0;
    line-height: 26px;
    height: 26px;
    width: 19px;
    text-align: center;
    font-size: 24px;
    border: 1px solid #f5f5f5;
    background-color: #f5f5f5;
	}
	padding: 10px;
	div {
		padding: 0 5px;
	}
	div:nth-child(odd) {
		border: 1px solid #cbcbcb;

	}
	.disabled{
		color: #cbcbcb;
	}
	div:nth-child(even) {
		width: 40px;
		text-align: center;
		border-width: 1px 0 1px 0;
		border-color: #cbcbcb;
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
			padding-top: 10px;
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
.page-nub{
	    font-size: 16px;
    z-index: 11;
    position: absolute;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    -webkit-border-radius: 50%;
    background: rgba(0,0,0,.15);
    right: 15px;
    bottom: 11px;
    text-align: center;
    line-height: 40px;
    overflow: hidden;
		.num1{
						    font-size: 14px;
    display: inline-block;
    color: #fff;
    margin-right: -3px;
		}
		.num2{
			    font-size: 12px;
    display: inline-block;
    color: #fff;
    margin-left: -3px;
		}
		.bg{
		font-size: 12px;
    display: inline-block;
    color: #fff;
		}
}

</style>
