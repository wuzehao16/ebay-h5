<template>
<div class="container">

<mt-cell :title='year  + "年" +  month  + "月"' class="time-title">
	<div @click="openPicker">
		<i class="iconfont icon-calendar" style="font-size: 26px;"></i>
	</div>
</mt-cell>
<mt-loadmore :auto-fill="false" :bottom-method="getList" 
	:bottom-all-loaded="allLoaded" ref="loadmore" class="client-more">
	<div>
		<mt-cell value="7月28日 18:22" v-for="item in items" :key="item">
			<div slot="title" class="client-container">
				<p>啷里个啷啷中国中啷啷中国中啷啷中国中中中{{ item }}</p>
				<div class="img-box" :style="{'background': 'url(' + 'xxfffdd' + ') no-repeat center center,url(' + require('../../assets/test.png') + ')'}">			
				</div>				

			</div>
		</mt-cell> 
	</div>
    <div class="no-data" v-if="no_data_tip">您该月没有客户</div>

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
import { Indicator } from 'mint-ui'
import {reqMyCustomerList} from '../../api'
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
  		s_params: {
	  		userWxOpenid: JSON.parse( sessionStorage.getItem('ebay-app') ).userWxOpenid,
	  		startDate: '',
	  		endDate: '',
	  		page: 0,
	  		size: 10
  		},
  		w_list: [],
  		chosenDate: new Date(),
  		no_data_tip: false
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
  		let date = this.chosenDate || new Date()
		let a = util.formatDate.format(date,'yyyy-MM').split('-')
  		let b = new Date(a[0], a[1], 0)
  		this.s_params.startDate = util.formatDate.format(date,'yyyy-MM') + '-01'
  		this.s_params.endDate = util.formatDate.format(b,'yyyy-MM-dd')
  		this.no_data_tip = false
		Indicator.open({
		  text: '加载中...',
		  spinnerType: 'fading-circle'
		})
	 	reqMyCustomerList(this.s_params).then((res) => {
	 		console.log(res)
			if(res.data.data.length) {
				for (let i of res.data.data) {
					this.w_list.push(i)
				}
				this.s_params.page++
			}
			this.w_list.length == 0 ? this.no_data_tip = true : ''
			this.year = a[0]
  			this.month = a[1]
			Indicator.close()
			if (this.$refs.loadmore.bottomStatus == 'loading') {
				this.$refs.loadmore.onBottomLoaded()
			}			
	 	})
  	}  	
  },
  mounted() {
  	this.getList()
  }
}	
</script>

<style lang="scss">
.client-more {
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
.time-title {
	background: #f5f5f5;
	.mint-cell-title {
		padding: 14px 0;
	}
}
.picker-items {
	.picker-slot:nth-child(3) {
		display: none;
	}
}
.client-container {
    padding: 10px 0 10px 66px;
    height: 60px;

    display: flex;
    align-items: center;
	p {
		margin: 0;
	    overflow: hidden;
	    text-overflow: ellipsis;
	    display: -webkit-box;
	    -webkit-line-clamp: 1;
	    -webkit-box-orient: vertical;
	    word-wrap: break-word;	
	    word-break: break-all;	
	}
	.img-box {
		background-size: cover!important;
	    width: 50px;
	    height: 50px;
	    position: absolute;
	    left: 10px;
	    top: 16px;
	    border-radius: 50%;		
	}
}

</style>