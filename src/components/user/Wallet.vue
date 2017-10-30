<template>
<div class="container">

<mt-cell :title='year  + "年" +  month  + "月"' 
	:label="'支出￥' + month_disburse + '  收入￥' + month_income" 
	style="background:#e4e2e2;">
	<div @click="openPicker">
		<i class="iconfont icon-calendar"></i>
	</div>
</mt-cell>
<mt-loadmore :auto-fill="false" :bottom-method="getList" 
	:bottom-all-loaded="allLoaded" ref="loadmore">
	<div>
		<mt-cell v-for="item in w_list" :key="item.created">
			<div slot="title" class="order-container" :style="{'background': 
				'url(' + (item.product?item.product.productIcon:null) + ') left center no-repeat'}">
				<h3>{{ item.product?item.product.productNane:'用户提现' }}</h3>
				<p>{{ formatTime(item.created) }}</p>
			</div>
			<span v-if="item.tradeType == '0'">+ ￥{{ item.tradeInAmount }}</span>
			<span v-else>- ￥{{ item.tradeOutAmount }}</span>
		</mt-cell>		
	</div>
    <div class="no-data" v-if="!w_list.length">您该月份没有收入支出记录</div>

</mt-loadmore>

<mt-datetime-picker
  v-model="pickerVisible" @confirm="handleConfirm"
  type="date" ref="picker" :end-date="new Date()"
  year-format="{value} 年"
  month-format="{value} 月">
</mt-datetime-picker>
</div>
</template>

<script>
import {reqMyWallet, reqMyWalletCount} from '../../api'
import { Indicator } from 'mint-ui'
import util from '../../api/util'
export default {
  data () {
  	return {
  		items: 10,
  		allLoaded: false,
  		pickerVisible: new Date(),
  		year: new Date().getFullYear(),
  		month: new Date().getMonth() + 1,
  		date: new Date().getDate(),
  		w_list: [],
  		month_income: 0,
  		month_disburse: 0,
  		s_params: {
	  		userWxOpenid: JSON.parse( sessionStorage.getItem('ebay-app') ).userWxOpenid,
	  		startDate: '',
	  		endDate: '',
	  		page: 0,
	  		size: 10
  		}
  	}
  },
  methods: {
  	openPicker() {
  		this.$refs.picker.open()
  	},
  	handleConfirm (val) {
		this.s_params.page = 0
		this.w_list = []
		this.getList(val)
  	},
  	formatTime(val) {
  		return util.formatDate.format(new Date(val), 'MM月dd日 hh:mm:ss')
  	},
  	getList(val) {
  		let date = val || new Date()
		let a = util.formatDate.format(date,'yyyy-MM').split('-')
  		let b = new Date(a[0], a[1], 0)
  		this.s_params.startDate = util.formatDate.format(date,'yyyy-MM') + '-01'
  		this.s_params.endDate = util.formatDate.format(b,'yyyy-MM-dd')
		Indicator.open({
		  text: '加载中...',
		  spinnerType: 'fading-circle'
		})
	 	reqMyWallet(this.s_params).then((res) => {
	 		console.log(res)
			if(res.data.data.length) {
				for (let i of res.data.data) {
					this.w_list.push(i)
				}
				this.s_params.page++
			}
			this.year = a[0]
  			this.month = a[1]
			Indicator.close()
			this.$refs.loadmore.onBottomLoaded()
	 	})
	 	reqMyWalletCount(this.s_params).then((res) => {
	 		this.month_income = res.data.data.sIncome
	 		this.month_disburse = res.data.data.zIncome
	 	})
  	}
  },
  mounted() {
  	this.getList()
  	setTimeout(() => {
  		document.getElementById('app').scrollTop = 0
  	}, 500)
  }
}	
</script>

<style lang="scss">
.no-data {
    height: 100px;
    position: absolute;
    width: 100%;
    z-index: 1000;
    background: #cccccc;
    padding-top: 40px;
    text-align: center;
    color: #fff;  
}
.picker-items {
	.picker-slot:nth-child(3) {
		display: none;
	}
}
.order-container {
    padding: 10px 0 10px 120px;
    background-size: 100px 100px !important;
    height: 100px;
    line-height: 34px;
	h3{
		margin: 0;
	    overflow: hidden;
	    text-overflow: ellipsis;
	    display: -webkit-box;
	    -webkit-line-clamp: 2;
	    -webkit-box-orient: vertical;
	    word-wrap: break-word;	
	    word-break: break-all;	
	} 
	h3 {
		margin-top: -6px;
	}
	p {
		-webkit-line-clamp: 1;
		color: gray;
	}
}

</style>