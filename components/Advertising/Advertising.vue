<template>
	<view style="z-index: 999;">
		<view class="light_container" style="height: 60rpx;padding: 10rpx;background-color: #975aa8;width: 250rpx;border-radius: 30rpx;padding-left: 20rpx;margin-top: 6rpx;" @click="showAdvertising">
			<image :src="lightIconUrl.light" style="display: inline-block;height: 40rpx;width: 40rpx;margin-bottom: 10rpx;"></image>
			<image :src="lightIconUrl.ride" style="display: inline-block;height: 24rpx;width: 24rpx;margin-bottom: 16rpx;margin-left: 20rpx;"></image>
			<image :src="lightIconUrl.nine" style="display: inline-block;height: 32rpx;width: 20rpx;margin-bottom: 14rpx;margin-left: 20rpx;"></image>
			<image :src="lightIconUrl.two" style="display: inline-block;height: 32rpx;width: 20rpx;margin-bottom: 14rpx;margin-left: 10rpx;"></image>
			<view class="add_icon">
				<view class="line"></view>
			</view>
			<!-- 确认观看激励视频广告的弹窗 -->
			<u-modal v-model="showAdvertisingFlag" title="温馨提示" :show-confirm-button="false" z-index="999">
				<view class="slot-content">
					<view style="padding: 0 20rpx;padding-top: 40rpx;">
						<view>完整观看激励视频可以获得15个光的奖励哦</view>
						<view @click="openAdvertising" style="padding: 20rpx;background-color: #985ba9;width: 400rpx;margin-left: calc(50% - 200rpx); margin-top: 60rpx;text-align: center;border-radius: 10rpx;margin-bottom: 40rpx;">
							<image src="../../static/icon/showVideo.png" style="width: 40rpx;height: 40rpx;display: inline-block;transform: translateY(4rpx);"></image>
							<view style="display: inline-block;margin-left: 10rpx;color: #fff;transform: translateY(-4rpx);">立即获取</view>
						</view>
						<view @click="closeDialog" style="position: absolute;right: 20rpx; top: 20rpx;width: 40rpx;height: 40rpx;text-align: center;line-height: 40rpx;font-size: 40rpx;">x</view>
					</view>
				</view>
			</u-modal>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 光图标地址
				lightIconUrl: {
					zero: 'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/img/16092217310570.png',
					one: 'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/img/16092217448581.png',
					two: 'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/img/16092217566402.png',
					three: 'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/img/16092217681013.png',
					four: 'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/img/16092217827134.png',
					five: 'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/img/16092218093205.png',
					six: 'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/img/16092218381466.png',
					seven: 'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/img/16092218503377.png',
					eight: 'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/img/16092218622068.png',
					nine: 'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/img/16092218835049.png',
					max: 'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/img/1609206818980max.png',
					ride: 'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/img/1609221900603%E4%B9%98%E5%8F%B7.png',
					light: 'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/img/1609206885162%E5%85%893.png'
				},
				// 观看激励视频的确认弹窗
				showAdvertisingFlag: false,
				// 激励广告实例
				advertising: null
			}
		},
		props:{
			// 是否启用自定义点击事件
			isCustom: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			// 观看激励广告
			openAdvertising () {
				if (this.isCustom) {
					this.$emit('customConfirmEvent')
					return false
				}
				this.showAdvertisingFlag = false
				this.advertising = wx.createRewardedVideoAd({
					adUnitId: 'adunit-7423fd1b2c7c5724'
				})
				//捕捉错误
				this.advertising.onError(err => {
					uni.showToast({
						title:'获取激励视频失败，请重试'
					})
				})
				// 激励广告显示并加载
				if (this.advertising) {
					this.advertising.load().then(() => {
						this.advertising.show().then(() => {
						})
					}).catch(() => {
						this.advertising.load().then(() => {
							this.advertising.show().then(() => {
							})
						}).catch(() => {
							uni.showToast({
								title:'激励视频加载失败，请重试'
							})
						})
					})
				}
				// 监听激励广告关闭
				this.advertising.onClose((status) => {
					if (status.isEnded) {
						console.log('给光')
					} else {
						console.log('憨批用户不给光')
					}
					this.advertising.destroy()
				})
			},
			// 关闭激励广告确认框
			closeDialog () {
				if (this.isCustom) {
					this.$emit('customCloseEvent')
				} else {
					this.showAdvertisingFlag = false
				}
			},
			// 点击加号  打开激励广告
			showAdvertising () {
				if (this.isCustom) {
					this.$emit('customAddEvent')
				} else {
					this.showAdvertisingFlag = true
				}
			}
		}
	}
</script>

<style lang="scss">
	.light_container {
		.add_icon {
			display: inline-block;
			width: 40rpx;
			height: 40rpx;
			border: 2rpx solid #fff;
			margin-bottom: 12rpx;
			margin-left: 20rpx;
			border-radius: 20rpx;
			box-sizing: border-box;
			// text-align: center;
			.line {
				width: 20rpx;
				height: 4rpx;
				background-color: #fff;
				border-radius: 4rpx;
				margin-left: 8rpx;
				margin-top: 16rpx;
				&::after {
					content: ' ';
					display: block;
					width: 4rpx;
					height: 20rpx;
					background-color: #fff;
					border-radius: 4rpx;
					margin-left: 8rpx;
					transform: translateY(-8rpx);
				}
			}
		}
	}
</style>
