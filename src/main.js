// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import store from './store'
import App from './App'
import router from './router'
import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'
import '@/assets/fonts/iconfont.css'
import wx from 'weixin-js-sdk'
import util from './api/util'
// require('./api/vconsole.js')
Vue.use(Mint)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

Vue.prototype.formatTime = function (date, pattern) {
	if (date) {
		return util.formatDate.format(new Date(date), pattern)
	} else {
		return '--'
	}
}
Vue.prototype.goTop = function() {
  document.getElementById('app').scrollTop = 0
}
Vue.prototype.isIOS = function() {
	return !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
}
import {reqWechatSignature} from './api'

Vue.prototype.wxConfig = function () {
	let url = document.location.href
  // alert(url)
  // url = encodeURIComponent(url)
	reqWechatSignature({url}).then((res) => {
		if (res.data.code == 0) {
      let obj = Object.assign({
        debug: false, //true会有弹框
        jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline']
      }, res.data.data)
      store.state.wx.config(obj)
      store.state.isConfiged = true
		}
	})
}

Vue.prototype.wxShare = function(title, desc, link, imgUrl) {
	store.state.wx.ready(function(){
		store.state.wx.onMenuShareTimeline({
		    title: title, // 分享标题
		    link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
		    imgUrl: imgUrl, // 分享图标
		    success: function () {
		        // 用户确认分享后执行的回调函数
		    },
		    cancel: function () {
		        // 用户取消分享后执行的回调函数
		    }
		})
		store.state.wx.onMenuShareAppMessage({
		    title: title, // 分享标题
		    desc: desc, // 分享描述
        link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
		    imgUrl: imgUrl, // 分享图标
		    type: '', // 分享类型,music、video或link，不填默认为link
		    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
		    success: function () {
		        // 用户确认分享后执行的回调函数
            // alert(1)
		    },
		    cancel: function () {
		        // 用户取消分享后执行的回调函数
		        // console.log("cancel")
		    }
		})
	})
}
