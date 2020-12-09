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
				lockEndingFloor: -1

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
					pkArtworkEndingNodeId: pkArtworkEndingNodeId
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
				
					// 跳转的 节点
					let a = this.floorList[nowFloor][index]
					// 播放记录 
					let b = uni.getStorageSync("pkDetailIds")
					// 选中楼层的 第一个节点 
					let c = this.floorList[nowFloor][0]
					// 多节点播放记录  
					let d = uni.getStorageSync("multipleResultLine")
					// let mainArtworkTree  = uni.getStorageSync("mainArtworkTree")
					
					console.log(d)					
					if (a.parentId == -1) {
						this.showToast('请选择上面有选项的进行跳转！')
						return
					}
					if (this.endingFlag) {
						if (nowFloor == this.lockEndingFloor){
							this.showToast('请选择上面的一级跳转！')
							return
						}
					}
					
					
					if (a.isNumberSelect != null ) {
							this.isNumberFlag = a.isNumberSelect + 0 == 1 
					}

					if (a.isNumberSelect != null) {
						if ((a.isNumberSelect - 0) === 1) {
							console.log('isNumberSelect:'+ a.isNumberSelect)
							if (index != 0 ) {
								this.showToast('本选项数值选项，无法直接跳转，请在上级进行跳转')
								return 
							} 
						}	
					}
						
					// let jumpFlag = 0
					let jumpFlag = false
					b.forEach( v => {
						if(v == a.pkDetailId  ) {
							jumpFlag  = true
						}
					})
					// 父节点跳转
					for (let i = 0; i < b.length; i++) {
						if (b[i] == c.pkDetailId) {
							b.splice(i)
							if ( i != 0) {
								if (d !=null && d.length > 0) {
									d.splice(i -1 )
								}
							}
							
						}
					}
					// console.log(a.pkDetailId)
					// // console.log("递归结果："+ this.finduexTreeByPkDetailId(a.pkDetailId))
					// console.log(nowFloor)
					if (this.endingFlag) {
						if (nowFloor ==  0) {
							d = [] 
						}else {
							d.push(this.finduexTreeByPkDetailId(a.pkDetailId)+1)
						}
					}	
					
					// this.resData.forEach( v => {
					// 	if (c.pkDetailId == v.pkDetailId ) {
					// 		v.brotherNode.forEach( (n,i)=> {
					// 			if ( a.pkDetailId == n.pkDetailId ) {
									// d.push(i+1)
					// 			}
					// 		})
					// 	}
					// })

					uni.setStorageSync("multipleResultLine", d);
					uni.setStorageSync("pkDetailIds", b);
					this.$refs.uToast.show({
						title: '选中跳转到' + a.selectTitle ,
						type: 'success',
					})
					
					//使用组件跳转方式 传参
					this.$emit("goPlay",{
					'pkArtworkId': this.pkArtworkId,
					'pkDetailId': a.pkDetailId,
					'jumpFlag':jumpFlag
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
