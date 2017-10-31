<template>
<div class="container">

<mt-cell v-for="c in cart_list" :key="c.createTime">
	<div slot="title" class='shop-cart'>
		<div class="check-box">
			<mt-checklist
			  v-model="checked_pro"
			  :options="Array.of(c.productId)">
			</mt-checklist>
		</div>
		<div slot="title" class="goods-list" 
		:style="{'background': 'url(' + c.productIcon + ') no-repeat left center'}">
			<h3>{{ c.productName }}</h3>
			<p style="color:#ef4f4f">￥{{c.productPrice}}</p>
	  	<div class="select-amount">
	  		<div class="fa fa-minus" 
	  		@click="c.productQuantity > 1 ? c.productQuantity-- : ''" 
	  		:class="{'disabled' : c.productQuantity == 1 }">
	  		</div>
	  		<div><input type="number" @blur="c.productQuantity?'':c.productQuantity = 1"
	  		 v-model.number="c.productQuantity"></div>
	  		<div class="fa  fa-plus" @click="increase(c)"></div>
	  	</div>
		</div>
	</div>
</mt-cell>

<mt-cell class="cal-box">
	<div slot="title">
		<div class="el-wrap">
			<div class="check-box show-label">
				<mt-checklist
				  v-model="check_all"
				  :options="check_all_value">
				</mt-checklist>
			</div>
		</div>
	</div>
	<div>
		<span style="font-size:14px;">总计：￥332.34&nbsp;&nbsp;</span>
		<mt-button type="primary" @click="goSettle"
		style="font-size:14px;" :disabled="checked_pro.length == 0">去结算<br/>（{{ proAmount() }}件）</mt-button>
	</div>

</mt-cell>


</div>	
</template>

<script>
import {reqShoppingCartList} from '../../api'
export default {
  data () {
  	return {
      checked_pro: [],
      all_orders: [],
      check_all: [],
      check_all_value: ['全选'],
      bb: true,
      cc: true,
      bbTimeout: '',
      ccTimeout: '',

      cart_list: []
  	}
  },
  methods: {
  	increase(c) {
  		c.productQuantity++
  		if (!this.checked_pro.includes(c.productId)) {
  			this.checked_pro.push(c.productId)
  		}
  	},
  	proAmount() {
		let sum = 0
  		for (let i of this.cart_list) {
  			if (this.checked_pro.includes(i.productId)) {
  				sum += i.productQuantity
  			}
  		}
  		return sum
  	},
  	goSettle() {
  		let items = []
  		for (let i of this.cart_list) {
  			console.log(i)
  			if (this.checked_pro.includes(i.productId)) {
  				items.push(i)
  			}
  		}
  		sessionStorage.setItem('order_info', JSON.stringify({items}))
  		this.$router.push({
  			name: 'SettleOrder'
  		})  		
  	}
  },
  watch: {
  	check_all(val) {
		clearTimeout(this.bbTimeout)
  		if (this.cc) {
  			this.bb = false
	  		if (this.check_all.length == 1) {
	  			this.checked_pro = this.all_orders
	  		} else {
	  			this.checked_pro = []
	  		} 
  		}
  		this.bbTimeout = setTimeout(() =>{
  			this.bb = true
  		}, 100)

  	},
  	checked_pro(val) {
		clearTimeout(this.ccTimeout)
  		if( this.bb ){
  			this.cc = false
	  		if (this.checked_pro.length == this.all_orders.length) {
	  			this.check_all = this.check_all_value
	  		} else {
				this.check_all = []
	  		}
  		}
  		this.ccTimeout = setTimeout(() =>{
  			this.cc = true
  		}, 100)

  	}
  },
  mounted() {
  	let userId = JSON.parse( sessionStorage.getItem('ebay-app') ).userWxOpenid
	reqShoppingCartList({userId}).then((res) => {
		this.cart_list = res.data.data
		for (let i of res.data.data ) {
			this.all_orders.push(i.productId)
		}
	})
  }
}
</script>

<style lang="scss">
.cal-box {
	position: fixed;
	bottom: 0;
    width: 100%;
    font-size: 14px;
    .el-wrap{
    	height: 50px;
    	>div:nth-child(1) {
    		float: left;
    	}
    	>div{
    		float: right;
    	}
    	> div:nth-child(2) {
    		background: gray;
    		height: 100%;
    	}
    }

}
.show-label {
	.mint-checkbox-label{
		display: inline!important;
		font-size: 14px;
	}
}
.shop-cart {
	display: flex;
	align-items: center;

}
.check-box {
	.mint-cell-wrapper {
		padding: 0;
	}
	.mint-checklist-label {
		padding-left: 0;
	}
	.mint-checkbox-label {
		display: none;
	}
}
</style>

<style lang="scss" scoped>
.select-amount {
	display: flex;
	.fa{
		padding-top: 6px;
		color: #666;
	}
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
.goods-list {
	padding: 10px 0 10px 120px;
    background-size: 100px auto!important;
    height: 110px;
    line-height: 26px;
	h3, p{
		margin: 0;
	}
	h3 {
	    overflow: hidden;
	    text-overflow: ellipsis;
	    display: -webkit-box;
	    -webkit-line-clamp: 2;
	    -webkit-box-orient: vertical;
	    word-wrap: break-word;	
	    word-break: break-all;	
	}
  button {
    position: absolute;
    bottom: 16px;
  }
}
</style>