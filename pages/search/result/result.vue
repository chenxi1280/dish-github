<template>
	<view>
		<hot :flowList="flowList" :status="loadStatus"></hot>
		<waterfall :flowList="flowList" :status="loadStatus"></waterfall>
	</view>
</template>

<script>

	import waterfall from '../waterfall_view/waterfall.vue'
	import {
			baseURL
		} from '../../login/config/config.js'
	export default {
		components: {

			waterfall
		},
		data() {
			return {
				searchText: "",
				limit: 10,
				page: 0,
				flowList: [],
				loadStatus: "loadmore"
			}
		},

		onLoad(option) {
			this.searchText = option.searchText
			this.addRandomDataHot()
		},
		methods:{
			addRandomDataHot() {
				this.page = this.page + 1
				uni.request({
					url: baseURL + '/Ecmartwork/search',
					method: 'POST',
					data: {
						page: this.page,
						limit: this.limit,
						searchText: this.searchText,
						playClient: 1
					},
					success: res => {
						if(res.data.data != null){
							res.data.data.forEach(v => {
								v.high = 287.1
								if (v.logoPath != null) {
									if (v.logoPath.indexOf( '/mobilePop') == -1) {
										v.logoPath = v.logoPath + '/mobilePop'
									}
								}
								if (v.userLogoUrl != null && v.userLogoUrl != '') {
									if (v.userLogoUrl.indexOf( '/common') == -1) {
										v.userLogoUrl = v.userLogoUrl + '/common'
									}
								}
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
			}
		}
	}
</script>

<style lang="scss">

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
