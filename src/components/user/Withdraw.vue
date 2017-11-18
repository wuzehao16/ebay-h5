<template>
<div class="container">	
	<div class="title">申请提现</div>
	<p>提现金额</p>
	<a class="mint-cell mint-field w-input">
	    <div class="mint-cell-left"></div>
	    <div class="mint-cell-wrapper">
	        <div class="mint-cell-title">
	            <span class="mint-cell-text">￥</span>
	        </div>
	        <div class="mint-cell-value">
	            <input placeholder="请输入提现金额" 
	            	v-model="amount" class="mint-field-core">
	        </div>
	    </div>
	</a>
	<p class='w-tip'>当前零钱余额{{ user.userBalance }}元，<i @click="amount = '' + user.userBalance">全部提现</i></p>
	<mt-button type="default" size="large" class='confirm' @click="submit">确认</mt-button>
	<div class="w-tip">24小时内到账</div>
</div>
</template>

<script>
import {reqUserInfo, reqWithdrawCreate} from '../../api'
import { Toast, Indicator } from 'mint-ui'
export default {
  data () {
  	return {
  	  amount: '',
  	  user: {
  	  	userBalance: 0
  	  }
  	}
  },
  methods: {
  	submit () {
  		if (this.amount == '') {
  			Toast({
  				message: "请输入提现金额!",
  				position: 'bottom'
  			})
  			return false
  		}
  		if (this.amount == '0') {
  			Toast({
  				message: '您的余额为0，不能发起提现请求！',
  				position: 'bottom'
  			})
  			return false
  		}
  		if(Number.parseInt(this.amount) > Number.parseFloat(this.user.userBalance)) {
			Toast({
			  message: '提现金额不能大于余额！',
			  position: 'bottom'
			})
			return false		
  		}  

	    Indicator.open({
	      spinnerType: "fading-circle"
	    })
  		reqWithdrawCreate({
  			userId: this.user.id,
  			drawAmount: Number.parseFloat(this.amount)
  		}).then((res) => {
  			Indicator.close()
  			if (res.data.code == 0) {
				Toast({
				  message: '已发起提现',
				  position: 'bottom'
				})
  			} else {
  				Toast(res.data.msg)
  			}
  		}).catch(err => {
  			Indicator.close()
  		})
  	},
  	getNewInfo (id) {
	  	reqUserInfo({id}).then((res) => {
	  		if (res.data.code == 0) {
	  			this.user = res.data.data
	  		} else {
	  			Toast(res.data.msg)
	  		}
	  	}).catch((err) => {})  		
  	}
  },
  watch: {
  	amount(a, b) {
	    //清除"数字"和"."以外的字符
	    this.amount = this.amount.replace(/[^\d.]/g,"")
	    //验证第一个字符是数字而不是
	    this.amount = this.amount.replace(/^\./g,"")
	    //只保留第一个. 清除多余的
	    this.amount = this.amount.replace(/\.{2,}/g,".")
	    this.amount = this.amount.replace(".","$#$").replace(/\./g,"").replace("$#$",".")
	    //只能输入两个小数
	    this.amount = this.amount.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')
  	}
  },
  activated() {
  	let id = JSON.parse( sessionStorage.getItem('ebay-app') ).id
  	if (id) {
  		this.getNewInfo(id)
  	} else {
  		this.$router.push('/product/list')
  	}
  },
  deactivated() {
  	this.amount = ''
  }
}	
</script>

<style lang="scss" scoped>
.container {
	background: #fff;
	text-align: center;
	padding: 40px;
	box-sizing: border-box;
	.title {
		padding: 20px;
		font-size: 30px;
	}
	p {
		text-align: left;
	}
	.confirm {
		color: white;
	    background: #4cbb4c;
	    margin: 26px auto;
	}
	.w-tip {
		color: gray;
		i {
			color: #2196F3;
		}
	}
	.w-input {
    	border-bottom: 1px solid #e8e4e4;
    	.mint-cell-wrapper{
    		background: none;
    	}
	}
	.mint-field .mint-cell-title {
		width: 30px;
	}
}
</style>
