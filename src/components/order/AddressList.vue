<template>
<div class="container">

<mt-cell title="选择地址：">

</mt-cell>

<mt-cell v-for='item in addressList' class="address-cell" :key="item.id">
	<div slot="title">
		<div class="add-list">
			<input type="radio" v-model="radio_value" :value="item.cneeAddress"
				 class="mint-radio-input" @change="getSelected(item)" >  
			<span class="mint-radio-core"></span>
		</div>
		<span>{{ item.cneeAddress.replace(/@/g, "") }}</span>
	</div>
	<div @click="editAddress(item)">
		<i class="iconfont icon-edit" style="font-size: 24px;"></i>
	</div>
</mt-cell>

	<mt-tabbar :fixed="true">
	  <mt-button type="default" size="large" @click="makeSure">确认选择
	  </mt-button>
	  <mt-button type="primary" size="large" @click="addNew">新增地址
	  	<i class="iconfont icon-add"></i>
	  </mt-button>
	</mt-tabbar>

</div>
</template>
<style scoped>
.container {
	margin-bottom: 44px;
}
</style>
<style lang="scss">

.address-cell {
	padding: 10px 0;
}
.add-list {
	display: inline;
	position: relative;
	float: left;
	input {
	    display: inline;
	    position: absolute;
	    z-index: 1000;
	    width: 20px;
	    height: 20px;
	    margin: 0;
	    opacity: 0;		
	}
	+ span {
		display: block;
    	margin: 0 10px 0 30px;
    	line-height: 22px;
	}
}
</style>


<script>
import {reqAddressList} from '../../api'
import { Toast } from 'mint-ui'
export default {
	data () {
		return {
			page: 0,
			radio_value: '',
			addressList: [],
			seleceted: {}
		}
	},
	methods: {
		getSelected(val) {
			this.seleceted = val
			console.log(val)
		},
		addNew() {
			this.$router.push('/order/address')
		},
		editAddress(address) {
			this.$router.push({
				name: 'Address',
				params: {
					address_info: address
				}
			})
		},
		getList () {
			let obj = {
				userId: JSON.parse(sessionStorage.getItem('ebay-app')).id,
				page: this.page,
				size: 100
			}
			reqAddressList(obj).then((res) => {
				this.addressList = res.data.data.content
			})
		},
		makeSure() {
			if (this.radio_value) {
				this.$router.push({
					name: 'SettleOrder',
					params: {
						receiver_info: this.seleceted
					}
				})
			} else {
		        Toast({
		          message: '请选择地址'
		        })
			}
		}
	},
	mounted () {
		this.getList()
	}
}


</script>
