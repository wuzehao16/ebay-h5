import Vue from 'vue'
import Router from 'vue-router'

const PopularizeList = r => require.ensure([], () => r(require('@/components/popularize/List')), 'PopularizeList')
const AddGoods = r => require.ensure([], () => r(require('@/components/popularize/add')), 'AddGoods')
const Address = r => require.ensure([], () => r(require('@/components/order/address')), 'Address')
const AddressList = r => require.ensure([], () => r(require('@/components/order/addresslist')), 'AddressList')
const SettleOrder = r => require.ensure([], () => r(require('@/components/order/settleorder')), 'SettleOrder')

const UserCenter = r => require.ensure([], () => r(require('@/components/user/usercenter')), 'UserCenter')
const Distributor = r => require.ensure([], () => r(require('@/components/user/distributor')), 'Distributor')
const Wallet = r => require.ensure([], () => r(require('@/components/user/wallet')), 'Wallet')
const Client = r => require.ensure([], () => r(require('@/components/user/client')), 'Client')
const Withdraw = r => require.ensure([], () => r(require('@/components/user/withdraw')), 'Withdraw')

const DistriOrderList = r => require.ensure([], () => r(require('@/components/order/distriorderlist')), 'DistriOrderList')

const OrderList = r => require.ensure([], () => r(require('@/components/order/orderlist')), 'OrderList')
const OrderDetail = r => require.ensure([], () => r(require('@/components/order/orderdetail')), 'OrderDetail')

const LogisticsInfo = r => require.ensure([], () => r(require('@/components/order/logisticsinfo')), 'LogisticsInfo')
const ProductList = r => require.ensure([], () => r(require('@/components/product/list')), 'ProductList')
const Register = r => require.ensure([], () => r(require('@/components/user/register')), 'Register')
const PorductDetail = r => require.ensure([], () => r(require('@/components/product/detail')), 'PorductDetail')
const AuthWechat = r => require.ensure([], () => r(require('@/components/auth/Auth')), 'AuthWechat')
const Shoppingcart = r => require.ensure([], () => r(require('@/components/order/Shoppingcart')), 'Shoppingcart')
const PcPreviewGoods = r => require.ensure([], () => r(require('@/components/popularize/PreviewGoods')), 'PcPreviewGoods')
const IndexType = r => require.ensure([], () => r(require('@/components/product/IndexType')), 'IndexType')
const ProductList1 = r => require.ensure([], () => r(require('@/components/product/list1')), 'ProductList1')


Vue.use(Router)

let router = new Router({
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  },
  routes: [
    {
   	  path: '/',
      redirect: '/product/list',
    },
    {
      path: '/popularize/list',
      name: 'PopularizeList',
      component: PopularizeList
    },
    {
      path: '/popularize/add',
      name: 'AddGoods',
      component: AddGoods
    },
    {
      path: '/popularize/pc_preview/:id',
      name: 'PcPreviewGoods',
      component: PcPreviewGoods
    },
    {
      path: '/order/address',
      name: 'Address',
      component: Address
    },
    {
      path: '/order/addresslist',
      name: 'AddressList',
      component: AddressList
    },
    {
      path: '/order/settleorder',
      name: 'SettleOrder',
      component: SettleOrder
    },
    {
      path: '/user/usercenter',
      name: 'UserCenter',
      component: UserCenter
    },
    {
      path: '/user/distributor',
      name: 'Distributor',
      component: Distributor
    },
    {
      path: '/user/wallet',
      name: 'Wallet',
      component: Wallet
    },
    {
      path: '/user/client',
      name: 'Client',
      component: Client
    },
    {
      path: '/user/withdraw',
      name: 'Withdraw',
      component: Withdraw
    },
    {
      path: '/order/list',
      name: 'OrderList',
      component: OrderList
    },
    {
      path: '/order/distrilist',
      name: 'DistriOrderList',
      component: DistriOrderList
    },
    {
      path: '/order/detail',
      name: 'OrderDetail',
      component: OrderDetail
    },
    {
      path: '/order/logistics',
      name: 'LogisticsInfo',
      component: LogisticsInfo
    },
    {
      path: '/product/list',
      name: 'ProductList',
      component: ProductList
    },
    {
      path: '/product/list1/:id',
      name: 'ProductList1',
      component: ProductList1
    },
    {
      path: '/product/index/:index',
      name: 'IndexType',
      component: IndexType
    },
    {
      path: '/product/detail/:id',
      name: 'PorductDetail',
      component: PorductDetail
    },
    {
      path: '/user/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/auth',
      name: 'AuthWechat',
      component: AuthWechat
    },
    {
      path: '/order/shoppingcart',
      name: 'Shoppingcart',
      component: Shoppingcart
    },
    {
      path: '*',
      redirect: '/product/list'
    }

  ]
})

