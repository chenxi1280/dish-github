<template>
	<view class="wrap">
		   <scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scrolltoupper="upper" @scrolltolower="lower"
		                @scroll="scroll">

			
			<!-- <u-swiper :list="list" :title="true" :circular="false" :autoplay="false" :height="800" :effect3d="true" :effect3d-previous-margin="80"></u-swiper>
			<u-swiper :list="list" :title="true" :circular="false" :autoplay="false" :height="800" :effect3d="true" :effect3d-previous-margin="80"></u-swiper>
			<u-swiper :list="list" :title="true" :circular="false" :autoplay="false" :height="800" :effect3d="true" :effect3d-previous-margin="80"></u-swiper> -->
			<view v-for="(item, index) in floorList" :key="index" style="margin-top: 25rpx;">
				<u-m-swiper :list="item" :title="true" :circular="false" :autoplay="false" :height="640" :effect3d="true" 
				:effect3d-previous-margin="80" ></u-m-swiper>
			</view>
			<!-- <view class="demo-warter" v-for="(item, index) in map" :key="index"> -->
		</scroll-view>
	</view>
</template>

<script>
	// import u-m-swiper from '../../components/u-m-swiper/u-m-swiper'
	export default {
		
		data() {
			return {
				pkArtworkId: 110,
				pkDetailIds: [778,779,781,783,785,788,],
				list: [],
				floorList:[]


			}
		},

		onLoad(option) {
			// this.pkArtworkId = option.pkArtworkId
			uni.request({
				url: 'http://192.168.1.15:8008/Ecmartwork/getArtWorkNodes',
				method: 'POST',
				data: {
					pkArtworkId: this.pkArtworkId
				},
				success: res => {

					
					let map  = res.data.data.map					
					this.pkDetailIds.forEach( v => {
						console.log(map[v])
						console.log(v)
						this.setNode(map[v],v)
						this.floorList.push(map[v])
					})
			
					// res.data.data.forEach( node => {
					// 	if(node.pkDetailId === 784 ){
					// 		if(node.brotherNode != null){
					// 			node.brotherNode.forEach( v => {
					// 				console.log(v)
					// 				v.title = v.selectTitle
					// 				v.image = v.nodeImgUrl
					// 				this.list.push(v)
					// 			})
					// 		}
							
					// 	}
					// })
					
					console.log(this.floorList)
				}
			})
		},

		methods: {
			setNode(data,pkNodeId){
				
				data.forEach( node => {
	
					if(pkNodeId == node.pkDetailId){
						console.log('换位子')
					}
					node.title = node.selectTitle
					node.image = node.nodeImgUrl
				})
			}
			
		}
	}
</script>

<style lang="scss">
	.wrap {
		padding: 40rpx;
		// transform: translateY();
	}
</style>
