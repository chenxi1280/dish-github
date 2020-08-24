<template>
	<view class="login">
		<view class="redirect_btn" @click="toSigninPage">点击前往注册页面</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			toSigninPage () {
				uni.navigateTo({
					url: "../signin/signin"
				})
			}
		}
	}
</script>

<style lang="scss">
	.login {
		.redirect_btn {
			color: red;
		}
	}
</style>
