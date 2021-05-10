<template>
	<view :class="playMode ? 'horizontal-moment-box' : ''" :style="{width: playMode ? windowHeight - marginh +'px' : windowWidth - marginw + 'px',
	 height: playMode ? windowWidth +'px' : windowHeight +'px', zIndex: '998', position: 'absolute'}">
		<!-- :style="{width: windowWidth+'px', height: windowHeight+'px', zIndex: '998'}" -->
		<view >
			<view class="content" v-for="(item, index) in actionOptionStyleArray" :key="index">
				<!-- 横屏 -->
				<!-- <view :style="{position: 'absolute',
				opacity: actionOptionStyleArray[index].opacity/100,
				left: arrData[index].actionCoordinateX * 100 + '%',
				top: arrData[index].actionCoordinateY * 100 + (actionOptionStyleArray[index].areaWidth/windowWidth* 100) + '%',
				color: arrData[index].actionTextColor,
				width: actionOptionStyleArray[index].areaWidth+'px',
				}" v-if="playMode"  >{{arrData[index].actionTextValue ? arrData[index].actionTextValue : reminderText }}</view>
				<view class="imageBox"
				 :style="{position: 'absolute',
				left: arrData[index].actionCoordinateX * 100 + '%',
				backgroundColor: 'rgba(255, 255, 255, 0)',
				top: arrData[index].actionCoordinateY * 100 +'%',
				transform: 'rotate('+actionOptionStyleArray[index].transform+'deg)',
				zIndex: '998',width: actionOptionStyleArray[index].areaWidth+'px',
				height: actionOptionStyleArray[index].areaHeight+'px'}" v-if="playMode" 
				@touchstart="touchstart(index,$event)" 
				@touchend="touchend(index,$event)" 
				@touchmove="touchmove(index,$event)">
					
					<image :style="{opacity: actionOptionStyleArray[index].opacity,
					width: actionOptionStyleArray[index].areaWidth * 0.618 + 'px', 
					height: actionOptionStyleArray[index].areaHeight * 0.618 +'px'
					}"
					:src="actionOptionStyleArray[index].src"></image>
					
				</view> 
				<!-- 竖屏 -->
				<!-- <view :style="{position: 'absolute',
				opacity: actionOptionStyleArray[index].opacity/100,
				left: arrData[index].actionCoordinateX * 100 + '%',
				top: arrData[index].actionCoordinateY * 100 + (actionOptionStyleArray[index].areaWidth/windowHeight* 100) +'%',
				color: arrData[index].actionTextColor,
				width: actionOptionStyleArray[index].areaWidth+'px',
				}"  v-if="!playMode">{{arrData[index].actionTextValue ? arrData[index].actionTextValue : reminderText}}</view>
				<view class="imageBox"
				 :style="{position: 'absolute',
				left: arrData[index].actionCoordinateX * 100 + '%',
				backgroundColor: 'rgba(255, 255, 255, 0)',
				top: arrData[index].actionCoordinateY * 100 +'%',
				transform: 'rotate('+actionOptionStyleArray[index].transform+'deg)',
				zIndex: '998',width: actionOptionStyleArray[index].areaWidth+'px',
				height: actionOptionStyleArray[index].areaHeight+'px'}" v-if="!playMode" 
				@touchstart="touchstart(index,$event)" 
				@touchend="touchend(index,$event)" 
				@touchmove="touchmove(index,$event)">
					<image :style="{opacity: actionOptionStyleArray[index].opacity,
					width: actionOptionStyleArray[index].areaWidth * 0.618 + 'px', 
					height: actionOptionStyleArray[index].areaHeight * 0.618 +'px'
					}"
					:src="actionOptionStyleArray[index].src"></image>
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
			},
			width: {
				type: Number,
				default: 0
			},
			height: {
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
				paramArray: null,
				moveFlag: false,
				//前端传过来的可触区域的高
				frontAreaHeight: 0,
				//前端传过来的可触区域的宽
				frontAreaWidth: 0,
				marginw: 0,
				marginh: 0,
				arrData: null,
				reminderText: "沿图案滑动手指，开启互动",
				color: "red"
			}
		},
		onReady() {
			//将用户手机窗口尺寸记录方便在方法中调用
			const {windowWidth,windowHeight} = uni.getSystemInfoSync()
			if (this.playMode) {
				this.marginw = windowHeight - this.width
				this.marginh = windowWidth - this.height
				this.windowHeight = windowHeight - this.marginw
				this.windowWidth = windowWidth - this.marginh
			}else {
				this.marginw = windowWidth - this.width
				this.marginh = windowHeight - this.height
				this.windowHeight = windowHeight - this.marginw
				this.windowWidth = windowWidth - this.marginh
			}
			console.log(this.marginw, this.marginh, this.width, this.height, '--------------------')
		},
		methods: {
			init(array){
				this.arrData = array
				this.paramArray = array
				//圆 短箭头 长箭头
				let verticalImageSrc = [
					'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/baseImg/1619147330186momvment-circle-H.png',
					'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/baseImg/1619147362693momvment-jiantou-H.png',
					'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/baseImg/1619147353446momvment-jiantou2-H.png'
				]
				/* let verticalImageSrc = [
					'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/img/circleA.gif',
					'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/img/rowA.gif',
					'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/img/longRowA.gif'
				] */
				this.actionOptionStyleArray = []
				for(let i = 0; i < array.length; i++){
					let eventType = array[i].actionEventType
					if(this.playMode == 0){
						this.areaWidth = parseInt(array[i].actionWide*this.windowWidth)
						this.areaHeight = parseInt(array[i].actionHigh*this.windowWidth)
						this.areaRight = parseInt(array[i].actionCoordinateX*this.windowWidth)
						this.areatop = parseInt(array[i].actionCoordinateY*this.windowHeight)
					}else{
						//横屏就是乘以屏幕的长边 竖屏就是乘以屏幕的短边
						this.areaWidth = parseInt(array[i].actionWide*this.windowHeight)
						this.areaHeight = parseInt(array[i].actionHigh*this.windowHeight)
						this.areaRight = parseInt(array[i].actionCoordinateX*this.windowWidth)
						this.areatop = parseInt(array[i].actionCoordinateY*this.windowHeight)
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
						areaHeight: this.areaHeight ,
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
				if(this.isValid){
					this.moveFlag = true
				}
				// console.log("*********x: ",x,"*********y: ",y)
				/* if(this.playMode === 0){
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
				} */
				// console.log("***********isValid2: ",this.isValid)
			},
			touchstart(index,e){
				this.isValid = true
				console.log(1)
				// console.log("**************e：",e)
				let x = e.touches[0].pageX
				let y = e.touches[0].pageY
				console.log("*********x: ",x,"*********y: ",y)
				/* if(this.playMode === 0){
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
				} */
				console.log("***********isValid1: ",this.isValid)
			},
			touchend(index,e){
				// console.log("**************e：",e)
				console.log(3)
				let x = e.changedTouches[0].pageX
				let y = e.changedTouches[0].pageY
				console.log("*********x: ",x,"*********y: ",y)
				if(this.playMode === 0){
					if(this.isValid && this.moveFlag){
						// let infos = this.actionOptionStyleArray[index]
						// let xLowLimit = infos.right
						// let xUpLimit = infos.right + infos.areaWidth
						// let yLowLimit = infos.top
						// let yUpLimit = infos.top + infos.areaHeight
						// console.log("************xLowLimit: ",xLowLimit,"**********xUpLimit: ",xUpLimit,
						// "**********yLowLimit: ",yLowLimit,"**********yUpLimit: ",yUpLimit)
						// if(x >= xLowLimit && x <= xUpLimit && y >= yLowLimit && y <= yUpLimit){
						for(let i = 0; i < this.referenceArray.length; i++){
							let currentFknodeId = this.paramArray[index].fkNodeId
							let referenceFknodeId = this.referenceArray[i].fkNodeId
							if(currentFknodeId === referenceFknodeId){
								this.$parent.optionIndex = i
								this.$parent.clickCommonOptionTodo(i)
								this.moveFlag = false
								break
							}
						}
						this.isValid = false
						this.moveFlag = false
					}
				}else{
					if(this.isValid && this.moveFlag){
						// let infos = this.paramArray[index]
						// let right = infos.actionCoordinateY*this.windowWidth
						// let top = infos.actionCoordinateX*this.windowHeight
						// let areaWidth = parseInt(infos.actionWide*this.windowHeight)
						// let areaHeight = parseInt(infos.actionHigh*this.windowHeight)
						// let xUpLimit = this.windowWidth - right
						// let xLowLimit = xUpLimit - areaHeight
						// let yLowLimit = top
						// let yUpLimit = top + areaWidth
						// console.log("************xLowLimit: ",xLowLimit,"**********xUpLimit: ",xUpLimit,
						// "**********yLowLimit: ",yLowLimit,"**********yUpLimit: ",yUpLimit)
						// if(x >= xLowLimit && x <= xUpLimit && y >= yLowLimit && y <= yUpLimit){
						for(let i = 0; i < this.referenceArray.length; i++){
							let currentFknodeId = this.paramArray[index].fkNodeId
							let referenceFknodeId = this.referenceArray[i].fkNodeId
							if(currentFknodeId === referenceFknodeId){
								this.$parent.optionIndex = i
								this.$parent.clickCommonOptionTodo(i)
								this.moveFlag = false
								break
							}
						}
						this.isValid = false
						this.moveFlag = false
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
	.horizontal-moment-box {
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) rotate(90deg);
	}
	.maskBox{
		background-color: rgba(255, 255, 255, 0);
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

