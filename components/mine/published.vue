<template>
	<view class="wrap">
		<u-waterfall v-model="flowList" ref="uWaterfall" :flag="mainFlag">
			<template v-slot:left="{leftList,flag}">
				<view class="demo-warter" id="demo-warter" v-for="(item, index) in leftList" :key="index">
					<!-- #ifdef MP-WEIXIN -->
					<view v-if="flag" class="tips" >
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
						<image class="demo-image" :src="item.image" mode="widthFix"></image>
					</view>
					<!-- #endif -->
					<view class="padding_box">
						<view class="work_info">
							<view class="demo-title">
								{{item.title}}
							</view>
							<view class="demo-price">
								{{item.price}}元
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
								{{item.shop}}
							</view>
						</view>
					</view>
				</view>
			</template>
			<template v-slot:right="{rightList,flag}">
				<view class="demo-warter" v-for="(item, index) in rightList" :key="index">
					<view class="tips" v-show='flag'>
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
					<!-- #ifdef MP-WEIXIN -->
					<view class="demo-img-wrap">
						<image class="demo-image" :src="item.image" mode="widthFix"></image>
					</view>
					<!-- #endif -->
					<view class="padding_box">
						<view class="work_info">
							<view class="demo-title">
								{{item.title}}
							</view>
							<view class="demo-price">
								{{item.price}}元
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
								{{item.shop}}
							</view>
						</view>
					</view>
				</view>
			</template>
		</u-waterfall>
		<u-loadmore bg-color="rgb(240, 240, 240)" :status="loadStatus" @loadmore="addRandomData"></u-loadmore>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				mainFlag: false,
				loadStatus: 'loadmore',
				flowList: [
					{
						price: 35,
						title: '北国风光，千里冰封，万里雪飘',
						shop: '李白杜甫白居易旗舰店',
						image: 'http://pic.sc.chinaz.com/Files/pic/pic9/202002/zzpic23327_s.jpg',
					},
					{
						price: 75,
						title: '望长城内外，惟余莽莽',
						shop: '李白杜甫白居易旗舰店',
						image: 'http://pic2.sc.chinaz.com/Files/pic/pic9/202002/hpic2130_s.jpg',
					},
					{
						price: 385,
						title: '大河上下，顿失滔滔',
						shop: '李白杜甫白居易旗舰店',
						image: 'http://pic2.sc.chinaz.com/Files/pic/pic9/202002/hpic2130_s.jpg',
					},
					{
						price: 784,
						title: '欲与天公试比高',
						shop: '李白杜甫白居易旗舰店',
						image: 'http://pic2.sc.chinaz.com/Files/pic/pic9/202002/hpic2130_s.jpg',
					},
					{
						price: 7891,
						title: '须晴日，看红装素裹，分外妖娆',
						shop: '李白杜甫白居易旗舰店',
						image: 'http://pic2.sc.chinaz.com/Files/pic/pic9/202002/hpic2130_s.jpg',
					},
					{
						price: 2341,
						shop: '李白杜甫白居易旗舰店',
						title: '江山如此多娇，引无数英雄竞折腰',
						image: 'http://pic1.sc.chinaz.com/Files/pic/pic9/202002/zzpic23346_s.jpg',
					},
					{
						price: 661,
						shop: '李白杜甫白居易旗舰店',
						title: '惜秦皇汉武，略输文采',
						image: 'http://pic1.sc.chinaz.com/Files/pic/pic9/202002/zzpic23346_s.jpg',
					},
					{
						price: 1654,
						title: '唐宗宋祖，稍逊风骚',
						shop: '李白杜甫白居易旗舰店',
						image: 'http://pic1.sc.chinaz.com/Files/pic/pic9/202002/zzpic23346_s.jpg',
					},
					{
						price: 1678,
						title: '一代天骄，成吉思汗',
						shop: '李白杜甫白居易旗舰店',
						image: 'http://pic1.sc.chinaz.com/Files/pic/pic9/202002/zzpic23346_s.jpg',
					},
					{
						price: 924,
						title: '只识弯弓射大雕',
						shop: '李白杜甫白居易旗舰店',
						image: 'http://pic1.sc.chinaz.com/Files/pic/pic9/202002/zzpic23346_s.jpg',
					},
					{
						price: 8243,
						title: '俱往矣，数风流人物，还看今朝',
						shop: '李白杜甫白居易旗舰店',
						image: 'http://pic2.sc.chinaz.com/Files/pic/pic9/202002/hpic2130_s.jpg',
					},
				]
			}
		},
		props: {
			flag: {
				type: Boolean,
				default: false
			}
		},
		onShow() {	
			this.addRandomData();
		},
		onReachBottom() {
			this.loadStatus = 'loading';
			// 模拟数据加载
			setTimeout(() => {
				this.addRandomData();
				this.loadStatus = 'loadmore';
			}, 1000)
		},
		methods: {
			showTips() {
				this.mainFlag = !this.mainFlag;
				console.log(this.mainFlag)
			},
			addRandomData() {
				for(let i = 0; i < 10; i++) {
					let index = this.$u.random(0, this.flowList.length - 1);
					// 先转成字符串再转成对象，避免数组对象引用导致数据混乱
					let item = JSON.parse(JSON.stringify(this.flowList[index]))
					item.id = this.$u.guid();
					this.flowList.push(item);
				}
			},
			remove(id) {
				this.$refs.uWaterfall.remove(id);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.demo-warter {
		border-radius: 16rpx;
		margin: 10rpx;
		background-color: #ffffff;
		padding: 16rpx 16rpx 0rpx 16rpx;
		position: relative;
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
	}
</style>