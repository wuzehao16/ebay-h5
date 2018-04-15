<template>
	<div>logining...</div>
</template>

<script>
import {baseUrl} from '../../api'

export default {
	data () {
		return {

		}
	},
	mounted() {
		let path = this.$route.params.path
	    let returnUrl = location.protocol + "//" + location.host
	    			+ (path || '/product/list')
	    console.log('returnUrl:', returnUrl)
	    window.location.href = baseUrl + '/sell/wechat/authorize?returnUrl=' + returnUrl
	}
}
</script>
