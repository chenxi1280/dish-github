<template>
	<view class="wrap">

		<!-- <u-mask :show="true" style="width: 375px ; height: 100px;  position: fixed; left: 0; top: 0;z-index: 10;" ></u-mask> -->
		<!-- <view class="cpt-mask"> </view> -->
		<swiper :vertical="true" :previous-margin="'150'" :next-margin="'280'" :current="onfloor" @change="floorChange" style="width: 100%; height: 650px; ">
			<swiper-item v-for="(item, floor) in floorList" :key="floor" style="margin-top: 12rpx; height: 334px; ">
				<mswiper :list="item" :title="true" :circular="false" :autoplay="false" :height="420" :effect3d="true" :isBig="onfloor == floor"
				 :effect3d-previous-margin="80" @change="columnChange" @click="goPlay" :nowFloor="floor"></mswiper>
			</swiper-item>
		</swiper>
<!-- 		<view class="cpt-mask-tips-bottom"> </view>
		<view class="cpt-mask-tips-top"> </view> -->
		<u-toast ref="uToast" />
		<view>
			<u-modal v-model="showAdvertisingFlagStory" title="温馨提示" :show-confirm-button="false" z-index="999">
				<view class="slot-content">
					<view style="padding: 0 20rpx;padding-top: 40rpx;">
						<view>完整观看激励视频才可以跳转到该节点</view>
						<view @click="openAdvertising" style="padding: 20rpx;background-color: #985ba9;width: 400rpx;margin-left: calc(50% - 200rpx); margin-top: 60rpx;text-align: center;border-radius: 10rpx;margin-bottom: 40rpx;">
							<image src="../../../static/icon/showVideo.png" style="width: 40rpx;height: 40rpx;display: inline-block;transform: translateY(4rpx);"></image>
							<view style="display: inline-block;margin-left: 10rpx;color: #fff;transform: translateY(-4rpx);">立即获取</view>
						</view>
						<view @click="closeDialog" style="position: absolute;right: 20rpx; top: 20rpx;width: 40rpx;height: 40rpx;text-align: center;line-height: 40rpx;font-size: 40rpx;">x</view>
					</view>
				</view>
			</u-modal>
		</view>
	</view>
</template>

