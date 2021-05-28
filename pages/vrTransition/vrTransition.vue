<template>
	<view class="vrTransition" :style="{'width': mobilePhoneWidth+'px', 'height': mobilePhoneHeight+'px'}">
		<view class="videoLoadImageBox">
			<image :src="imageSrc"></image>
		</view>
		<button class="initButton" v-if="!pageLoadEndFlag">初始化中。。。</button>
		<button class="vrPlayButton" v-if="pageLoadEndFlag" @click="vrPlay">播放全景视频</button>
		<button class="seeMore" @click="goDiscover">看更多</button>
		<view class="AdvertisingBox">
			<Advertising symbol="1" color="#9f62d7" :lightNumber.sync="lightNumber" :ecmUserLightUpLimit.sync="ecmUserLightUpLimit"></Advertising>
		</view>
		<u-modal v-model="showAdvertisingFlag" title="温馨提示" :show-confirm-button="false" z-index="9999">
			<view class="slot-content">
				<view style="padding: 0 20rpx;padding-top: 40rpx;">
					<view v-if="!isHaveLight">观看作品过程中会消耗光，完整观看激励视频可以获得{{rewardLight}}个光的奖励哦</view>
					<view v-if="isHaveLight">当前光的数量不足，完整观看激励视频可以获得{{rewardLight}}个光的奖励哦</view>
					<view @click="openAdvertising" style="padding: 20rpx;background-color: #985ba9;width: 400rpx;margin-left: calc(50% - 200rpx); margin-top: 60rpx;text-align: center;border-radius: 10rpx;margin-bottom: 40rpx;">
						<image src="../../static/icon/showVideo.png" style="width: 40rpx;height: 40rpx;display: inline-block;transform: translateY(4rpx);"></image>
						<view style="display: inline-block;margin-left: 10rpx;color: #fff;transform: translateY(-4rpx);">立即获取</view>
					</view>
					<view @click="closeDialog" style="position: absolute;right: 20rpx; top: 20rpx;width: 40rpx;height: 40rpx;text-align: center;line-height: 40rpx;font-size: 40rpx;">x</view>
				</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import {baseURL} from '../login/config/config.js'
	import {globalBus} from '../../common/js/util.js'
	export default {
		data() {
			return {
				imageSrc: null,
				mobilePhoneHeight: 0,
				mobilePhoneWidth: 0,
				pageLoadEndFlag: false,
				token: null,
				ecmUserLightUpLimit: 0,
				lightNumber: 0,
				//是否有光的标识
				isHaveLight: false,
				//广告对象
				advertising: null,
				//光的奖励数量
				rewardLight: 0,
				//光不足弹窗控制开关
				showAdvertisingFlag: false,
				// 当前的时间戳
				nowDate: null,
				//作品ID
				pkArtworkId: 0
			}
		},
		onReady(){
			const {windowWidth, windowHeight} = uni.getSystemInfoSync()
			this.mobilePhoneHeight= windowHeight
			this.mobilePhoneWidth = windowWidth
		},
		onLoad(option) {
			this.pkArtworkId = option.pkArtworkId
			this.imageSrc = 'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/baseImg/1609384346693loading2.gif'
			this.token = uni.getStorageSync('token')
			if (!this.token) {
				this.getToken()
			}else{
				this.getAddLightCount()
				this.getLight()
				globalBus.$emit('getLightOfAppReady')
				this.pageLoadEndFlag = true
			}
		},
		methods: {
			getToken() {
				let _this = this
				let openid = uni.getStorageSync("openid")
				if (openid) {
					_this.updateUserInfo(openid)
				} else {
					uni.login({
						provider: 'weixin',
						success: async loginRes => {
							let code = loginRes.code
							await uni.request({
								url: baseURL + '/getOpenid',
								data: {
									code: code,
								},
								method: 'POST',
								header: {
									'content-type': 'application/json'
								},
								success: res => {
									if (res.data.status == 200) {
										uni.setStorageSync("openid", res.data.data.openid)
										_this.updateUserInfo(res.data.data.openid)
									} else {
										return uni.showToast({
											icon: 'none',
											title: '授权失败，请退出重新进入小程序'
										})
									}
								}
							})
						},
					})
				}
			},
			async updateUserInfo(openid) {
				let _this = this
				let token = uni.getStorageSync("token")
				this.string = token
				if (!token) {
					await uni.request({
						url: baseURL + '/savaUserInfo',
						data: {
							openid: openid,
							nickname: _this.nickName,
							gender: _this.gender,
							avatarurl: _this.avatarUrl,
							country: _this.country,
							province: _this.province,
							city: _this.city,
							language: _this.language
						},
						method: 'POST',
						header: {
							'content-type': 'application/json'
						},
						success: (res) => {
							if (res.data.status == 200) {
								uni.setStorageSync("token", res.data.data)
								_this.token = res.data.data
								this.addLight()
								this.getAddLightCount()
								globalBus.$emit('getLightOfAppReady')
							}
						}
					})
				}else{
					this.addLight()
					this.getAddLightCount()
					globalBus.$emit('getLightOfAppReady')
					this.pageLoadEndFlag = true
				}
			},
			// 监听增加光请求
			async addLight () {
				console.log("***************addLight")
				await uni.request({
					url: baseURL + '/wxPlay/addLight',
					method: 'POST',
					dataType: 'json',
					data: {
						token: uni.getStorageSync('token'),
						eventId: 2
					},
					success: res => {
						uni.showToast({
							title: '恭喜成功获得光'
						})
						this.getLight()
					}
				})
			},
			async getAddLightCount () {
				await uni.request({
					url:baseURL + '/user/light/getUserReward',
					method:'post',
					data: {
						fkEcmUserLightEventId: 2,
						token: uni.getStorageSync('token')
					},
					success: (res) => {
						console.log("*******************getAddLightCount")
						const rewardLightStr = res.data.data && res.data.data.rewardLight ? res.data.data.rewardLight : '+3'
						const rewardLight = rewardLightStr.split('+' || '-')[1] - 0 || 0
						this.rewardLight = rewardLight
						uni.setStorageSync('rewardLight', rewardLight)
					}
				})
			},
			async getLight() {
				await uni.request({
					url: baseURL + '/user/light/getUserLight',
					method: 'POST',
					dataType: 'json',
					data: {
						token: uni.getStorageSync('token')
					},
					header: {
						'Authorization': uni.getStorageSync('token')
					},
					success: res => {
						if (res.data.status === 200) {
							console.log("*******************getLight")
							this.ecmUserLightUpLimit = res.data.data.ecmUserLightUpLimit
							this.lightNumber = res.data.data.lightNumber
							console.log(this.ecmUserLightUpLimit, this.lightNumber)
							uni.setStorageSync('ecmUserLightUpLimit', this.ecmUserLightUpLimit)
							uni.setStorageSync('lightNumber', this.lightNumber)
							globalBus.$emit('initLightStyle')
							this.pageLoadEndFlag = true
						}
					}
				})
			},
			async customLightByUserId(eventId) {
				//用户在点击时一定是token加载完了不可能没有token
				let	token = uni.getStorageSync("token")
				console.log('扣光了！！！！！', eventId)
				console.log('扣光了！！！！！', token)
				// 默认假设有光
				this.isHaveLight = true
				//故事线消费的eventId = 3
				//初次播放消费eventId = 4
				//全景视频消费eventId = 5
				await uni.request({
					url: baseURL + "/wxPlay/customLight",
					method: 'POST',
					dataType: 'json',
					data: {
						token: token,
						eventId: eventId
					},
					success: result => {
						if (result.data.status == 200) {
							console.log("***************result.data.data light:", result.data.data)
							this.setLight(result.data.data)
							uni.navigateTo({
								url: './vrWebView?pkArtworkId=' + this.pkArtworkId
							})
						} else if (result.data.status == 10086) {
							console.log("扣光失败")
							this.showAdvertisingFlag = true
						}
					}
				});
			},
			getNextAd(){
				if(this.adErr){
					console.log('因为上次有错误，删除了ad')
					this.advertising.offError()
					this.advertising.offClose()
					this.advertising.destroy()
					this.advertising = null
					this.adErr = null
				}
				if(!this.advertising){
					console.log('获得新的广告')
					this.advertising = wx.createRewardedVideoAd({ adUnitId: 'adunit-7423fd1b2c7c5724' })
					this.advertising.onError(err => {
						console.log(err)
						this.adErr  = err
					})
				}else {
					console.log('使用老的广告')
					this.advertising.offClose()
				}
			},
			openAdvertising () {
				this.showAdvertisingFlag = false
				this.getNextAd()

				//捕捉错误
				 //&& this.handleAdError()
				if(this.adErr) {
					uni.showToast({
						icon: 'none',
						title: '当前没有适合您的激励视频，请待会再试'
					})
				}

                this.advertising.show()
				.catch(() => {
                        this.advertising.load()
                            .then(() => this.advertising.show())
                            .catch(err => {
                                uni.showToast({
                                    icon: 'none',
                                    title: '当前没有适合您的激励视频，请待会再试'
                                })
                                console.log('激励视频 广告显示失败', err)
                            })
                    })


				// 监听激励广告关闭
				this.advertising.onClose((status) => {
					if (status.isEnded) {
						const nowDate = new Date().getTime()
						if (nowDate === null || nowDate - this.nowDate > 5000 ) {
							this.nowDate = nowDate
							this.addLight()
						}
					}
					this.advertising.offClose()
				})
			},
			// 关闭激励广告确认框
			closeDialog () {
				this.showAdvertisingFlag = false
			},
			// 重新设置光
			setLight(data) {
				uni.setStorageSync('lightNumber', data.lightNumber)
				uni.setStorageSync('ecmUserLightUpLimit', data.upLimit)
				globalBus.$emit('initLightStyle')
			},
			vrPlay(){
				//跳转到vr的播放页面
				//播放全景视频前先检查光够不够扣
				this.customLightByUserId(5)
			},
			goDiscover(){
				//跳到发现页
				uni.switchTab({
					url: '../dishover/dishover'
				})
			},
		}
	}
