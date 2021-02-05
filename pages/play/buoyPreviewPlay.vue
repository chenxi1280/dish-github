<template>
		<view class="playBox">
			<view class="play"  :style="{'width': mobilePhoneWidth+'px', 'height': mobilePhoneHeight+'px'}">
				<!-- 定位选项画布 -->
				<view class="container" v-show="showBuoyCanvasFlag" :style="{'width': canvasWidth+'px', 'height': canvasHeight+'px'}">
					<canvas type="2d" id='posterCanvas' @touchstart="canvasBuoyTouchstart"></canvas>
				</view>
				<!-- 播放主体   @click="showButton" @timeupdate="videoTimeupdate" -->
				<view class="videoBox" :style="{'width': videoWidth+'px', 'height': videoHeight+'px', 'transform': transform}">
					<video :src="videoUrl" :loop="true" @timeupdate="getNewVideoPlayTime" :autoplay="true" @loadedmetadata="loadedmetadata"
					 :style="{'width': videoWidth +'px', 'height': videoHeight+'px'}"  @ended="videoEnd"></video>
					<!-- 视频播放结束触发事件显示最后一帧截图 -->
					<!-- 				<view v-if="screenshotShowFlag" class="screenshot" :style="{backgroundImage: 'url(' + imageSrc + ')',
						'background-repeat':'no-repeat', backgroundSize:'100% 100%'}"></view> -->
				</view>
			</view>
			<u-modal v-model="previewShow"
					show-cancel-button="true"
					:cancel-style="{background: '#B5B5B5'}"
					confirm-text="登录"
					:confirm-style="{background: '#F08080'}"
					:show-title = 'false'
					cancel-color="white"
					confirm-color="white"
					:content-style="{'word-wrap': 'break-word',
									'word-break': 'break-all',
									'white-space': 'pre-line',
									'text-align': 'center',
									'margin': '5% 5%'}"
					@confirm="goLogin">
				<view class="slot-content">
					<rich-text nodes="预览作品只能作者自己观看\n\n请登录作者帐号"></rich-text>
				</view>
			</u-modal>
		</view>
</template>

