<template>
	<view class="mine">
		<view>个人中心页面</view>
		<view class="redirect_btn" @click="toLoginPage">点击前往登录页</view>
	</view>
</template>

<script>
	export default {
		data () {
			return {
			}
		},
		methods: {
			// 前往登录页面
			toLoginPage () {
				uni.navigateTo({
					url: "../login/login/login"
				})
			}
		}
	}
</script>

<style lang="scss">
	.mine {
		.redirect_btn {
			color: red;
		}
	}
</style>
