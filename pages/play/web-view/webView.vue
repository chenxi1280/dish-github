<template>
	<view class="web-view">
		<web-view class="dish" :src="src"></web-view>
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
			this.src = option.src //+ "&uuid=" + uuid
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

