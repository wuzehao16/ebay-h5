<template>
  <div class="container">
    <mt-navbar v-model="selected" class="my-nav" :fixed="true">
      <mt-tab-item id="all_orders">分销商订单</mt-tab-item>
    </mt-navbar>
    <!-- tab-container -->
    <mt-tab-container v-model="selected" class="order-wrap">
      <div class="no-data" v-if='tip_flag'>{{ tip_text }}</div>
      <!-- 全部订单 -->
      <mt-tab-container-item id="all_orders">
        <mt-loadmore :auto-fill="false" :top-method="getAllList" :bottom-method="getAllList" :bottom-all-loaded="allLoaded" ref="loadmore">
          <div v-for="(d, index) in all_list" :key="d.orderNo" class='cell-margin'>
            <mt-cell>
              <div slot="title" class="order-des">
                <div>
                  <label>状态：</label><span style="color: #ef4f4f;">
                <template v-if="d.orderStatus == '1'">待支付</template>
                <template v-if="d.orderStatus == '2'">已取消</template>
                <template v-if="d.orderStatus == '3'">已支付</template>
                <template v-if="d.orderStatus == '4'">已发货</template>
                <template v-if="d.orderStatus == '5'">已完成</template>
                <template v-if="d.orderStatus == '6'">退款中</template>
                <template v-if="d.orderStatus == '7'">已退款</template>
                <template v-if="d.orderStatus == '9'">已删除</template>
              </span></div>
                <div>
                  <label>总价：</label><span>￥{{d.orderAmount}}</span></div>
              </div>
            </mt-cell>
            <template v-for='i in d.productList'>
              <mt-cell style="padding-bottom: 10px;">
                <div slot="title" class="goods-list">
                  <div class="avatar" :style="{'background': 'url(' + i.productIcon + ') no-repeat center center'}"></div>
                  <div class="right">
                    <div class="title">{{ i.productNane }}</div>
                    <small class="small-desc" v-if="i.orderDetail.productAttr">
                      <template v-for="(v, i) in JSON.parse(i.orderDetail.productAttr)"
                         v-if="v.key">
                        <span>{{ v.key }}:{{ v.value }}</span>
                      </template>
                    </small>
                    <div class="num">x{{i.orderDetail.productQuantity}}</div>
                  </div>
                </div>
              </mt-cell>
            </template>
          </div>
        </mt-loadmore>
      </mt-tab-container-item>
    </mt-tab-container>
    <div class="to-top" @click="goTop">
      <i class="iconfont icon-top"></i>
    </div>
  </div>
</template>
<script>
import { reqDistriOrderList, reqBuyerOrderCancel } from '../../api'
import { Indicator, MessageBox, Toast } from 'mint-ui'

export default {
  data() {
    return {
      selected: 'all_orders',
      allLoaded: false,
      all_list: [],
      all_page: 0,
      pa: {
        userWxOpenid: '',
        isContainDistributor: 1,
        size: 10
      },

      tip_flag: false,
      tip_text: '',
    }
  },
  methods: {
    showSpinner() {
      Indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      })
    },
    getAllList(val) {
      this.showSpinner()
      let obj = Object.assign({}, this.pa, { page: this.all_page })
      // alert(JSON.stringify(obj))
      reqDistriOrderList(obj).then((res) => {
        if (res.data.code == 0) {
          for (let i of res.data.data) {
            this.all_list.push(i)
          }
          this.all_page++
        }
        if (this.all_list.length == 0) {
          this.tip_text = '您还没有分销商订单'
          this.tip_flag = true
        }
        this.$refs.loadmore.onTopLoaded()
        if (this.$refs.loadmore.bottomStatus == 'loading') {
          this.$refs.loadmore.onBottomLoaded()
        }
        Indicator.close()
      })
    }
  },
  activated() {
    this.pa.userWxOpenid = JSON.parse(sessionStorage.getItem('ebay-app')).userWxOpenid
 	this.getAllList()
  },
  deactivated() {
    this.all_page = 0
    this.all_list = []
  }
}

</script>
<style lang="scss">
.order-flow {
  padding: 10px 0;
}

.pay-b {
  height: 28px;
  width: 80px;
}

.order-des {
  margin: 12px 0;
  font-size: 14px;
  div {
    margin: 8px 0;
    label {
      color: gray;
    }
  }
  .order-status {
    color: #ef4f4f;
  }
}

.cell-margin {
  margin: 10px 0 10px 0;
}

.mint-navbar .mint-tab-item.is-selected {
  border-bottom: 2px solid #0099f7;
  margin-bottom: -2px;
}

.mint-tab-item-label {
  font-size: 16px !important;
}

.order-wrap {
  margin-top: 54px;
  margin-bottom: 100px;
}

.to-top {
  position: fixed;
  width: 32px;
  height: 24px;
  bottom: 82px;
  right: 16px;
  color: rgb(255, 255, 255);
  background: rgba(51, 51, 51, .6);
  text-align: center;
  padding-top: 8px;
   :active {
    background: #504444;
  }
}

.goods-list {
  padding: 5px;
  /*     height: 86px;
    width: 110px; */
  line-height: 26px;
  display: flex;
  .avatar {
    flex: 0 0 70px;
    background-size: 70px auto!important;
  }
  .right {
    // flex: 1 0 auto;
    padding-left: 20px;
    padding-top: 6px;
    .title {
      overflow: hidden;
      font-size: 16px;
      line-height: 20px; // width: 220px;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      word-wrap: break-word;
      word-break: break-all;
    }
    .num {
      margin-top: 5px;
      color: #999;
    }
    .price {
      color: #ef4f4f;
    }
    button {
      position: absolute;
      bottom: 16px;
      height: 27px;
      width: 100px;
    }
  }
}

</style>
