<template>
  <div class="container">
    <div>
      <mt-cell-swipe v-for="c in cart_list" :key="Math.random()" :right="[{
	content: '删除',
	style: {background:'red', color: '#fff', display: 'flex', 'align-items': 'center'},
	handler: () => deletePro(c)
	}]" class="cart-cell">
        <div slot="title" class='shop-cart'>
          <div class="check-box">
            <mt-checklist v-model="checked_pro" :options="Array(getFlag(c))">
            </mt-checklist>
          </div>
          <div slot="title" class="shop-cart-list" :style="{'background': 'url(' + c.productIcon + ') no-repeat left center'}">
            <h3>{{ c.productName }}</h3>
            <small class="small-desc" v-if="c.productAttr">
				<template v-for="(v, i) in JSON.parse(c.productAttr)">
					<span>{{ v.key }}:{{ v.value }}</span>
				</template>
			</small>
            <div>
              <div class="price-amount-wrap">
                <p class="p-price">￥{{c.productPrice}}</p>
                <div class="select-amount">
                  <div class="f decrease" @click="c.productQuantity > 1 ? c.productQuantity-- : ''" :class="{'disabled' : c.productQuantity == 1 }">-
                  </div>
                  <div>
                    <input type="number" @blur="c.productQuantity?'':c.productQuantity = 1" v-model.number="c.productQuantity">
                  </div>
                  <div class="f increase" @click="increase(c)">+</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </mt-cell-swipe>
    </div>
    <div class="no-data no-collect" v-if='tip_flag'>
      <i class="iconfont icon-cart"></i>
      <br/>
      <span>您购物车中没有商品</span>
    </div>
    <div class="foot-cart">
      <mt-cell class="cal-box" v-if='tip_flag2'>
        <div slot="title">
          <div class="el-wrap">
            <div class="check-box show-label">
              <mt-checklist v-model="check_all" :options="check_all_value">
              </mt-checklist>
            </div>
          </div>
        </div>
        <div class="bt-total">
          <div>
            <span>总计：<em class="price">￥{{ proTotal.sumPrice }}</em>
				&nbsp;</span>
            <span>不含运费，已优惠￥0.00</span>
          </div>
          <mt-button type="primary" @click="goSettle" style="font-size:14px;height:56px;border-radius:0;width:200px" :disabled="checked_pro.length == 0">
            去结算（{{ proTotal.sumAmount > 99? '99+' :proTotal.sumAmount }}件）</mt-button>
        </div>
      </mt-cell>
    </div>
  </div>
</template>
<script>
import { reqShoppingCartList, reqCartDelete } from '../../api'
import { MessageBox } from 'mint-ui'
export default {
  data() {
    return {
      checked_pro: [],
      all_pro: [],
      check_all: [],
      check_all_value: ['全选'],
      bb: true,
      cc: true,
      bbTimeout: '',
      ccTimeout: '',
      tip_flag: false,
      tip_flag2: false,
      cart_list: [],
      userId: ''
    }
  },
  computed: {
    proTotal() {
      let sumAmount = 0,
        sumPrice = 0

      for (let i of this.cart_list) {
        if (this.checked_pro.some(el => el == this.getFlag(i))) {
          sumAmount += i.productQuantity
          sumPrice += i.productPrice * i.productQuantity
        }
      }
      sumPrice = sumPrice.toFixed(2)
      return { sumAmount, sumPrice }
    }
  },
  methods: {
  	getFlag(i) {
  		return i.productId + (i.itemId || '')
  	},
    deletePro(c) {
      MessageBox.confirm('确定删除此商品吗?').then(action => {
        let params = {
        	productId: c.productId + '', //string
        	userId: this.userId,
        	itemId: c.itemId ? encodeURIComponent(c.itemId) : ''
        }
        reqCartDelete(params).then((res) => {
          if (res.data.msg == '成功') {
            this.getList()
            this.$store.commit('changeCartAmount')
          }
        })
      }).catch((err) => {
        console.log(err)
      })
    },
    increase(c) {
      c.productQuantity++
        if ( !this.checked_pro.some(el => el == this.getFlag(c)) ) {
          this.checked_pro.push(this.getFlag(c))
        }
    },
    goSettle() {
      let items = []
      for (let i of this.cart_list) {
        if (this.checked_pro.some(el => el == this.getFlag(i))) {
          i.carriageFee = i.carriage
          items.push(i)
        }
      }
      sessionStorage.setItem('order_info', JSON.stringify({ items }))
      this.$router.push({
        name: 'SettleOrder'
      })
    },
    getList() {
      reqShoppingCartList({ userId: this.userId, size: 100 }).then((res) => {
        this.cart_list = res.data.data
        this.all_pro = []
        for (let i of res.data.data) {
          this.all_pro.push(this.getFlag(i))
        }
        if (this.all_pro.length == 0) {
          this.tip_flag = true
          this.tip_flag2 = false
        } else {
          this.tip_flag = false
          this.tip_flag2 = true
        }
      })
    }
  },
  watch: {
    check_all(val) {
      clearTimeout(this.bbTimeout)
      if (this.cc) {
        this.bb = false
        if (this.check_all.length == 1) {
          this.checked_pro = this.all_pro
        } else {
          this.checked_pro = []
        }
      }
      this.bbTimeout = setTimeout(() => {
        this.bb = true
      }, 100)

    },
    checked_pro(val) {
      clearTimeout(this.ccTimeout)
      if (this.bb) {
        this.cc = false
        if (this.checked_pro.length == this.all_pro.length) {
          this.check_all = this.check_all_value
        } else {
          this.check_all = []
        }
      }
      this.ccTimeout = setTimeout(() => {
        this.cc = true
      }, 100)
    }
  },
  mounted() {
    this.userId = JSON.parse(sessionStorage.getItem('ebay-app')).id
  },
  activated() {
    if (this.userId) {
      this.getList()
    }
  },
  deactivated() {
    this.check_all = []
  }
}

