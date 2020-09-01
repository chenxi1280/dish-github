<template>
	<view>
			<view class="container">
			<u-sticky>
		<view class="search_view" @click="go_search_page">
			<icon class="search_icon"></icon>
			<input class="search_input" type="text" placeholder=" 查找你想看的视频" />
		</view>

		</u-sticky>
		</view>
		<u-subsection :list="items" :current="0" @change="sectionChange"></u-subsection>


		<view class="content">
			<view v-if="current === 0">
				<hot></hot>
			</view>
			<u-back-top :scroll-top="scrollTop"></u-back-top>
		</view>

	</view>
</template>

<script>
	import {
		baseURL
	} from './config/config.js'
	import {
		hot
	} from './hot/hot.vue'


	export default {
		components: {
			hot
		},
		data() {
			return {
				items: ['热门', '分类'],
				current: 0,
				scrollTop: 0

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
			}
		}

	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	.wrap {
		height: 200vh;
	}

	.search_view {
		background-color: #e3e3e3;
		display: flex;
		border-radius: 10px;

		.search_icon {
			// background: url(../../static/icon/icon_search.png) no-repeat center;
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
</style>
