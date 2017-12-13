<template>
  <div class="container">
    <div class="search">
      <div class="mint-searchbar">
        <div class="mint-searchbar-inner">
          <i class="mintui mintui-search"></i>
          <input ref="input" @click="visible = true" type="search" @keyup.enter='getEbayGoods' v-model="currentValue" placeholder="请输入ItemId" class="mint-searchbar-core">
        </div>
        <a class="mint-searchbar-cancel" @click="visible = false, currentValue = ''" v-show="visible">取消
      </a>
      </div>
    </div>
    <input type="text" v-focus='hideKeyboard' @blur="hideKeyboard = false" readonly class="input-null">
    <div class="goods-container" v-if="flag">
      <mt-swipe :auto="5000" :speed="0" class="pre-banner">
        <mt-swipe-item v-for="i in pro_info.productPic.split('@')" :key="i">
          <div style="text-align:center;">
            <img :src="i" style="max-height:281.25px;">
          </div>
        </mt-swipe-item>
      </mt-swipe>
      <form>
        <mt-cell :title="ebay.title"></mt-cell>
        <mt-field v-model="pro_info.productNane" placeholder="请输入商品名称"></mt-field>
        <mt-cell>
          <div slot="title" v-if='ebay.price'>{{ ebay.price.currency + " : " + ebay.price.value}}</div>
        </mt-cell>
        <mt-field v-model="pro_info.productPrice" placeholder="请输入商品价格" label="￥" style="margin-bottom: 10px;"></mt-field>
        <mt-cell title="运费">
          <div>
            <mt-radio class="fee-wrapper" v-model="carriageFeeType" :options="['包邮', '不包邮']">
            </mt-radio>
          </div>
        </mt-cell>
        <mt-field v-model.number="pro_info.carriageFee" v-show="carriageFeeType == '不包邮'" placeholder="请输入邮费" type="number"></mt-field>
        <mt-cell title="税费">
          <div>
            <mt-radio class="fee-wrapper" v-model="taxFeeType" :options="['包税', '不包税']">
            </mt-radio>
          </div>
        </mt-cell>
        <mt-field v-model.number="pro_info.taxFee" v-show="taxFeeType == '不包税'" placeholder="请输入税费" type="number"></mt-field>
        <template v-if="ebay.optionAttr" v-for="(value, key) in ebay.optionAttr">
          <div class="params-wrap">
            <mt-cell :title='key'></mt-cell>
            <mt-field :placeholder=" '请输入' + key + '译文'"></mt-field>
            <mt-cell :title=" '请输入' + key + '选项的译文'"></mt-cell>
            <mt-field v-for="v in value" :label="v + '：'" :placeholder=" '请输入' + v + '译文'"></mt-field>
          </div>
        </template>
        <template v-for="(item, index) in ebay.localizedAspects">
          <div class="params-wrap">
            <mt-cell :title=" item.name "></mt-cell>
            <mt-field v-model="else_key[index]" :placeholder="'请输入译文'"></mt-field>
            <mt-cell :title=" item.value"></mt-cell>
            <mt-field v-model="else_value[index]" :placeholder="'请输入译文' "></mt-field>
          </div>
        </template>
        <iframe :srcdoc="ebay.description" seamless class="desc-wrap"></iframe>
        <!-- <div v-html="ebay.description" class="desc-wrap"></div> -->
        <mt-cell title=" 商品介绍 " style="font-size:14px;margin-top:10px;"></mt-cell>
        <textarea v-model="pro_info.productMemo" cols="30" rows="10" style="width:98%">
        </textarea>
      </form>
      <div class="bt-group">
        <mt-button type="primary" @click="proSubmit" class="btn-submit" :disabled="loading">提审</mt-button>
      </div>
    </div>
    <div class="no-product" v-if="show_tip">没有该商品或该商品不能在本平台翻译</div>
  </div>
