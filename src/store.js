import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
	count: 1,
	isLogin: false
}
const mutations = {
	add(state) {
		state.count += 1
	},
	changeLogin(state) {
		state.isLogin = true
	}
}

export default new Vuex.Store({
	state,
	mutations
})