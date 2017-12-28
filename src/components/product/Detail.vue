<template>
  <div class="container">
    <mt-swipe :auto="5000" :speed="0" class="pre-banner" style="background: #fff;">
      <mt-swipe-item v-for="(url,index) in productInfo.pic" :key="index">
        <div :style="{'background-image': 'url(' + url + ')'}" class="wrapper">
          <span v-if="productInfo.pic && productInfo.pic.length> 0" class="page-nub">
      <span class="num1">{{index+1}}</span>
          <span class="bg">/</span>
          <span class="num2">{{productInfo.pic.length}}</span>
          </span>
        </div>
      </mt-swipe-item>
    </mt-swipe>
    <mt-tabbar :fixed="true" class="addCart">
      <template v-if="!isPreview">
        <div class="cart">
          <i class="iconfont icon-cart" @click="toCart" style="font-size: 30px;"></i>
          <!-- <mt-badge type="danger" size="small" class="num">10</mt-badge> -->
          <span class="num">{{ pro_in_cart < 100 ? pro_in_cart : '99+' }}</span>
        </div>
        <mt-button type="danger" @click="addToCart">加入购物车</mt-button>
        <mt-button type="primary" @click="buyIt">立即购买</mt-button>
      </template>
      <mt-button v-if="isPreview" type="primary" size="large" @click="backList">返回我的发布</mt-button>
    </mt-tabbar>
    <mt-cell>
      <div slot='title' class="pro-title">
        <img :src="staticBase + '/resource/flags_24/us.png'">
        <img :src="staticBase + '/resource/ebay-logo.png'">
        <span>{{ productInfo.name }}</span>
      </div>
      <span class="love-it" @click="collected = !collected">
    <i class="iconfont" :class="{'icon-collect': !collected, 'icon-collect-color': collected}"></i><br/>收藏</span>
    </mt-cell>
    <div class="price">
        ￥{{ selectedPrice || productInfo.price}}
    </div>
    <mt-cell>
      <div slot='title' class='country-wrap' v-if="productInfo.productCountry">
        <img :src="staticBase + '/resource/flags_24/' + productInfo.productCountry + '.png' ">
        <span>{{ EN_To_CN }}品牌</span>
      </div>
      <div class='country-wrap'>
        <i class="iconfont icon-plane"></i>
        <span>跨境运输</span>
      </div>
    </mt-cell>
    <template v-for="(v, k,  i) in option_list" >
      <dl>
        <dt>{{ k }}</dt>
        <dd>
          <ul>
            <li :class="{'height-light': selectedAttr[i] == c}" @click="setSelected(i, c)" v-for="(c, index) in v" :key="index + c + i">
              {{ c.value }}
            </li>
          </ul>
        </dd>
      </dl>
    </template>
    <div class="fee-wrap">
      <mt-cell title="运费" :value="carriageFee"></mt-cell>
      <mt-cell title="税费" :value="taxFee"></mt-cell>
    </div>
    <dl>
      <dt class="number-title">数量</dt>
      <dd class="select-amount">
        <div class="f decrease" @click="amount > 1 ? amount-- : ''" :class="{'disabled' : amount == 1 }">-</div>
        <div>
          <input type="number" @blur="amount?'':amount = 1" v-model="amount">
        </div>
        <div class="f increase" @click="amount++">+</div>
      </dd>
    </dl>
    <mt-navbar v-model="selected">
      <mt-tab-item id="1">商品介绍</mt-tab-item>
      <mt-tab-item id="2">商品规格</mt-tab-item>
    </mt-navbar>
    <!-- tab-container -->
    <mt-tab-container v-model="selected" class="tab-container">
      <mt-tab-container-item id="1">
        <div class="container1">
          <p>{{productInfo.productMemo ||'暂无商品介绍'}}</p>
        </div>
      </mt-tab-container-item>
      <mt-tab-container-item id="2">
        <div class="detail" id="wareStandard" style="display: block;margin-bottom:50px;">
          <table class="table-border" width="100%">
            <tbody>
              <tr v-for="d in productInfo.productAttr" :key="d.id">
                <template v-if='d.attrType == "2"'>
                  <td>{{d.attrCname}}</td>
                  <td>{{d.attrCvalue}}</td>
                </template>
              </tr>
            </tbody>
          </table>
        </div>
      </mt-tab-container-item>
    </mt-tab-container>
  </div>