<script>
	import {
		baseURL
	} from '../login/config/config.js'
	export default {

		data() {
			return {
				//扫码预览提示框开关
				previewShow: false,
				transform: 'translate(-50%, -50%)',
				// 是否自动播放标志
				autopalyFlag: true,
				// 是否开启手势标志
				playGestureFlag: true,
				// 是否开启进度控制手势开关
				progressGestureFlag: true,
				videoUrl: '',
				videoWidth:0,
				videoHeight:0,
				canvasHeight:0,
				canvasWidth:0,

				// 后台数据
				ecmArtworkNodeBuoyList: [
					
				],
				// canvas context 对象
				buoyCtx: null,
				// canvas 对象
				buoyCanvas: null,
				// 重绘 canvas 数组  1维，为 正在canvas 上的 对象数组
				buoyRectList: [],
				// canvas 对象 数组，为 后台数据 初始化完成后 储存的 canvas 对象 数组
				canvasNodeBuoyList: [],
				// 画图 返回的 执行id
				buoyRef: null,
				// 当前时间
				buoyCurrentTime: 0,
				// canvas是否展示 flag
				showBuoyCanvasFlag: false,
				mobilePhoneHeight: 0,
				mobilePhoneWidth:0,
			}
		},

		onReady(option) {

				const {windowWidth, windowHeight, brand, model} = uni.getSystemInfoSync()
				uni.setStorageSync('windowSize',{
					'windowWidth': windowWidth,
					'windowHeight': windowHeight
				})
				
				this.mobilePhoneHeight = windowHeight
				this.mobilePhoneWidth = windowWidth

		},
		onLoad(option) {
			console.log(option.scene)
			this.option = option
			this.initPageInfo()
			
			// this.initializationBuoy(0, 0, 0, 0)
		},
		methods: {
			//去登陆
			goLogin(){
				uni.redirectTo({
					url: '../login/login/login?isPlayJump='+true
				})
			},
			goDiscover(){
				console.log('我触发了')
				uni.switchTab({
					url: '../dishover/dishover',
					fail(err) {
						console.log('跳转失败:',err)
					}
				})
			},
			initPageInfo() {
				console.log('this.option.scene',this.option.scene)
				if(this.option.scene){
						let scene = decodeURIComponent(this.option.scene);
						var arr = scene.split('=')
						//a是artworkId b是status -0是为了将string 转化成number
						let a = arr[1] - 0
						let b = arr[3] - 0
						//b=1 表示用户扫描的预览的二维码
						this.artworkId = a;
						this.pkDetailId = b
				}
				
				let token = uni.getStorageSync("token")
				if (token == null || token == '') {
					this.previewShow = true
					return
				}
				
				this.getArtworkTreeByArtworkId()
				
			},
			//初始化竖屏canvas画布
			initVerticalCanvas() {
				// const buoyCtx = wx.getContext('myCanvas')
				// // console.log('画布的宽: ',this.canvasWidth)
				// // console.log('画布的高: ',this.canvasHeight)
				// buoyCtx.clearRect(0 , 0 , this.canvasWidth, this.canvasHeight)
				const query = wx.createSelectorQuery()
				query.select('#posterCanvas')
					.fields({
						node: true,
						size: true
					})
					.exec((res) => {
						const canvas = res[0].node;
						this.buoyCanvas = canvas
						canvas.width = this.canvasWidth
						canvas.height = this.canvasHeight
						console.log('canvas.width',canvas.width,"this.canvasHeight",this.canvasHeight)
						const ctx = canvas.getContext('2d')
						this.buoyCtx = ctx
						console.log(canvas)
						this.initializationBuoyList()

					})

			},
			// 移动函数
			buoyDraw() {
				// 关闭 动画
				if (this.buoyCanvas != null) {
					this.buoyCanvas.cancelAnimationFrame(this.buoyRef)
					// console.log(this.rect)
					this.buoyCtx.clearRect(0, 0, this.buoyCanvas.width, this.buoyCanvas.height);
					this.buoyRectList.forEach((v, index) => {
						v.draw();
						v.x += v.vx;
						v.y += v.vy;
					
					})
					// console.log('这是第',this.start)
					// this.start +=1
					
					this.buoyRef = this.buoyCanvas.requestAnimationFrame(() => this.buoyDraw());
				}
				
			},
			// 初始化 浮标对象
			initializationBuoy(rectX, rectY, rectW , rectH, vx, vy, rectOpacity, nodeId, buoySectionTime, buoyType,targetX,targetY,targetTime) {
				// 默认 透明度0.9
				// rectOpacity = 0.9
				return {
					// x 位置
					x: rectX,
					// y 位置
					y: rectY,
					// 宽
					rectH: rectH,
					// 高
					rectW: rectW,
					//移动速度 x
					vx: vx,
					// 移动速度y
					vy: vy,
					// 透明度
					opacity: rectOpacity,
					// canvase 2d
					ctx: this.buoyCtx,
					nodeId: nodeId,
					buoySectionTime: buoySectionTime ,
					//当前 移动对象的  类型是否为最后一个
					buoyType: buoyType,
					// 目标位置 X
					targetX:targetX,
					//目标位置Y
					targetY:targetY,
					// 目标时间 
					targetTime:targetTime,
					draw: function() {
						// 开始路径
						this.ctx.beginPath();
						this.ctx.rect(this.x, this.y, this.rectH, this.rectW)
						// 闭合路径
						this.ctx.closePath();
						// this.ctx.fillRect(255, 255, 255,0.5);
						this.ctx.fillStyle = "rgba(255, 255, 255," + this.opacity + ")";
						this.ctx.fill()
					}
				}
			},

			// 浮标对象 转化 canvas移动对象
			buoyToCanvasClass(v) {
				let rectOpacity = v.buoyOpacity + 0

				let rectX = parseInt(((v.buoyCoordinateX + 0) * this.canvasWidth).toFixed(0))
				// console.log('矩形框的x轴坐标: ',rectX)
				let rectY = parseInt(((v.buoyCoordinateY + 0) * this.canvasHeight).toFixed(0))
				// console.log('矩形框的y轴坐标: ',rectY)
				//矩形框高度
				let rectH = parseInt(((v.buoyHigh + 0) * this.canvasHeight).toFixed(0))
				// console.log('矩形框的高: ',rectH)
				//矩形框宽度
				let rectW = parseInt(((v.buoyWide + 0) * this.canvasWidth).toFixed(0))

				return this.initializationBuoy(rectX, rectY, rectW, rectH, rectOpacity)
			},
			//、 获取当前播放视频时间
			getNewVideoPlayTime(e) {
				// 当前时间
				let newTime = Math.floor(e.detail.currentTime)
				this.buoyNewTime = e.detail.currentTime
				this.currentTime =  e.detail.currentTime
				this.buoySpeedCalibration()
				// console.log('tie',e.detail.currentTime,'newTime',newTime)
				// 4舍5入 1s会触发4次 所以 ，修改只能1秒一次 （未知效率）
				if (this.buoyCurrentTime == newTime || newTime == 0) {
					// this.buoyCanvas.requestAnimationFrame(() => this.draw())
					return
				}
				//获取视频当前时间
				this.buoyCurrentTime = newTime
				// 遍历 初始化后的可直接用于画图的 类canvas对象2维数组 index 位置下表
				this.canvasNodeBuoyList.forEach((nodeBuoyList, index) => {
					// 变量 为几号位置 数组
					// console.log(index)
					nodeBuoyList.forEach((nodeBuoy) => {

						//当时间相等时
						// console.log('时间',nodeBuoy.buoySectionTime === newTime)
						// console.log(newTime)
						if (nodeBuoy.buoySectionTime === newTime) {

							this.buoyRectList[index] = nodeBuoy
							// 遍历画图的 暂存对象数组
							// this.buoyRectList.forEach((buoyRect, i) => {
							// 	// 当位置 不为空时说明 有以前的对象
							// 	// if (this.buoyRectList[index] != null) {
							// 	// 	if (nodeBuoy.nodeId === buoyRect.nodeId && index === i) {
							// 	// 		this.buoyRectList[index] = nodeBuoy
							// 	// 	}

							// 	// }
							// 	// //为空时说明应该加入新的对象
							// 	// else {
							// 	// 	console.log('推送，inde',index)
							// 	// 	// this.buoyRectList.push(nodeBuoy)
							// 	// 	this.buoyRectList[index] = nodeBuoy
							// 	// }
							// })
						}
					})
					
					this.buoyRef = this.buoyCanvas.requestAnimationFrame(() => this.buoyDraw())
					
				})
			},
			// 初始化浮标 对象 List
			initializationBuoyList() {
				console.log(this.ecmArtworkNodeBuoyList)
				this.ecmArtworkNodeBuoyList.forEach((nodeBuoyList, index) => {
					let aList = []
					nodeBuoyList.forEach((v, i) => {
						if (v.buoyType != 2) {
							if (this.playMode ==1) {
								let rectOpacity = (v.buoyOpacity - 0) /100
										
								let rectX = parseInt(( (1 - (v.buoyCoordinateY - 0)  - (v.buoyHigh - 0))* this.canvasWidth).toFixed(0))
								// console.log('矩形框的x轴坐标: ',rectX)
								let rectY = parseInt(((v.buoyCoordinateX  - 0) * this.canvasHeight).toFixed(0))

								//矩形框高度
								let rectW = parseInt(((v.buoyWide - 0) * this.canvasHeight).toFixed(0)) 
								console.log('矩形框的高: ',rectH)
								//矩形框宽度
								let  rectH=  parseInt(((v.buoyHigh - 0) * this.canvasWidth).toFixed(0))
										
								let buoySectionTime =  parseInt(v.buoySectionTime - 0)
								// 目标时间
								let targetTime = parseInt(nodeBuoyList[i + 1].buoySectionTime - 0) 
										
								let vTime = targetTime- buoySectionTime
								
								// 目标位置 X
								let targetX = parseInt(( (1 - (nodeBuoyList[i + 1].buoyCoordinateY - 0)  - (nodeBuoyList[i + 1].buoyHigh - 0))* this.canvasWidth).toFixed(0))
								// 目标位置 Y
								let targetY = parseInt(((nodeBuoyList[i + 1].buoyCoordinateX  - 0) * this.canvasHeight).toFixed(0))
								
						
								
								let vx = ( targetX - rectX) / ((
									vTime) * 60)
								let vy = (targetY - rectY) / ((
									vTime) * 60)
								let buoy = this.initializationBuoy(rectX, rectY, rectW, rectH, vx, vy, rectOpacity, v.fkNodeId, buoySectionTime,
									v.buoyType,targetX,targetY,targetTime)
								if (buoySectionTime === 0) {
									this.buoyRectList.push(buoy)
									// this.clearAnimation()
									this.buoyRef = this.buoyCanvas.requestAnimationFrame(() => this.buoyDraw())
								}
								aList.push(buoy)
							}else {
								let rectOpacity = (v.buoyOpacity - 0) /100
										
								let rectX = parseInt(((v.buoyCoordinateX - 0) * this.canvasWidth).toFixed(0))
								// console.log('矩形框的x轴坐标: ',rectX)
								let rectY = parseInt(((v.buoyCoordinateY - 0) * this.canvasHeight).toFixed(0))
								// console.log('矩形框的y轴坐标: ',rectY)
								//矩形框高度
								let rectH = parseInt(((v.buoyHigh - 0) * this.canvasHeight).toFixed(0))
								// console.log('矩形框的高: ',rectH)
								//矩形框宽度
								let rectW = parseInt(((v.buoyWide - 0) * this.canvasWidth).toFixed(0))
										
								let buoySectionTime =  parseInt(v.buoySectionTime - 0)
									
								// 目标时间
								let targetTime = parseInt(nodeBuoyList[i + 1].buoySectionTime - 0) 
								
								// 目标位置 X
								let targetX = parseInt(((nodeBuoyList[i + 1].buoyCoordinateX - 0) * this.canvasWidth).toFixed(0))
								// 目标位置 Y
								let targetY = parseInt(((nodeBuoyList[i + 1].buoyCoordinateY - 0) * this.canvasHeight).toFixed(0))
									
								let vTime = targetTime  - buoySectionTime
								let vx = (targetX - rectX) / ((
									vTime) * 60)
								let vy = ( targetY - rectY) / ((
									vTime) * 60)
								let buoy = this.initializationBuoy(rectX, rectY, rectW, rectH, vx, vy, rectOpacity, v.fkNodeId, buoySectionTime,
									v.buoyType,targetX,targetY,targetTime)
								if (buoySectionTime === 0) {
									this.buoyRectList.push(buoy)
									// this.clearAnimation()
									this.buoyRef = this.buoyCanvas.requestAnimationFrame(() => this.buoyDraw())
								}
								aList.push(buoy)
							}
						
						} else {
							let buoy = this.initializationBuoy(0, 0, 0, 0, 0, 0, 0, v.fkNodeId,  parseInt(v.buoySectionTime - 0) , v.buoyType,0,0,0)
							aList.push(buoy)
						}
			
					})
					this.canvasNodeBuoyList.push(aList)
					console.log(this.canvasNodeBuoyList)


				})
			},
			// 视频加载完成
			loadedmetadata(e) {

				uni.setStorageSync('videoSize',{
					videoHeight: e.detail.height,
					videoWidth: e.detail.width
				})
				
				//加载完视频加载视频的尺寸
				if(this.playMode === 1){
					this.playMode = 1
					console.log("我竟来了")
					this.transform = 'translate(-50%, -50%) rotateZ(90deg)'
					this.validateHorizontalWindowSize()
				}else{
					this.validateVerticalWindowSize()
				}

				this.showBuoyCanvasFlag = true
				this.initVerticalCanvas()
				
				
			},
			// 深拷贝 方法
			deepCopy(o) {
				return JSON.parse(JSON.stringify(o))
			},
			// canvas 触摸事件
			canvasBuoyTouchstart(e) {
				// 获取当前的xy
				let newX = e.changedTouches[0].x
				// 获取 当前y
				let newY = e.changedTouches[0].y
				// 获取当前 移动对象的 数组
				let nowBuoyRectList = this.deepCopy(this.buoyRectList)
				// console.log('nowBuoyRectList',nowBuoyRectList)
				// console.log('newY',newY)
				// console.log('newX',newX)
				nowBuoyRectList.forEach((v, i) => {
					if (v.x <= newX && (v.x + v.rectW) >= newX) {
						// 加10 增加判定区域
						if (v.y <= newY && (v.y + v.rectH + 10) >= newY) {
							console.log('y进了')
							console.log(111111)
							console.log(v.nodeId)
						}
					}
				})

			},
			
			// 速度校准方法
			buoySpeedCalibration(){
				// 时间  当前位置  距离  =》  新的 速度
				this.clearAnimation()
				// this.currentTime 
				this.buoyRectList.forEach( (buoyRect,index) => {
					if ((buoyRect.targetTime - this.currentTime ) > 0) {
						buoyRect.vx =( buoyRect.targetX - buoyRect.x)/( (buoyRect.targetTime - this.currentTime )  * 58)
						buoyRect.vy = (buoyRect.targetY - buoyRect.y)/ ( (buoyRect.targetTime  - this.currentTime )  * 58)
					}
				})
				if  ( this.buoyCanvas != null) {
					this.buoyRef = this.buoyCanvas.requestAnimationFrame(() => this.buoyDraw())
				}
			
			},
			//视频进入 缓冲
			waitingVideo() {
				if (this.bouyNodeFlage) {
					this.waitingVideoFlag = true
					this.stopBuoyDraw()
				}
			},
			//清除动画
			clearAnimation(){
				if(this.buoyCanvas != null) {
					this.buoyCanvas.cancelAnimationFrame(this.buoyRef)
					this.buoyCanvas.cancelAnimationFrame(this.buoyRef -1 )
					this.buoyCanvas.cancelAnimationFrame(this.buoyRef -2)
					this.buoyCanvas.cancelAnimationFrame(this.buoyRef +1)
					if (this.buoyRef !=null ){
						this.buoyCanvas.cancelAnimationFrame(this.buoyRef)
					}
				}
			},
			// 浮标 视频暂停方法
			stopBuoyDraw(){
				//视频暂停
				this.videoContext.pause()
				// 关闭canvas
				this.showBuoyCanvasFlag = false
				// this.stopBuoyRectList = this.deepCopy(this.buoyRectList )
				// this.showBuoyCanvasFlag = false
				//清空动画
				this.clearAnimation()
			
				//清空 移动对象
				// this.buoyRectList = []
			
				// 关闭canvas
				this.showBuoyCanvasFlag = false
			
			
			},

		
			//异步请求获取作品树 by ArtworkId
			async getArtworkTreeByArtworkId(){
				// this.artworkId = 10210;
				console.log( this.artworkId)
				let t = uni.getStorageSync("token")
				await uni.request({
					url: baseURL  + "/wxPlay/playArtWorkByChildTree",
					method: 'POST',
					dataType: 'json',
					data: {
						pkArtworkId: this.artworkId,
						pkDetailId: this.pkDetailId,
						userId: uni.getStorageSync("userId"),
						token: uni.getStorageSync("token")
					},
					success: res=> {
						if(res.data.status === 200){
							this.showBuoyCanvasFlag = true
							console.log(res)
							this.ecmArtworkNodeBuoyList = res.data.data.ecmArtworkNodeBuoyVOList
							const uuid = Math.random().toString(36).substring(2)
							this.videoUrl = res.data.data.videoUrl+'?uuid='+uuid
							this.playMode =  res.data.data.playMode
							
							// this.initVerticalCanvas()
							// uni.setStorageSync("mainArtworkTree",res.data.data);
							// //传到播放页面带pkDetailId参数 说明故事线跳转，只需要存一棵主树跳转节点不用去播放视频
							
						}else{
							// this.videoShowFlag = false
							this.previewShow = true
							return
						}
					}
				})
			},
			videoEnd() {
				
				// 关闭 canvas
				this.showBuoyCanvasFlag = false
				//清空节点 浮标 标记
				this.bouyNodeFlage = false
				//清空 所有数据
				this.buoyRectList = []
				this.canvasNodeBuoyList = []
				this.ecmArtworkNodeBuoyList = []
				//清空 浮标canvas
				this.buoyCtx = null
				// this.buoyCanvas.width = 0
				// this.buoyCanvas.height = 0
				this.buoyCanvas = null
				
				this.clearNodeBuoyInfo
				
				this.videoUrl = null
				this.initPageInfo()
			},


			// 校正视频播放的黑边 单位px
			validateVerticalWindowSize(){
				let videoInfo = uni.getStorageSync('videoSize')
				let windowSize = uni.getStorageSync('windowSize')
				let videoHeight = videoInfo.videoHeight+0
				let videoWidth = videoInfo.videoWidth+0
				let videoRate = videoWidth/videoHeight
				//dh dw canvas宽高  ch cw是窗口宽高
				let vh, vw, dh, dw, ch, cw
				let flag = !1
				ch = windowSize.windowHeight+0
				cw = windowSize.windowWidth+0
				if(!flag ) {
					dh = ch
					dw = dh * (9 / 16)
					vh = dh
					vw = vh * videoRate
					if (cw >= dw && dw >= vw) {
						this.canvasHeight = dh.toFixed(0)
						// console.log("dh: " + dh.toFixed(0))
						this.canvasWidth = dw.toFixed(0)
						this.videoHeight = vh.toFixed(0)
						this.videoWidth = vw.toFixed(0)
						flag = !0
					}
				}

				if(!flag ) {
					 dw = cw
					 dh = dw * (16 / 9)
					 vw = dw
					 vh = vw / videoRate
					if (dh >= ch && ch >= vh ) {
						this.canvasHeight = dh.toFixed(0)
						this.canvasWidth = dw.toFixed(0)
						this.videoHeight = vh.toFixed(0)
						this.videoWidth = vw.toFixed(0)
						flag = !0
					}
				}
				
				if(!flag ) {
					 dw = cw
					 dh = dw * (16 / 9)
					 vw = dw
					 vh = vw / videoRate
					if (ch >= dh && dh >= vh ) {
						this.canvasHeight = dh.toFixed(0)
						this.canvasWidth = dw.toFixed(0)
						this.videoHeight = vh.toFixed(0)
						this.videoWidth = vw.toFixed(0)
						flag = !0
					}	
				}
				
				if(!flag ) {
					 vh = ch
					 vw = vh * videoRate
					 dw = vw
					 dh = dw * (16 / 9)
					if (cw >= dw && dh >= vh ) {
						this.canvasHeight = dh.toFixed(0)
						this.canvasWidth = dw.toFixed(0)
						this.videoHeight = vh.toFixed(0)
						this.videoWidth = vw.toFixed(0)
						flag = !0
					}	
				}
				
				if(!flag ) {
					 vw = cw
					 vh = vw / videoRate
					 dh = vh
					 dw = dh * ( 9 / 16)
					if (cw <= dw && ch >= dh ) {
						this.canvasHeight = dh.toFixed(0)
						this.canvasWidth = dw.toFixed(0)
						this.videoHeight = vh.toFixed(0)
						this.videoWidth = vw.toFixed(0)
						flag = !0
					}	
				}
				
				if(!flag ) {
					 vh = ch
					 dh = vh
					 vw = vh * videoRate
					 dw = dh * (9 / 16)
					if (cw <= dw && cw >= vw ) {
						this.canvasHeight = dh.toFixed(0)
						this.canvasWidth = dw.toFixed(0)
						this.videoHeight = vh.toFixed(0)
						this.videoWidth = vw.toFixed(0)
						flag = !0
					}	
				}
			},

			// 用来确定横屏播放时canvas画布的大小和video的大小
			validateHorizontalWindowSize(windowWidth, windowHeight){
				let videoInfo = uni.getStorageSync('videoSize')
				let windowSize = uni.getStorageSync('windowSize')
				let videoHeight = videoInfo.videoHeight+0
				let videoWidth = videoInfo.videoWidth+0
				let videoRate = videoWidth/videoHeight
				//dh dw canvas宽高  ch cw是窗口宽高
				let vh, vw, dh, dw, ch, cw
				let flag = !1
				ch = windowSize.windowHeight+0
				cw = windowSize.windowWidth+0
				
				if(!flag) {
					 dw = cw
					 dh = dw * (16 / 9)
					 vw = cw
					 vh = vw * (16 / 9)
					if (ch >= dh && dh >= vh ) {
						this.canvasHeight = dh.toFixed(0)
						this.canvasWidth = dw.toFixed(0)
						this.videoHeight = vw.toFixed(0)
						this.videoWidth = vh.toFixed(0)
						flag = !0
					}
				}
				
				if(!flag) {
					 dh = ch
					 dw = dh / (16 / 9)
					 vh = ch
					 vw = vh / (16 / 9)
					if (cw >= dw && dw >= vw ) {
						this.canvasHeight = dh.toFixed(0)
						this.canvasWidth = dw.toFixed(0)
						this.videoHeight = vw.toFixed(0)
						this.videoWidth = vh.toFixed(0)
						flag = !0
					}
				}
				console.log('this.videoHeight ',this.videoHeight ,"videoWidth",this.videoWidth )
			},







		}
	}
