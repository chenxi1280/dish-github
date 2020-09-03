<template>
	<view class="wrap">
		<view class="wrap">
			<u-waterfall v-model="flowList" ref="uWaterfall" :flag="mainFlag">
				<template v-slot:left="{leftList,flag}">
					<view class="demo-warter" v-for="(item, index) in leftList" :key="index">
						<mine-production
						:broadcastCount="item.broadcastCount"
						:title="item.artworkName"
						:image="item.logoPath"
						:id="item.pkArtworkId"></mine-production>
					</view>
				</template>
				<template v-slot:right="{rightList,flag}">
					<view class="demo-warter" v-for="(item, index) in rightList" :key="index">
						<mine-production
						:broadcastCount="item.broadcastCount"
						:title="item.artworkName"
						:image="item.logoPath"
						:id="item.pkArtworkId"></mine-production>
					</view>	
				</template>
			</u-waterfall>
		</view>
	</view>
</template>

<script>
	import mineProduction from './mineProduction.vue';
	import { baseURL } from '../../pages/login/config/config.js'
	export default {
		data() {
			return {
				mainFlag: false,
				loadStatus: 'loadmore',
				flowList: []
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
			console.log('页面加载');
			//判断是否有token 有token 说明用户已登录根据token获取用户信息即作品
			//没有token 未登录拿游客的个人信息，不展示作品
			//此处应加标识 不需要每次都发请求加载页面
			this.getMineArtWorks();
		},
		methods: {
			async getMineArtWorks(){
				await uni.request ({
					url: baseURL + "/Ecmartwork/getWxUserArtWorks",
					method: 'POST',
					dataType: 'json',
					data: {
						token: uni.getStorageSync("token")
					},
					success: res=> {
						this.flowList = res.data.data.published;
					}
				})
			}
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