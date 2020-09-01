<template>
	<view class="mine">
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
			<view class="line"></view>
		</view>
		<view class="bottom">
			<view class="major_title">
				<text>我的作品</text>
			</view>
			<view class="type_verify">
				<view class="title_verify">
					<text>已审核</text>
					<scroll-view scroll-x="true">
						<production
							v-for="(item, index) in currentPageData"
							:key="index"
							:authorName="item.userName"
							:workName="item.artworkName"
							:heatNum="item.heatNum"
							:logoPath="item.logoPath">
						</production>
					</scroll-view> 
				</view>
			</view>
			<view class="type_publish">
				<view class="title_publish">
					<text>已发布</text>
					<production
						v-for="(item, index) in currentPageData"
						:key="index"
						:authorName="item.userName"
						:workName="item.artworkName"
						:heatNum="item.heatNum"
						:logoPath="item.logoPath" >
					</production>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Production from '../../components/mine/product'
	export default {
		data () {
			return {
				loadingType: 0,
				contentText: {
				    contentdown: "上拉显示更多",
				    contentrefresh: "正在加载...",
				    contentnomore: "没有更多数据了"
				}
			}
		},
		components: {
		    Production
		  },
		methods: {
			// 产品列表数据
			  getNewsList: function() {//第一次回去数据
			    _self.loadingType = 0;
			    uni.showNavigationBarLoading();
			    uni.request({
				  url: 'api地址',
				  method:'POST',
				  data:{
					//请求参数
				  },
				  success: function(res) {
				    console.log(res.data.data)
					_self.hotRecommendlist = res.data.data.response;
					if(res.data.data.totalcount==res.data.data.response.length){
						uni.showToast({
							title: '已是最新',
							duration: 2000
						});
					}
					uni.hideNavigationBarLoading();//关闭加载动画
					uni.stopPullDownRefresh();//得到数据后停止下拉刷新
				  }
			     });
			 
			  },
			// 前往登录页面
			toLoginPage () {
				uni.redirectTo({
					url: "../login/login/login"
				})
			},
			onload(){
				// 产品列表数据默认加载	
				_self = this;
				this.getNewsList();
			}
		}
	}
</script>

<style lang="scss">
	.mine {
		.top{
			display: flex;
			justify-content: space-between;
			width: 670rpx;
			margin: 0 auto;
			margin-top: 20rpx;
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
			.loginBtn{
				text-align: center;
			}
			.line{
				margin-top: 20rpx;
				border: 2rpx solid #D1D1D1;
			}
		}
		.bottom{
			.major_title{
				margin-top: 20rpx;
			}
			.type_verify{
				margin-top: 20rpx;
				.title_verify{
					
				}
				text{
					
				}
				
			}
			.type_publish{
				margin-top: 500rpx;
				.title_publish{
					
				}
				text{
					
				}
			}
		}
	}
</style>
