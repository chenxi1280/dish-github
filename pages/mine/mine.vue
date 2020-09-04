<template>
	<view class="mine">
		<u-sticky>
			<view class="top_box">
				<view class="top">
					<view class="author_box">
						<view class = "avatarUrl">
							<image :src="image" ></image>
						</view>
						<view class="userinfo">
							<view class="userName">
								<input disabled="true" :value="userName" />
							</view>
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
					<verfied></verfied>
					<u-back-top :scroll-top="scrollTop"></u-back-top>
				</view>
				<view v-if="current === 1">
					<published></published>
					<u-back-top :scroll-top="scrollTop"></u-back-top>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import published from './published.vue'
	import verfied from './verfied.vue'
	import { baseURL } from '../login/config/config.js'
	
	export default {
		data () {
			return {
				items: ['已审核','已发布'],
				current: 0,
				image: '',
				userName: ''
			}
		},
		components: {
		    published,
			verfied
		},
		onLoad() {
			console.log("页面开始加载")
			this.getMineInfo();
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
			},
			async getMineInfo(){
				await uni.request ({
					url: baseURL + "/wxPersonalCenter/getWxUserInfo",
					method: 'POST',
					dataType: 'json',
					data: {
						token: uni.getStorageSync("token")
					},
					success: res=> {
						this.userName = res.data.data.username
						this.image = res.data.data.userLogoUrl
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.mine {
		.top_box{
			background-color: #FFFFFF;
			.top{
				display: flex;
				justify-content: space-between;
				width: 670rpx;
				margin: 0 auto;
				padding-top: 20rpx;
				.author_box{
					display: flex;
					justify-content: space-between;
					width: 100%;
					height: 200rpx;
					border-radius: 16rpx;
					.avatarUrl{
						width: 200rpx;
						height: 180rpx;
						margin: 10rpx;
						image{	
							border-radius: 50%;
							width: 100%;
							height: 100%;
						}
					}
					.userinfo{
						with: 250rpx;
						height: 150rpx;
						padding: 40rpx 0 0 40rpx;
						input{
							margin: 20rpx 0 0 0;
							font-size: 30rpx;
							font-weight: bold;
						}
					}
				}
				.problem{
					height: 50rpx;
					width: 50rpx;
					margin-left: 50rpx;
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
					font-size: 30rpx;
				}
			}
		}
		.bottom{
			background-color: #E3E3E3;
			margin-top: 20rpx;
		}
	}
	/*引入的组件样式*/
	.demo-warter {
		margin: 10rpx;
		border-radius: 16rpx;
		background-color: #FFFFFF;
		padding: 16rpx 16rpx 0rpx 16rpx;
		position: relative;
	}
</style>
