<template>
	<view>
		<view style="position: relative;height: 80rpx;width: 750rpx;padding: 0 20rpx;box-sizing: border-box;padding-top: 10rpx;display: flex;">
<!-- 			<icon class="search_icon"></icon>
			<input class="search_input" type="" placeholder=" 查找你想看的视频" disabled="" /> -->
			
			<view class="banner_container" @click="this.isShowBannerImg = true" v-if="isShowBanner">
				<image :src="bannerSrc" style="display: block;width: 100%;height:100%"/>
			</view>
			<scroll-view class="banner_bigImg" scroll-y="true" v-if="isShowBannerImg">
				<view style="position: fixed; right: 20rpx;top:20rpx;width:80rpx;height: 80rpx;background: #000;border-radius: 40rpx;" @click="isShowBannerImg = false">
					<image src="/static/icon/dialogClose.png" style="display: block;width: 100%;height: 100%;"/>
				</view>
				<image mode="widthFix" src="https://sike-1259692143.cos.ap-chongqing.myqcloud.com/baseImg/1619494260074%E7%81%B5%E5%B7%AB%E4%BA%92%E5%8A%A8%E4%BA%A7%E5%93%81%E5%AE%A3%E4%BC%A0.jpg"/>
			</scroll-view>
			<!--  :style="{top: `${isShowBanner ? '300rpx' : '0'}`}" -->
			<view class="nav_container">
				<Advertising :lightNumber.sync="lightNumber" :ecmUserLightUpLimit.sync="ecmUserLightUpLimit"></Advertising>
				<view class="search_main" @click="go_search_page">
					<u-search :show-action="false" ></u-search>
				</view>
			</view> 
		</view>
		<incentive :lightNumber="lightNumber" :ecmUserLightUpLimit="ecmUserLightUpLimit"></incentive>
		
		<!-- <u-subsection :list="items" :current="0" @change="sectionChange"></u-subsection> -->
		<view class="content" :style="{marginTop: `${isShowBanner ? '310rpx' : '0'}`}">
			<waterfall :flowList="hotList" :status="hotloadStatus"></waterfall>
			<u-loadmore :bg-color="'#f2f2f2'" :status="hotLoadStatus"  :icon="true" :icon-type="'circle'" :load-text="loadText" />
<!-- 			<view v-if="current === 0">
				<waterfall :flowList="hotList" :status="hotloadStatus"></waterfall>
				<u-loadmore :bg-color="'#f2f2f2'" :status="hotLoadStatus"  :icon="true" :icon-type="'circle'" :load-text="loadText" />
			</view> -->
			<!-- <view v-if="current === 1">

				<u-sticky :bg-color="'#ffffff'">
					<u-subsection :list="list" :current="currentsort" @change="changeSort" :mode="'button'" :bold="false"
					 :height="50" :font-size="26"></u-subsection>
					<view style="height: 8rpx; background-color: #F0F0F0;"></view>
				</u-sticky>

				<view style="width: 100%;height: 100%;  position: absolute;  ">
					<swiper :current="swiperCurrent" @change="swiperchange" style="height: 100%">

						<swiper-item class="swiper-item">
							<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="onreachBottom">
								<waterfall :flowList="sortList0" :status="loadStatus"></waterfall>
								<u-loadmore :bg-color="'#f2f2f2'" :status="loadStatus0"  :icon="true" :icon-type="'circle'" :load-text="loadText" />
							</scroll-view>
						</swiper-item>

						<swiper-item class="swiper-item">
							<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="onreachBottom">
								<waterfall :flowList="sortList1" :status="loadStatus"></waterfall>
								<u-loadmore :bg-color="'#f2f2f2'" :status="loadStatus1"  :icon="true" :icon-type="'circle'" :load-text="loadText" />	
							</scroll-view>
						</swiper-item>

						<swiper-item class="swiper-item">
							<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="onreachBottom">
								<waterfall :flowList="sortList2" :status="loadStatus"></waterfall>
								<u-loadmore :bg-color="'#f2f2f2'" :status="loadStatus2"  :icon="true" :icon-type="'circle'" :load-text="loadText" />
							</scroll-view>
						</swiper-item>

						<swiper-item class="swiper-item">
							<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="onreachBottom">
								<waterfall :flowList="sortList3" :status="loadStatus"></waterfall>
								<u-loadmore :bg-color="'#f2f2f2'" :status="loadStatus3"  :icon="true" :icon-type="'circle'" :load-text="loadText" />
							</scroll-view>
						</swiper-item>

					</swiper>
				</view>

			</view> -->
			<u-back-top :scroll-top="scrollTop"></u-back-top>
		</view>

	</view>