</template>
<script>
import {
  reqProductDetail,
  reqAddToShoppingCart,
  reqWechatUrl,
  reqIsoCountryJson,
  reqShoppingCartList,
  reqWechatUserInfo,
  staticBase
} from '../../api'
import { Toast } from 'mint-ui'
export default {
  data() {
    return {
      staticBase: staticBase,
      productInfo: {},
      active: 'tab-container1',
      selected: '1',

      selectedAttr: [],
      selectedPrice: null,
      option_list: {},
      definite_itemid: [],

      ebayItemid: null,
      amount: 1,
      collected: false,
      items: [],
      isPreview: false,
      pro_in_cart: 0,
      carriageFee: '',
      taxFee: '',

      isoCountry: {}
    }
  },
  beforeRouteEnter(to, from, next) {
    let user = JSON.parse(sessionStorage.getItem('ebay-app'))
    let openid = to.query.wxOpenid
    if (!user && !openid) {
      let returnUrl = location.protocol + '//' + location.host + to.path
      reqWechatUrl({ returnUrl }).then((res) => {
        if (res.data.code == 0) {
          location.href = res.data.data
        } else {
          next('/product/list')
        }
      }).catch((err) => { next('/product/list') })
    } else if (!user && openid) {
      reqWechatUserInfo({ openid }).then((res) => {
        if (res.data.code == 0) {
          let obj = res.data.data
          sessionStorage.setItem('ebay-app', JSON.stringify(obj))
          next()
        } else {
          next('/product/list')
        }
      }).catch((err) => {})
    } else {
      next()
    }
  },
  computed: {
    EN_To_CN() {
      let c = (this.productInfo.productCountry || '').toUpperCase()
      return this.isoCountry[c]
    }
  },
  methods: {
    setSelected(i, c) {
      if (this.selectedAttr[i] == c) {
        this.$set(this.selectedAttr, i, '')
      } else {
        this.$set(this.selectedAttr, i, c)
      }
      let len = Object.keys(this.option_list).length
      let str = ''
      for (let i of this.selectedAttr) {
        if (i) {
          str += i.itemid
        }
      }
      for (let j of this.definite_itemid) {
        if (str.split(j.itemId).length - 1 == len) {
          console.log('haha1', j.itemId, j.attrEvalue) //此为选中的itemid及其价格
          this.selectedPrice = j.attrCvalue
          this.ebayItemid = j.itemId
          break
        } else if (str.indexOf(j.itemId) > 0) {
          this.selectedPrice = j.attrCvalue
        }
      }
    },
    getOptions() {
      if (this.productInfo.productAttr) {
        let h = '',
          j = 0
        for (let i of this.productInfo.productAttr) {
          if (i.attrType == '1' && i.attrCname != h && i.attrEname != 'price') {
            // this.option_list[i.attrCname] = [i.attrCvalue]
            this.option_list[i.attrCname] = [{
              key: i.attrCname,
              value: i.attrCvalue,
              itemid: i.itemId
            }]
          } else if (i.attrType == '1' && i.attrCname == h && i.attrEname != 'price') {
            // this.option_list[i.attrCname].push(i.attrCvalue)
            this.option_list[i.attrCname].push({
              key: i.attrCname,
              value: i.attrCvalue,
              itemid: i.itemId
            })
          }
          h = i.attrCname
          if (i.attrEname == 'price') {
            this.definite_itemid.push(i)
          }
        }
      }
      console.log(this.definite_itemid)
    },
    checkOption() {
      let arr = Object.keys(this.option_list)
      for (let i of Object.keys(arr)) {
        if (!this.selectedAttr[i]) {
          Toast('请选择' + arr[i])
          return false
        }
      }
      return true
    },
    addToCart() {
      if (!this.checkOption()) {
        return false
      }

      let userId = JSON.parse(sessionStorage.getItem('ebay-app')).id
      let goodCarForm = this.getItemObj()

      reqAddToShoppingCart({ userId, goodCarForm }).then((res) => {
        if (res.data.code == 0 && res.data.msg == '成功') {
          Toast('已加入购物车')
          this.pro_in_cart++
            //vuex 更改状态 以便去到购物车会更新
            this.$store.commit('setCartRefresh')
        } else {
          Toast(res.data.msg)
        }
      })
    },
    selectSize(o) {
      this.activeSize = o
    },
    selectColor(o) {
      this.activeColor = o
    },
    getItemObj() {
      return {
        productId: this.productInfo.id,
        productName: this.productInfo.name,
        productPrice: this.selectedPrice || this.productInfo.price,
        productQuantity: this.amount,
        productIcon: this.productInfo.icon,
        carriageFee: this.productInfo.carriageFee || 0,//下单用
        carriage: this.productInfo.carriageFee || 0,//购物车用
        taxFee: this.productInfo.taxFee || 0,
        itemId: this.ebayItemid,
        productAttr: JSON.stringify(this.selectedAttr)     
      }
    },
    buyIt() {
      if (!this.checkOption()) {
        return false
      }
      let order_info = {
        items: [this.getItemObj()]
      }
      sessionStorage.setItem('order_info', JSON.stringify(order_info))
      this.$router.push({
        name: 'SettleOrder'
      })
    },
    backList() {
      this.$router.push('/popularize/list')
    },
    toCart() {
      this.$router.push('/order/shoppingcart')
    },
    getCartAmount() {
      //获取购物车中商品总数
      let userId = JSON.parse(sessionStorage.getItem('ebay-app')).id

      reqShoppingCartList({ userId }).then((res) => {
        let added_list = res.data.data
        this.pro_in_cart = 0
        for (let i of added_list) {
          this.pro_in_cart += i.productQuantity
        }
      })
    }
  },
  mounted() {
    this.getCartAmount()

    reqIsoCountryJson().then((res) => {
      this.isoCountry = res.data
    })
  },
  activated() {
    this.selectedAttr = []
    this.option_list = {}
    this.ebayItemid = null
    if (this.$route.query.pc_preview) {
      this.isPreview = true
    } else {
      this.isPreview = false
    }

    if (this.$route.params.id || this.isPreview) {
      let productId = this.$route.params.id || this.$route.query.pc_preview
      reqProductDetail({ productId }).then((res) => {
        this.productInfo = res.data.data

        this.getOptions()

        if (this.productInfo.carriageFee) {
          this.carriageFee = '￥' + this.productInfo.carriageFee
        } else {
          this.carriageFee = '包邮'
        }
        if (this.productInfo.taxFee) {
          this.taxFee = '￥' + this.productInfo.taxFee
        } else {
          this.taxFee = '包税'
        }


        //微信分享
        if (!this.isIOS()) {
          this.wxConfig()
        }
        let shareUrl = location.protocol + "//" + location.host +
          '/product/detail/' + productId
        this.wxShare(this.productInfo.name, this.productInfo.productMemo, shareUrl, this.productInfo.icon)
      }).catch(err => {
        // this.$router.push('/product/list')
        console.log(err)
      })
    } else {
      this.$router.push('/product/list')
    }
    if (this.$route.params.isPreview) {
      this.isPreview = this.$route.params.isPreview
    }
    if (this.$store.state.cartAmount == 'changed') {
      this.$store.commit('resetCartAmountFlag')
      this.getCartAmount()
    }
  }
}

