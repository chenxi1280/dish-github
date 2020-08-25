<template>
	<view class="signin">
		<view class="top">嗨！你好
				<view>欢迎注册四刻互动视频</view>
		</view>
		<view class="content">
			<form @submit="formSubmit">
				<view class="userBox">
					<input class="userName" type="text" placeholder="昵称"/>
				</view>
				<view class="userBox">
					<input class="phone" type="text" placeholder="手机号"/>
				</view>
				<view class="userBox">
					<input class="pwd" password placeholder="密码"/>
				</view>
				<view class="userBox">
					<input class="confirmPwd" password placeholder="确认密码"/>
				</view>
				<view class="codeBox">
					<input class="code" />
					<view class="codeImage">
						<image src=""></image>
					</view>
				</view>
				<view class="phoneCodeBox">
					<input class="phoneCode" />
					<view class="button">
						<button class="getPhoneCode" plain="true">获取短信验证码</button>
					</view>
				</view>
				<!-- form-type="submit" -->
				<button class="signin-btn" type="default" plain="true" >注册</button>
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
			
		}
	}
</script>

<style lang="scss">
	.signin{
		height: 100%;
		background-color: #F08080;
		overflow: hidden;
		.top{
			height: 200rpx;
			width: 750rpx;
			color: #FCFCFC;
			font-size: 40rpx;
			font-weight: bold;
			margin-left: 100rpx;
			margin-top: 100rpx;
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
		
		.phoneCodeBox{
			width: 670rpx;
			height: 92rpx;
			/* border: 2rpx solid black; */
			border-radius: 10rpx;
			margin: 0 auto;
			margin-top: 50rpx;
			display: flex;
			justify-content: space-between;
			.phoneCode{
				border: 2rpx solid black;
				border-radius: 10rpx;
				height: 100%;
				width: 30%;
				padding-left: 40rpx;
			}
			.button{
				border-radius: 10rpx;
				height: 100%;
				width: 60%;
				.getPhoneCode{
					font-size: 30rpx;
					width: 100%;
					height: 100%;
				}
			}
		}
		
		.userBox{
			width: 670rpx;
			height: 92rpx;
			border: 2rpx solid black;
			border-radius: 10rpx;
			margin: 0 auto;
			display: flex;
			justify-content: flex-start;
			.userName{
				width: 100%;
				height: 100%;
			}
		}
		
		.userBox{
			width: 670rpx;
			height: 92rpx;
			border: 2rpx solid black;
			border-radius: 10rpx;
			margin: 0 auto;
			margin-top: 50rpx;
			display: flex;
			justify-content: flex-start;
			.phone{
				width: 100%;
				height: 100%;
			}
			.pwd{
				width: 100%;
				height: 100%;
			}
			.confirmPwd{
				width: 100%;
				height: 100%;
			}
		}
		
		.content{
			.signin-btn{
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
