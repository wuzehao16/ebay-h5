<template>
  <div class="container">
    <div class="c2">
      <mt-cell class="address">
        <div slot="title" @click="chooseAddress" class="receiver">
          <template v-if="receiver_info.cneeName">
            <p>{{ receiver_info.cneeName }} {{ receiver_info.cneePhone }}</p>
            <span>{{ receiver_info.cneeAddress.replace(/@/g, "") }}</span>
          </template>
          <template v-if="!receiver_info.cneeName">
            <div class="choose">请选择地址<i class="iconfont icon-add"></i></div>
          </template>
        </div>
      </mt-cell>
      <div class="buying-goods">
        <mt-cell v-for="(order, index) in order_info.items" :key="index" style="margin-bottom: 10px;">
          <div slot="title" class="order-container" :style="{'background':
		'url(' + order.productIcon + ') left center no-repeat'}">
            <h3>{{ order.productName }}</h3>
            <small class="small-desc" v-if="order.productAttr">
				<template v-for="(v, i) in JSON.parse(order.productAttr)">
					<span>{{ v.key }}:{{ v.value }}</span>
				</template>
			</small>
            <div><span class="price">￥{{ order.productPrice }}</span>
              <span class="amount">x{{ order.productQuantity }}</span></div>
          </div>
        </mt-cell>
      </div>
      <mt-cell title="商品总价">
        <div class="red-color">￥{{ total.price }}</div>
      </mt-cell>
      <mt-cell title="含运费">
        <div class="red-color">￥{{ total.carriageFee }}</div>
      </mt-cell>
      <mt-cell title="含税费">
        <div class="red-color">￥{{ total.taxFee }}</div>
      </mt-cell>
      <mt-cell title="预计到货时间">
        <div class="red-color">{{ formatTime((new Date().getTime() + 15*24*60*60*1000), 'yyyy-MM-dd') }}</div>
      </mt-cell>
<!--       <mt-cell>
        <div>实付金额：<span class="red-color">￥{{ total.money }}</span></div>
      </mt-cell> -->
      <div class='to-wechat'>
        <mt-button size="large" @click="submitOrder" :disabled="payStatus">微信支付</mt-button>
      </div>
    </div>
  </div>
