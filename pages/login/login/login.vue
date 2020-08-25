<template>
	<view class="login">
		<view class="top">
			<view class="login_redirect_btn">登录
				<view>Welcome</view>
			</view>
			<view class="signin_redirect_btn" @click="toSigninPage">注册</view>
		</view>
		<view class="bottom">
			<form @submit="formSubmit">
				<view class="phoneBox">
					<icon class="phoneIcon"></icon>
					<input class="acount" type="text" placeholder="输入手机号"/>
				</view>
				<view class="pwdBox">
					<icon  class="pwdIcon"></icon>
					<input class="pwd" password placeholder="密码"/>
				</view>
				<view class="codeBox">
					<input class="code" />
					<view class="codeImage">
						<image src=""></image>
					</view>
				</view>
				<!-- form-type="submit" 点击按钮提交表单 -->
				<button class="login" type="default" plain="true" form-type="submit">登录</button>
			</form>
		</view>
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
	page{
		height: 100%;
	}
	.login {
		height: 100%;
		background-color: #F08080;
		.top{
			display: flex;
			justify-content: space-between;
			height: 500rpx;
			width: 750rpx;
			.login_redirect_btn {
				color: #FCFCFC;
				font-size: 50rpx;
				font-weight: bold;
				margin-left: 100rpx;
				margin-top: 100rpx;
			}
			.signin_redirect_btn{
				color: #FCFCFC;
				font-weight: bold;
				margin: 20rpx;
			}
		}
		.bottom{
			.phoneBox{
				border: 2rpx solid black;
				height: 92rpx;
				border-radius: 10rpx;
				width: 670rpx;
				margin: 0 auto;
				margin-top: 100rpx;
				display: flex;
				justify-content: flex-start;
				.acount{
					width: 100%;
					height: 100%;
				}
				.phoneIcon{
					background: url(../../../static/icon/手机.png) no-repeat center;
					width: 80rpx;
					height: 92rpx;
					background-size: 60rpx;
				}
			}
			.pwdBox{
				width: 670rpx;
				height: 92rpx;
				border: 2rpx solid black;
				border-radius: 10rpx;
				margin: 0 auto;
				margin-top: 50rpx;
				display: flex;
				justify-content: flex-start;
				.pwdIcon{
					background: url(../../../static/icon/密码.png) no-repeat center;
					width: 80rpx;
					height: 80rpx;
					background-size: 60rpx;
				}
				.pwd{
					width: 100%;
					height: 100%;
				}
			}
			.codeBox{
				width: 670rpx;
				height: 92rpx;
				/* border: 2rpx solid black; */
				border-radius: 10rpx;
				margin: 0 auto;
				margin-top: 50rpx;
				display: flex;
				justify-content: space-between;
				.code{
					border: 2rpx solid black;
					border-radius: 10rpx;
					height: 100%;
					width: 60%;
					padding-left: 40rpx;
				}
				.codeImage{
					border: 2rpx solid black;
					border-radius: 10rpx;
					height: 100%;
					width: 30%;
				}
			}
			.login{
				&:hover{
					background-color: #EBEBEB;
				}
				border: 2rpx solid black;
				width: 670rpx;
				margin: 0 auto;
				margin-top: 50rpx;
			}
		}
	}
</style>