</script>
<style lang="scss">
.fee-wrap {
  span {
    font-size: 14px;
  }
}

</style>
<style lang='scss' scoped>
$bg-red: #f23030;
.mint-swipe {
  background: #fff;
}

.pro-title {
  line-height: 22px;
  padding: 10px 10px 0 0;
  img {
    height: 16px;
  }
}

.mint-swipe-indicator.is-active {
  background: red;
}

.pre-banner {
  .mint-swipe-item:nth-child(odd) {
    background: #fff;
  }
  .mint-swipe-item:nth-child(even) {
    background: #fff;
  }
  .wrapper {
    height: 205px;
    width: 200px;
    margin: 0 auto;
    background-size: auto 190px;
    background-repeat: no-repeat;
    background-position: center;
  }
}

.container {
  margin-bottom: 52px;
  .addCart {
    display: flex;
    margin-bottom: -2px;
    div {
      flex: 0 0 50px;
      color: #999;
      font-size: 30px;
      line-height: 48px;
      position: relative;
      .num {
        position: absolute;
        right: 4px;
        top: 4px;
        color: #fff;
        display: inline-block;
        top: 4px;
        background-color: #f23030;
        line-height: 10px;
        font-style: normal;
        border-radius: 8px;
        padding: 1px 4px;
        font-size: 10px;
        border: 1px solid #fff;
      }
    }
    button {
      border-radius: 0;
      height: 48px;
      flex: 1 0 auto;
    }
    button:nth-child(2) {
      background-color: #ffb03f;
      margin-right: -2px;
    }
  }
  .price {
    font-size: 23px;
    background-color: #fff;
    color: #0099f7;
    padding: 0 0 10px 10px;
  }
}

