<template>
	<view class="mine">
		<u-sticky>
			<view class="top_box" @click="hiddenTips">
				<view class="top">
					<view class="author_box" v-if="loginedFlag">
						<view class = "avatarUrl" v-if="realFlag">
							<image :src="image" ></image>
						</view>
						<view class = "unreal"  v-if="!realFlag">
							<text>没有头像</text>
						</view>
						<view class="userinfo">
							<view class="userName">
								<input disabled="true" :value="userName" />
							</view>
						</view>
					</view>
					<view class="wx_author_box" v-if="!loginedFlag">
						<view class = "wx_avatarUrl">
							<open-data type="userAvatarUrl"></open-data>
						</view>
						<view class="wx_userinfo">
							<open-data type="userNickName" lang="zh_CN"></open-data>
						</view>
					</view>
					<view>
						<view class="problem" @click="customerService">
							<icon class="headset"></icon>
						</view>
					</view>
				</view>
				<view class="mid">
					<view class="loginBtn" v-if="!loginedFlag">
						<a @click="toLoginPage">登录灵巫互动账号</a>
					</view>
					<view class="logined" v-if="loginedFlag">
						<text>已登录</text>
					</view>
				</view>
				<u-subsection :list="items" :current="current" @change="sectionChange"></u-subsection>
			</view>
		</u-sticky>
		<view class="bottom">
			<view class="content">
				<view v-if="current === 0">
					<verfied ref="verfied"></verfied>
					<u-back-top :scroll-top="scrollTop"></u-back-top>
				</view>
				<view v-if="current === 1">
					<published  ref="published"></published>
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
	import { globalBus } from '../../common/js/util.js'
	
	export default {
		data () {
			return {
				items: ['已审核','已发布'],
				current: 0,
				image: '',
				userName: '',
				scrollTop: 0,
				//用户未上传头像开关
				realFlag: false,
				//是否登录开关
				loginedFlag: false
				
			}
		},
		components: {
		    'published': published,
			'verfied': verfied
		},
		onLoad(options) {
			uni.showShareMenu({
			  withShareTicket: true
			})
			this.current = uni.getStorageSync("mine_current")
			let token = uni.getStorageSync("token")
			if(token != null && typeof(token) != "undefined" && token.length != 0){
				// console.log("我去发请求")
				this.getMineInfo()
				this.loginedFlag = true
				//isLoginJump是否是从登录页面跳转过来的标志
				if(uni.getStorageSync('isLoginJump') == 0){
					this.$refs.verfied.getMineArtWorks(0)
					//使用完后置为 1
					uni.setStorageSync('isLoginJump', 1)
				}
			}
			uni.setStorageSync("mine_current",0)
		},
		onShareAppMessage (res) {
		    return {
		      title: '灵巫互动',
			  imageUrl: 'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/baseImg/1605600100857%E5%9C%86%E5%BD%A2%E7%94%A8JPG.jpg',
		      path: 'pages/mine/mine',
		      success: function (shareTickets) {
		        console.log(shareTickets + '成功');
		        // 转发成功
		      },
		      fail: function (res) {
		        console.log(res + '失败');
		        // 转发失败
		      },
		      complete: function (res) {
		        // 不管成功失败都会执行
		      }
		    }
		},
		onShareTimeline (res) {
			return {
			  title: '灵巫互动',
			  imageUrl: 'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/baseImg/1605600100857%E5%9C%86%E5%BD%A2%E7%94%A8JPG.jpg',
			  path: 'pages/mine/mine',
			  success: function (shareTickets) {
			    console.log(shareTickets + '成功');
			    // 转发成功
			  },
			  fail: function (res) {
			    console.log(res + '失败');
			    // 转发失败
			  },
			  complete: function (res) {
			    // 不管成功失败都会执行
			  }
			}
		},
		onReachBottom() {
			if(this.current == 0){
				console.log('我去拿数据2')
				this.$refs.verfied.getMineArtWorks();
			}else{
				this.$refs.published.getMineArtWorks();
			}
		},
		methods: {
			hiddenTips(){
				globalBus.$emit("tips");
			},
			// 前往登录页面
			toLoginPage (e) {
				e.cancelBubble = true;
				uni.navigateTo({
					url: "../login/login/login"
				})
			},
			onPageScroll(e) {
				this.scrollTop = e.scrollTop;
				globalBus.$emit("tips");
			},
			sectionChange(index) {
				this.current = index;
			},
			customerService(e){
				e.cancelBubble = true;
				uni.navigateTo({
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
					success: res => {
						if (res.data.status === 200) {
							this.userName = res.data.data.username
							this.image = res.data.data.userLogoUrl
							if(this.image){
								this.realFlag = true
							}else{
								this.realFlag = false
							}
						} 
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
						height: 200rpx;
						margin: 10rpx;
						image{	
							border-radius: 50%;
							width: 100%;
							height: 100%;
						}
					}
					.unreal{
						width: 200rpx;
						height: 200rpx;
						margin: 10rpx;
						border: 2rpx solid black;
						border-radius: 50%;
						text-align: center;
						text{
							line-height: 200rpx;
						}
					}
					.userinfo{
						width: 250rpx;
						height: 150rpx;
						padding: 40rpx 0 0 40rpx;
						margin: 20rpx 100rpx 0 0;
						input{
							margin: 20rpx 0 0 0;
							font-size: 30rpx;
							font-weight: bold;
						}
					}
				}
				.wx_author_box{
					display: flex;
					justify-content: space-between;
					width: 100%;
					height: 200rpx;
					border-radius: 16rpx;
					.wx_avatarUrl{
						width: 200rpx;
						height: 200rpx;
						margin: 10rpx;
						open-data{	
							border-radius: 50%;
							width: 100%;
							height: 100%;
						}
					}
					.wx_userinfo{
						width: 250rpx;
						height: 150rpx;
						padding: 80rpx 0 0 40rpx;
						margin-right: 100rpx;
						open-data{
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
				.logined{
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
