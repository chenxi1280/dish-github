<template>
	<view class="web-view">
		<web-view class="cookie" :src="src"></web-view>
	</view>
</template>

<script>
	export default {
		data () {
			return {
				src: null
			}
		},
		onLoad(option) {
			const uuid = Math.random().toString(36).substring(2)
			this.src = "https://wanxiangchengzhen.com/cooookie/#/pages/mine/vr/vr?pkArtworkId=" + option.pkArtworkId+"&uuid="+uuid
			console.log("***********************web-view url: ",this.src)
		},
		methods: {
		}
	}
</script>

<style  lang="scss">
	page{
		width: 100%;
		height: 100%;
	}
	.web-view{
		width: 100%;
		height: 100%;
	}
</style>