</script>

<style lang="scss">
	.playBox{
		width: 100%;
		height: 100%;
		.verticalOptionPercentagesBox{
			position: fixed;
			right: 5%;
			top: 12%;
			height: 600rpx;
			width: 290rpx;
			z-index: 15;
			// background-color: rgba(255,255,255,.5);
			.optionPercentages{
				height: 50rpx;
				width: 100%;
				.optionPercentageBox{
					margin-top: 10rpx;
					padding: 10rpx 20rpx;
					height: 50rpx;
					border-radius: 20rpx;
					background-color: rgba(0,0,0,.3);
					text-align: left;
					.optionPercentage{
						color: white;
						font-size: 30rpx;
						line-height: 30rpx;
					}
				}
			}
		}
		.horizontalOptionPercentagesBox{
			position: fixed;
			left: 40%;
			top: 81%;
			height: 600rpx;
			width: 290rpx;
			transform: translate(-50%, -50%) rotateZ(90deg);
			z-index: 15;
			// background-color: rgba(255,255,255,.5);
			.optionPercentages{
				height: 50rpx;
				width: 100%;
				.optionPercentageBox{
					margin-top: 10rpx;
					padding: 10rpx 20rpx;
					height: 50rpx;
					border-radius: 20rpx;
					background-color: rgba(0,0,0,.3);
					text-align: left;
					.optionPercentage{
						color: white;
						font-size: 30rpx;
						line-height: 30rpx;
					}
				}
			}
		}
		.multipleResultPlayEndMask{
			position: fixed;
			left: 50%;
			top: 50%;
			background-color: black;
			z-index: 8;
		}
		.verticalPopupNameBox{
			position: fixed;
			left: 5%;
			top: 7%;
			width: 460rpx;
			height: 60rpx;
			background-color: rgba(0,0,0,0.3);
			border-radius: 30rpx;
			text-align: left;
			text{
				padding: 20rpx;
				font-size: 30rpx;
				color: white;
				line-height: 60rpx;
			}
		}
		.horizontalPopupNameBox{
			position: fixed;
			left: 84%;
			top: 21%;
			width: 460rpx;
			height: 60rpx;
			transform: translate(-50%, -50%) rotateZ(90deg);
			background-color: rgba(0,0,0,0.3);
			border-radius: 30rpx;
			text-align: left;
			text{
				padding: 20rpx;
				font-size: 30rpx;
				color: white;
				line-height: 60rpx;
			}
		}
		.progress-line-box{
			position: fixed;
			left: 2%;
			top: 50%;
			height: 50rpx;
			z-index: 10;
			transform: translate(-50%, -50%) rotateZ(90deg);
			progress{
				position: absolute;
				top: 48%;
				left: 4%;
				width: 80%;
			}
			.progress-time{
				position: absolute;
				left: 85%;
				color: white;
				line-height: 50rpx;
			}
		}
		.progress-box{
			position: fixed;
			left: 6%;
			top: 50%;
			z-index: 10;
			height: 50rpx;
			width: 450rpx;
			display: flex;
			justify-content: center;
			border-radius: 20rpx;
			background-color:  rgba(0, 0, 0, .5);
			transform: translate(-50%, -50%) rotateZ(90deg);
			.replayVideoIconBox{
				width: 50rpx;
				height: 50rpx;
				icon{
					width: 100%;
					height: 100%;
					background: url(../../static/icon/jumpback.png) no-repeat center;
					background-size: 50rpx;
				}
			}
			.jumpbackIconBox{
				width: 50rpx;
				height: 50rpx;
				margin-left: 30rpx;
				icon{
					width: 100%;
					height: 100%;
					background: url(../../static/icon/jumpback15.png) no-repeat center;
					background-size: 50rpx;
				}
			}
			.suspendIconBox{
				width: 50rpx;
				height: 50rpx;
				margin-left: 30rpx;
				icon{
					width: 100%;
					height: 100%;
					background: url(../../static/icon/suspend.png) no-repeat center;
					background-size: 50rpx;
				}
			}
			.playIconBox{
				width: 50rpx;
				height: 50rpx;
				margin-left: 30rpx;
				icon{
					width: 100%;
					height: 100%;
					background: url(../../static/icon/play.png) no-repeat center;
					background-size: 50rpx;
				}
			}
			.jumpforwardIconBox{
				width: 50rpx;
				height: 50rpx;
				margin-left: 30rpx;
				icon{
					width: 100%;
					height: 100%;
					background: url(../../static/icon/jumpforward15.png) no-repeat center;
					background-size: 50rpx;
				}
			}
			.endVideoIconBox{
				width: 50rpx;
				height: 50rpx;
				margin-left: 30rpx;
				icon{
					display: block;
					transform: rotateZ(180deg);
					width: 100%;
					height: 100%;
					background: url(../../static/icon/jumpback.png) no-repeat center;
					background-size: 50rpx;
				}
			}
			.f-text{
				color: white;
				line-height: 50rpx;
			}
			.t-text{
				color: white;
				line-height: 50rpx;
			}
		}
		.videoLoadImageBox{
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.play{
			background-color: black;
			position: relative;
			overflow: hidden;
			.container{
				position: fixed;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
				margin: 0 auto;
				z-index: 25;
				canvas{
					width: 100%;
					height: 100%;
				}
			}
			.videoBox{
				position: absolute;
				left: 50%;
				top: 50%;
				// transform: translate(-50%, -50%);修改为了行内样式
				overflow: hidden;
				video{
					position: fixed;
					left: 0;
					top: 0;
					bottom: 0;
					z-index: 7;
					width: 100%;
					height: 100%;
				}
				.screenshot{
					position: absolute;
					left: 0;
					top: 0;
					z-index: 9;
					width: 100%;
					height: 100%;
				}
			}
			.chooseTipsMask15{
				background-color: rgba(0, 0, 0, .1);
				position: fixed;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				z-index: 17;
				.chooseTipsMask16{
					background-color: rgba(255,255,255, 0);
					position: fixed;
					left: 50%;
					top: 50%;
					// transform: translate(-50%, -50%);
					width: 650rpx;
					height: 38%;
					z-index: 18;
					border-radius: 20rpx;
					.chooseTips{
						width: 100%;
						z-index: 25;
						// background-color: rgba(0,0,0,1);
						position: absolute;
						top: 50%;
						transform: translateY(-50%);
						.closeBox{
							position: absolute;
							width: 46rpx;
							height: 46rpx;
							right: 20rpx;
							top: 20rpx;
							.closeIcon{
								width: 100%;
								height: 100%;
								background: url(../../static/icon/close.png) no-repeat center;
								background-size: 46rpx;
							}
						}
						.title{
							text-align: center;
							color: white;
							font-size: 36rpx;
							line-height: 100rpx;
						}
						.tips{
							position: relative;
							.optionBox{
								background: url('https://sike-1259692143.cos.ap-chongqing.myqcloud.com/baseImg/1606382670960frame.png') no-repeat center;
								background-size: 100% 100%;
								width: 100%;
								margin: 0 auto;
								margin-bottom: 20rpx;
								line-height: 80rpx;
								display: flex;
								justify-content: space-between;
								.option{
									color: white;
									padding-left: 20rpx;
									font-size: 34rpx;
									.iconBox{
										position: absolute;
										right: 0;
										top: -18rpx;
										// background-color: #7E4DAB;
										background-color: rgba(#ffffff,0.6);
										height: 50rpx;
										width: 180rpx;
										border-radius: 25rpx;
										display: flex;
										justify-content: flex-start;
										icon{
											display: inline-block;
											margin-left: 12rpx;
											line-height: 50rpx;
											background: url(../../static/icon/advertisement.png) no-repeat center;
											width: 50rpx;
											height: 50rpx;
											background-size: 50rpx;
										}
										text{
											margin-left: 8rpx;
											line-height: 50rpx;
											color: #707070;
											font-size: 24rpx;
										}
									}
								}
							}
						}
						.video_rebroadcast {
							width: 80rpx;
							height: 80rpx;
							padding: 10rpx;
							background-color: rgba(#000, .2);
							border-radius: 40rpx;
							margin: 0 auto;
	
							img {
								width: 100%;
								height: 100%;
								// transform: rotateY(180deg);
							}
						}
					}
				}
			}
			.verticalLikabilityBox{
				.likabilityTips{
					position: fixed;
					left: 5%;
					top: 12%;
					height: 600rpx;
					width: 420rpx;
					z-index: 15;
					// background-color: rgba(255,255,255,.5);
					.lbtips{
						height: 50rpx;
						width: 100%;
						.likabilityBox{
							margin-top: 10rpx;
							padding: 10rpx 20rpx;
							height: 50rpx;
							border-radius: 20rpx;
							background-color: rgba(0,0,0,.3);
							text-align: left;
							.likability{
								color: white;
								font-size: 30rpx;
								line-height: 30rpx;
							}
						}
					}
				}
			}
			.horizontalLikabilityBox{
				.likabilityTips{
					position: fixed;
					left: 40%;
					top: 19%;
					height: 600rpx;
					width: 420rpx;
					transform: translate(-50%, -50%) rotateZ(90deg);
					z-index: 15;
					// background-color: rgba(255,255,255,.5);
					.lbtips{
						height: 50rpx;
						width: 100%;
						.likabilityBox{
							margin-top: 10rpx;
							padding: 10rpx 20rpx;
							height: 50rpx;
							border-radius: 20rpx;
							background-color: rgba(0,0,0,.3);
							text-align: left;
							.likability{
								color: white;
								font-size: 30rpx;
								line-height: 30rpx;
							}
						}
					}
				}
			}
			.lightBox{
				position: fixed;
				left: 6%;
				top: 4%;
				height: 40rpx;
				width: 160rpx;
				z-index: 15;
				background-color: rgba(255,255,255,.5);
				border-radius: 20rpx;
				display: flex;
				justify-content: flex-start;
				.lightIconBox{
					width: 40rpx;
					height: 40rpx;
					margin-left: 10rpx;
					.lightIcon{
						width: 100%;
						height: 100%;
						background: url(../../static/icon/hourglass.png) no-repeat center;
						background-size: 40rpx;
					}
				}
				.lightText{
					font-size: 24rpx;
					color: white;
					line-height: 40rpx;
					margin-left: 10rpx;
				}
				.addLightIconBox{
					width: 40rpx;
					height: 40rpx;
					margin-left: 26rpx;
					.addLightIcon{
						width: 100%;
						height: 100%;
						background: url(../../static/icon/addofplay.png) no-repeat center;
						background-size: 40rpx;
					}
				}
			}
			.verticalBox{
				.storyLineBox{
					position: fixed;
					right: 6%;
					top: 37%;
					height: 80rpx;
					width: 100rpx;
					z-index: 15;
					background-color: rgba(0,0,0,.3);
					border-radius: 20rpx;
					.storyLineIconBox{
						width: 100rpx;
						height: 50rpx;
						text-align: center;
						.storyLineIcon{
							width: 50rpx;
							height: 50rpx;
							background: url(../../static/icon/fenzhi.png) no-repeat center;
							background-size: 50rpx;
						}
					}
					.storyLine{
						text-align: center;
						color: white;
						font-size: 20rpx;
						line-height: 30rpx;
					}
				}
				.reportBox{
					position: fixed;
					right: 6%;
					top: 45%;
					height: 80rpx;
					width: 100rpx;
					z-index: 15;
					background-color: rgba(0,0,0,.3);
					border-radius: 20rpx;
					.reportIconBox{
						width: 100rpx;
						height: 50rpx;
						text-align: center;
						.reportIcon{
							width: 50rpx;
							height: 50rpx;
							background: url(../../static/icon/report.png) no-repeat center;
							background-size: 50rpx;
						}
					}
					.report{
						text-align: center;
						color: white;
						font-size: 20rpx;
						line-height: 30rpx;
					}
				}
				.seeMoreBox{
					position: fixed;
					right: 6%;
					top: 53%;
					height: 80rpx;
					width: 100rpx;
					z-index: 15;
					background-color: rgba(0,0,0,.3);
					border-radius: 20rpx;
					.seeMoreIconBox{
						width: 100rpx;
						height: 50rpx;
						text-align: center;
						.seeMoreIcon{
							width: 50rpx;
							height: 50rpx;
							background: url(../../static/icon/seeMore.png) no-repeat center;
							background-size: 50rpx;
						}
					}
					.seeMore{
						text-align: center;
						color: white;
						font-size: 20rpx;
						line-height: 30rpx;
					}
				}
				.returnToPreviousBox{
					position: fixed;
					right: 6%;
					top: 61%;
					height: 80rpx;
					width: 100rpx;
					z-index: 15;
					background-color: rgba(0,0,0,.3);
					border-radius: 20rpx;
					.returnToPreviousIconBox{
						width: 100rpx;
						height: 50rpx;
						text-align: center;
						.returnToPreviousIcon{
							width: 50rpx;
							height: 50rpx;
							background: url(../../static/icon/returnToPrevious.png) no-repeat center;
							background-size: 50rpx;
						}
					}
					.returnToPrevious{
						text-align: center;
						color: white;
						font-size: 20rpx;
						line-height: 30rpx;
					}
				}
			}
			.horizontalBox{
				.storyLineBox{
					position: fixed;
					right: 0;
					top: 60%;
					height: 80rpx;
					width: 100rpx;
					transform: translate(-50%, -50%) rotateZ(90deg);
					z-index: 15;
					background-color: rgba(0,0,0,.3);
					border-radius: 20rpx;
					.storyLineIconBox{
						width: 100rpx;
						height: 50rpx;
						text-align: center;
						.storyLineIcon{
							width: 50rpx;
							height: 50rpx;
							background: url(../../static/icon/fenzhi.png) no-repeat center;
							background-size: 50rpx;
						}
					}
					.storyLine{
						text-align: center;
						color: white;
						font-size: 20rpx;
						line-height: 30rpx;
					}
				}
				.reportBox{
					position: fixed;
					right: 0;
					top: 70%;
					transform: translate(-50%, -50%) rotateZ(90deg);
					height: 80rpx;
					width: 100rpx;
					z-index: 15;
					background-color: rgba(0,0,0,.3);
					border-radius: 20rpx;
					.reportIconBox{
						width: 100rpx;
						height: 50rpx;
						text-align: center;
						.reportIcon{
							width: 50rpx;
							height: 50rpx;
							background: url(../../static/icon/report.png) no-repeat center;
							background-size: 50rpx;
						}
					}
					.report{
						text-align: center;
						color: white;
						font-size: 20rpx;
						line-height: 30rpx;
					}
				}
				.seeMoreBox{
					position: fixed;
					right: 0;
					top: 80%;
					transform: translate(-50%, -50%) rotateZ(90deg);
					height: 80rpx;
					width: 100rpx;
					z-index: 15;
					background-color: rgba(0,0,0,.3);
					border-radius: 20rpx;
					.seeMoreIconBox{
						width: 100rpx;
						height: 50rpx;
						text-align: center;
						.seeMoreIcon{
							width: 50rpx;
							height: 50rpx;
							background: url(../../static/icon/seeMore.png) no-repeat center;
							background-size: 50rpx;
						}
					}
					.seeMore{
						text-align: center;
						color: white;
						font-size: 20rpx;
						line-height: 30rpx;
					}
				}
				.returnToPreviousBox{
					position: fixed;
					right: 0;
					top: 90%;
					transform: translate(-50%, -50%) rotateZ(90deg);
					height: 80rpx;
					width: 100rpx;
					z-index: 15;
					background-color: rgba(0,0,0,.3);
					border-radius: 20rpx;
					.returnToPreviousIconBox{
						width: 100rpx;
						height: 50rpx;
						text-align: center;
						.returnToPreviousIcon{
							width: 50rpx;
							height: 50rpx;
							background: url(../../static/icon/returnToPrevious.png) no-repeat center;
							background-size: 50rpx;
						}
					}
					.returnToPrevious{
						text-align: center;
						color: white;
						font-size: 20rpx;
						line-height: 30rpx;
					}
				}
			}
			.storyLineContentMask16{
				position: fixed;
				z-index: 16;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				background-color: rgba(255,255,255,.9);
				.storyLineContentBox{
					width: 100%;
					height: 100%;
					z-index: 17;
					background-color: rgba(0,0,0,.3);
					.title{
						text-align: center;
						font-size: 36rpx;
						color: white;
						line-height: 100rpx;
					}
					.splitLine{
						border: 2rpx solid #D3D3D3;
						width: 80%;
						margin: 0 auto;
					}
					.closeBox{
						position: absolute;
						width: 46rpx;
						height: 46rpx;
						right: 20rpx;
						top: 20rpx;
						.closeIcon{
							width: 100%;
							height: 100%;
							background: url(../../static/icon/close.png) no-repeat center;
							background-size: 46rpx;
						}
					}
				}
			}
			.reportContentMask16{
				position: fixed;
				z-index: 16;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				background-color: rgba(255,255,255,.9);
				.reportContentBox{
					width: 100%;
					height: 100%;
					z-index: 17;
					background-color: rgba(0,0,0,.3);
					.title{
						text-align: center;
						font-size: 36rpx;
						color: white;
						line-height: 100rpx;
					}
					.splitLine{
						border: 2rpx solid #D3D3D3;
						width: 100%;
						margin: 0 auto;
					}
					.subTitle{
						color: white;
						margin: 10rpx 0 0 10rpx;
						font-size: 30rpx;
					}
					.closeBox{
						position: absolute;
						width: 46rpx;
						height: 46rpx;
						right: 20rpx;
						top: 20rpx;
						.closeIcon{
							width: 100%;
							height: 100%;
							background: url(../../static/icon/close.png) no-repeat center;
							background-size: 46rpx;
						}
					}
					.reportContent{
						.uni-list{
							.checkBox{
								margin: 30rpx 0 0 30rpx;
								display: flex;
								justify-content: flex-start;
								.nameBox{
									height: 48rpx;
									.name{
										line-height: 48rpx;
										color: white;
									}
								}
							}
						}
						.uni-textarea{
							margin: 30rpx 0 0 30rpx;
							textarea{
								background: white;
							}
						}
						.uploadBox{
							margin: 30rpx 0 0 0;
							.subTitle{
								color: white;
								font-size: 30rpx;
							}
							.uploadBtnBox{
								margin: 30rpx 0 0 30rpx;
								border: 2rpx solid white;
								width: 200rpx;
								height: 300rpx;
								icon {
									width: 100%;
									height: 100%;
									background: url(../../static/icon/add.png) no-repeat center;
									background-size: 200rpx 200rpx;
								};
							}
							.uploadImageBox{
								margin: 30rpx 0 0 30rpx;
								border: 2rpx solid red;
								width: 200rpx;
								height: 300rpx;
								border: 2rpx solid white;
								image {
									width: 100%;
									height: 100%;
								};
							}
						}
						.submitBtnBox{
							margin: 0 auto;
							margin-top: 20rpx;
							font-size: 30rpx;
							width: 150rpx;
							height: 60rpx;
							color: white;
							border: 2rpx solid white;
							.btnText{
								line-height: 60rpx;
								text-align: center;
							}
						}
					}
				}
			}
		}
	}
	page{
		width: 100%;
		height: 100%;
	}
</style>
