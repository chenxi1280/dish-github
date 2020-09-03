<template>
	<view>
		<view v-if="localFlag" class="tips" >
			<view class="work_publish">
				<button class="btn_publish" @click="publishArtWork">发布作品</button>
				<view class="line"></view>
			</view>
			<view class="work_code">
				<button class="btn_code"  @click="getArtWorkCode">作品二维码</button>
				<view class="line"></view>
			</view>
			<view class="work_delete">
				<button class="btn_delete" @click="deleteArtWorkCode">删除</button>
			</view>
		</view>
		<view class="icon_box" @click="showTips">
			<icon class="more_icon"></icon>
		</view>
		<view class="demo-img-wrap">
			<image class="demo-image" :src="image" mode="widthFix" ></image>
		</view>
		<view class="padding_box">
			<view class="work_info">
				<view class="demo-title">
					{{title}}
				</view>
				<view class="hot_box">
					<view class="hot_icon_box">
						<icon></icon>
					</view>
					<view class="demo-price">{{broadcastCount}}</view>
				</view>
			</view>
		</view>
		<view class="mask" v-if="localFlag" @click="hiddenTips"></view>
	</view>
</template>

<script>
	import { baseURL } from '../../pages/login/config/config.js'
	
	export default {
		data() {
			return {
				localFlag: false
			}
		},
		props: {
			broadcastCount: {
				type: Number,
				default: 88888
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
			xid: {
				type: Number,
			}
		},
		methods: {
			showTips() {
				this.localFlag = true;
			},
			hiddenTips(){
				this.localFlag = false;
			},
			async publishArtWork(){
				console.log(this.xid)
				await uni.request ({
					url: baseURL + "/ecmArtWorkManager/modifyArtWorksStatus",
					method: 'POST',
					dataType: 'json',
					data: {
						pkArtworkId: this.xid,
						code: 'publish'
					},
					success: res=> {
						if(res.data.status == 200){
							return uni.showToast({
								icon: 'none',
							  	title: '发布成功'
							})
						}
					}
				})
			},
			/* 获取二维码暂时不看 */
			async getArtWorkCode(){
				console.log(this.xid)
				await uni.request ({
					url: baseURL + "/Ecmartwork/getWxUserArtWorks",
					method: 'POST',
					dataType: 'json',
					data: {
						pkArtworkId: this.xid,
					},
					success: res=> {
					}
				})
			},
			async deleteArtWorkCode(){
				console.log(this.xid)
				await uni.request ({
					url: baseURL + "/ecmArtWorkManager/modifyArtWorksStatus",
					method: 'POST',
					dataType: 'json',
					data: {
						pkArtworkId: this.xid,
						code: 'delete'
					},
					success: res=> {
						if(res.data.status == 200){
							return uni.showToast({
								icon: 'none',
							  	title: '删除成功'
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.mask{
		position: fixed;
		width: 100%;
		height: 100%;
		z-index: 15;
		left: 0;
		top: 0;
	}
	.tips{
		z-index: 16;
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
		bottom: 10rpx;
		.work_info{
			width: 100%;
			background-color: rgba(0,0,0,.2);
			.demo-title {
				font-size: 26rpx;
				padding: 10rpx 0 0 10rpx;
				color: white;
			}
			.hot_box{
				padding: 10rpx 0 10rpx 10rpx;
				display: flex;
				justify-content: flex-start;
				.hot_icon_box{
					width: 30rpx;
					height: 30rpx;
					icon{
						background: url(../../static/icon/heat_degree.png) center no-repeat;
						width: 100%;
						height: 100%;
						background-size: 100%;
					}
				}
				.demo-price {
					margin-left: 8rpx;
					font-size: 28rpx;
					color: white;
					line-height: 30rpx;
				}
			}
		}
	}
</style>
