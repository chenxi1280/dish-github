<template>
	<view class="mine">
			<u-sticky>
			<view class="top">
				<view class = "avatarUrl">
					<image></image>
				</view>
				<view class="userinfo">
					<view class = "text">
						<text>用户昵称</text>
					</view>
					<view class="userName">
						<input />
						<view class="line"></view>
					</view>
				</view>
				<view>
					<view class="problem">
						<icon class="headset"></icon>
					</view>
				</view>
			</view>
			<view class="mid">
				<view class="loginBtn">
					<a @click="toLoginPage">登录四刻互动账号</a>
				</view>
			</view>
		</u-sticky>
		<view class="bottom">
			<u-subsection :list="items" :current="0" @change="sectionChange"></u-subsection>
			<view class="content">
				<view v-if="current === 0">
					<published></published>
					<u-back-top :scroll-top="scrollTop"></u-back-top>
				</view>
				<view v-if="current === 1">
					<verfied></verfied>
					<u-back-top :scroll-top="scrollTop"></u-back-top>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import published from './published.vue'
	import verfied from './verfied.vue'
	export default {
		data () {
			return {
				items: ['已审核', '已发布'],
				current:0
			}
		},
		components: {
		    published,
			verfied
		  },
		methods: {
			// 前往登录页面
			toLoginPage () {
				uni.redirectTo({
					url: "../login/login/login"
				})
			},
			sectionChange(index) {
				this.current = index;
			},
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	.mine {
		.top{
			display: flex;
			justify-content: space-between;
			width: 670rpx;
			margin: 0 auto;
			margin-top: 20rpx;
			background-color: white;
			.avatarUrl{
				border: 2rpx solid black;
				with: 200rpx;
				height: 250rpx;
				image{				
					width: 250rpx;
					height: 100%;
				}
			}
			
			.userinfo{
				/* border: 2rpx solid black; */
				with: 250rpx;
				height: 150rpx;
				margin-left: 20rpx;
				input{
					margin-top: 50rpx;
					margin-left: 10rpx;
				}
				.line{
					border: 2rpx solid #D1D1D1;
					margin-left: 10rpx;
				}
			}
			
			.problem{
				/* border: 2rpx solid black; */
				height: 50rpx;
				width: 50rpx;
				margin-left: 20rpx;
				.headset{
					background: url(../../static/icon/headset.png) center no-repeat;
					width: 100%;
					height: 100%;
					background-size: 50rpx;
				}	
			}
		}
		
		.mid{
			margin-top: 40rpx;
			background-color: white;
			.loginBtn{
				text-align: center;
			}
		}
		.bottom{
			margin-top: 20rpx;
		}
	}
</style>