</script>
<style lang="scss">
.mint-checkbox-core {
  margin-left: 2px;
  width: 15px;
  height: 15px;
}

.mint-checkbox-core::after {
  top: 2px;
  left: 4px;
}

.no-collect {
  top: 30%;
  i {
    font-size: 40px;
    margin-bottom: 10px;
  }
}

.foot-cart {
  position: fixed;
  bottom: 50px;
  width: 100%;
  height: 56px;
}

.cal-box {
  position: absolute;
  width: 100%;
  font-size: 14px;
  .el-wrap {
    height: 50px;
    width: 45px;
    >div:nth-child(1) {
      float: left;
    }
    .mint-checkbox-label {
      font-size: 11px;
      margin-left: 1px;
    }
  }
  .mint-cell-wrapper {
    padding-right: 0;
  }
  .bt-total {
    display: flex;
    div {
      flex: 0 0 180px;
      margin-top: 6px;
      span {
        display: block;
        text-align: right;
        float: right;
      }
      span:nth-child(1) {
        padding-top: 10px;
      }
      span:nth-child(2) {
        font-size: 12px;
        padding-top: 4px;
        padding-right: 10px;
      }
    }
    .price {
      font-style: normal;
      color: #CC0505;
    }
  }
}

.cart-cell {
  &:not(:first-child) {
    margin-top: 8px
  }
}

.show-label {
  .mint-checkbox-label {
    display: inline-block!important;
    font-size: 14px;
  }
}

.shop-cart {
  display: flex;
  align-items: center;
}

.check-box {
  .mint-cell:last-child {
    background: none;
  }
  .mint-cell {
    background: none;
  }
  .mint-cell-wrapper {
    padding: 0;
    background: none;
  }
  .mint-checklist-label {
    padding-left: 0;
  }
  .mint-checkbox-label {
    display: none;
  }
}

</style>
<style lang="scss" scoped>
.mint-cell-swipe:last-of-type {
  margin-bottom: 100px;
}

.p-price {
  color: #0099f7;
}

.price-amount-wrap {
  margin-top: 30px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.select-amount {
  display: flex;
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
    line-height: 26px;
    height: 26px;
    width: 19px;
    text-align: center;
    font-size: 24px;
    border: 1px solid #f5f5f5;
    background-color: #f5f5f5;
  }
  .fa {
    padding-top: 6px;
    color: #666;
  }
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

.shop-cart-list {
  position: relative;
  padding: 10px 0 10px 110px;
  background-size: 90px auto!important;
  min-height: 110px;
  line-height: 26px;
  width: 100%;
  h3,
  p {
    margin: 0;
  }
  h3,
  small {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-wrap: break-word;
    word-break: break-all;
  }
  button {
    position: absolute;
    bottom: 16px;
  }
}

</style>
