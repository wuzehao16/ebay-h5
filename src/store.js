import Vue from 'vue'
import Vuex from 'vuex'
import wx from 'weixin-js-sdk'

Vue.use(Vuex)

const state = {
	wx: wx,
	isConfiged: false,
	isIOS: !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
	count: 1,
	proListTop: 0,
	isLogin: false,
	showFoot: true,
	cartNeedRefresh: 'no',
	cartAmount: '',
	authPage: [ 'PopularizeList', 'AddGoods', 'Withdraw', ] //分销商才能进入的页面
}
const mutations = {
	add(state) {
		state.count += 1
	},
	changeLogin(state) {
		state.isLogin = true
	},
	setCartRefresh(state) {
		state.cartNeedRefresh = 'need'
	},
	resetCartStatus(state) {
		state.cartNeedRefresh = 'no'
	},
	changeCartAmount(state) {
		state.cartAmount = 'changed'
	},
	resetCartAmountFlag(state) {
		state.cartAmount = 'keep'
	}
}

export default new Vuex.Store({
	state,
	mutations
})