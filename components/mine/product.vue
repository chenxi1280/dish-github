<template>
	<view class="product">
		<view class="tips" v-if="flag">
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
		<view class="product_main_view" :style="{backgroundImage: 'url('+logoPath+')'}">
			<view class="sign" @click="showTips">
				<icon class="more"></icon>
			</view>
			<view class="product_info">
				<view class="author">
					<view class="icon_box">
						<icon class="author_icon"></icon>
					</view>
					<view class="author_content">{{authorName}}</view>
				</view>
				<view class="work_name">
					<view class="work_content">{{workName}}</view>	
				</view>
				<view class="heat_degree">
					<view class="icon_box">
						<icon class="heat_degree_icon"></icon>
					</view>
					<view class="heat_degree_content">{{heatNum}}</view>	
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data () {
			return{
				flag: false,
			}
		},
		props: {
		    authorName: {
		      type: String
		    },
			logoPath: {
			  type: String
			},
		    workName: {
		      type: String
		    },
		    heatNum: {
		      type: Number,
			  default: 88888
		    }
		  },
		methods: {
			showTips() {
				this.flag = true
			}
		}
	}
</script>

<style lang="scss">
	.product{
		height: 100%;
		width: 100%;
		.tips{
			border: 2rpx solid black;
			width: 160rpx;
			height: 210rpx;
			position: absolute;
			top: 0;
			left: 242rpx;
			.work_publish{
				width: 100%;
				height: 70rpx;
				box-sizing: border-box;
				position: relative;
				.btn_publish{
					line-height: 70rpx;
					text-align: center;
					font-size: 20rpx;
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
				height: 70rpx;;
				position: relative;
				.btn_delete{
					line-height: 70rpx;
					text-align: center;
					font-size: 20rpx;
					&:hover{
						background: #D3D3D3;
					};
				}
			}
		}
		
		.product_main_view{
			border: 2rpx solid black;
			width: 240rpx;
			height: 400rpx;
			position: relative;
			.sign{
				width: 80rpx;
				height: 80rpx;
				margin-left: 160rpx;
				.more{
					background: url(../../static/icon/more.png) center no-repeat;
					width: 100%;
					height: 100%;
					background-size: 50rpx;
				}
			}
			.product_info{
				width: 100%;
				height: 150rpx;
				margin-top: 170rpx;
				.author{
					box-sizing: border-box;
					width: 100%;
					height: 50rpx;
					display: flex;
					justify-content: flex-start;
					.icon_box{
						width: 50rpx;
						height: 100%;
						.author_icon{
							background: url(../../static/icon/author.png) center no-repeat;
							width: 100%;
							height: 100%;
							background-size: 30rpx;
						}
					}
					.author_content{
						height: 100%;
						width: 100%;
					}
				}
				.work_name{
					border: 2rpx solid black;
					box-sizing: border-box;
					width: 100%;
					height: 50rpx;
					.work_content{
						height: 100%;
						width: 100%;
					}
				}
				.heat_degree{
					box-sizing: border-box;
					width: 100%;
					height: 50rpx;
					display: flex;
					justify-content: flex-start;
					.icon_box{
						width: 50rpx;
						height: 100%;
						.heat_degree_icon{
							background: url(../../static/icon/heat_degree.png) center no-repeat;
							width: 100%;
							height: 100%;
							background-size: 30rpx;
						}
					}
					.heat_degree_content{
						height: 100%;
						width: 100%;
					}
				}
			}
			
		}
	}
</style>
