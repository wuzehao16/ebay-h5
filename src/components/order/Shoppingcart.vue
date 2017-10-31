<template>
<div class="container">


<mt-cell>
	<div class='shop-cart'>
		<div class="check-box">
			<mt-checklist
			  v-model="checked_pro"
			  :options="Array.of(a[0])">
			</mt-checklist>
		</div>
		<div slot="title" class="goods-list" 
		:style="{'background': 'url(' + require('../../assets/test.png') + ') no-repeat left center'}">
			<h3>心相印茶语手帕纸 经典系列 4层6条*12包（整箱销售）</h3>
			<p style="color:#ef4f4f">￥29.50</p>
		</div>
	</div>
</mt-cell>

<mt-cell>
	<div class='shop-cart'>
		<div class="check-box">
			<mt-checklist
			  v-model="checked_pro"
			  :options="Array.of(a[1])">
			</mt-checklist>
		</div>
		<div slot="title" class="goods-list" 
		:style="{'background': 'url(' + require('../../assets/test.png') + ') no-repeat left center'}">
			<h3>美素佳儿金装幼儿配方奶粉3段（lalala）</h3>
			<p style="color:#ef4f4f">￥319.50</p>
		</div>
	</div>
</mt-cell>

<mt-cell>
	<div class='shop-cart'>
		<div class="check-box">
			<mt-checklist
			  v-model="checked_pro"
			  :options="Array.of(a[2])">
			</mt-checklist>
		</div>
		<div slot="title" class="goods-list" 
		:style="{'background': 'url(' + require('../../assets/test.png') + ') no-repeat left center'}">
			<h3>花花公子男士背心 新款纯棉背心男无袖运动休闲打底T</h3>
			<p style="color:#ef4f4f">￥24.50</p>
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
		<mt-button type="primary" style="font-size:14px;"
			 :disabled="checked_pro.length == 0">去结算<br/>（{{ checked_pro.length }}件）</mt-button>
	</div>

</mt-cell>


</div>	
</template>

<script>

export default {
  data () {
  	return {
      checked_pro: [],
      a: ['aaa', 'bbb', 'ccc'],
      check_all: [],
      check_all_value: ['全选'],
      bb: true,
      cc: true,
      bbTimeout: '',
      ccTimeout: ''
  	}
  },
  methods: {

  },
  watch: {
  	check_all(val) {
		clearTimeout(this.bbTimeout)
  		if (this.cc) {
  			this.bb = false
	  		if (this.check_all.length == 1) {
	  			this.checked_pro = this.a
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
	  		if (this.checked_pro.length == this.a.length) {
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