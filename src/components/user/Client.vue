<template>
<div class="container">

<mt-cell :title='year  + "年" +  month  + "月"' style="background:#e4e2e2;">
	<div @click="openPicker">
		<i class="iconfont icon-calendar"></i>
	</div>
</mt-cell>
<mt-loadmore :auto-fill="false" :bottom-method="getList" 
	:bottom-all-loaded="allLoaded" ref="loadmore">
	<div>
		<mt-cell value="7月28日 18:22" v-for="item in items" :key="item">
			<div slot="title" class="client-container">
				<p>啷里个啷啷中国中啷啷中国中啷啷中国中中中{{ item }}</p>
				<img :src=" require('../../assets/test.png') ">
			</div>
		</mt-cell> 
	</div>
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
  		w_list: []	
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
	 	reqMyCustomerList(this.s_params).then((res) => {
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
  	}  	
  }
}	
</script>

<style lang="scss">
.picker-items {
	.picker-slot:nth-child(3) {
		display: none;
	}
}
.client-container {
    padding: 10px 0 10px 80px;
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
	img {
	    width: 60px;
	    height: 60px;
	    position: absolute;
	    left: 10px;
	    top: 10px;
	    border-radius: 50%;		
	}
}

</style>