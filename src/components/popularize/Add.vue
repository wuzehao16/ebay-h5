<template>
<div class="container">
<div class="search">
    <div class="mint-searchbar">
      <div class="mint-searchbar-inner">
        <i class="mintui mintui-search"></i>
        <input
        ref="input"
        @click="visible = true"
        type="search" @keyup.enter='getEbayGoods'
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
</div>

<div class="goods-container" v-if="flag">
	<mt-swipe :auto="5000" :speed="0" class="pre-banner">
	  <mt-swipe-item v-for="i in pro_info.productPic.split('@')" :key="i"> 
      <!-- <div style="display:table;">
         <div  style="display: table-cell;
    vertical-align: middle;
    text-align: center;"> -->
    <div style="text-align:center;">
      <img :src="i" style="max-height:281.25px;">
      </div>
     
    </mt-swipe-item>
	</mt-swipe>


	<form>
		<mt-cell :title="ebay.title"></mt-cell>
		<mt-field v-model="pro_info.productNane"
      placeholder="请输入商品名称" ></mt-field>
		<mt-cell>
      <div slot="title" v-if='ebay.price'>{{ ebay.price.currency + " : " + ebay.price.value}}</div>
    </mt-cell>
		<mt-field  v-model="pro_info.productPrice"
      placeholder="请输入商品价格" 
			style="margin-bottom: 10px;"></mt-field>

		<template v-for="(item, index) in ebay.localizedAspects" >
			<mt-cell :title=" item.name " style="font-size:14px" :id="'id'+index"></mt-cell>
			<mt-field v-model="else_key[index]" :placeholder="'请输入译文'" style="font-size:12px" :id="'input'+index"></mt-field>
			<mt-cell :title=" item.value" style="font-size:14px"></mt-cell>
			<mt-field v-model="else_value[index]" :placeholder="'请输入译文' " 
				style="margin-bottom: 10px;font-size:12px"></mt-field>
		</template>				
    		<div v-html="ebay.description" class="desc-wrap">

        </div>
        <mt-cell title=" 商品介绍 " style="font-size:14px;margin-top:10px;"></mt-cell>
          <textarea v-model="pro_info.productMemo" cols="30" rows="10" style="width:98%"></textarea>
        
	</form>

	  <div class="bt-group">
		  <mt-button  type="primary" @click="proSubmit" class="btn-submit">提审</mt-button>
	  </div>

</div>
<div class="no-product" v-if="show_tip">没有该商品或该商品不能在本平台翻译</div>
</div>
</template>

