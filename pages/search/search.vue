<template>
	
	<view class="wrap">
		<view class="search_view" >
			<icon class="search_icon"></icon>
			<input class="search_input" type="" placeholder=" 查找你想看的视频" />
		</view>
		<view class="item u-border-bottom" v-for="(item, index) in list" :key="index">
			{{'第' + item + '条数据'}}
		</view>
		<u-loadmore :status="status" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				status: 'loadmore',
				list: 15,
				page: 0,
				pkArtworkId: 0
			}
		},
		onReachBottom() {
			if(this.page >= 3) return ;
			this.status = 'loading';
			this.page = ++ this.page;
			setTimeout(() => {
				this.list += 10;
				if(this.page >= 3) this.status = 'nomore';
				else this.status = 'loading';
			}, 2000)
		},
		onLoad(option) {
			this.pkArtworkId = option.pkArtworkId
			console.log(this.pkArtworkId)
		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
		padding: 24rpx;
	}
	
	.item {
		padding: 24rpx 0;
		color: $u-content-color;
		font-size: 28rpx;
	}
	
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
</style>