<template>
<div class="container">
<div class="search">
    <div class="mint-searchbar">
      <div class="mint-searchbar-inner">
        <i class="mintui mintui-search"></i>
        <input
        ref="input"
        @click="visible = true"
        type="search" @keyup.enter='loadResult'
        v-model="currentValue"
        placeholder="请输入ItemId"
        class="mint-searchbar-core">
      </div>
      <a
        class="mint-searchbar-cancel"
        @click="visible = false, currentValue = ''"
        v-show="visible">取消
      </a>
    </div>
    <div :class="{'search-list': result }">
	    <mt-cell v-for="item in result" :key='item' v-if='result'>
		    <div slot='title' @click="chooseResult(item)">2346502415{{ item }}</div>
		</mt-cell>
	</div>
</div>

<div class="goods-container" v-if="flag">
	<mt-swipe :auto="5000" :speed="0" class="pre-banner">
	  <mt-swipe-item>1</mt-swipe-item>
	  <mt-swipe-item>2</mt-swipe-item>
	  <mt-swipe-item>3ff</mt-swipe-item>
	</mt-swipe>


	<form>
		<mt-cell title="xxuufj  kjaouj kjlkfoiul kjluaofasl jljlkjas."></mt-cell>
		<mt-field v-model="pro_info.productNane" label="商品名称：" 
      placeholder="请输入商品名称" ></mt-field>

		<mt-cell title="xxxc $9999.23"></mt-cell>
		<mt-field  v-model="pro_info.productPrice" label="商品价格：" 
      placeholder="请输入商品价格" 
			style="margin-bottom: 10px;"></mt-field>
		<template v-for="item in No" >
			<mt-cell :title="'参数' + item + ': aouj kjlkfoiul kjluaofasl jljlkjas.' "></mt-cell>
			<mt-field v-model="else_key[item]" :placeholder="'请翻译参数' + item" ></mt-field>
			<mt-cell :title="'参数' + item + '内容: xx uuo ljlu lkj lkj ou olk.' "></mt-cell>
			<mt-field v-model="else_value[item]" :placeholder="'请翻译参数' + item + '内容'" 
				style="margin-bottom: 10px;"></mt-field>	
		</template>						
	</form>

	<mt-tabbar :fixed="true">
	  <div class="bt-group">
		  <mt-button size="small" type="primary" @click="goPreview">预览</mt-button>
		  <mt-button size="small" type="primary" @click="proSubmit">提审</mt-button>
		  <mt-button size="small" type="primary" @click="backList">返回列表</mt-button>
	  </div>
	</mt-tabbar>

</div>
<div class="no-product" v-if="show_tip">没有该商品，请确认ItemId是否正确</div>





</div>
</template>

