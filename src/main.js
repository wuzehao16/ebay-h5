// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'
// import 'normalize.css'
import '@/assets/fonts/iconfont.css'
import '@/assets/fonts/font-awesome.css'
import wx from 'weixin-js-sdk'
Vue.use(Mint)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

import {reqWechatSignature} from './api'
Vue.prototype.wxShare = function(title, desc, link, imgUrl) {
	let url = document.location.href
	reqWechatSignature({url}).then((res) => {
		console.log("res", res)
		if (res.data.code == 0) {
			let obj = Object.assign({
				debug: true,
				jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline']
			}, res.data.data)
			console.log("config:", obj)
			wx.config(obj)		
		}

	})

	wx.ready(function(){
		wx.onMenuShareTimeline({
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
		wx.onMenuShareAppMessage({
		    title: title, // 分享标题
		    desc: desc, // 分享描述
		    link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
		    imgUrl: imgUrl, // 分享图标
		    type: '', // 分享类型,music、video或link，不填默认为link
		    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
		    success: function () { 
		        // 用户确认分享后执行的回调函数

		    },
		    cancel: function () { 
		        // 用户取消分享后执行的回调函数
		        console.log("cancel")
		    }
		})
	})
}

