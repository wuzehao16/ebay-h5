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
	:bottom-all-loaded="allLoaded" ref="loadmore" class="wallet-more">
	<div>
		<mt-cell v-for="item in w_list" :key="item.created" class="order-container">
			<div slot="title">
				<h3>{{ item.product?item.product.productNane:'用户提现' }}</h3>
				<p>{{ formatTime(item.created) }}</p>
				<div class="img-box">
					<img :src="item.product?item.product.productIcon:null" 
						:onerror="defaultLogo">					
				</div>

			</div>
			<span v-if="item.tradeType == '0'">+ {{ item.tradeInAmount }}</span>
			<span v-else>- {{ item.tradeOutAmount }}</span>
		</mt-cell>		
	</div>
    <div class="no-data" v-if="no_data_tip">您该月份没有收入支出记录</div>
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
  		},
  		chosenDate: new Date(),
  		no_data_tip: false,
  		defaultLogo: 'this.src="' + require('../../assets/wallet.jpg') + '"' 
  	}
  },
  methods: {
  	openPicker() {
  		this.$refs.picker.open()
  	},
  	handleConfirm (val) {
		this.s_params.page = 0
		this.w_list = []
		this.chosenDate = val
		this.getList(val)
  	},
  	formatTime(val) {
  		return util.formatDate.format(new Date(val), 'MM月dd日 hh:mm:ss')
  	},
  	getList() {
  		let date = this.chosenDate
		let a = util.formatDate.format(date,'yyyy-MM').split('-')
  		let b = new Date(a[0], a[1], 0)
  		this.s_params.startDate = util.formatDate.format(date,'yyyy-MM') + '-01'
  		this.s_params.endDate = util.formatDate.format(b,'yyyy-MM-dd')

  		this.no_data_tip = false
		Indicator.open({
		  text: '加载中...',
		  spinnerType: 'fading-circle'
		})
	 	reqMyWallet(this.s_params).then((res) => {
			if(res.data.data.length) {
				for (let i of res.data.data) {
					this.w_list.push(i)	
				}
				this.s_params.page++
			}
			this.year = a[0]
  			this.month = a[1]
			Indicator.close()
			this.w_list.length == 0 ? this.no_data_tip = true : ''
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
.wallet-more {
	.mint-loadmore-bottom {
		display: none;
	}
}
.no-data {
    height: 100px;
    position: absolute;
    width: 100%;
    z-index: 1000;
    background: #eeeeee;
    padding-top: 40px;
    text-align: center;
    color: #999;  
}
.picker-items {
	.picker-slot:nth-child(3) {
		display: none;
	}
}
.order-container {
    padding: 10px 0 10px 80px;
    .mint-cell-wrapper {
    	align-items: baseline;
    }
    .mint-cell-value {
    	span {
    		font-size: 18px;
    		color: black;
    	}
    }
	h3{
		margin: 0;
	    overflow: hidden;
	    text-overflow: ellipsis;
	    display: -webkit-box;
	    -webkit-line-clamp: 1;
	    -webkit-box-orient: vertical;
	    word-wrap: break-word;	
	    word-break: break-all;	
	    padding-right: 6px;
	}
	p {
		-webkit-line-clamp: 1;
		color: gray;
		font-size: 14px;
	}
	.img-box {
	    width: 60px;
	    height: 60px;
	    position: absolute;
	    left: 10px;
	    top: 10px;
	    overflow: hidden;
	    border-radius: 50%;		
	}
	img {
	    width: 60px;
	    transform: translateY(-50%);
	    position: relative;
	    top: 50%;
	}
}

</style>