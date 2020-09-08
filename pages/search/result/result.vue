<template>
	<view>
		<hot :flowList="flowList" :status="loadStatus"></hot>
		<waterfall :flowList="flowList" :status="loadStatus"></waterfall>
	</view>
</template>

<script>

	import waterfall from '../waterfall_view/waterfall.vue'
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
					url: 'http://192.168.1.15:8008/Ecmartwork/search',
					method: 'POST',
					data: {
						page: this.page,
						limit: this.limit,
						searchText: this.searchText
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
