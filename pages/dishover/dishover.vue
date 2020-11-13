<template>
	<view>

		<view class="search_view" @click="go_search_page">
			<icon class="search_icon"></icon>
			<input class="search_input" type="" placeholder=" 查找你想看的视频" disabled="" />

		</view>

		<u-subsection :list="items" :current="0" @change="sectionChange"></u-subsection>
		<view class="content">
			<view v-if="current === 0">
				<waterfall :flowList="hotList" :status="hotloadStatus"></waterfall>
			</view>
			<view v-if="current === 1">

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
							</scroll-view>
						</swiper-item>

						<swiper-item class="swiper-item">
							<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="onreachBottom">
								<waterfall :flowList="sortList1" :status="loadStatus"></waterfall>
							</scroll-view>
						</swiper-item>

						<swiper-item class="swiper-item">
							<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="onreachBottom">
								<waterfall :flowList="sortList2" :status="loadStatus"></waterfall>
							</scroll-view>
						</swiper-item>

						<swiper-item class="swiper-item">
							<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="onreachBottom">
								<waterfall :flowList="sortList3" :status="loadStatus"></waterfall>
							</scroll-view>
						</swiper-item>

					

					</swiper>
				</view>
			</view>
			<u-back-top :scroll-top="scrollTop"></u-back-top>
		</view>

	</view>
</template>

<script>
	import {
		baseURL
	} from '../login/config/config.js'

	import search from '../search/search'
	import waterfall from './waterfall_view/waterfall.vue'
	export default {
		components: {
			waterfall,
			search
		},
		data() {
			return {
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
				loadStatus: "loadmore",
				// 底部状态
				hotLoadStatus: 'loadmore',
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
				swiperCurrent: 0
			}
		},
		// onShow() {
		// 	this.addRandomDataHot()
		// },
		onLoad() {
			this.addRandomDataHot()
		},
		onReachBottom(e) {
			console.log('我去加载了')
			if (this.current == 0) {
				if (this.hotLoadStatus === 'loadmore') {
					this.addRandomDataHot()
				}
			} else if (this.current == 1) {
				if (this.loadStatus == "loadmore") {
					this.addRandomDataSort()
				}
			}
		},
		onPullDownRefresh() {
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			go_search_page() {
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
			onPageScroll(e) {
				this.scrollTop = e.scrollTop;
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
			addRandomDataHot() {
				if (this.current == 0) {
					this.pageHot = this.pageHot + 1
					// console.log(this.pageHot)
					uni.request({
						url:  baseURL + '/Ecmartwork/getFindArtWorks',
						// url: 'http://localhost:8008/Ecmartwork/getFindArtWorks',
						method: 'POST',
						data: {
							page: this.pageHot,
							limit: this.limit
						},
						success: res => {
							console.log(res.data.data)
							if (res.data.data.list.length != 0) {
								res.data.data.list.forEach(v => {
									v.high = 287.1
									v.logoPath = v.logoPath + '/common'
									this.hotList.push(v)
								})
								// console.log(this.limit)
								// console.log(res.data.data.length )
								
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
							queryType: this.queryType
						},
						success: res => {
							if (res.data.data != null) {
								res.data.data.forEach(v => {
									v.high = 287.1
									this['sortList' + this.currentsort].push(v)
									// this.sortList.push(v)
								})
								if (res.data.data.length < this.limit) {
									this.loadStatus = 'nomore'
								}
							} else {
								this.loadStatus = 'nomore'
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
				if (this.loadStatus == "loadmore") {
					this.addRandomDataSort()
				}
			}
		}
	}

</script>
<style lang="scss">
	.search_view {
		background-color: #f2f2f2;
		display: flex;
		border-radius: 10px;


		.search_icon {
			background: url(../../static/icon/icon_search.png) no-repeat center;
			width: 80rpx;
			height: 80rpx;
			background-size: 60rpx;
		};

		.search_input {
			width: 100%;
			height: 80rpx;

		}
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
