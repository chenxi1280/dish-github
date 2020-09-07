<template>
	<view>
		<view class="wrap">
			<u-waterfall v-model="flowList" ref="uWaterfall" :flag="mainFlag">
				<template v-slot:left="{leftList,flag}">
					<view class="demo-warter" v-for="(item, index) in leftList" :key="index">
						<mine-production
						:broadcastCount="item.broadcastCount"
						:title="item.artworkName"
						:image="item.logoPath"
						:xid="item.pkArtworkId"
						:status="item.artworkStatus"></mine-production>
					</view>
				</template>
				<template v-slot:right="{rightList,flag}">
					<view class="demo-warter" v-for="(item, index) in rightList" :key="index">
						<mine-production
						:broadcastCount="item.broadcastCount"
						:title="item.artworkName"
						:image="item.logoPath"
						:xid="item.pkArtworkId"
						:status="item.artworkStatus"></mine-production>
					</view>	
				</template>
			</u-waterfall>
			<u-loadmore bg-color="rgb(240, 240, 240)" :status="loadStatus" ></u-loadmore>
		</view>
	</view>
</template>

<script>
	import mineProduction from '../../components/mine/mineProduction.vue';
	import { baseURL } from '../login/config/config.js'
	
	export default {
		data() {
			return {
				mainFlag: false,
				loadStatus: 'loadmore',
				flowList: [],
				page: 0,
				limit: 10
			}
		},
		props: {
			flag: {
				type: Boolean,
				default: false
			}
		},
		components: {
			mineProduction
		},
		onReady() {	
			this.getMineArtWorks();
			//console.log("我去请求拿数据")
		},
		methods: {
			async getMineArtWorks(){
				this.page = this.page + 1,
				await uni.request ({
					url: baseURL + "/wxPersonalCenter/getWxUserArtWorks",
					method: 'POST',
					dataType: 'json',
					data: {
						token: uni.getStorageSync("token"),
						page: this.page,
						limit: this.limit,
						artworkStatus: 2
					},
					success: res=> {
						if (res.data.data == null || typeof(res.data.data) == "undefined") {
							this.loadStatus = 'nomore'
						}else{
							//console.log("我获取了"+res.data.data.length+"条数据")
							this.flowList = [...this.flowList,...res.data.data];
							//console.log("我有"+this.flowList.length+"条数据")
							if(res.data.data.length < this.limit){
								this.loadStatus = 'nomore'
							}
						}
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.demo-warter {
		border-radius: 16rpx;
		margin: 10rpx;
		background-color: #ffffff;
		padding: 16rpx 16rpx 0rpx 16rpx;
		position: relative;
	}
</style>