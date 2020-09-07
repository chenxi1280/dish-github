<template>
	<view>

		<view class="search_view" @click="go_search_page" >
			<icon class="search_icon"></icon>
			<input class="search_input" type="" placeholder=" 查找你想看的视频" />
			
		</view>
		<!-- <view @click="go_search_page">	<u-search :show-action="false" action-text="搜索"  ></u-search></view> -->
		
	
		<u-subsection :list="items" :current="0" @change="sectionChange"></u-subsection>
		<view class="content">
			<view v-if="current === 0" >
				<hot :flowList="flowList" :status="loadStatus"></hot>
			</view>
			<view v-if="current === 1">
				<u-subsection :list="list" :current="currentsort" @change="changeSort" mode='subsection'  bold="false" active-color="#606266" height="50"  font-size="24" ></u-subsection>		
						
				<view v-if="currentsort === 0"><hot :flowList="flowList" :status="loadStatus"> </hot></view>
				<view v-if="currentsort === 1"><hot :flowList="flowList" :status="loadStatus"> </hot></view>
				<view v-if="currentsort === 2"><hot :flowList="flowList" :status="loadStatus"></hot></view>
				<view v-if="currentsort === 3"><hot :flowList="flowList" :status="loadStatus"></hot></view>
				<view v-if="currentsort === 4"><hot :flowList="flowList" :status="loadStatus"></hot></view>
				
			</view>
			<u-back-top :scroll-top="scrollTop"></u-back-top>
		</view>

	</view>
</template>

<script>
	import {
		baseURL
	} from './config/config.js'
	import hot from './hot/hot.vue'
	import search from '../search/search'
	// import test from './test/test'
	export default {
		components: {
			hot,
			search

		},
		data() {
			return {
				items: ['热门', '分类'],
				current: 0,
				scrollTop: 0,
				list: [{
					name: '爱情'
				}, {
					name: '搞笑'
				}, {
					name: '日常'
				}, {
					name: '动漫'
				}, {
					name: '游戏'
				}],
				currentsort: 0,
				queryType: "爱情",
				limit: 10,
				page: 0,
				flowList: [],
				loadStatus: "loadmore"

			}
		},
		onShow(){
			this.addRandomDataHot()
		},
		onReachBottom(e) {
			this.addChoose()
		},
		methods: {
			go_search_page() {
				uni.navigateTo({
					url: "../search/search"
				})
			},
			sectionChange(index) {
				this.page = 0
				this.flowList =[]
				this.current = index;
				this.addChoose()
			},
			onPageScroll(e) {
				this.scrollTop = e.scrollTop;
			},
			changeSort(index) {
				this.page = 0
				this.flowList =[]
				this.queryType = this.list[index].name
				this.currentsort = index;
				this.addRandomDataSort()
			},
			addChoose(){
				if(this.current == 0){
					  this.addRandomDataHot();
				}
				if(this.current == 1){
					  this.addRandomDataSort();	
				}
			},
			
			
			addRandomDataHot() {
				this.page = this.page + 1
				uni.request({
					url: 'http://192.168.1.15:8008/Ecmartwork/getFindArtWorks',
					method: 'POST',
					data: {
						page: this.page,
						limit: this.limit
					},
					success: res => {
						if(res.data.data != null){
							res.data.data.forEach(v => {
								v.high = 287.1
								this.flowList.push(v)
							})
							if(res.data.data.length < this.limit){
								this.loadStatus = 'nomore'
							}
						}else{
							this.loadStatus = 'nomore'
						}
					}
				})
			},
			addRandomDataSort() {
				this.page = this.page + 1
				uni.request({
					url: 'http://192.168.1.15:8008/Ecmartwork/getFindSortArtWorks',
					method: 'POST',
					data: {
						page: this.page,
						limit: this.limit,
						queryType: this.queryType
					},
					success: res => {
						if (res.data.data != null) {
							res.data.data.forEach(v => {
								v.high = 287.1
								this.flowList.push(v)
							})
							if(res.data.data.length < this.limit){
								this.loadStatus = 'nomore'
							}
						} else {
							this.loadStatus = 'nomore'
						}
			
					}
				})
			
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
		}

		;

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
