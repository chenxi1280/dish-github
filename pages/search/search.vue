<template>
	<view>
		<u-search :show-action="true" action-text="搜索"  @search="searchEvent" @custom="searchEvent" v-model="searchText"></u-search>
		<view class="wrap">
			<view class="search_div">
				<!-- <text class="title">热度搜索榜</text> -->
			</view>
			<view class="item u-border-bottom" v-for="(item, index) in list" :key="index">
				<view class="ranking_view" @click="goPlayPage(item.pkArtworkId)">
					<text class="ranking_top" :class="[index <=2 ? 'ranking_top' : 'ranking_body']">{{ index+1 }}</text>
					<text style="margin-left: 30rpx;">{{item.artworkName}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		baseURL,versionId
	} from '../login/config/config.js'
	export default {
		data() {
			return {
				list: [],
				searchText: ""

			}
		},
		onLoad(option) {

			uni.request({
				url:  baseURL +'/Ecmartwork/getRankingArtWorks',
				method: 'POST',
				data: {
					page: 1,
					limit: 10,
					playClient: 1,
					versionId: versionId
				},
				success: res => {
					if (res.data.data != null) {
						res.data.data.forEach(v => {
							if (v.artworkName.length >= 23) {
								v.artworkName = v.artworkName.substr(0, 22) + '...'

							}
							this.list.push(v)
						})
					}
				}
			})
		},
		methods: {
			goPlayPage(pkArtworkId) {
				uni.navigateTo({
					url: "../play/play?pkArtworkId=" + pkArtworkId,
				})
			},
			searchEvent() {
				console.log(this.searchText)
				uni.navigateTo({
					url: "./result/result?searchText=" + this.searchText,
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
		padding: 24rpx;
	}
	
	.search_div{
		display: flex; 
		justify-content: center ;
		.title{
			color: #FF4500;
			 font-size:45rpx; 
			 display: inline-block;
		}
		
	}

	.ranking_view {
		padding: 24rpx 0;

		.ranking_top {
			color: #FF4500;
			font-size: 30rpx;
			font-weight: bold;
			font-style: italic;
		}

		.ranking_body {
			color: #FF8C00;
			font-size: 30rpx;
			font-style: italic;
		}

	}
</style>
