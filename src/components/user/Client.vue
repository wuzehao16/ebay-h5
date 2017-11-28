<template>
<div class="container">

<mt-cell :title='year  + "年" +  month  + "月"' class="time-title">
	<div @click="openPicker">
		<i class="iconfont icon-calendar" style="font-size: 26px;"></i>
	</div>
</mt-cell>
<mt-loadmore :auto-fill="false" :bottom-method="getList" 
	:bottom-all-loaded="allLoaded" ref="loadmore" class="client-more">
	<div class="client-wrap">
		<mt-cell :value="formatTime(c.created)" v-for="c in cList" :key="c.userWxOpenid">
			<div slot="title" class="client-container">
				<p>{{ c.userWxName }}</p>
				<div class="img-box" :style="{'background': 'url(' + c.userWxPicture + ') no-repeat center center,url(' + require('../../assets/test.png') + ')'}">			
				</div>
			</div>
		</mt-cell> 
	</div>
</mt-loadmore>
    <div class="no-data" v-if="no_data_tip">您该月没有客户</div>


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
  		filters: {
	  		userWxOpenid: '',
	  		startDate: '',
	  		endDate: '',
	  		page: 0,
	  		size: 10
  		},
  		cList: [],
  		chosenDate: new Date(),
  		no_data_tip: false
  	}
  },
  methods: {
  	openPicker() {
  		this.$refs.picker.open()
  	},
  	handleConfirm (val) {
		this.filters.page = 0
		this.cList = []
		this.chosenDate = val		
		this.getList(val)
  	},
  	formatTime(val) {
  		let d = ''
  		if (val) {
			d =	util.formatDate.format(new Date(val), 'MM月dd日 hh:mm') 
  		}
  		return d
  	},
  	getList() {
  		let date = this.chosenDate || new Date()
		let a = util.formatDate.format(date,'yyyy-MM').split('-')
  		let b = new Date(a[0], a[1], 0)
  		this.filters.startDate = util.formatDate.format(date,'yyyy-MM') + '-01'
  		this.filters.endDate = util.formatDate.format(b,'yyyy-MM-dd')
  		this.no_data_tip = false
		Indicator.open({
		  text: '加载中...',
		  spinnerType: 'fading-circle'
		})
	 	reqMyCustomerList(this.filters).then((res) => {
	 		console.log(res)
			if(res.data.data.length) {
				for (let i of res.data.data) {
					this.cList.push(i)
				}
				this.filters.page++
			}
			this.cList.length == 0 ? this.no_data_tip = true : ''
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
  	this.filters.userWxOpenid = JSON.parse( sessionStorage.getItem('ebay-app') ).userWxOpenid
  	this.getList()
  }
}	
</script>

<style lang="scss">
.client-more {
	margin: 50px 0;
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
	height: 48px;
	background: #f5f5f5;
	position: fixed;
	top: 0;
	width: 100%;
	z-index: 1000;
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