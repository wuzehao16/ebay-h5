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
    <div class="goods-container" v-if="showAll">
      <mt-swipe :auto="5000" :speed="0" class="pre-banner">
        <mt-swipe-item v-for="i in pro_info.productPic.split('@')" :key="i">
          <div :style="{'background-image': 'url(' + i + ')'}" class="wrapper-fff">
          </div>
        </mt-swipe-item>
      </mt-swipe>
      <form>
        <mt-cell :title="ebay.title"></mt-cell>
        <mt-field v-model="pro_info.productNane" placeholder="请输入商品名称" rows='2' type='textarea'></mt-field>
        <mt-cell title=" 商品类型(一级分类) " style="font-size:14px;margin-top:10px;"></mt-cell>
        <select class="select" v-model="categoryPid" placeholder="请选择">
          <option value='' disabled selected style='display:none;'>请选择</option>
          <option v-for="i in categoryList" :key="i.queue" :value="i.id">{{i.name}}</option>
        </select>
        <mt-cell title=" 商品类型（二级分类） " style="font-size:14px;"></mt-cell>
        <select class="select" v-model="pro_info.productType" placeholder="请选择">
          <option value='' disabled selected style='display:none;'>请选择</option>
          <option v-for="i in categorySubList" :key="i.queue" :value="i.id">{{i.name }}</option>
        </select>
        <mt-cell title="运费" style='margin-top:10px;'>
          <div>
            <mt-radio class="fee-wrapper" v-model="carriageFeeType" :options="['包邮', '不包邮']">
            </mt-radio>
          </div>
        </mt-cell>
        <mt-field v-model.number="pro_info.carriageFee" v-show="carriageFeeType == '不包邮'" placeholder="请输入邮费" type="number" label="￥"></mt-field>
        <mt-cell title="税费">
          <div>
            <mt-radio class="fee-wrapper" v-model="taxFeeType" :options="['包税', '不包税']">
            </mt-radio>
          </div>
        </mt-cell>
        <mt-field v-model.number="pro_info.taxFee" v-show="taxFeeType == '不包税'" placeholder="请输入税费" type="number" label="￥"></mt-field>
        <mt-cell title="统一加价（￥）">
          <div class="select-amount" style="display: flex;">
            <div class="f decrease" @click="amount > 1 ? amount-- : ''" :class="{'disabled' : amount == 1 }">-</div>
            <div>
              <input type="number" @blur="amount?'':amount = 1" v-model="amount">
            </div>
            <div class="f increase" @click="amount++">+</div>
          </div>
        </mt-cell>
        <mt-field label="汇率（美元USD/人民币CNY）：" placeholder="请输入美元USD/人民币CNY" type="number" :value="ebay.usdRate" class="w50" disabled></mt-field>
        <mt-cell>
          <div slot="title" v-if='ebay.price'>{{ ebay.price.currency + " : " + ebay.price.value}}</div>
        </mt-cell>
        <mt-field :value="sellPrice" placeholder="请输入商品价格" label="￥" style="margin-bottom: 10px;" disabled></mt-field>
        <mt-cell v-if="ebay.itemsAttr" class="params-wrap">
          <div slot="title">
            <mt-picker :slots="itemsAttrSlots" @change="changeAttr"></mt-picker>
            <div class="attr-wrap">
              <p v-if="Object.keys(ebay.optionAttr).includes(k) || k == 'price'" v-for="(v, k, i) in chosenItem.value">
                {{ k }}:&nbsp;&nbsp;{{ v }}
              </p>
            </div>
            <template v-for='(v, i) in itemsAttrSlots[0].values'>
              <mt-field label="价格（￥）：" v-show="v == chosenItem.key" v-model="ebay.itemsAttr[v].attrCvalue" :placeholder="'请输入第 ' + (i + 1) + ' 组合的价格'"></mt-field>
            </template>
          </div>
        </mt-cell>
        <template v-if="ebay.optionAttr_2" v-for="(v, i) in ebay.optionAttr_2">
          <div class="params-wrap">
            <mt-cell :title='v.key'></mt-cell>
            <mt-field :placeholder=" '请输入' + v.key + '译文' " v-model='v.ckey'></mt-field>
            <mt-cell :title=" '请在下面输入' + v.key + '选项的译文'"></mt-cell>
            <mt-field v-for="(m, n) in v.children" :label="m.ckey + '：'" :key='m.ckey' v-model="m.cvalue" :placeholder=" '请输入' + m.ckey + '译文'"></mt-field>
          </div>
        </template>
        <template v-for="(item, index) in ebay.localizedAspects">
          <div class="params-wrap">
            <mt-cell :title=" item.name "></mt-cell>
            <mt-field v-model="item.cname" :placeholder="'请输入译文'"></mt-field>
            <mt-cell :title=" item.value"></mt-cell>
            <mt-field v-model="item.cvalue" :placeholder="'请输入译文' "></mt-field>
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
import { reqSellerProductSave, reqProductDetail, reqEbayGoods, reqCategoryList, reqCategoryById } from '../../api'
import { Toast, Indicator } from 'mint-ui'
import debounce from 'lodash/debounce'
export default {
  data() {
    return {
      amount: 100,
      exchaneRate: 6.66,
      chosenItem: {
        key: '',
        value: {}
      },
      itemsAttrSlots: [{
        flex: 1,
        values: [],
        textAlign: 'center'
      }],

      loading: false,
      carriageFeeType: '包邮',
      taxFeeType: '包税',
      hideKeyboard: false,
      visible: false,
      currentValue: '',
      showAll: false,
      show_tip: false,
      itemIds: [],

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
        carriageFee: 0,
        taxFee: 0,
        productType: '',
      },
      categoryPid: '',
      categoryList: [],
      categorySubList: [],
      pro_info_bak: {},

      USD: 0,
      usdRate: 0
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
  computed: {
    sellPrice: function() {
      if (this.ebay.price) {
        this.USD = Number.parseFloat(this.ebay.price.value)
        this.usdRate = Number.parseFloat(this.ebay.usdRate)
      }
      if (!this.pro_info.carriageFee) {
        this.pro_info.carriageFee = 0
      }
      if (!this.pro_info.taxFee) {
        this.pro_info.taxFee = 0
      }
      let CNY = this.USD * this.usdRate
      let t = (CNY + Number.parseFloat(this.amount) + this.pro_info.taxFee + this.pro_info.carriageFee)
      return new Number(t).toFixed(2)
    }
  },
  methods: {
    changeAttr(p, v) {
      this.chosenItem.key = v[0]
      this.chosenItem.value = this.ebay.itemsAttr[v[0]]
    },
    validate() {
      if (this.pro_info.productNane.match(/^[ ]*$/)) {
        Toast('请输入商品名称')
        return false
      }
      if (this.ebay.itemsAttr) {
        for (let b of Object.entries(this.ebay.itemsAttr)) {
          if (!b[1].attrCvalue || b[1].attrCvalue.match(/^[ ]*$/)) {
            Toast('您还有具体价格未填写')
            return false
          }
        }
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

      if (this.ebay.optionAttr_2) {
        let b = this.ebay.optionAttr_2.every((v, i) => {
          if (v.ckey.match(/^[ ]*$/)) {
            Toast('请输入' + v.key + '的译文')
            return false
          }
          for (let m of v.children) {
            if (m.cvalue.match(/^[ ]*$/)) {
              Toast('请输入' + m.ckey + '的译文')
              return false
            }
          }
          return true
        })
        if (!b) { return false }
      }
      if (this.ebay.localizedAspects) {
        let a = this.ebay.localizedAspects.every((v, i) => {
          if (!v.cname || v.cname.match(/^[ ]*$/)) {
            Toast('请输入  ' + v.name + '  译文')
            return false
          }
          if (!v.cvalue || v.cvalue.match(/^[ ]*$/)) {
            Toast('请输入  ' + v.value + '  译文')
            return false
          }
          return true
        })
        if (!a) return false
      }
      if (!this.categoryPid || !this.pro_info.productType) {
        Toast('请选择商品分类')
        return false
      }
      if (!this.pro_info.productMemo || this.pro_info.productMemo.match(/^[ ]*$/)) {
        Toast('请输入商品介绍')
        return false
      }
      return true
    },
    proSubmit() {
      if (!this.validate()) {
        return false
      }
      this.loading = true

      this.pro_info.items = []
      //把商品规格单属性放进items
      if(this.ebay.localizedAspects){
        for (let i of this.ebay.localizedAspects) {
          this.pro_info.items.push({
            attrCname: i.cname,
            attrCvalue: i.cvalue,
            attrType: '2',
            attrEname: i.name,
            attrEvalue: i.value
          })
        }
      }

      //组合商品：把商品选择属性放进items
      if (this.ebay.optionAttr) {
        let aItems = Object.entries(this.ebay.itemsAttr)
        for (let i of this.ebay.optionAttr_2) {
          for (let j of i.children) {
            let itemid = []
            for (let k of aItems) {
              if (k[1][i.key] == j.ckey) {
                itemid.push(k[0])
              }
            }
            this.pro_info.items.push({
              attrCname: i.ckey,
              attrCvalue: j.cvalue,
              attrEname: i.key,
              attrEvalue: j.ckey, //英文原文
              attrType: '1',
              itemId: itemid.join('@'),
              id: this.itemIds[0],
              productId: this.productId
            })
            this.itemIds.splice(0, 1)
          }
        }
        //price也要逐个翻译
        for (let i of aItems) {
          this.pro_info.items.push({
            attrEname: 'price',
            attrEvalue: i[1].price,
            attrType: '1',
            itemId: i[0],
            attrCname: i[1].stock, //无stock字段，暂用attrCname充当
            attrCvalue: i[1].attrCvalue,
            productId: this.productId,
            id: this.itemIds[0]
          })
          this.itemIds.splice(0, 1)
        }
      }
      this.pro_info.productPrice = Number.parseFloat(this.sellPrice)
      this.isEdit ? this.pro_info.productId = this.productId : ''
      this.pro_info.productUsd = Number.parseFloat(this.pro_info.productUsd)
      this.pro_info.addPrice = this.amount
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      reqSellerProductSave(this.pro_info).then((res) => {
        Indicator.close()
        if (res.data.code == 0) {
          let instance = Toast('提审成功')
          setTimeout(() => {
            instance.close()
            this.loading = false
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
      }).catch(err => {
        Indicator.close()
        Toast(err)
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
        Indicator.open({ spinnerType: 'fading-circle' })
        let itemId = this.currentValue
        reqEbayGoods({ itemId }).then((res) => {
            if (res.data.errors) {
              this.show_tip = true
            } else if (res.data.itemId) {
              this.ebay = res.data
              this.showAll = true
              this.pro_info.ebayItemid = this.ebay.itemId
              this.pro_info.productNane = this.ebay.ctitle
              this.pro_info.productIcon = this.ebay.image.imageUrl
              this.pro_info.productCountry = this.ebay.itemLocation.country
              this.pro_info.productUsd = this.ebay.price.value
              let imgArr = []
              imgArr.push(this.pro_info.productIcon)
              if (this.ebay.additionalImages) {
                for (let i of this.ebay.additionalImages) {
                  imgArr.push(i.imageUrl)
                }
              }
              if (this.ebay.itemsAttr) {
                for (let m of Object.values(this.ebay.itemsAttr)) {
                  imgArr.push(m.imageUrl)
                }
              }
              imgArr = [...new Set(imgArr)]
              if (imgArr.length > 1) {
                this.pro_info.productPic = imgArr.join("@")
              } else {
                this.pro_info.productPic = imgArr.join("")
              }
              if (this.ebay.itemsAttr) {
                this.getCNY()
                this.itemsAttrSlots[0].values = Object.keys(this.ebay.itemsAttr)
              }

              if (this.productId) {
                reqProductDetail({ productId: this.productId }).then((res) => {
                  let p = res.data.data
                  this.isEdit = true
                  p.carriageFee ? this.carriageFeeType = '不包邮' : this.carriageFeeType = '包邮'
                  p.taxFee ? this.taxFeeType = '不包税' : this.taxFeeType = '包税'
                  p.addPrice ? this.amount = p.addPrice : ''
                  this.pro_info.productNane = p.name
                  this.pro_info.productPic = (p.pic ? p.pic.join('@') : '')
                  this.pro_info.productIcon = p.icon
                  this.pro_info.productMemo = p.productMemo
                  this.pro_info.productType = p.type
                  this.$nextTick(function() {
                    this.$set(this.pro_info, 'carriageFee', p.carriageFee)
                    this.$set(this.pro_info, 'taxFee', p.taxFee)
                  })
                  //商品分类
                  reqCategoryById({ productType: p.type }).then(res => {
                    this.categoryPid = res.data.data.pid
                  }).catch(err => {})

                  for (let m of p.productAttr) {
                    //3.商品规格  set
                    if (m.attrType == '2') {
                      for (let i of this.ebay.localizedAspects) {
                        if (i.name == m.attrEname) {
                          i.cname = m.attrCname
                          i.cvalue = m.attrCvalue
                        }
                      }
                    } else if (m.attrType == '1' && m.attrEname != 'price' && this.ebay.optionAttr) { //2.选择属性  set
                      for (let c of this.ebay.optionAttr_2) {
                        if (c.key == m.attrEname) {
                          c.ckey = m.attrCname
                          for (let j of c.children) {
                            if (j.ckey == m.attrEvalue) {
                              j.cvalue = m.attrCvalue
                            }
                          }
                        }
                      }
                    }
                  }
                })
              }
            }
            Indicator.close()
          })
          .catch(err => { Indicator.close() })
      }
    },
    getCNY() {
      if (this.ebay.itemsAttr) {
        for (let i of Object.values(this.ebay.itemsAttr)) {
          let a = (Number.parseFloat(i.price) * Number.parseFloat(this.ebay.usdRate) + Number.parseFloat(this.amount) + this.pro_info.taxFee + this.pro_info.carriageFee)
          this.$set(i, 'attrCvalue', new Number(a).toFixed(2))
        }
      }
    },
    debounce_getCNY: debounce(function() {
      this.getCNY()
    }, 500),
    getCategoryList() {
      reqCategoryList({ pid: 0 }).then((res) => {
        this.categoryList = res.data.data;
      })
    },
    getCategorySubList() {
      reqCategoryList({ pid: this.categoryPid }).then((res) => {
        this.categorySubList = res.data.data;
      })
    },
  },
  watch: {
    categoryPid(a) {
      this.pro_info.productType = ''
      this.categorySubList = []
      this.getCategorySubList()
    },
    amount(a) {
      this.debounce_getCNY()
    },
    'pro_info.carriageFee': {
      handler: function(a, b) {
        this.debounce_getCNY()
      },
      deep: true
    },
    'pro_info.taxFee': {
      handler: function(a, b) {
        this.debounce_getCNY()
      },
      deep: true
    },
    currentValue(a) {
      this.show_tip = false
      a == '' ? this.showAll = false : ''
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
      } else {
        this.pro_info.carriageFee = 50
      }
    },
    taxFeeType(t) {
      if (t == '包税') {
        this.pro_info.taxFee = 0
      } else {
        let a = Number.parseFloat(this.ebay.usdRate) * Number.parseFloat(this.ebay.price.value) * 0.119
        this.pro_info.taxFee = Number.parseFloat(a.toFixed(2))
      }
    }
  },
  deactivated() {
    this.categoryPid = ''
    this.carriageFeeType = '包邮'
    this.taxFeeType = '包税'
    this.amount = 100
  },
  activated() {
    this.showAll = false
    this.currentValue = ''
    this.pro_info = Object.assign({}, this.pro_info_bak)
    this.ebay = {}
    this.productId = this.$route.params.productId
    if (this.productId) {
      this.currentValue = this.$route.params.ebayItemid
      this.getEbayGoods()
    }
  },
  mounted() {
    this.getCategoryList();
    this.pro_info_bak = Object.assign({}, this.pro_info)
    //获取页面高度
    let clientHeight = document.body.clientHeight;
    //设置监听聚焦事件
    let focusElem
    document.body.addEventListener("focus", function(e) {
      focusElem = e.target
    }, true)
    //设置监听窗口变化时间
    window.addEventListener("resize", function() {
      if (focusElem && document.body.clientHeight < clientHeight) {
        //使用scrollIntoView方法来控制输入框
        focusElem.scrollIntoView(false)
        document.getElementById('app').scrollTop += 100
      }
    })
  }
}

</script>
<style lang="scss">
.fee-wrapper .mint-cell {
  display: inline-block;
  .mint-cell-wrapper {
    background: none;
  }
}

.w50 .mint-cell-title {
  width: 60%;
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
  height: 280px;
  width: 100%;
  background-color: #fff;
  li {
    height: 100%;
    width: 100%;
    list-style-type: none;
    background-size: contain!important;
  }
  .wrapper-fff {
    height: 100%;
    margin: 0 auto;
    background-size: auto 190px;
    background-repeat: no-repeat;
    background-position: center;
  }
}

.input-null {
  height: 0.1px;
  padding: 0;
  border: 0;
  z-index: -1;
  position: fixed;
  top: 0;
  left: 0;
}

.select {
  height: 40px;
  -webkit-appearance: none;
  appearance: none;
  border: none;
  z-index: 10;
  font-size: 14px;
  padding: 0px 10px;
  display: block;
  width: 100%;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background-color: #FFFFFF;
  color: #333333;
  border-radius: 4px;
}

</style>
