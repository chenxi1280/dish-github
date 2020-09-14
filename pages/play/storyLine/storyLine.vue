<template>
	<view class="wrap">

		<!-- <u-mask :show="true" style="width: 375px ; height: 100px;  position: fixed; left: 0; top: 0;z-index: 10;" ></u-mask> -->
		<view class="cpt-mask"> </view>
		<swiper :vertical="true" :previous-margin="200" :next-margin="200" :current="onfloor" @change="floorChange" 
		style="width: 100%; height: 100%; ">
			<swiper-item v-for="(item, floor) in floorList" :key="floor" style="margin-top: 12rpx; height: 224px; "  >
				<mswiper :list="item" :title="true" :circular="false" :autoplay="false" :height="416" :effect3d="true" :isBig="onfloor == floor"
				 :effect3d-previous-margin="80" @change="columnChange" @click="goPlay" :nowFloor="floor"></mswiper>
			</swiper-item>
		</swiper>
		<view class="cpt-mask-tips-bottom"> </view>
		<view class="cpt-mask-tips-top"> </view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import mswiper from '../../../components/m-swiper/m-swiper'

	export default {
		props:{
			//需要传递的2个值pkArtworkId 作品id ，pkDetailIds 播放过的节点id数组
			pkArtworkId:{
				type: [Number, String],
				default:113
			},
			pkDetailIds: {
				type: Array,
				default(){
					return	[887,888,892,897]
				}
			}
		},
		components:{
			mswiper
		},
		data() {
			return {
				list: [],
				floorList: [],
				onfloor: 5,	  // 当前楼
				oncolumn: 0,  // 当前列
				lockFloor: 0, // 锁定楼层
				lockColumn: 0 // 锁定列

			}
		},

		onReady(option) {

			this.onfloor = this.pkDetailIds.length - 1
			console.log(this.pkDetailIds)

			uni.request({
				url: 'https://wanxiangchengzhen.com/bpi/Ecmartwork/getArtWorkNodes',
				method: 'POST',
				data: {
					pkArtworkId: this.pkArtworkId
				},
				success: res => {
					// console.log(res.data.data)
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
					data[i].isWatch = false
					if (pkNodeId === data[i].pkDetailId )  {
						data[i].isWatch = true
						data.unshift(data[i])
						data.splice(i+1, 1)
					}
				}
				return data
			},
			columnChange(index, nowFloor) {
				// console.log(index, nowFloor)
				if (nowFloor == this.onfloor) {
					this.oncolumn = index
					this.lockFloor = this.onfloor
					if (this.isMustClear) {
						this.isMustClear = !this.isMustClear
					}
					if (this.onfloor != this.pkDetailIds.length) {
						if (index != 0) {
							this.floorList.splice(this.onfloor + 1, this.floorList.length - this.onfloor - 1)
						} else {
							let a = this.floorList.concat(this.list.slice(this.onfloor + 1))
							this.floorList = a
							this.clearnBrother()
						}
					}
				} else {
					// console.log("不应该滑动的楼层")
				}

			},
			floorChange(e) {
				let current = e.detail.current;
				// this.clearnBrother()	
				this.floorChangeCount = this.floorChangeCount + 1
				for (let i = 0; i < this.floorList.length; i++) {
					//原来的楼层
					if (this.onfloor == i) {
						if (this.oncolumn == 0) {
							// this.floorList = this.deepCopy(this.list)
							this.floorList[i].splice(1, this.floorList[i].length - 1)
						}
						if (this.onfloor != this.lockFloor) {
							this.floorList[i].splice(1, this.floorList[i].length - 1)
						}
					}
					//现楼层操作
					if (current == i) {
						let a = this.deepCopy(this.list)
						this.floorList[i] = a[i]
					}
				}
				this.onfloor = current
			},
			//清除兄弟
			clearnBrother() {
				// let a = this.deepCopy(this.floorList)
				this.floorList = this.deepCopy(this.list)
				for (let i = 0; i < this.floorList.length; i++) {
					if (this.onfloor != i) {
						if (this.oncolumn == 0) {
							this.floorList[i].splice(1, this.floorList[i].length - 1)
						} else {
							// this.floorList =  a

						}
					}
				}
			},
			// 深拷贝 方法
			deepCopy(o) {
				return JSON.parse(JSON.stringify(o))
			},
			// 增加改楼的 兄弟节点
			addBrother() {

				for (let i = 0; i < this.floorList.length; i++) {
					if (this.onfloor != i) {
						if (this.oncolumn == 0) {
							this.floorList[i].splice(1, this.floorList[i].length - 1)
						}
					}
				}

			},
			goPlay(index, nowFloor) {
				if (nowFloor != this.onfloor) {
					this.showToast()

				}else{
					uni.setStorageSync("pkDetailIds",this.playedHistoryArray);
					let b = uni.getStorageSync("pkDetailIds")
					let a = this.floorList[nowFloor][index]
					// 父节点跳转
					// for(let i= 0 ;i<b.length;i++){
					// 	if(b[i] == a.pkDetailId){
							
					// 	}
						
					// }
					this.$refs.uToast.show({
						title: '选中跳转到' + a.selectTitle +a.pkDetailId,
						type: 'success',
					})
					uni.navigateTo({
						url: "../play/play?pkArtworkId=" + this.pkArtworkId +"&pkDetailId=" + a.pkDetailId,
					})
				}
			},
			showToast() {
				this.$refs.uToast.show({
					title: '请在选中行进行跳转',
					type: 'error',
				})
			},
		}
	}
</script>

<style lang="scss">
	.wrap {
		// transform: translateY();
		width: 100%;
		height: 100%;
		position:fixed
	}

	.cpt-mask {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 400rpx;
		opacity: 0.5;
		z-index: 99;
		margin-top: 100rpx;
		// background-color: #000000;
	}

	.cpt-mask-tips-bottom {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 10rpx;
		opacity: 0.5;
		z-index: 99;
		margin-top: 930rpx;
		background-color: 	#E1FFFF;
	}
	.cpt-mask-tips-top{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 10rpx;
		margin-top: 500rpx;
		opacity: 0.5;
		z-index: 99;
		background-color: 	#E1FFFF;
	}
</style>
