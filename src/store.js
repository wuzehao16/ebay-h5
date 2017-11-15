import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
	count: 1,
	isLogin: false,
	showFoot: true,
	cartNeedRefresh: 'no',
	cartAmount: ''
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