</template>

<script>
	import {
		baseURL,versionId
	} from '../login/config/config.js'
	import search from '../search/search'
	import waterfall from './waterfall_view/waterfall.vue'
	import Advertising from '../../components/Advertising/Advertising.vue'
	import {globalBus} from '../../common/js/util.js'
	export default {
		components: {
			waterfall,
			search,
			Advertising
		},
		data() {
			return {
				// banner
				isShowBanner: true,
				// banner大图显示
				isShowBannerImg: false,
				loadText: {
					loadmore: '轻轻上拉',
					loading: '努力加载中',
					nomore: '实在没有了'
				},
				items: ['热门', '分类'],
				current: 0,
				scrollTop: 0,
				list: [{
					name: '测试类'
				}, {
					name: '剧情类'
				}, {
					name: '科普类'
				}, {
					name: '展示类'
				}],
				currentsort: 0,
				queryType: "测试类",
				limit: 10,
				loadStatus: "loading",
				// 底部状态
				hotLoadStatus: 'loading',
				hotList: [],
				sortList: [],
				//热门页数
				pageHot: 0,
				//分类页数
				pageSort: 0,
				sortList0: [],
				sortList1: [],
				sortList2: [],
				sortList3: [],
				sortList4: [],
				pageSort0: 0,
				pageSort1: 0,
				pageSort2: 0,
				pageSort3: 0,
				pageSort4: 0,
				swiperCurrent: 0,
				loadStatus0 : 'loading',
				loadStatus1 : 'loading',
				loadStatus2 : 'loading',
				loadStatus3 : 'loading',
				// 光数量
				lightNumber: 0,
				// 光上限
				ecmUserLightUpLimit: 0,
				timeout: null,
				//banner 地址
				bannerSrc: null
			}
		},
		onShow() {
			// banner显示与消失
			this.isShowBanner = true
			this.timeout = setTimeout(() => {
				this.isShowBanner = false
				clearTimeout(this.timeout)
			}, 5000)
			this.getLight()
			console.log("*****************************************relaunchApplets",uni.getStorageSync("relaunchApplets"))
			if(uni.getStorageSync("relaunchApplets") == true){
				console.log("*****************************************重播")
				uni.reLaunch({
					url: 'dishover',
					success() {
						/* console.log("*****************************************play")
						console.log("*****************************************detailId",uni.getStorageSync("detailId"))
						uni.navigateTo({
							url: "../play/play?pkArtworkId=" + uni.getStorageSync("detailId"),
						}) */
					},
					fail(res) {
							console.log("*****************************************reLaunch fail: ",res)
					}
				})
				uni.setStorageSync("relaunchApplets",false)
			}
		},
		onLoad() {
			uni.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage','shareTimeline']
			})
			this.addRandomDataHot(1)
		},
		onHide() {
			this.isShowBanner = false
			if(this.timeout !== null) {
				clearTimeout(this.timeout)
			}
		},
		onShareAppMessage (res) {
		    return {
		      title: '灵巫互动',
			  imageUrl: 'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/baseImg/1605600100857%E5%9C%86%E5%BD%A2%E7%94%A8JPG.jpg',
		      path: 'pages/dishover/dishover'
		    }
		},
		onShareTimeline (res) {
			return {
			  title: '灵巫互动',
			  imageUrl: 'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/baseImg/1605600100857%E5%9C%86%E5%BD%A2%E7%94%A8JPG.jpg',
			  path: 'pages/dishover/dishover'
			}
		},
		onReachBottom(e) {
			console.log('我去加载了')
			if (this.current == 0) {
				if (this.hotLoadStatus === 'loading') {
					this.addRandomDataHot()
				}
			} else if (this.current == 1) {
				if (this.loadStatus == "loading") {
					this.addRandomDataSort()
				}
			}
		},
		onPullDownRefresh() {
			if (this.scrollTop === 0 && !this.isShowBanner) {
				this.isShowBanner = true
				this.timeout = setTimeout(() => {
					this.isShowBanner = false
					clearTimeout(this.timeout)
				}, 5000)
			}
			uni.stopPullDownRefresh();
		},
		onReady () {
			this.isRequestAes()
			this.isGetLight()
			if (uni.getStorageSync('token')) {
				this.getLight()
				this.getAddLightCount()
			}
			this.isAppReady()
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		methods: {
			// 游客登录时  监听app页面是否就绪  就绪则加载
			isAppReady () {
				globalBus.$on('getLightOfAppReady', () => {
					console.log('发请求')
					this.getAddLightCount()
					this.getLight()
				})
			},
			// 获取当前一次性看广告加光的数量
			getAddLightCount () {
				uni.request({
					url:baseURL + '/user/light/getUserReward',
					method:'post',
					data: {
						fkEcmUserLightEventId: 2,
						token: uni.getStorageSync('token')
					},
					success: (res) => {
						const rewardLightStr = res.data.data && res.data.data.rewardLight ? res.data.data.rewardLight : '+3'
						const rewardLight = rewardLightStr.split('+' || '-')[1] - 0 || 0
						uni.setStorageSync('rewardLight', rewardLight)
					}
				})
			},
			// 监听是否需要重新获取光
			isGetLight () {
				globalBus.$on('getLight', (res) => {
					// this.getLight()
					this.lightNumber = res.lightNumber
					this.ecmUserLightUpLimit = res.upLimit
					console.log(res, '传递', )
					uni.setStorageSync('lightNumber', this.lightNumber)
					uni.setStorageSync('ecmUserLightUpLimit', this.ecmUserLightUpLimit)
					globalBus.$emit('getNewLightOfComponents')
					globalBus.$emit('initLightStyle')
				})
			},
			// 监听增加光请求
			isRequestAes () {
				globalBus.$on('requestOfAES', (res) => {
					console.log("***************requestOfAES")
					uni.request({
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
							globalBus.$emit('getLight', res.data.data)
							
							globalBus.$emit('bouyClickCommonOptionTodo')
							
						}
					})
				})
			},
			// 获取光
			getLight () {
				uni.request({
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
							this.ecmUserLightUpLimit = res.data.data.ecmUserLightUpLimit
							this.lightNumber = res.data.data.lightNumber
							console.log(this.ecmUserLightUpLimit, this.lightNumber)
							uni.setStorageSync('ecmUserLightUpLimit', this.ecmUserLightUpLimit)
							uni.setStorageSync('lightNumber', this.lightNumber)
							globalBus.$emit('initLightStyle')
						}
					}
				})
			},
			go_search_page() {
				console.log('123')
				uni.navigateTo({
					url: "../search/search"
				})
			},
			sectionChange(index) {
				this.current = index;
				// console.log(this.current)
				if (this.current == 1) {
					this.addRandomDataSort();
				}
			},
			changeSort(index) {
				console.log(index)
				this.currentsort = index;
				this.pageSort = 0
				this.swiperCurrent = index;
				this.queryType = this.list[index].name
				this['sortList' + this.currentsort]
				this.judgesortData()
			},
			addRandomDataHot(firstTime) {
				if (this.current == 0) {
					this.pageHot = this.pageHot + 1
					// console.log(this.pageHot)
					uni.request({
						url:  baseURL + '/Ecmartwork/getFindArtWorks',
						// url: 'http://localhost:8008/Ecmartwork/getFindArtWorks',
						method: 'POST',
						data: {
							page: this.pageHot,
							limit: this.limit,
							playClient: 1,
							versionId: versionId
						},
						success: res => {
							console.log("********res.data: ",res.data)
							if(res.data.status == 500) {
								this.hotLoadStatus = 'nomore'
								return
							}
							if (res.data.data.list.length != 0) {
								//从后台获取banner 地址
								if(firstTime === 1){
                                    this.bannerSrc = res.data.data.bannerAddress
								}

								res.data.data.list.forEach(v => {
									v.high = 287.1
								if (v.userLogoUrl != null) {
									if (v.userLogoUrl.indexOf( '/mobilePop') == -1) {
										v.userLogoUrl = v.userLogoUrl + '/mobilePop'
									}
								}
								if (v.logoPath != null && v.logoPath != '') {
									if (v.logoPath.indexOf( '/common') == -1) {
										v.logoPath = v.logoPath + '/common'
									}
									this.hotList.push(v)
									
								}else{
									console.log('空v', v)
								}
								})
								if (res.data.data.loadStatus != null ) {
									this.hotLoadStatus = 'nomore'
								}
								// uni.setStorageSync( 'isHot' , true )

							} else {
								// console.log('没有更多数据了')
								this.hotLoadStatus = 'nomore'
							}
						}
					})
					// console.log(this.hotLoadStatus)
				}


			},
			addRandomDataSort() {
				if (this.current == 1) {
					console.log(this.queryType)
					this['pageSort' + this.currentsort] = this['pageSort' + this.currentsort] + 1
					uni.request({
						url:  baseURL + '/Ecmartwork/getFindSortArtWorks',
						method: 'POST',
						data: {
							page: this['pageSort' + this.currentsort],
							limit: this.limit,
							queryType: this.queryType,
							playClient: 1,
							versionId: versionId
						},
						success: res => {
							if(res.status == 500) {
								this['loadStatus' + this.currentsort] = 'nomore'
								return
							}
							if (res.data.data != null) {
								res.data.data.forEach(v => {
									v.high = 287.1
									if (v.userLogoUrl != null) {
										if (v.userLogoUrl.indexOf( '/mobilePop') == -1) {
											v.userLogoUrl = v.userLogoUrl + '/mobilePop'
										}
									}
									if (v.logoPath != null && v.logoPath != '') {
										if (v.logoPath.indexOf( '/common') == -1) {
											v.logoPath = v.logoPath + '/common'
										}
									}
									this['sortList' + this.currentsort].push(v)
									// this.sortList.push(v)
								})
								if (res.data.data.length < this.limit) {
									this['loadStatus' + this.currentsort] = 'nomore'
								}
							} else {
								this['loadStatus' + this.currentsort] = 'nomore'
							}

						}
					})
				}
			},
			swiperchange(e) {
				let a = e.detail.current;
				this.currentsort = a;
				this.pageSort = 0
				this.swiperCurrent = a;
				this.queryType = this.list[a].name
				this['sortList' + this.currentsort]
				this.judgesortData()
			},
			judgesortData() {
				if (this['sortList' + this.currentsort].length == 0 && this['pageSort' + this.currentsort] == 0) {
					// console.log("111")
					this.addRandomDataSort()
					// console.log(this['sortList' + this.currentsort])
				}
			},
			onreachBottom() {
				if (this.loadStatus == "loading") {
					this.addRandomDataSort()
				}
			}
		}
	}

