<template>
	<view class="mine">
		<view class="top">
			<view class = "avatarUrl">
				<image>头像</image>
			</view>
			<view>
				<view class = "text">
					<text>用户昵称</text>
				</view>
				<view class="userName">
					<input />
				</view>
			</view>
			<view>
				<view class="problem">
					<icon class="headSet"></icon>
				</view>
			</view>
		</view>
		
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