<script>
	import mswiper from '../../../components/h-swiper/h-swiper'
	import {
		baseURL
	} from '../../login/config/config.js'
	export default {
		props: {
			//需要传递的2个值pkArtworkId 作品id ，pkDetailIds 播放过的节点id数组
			pkArtworkId: {
				type: [Number, String],
				default: 10138
			},
			pkDetailIds: {
				type: Array,
				default () {
					return [11061, 11063, 11071]
				}
			},
			// pkArtworkEndingNodeId: {
			// 	type: [Number, String],
			// 	default: null
			// }
		},
		components: {
			mswiper
		},
		data() {
			return {
				// 当前数据
				list: [],
				floorList: [],
				onfloor: 5, // 当前楼
				oncolumn: 0, // 当前列
				lockFloor: 0, // 锁定楼层
				lockColumn: 0 ,// 锁定列
				isNumberFlag:false,
				resData:[],
				endingFlag: false,
				lockEndingFloor: -1,
				showAdvertisingFlagStory: false

			}
		},

		onReady(option) {
			
			this.onfloor = this.pkDetailIds.length - 1
			let userId = uni.getStorageSync("userId")
			let pkArtworkEndingNodeId = uni.getStorageSync("fkNodeId")
			this.endingFlag =  uni.getStorageSync("isEndings")
			uni.request({
				url:  baseURL + '/Ecmartwork/getArtWorkNodes',
				// url: 'http://192.168.1.15:8008/Ecmartwork/getArtWorkNodes',
				method: 'POST',
				data: {
					pkArtworkId: this.pkArtworkId,
					intVideoId: this.pkDetailIds[this.onfloor],
					fkUserid: userId,
					pkArtworkEndingNodeId: pkArtworkEndingNodeId,
					endingFlag:this.endingFlag
				},
				success: res => {
					// console.log(res.data.data)
					this.resData = res.data.data
					this.pkDetailIds.forEach( v => {
						res.data.data.forEach(node => {
							if (v === node.pkDetailId) {
								if (node.isLink == 1) {
									res.data.data.forEach( item => {
										if (node.linkUrl == item.pkDetailId) {		
											this.setNode(node.brotherNode, v,item)
											this.list.push(node.brotherNode)
											this.floorList.push(node.brotherNode)
										}
									})
								}else {
									this.setNode(node.brotherNode, v)
									this.list.push(node.brotherNode)
									this.floorList.push(node.brotherNode)
								}
							}
						})
					})
					// console.log(this.list)
					console.log(this.floorList)
					if (this.floorList[this.floorList.length -1][0].parentId == - 1 )  {
						// this.endingFlag = true
						this.lockEndingFloor = this.floorList.length - 2
					}
					this.clearnBrother()
				}
			})
			
			
		},
		methods: {
			// 换位置，并 修改title img 
			setNode(data, pkNodeId,item) {
				if (data != null && data.length >= 1){
					for (let i = 0; i < data.length; i++) {
						data[i].title = data[i].selectTitle
						data[i].image = data[i].nodeImgUrl
						//是否展示问号
						data[i].isWatch = false
						if (pkNodeId === data[i].pkDetailId) {
							if (item != null )  data[i].image = item.nodeImgUrl
							data[i].isWatch = true
							data.unshift(data[i])
							data.splice(i + 1, 1)
						}
					}
					return data
				}
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
			// 切换楼层
			floorChange(e) {
				let current = e.detail.current;
				// this.clearnBrother()	
				console.log("当前楼层："+ current,"当前列："+ this.oncolumn)
				for (let i = 0; i < this.floorList.length; i++) {
					//原来的楼层
					if (this.onfloor == i) {
						if (this.oncolumn == 0) {
							console.log(11)
							// this.floorList = this.deepCopy(this.list)
							console.log()
							this.floorList[i].splice(1, this.floorList[i].length - 1)
						}
						if (this.onfloor != this.lockFloor) {
							console.log(22)
							this.floorList[i].splice(1, this.floorList[i].length - 1)
						}
					}
					//现楼层操作
					if (current == i) {
						let a = this.deepCopy(this.list)
						this.floorList[i] = a[i]
					}
				}
				if(this.onfloor > current) {
					this.lockColumn = this.oncolumn
					this.oncolumn = 0
				}else {
					this.oncolumn = this.lockColumn
				}
				console.log("原来的楼层"+ this.onfloor,"现在的列:"+ this.oncolumn)
				this.onfloor = current
				// this.oncolumn = 0
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
				if (nowFloor == this.onfloor && index == this.oncolumn) {
				
					let onNode = this.floorList[nowFloor][index]
					// 播放记录 
					let playHistory = uni.getStorageSync("pkDetailIds")
					// 当前选中楼层的 播放的节点 
					let playNode = this.floorList[nowFloor][0]
					// 多节点播放记录
					let moreEndingHistory = uni.getStorageSync("multipleResultLine")
					
					if (onNode.parentId == -1) {
						this.showToast('请选择上面有选项的进行跳转！')
						return
					}
					if (this.endingFlag) {
						if (nowFloor == this.lockEndingFloor) {
							this.showToast('请选择上面一级跳转！')
							return
						}
					}
					if (onNode.isNumberSelect != null) {
						if ((onNode.isNumberSelect - 0) === 1) {
							if (index != 0) {
								this.showToast('本选项数值选项，无法直接跳转，请在上级进行跳转')
								return
							}
						}
					}
					console.log(onNode.pkDetailId)
					console.log(playHistory)
					// 是否跳转自己
					let jumpFlag = false
					playHistory.forEach(v => {
						if (v == onNode.pkDetailId) {
							jumpFlag = true
						}
					})
					console.log(jumpFlag)
					// 父节点跳转
					for (let i = 0; i < playHistory.length; i++) {
						if (playHistory[i] == playNode.pkDetailId) {
							playHistory.splice(i)
							if (i != 0) {
								if (moreEndingHistory != null && moreEndingHistory.length > 0) {
									moreEndingHistory.splice(i - 1)
								}
							}
					
						}
					}
					if (this.endingFlag) {
						if (nowFloor == 0) {
							moreEndingHistory = []
						} else {
							moreEndingHistory.push(this.finduexTreeByPkDetailId(onNode.pkDetailId) + 1)
						}
					}
					if (onNode.conditionState && !jumpFlag) {
						console.log('我进来了')
						this.moreEndingHistory = moreEndingHistory
						this.playHistory = playHistory
						this.onNode = onNode
						this.jumpFlag = jumpFlag
						this.showAdvertisingFlagStory = true
						return
						// this.$parent.showDialog()
					}
					//需要封装 重新吊起
					uni.setStorageSync("multipleResultLine", moreEndingHistory);
					// 修改 storage 的播放历史
					uni.setStorageSync("pkDetailIds", playHistory);
					this.$refs.uToast.show({
						title: '选中跳转到' + onNode.selectTitle,
						type: 'success',
					})
					//使用组件跳转方式 传参
					this.$emit("goPlay", {
						'pkArtworkId': this.pkArtworkId,
						'pkDetailId': onNode.pkDetailId,
						'jumpFlag': jumpFlag
					})
					
				} else {
					this.showToast('请滑动至选择中心位进行跳转')
				}
			},
			showToast(msg) {
				this.$refs.uToast.show({
					title: msg,
					type: 'error',
				})
			},
			finduexTreeByPkDetailId (pkDetailId) {
			  const newNodeData =  uni.getStorageSync("mainArtworkTree")
			  let a 
			  finduexTree(pkDetailId, newNodeData)
			  return  a
			  function finduexTree (pkDetileId, newNodeData) {
			    if (newNodeData.pkDetileId == pkDetileId) {
			       a = -1
			    } else {
			      if (newNodeData.childs != null) {
			        newNodeData.childs.forEach( (v,i) => {
			          if (v.pkDetailId == pkDetileId) {
						a = i
			            // return i
			          }else{
						  finduexTree( pkDetileId, v)
					  }
			        })
			      }
			    }
			  }
			 
			},
			closeDialog() {
				this.showAdvertisingFlagStory = false
			},
			// 观看激励广告
			openAdvertising() {
				this.showAdvertisingFlagStory = false
				this.advertising = wx.createRewardedVideoAd({
					adUnitId: 'adunit-7423fd1b2c7c5724'
				})
				//捕捉错误
				this.advertising.onError(err => {
					uni.showToast({
						icon: 'none',
						title: '获取激励视频失败，请重试'
					})
				})
				// 激励广告显示并加载
				if (this.advertising) {
					this.advertising.load().then(() => {
						this.advertising.show().then(() => {})
					}).catch(() => {
						this.advertising.load().then(() => {
							this.advertising.show().then(() => {
			
							})
						}).catch(() => {
							uni.showToast({
								icon: 'none',
								title: '激励视频加载失败，请重试'
							})
						})
					})
				}
				// 监听激励广告关闭
				this.advertising.onClose((status) => {
					if (status.isEnded) {
			
						uni.setStorageSync("multipleResultLine", this.moreEndingHistory);
						// 修改 storage 的播放历史
						uni.setStorageSync("pkDetailIds", this.playHistory);
						this.$refs.uToast.show({
							title: '选中跳转到' + this.onNode.selectTitle,
							type: 'success',
						})
						//使用组件跳转方式 传参
						this.$emit("goPlay", {
							'pkArtworkId': this.pkArtworkId,
							'pkDetailId': this.onNode.pkDetailId,
							'jumpFlag': this.jumpFlag
						})
						console.log('给光')
			
			
					} else {
						uni.showToast({
							icon: 'none',
							title: '未观看完广告无法跳转'
						})
					}
					this.advertising.offClose()
				})
			}
		}
	}
</script>

<style lang="scss">
	.wrap {
		// transform: translateY();
		width: 100%;
		height: 100%;
		position: fixed
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
		margin-top: 890rpx;
		background-color: #E1FFFF;
	}

	.cpt-mask-tips-top {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 10rpx;
		margin-top: 440rpx;
		opacity: 0.5;
		z-index: 99;
		background-color: #E1FFFF;
	}
</style>
