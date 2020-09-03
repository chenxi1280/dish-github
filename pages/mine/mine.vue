<template>
	<view class="mine">
		<u-sticky>
			<view class="top_box">
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
						<view class="problem" @click="customerService">
							<icon class="headset"></icon>
						</view>
					</view>
				</view>
				<view class="mid">
					<view class="loginBtn">
						<a @click="toLoginPage">登录四刻互动账号</a>
					</view>
				</view>
				<u-subsection :list="items" :current="0" @change="sectionChange"></u-subsection>
			</view>
		</u-sticky>
		<view class="bottom">
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
	import published from '../../components/mine/published.vue'
	import verfied from '../../components/mine/verfied.vue'
	export default {
		data () {
			return {
				items: ['已发布','已审核'],
				current:0
			}
		},
		components: {
		    // published,
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
			customerService(){
				uni.redirectTo({
					url: "./customService/customService"
				})
			}
		}
	}
</script>

<style lang="scss">
	.demo-warter {
		border-radius: 16rpx;
		margin: 10rpx;
		background-color: #ffffff;
		padding: 16rpx 16rpx 0 16rpx;
		position: relative;
		.demo-img-wrap{
			.demo-image {
				width: 100%;
				border-radius: 8rpx;
			}
		}
		.padding_box{
			width: 100%;
			padding: 0 16rpx;
			position: absolute;
			left: 0;
			bottom: 50rpx;
			.work_info{
				width: 100%;
				background-color: rgba(0,0,0,.4);
				.demo-title {
						font-size: 22rpx;
						margin: 10rpx 0 0 0;
						color: white;
				}
					
				.demo-price {
					font-size: 22rpx;
					color: white;
					margin: 5rpx 0 0 0;
				}
					
				.demo-tag {
					display: flex;
					margin: 10rpx 0 0 0;
					.demo-tag-owner {
						background-color: $u-type-error;
						color: #FFFFFF;
						display: flex;
						align-items: center;
						padding: 4rpx 14rpx;
						border-radius: 50rpx;
						font-size: 22rpx;
						line-height: 1;
					}
						
					.demo-tag-text {
						border: 2rpx solid $u-type-primary;
						color: $u-type-primary;
						margin-left: 20rpx;
						border-radius: 50rpx;
						line-height: 1;
						padding: 4rpx 14rpx;
						display: flex;
						align-items: center;
						border-radius: 50rpx;
						font-size: 22rpx;
					}
					}
				.demo-shop {
					font-size: 22rpx;
					color: white;
					margin: 10rpx 0 0 0;
				}
			}
		}
	}
	.mine {
		.top_box{
			background-color: #ffffff;
			.top{
				display: flex;
				justify-content: space-between;
				width: 670rpx;
				margin: 0 auto;
				padding-top: 20rpx;
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
				margin: 40rpx 0 20rpx 0;
				.loginBtn{
					text-align: center;
					font-size: 36rpx;
				}
			}
		}
		.bottom{
			margin-top: 20rpx;
		}
	}
</style>
