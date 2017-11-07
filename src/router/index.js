import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
// import PreviewGoods from '@/components/popularize/PreviewGoods'
import PopularizeList from '@/components/popularize/List'
import AddGoods from '@/components/popularize/add'
import Address from '@/components/order/address'
import AddressList from '@/components/order/addresslist'
import SettleOrder from '@/components/order/settleorder'
import UserCenter from '@/components/user/usercenter'
import Wallet from '@/components/user/wallet'
import Client from '@/components/user/client'
import Withdraw from '@/components/user/withdraw'
import OrderList from '@/components/order/orderlist'
import LogisticsInfo from '@/components/order/logisticsinfo'
import PorductList from '@/components/product/list'
import Register from '@/components/user/register'
import PorductDetail from '@/components/product/detail'
import Shoppingcart from '@/components/order/Shoppingcart'

Vue.use(Router)

let router = new Router({
  routes: [
    {
   	  path: '/',
      name: 'Hello',
      redirect: '/product/list',
    },
/*    {
      path: '/popularize/preview',
      name: 'PreviewGoods',
      component: PreviewGoods
    },*/
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
      name: 'PorductList',
      component: PorductList
    },
    {
      path: '/product/detail',
      name: 'PorductDetail',
      component: PorductDetail
    },
    {
      path: '/user/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/order/shoppingcart',
      name: 'Shoppingcart',
      component: Shoppingcart
    }

  ]
})

router.beforeEach((to, from, next) => {

  // document.getElementById('app').scrollTop = 0

  let user = JSON.parse( sessionStorage.getItem('ebay-app') )
  if (!user) {
    let obj = {
      id: '1',
      userWxOpenid: '112233'
    }
    sessionStorage.setItem('ebay-app', JSON.stringify(obj))
  }
  setTimeout(() => {
    next()
  }, 100)
})

export default router