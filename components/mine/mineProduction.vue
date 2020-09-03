<template>
	<view>
		<!-- #ifdef MP-WEIXIN -->
		<view v-if="inputFlag" class="tips" >
			<view class="work_publish">
				<button class="btn_publish">发布作品</button>
				<view class="line"></view>
			</view>
			<view class="work_code">
				<button class="btn_code">作品二维码</button>
				<view class="line"></view>
			</view>
			<view class="work_delete">
				<button class="btn_delete">删除</button>
			</view>
		</view>
		<view class="icon_box" @click="showTips">
			<icon class="more_icon"></icon>
		</view>
		<view class="demo-img-wrap">
			<image class="demo-image" :src="image" mode="widthFix"></image>
		</view>
		<!-- #endif -->
		<view class="padding_box">
			<view class="work_info">
				<view class="demo-title">
					{{title}}
				</view>
				<view class="demo-price">
					{{price}}元
				</view>
				<view class="demo-tag">
					<view class="demo-tag-owner">
						自营
					</view>
					<view class="demo-tag-text">
						放心购
					</view>
				</view>
				<view class="demo-shop">
					{{shop}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				localFlag: false
			}
		},
		props: {
			price: {
				type: Number,
				default: 35
			},
			title: {
				type: String,
				default: '北国风光，千里冰封，万里雪飘'
			},
			shop: {
				type: String,
				default: '李白杜甫白居易旗舰店'
			},
			image: {
				type: String,
				default: 'http://pic.sc.chinaz.com/Files/pic/pic9/202002/zzpic23327_s.jpg'
			},
			inputFlag: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			showTips() {
				this.localFlag = !this.localFlag;
				console.log(this.localFlag)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.tips{
		border: 2rpx solid black;
		z-index: 10;
		width: 160rpx;
		height: 210rpx;
		border-radius: 10rpx;
		position: absolute;
		top: 20%;
		left: 50%;
		transform: translateX(-50%);
		.work_publish{
			width: 100%;
			height: 70rpx;
			box-sizing: border-box;
			
			position: relative;
			.btn_publish{
				line-height: 70rpx;
				text-align: center;
				font-size: 20rpx;
				color: white;
				background-color: rgba(0,0,0,.4);
				&:hover{
					background: #D3D3D3;
				};
			}
			.line{
				position: absolute;
				bottom: 0;
				width: 100%;
				border: 2rpx solid #D1D1D1;
			}
		}
		.work_code{
			width: 100%;
			height: 70rpx;
			box-sizing: border-box;
			position: relative;
			.btn_code{
				line-height: 70rpx;
				text-align: center;
				font-size: 20rpx;
				color: white;
				background-color: rgba(0,0,0,.4);
				&:hover{
					background: #D3D3D3;
				};
			}
			.line{
				position: absolute;
				bottom: 0;
				width: 100%;
				border: 2rpx solid #D1D1D1;
			}
		}
		.work_delete{
			width: 100%;
			height: 70rpx;
			.btn_delete{
				line-height: 70rpx;
				text-align: center;
				font-size: 20rpx;
				color: white;
				background-color: rgba(0,0,0,.4);
				&:hover{
					background: #D3D3D3;
				};
			}
		}
	}
	.icon_box{
		// border: 2rpx solid red;
		width: 50rpx;
		height: 30rpx;
		position: absolute;
		right: 26rpx;
		top: 26rpx;
		border-radius: 16rpx;
		background-color: rgba(0,0,0,.2);
		.more_icon{
			background: url(../../static/icon/more.png) center no-repeat;
			width: 100%;
			height: 100%;
			background-size: 30rpx;
		}
	}
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
		bottom: 18rpx;
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
</style>
