<template>
	<view class="wrap" @onReachBottom="addRandomData" >

		<u-waterfall v-model="flowList" ref="uWaterfall" >
			<template v-slot:left="{leftList}">
				<view class="demo-warter" v-for="(item, index) in leftList" :key="index">

					<view v-show="item.code  == 'ad'" >
						<ad-custom unit-id="adunit-59f062ee3b27d685" @onload="adLoad" @onerror="adError" @bindload="adLoad" @binderror="adError" ></ad-custom>
					</view>
					
					<view :style=' " background:url(" + item.logoPath + ") no-repeat center ;background-size: 100% 100%; " ' class="artWorkImgDiv" v-if ="item.code  != 'ad'"
					 @click="goPlayPage(item.pkArtworkId)">

						<view :style=' "height: " + item.high + "px;  display: flex;  flex-direction: column-reverse;" '>

							<view style="background-color: rgba(0,0,0,.1); padding-left: 10rpx; ">
								<view style="display: flex ;  padding-top: 5rpx;">
									<image :src="item.userLogoUrl" style="width: 60rpx; height: 60rpx; border-radius: 30rpx;"></image>
									<view class="demo-price" style="color: #FFFFFF; padding-left: 10rpx; padding-top: 12rpx;">
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
										{{item.hotCount}}
									</view>
								</view>

							</view>
						</view>
					</view>


				</view>
			</template>
			<template v-slot:right="{rightList}">
				<view class="demo-warter" v-for="(item, index) in rightList" :key="index">

					<view v-show="item.code  == 'ad'"  >
						<ad-custom unit-id="adunit-59f062ee3b27d685"  @bindload="adLoad" @binderror="adError" ></ad-custom>
					</view>
					
					<view :style=' " background:url(" + item.logoPath + ") center; background-size: cover;" ' class="artWorkImgDiv" v-if="item.code  != 'ad' "
					 @click="goPlayPage(item.pkArtworkId,item.playMode)">

						<view :style=' "height: " + item.high + "px;  display: flex;  flex-direction: column-reverse;" '>

							<view style="background-color: rgba(0,0,0,.1); padding-left: 10rpx; ">
								<view style="display: flex ;  padding-top: 5rpx;">
									<image :src="item.userLogoUrl" style="width: 60rpx; height: 60rpx; border-radius: 30rpx;"></image>
									<view class="demo-price" style="color: #FFFFFF; padding-left: 10rpx; padding-top: 12rpx;">
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
										{{item.hotCount}}
									</view>
								</view>

							</view>
						</view>
					</view>


				</view>
			</template>
		</u-waterfall>
		<!-- <u-loadmore bg-color="rgb(240, 240, 240)" :status="status" /> -->

	</view>
</template>

<script>
	export default {
		props: {
			flowList: {
				type: Array
			},
			status: {
				type: String,
				default: "loadmore"
			}
			
		},
		data() {
			return {

			}
		},
		onShow(e) {
			this.adLoad()
			this.adError()
			
			console.log(this.flowList)
		},
		methods: {
			goPlayPage(pkArtworkId,playMode) {
				console.log("************playMode: ",playMode)
				if(playMode === 2){
					uni.navigateTo({
						url: "../vrTransition/vrTransition?pkArtworkId=" + pkArtworkId,
					})
				}else{
					uni.navigateTo({
						url: "../play/play?pkArtworkId=" + pkArtworkId,
					})
				}
			},
			goADPage(adCode) {
				uni.navigateTo({
					url: "../ad/adPage",
				})
			},
			adLoad() {
				console.log('原生模板广告加载成功')
			},
			adError(err) {
				console.log('原生模板广告加载失败', err)
			}
		},
		adLoad() {
			console.log('原生模板广告加载成功')
		},
		adError(err) {
			console.log('原生模板广告加载失败', err)
		}
	}
	// function adLoad() {
	//     console.log('原生模板广告加载成功')
	// }
	// function adError(err) {
	// 	console.log('原生模板广告加载失败', err)
	// }
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
		margin: 5px;
		background-color: #ffffff;
		padding: 8px;
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
