<template>
<div class="container">

<mt-cell title="收货地址：" >

</mt-cell>
<mt-cell v-for='item in addressList' class="address-cell" :key="item.id">
	<div slot="title" class="add-list">
		<div>
			<input type="radio" v-model="radio_value" :value="item.cneeAddress"
				 class="mint-radio-input" @change="getSelected(item)" >  
			<span class="mint-radio-core" @click="getSelected(item)"></span>
		</div>
		<span>{{item.cneeName}}</span>
		<span>{{item.cneePhone}}</span>
		<span @click="getSelected(item)">{{ item.cneeAddress.replace(/@/g, "") }}</span>
	</div>
	<div @click="editAddress(item)">
		<i class="iconfont icon-edit" style="font-size: 24px;"></i>
	</div>
</mt-cell>

	<mt-tabbar :fixed="true">
	  <!-- <mt-button type="default" size="large" @click="makeSure">确认选择
	  </mt-button> -->
	  <mt-button type="primary" size="large" @click="addNew">新增地址
	  	<i class="iconfont icon-add"></i>
	  </mt-button>
	</mt-tabbar>

</div>
</template>
<style lang="scss"scoped>
.container {
  margin-bottom: 44px;
}
.address-cell {
  padding: 10px 0;
}
.address-cell:nth-child(2){
	.mint-cell-title{
		.add-list{
			padding-top: 10px;
		}
	}
}
.add-list {
	div{
		display: inline;
		position: relative;
		float: left;
		top: 16px;
		input {
			display: inline;
			position: absolute;
			z-index: 1000;
			width: 20px;
			height: 20px;
			margin: 0;
			opacity: 0;
		}
		span{
			display: flex;
			align-items:center;
		}
	}
	span{
			font-size: 14px;
			padding-left: 5px;
	}
	span:nth-child(4){
		    display: block;
    color: #999;
    padding-left: 25px;
    padding-top: 5px;
	}
}

</style>


<script>
import { reqAddressList } from "../../api";
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      page: 0,
      radio_value: "",
      addressList: [],
      seleceted: {}
    };
  },
  methods: {
    getSelected(val) {
      this.seleceted = val;
      this.$router.push({
        name: "SettleOrder",
        params: {
          receiver_info: this.seleceted
        }
      });
      console.log(val);
    },
    addNew() {
      this.$router.push("/order/address");
    },
    editAddress(address) {
      this.$router.push({
        name: "Address",
        params: {
          address_info: address
        }
      });
    },
    getList() {
      let obj = {
        userId: JSON.parse(sessionStorage.getItem("ebay-app")).id,
        page: this.page,
        size: 100
      };
      reqAddressList(obj).then(res => {
        this.addressList = res.data.data.content;
      });
    }
  },
  mounted() {
		this.getList();
		console.log(this.seleceted)
  }
};
</script>