</script>

<style lang="scss">
	.vrTransition{
		.videoLoadImageBox{
			height: 100%;
			width: 100%;
			image{
				z-index: 99;
				height: 100%;
				width: 100%;
			}
		}
		.initButton{
			background-color: rgba($color: #000000, $alpha: 0.3);
			position: absolute;
			left: 29%;
			top: 28%;
			z-index: 100;
			width: 308rpx;
			height: 92rpx;
			font-size: 32rpx;
			line-height: 92rpx;
			color: white;
			text-align: center;
		}
		.vrPlayButton{
			position: absolute;
			left: 29%;
			top: 28%;
			z-index: 100;
			width: 308rpx;
			height: 92rpx;
			font-size: 32rpx;
			line-height: 92rpx;
			text-align: center;
		}
		.seeMore{
			position: absolute;
			left: 29%;
			top: 38%;
			z-index: 100;
			width: 308rpx;
			height: 92rpx;
			font-size: 32rpx;
			line-height: 92rpx;
			text-align: center;
		}
		.AdvertisingBox{
			position: absolute;
			left: 0;
			top: 0;
			z-index: 100;
			height: 80rpx;
			width: 750rpx;
			// padding: 0 20rpx;
			box-sizing: border-box;
			padding-top: 10rpx;
			display: flex;
		}
	}
</style>
