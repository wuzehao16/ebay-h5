import axios from 'axios' 

export const reqUserInfo = params => { return axios.get(`/sell/ebay/user/account/${params.id}`, params) }
//我的钱包
export const reqMyWallet = params => { return axios.get(`/sell/ebay/user/user/myWallet`, {params: params}) }
export const reqMyWalletCount = params => { return axios.get(`/sell/ebay/user/user/myWallet/count`, {params: params}) }
//我的订单列表
export const reqBuyerOrderList = params => { return axios.get(`/sell/ebay/user/user/myOrder`, {params: params}) }
export const reqBuyerOrderCreate = params => { return axios.post(`/sell/buyer/order/create`, params) }

//购物车
export const reqAddToShoppingCart = params => { return axios.post(`/sell/buyer/goodcar/add/${params.userId}`, params.goodCarForm) }
export const reqShoppingCartList = params => { return axios.get(`/sell/buyer/goodcar/list`, {params: params}) }
export const reqCartDelete = params => { return axios.delete(`/sell/buyer/goodcar/delete/${params.productId}/${params.userId}`) }


export const reqSellerProList = params => { return axios.get(`/sell/seller/product/list`, {params: params}) }

export const reqAddressList = params => { return axios.get(`/sell/ebay/user/userCnee/list`, {params: params}) }
export const reqAddressCreate = params => { return axios.post(`/sell/ebay/user/userCnee/create`, params) }
export const reqAddressDelete = params => { return axios.post(`/sell/ebay/user/userCnee/${params.id}/update`, params) }

export const reqMyCusCount = params => { return axios.get(`/sell/ebay/user/user/myCustomerCount`, {params: params}) }
export const reqMyCustomerList = params => { return axios.get(`/sell/ebay/user/user/myCustomer`, {params: params}) }


//成为分销商
export const reqUserUpdate = params => { return axios.post(`/sell/ebay/user/${params.id}/update`, params) }

export const reqProductList = params => { return axios.get(`/sell/buyer/product/list`,{params: params}) }
export const reqProductDetail = params => { return axios.get(`/sell/buyer/product/detail`, {params: params}) }

export const reqSellerProductSave = params => { return axios.post(`/sell/seller/product/save`, params) }
