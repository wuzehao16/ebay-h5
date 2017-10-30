<template>
<div class="container">
	<h3>申请成为分销商</h3>
	<div>
		<mt-field class="set-line" label="用户名" placeholder="请输入用户名" v-model="editForm.userName"></mt-field>
		<mt-field class="set-line" label="手机号" placeholder="请输入手机号" type="tel" v-model="editForm.userPhone"></mt-field>
		<!-- <mt-field class="set-line" label="验证码" placeholder="请输入验证码" v-model="captcha">
		  <mt-button type="default" size="small">获取</mt-button>
		</mt-field> -->
		<div class="bt">
			<mt-button type="primary" size="small" @click='addSubmit'>确认</mt-button>
		</div>
	</div>
</div>
</template>

<script>
import {reqUserUpdate} from '../../api'
import { Indicator, Toast } from 'mint-ui'
export default {
  data () {
  	return {
  	  editForm: {
	  	  id: JSON.parse(sessionStorage.getItem('ebay-app')).id,
	  	  userCtype: '1',//1为分销商
	  	  userName: '',
	  	  userPhone: ''
  	  },
  	  captcha: ''
   	  

  	}
  },
  methods: {





  	addSubmit() {

	  	if (this.editForm.userName.match(/^[ ]*$/) ) {
	  		Toast({
	  			message: '请输入用户名',
	  			position: 'top'
	  		})
	  		return false
	  	}
	  	if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(this.editForm.userPhone))) {
	  		Toast({
	  			message: '请输入正确手机号',
	  			position: 'top'
	  		})
	  		return false
	  	}
	  	Indicator.open({
		  text: '提交中...',
		  spinnerType: 'fading-circle'
		})  		
  		reqUserUpdate(this.editForm).then((res) => {
  			Indicator.close()
  			this.$router.push('/user/usercenter')
  		})
  	}
  }
}	
</script>

<style lang="scss" > 
.set-line{
	.mint-cell-wrapper{
		background-position: bottom left!important;
	}
	&:first-child .mint-cell-wrapper {
		background-origin: content-box!important;
	}
}
</style>
<style lang="scss" scoped>
.container{
	min-height: 100vh;
	background: #fff;
	h3 {
		margin: 0;
		padding: 40px 0;
		font-size: 20px;
		text-align: center;
		font-weight: bold;
	}
	> div{
		margin: 0 20px;
	}
	.bt {
		text-align: center;
		margin-top: 10px;
	}
}

</style>