<script>
import {reqSellerProductSave, reqProductDetail, reqEbayGoods} from '../../api'
import { Toast, Indicator } from 'mint-ui'
export default {
  data () {
  	return {
  		visible: false,
  		currentValue: '',
  		flag: false,
      show_tip: false,
      else_key: [],
      else_value: [],
      isEdit: false,
      productId: '',

      ebay: {},
      pro_info: {
        ebayItemid: '',
        auditStatus: '0',//待审核
        productStatus: '下架',
        // userWxOpenid: JSON.parse( sessionStorage.getItem('ebay-app') ).userWxOpenid,
        userWxOpenid:1,
        productNane: '',
        productPic: '',//以@连接
        productPrice: '',//post时要求number类型
        productIcon: '',
        items: [],
        productMemo:"",
        productUsd: ''
      },
  	}
  },
  methods: {
    proSubmit () {
      console.log()
      if (this.pro_info.productNane.match(/^[ ]*$/) ){
        Toast('请输入商品名称')
        return false
      }
      if (this.pro_info.productPrice == "") {
        Toast('请输入商品价格')
        return false
      }
      for (let j = 1; j <= this.No; j++) {
        if (!this.else_key[j] || this.else_key[j].match(/^[ ]*$/) ) {
          Toast('请输入参数' + (j + 1) + '名称')
          return false
        }        
        if (!this.else_value[j] || this.else_value[j].match(/^[ ]*$/) ) {
          Toast('请输入参数' + (j + 1) + '内容')
          return false
        }
      }
      for (let i in this.else_key) {
        if (!this.isEdit) {
          this.pro_info.items.push({
            attrName: this.else_key[i],
            attrValue: this.else_value[i]
          })          
        } else {
          this.pro_info.items[i].attrName = this.else_key[i]
          this.pro_info.items[i].attrValue = this.else_value[i]
        }
      }
      this.pro_info.productPrice = Number.parseFloat(this.pro_info.productPrice)
      this.isEdit ? this.pro_info.productId = this.productId : ''
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      console.log('pro_info:', Object.assign({}, this.pro_info))
      reqSellerProductSave(this.pro_info).then((res) => {
        Indicator.close()
        if (res.data.code == 0) {
          let instance = Toast('提审成功')
          setTimeout(() => {
            instance.close();
            this.$router.push('/popularize/list')
          }, 2000)          
        }
      })
    },
  	backList () {
  		this.$router.push('/popularize/list')
  	},
  	getEbayGoods() {
      if (this.currentValue.match(/^[ ]*$/)) {
        Toast("请输入Ebay商品ID")
      } else {
        Indicator.open({
          spinnerType: 'fading-circle'
        })        
        let itemId = this.currentValue
        reqEbayGoods({itemId}).then((res) => {
          console.log(res)
          if (res.data.errors) {
            this.show_tip = true
          } else if (res.data.itemId) {
            this.ebay = res.data
            this.flag = true
            // console.log('ebay', Object.assign({} ,this.ebay))


            this.pro_info.productIcon = this.ebay.image.imageUrl
            this.pro_info.productUsd = this.ebay.price.value
            let imgArr = []
            imgArr.push(this.pro_info.productIcon)
            for (let i of this.ebay.additionalImages) {
              imgArr.push(i.imageUrl)
            }
            this.pro_info.productPic = imgArr.join("@")
            this.pro_info.ebayItemid = this.currentValue
          }
          Indicator.close()
        })
          .catch(err => { Indicator.close() })
      }

  	}

  },
  watch: {
  	currentValue(a) {
      this.show_tip = false
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
    this.productId = this.$route.params.productId
    if (this.productId) {
      this.currentValue = this.$route.params.ebayItemid
      this.getEbayGoods()
      reqProductDetail({productId: this.productId}).then((res) => {
          let p = res.data.data
          this.isEdit = true
          this.pro_info = {
            auditStatus: '0',//待审核
            productStatus: '下架',
            userWxOpenid: JSON.parse( sessionStorage.getItem('ebay-app') ).userWxOpenid,
            productNane: p.name,
            productPic: (p.pic ? p.pic.join('@') : ''),
            productPrice: p.price,
            productIcon: p.icon,
            items: p.productAttr,
            productUsd: p.productUsd
          }
          for (let i in p.productAttr) {
            this.else_key[i] = p.productAttr[i].attrName
            this.else_value[i] = p.productAttr[i].attrValue
          }
      })
    }
  }
}
        //获取页面高度
        var clientHeight = document.body.clientHeight;
        //设置监听聚焦事件
        var focusElem;
        document.body.addEventListener("focus", function(e) {
            focusElem = e.target
        }, true);
        //设置监听窗口变化时间
        window.addEventListener("resize", function() {
          console.log(document.body.clientHeight)
            if(focusElem&& document.body.clientHeight < clientHeight) {
                //使用scrollIntoView方法来控制输入框
                focusElem.scrollIntoView(false);
            }
        });
</script>

<style lang='scss'>
.container{
  .search{
    flex: 1 0 auto;
  }
}
.desc-wrap {
  table, img {
    width: 100%!important;
  }
}
.no-product{
    padding-top: 20px;
    text-align: center;
    color: #9E9E9E;  
}
.container {
	margin-bottom: 44px;
	.bt-group{
		.btn-submit{
      width: 100%;
      border-radius: 0;
    }
	}
}
.mint-search {
	height: auto;
}

.pre-banner {
	height: 281.25px;
  background-color: #fff;
  li {
    height: 100%;
    width: 100%;
    list-style-type: none;
    background-size: contain!important;
  }
}

</style>
