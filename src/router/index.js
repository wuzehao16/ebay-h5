import Vue from 'vue'
import Router from 'vue-router'

const PopularizeList = r => require.ensure([], () => r(require('@/components/popularize/List')), 'PopularizeList')
const AddGoods = r => require.ensure([], () => r(require('@/components/popularize/add')), 'AddGoods')
const Address = r => require.ensure([], () => r(require('@/components/order/address')), 'Address')
const AddressList = r => require.ensure([], () => r(require('@/components/order/addresslist')), 'AddressList')
const SettleOrder = r => require.ensure([], () => r(require('@/components/order/settleorder')), 'SettleOrder')

const UserCenter = r => require.ensure([], () => r(require('@/components/user/usercenter')), 'UserCenter')

const Wallet = r => require.ensure([], () => r(require('@/components/user/wallet')), 'Wallet')
const Client = r => require.ensure([], () => r(require('@/components/user/client')), 'Client')
const Withdraw = r => require.ensure([], () => r(require('@/components/user/withdraw')), 'Withdraw')


const OrderList = r => require.ensure([], () => r(require('@/components/order/orderlist')), 'OrderList')

const LogisticsInfo = r => require.ensure([], () => r(require('@/components/order/logisticsinfo')), 'LogisticsInfo')
const ProductList = r => require.ensure([], () => r(require('@/components/product/list')), 'ProductList')
const Register = r => require.ensure([], () => r(require('@/components/user/register')), 'Register')
const PorductDetail = r => require.ensure([], () => r(require('@/components/product/detail')), 'PorductDetail')
const AuthWechat = r => require.ensure([], () => r(require('@/components/auth/Auth')), 'AuthWechat')
const Shoppingcart = r => require.ensure([], () => r(require('@/components/order/Shoppingcart')), 'Shoppingcart')
const PcPreviewGoods = r => require.ensure([], () => r(require('@/components/popularize/PreviewGoods')), 'PcPreviewGoods')

Vue.use(Router)

let router = new Router({
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    console.log(savedPosition)
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


import {reqWechatUserInfo} from '../api'
import store from '@/store'
import {baseUrl} from '../api'
router.beforeEach((to, from, next) => {


  if (to.name == 'PcPreviewGoods') {
    next()
  } else {
    let user = JSON.parse( sessionStorage.getItem('ebay-app') )
    let openid = to.query.wxOpenid

    if (!user && !openid) {//未申请授权
      let returnUrl = location.protocol + "//" + location.host
            + (to.path || '/product/list')
      console.log('returnUrl:', returnUrl)
      returnUrl = window.encodeURIComponent(returnUrl)
      let aa = baseUrl + '/sell/wechat/authorize?returnUrl=' + returnUrl 
      window.location.href = aa

    } else if (!user && openid) {//已完成授权但未从后台获取已授权用户的信息
      console.log(22222)
      reqWechatUserInfo({openid}).then((res) => {
          console.log(res)
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
  }

/*  let obj = {
    id: '20',
    userWxOpenid: 'oyNDcwRQUAv0Oahba6SUlXLwobgw'
  }
  sessionStorage.setItem('ebay-app', JSON.stringify(obj))
  next()*/


})

router.afterEach((to, from) => {
  //特定页面不显示底部
    if (['PopularizeList', 'AddGoods', 'AddressList', 'Address', 'PorductDetail'].includes(to.name)) {
        store.state.showFoot = false
    } else {
        store.state.showFoot = true
    }  
})

export default router