</script>
<style lang="scss">
	.banner_container {
		z-index: 99;
		width: calc(100% - 40rpx);
		height: 300rpx;
		background-color: pink;
		position: fixed;
		top: 80rpx;
	}
	.banner_bigImg {
		z-index: 999;
		width: 100%;
		height: 100%;
		background-color: pink;
		position: fixed;
		left: 0;
		top: 0;
		image {
			display: block;
			width: 100%;
		}
	}
	.nav_container {
		z-index: 99;
		position: fixed;
		width: calc(100% - 40rpx);
		height: 80rpx;
		top: 0rpx;
		display: flex;
		justify-items: space-between;
		background-color: #fff;
		border-radius: 0 0 10rpx 10rpx;
		transition: all .3s;
		.search_main {
			width: calc(50% - 20rpx);
			background-color: #fff;
			position: absolute;
			right: 0rpx;
			top: 6rpx;
		}
	}
	.content {
		margin-top: 310rpx;
		transition: all .3s;
	}

	.artWorkImgDiv {
		width: 100%;
		// height: 100%;
		border-radius: 4px;
	}


	.demo-warter {
		border-radius: 8px;
		margin: 5px;
		background-color: #ffffff;
		padding: 8px;
		position: relative;
	}

	.demo-image {
		width: 100%;
		border-radius: 4px;
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

</style>
