<template>
	<view>
		<view :style="{width: windowWidth+'px', height: windowHeight+'px', zIndex: '998'}">
			<view class="maskBox"></view>
			<view class="content" v-for="(item, index) in actionOptionStyleArray" :key="index">
				<!-- 横屏 -->
				<view :style="{position: 'fixed', 
						right: actionOptionStyleArray[index].right+'px',
						top: actionOptionStyleArray[index].top+'px',
						transform: 'rotate(90deg)'
						}" v-if="playMode" 
						@touchstart="touchstart(index,$event)" 
						@touchend="touchend(index,$event)"
						@touchmove="touchmove(index,$event)">
					<view class="imageBox" :style="{width: actionOptionStyleArray[index].areaWidth+'px',
						height: actionOptionStyleArray[index].areaHeight+'px',
						}">
						<image :style="{opacity: actionOptionStyleArray[index].opacity,
						width: actionOptionStyleArray[index].imageWidth +'px', 
						height: actionOptionStyleArray[index].imageHeight+'px',
						transform: 'rotate('+actionOptionStyleArray[index].transform+'deg)'
						}"
						:src="actionOptionStyleArray[index].src"></image>
					</view>
				</view>
				<!-- 竖屏 -->
				<view :style="{position: 'fixed',
						left: actionOptionStyleArray[index].right+'px',
						backgroundColor: 'rgba(255, 255, 255, 0.5)',
						top: actionOptionStyleArray[index].top+'px',
						}" v-if="!playMode" 
						@touchstart="touchstart(index,$event)" 
						@touchend="touchend(index,$event)" 
						@touchmove="touchmove(index,$event)">
					<view class="imageBox" :style="{width: actionOptionStyleArray[index].areaWidth+'px',
						height: actionOptionStyleArray[index].areaHeight+'px', 
						}">
						<image :style="{opacity: actionOptionStyleArray[index].opacity,
						width: actionOptionStyleArray[index].imageWidth +'px', 
						height: actionOptionStyleArray[index].imageHeight+'px',
						transform: 'rotate('+actionOptionStyleArray[index].transform+'deg)'
						}"
						:src="actionOptionStyleArray[index].src"></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			//for test
			array: {
				type: Array,
				default: null
			},
			referenceArray: {
				type: Array,
				default: null
			},
			playMode: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				windowWidth: 0,
				windowHeight: 0,
				actionOptionStyleArray: [],
				//图片大小与矩形区域大小的比率
				scale: 0,
				areaWidth: 0,
				areaHeight: 0,
				areaRight: 0,
				areatop: 0,
				isValid: false,
				paramArray: null
			}
		},
		onReady() {
			//将用户手机窗口尺寸记录方便在方法中调用
			const {windowWidth,windowHeight} = uni.getSystemInfoSync()
			this.windowHeight = windowHeight
			this.windowWidth = windowWidth
		},
		methods: {
			init(array){
				this.paramArray = array
				//圆 短箭头 长箭头
				let verticalImageSrc = [
					'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/baseImg/1619077580993momvment-circle.png',
					'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/baseImg/1619077603467momvment-jiantou.png',
					'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/baseImg/1619077233272momvment-jiantou2.png'
				]
				this.actionOptionStyleArray = []
				for(let i = 0; i < array.length; i++){
					let eventType = array[i].actionEventType
					if(this.playMode == 0){
						this.areaWidth = parseInt(this.array[i].actionWide*this.windowWidth)
						this.areaHeight = parseInt(this.array[i].actionHigh*this.windowWidth)
						this.areaRight = parseInt(array[i].actionCoordinateX*this.windowWidth)
						this.areatop = parseInt(array[i].actionCoordinateY*this.windowHeight)
					}else{
						//横屏就是乘以屏幕的长边 竖屏就是乘以屏幕的短边
						this.areaWidth = parseInt(array[i].actionWide*this.windowHeight)
						this.areaHeight = parseInt(array[i].actionHigh*this.windowHeight)
						this.areaRight = parseInt(array[i].actionCoordinateY*this.windowWidth + 0.5*this.areaHeight - 0.5*this.areaWidth)
						this.areatop = parseInt(array[i].actionCoordinateX*this.windowHeight +  0.5*this.areaWidth - 0.5*this.areaHeight)
					}
					// console.log("******left: ",this.areaRight)
					// console.log("******top: ",this.areatop)
					let scale = array[i].actionScale
					let imageWidth = parseInt(this.areaWidth*scale)
					let imageHeight = parseInt(this.areaHeight*scale)
					let src = verticalImageSrc[eventType]
					let imageOpacity = array[i].actionOpacity
					let transform = array[i].actionTransform
					let obj = {
						areaWidth: this.areaWidth,
						areaHeight: this.areaHeight,
						imageWidth: imageWidth,
						imageHeight: imageHeight,
						src: src,
						right: this.areaRight,
						top: this.areatop,
						opacity: imageOpacity,
						transform: transform
					}
					this.actionOptionStyleArray.push(obj)
				}
			},
			touchmove(index,e){
				// console.log("**************e：",e)
				let x = e.touches[0].pageX
				let y = e.touches[0].pageY
				console.log("*********x: ",x,"*********y: ",y)
				if(this.playMode === 0){
					if(this.isValid){
						let infos = this.actionOptionStyleArray[index]
						let xLowLimit = infos.right
						let xUpLimit = infos.right + infos.areaWidth
						let yLowLimit = infos.top
						let yUpLimit = infos.top + infos.areaHeight
						// console.log("************xLowLimit: ",xLowLimit,"**********xUpLimit: ",xUpLimit,
						// "**********yLowLimit: ",yLowLimit,"**********yUpLimit: ",yUpLimit)
						if(x >= xLowLimit && x <= xUpLimit && y >= yLowLimit && y <= yUpLimit){
							this.isValid = true
						}else{
							this.isValid = false
						}
					}
				}else{
					if(this.isValid){
						let infos = this.paramArray[index]
						let right = infos.actionCoordinateY*this.windowWidth
						let top = infos.actionCoordinateX*this.windowHeight
						let areaWidth = parseInt(infos.actionWide*this.windowHeight)
						let areaHeight = parseInt(infos.actionHigh*this.windowHeight)
						let xUpLimit = this.windowWidth - right
						let xLowLimit = xUpLimit - areaHeight
						let yLowLimit = top
						let yUpLimit = top + areaWidth
						// console.log("************xLowLimit: ",xLowLimit,"**********xUpLimit: ",xUpLimit,
						// "**********yLowLimit: ",yLowLimit,"**********yUpLimit: ",yUpLimit)
						if(x >= xLowLimit && x <= xUpLimit && y >= yLowLimit && y <= yUpLimit){
							this.isValid = true
						}else{
							this.isValid = false
						}
					}
				}
				console.log("***********isValid2: ",this.isValid)
			},
			touchstart(index,e){
				console.log(1)
				// console.log("**************e：",e)
				let x = e.touches[0].pageX
				let y = e.touches[0].pageY
				console.log("*********x: ",x,"*********y: ",y)
				if(this.playMode === 0){
					let infos = this.actionOptionStyleArray[index]
					let xLowLimit = infos.right
					let xUpLimit = infos.right + infos.areaWidth
					let yLowLimit = infos.top
					let yUpLimit = infos.top + infos.areaHeight
					// console.log("************xLowLimit: ",xLowLimit,"**********xUpLimit: ",xUpLimit,
					// "**********yLowLimit: ",yLowLimit,"**********yUpLimit: ",yUpLimit)
					if(x >= xLowLimit && x <= xUpLimit && y >= yLowLimit && y <= yUpLimit){
						this.isValid = true
					}else{
						this.isValid = false
					}
				}else{
					let infos = this.paramArray[index]
					let right = infos.actionCoordinateY*this.windowWidth
					let top = infos.actionCoordinateX*this.windowHeight
					let areaWidth = parseInt(infos.actionWide*this.windowHeight)
					let areaHeight = parseInt(infos.actionHigh*this.windowHeight)
					let xUpLimit = this.windowWidth - right
					let xLowLimit = xUpLimit - areaHeight
					let yLowLimit = top
					let yUpLimit = top + areaWidth
					// console.log("************xLowLimit: ",xLowLimit,"**********xUpLimit: ",xUpLimit,
					// "**********yLowLimit: ",yLowLimit,"**********yUpLimit: ",yUpLimit)
					if(x >= xLowLimit && x <= xUpLimit && y >= yLowLimit && y <= yUpLimit){
						this.isValid = true
					}else{
						this.isValid = false
					}
				}
				console.log("***********isValid1: ",this.isValid)
			},
			touchend(index,e){
				// console.log("**************e：",e)
				console.log(3)
				let x = e.changedTouches[0].pageX
				let y = e.changedTouches[0].pageY
				console.log("*********x: ",x,"*********y: ",y)
				if(this.playMode === 0){
					if(this.isValid){
						let infos = this.actionOptionStyleArray[index]
						let xLowLimit = infos.right
						let xUpLimit = infos.right + infos.areaWidth
						let yLowLimit = infos.top
						let yUpLimit = infos.top + infos.areaHeight
						// console.log("************xLowLimit: ",xLowLimit,"**********xUpLimit: ",xUpLimit,
						// "**********yLowLimit: ",yLowLimit,"**********yUpLimit: ",yUpLimit)
						if(x >= xLowLimit && x <= xUpLimit && y >= yLowLimit && y <= yUpLimit){
							for(let i = 0; i < this.referenceArray.length; i++){
								let currentFknodeId = this.paramArray[index].fkNodeId
								let referenceFknodeId = this.referenceArray[i].fkNodeId
								if(currentFknodeId === referenceFknodeId){
									this.$parent.optionIndex = i
									this.$parent.clickCommonOptionTodo(i)
									break
								}
							}
						}else{
							this.isValid = false
						}
					}
				}else{
					if(this.isValid){
						let infos = this.paramArray[index]
						let right = infos.actionCoordinateY*this.windowWidth
						let top = infos.actionCoordinateX*this.windowHeight
						let areaWidth = parseInt(infos.actionWide*this.windowHeight)
						let areaHeight = parseInt(infos.actionHigh*this.windowHeight)
						let xUpLimit = this.windowWidth - right
						let xLowLimit = xUpLimit - areaHeight
						let yLowLimit = top
						let yUpLimit = top + areaWidth
						// console.log("************xLowLimit: ",xLowLimit,"**********xUpLimit: ",xUpLimit,
						// "**********yLowLimit: ",yLowLimit,"**********yUpLimit: ",yUpLimit)
						if(x >= xLowLimit && x <= xUpLimit && y >= yLowLimit && y <= yUpLimit){
							for(let i = 0; i < this.referenceArray.length; i++){
								let currentFknodeId = this.paramArray[index].fkNodeId
								let referenceFknodeId = this.referenceArray[i].fkNodeId
								if(currentFknodeId === referenceFknodeId){
									this.$parent.optionIndex = i
									this.$parent.clickCommonOptionTodo(i)
									break
								}
							}
						}else{
							this.isValid = false
						}
					}
				}
			},
		}
	}
</script>

<style lang="scss" >
	page{
		width: 100%;
		height: 100%;
	}
	.maskBox{
		background-color: rgba(255, 255, 255, 0.5);
		width: 100%;
		height: 100%;
	}
	.content{
		width: 100%;
		height: 100%;
	}
	.imageBox{
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>

