<template>
	<view class="wrap">
		<!-- <scroll-view @scrolltolower="addRandomData" scroll-y > -->
		<u-waterfall v-model="flowList" ref="uWaterfall">
			<template v-slot:left="{leftList}">
				<view class="demo-warter" v-for="(item, index) in leftList" :key="index">

					<!-- <u-lazy-load threshold="-450" border-radius="10" :image="item.image" :index="index"></u-lazy-load> -->

					<view :style=' " background:url(" + item.logoPath + ") no-repeat center; background-size:100%;" ' class="artWorkImgDiv">

						<view :style=' "height: " + item.high + "px;  display: flex;  flex-direction: column-reverse;" '>

							<view style="background-color: rgba(0,0,0,.1); padding-left: 10rpx; ">
								<view style="display: flex ;  padding-top: 5rpx;">
									<image :src="item.logoPath" style="width: 60rpx; height: 60rpx; border-radius: 30rpx;"></image>
									<view class="demo-price" style="color: #FFFFFF; padding-left: 10rpx;">
										{{item.userName}}
									</view>
								</view>

								<view class="demo-title" style="color: #FFFFFF;">
									{{item.artworkName}}
								</view>
								<view style="color: #FFFFFF; padding-bottom: 10rpx; display: flex; ">
									<view>
										<image src="../../../static/icon/heat_degree.png" style="width: 40rpx; height: 40rpx; border-radius: 20rpx; color: #FA3534;"></image>
									</view>
									<view style="color: #FFFFFF; padding-left: 10rpx; padding-top: 6rpx;">
										88888
									</view>
								</view>

							</view>
						</view>
					</view>




				</view>
			</template>
			<template v-slot:right="{rightList}">
				<view class="demo-warter" v-for="(item, index) in rightList" :key="index">


					<view :style=' " background:url(" + item.logoPath + ");" ' class="artWorkImgDiv">

						<view :style=' "height: " + item.high + "px;  display: flex;  flex-direction: column-reverse;" '>

							<view style="background-color: rgba(0,0,0,.1); padding-left: 10rpx; ">
								<view style="display: flex ;  padding-top: 5rpx;">
									<image :src="item.logoPath" style="width: 60rpx; height: 60rpx; border-radius: 30rpx;"></image>
									<view class="demo-price" style="color: #FFFFFF; padding-left: 10rpx;">
										{{item.userName}}
									</view>
								</view>

								<view class="demo-title" style="color: #FFFFFF;">
									{{item.artworkName}}
								</view>
								<view style="color: #FFFFFF; padding-bottom: 10rpx; display: flex; ">
									<view>
										<image src="../../../static/icon/heat_degree.png" style="width: 40rpx; height: 40rpx; border-radius: 20rpx; color: #FA3534;"></image>
									</view>
									<view style="color: #FFFFFF; padding-left: 10rpx; padding-top: 6rpx;">
										88888
									</view>
								</view>

							</view>
						</view>
					</view>


				</view>
			</template>
		</u-waterfall>
		<u-loadmore bg-color="rgb(240, 240, 240)" :status="loadStatus" @loadmore="addRandomData"></u-loadmore>
		<!-- </scroll-view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				limit: 10,
				page: 0,
				loadStatus: 'loadmore',
				flowList: [],
				list: []
			}
		},
		onReady() {
			this.addRandomData();
		},

		methods: {
			addRandomData() {


				console.log(this.limit)
				console.log(this.page)
				this.page = this.page + 1
				uni.request({
					url: 'http://192.168.1.15:8008/Ecmartwork/getFindArtWorks',
					method: 'POST',
					data: {
						page: this.page,
						limit: this.limit
					},
					success: res => {
						console.log(res);
						res.data.data.forEach(v => {
							if( v.code === "ad" ){
								v.high = 100
							}else{
								v.high = 280
							}
							this.flowList.push(v)
						})
					}
				})
				console.log(this.flowList)

				// for (let i = 0; i < 10; i++) {
				// 	let index = this.$u.random(0, this.list.length - 1);
				// 	// 先转成字符串再转成对象，避免数组对象引用导致数据混乱
				// 	let item = JSON.parse(JSON.stringify(this.list[index]))
				// 	item.id = this.$u.guid();
				// 	this.flowList.push(item);
				// }


			}
		}
	}
</script>

<style>
	/* page不能写带scope的style标签中，否则无效 */
	page {
		background-color: rgb(240, 240, 240);
	}
</style>

<style lang="scss">
	.artWorkImgDiv {
		width: 100%;
		height: 100%;
		border-radius: 4px;
	}


	.demo-warter {
		border-radius: 8px !important;
		margin: 5px;
		background-color: #ffffff;
		padding: 8px;
		height: 240px !important;
		border: 10rpx solid red !important;
		position: relative;
	}

	.u-close {
		position: absolute;
		top: 32rpx;
		right: 32rpx;
	}

	.demo-image {
		width: 100%;
		border-radius: 4px;
		color: #FFF;
	}

	.demo-title {
		font-size: 30rpx;
		margin-top: 5px;
		color: $u-main-color;
	}

	.demo-tag {
		display: flex;
		margin-top: 5px;
	}

	.demo-tag-owner {
		background-color: $u-type-error;
		color: #FFFFFF;
		display: flex;
		align-items: center;
		padding: 4rpx 14rpx;
		border-radius: 50rpx;
		font-size: 20rpx;
		line-height: 1;
	}

	.demo-tag-text {
		border: 1px solid $u-type-primary;
		color: #FFF;
		margin-left: 10px;
		border-radius: 50rpx;
		line-height: 1;
		padding: 4rpx 14rpx;
		display: flex;
		align-items: center;
		border-radius: 50rpx;
		font-size: 20rpx;
	}

	.demo-price {
		font-size: 30rpx;
		color: #FFF;
		margin-top: 5px;
	}

	.demo-shop {
		font-size: 22rpx;
		color: #FFF;
		margin-top: 5px;
	}
</style>