</template>
<script>
import {
  reqBuyerOrderCreate,
  baseUrl,
  reqPayCreate,
  reqBuyerOrderEdit,
  reqAddressList,
  reqCartDelete
} from '../../api'
import { Toast, MessageBox } from 'mint-ui'
export default {
  data() {
    return {
      payStatus: false,
      order_info: {},
      receiver_info: {
        cneeName: '', //收货人
        cneePhone: '',
        cneeAddress: '',
        name: '', //买家
        phone: '',
        address: ''
      },
      pay_info: {
        returnUrl: baseUrl + '/user/usercenter'
      },
      userId: ''
    }
  },
  methods: {
    chooseAddress() {
      this.$router.push({
        name: 'AddressList',
        params: {
          order_info: this.order_info,
          seleceted: this.receiver_info,
          radio_value: 1
        }
      })
    },
    onBridgeReady(payResponse) {
      console.log(this.order_info)
      let _this = this
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
          "appId": payResponse.appId, //公众号名称，由商户传入
          "timeStamp": payResponse.timeStamp, //时间戳，自1970年以来的秒数
          "nonceStr": payResponse.nonceStr, //随机串
          "package": payResponse.package,
          "signType": "MD5", //微信签名方式：
          "paySign": payResponse.paySign //微信签名
        },
        function(res) {
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            Toast('您已成功支付')
            _this.$router.push('/user/usercenter')
          } else if (res.err_msg == 'get_brand_wcpay_request:cancel') {
            Toast('您已取消支付')
            _this.payStatus = false
          } else {
            console.log('支付失败')
            _this.payStatus = false
          }
        })
    },
    wechatPay(payResponse) {
      let _this = this
      if (typeof WeixinJSBridge == "undefined") {
        console.debug("WeixinJSBridge is undefined!");
        if (document.addEventListener) {
          document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady(payResponse), false);
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady(payResponse));
          document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady(payResponse));
        }
      } else {
        this.onBridgeReady(payResponse)
      }
    },
    submitOrder() {
      if (!this.receiver_info.cneeName) {
        Toast({
          message: '请选择地址',
          position: 'top'
        })
        return false
      }
      this.payStatus = true

      Object.assign(this.order_info, this.receiver_info, {
        openid: this.ebay_app.userWxOpenid
      })
      if (this.order_info.orderId && this.order_info.items.length == 1) { //已建订单
        reqBuyerOrderEdit(this.order_info).then((res) => {
          if (res.data.code == 0) {
            if (this.order_info.orderGroupNo) {
              this.pay_info.orderGroupNo = this.order_info.orderId
            }
            reqPayCreate(this.pay_info).then((res) => {
              if (res.data.code == 0) {
                this.wechatPay(res.data.data.payResponse)
              }
            })
          }
        })
      } else { //未建订单
        reqBuyerOrderCreate(this.order_info).then((res) => {
          if (res.data.code == 0) {
            let r = res.data.data
            this.pay_info.orderGroupNo = r.orderGroupNo
            this.order_info.orderId = r.orderGroupNo

            //如已下单商存在于购物车中，则去掉
            let orderIdArr = r.orderId.split(',')
            let j = 0
            for (let i of this.order_info.items) {
              i.orderId = orderIdArr[j]
              j++
              reqCartDelete({
                productId: i.productId,
                userId: this.userId,
                itemId: i.itemId ? encodeURIComponent(i.itemId) : ''
              }).then((res) => {}).catch(err => {})
            }
            this.$store.commit('changeCartAmount')
            this.$store.commit('setCartRefresh')

            reqPayCreate(this.pay_info).then((res) => {
              if (res.data.code == 0) {
                this.wechatPay(res.data.data.payResponse)
              }
            })
          }
        })
      }
    }
  },
  computed: {
    total() {
      let c = 0,
        t = 0,
        p = 0
      if (this.order_info.items) {
        for (let i of this.order_info.items) {
          let carriage = i.carriageFee || 0
          let tax = i.taxFee || 0
          p += i.productPrice * i.productQuantity
          c += carriage * i.productQuantity
          t += tax * i.productQuantity
        }
      }
      return {
        carriageFee: c.toFixed(2),
        taxFee: t.toFixed(2),
        price: p.toFixed(2)
      }
    }
  },
  activated() {
    this.order_info = JSON.parse(sessionStorage.getItem('order_info'))
    if (!this.order_info) {
      this.$router.push('/product/list')
    }
    for (let i of this.order_info.items) {
      i.productName = i.productName.substr(0, 64)
    }
    let a = this.$route.params.receiver_info
    if (a) {
      this.receiver_info.cneeName = a.cneeName
      this.receiver_info.cneePhone = a.cneePhone
      this.receiver_info.cneeAddress = a.cneeAddress
      this.receiver_info.cneeIdcard = a.cneeIdcard
    }
  },
  deactivated() {
    this.payStatus = false
    if (this.$route.name != 'AddressList') {
      this.pay_info.orderGroupNo = ''
      sessionStorage.setItem('order_info', JSON.stringify({}))
    }
  },
  mounted() {
    this.ebay_app = JSON.parse(sessionStorage.getItem("ebay-app"))
    this.receiver_info.name = this.ebay_app.userWxName || ''
    this.receiver_info.phone = this.ebay_app.userPhone || ''
    this.receiver_info.address = this.ebay_app.userAddr || ''

    this.userId = this.ebay_app.id
    let obj = {
      userId: this.userId,
      page: 0,
      size: 100
    }

    if (!this.$route.params.receiver_info) {
      reqAddressList(obj).then(res => {
        if (res.data.code == 0) {
          let list = res.data.data.content
          let cnee = { updated: 0 }
          if (list.length > 0) {
            list.forEach((v, i, a) => {
              if (v.isDefaute == 'Y' && v.updated > cnee.updated) {
                cnee = v
              }
            })
            if (!cnee.id) {
              cnee = list[0]
            }
            this.receiver_info.cneeName = cnee.cneeName
            this.receiver_info.cneePhone = cnee.cneePhone
            this.receiver_info.cneeAddress = cnee.cneeAddress
            this.receiver_info.cneeIdcard = cnee.cneeIdcard
          }
        }
      })
    }

  }
}

</script>
<style lang="scss" scoped>
.buying-goods {
  margin-top: 86px;
}

.address {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 10;
  height: 80px;
  margin-bottom: 10px;
  background-color: #fff !important;
  background: url("../../assets/stripe.png") bottom center repeat-x;
  background-size: 50px 4px;
  .mint-cell-wrapper {
    background-image: none;
  }
}

.receiver {
  .choose {
    margin-top: 20px;
    text-align: center;
  }
  p {
    margin: 15px 0 5px 0;
    font-size: 16px
  }
  span {
    font-size: 14px;
    color: gray;
  }
}

$red-color: #ef4f4f;
.to-wechat {
  margin: 10px 20px;
  button {
    background: #22b722;
    color: #fff;
  }
}

.red-color {
  color: $red-color;
}

.container {
  background: #EEEEEE;
  height: 100%;
}

.c2 {
  margin-bottom: 60px;
}

</style>