<script>
import {reqSellerProductSave, reqProductDetail} from '../../api'
import { Toast, Indicator } from 'mint-ui'
export default {
  data () {
  	return {
  		result: 0,
  		visible: false,
  		currentValue: '',
  		flag: false,
      show_tip: false,
      else_key: [],
      else_value: [],
      No: 3,
      isEdit: false,
      productId: '',

      pro_info: {
        auditStatus: '0',//待审核
        userWxOpenid: JSON.parse( sessionStorage.getItem('ebay-app') ).userWxOpenid,
        productNane: '',
        productPic: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1193322613,697363706&fm=27&gp=0.jpg',
        productPrice: '',//post时要求number类型
        productIcon: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1193322613,697363706&fm=27&gp=0.jpg',
        items: []
      },
      pro_info_bak: {},
      tip_flag: ''

  	}
  },
  methods: {
    proSubmit () {
      console.log()
      if (this.pro_info.productNane.match(/^[ ]*$/) ){
        Toast('请输入用户名')
        return false
      }
      if (this.pro_info.productPrice == "") {
        Toast('请输入商品价格')
        return false
      }
      for (let j = 1; j <= this.No; j++) {
        if (!this.else_key[j] || this.else_key[j].match(/^[ ]*$/) ) {
          Toast('请输入参数' + j + '名称')
          return false
        }        
        if (!this.else_value[j] || this.else_value[j].match(/^[ ]*$/) ) {
          Toast('请输入参数' + j + '内容')
          return false
        }
      }
      for (let i in this.else_key) {
        this.pro_info.items.push({
          attrName: this.else_key[i],
          attrValue: this.else_value[i]
        })
      }
      this.pro_info.productPrice = Number.parseFloat(this.pro_info.productPrice)
      this.isEdit ? this.pro_info.productId = this.productId : ''

console.log(this.pro_info.productPrice)
      Indicator.open({
        spinnerType: 'fading-circle'
      })

      reqSellerProductSave(this.pro_info).then((res) => {
        Indicator.close()
        let instance = Toast('提审成功')
        setTimeout(() => {
          instance.close();
          this.$router.push('/popularize/list')
        }, 2000)
      })


    },
  	backList () {
  		this.$router.push('/popularize/list')
  	},
  	goPreview() {
  		this.$router.push('/popularize/preview')
  	},
  	chooseResult (val) {
  		this.currentValue = val
  		this.result = 0
  		this.flag = true
  	},
  	loadResult() {
  		// this.currentValue ? this.result = 60 : alert("请输入ItemId")


      if(!this.currentValue) {
        alert("请输入ItemId")
      } else {
        if(this.currentValue == 'none') {
          //假设没有该商品
          this.show_tip = true
          this.flag = false
        } else {
          //假设有商品（数组形式）
          this.show_tip = false
          this.pro_info = Object.assign({}, this.pro_info_bak)
          this.result = 6
          
        }





      }
  		
  	}

  },
  watch: {
  	currentValue() {
  		this.currentValue ? "" : this.result = 0
      if (!this.currentValue) {
        this.result = 0
        this.show_tip = false
      }
  	},
  	result() {
  		let app = document.getElementById('app')
  		this.result ? app.style.overflow = 'hidden' : app.setAttribute('style','overflow:scroll;-webkit-overflow-scrolling: touch;')
  	},
    'pro_info.productPrice': {
        handler: function(a, b) {
          a = a + ''
          if(!/^(([1-9]\d*)|((0.\d{1,2}|[1-9]\d*.\d{1,2})))$/.test(a) ) {
              //清除"数字"和"."以外的字符
              a = a.replace(/[^\d.]/g,"")
              //验证第一个字符是数字而不是
              a = a.replace(/^\./g,"")
              //只保留第一个. 清除多余的
              a = a.replace(/\.{2,}/g,".")
              a = a.replace(".","$#$").replace(/\./g,"").replace("$#$",".")
              //只能输入两个小数
              a = a.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')
              this.$nextTick(function(){
                this.pro_info.productPrice = a
              })
          }
        },
        deep: true
    }
  },
  mounted () {
    this.pro_info_bak = Object.assign({}, this.pro_info)

    this.productId = this.$route.params.productId
    if (this.productId) {
      //测试用，设productId = 77
      this.productId = 77
      reqProductDetail({productId: this.productId}).then((res) => {
          let p = res.data.data
          this.isEdit = true
          this.flag = true
          this.No = p.productAttr.length
          this.pro_info = {
            auditStatus: '0',//待审核
            userWxOpenid: JSON.parse( sessionStorage.getItem('ebay-app') ).userWxOpenid,
            productNane: p.name,
            productPic: p.pic.join('@'),
            productPrice: p.price,
            productIcon: p.icon,
            items: []
          }
          for (let i in p.productAttr) {
            let j = Number.parseInt(i) + 1
            this.else_key[j] = p.productAttr[i].attrName
            this.else_value[j] = p.productAttr[i].attrValue
          }
          

      })
    }






  }
}
</script>

<style lang='scss'>
.container{
  /*display: flex;*/
  .search{
    flex: 1 0 auto;
  }
}
.no-product{
    padding-top: 20px;
    text-align: center;
    color: #fff;  
}
.container {
	margin-bottom: 44px;
	.bt-group{
		margin: 0 auto;
	}
	.search-list{
	    position: absolute;
	    z-index: 100;
	    width: 100%;
	    height: 100vh;
	    top: 0;
	    margin: 52px 0 -52px 0;
	    background: rgba(51, 51, 51, .66);
	    overflow: scroll;
	    -webkit-overflow-scrolling: touch;
	}
}
.mint-search {
	height: auto;
}

.pre-banner {
	height: 200px;
	background: red;	
	.mint-swipe-item:nth-child(odd) {
		background: blue
	}
}

</style>
