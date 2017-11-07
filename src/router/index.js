import Vue from 'vue'
import Router from 'vue-router'

const PopularizeList = () => import('@/components/popularize/List')
const AddGoods = () => import('@/components/popularize/add')
const Address = () => import('@/components/order/address')
const AddressList = () => import('@/components/order/addresslist')
const SettleOrder = () => import('@/components/order/settleorder')
const UserCenter = () => import('@/components/user/usercenter')
const Wallet = () => import('@/components/user/wallet')
const Client = () => import('@/components/user/client')
const Withdraw = () => import('@/components/user/withdraw')
const OrderList = () => import('@/components/order/orderlist')
const LogisticsInfo = () => import('@/components/order/logisticsinfo')
const ProductList = () => import('@/components/product/list')
const Register = () => import('@/components/user/register')
const PorductDetail = () => import('@/components/product/detail')
const Shoppingcart = () => import('@/components/order/Shoppingcart')

Vue.use(Router)

let router = new Router({
  routes: [
    {
   	  path: '/',
      name: 'Hello',
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