import {reqWechatUserInfo, reqWechatSignature} from '../api'
import store from '@/store'
import {baseUrl} from '../api'
import { MessageBox } from 'mint-ui'
router.beforeEach((to, from, next) => {
  if (to.name == 'PcPreviewGoods') {
    next()
  } else {
    let user = JSON.parse( sessionStorage.getItem('ebay-app') )
    let openid = to.query.wxOpenid

    if (!user && !openid) {//未申请授权
      let returnUrl = location.protocol + "//" + location.host
            + (to.path || '/product/list')
      returnUrl = window.encodeURIComponent(returnUrl)
      let aa = baseUrl + '/sell/wechat/authorize?returnUrl=' + returnUrl
      window.location.href = aa

    } else if (!user && openid) {//已完成授权但未从后台获取已授权用户的信息
      reqWechatUserInfo({openid}).then((res) => {
        if (res.data.code == 0) {
          let obj = res.data.data
          sessionStorage.setItem('ebay-app', JSON.stringify(obj))
          next()
        } else {
          next('/product/list')
        }
      }).catch((err) => {})
    } else {
      if (user.userCtype && user.userCtype == '2'
        && store.state.authPage.includes(to.name)) {
        MessageBox.confirm('分销商才有权限进入，去注册成为分销商?').then(action => {
          next('/user/register')
        }).catch(err => {
          if (from.name) {
            next(false)
          } else {
            next('/product/list')
          }
        })
      } else {
        next()
      }
    }
  }

//   let user = {
//     id: '4',
//     userWxOpenid: 'oyNDcwRQUAv0Oahba6SUlXLwobgw',
//     userCtype: '1',
//     userPhone: '13877887788',
//     userAddr: 'xxx省uu市fddkjflkj',
//     userWxName: 'Cons.Van'
//   }
//   sessionStorage.setItem('ebay-app', JSON.stringify(user))
// next()


/*  let user = JSON.parse( sessionStorage.getItem('ebay-app') )

  if (user.userCtype && user.userCtype == '2'
     && store.state.authPage.includes(to.name)) {
    MessageBox.confirm('分销商才有权限进入，去注册成为分销商?').then(action => {
      next('/user/register')
    }).catch(err => {
      next(false)
    })

  } else {
    next()
  }*/


})

router.afterEach((to, from) => {
  //特定页面不显示底部
    if ([ 'AddressList', 'Address', 'OrderDetail', 'PcPreviewGoods',
       'PorductDetail', 'SettleOrder', 'Withdraw', 'Register', 'LogisticsInfo' ].includes(to.name)) {
        store.state.showFoot = false
    } else {
        store.state.showFoot = true
    }

    //微信分享： IOS第一次加签，之后不变
    //如是非IOS, 每进需要分享的页面重新加签
    if (!store.state.isConfiged && store.state.isIOS ) {
      reqWechatSignature({url: document.location.href}).then((res) => {
        if (res.data.code == 0) {
          let obj = Object.assign({
            debug: false,//true会有弹框
            jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline']
          }, res.data.data)
          store.state.wx.config(obj)
          store.state.isConfiged = true
        }
      })
    }
})

export default router