</template>
<script>
import { reqSellerProductSave, reqProductDetail, reqEbayGoods } from '../../api'
import { Toast, Indicator } from 'mint-ui'
export default {
  data() {
    return {
      loading: false,
      carriageFeeType: '',
      taxFeeType: '',
      hideKeyboard: false,
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
        auditStatus: '0', //待审核
        productStatus: '下架',
        userWxOpenid: JSON.parse(sessionStorage.getItem('ebay-app')).userWxOpenid,
        productNane: '',
        productPic: '', //以@连接
        productPrice: '', //post时要求number类型
        productIcon: '',
        items: [],
        productMemo: "",
        productUsd: '',
        productCountry: '',
        carriageFee: '',
        taxFee: ''
      },
      pro_info_bak: {}
    }
  },
  directives: {
    focus: {
      update: function(el, { value }) {
        if (value) {
          el.focus();
        }
      }
    }
  },
  methods: {
    proSubmit() {
      console.log("hehe:", this.pro_info)
      if (this.pro_info.productNane.match(/^[ ]*$/)) {
        Toast('请输入商品名称')
        return false
      }
      if (this.pro_info.productPrice == "") {
        Toast('请输入商品价格')
        return false
      }
      if (this.carriageFeeType == '不包邮' &&
        !/^[0-9]+([.]{1}[0-9]{1,2})?$/.test(this.pro_info.carriageFee)) {
        Toast('请输入最多两位小数的数字格式的运费')
        return false
      }
      if (this.taxFeeType == '不包税' &&
        !/^[0-9]+([.]{1}[0-9]{1,2})?$/.test(this.pro_info.taxFee)) {
        Toast('请输入最多两位小数的数字格式的运费')
        return false
      }
      if (this.ebay.localizedAspects) {
        let a = this.ebay.localizedAspects.every((v, i) => {
          console.log(v, i)
          if (!this.else_key[i] || this.else_key[i].match(/^[ ]*$/)) {
            Toast('请输入  ' + v.name + '  译文')
            return false
          }
          if (!this.else_value[i] || this.else_value[i].match(/^[ ]*$/)) {
            Toast('请输入  ' + v.value + '  译文')
            return false
          }
          return true
        })
        if (!a) return false
      }
      this.loading = true
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
      this.pro_info.productUsd = Number.parseFloat(this.pro_info.productUsd)
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      reqSellerProductSave(this.pro_info).then((res) => {
        Indicator.close()
        if (res.data.code == 0) {
          let instance = Toast('提审成功')
          setTimeout(() => {
            instance.close()
            this.$router.push({
              name: 'PopularizeList',
              params: {
                justAdded: true
              }
            })
          }, 2000)
        } else {
          Toast(res.data.msg)
          this.loading = false
        }
      })
    },
    backList() {
      this.$router.push('/popularize/list')
    },
    getEbayGoods() {
      if (this.currentValue.match(/^[ ]*$/)) {
        Toast("请输入Ebay商品ID")
      } else {
        this.hideKeyboard = true
        Indicator.open({
          spinnerType: 'fading-circle'
        })
        let itemId = this.currentValue
        reqEbayGoods({ itemId }).then((res) => {
            console.log(res)
            if (res.data.errors) {
              this.show_tip = true
            } else if (res.data.itemId) {
              this.ebay = res.data
              this.flag = true
              this.pro_info.ebayItemid = this.ebay.itemId

              this.pro_info.productIcon = this.ebay.image.imageUrl
              this.pro_info.productCountry = this.ebay.itemLocation.country
              this.pro_info.productUsd = this.ebay.price.value

              if (res.data.itemType == 1) { //组合商品

              }
              let imgArr = []
              imgArr.push(this.pro_info.productIcon)
              if (this.ebay.additionalImages) {
                for (let i of this.ebay.additionalImages) {
                  imgArr.push(i.imageUrl)
                }
                this.pro_info.productPic = imgArr.join("@")
              } else {
                this.pro_info.productPic = imgArr.join("")
              }

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
      a == '' ? this.flag = false : ''
    },
    'pro_info.productPrice': {
      handler: function(a, b) {
        a = a + ''
        if (!/^(([1-9]\d*)|((0.\d{1,2}|[1-9]\d*.\d{1,2})))$/.test(a)) {
          //清除"数字"和"."以外的字符
          a = a.replace(/[^\d.]/g, "")
          //验证第一个字符是数字而不是
          a = a.replace(/^\./g, "")
          //只保留第一个. 清除多余的
          a = a.replace(/\.{2,}/g, ".")
          a = a.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".")
          //只能输入两个小数
          a = a.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
          this.$nextTick(function() {
            this.pro_info.productPrice = a
          })
        }
      },
      deep: true
    },
    carriageFeeType(c) {
      if (c == '包邮') {
        this.pro_info.carriageFee = 0
      }
    },
    taxFeeType(t) {
      if (t == '包税') {
        this.pro_info.taxFee = 0
      }
    }
  },
  activated() {
    this.flag = false
    // this.flag = true
    this.currentValue = ''
    this.else_key = []
    this.else_value = []
    this.pro_info = Object.assign({}, this.pro_info_bak)

    this.productId = this.$route.params.productId
    if (this.productId) {
      this.currentValue = this.$route.params.ebayItemid
      this.getEbayGoods()
      reqProductDetail({ productId: this.productId }).then((res) => {
        let p = res.data.data
        this.isEdit = true
        this.pro_info = {
          auditStatus: '0', //待审核
          productStatus: '下架',
          userWxOpenid: JSON.parse(sessionStorage.getItem('ebay-app')).userWxOpenid,
          productNane: p.name,
          productPic: (p.pic ? p.pic.join('@') : ''),
          productPrice: p.price,
          productIcon: p.icon,
          items: p.productAttr,
          productMemo: p.productMemo,
          productUsd: p.productUsd,
          carriageFee: p.carriageFee,
          taxFee: p.taxFee
        }
        p.carriageFee ? this.carriageFeeType = '不包邮' : this.carriageFeeType = '包邮'
        p.taxFee ? this.taxFeeType = '不包税' : this.taxFeeType = '包税'
        for (let i in p.productAttr) {
          this.else_key[i] = p.productAttr[i].attrName
          this.else_value[i] = p.productAttr[i].attrValue
        }
      })
    }
  },
  mounted() {
    this.pro_info_bak = Object.assign({}, this.pro_info)

    //获取页面高度
    var clientHeight = document.body.clientHeight;
    //设置监听聚焦事件
    var focusElem
    document.body.addEventListener("focus", function(e) {
      focusElem = e.target
    }, true)
    //设置监听窗口变化时间
    window.addEventListener("resize", function() {
      if (focusElem && document.body.clientHeight < clientHeight) {
        //使用scrollIntoView方法来控制输入框
        focusElem.scrollIntoView(false);
      }
    })
  }
}

</script>
<style lang="scss">
.fee-wrapper .mint-cell {
  display: inline-block;
}

</style>
<style lang='scss' scoped>
.params-wrap {
  margin: 10px 0;
}

.goods-container {
  padding-bottom: 50px;
}

.container {
  .search {
    flex: 1 0 auto;
  }
}

.desc-wrap {
  width: 100%;
  border: 0;
  height: 50vh;
}

.no-product {
  padding-top: 90px;
  text-align: center;
  color: #9E9E9E;
}

.container {
  .bt-group {
    .btn-submit {
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

.input-null {
  z-index: -1;
  position: absolute;
  top: 0;
  left: 0;
}

</style>
