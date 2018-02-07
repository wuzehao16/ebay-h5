import axios from 'axios' 

// test
// axios.defaults.baseURL = 'http://fks3989.tunnel.qydev.com'

export const baseUrl = (process.env.NODE_ENV === 'production') ? 'http://www.wstsoftware.com' : 'http://fks3989.free.ngrok.cc'

export const staticBase = (process.env.NODE_ENV === 'production') ? '' : '/static'

export const reqAddressJson = params => { return axios.get(`${staticBase}/resource/address4.json`) }
export const reqIsoCountryJson = params => { return axios.get(`${staticBase}/resource/isoCountry.json`) }


export const reqLogistics = params => { return axios.get(`/sell/ebay/logistics/order/getTracking/${params.logisticsNo}`)}

export const reqUserInfo = params => { return axios.get(`/sell/ebay/user/account/${params.id}`, params) }
//我的钱包
export const reqMyWallet = params => { return axios.get(`/sell/ebay/user/user/myWallet`, {params: params}) }
export const reqMyWalletCount = params => { return axios.get(`/sell/ebay/user/user/myWallet/count`, {params: params}) }

//提现
export const reqWithdrawCreate = params => { return axios.post(`/sell/user/account/withdraw/create`, params) }
//微信支付
export const reqPayCreate = params => { return axios.get(`/sell/pay/create`, {params: params}) }

//我的订单列表
export const reqBuyerOrderList = params => { return axios.get(`/sell/ebay/user/user/myOrder`, {params: params}) }
export const reqBuyerOrderDetail = params => { return axios.get(`/sell/buyer/order/detail/${params.openid}/${params.orderId}`) }
export const reqBuyerOrderCreate = params => { return axios.post(`/sell/buyer/order/create`, params) }
export const reqBuyerOrderEdit = params => { return axios.put(`/sell/buyer/order/save`, params) }
export const reqBuyerOrderCancel = params => { return axios.post(`/sell/buyer/order/cancel/${params.openid}/${params.orderId}`, params) }
//分销商订单


//购物车
export const reqAddToShoppingCart = params => { return axios.post(`/sell/buyer/goodcar/add/${params.userId}`, params.goodCarForm) }
export const reqShoppingCartList = params => { return axios.get(`/sell/buyer/goodcar/list/${params.userId}/0/1000`) }
export const reqCartDelete = params => { return axios.delete(`/sell/buyer/goodcar/delete/${params.productId}/${params.userId}?itemId=${params.itemId}`) }

export const reqSellerProList = params => { return axios.get(`/sell/seller/product/list`, {params: params}) }

export const reqAddressList = params => { return axios.get(`/sell/ebay/user/userCnee/list`, {params: params}) }
export const reqAddressCreate = params => { return axios.post(`/sell/ebay/user/userCnee/create`, params) }
export const reqAddressDelete = params => { return axios.post(`/sell/ebay/user/userCnee/${params.id}/update`, params) }

export const reqMyCusCount = params => { return axios.get(`/sell/ebay/user/user/myCustomerCount`, {params: params}) }
export const reqMyCustomerList = params => { return axios.get(`/sell/ebay/user/user/myCustomer`, {params: params}) }

//成为分销商
export const reqUserUpdate = params => { return axios.post(`/sell/ebay/user/${params.id}/update`, params) }

export const reqProductList = params => { return axios.get(`/sell/buyer/product/list`,{params: params}) }
export const reqProductDetail = params => { return axios.get(`/sell/buyer/product/detail/${params.productId}`) }

export const reqSellerProductSave = params => { return axios.put(`/sell/seller/product/save`, params) }

//获取ebay商品
export const reqEbayGoods = params => { return axios.get(`/sell/ebay/getGoodsInfo`, { params: params }) }

//微信授权
export const reqWechatAuth = params => { return axios.get(`/sell/wechat/authorize`, { params: params }) }
//获取授权链接
export const reqWechatUrl = params => { return axios.get(`/sell/wechat/authorizeUrl`, { params: params}) }
//微信分享
export const reqWechatSignature = params => { return axios.get(`/sell/wechat/signature`, { params: params }) }
//openid获取信息
export const reqWechatUserInfo = params => { return axios.get(`/sell/wechat/getUserInfo`, { params: params }) }

