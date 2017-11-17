<template>
<div class="container">
	<h3>申请成为卖家</h3>
	<div>
		<mt-field class="set-line" label="用户名" placeholder="请输入用户名"
       v-model="editForm.userName"></mt-field>
		<mt-field class="set-line" label="手机号" placeholder="请输入手机号" type="tel" 
        v-model="editForm.userPhone"></mt-field>
		<mt-field class="set-line" label="身份证"  v-model="editForm.createdby"></mt-field>
		<mt-field class="set-line" label="现居地址"  v-model="editForm.userAddr"></mt-field>
		<ul>
      <li>1.请输入正确的手机号</li>
      <li>2.我们会在3个工作日内审核完成</li>
      <li>3.申请成为卖家后你可以新增发布自己的商品</li>
      
    </ul>
		<!-- <mt-field class="set-line" label="验证码" placeholder="请输入验证码" v-model="captcha">
		  <mt-button type="default" size="small">获取</mt-button>
		</mt-field> -->
		<div class="bt">
			<mt-button type="primary"  @click='addSubmit'>确认</mt-button>
		</div>
	</div>
</div>
</template>

<script>
import { reqUserUpdate, reqUserInfo } from "../../api"
import { Indicator, Toast } from "mint-ui"
export default {
  data() {
    return {
      editForm: {
        id: "",
        userCtype: "1", //1为分销商
        userName: "",
        userPhone: "",
        createdby: "",
        userAddr: ""
      },
      captcha: ""
    };
  },
  methods: {
    addSubmit() {
      if (this.editForm.userName.match(/^[ ]*$/)) {
        Toast({
          message: "请输入用户名",
          position: "top"
        });
        return false;
      }
      if (!/^1[3|4|5|8]\d{9}$/.test(this.editForm.userPhone)) {
        Toast({
          message: "请输入正确手机号",
          position: "top"
        });
        return false;
      }
      Indicator.open({
        text: "提交中...",
        spinnerType: "fading-circle"
      });
      reqUserUpdate(this.editForm).then(res => {
        Indicator.close();
        this.$router.push("/user/usercenter");
      });
    }

  },
  mounted() {
    this.$nextTick(function () {
      setTimeout(() => {
        this.editForm.id = JSON.parse(sessionStorage.getItem("ebay-app")).id
        Indicator.open({
          text: "检测会员状态...",
          spinnerType: "fading-circle"
        })
        reqUserInfo({id: this.editForm.id}).then((res) => {
          Indicator.close()
          if (res.data.code == 0 && res.data.data.userCtype == '1') {
              let instance = Toast({
                message: '您已是会员，系统为您跳转首页！',
                position: 'bottom'
              })
              setTimeout(() => {
                instance.close()
                this.$router.push('/product/list')
              }, 3000)
          } else if (res.data.code != 0) {
            Toast(res.data.msg)
          }
        })
      }, 0)
    })
  }
};
</script>

<style lang="scss" >
.set-line {
  .mint-cell-wrapper {
    background-position: bottom left !important;
  }
  &:first-child .mint-cell-wrapper {
    background-origin: content-box !important;
  }
}
</style>
<style lang="scss" scoped>
.container {
  ul{
    font-size:14px;
    margin:20px 0 0 10px;
    li{
      list-style: none;
      line-height: 24px;
    }
  }
  min-height: 100vh;
  background: #fff;
	color:#999;
  h3 {
    margin: 0;
    padding: 40px 0;
    font-size: 20px;
    text-align: center;
    font-weight: bold;
  }
  > div {
    margin: 0 20px;
  }
  .bt {
    button {
      width: 100%;
    }
    text-align: center;
    margin-top: 30px;
  }
}
</style>