.country-wrap {
  font-size: 14px;
  color: #888;
  img {
    height: 20px;
  }
}

.love-it {
  text-align: center;
  line-height: 20px;
  font-size: 14px;
  .icon-collect-color {
    color: #ffc107;
  }
}

.number-title {
  padding: 12px 5px 0 12px;
}

.select-amount {
  line-height: 26px;
  .decrease {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  .increase {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  .f {
    outline: 0;
    /*line-height: 26px;*/
    height: 26px;
    width: 19px;
    text-align: center;
    font-size: 24px;
    border: 1px solid #f5f5f5;
    background-color: #f5f5f5;
  }
  padding: 10px;
  div {
    padding: 0 5px;
  }
  div:nth-child(odd) {
    border: 1px solid #cbcbcb;
  }
  .disabled {
    color: #cbcbcb;
  }
  div:nth-child(even) {
    width: 40px;
    text-align: center;
    border-width: 1px 0 1px 0;
    border-color: #cbcbcb;
    border-style: solid;
    input {
      margin: 0;
      padding: 0;
      height: 100%;
      width: 100%;
      border: none;
      background: transparent;
      text-align: center;
      &:focus {
        outline-style: none;
      }
    }
  }
}

.height-light {
  background: $bg-red;
  color: #fff;
}

.mint-swipe {
  height: 200px;
  background: red;
}

.mint-cell-value {
  padding: 10px;
}

dl {
  background: #fff;
  overflow: hidden;
  dt {
    width: 30px;
    float: left;
    padding: 10px;
    font-size: 14px;
    color: #81838e;
  }
  dd {
    display: flex;
    ul {
      padding-top: 10px;
      list-style-type: none;
      li {
        float: left;
        margin: 0 6px 6px 0;
        background: #f7f8fa;
        color: #000;
        border-radius: 4px;
        padding: 4px;
      }
    }
  }
}

.page-nub {
  font-size: 16px;
  z-index: 11;
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  -webkit-border-radius: 50%;
  background: rgba(0, 0, 0, .15);
  right: 15px;
  bottom: 11px;
  text-align: center;
  line-height: 40px;
  overflow: hidden;
  .num1 {
    font-size: 14px;
    display: inline-block;
    color: #fff;
    margin-right: -3px;
  }
  .num2 {
    font-size: 12px;
    display: inline-block;
    color: #fff;
    margin-left: -3px;
  }
  .bg {
    font-size: 12px;
    display: inline-block;
    color: #fff;
  }
}






/*商品介绍 商品规格*/

.tab-container {
  margin-top: 6px;
  margin-bottom: 50px;
  background-color: #fff;
  .mint-tab-container-wrap {
    padding: 10px;
    .container1 {
      font-size: 14px;
      line-height: 22px;
      padding: 10px;
      color: #999;
      margin-bottom: 50px;
      p {
        height: 100%;
      }
    }
    .detail {
      position: relative;
      padding: 5px 0;
      font-size: .75em;
      color: #5a5a5a;
      overflow: hidden;
      height: 100%;
      margin: 0 10px 12px 10px;
      .table-border {
        border-bottom: solid 1px #e7e7e7;
        border-left: solid 1px #e7e7e7;
        min-width: 100%;
        border-collapse: collapse;
        border-spacing: 0;
        word-wrap: break-word;
        word-break: break-all;
        td {
          border-top: solid 1px #e7e7e7;
          border-right: solid 1px #e7e7e7;
          padding: 10px;
        }
      }
    }
  }
}

</style>
