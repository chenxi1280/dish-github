<template>
	<view class="wrap">
		<view>
			<swiper :vertical="true" :previous-margin="120" :next-margin="410" :current="onfloor" @change="floorChange" style="width: 375px; height: 700px;">
				<swiper-item v-for="(item, floor) in floorList" :key="floor" style="margin-top: 25rpx; height: 180px;">
					<u-m-swiper :list="item" :title="true" :circular="false" :autoplay="false" :height="320" :effect3d="true" :isBig="onfloor == floor"
					 :effect3d-previous-margin="80" @change="columnChange"></u-m-swiper>
				</swiper-item>
			</swiper>
		</view>

		<!-- 	   <scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scrolltoupper="upper" @scrolltolower="lower"
		                @scroll="scroll"> -->
		<!-- 			<view v-for="(item, floor) in floorList" :key="floor" style="margin-top: 25rpx;">
				<u-m-swiper :list="item" :title="true" :circular="false" :autoplay="false" :height="640" :effect3d="true" 
				:effect3d-previous-margin="80" @change="testChange"  ></u-m-swiper>
			</view> -->
		<!-- </scroll-view> -->


	</view>
</template>

<script>
	import mswiper from '../../components/m-swiper/m-swiper'
	export default {
		components: {
			mswiper
		},
		data() {
			return {
				pkArtworkId: 110,
				pkDetailIds: [778, 779, 781, 783, 785, 788],
				list: [],
				floorList: [],
				onfloor: 0,
				oncolumn: 0,
				isBig: true
			}
		},

		onLoad(option) {
			// this.pkArtworkId = option.pkArtworkId
			this.onfloor = this.pkDetailIds.length - 1
			console.log(this.onfloor)
			uni.request({
				url: 'http://192.168.1.15:8008/Ecmartwork/getArtWorkNodes',
				method: 'POST',
				data: {
					pkArtworkId: this.pkArtworkId
				},
				success: res => {
					res.data.data.forEach(node => {
						this.pkDetailIds.forEach(v => {
							if (v === node.pkDetailId) {
								this.setNode(node.brotherNode, v)
								this.list.push(node.brotherNode)
								this.floorList.push(node.brotherNode)
							}
						})
					})
					// this.floorList = this.deepCopy(this.list)
					this.clearnBrother()
				}
			})
		},
		methods: {
			setNode(data, pkNodeId) {
				for (let i = 0; i < data.length; i++) {
					data[i].title = data[i].selectTitle
					data[i].image = data[i].nodeImgUrl
					if (pkNodeId === data[i].pkDetailId) {
						data.unshift(data[i])
						data.splice(i, 1)
					}
				}
				return data
			},
			columnChange(index) {
				this.oncolumn = index
				if (this.onfloor != this.pkDetailIds.length) {
					if (index != 0) {
						this.floorList.splice(this.onfloor + 1, this.floorList.length - this.onfloor - 1)
					} else {
						let a = this.floorList.concat(this.list.slice(this.onfloor + 1))

						this.floorList = a
						this.clearnBrother()
					}
				}
				// this.clearnBrother()
			},
			floorChange(e) {
				let current = e.detail.current;	
				this.onfloor = current
				this.clearnBrother()	
			},
			clearnBrother(){
				this.floorList = this.deepCopy(this.list)
				for(let i = 0 ; i < this.floorList.length ; i++){
					if( this.onfloor != i){
						this.floorList[i].splice(1,this.floorList[i].length - 1)
					}
				}
			},
			deepCopy(o) {
			    return JSON.parse(JSON.stringify(o))
			}
		}
	}
</script>

<style lang="scss">
	.wrap {
		padding: 40rpx;
		// transform: translateY();
		width: 100%;
		height: 100%;
	}
</style>
