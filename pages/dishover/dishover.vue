<template>
	<view>
		<!-- 	<view class="container">
			<u-sticky> -->
		<view class="search_view" @click="go_search_page">
			<icon class="search_icon"></icon>
			<input class="search_input" type="text" placeholder=" 查找你想看的视频" />
		</view>

		<!-- </u-sticky>
		</view> -->
		<u-subsection :list="items" :current="0" @change="sectionChange"></u-subsection>


		<view class="content">
			<view v-if="current === 0">
				<hot></hot>
				<!-- <test></test> -->
			</view>
			<view v-if="current === 1">
				<u-subsection :list="list" :current="currentsort" @change="changeSort" mode='subsection'  bold="false" active-color="#606266" height="50"  font-size="24" ></u-subsection>		
<!-- 				<u-tabs :list="list" :is-scroll="true" :current="currentsort" @change="changeSort" font-size="24" height="50"
				active-color="#606266" bold="false" gutter="60"></u-tabs> -->
				
				<view v-if="currentsort === 0"><dishoversort v-slot:sortDiv queryType='爱情'> </dishoversort></view>
				<view v-if="currentsort === 1"><dishoversort v-slot:sortDiv queryType='搞笑'> </dishoversort></view>
				<view v-if="currentsort === 2"><dishoversort v-slot:sortDiv queryType='日常'></dishoversort></view>
				<view v-if="currentsort === 3"><dishoversort v-slot:sortDiv queryType='动漫'></dishoversort></view>
				<view v-if="currentsort === 4"><dishoversort v-slot:sortDiv queryType='游戏'></dishoversort></view>
				
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
	import dishoversort from './dishoversort/dishoversort.vue'
	import search from '../search/search'
	import test from './test/test'


	export default {
		components: {
			hot,
			dishoversort,
			search,
			test
		},
		data() {
			return {
				items: ['热门', '分类'],
				current: 0,
				scrollTop: 0,
				list: [{
					name: '爱情故事'
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
				queryType: "1"

			}
		},
		methods: {
			go_search_page() {
				uni.navigateTo({
					url: "../search/search"
				})
			},
			sectionChange(index) {
				this.current = index;
			},
			onPageScroll(e) {
				this.scrollTop = e.scrollTop;
			},
			changeSort(index) {
				this.currentsort = index;
			}
		}

	}
</script>


<style lang="scss">
	@import "uview-ui/index.scss";

	.search_view {
		background-color: #e3e3e3;
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
		height: 100%;
		border-radius: 4px;
	}


	.demo-warter {
		border-radius: 8px;
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
		color: $u-type-primary;
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
		color: $u-type-error;
		margin-top: 5px;
	}

	.demo-shop {
		font-size: 22rpx;
		color: $u-tips-color;
		margin-top: 5px;
	}
</style>
