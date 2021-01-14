<template>
	<view>
		<view class="playBox" >
			<view class="play" >
				<!-- 定位选项画布 -->
				<view class="container" v-show="showCanvasFlag" :style="{'width': videoWide+'px', 'height': videoHigh+'px'}">
					<canvas type="2d" id='posterCanvas' :style="{'width': videoWide+'px', 'height': videoHigh+'px'}" ></canvas>
				</view>
				<!-- 播放主体   @click="showButton" @timeupdate="videoTimeupdate" -->
				<view class="videoBox">
					<video :src="videoUrl" :loop="true" @timeupdate="getNewVideoPlayTime"
					 :autoplay="true"  :style="{'width': videoWide+'px', 'height': videoHigh+'px'}"></video>
					<!-- 视频播放结束触发事件显示最后一帧截图 -->
	<!-- 				<view v-if="screenshotShowFlag" class="screenshot" :style="{backgroundImage: 'url(' + imageSrc + ')',
						'background-repeat':'no-repeat', backgroundSize:'100% 100%'}"></view> -->
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {

		data() {
			return {
				//是否自动播放标志
				autopalyFlag: true,
				//是否开启手势标志
				playGestureFlag: true,
				//是否开启进度控制手势开关
				progressGestureFlag: true,
				showCanvasFlag:false,
				videoHigh: 603,
				videoWide: 375,
				videoUrl: '',
				ecmArtworkNodeBuoy: {
					buoyWide: 0.3,
					buoyHigh:0.1,
					buoyOpacity:0.4,
					buoySectionTime:0,
					buoyCoordinateX: 0.46,
					buoyCoordinateY:0.42,
					buoyType: 0
				},
				ecmArtworkNodeBuoyList:[
					
					{
						buoyWide: 0.3,
						buoyHigh:0.1,
						buoyOpacity:0.4,
						buoySectionTime:1,
						buoyCoordinateX: 0.40,
						buoyCoordinateY:0.30,
						buoyType: 0
					}
					// ,
					// {
					// 	buoyWide: 0.3,
					// 	buoyHigh:0.1,
					// 	buoyOpacity:0.4,
					// 	buoySectionTime:2,
					// 	buoyCoordinateX: 0.50,
					// 	buoyCoordinateY:0.50,
					// 	buoyType: 1
					// },
					// {
					// 	buoyWide: 0.3,
					// 	buoyHigh:0.1,
					// 	buoyOpacity:0.4,
					// 	buoySectionTime:3,
					// 	buoyCoordinateX: 0.60,
					// 	buoyCoordinateY:0.40,
					// 	buoyType: 1 	
					// },
					// {
					// 	buoyWide: 0.3,
					// 	buoyHigh:0.1,
					// 	buoyOpacity:0.4,
					// 	buoySectionTime:4,
					// 	buoyCoordinateX: 0.40,
					// 	buoyCoordinateY:0.50,
					// 	buoyType: 1	
					// },
					// {
					// 	buoyWide: 0.3,
					// 	buoyHigh:0.1,
					// 	buoyOpacity:0.4,
					// 	buoySectionTime:5,
					// 	buoyCoordinateX: 0.40,
					// 	buoyCoordinateY:0.30,
					// 	buoyType: 1
					// }
					
				]

			}
		},

		onReady(option) {
			
		},
		onLoad() {
			this.canvasWidth = this.videoWide
			this.canvasHeight = this.videoHigh
			setTimeout( () => {			
				this.getVideoUrl()
				this.showCanvasFlag = true
				this.initVerticalCanvas() 
			},50)

		},
		methods: {
			getVideoUrl(){
				
				this.videoUrl = 'http://1500001548.vod2.myqcloud.com/438200a2vodtranscq1500001548/75f8d9f45285890810335596738/v.f100020.mp4'
			
			},
			//初始化竖屏canvas画布
			initVerticalCanvas(){
				this.rectArray = []
				// const ctx = wx.getContext('myCanvas')
				// // console.log('画布的宽: ',this.canvasWidth)
				// // console.log('画布的高: ',this.canvasHeight)
				// ctx.clearRect(0 , 0 , this.canvasWidth, this.canvasHeight)
				
				 const query = wx.createSelectorQuery()
				    query.select('#posterCanvas')
				      .fields({ node: true, size: true })
				      .exec( (res) => {
				        const canvas = res[0].node;
						const ctx = canvas.getContext('2d')
						
						//初始化 浮标  demo 只有一个
						this.ecmArtworkNodeBuoyList.forEach( (v,index) => {
							let rectOpacity =v.buoyOpacity + 0
							
							let rectX = parseInt(((v.buoyCoordinateX+0)*this.canvasWidth).toFixed(0)) 
							// console.log('矩形框的x轴坐标: ',rectX)
							let rectY = parseInt(((v.buoyCoordinateY+0)*this.canvasHeight).toFixed(0))
							// console.log('矩形框的y轴坐标: ',rectY)
							//矩形框高度
							let rectH = parseInt(((v.buoyHigh+0)*this.canvasHeight).toFixed(0))
							// console.log('矩形框的高: ',rectH)
							//矩形框宽度
							let rectW = parseInt(((v.buoyWide+0)*this.canvasWidth).toFixed(0))
							// console.log('矩形框的宽: ',rectW)
							//画矩形
							console.log(ctx, rectX, rectY, rectW, rectH)
							this.drawTransparentRect(ctx, rectX, rectY, rectW, rectH, rectOpacity,index)
							// canvas.requestAnimationFrame(this.run(ctx, rectX, rectY, rectW, rectH, rectOpacity))
							

							// setInterval(() => {
							// 	this.run(ctx, rectX, rectY, rectW, rectH, rectOpacity)
							// 	rectX = rectX - 5;
								
							// }, 16);
							
						})
						console.log(ctx)
				
						})
				// query.requestAnimationFrame(a())
					
				

				
				
			},
			drawTransparentRect(ctx, x, y, width, height, rectOpacity, i){
				// ctx.beginPath()
				//校准，因为获取到的矩形框坐标是矩形框的中轴点的坐标，而绘制矩形传入的是左上角的坐标 故需要校正 横纵坐标减去矩形框宽高的一半
			
				//将坐标收纳成对象保存到数组，为绑定事件做准备
				let rect={
					x: x,
					y: y,
					w: width,
					h: height
				}
				this.rectArray.push(rect)
				console.log(x, y, width, height)
				ctx.rect(x, y, width, height)
				// ctx.rect(10, 10, 150, 75)
				ctx.fillStyle = "red"
				ctx.fill()
				// ctx.draw()
				
				// ctx.fillRect(50, 50, 150, 100)
				// ctx.fill()
				//开始描绘
				// ctx.stroke()
				// ctx.draw()
			},
			run(ctx,rectX, rectY, rectW, rectH, rectOpacity) {
				ctx.rect(0 , 0 , this.canvasWidth, this.canvasHeight)
				this.drawTransparentRect(ctx, rectX, rectY, rectW, rectH, rectOpacity)
				
			},
			getNewVideoPlayTime (e) {
				//获取视频当前时间
				this.currentTime = e.detail.currentTime
				//获取视频当前时间
				if(this.duration -this.currentTime > 0.4){
					this.percent = parseInt(this.currentTime/this.duration*100)
				}else{
					this.percent = 100
				}
			},
			

		}
	}

</script>

<style lang="scss">
	.playBox {
		width: 100%;
		height: 100%;

		.play {
			background-color: black;
			position: relative;
			overflow: hidden;

			.container {
				position: fixed;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
				margin: 0 auto;
				z-index: 25;

				canvas {
					width: 100%;
					height: 100%;
				}
			}

			.videoBox {
				position: absolute;
				left: 50%;
				top: 50%;
				// transform: translate(-50%, -50%);修改为了行内样式
				overflow: hidden;

				video {
					position: fixed;
					left: 0;
					top: 0;
					bottom: 0;
					z-index: 7;
					width: 100%;
					height: 100%;
				}

				.screenshot {
					position: absolute;
					left: 0;
					top: 0;
					z-index: 9;
					width: 100%;
					height: 100%;
				}
			}

			.chooseTipsMask15 {
				background-color: rgba(0, 0, 0, .1);
				position: fixed;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				z-index: 17;

				.chooseTipsMask16 {
					background-color: rgba(255, 255, 255, 0);
					position: fixed;
					left: 50%;
					top: 50%;
					// transform: translate(-50%, -50%);
					width: 650rpx;
					height: 38%;
					z-index: 18;
					border-radius: 20rpx;

					.chooseTips {
						width: 100%;
						z-index: 25;
						// background-color: rgba(0,0,0,1);
						position: absolute;
						top: 50%;
						transform: translateY(-50%);

						.closeBox {
							position: absolute;
							width: 46rpx;
							height: 46rpx;
							right: 20rpx;
							top: 20rpx;

							.closeIcon {
								width: 100%;
								height: 100%;
								background: url(../../static/icon/close.png) no-repeat center;
								background-size: 46rpx;
							}
						}

						.title {
							text-align: center;
							color: white;
							font-size: 36rpx;
							line-height: 100rpx;
						}

						.tips {
							position: relative;

							.optionBox {
								background: url('https://sike-1259692143.cos.ap-chongqing.myqcloud.com/baseImg/1606382670960frame.png') no-repeat center;
								background-size: 100% 100%;
								width: 100%;
								margin: 0 auto;
								margin-bottom: 20rpx;
								line-height: 80rpx;
								display: flex;
								justify-content: space-between;

								.option {
									color: white;
									padding-left: 20rpx;
									font-size: 34rpx;

									.iconBox {
										position: absolute;
										right: 0;
										top: -18rpx;
										// background-color: #7E4DAB;
										background-color: rgba(#ffffff, 0.6);
										height: 50rpx;
										width: 180rpx;
										border-radius: 25rpx;
										display: flex;
										justify-content: flex-start;

										icon {
											display: inline-block;
											margin-left: 12rpx;
											line-height: 50rpx;
											background: url(../../static/icon/advertisement.png) no-repeat center;
											width: 50rpx;
											height: 50rpx;
											background-size: 50rpx;
										}

										text {
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

			.verticalLikabilityBox {
				.likabilityTips {
					position: fixed;
					left: 5%;
					top: 12%;
					height: 600rpx;
					width: 420rpx;
					z-index: 15;

					// background-color: rgba(255,255,255,.5);
					.lbtips {
						height: 50rpx;
						width: 100%;

						.likabilityBox {
							margin-top: 10rpx;
							padding: 10rpx 20rpx;
							height: 50rpx;
							border-radius: 20rpx;
							background-color: rgba(0, 0, 0, .3);
							text-align: left;

							.likability {
								color: white;
								font-size: 30rpx;
								line-height: 30rpx;
							}
						}
					}
				}
			}

			.horizontalLikabilityBox {
				.likabilityTips {
					position: fixed;
					left: 40%;
					top: 19%;
					height: 600rpx;
					width: 420rpx;
					transform: translate(-50%, -50%) rotateZ(90deg);
					z-index: 15;

					// background-color: rgba(255,255,255,.5);
					.lbtips {
						height: 50rpx;
						width: 100%;

						.likabilityBox {
							margin-top: 10rpx;
							padding: 10rpx 20rpx;
							height: 50rpx;
							border-radius: 20rpx;
							background-color: rgba(0, 0, 0, .3);
							text-align: left;

							.likability {
								color: white;
								font-size: 30rpx;
								line-height: 30rpx;
							}
						}
					}
				}
			}

			.lightBox {
				position: fixed;
				left: 6%;
				top: 4%;
				height: 40rpx;
				width: 160rpx;
				z-index: 15;
				background-color: rgba(255, 255, 255, .5);
				border-radius: 20rpx;
				display: flex;
				justify-content: flex-start;

				.lightIconBox {
					width: 40rpx;
					height: 40rpx;
					margin-left: 10rpx;

					.lightIcon {
						width: 100%;
						height: 100%;
						background: url(../../static/icon/hourglass.png) no-repeat center;
						background-size: 40rpx;
					}
				}

				.lightText {
					font-size: 24rpx;
					color: white;
					line-height: 40rpx;
					margin-left: 10rpx;
				}

				.addLightIconBox {
					width: 40rpx;
					height: 40rpx;
					margin-left: 26rpx;

					.addLightIcon {
						width: 100%;
						height: 100%;
						background: url(../../static/icon/addofplay.png) no-repeat center;
						background-size: 40rpx;
					}
				}
			}

			.verticalBox {
				.storyLineBox {
					position: fixed;
					right: 6%;
					top: 37%;
					height: 80rpx;
					width: 100rpx;
					z-index: 15;
					background-color: rgba(0, 0, 0, .3);
					border-radius: 20rpx;

					.storyLineIconBox {
						width: 100rpx;
						height: 50rpx;
						text-align: center;

						.storyLineIcon {
							width: 50rpx;
							height: 50rpx;
							background: url(../../static/icon/fenzhi.png) no-repeat center;
							background-size: 50rpx;
						}
					}

					.storyLine {
						text-align: center;
						color: white;
						font-size: 20rpx;
						line-height: 30rpx;
					}
				}

				.reportBox {
					position: fixed;
					right: 6%;
					top: 45%;
					height: 80rpx;
					width: 100rpx;
					z-index: 15;
					background-color: rgba(0, 0, 0, .3);
					border-radius: 20rpx;

					.reportIconBox {
						width: 100rpx;
						height: 50rpx;
						text-align: center;

						.reportIcon {
							width: 50rpx;
							height: 50rpx;
							background: url(../../static/icon/report.png) no-repeat center;
							background-size: 50rpx;
						}
					}

					.report {
						text-align: center;
						color: white;
						font-size: 20rpx;
						line-height: 30rpx;
					}
				}

				.seeMoreBox {
					position: fixed;
					right: 6%;
					top: 53%;
					height: 80rpx;
					width: 100rpx;
					z-index: 15;
					background-color: rgba(0, 0, 0, .3);
					border-radius: 20rpx;

					.seeMoreIconBox {
						width: 100rpx;
						height: 50rpx;
						text-align: center;

						.seeMoreIcon {
							width: 50rpx;
							height: 50rpx;
							background: url(../../static/icon/seeMore.png) no-repeat center;
							background-size: 50rpx;
						}
					}

					.seeMore {
						text-align: center;
						color: white;
						font-size: 20rpx;
						line-height: 30rpx;
					}
				}
			}

			.horizontalBox {
				.storyLineBox {
					position: fixed;
					right: 0;
					top: 70%;
					height: 80rpx;
					width: 100rpx;
					transform: translate(-50%, -50%) rotateZ(90deg);
					z-index: 15;
					background-color: rgba(0, 0, 0, .3);
					border-radius: 20rpx;

					.storyLineIconBox {
						width: 100rpx;
						height: 50rpx;
						text-align: center;

						.storyLineIcon {
							width: 50rpx;
							height: 50rpx;
							background: url(../../static/icon/fenzhi.png) no-repeat center;
							background-size: 50rpx;
						}
					}

					.storyLine {
						text-align: center;
						color: white;
						font-size: 20rpx;
						line-height: 30rpx;
					}
				}

				.reportBox {
					position: fixed;
					right: 0;
					top: 80%;
					transform: translate(-50%, -50%) rotateZ(90deg);
					height: 80rpx;
					width: 100rpx;
					z-index: 15;
					background-color: rgba(0, 0, 0, .3);
					border-radius: 20rpx;

					.reportIconBox {
						width: 100rpx;
						height: 50rpx;
						text-align: center;

						.reportIcon {
							width: 50rpx;
							height: 50rpx;
							background: url(../../static/icon/report.png) no-repeat center;
							background-size: 50rpx;
						}
					}

					.report {
						text-align: center;
						color: white;
						font-size: 20rpx;
						line-height: 30rpx;
					}
				}

				.seeMoreBox {
					position: fixed;
					right: 0;
					top: 90%;
					transform: translate(-50%, -50%) rotateZ(90deg);
					height: 80rpx;
					width: 100rpx;
					z-index: 15;
					background-color: rgba(0, 0, 0, .3);
					border-radius: 20rpx;

					.seeMoreIconBox {
						width: 100rpx;
						height: 50rpx;
						text-align: center;

						.seeMoreIcon {
							width: 50rpx;
							height: 50rpx;
							background: url(../../static/icon/seeMore.png) no-repeat center;
							background-size: 50rpx;
						}
					}

					.seeMore {
						text-align: center;
						color: white;
						font-size: 20rpx;
						line-height: 30rpx;
					}
				}
			}

			.storyLineContentMask16 {
				position: fixed;
				z-index: 16;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				background-color: rgba(255, 255, 255, .9);

				.storyLineContentBox {
					width: 100%;
					height: 100%;
					z-index: 17;
					background-color: rgba(0, 0, 0, .3);

					.title {
						text-align: center;
						font-size: 36rpx;
						color: white;
						line-height: 100rpx;
					}

					.splitLine {
						border: 2rpx solid #D3D3D3;
						width: 80%;
						margin: 0 auto;
					}

					.closeBox {
						position: absolute;
						width: 46rpx;
						height: 46rpx;
						right: 20rpx;
						top: 20rpx;

						.closeIcon {
							width: 100%;
							height: 100%;
							background: url(../../static/icon/close.png) no-repeat center;
							background-size: 46rpx;
						}
					}
				}
			}

			.reportContentMask16 {
				position: fixed;
				z-index: 16;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				background-color: rgba(255, 255, 255, .9);

				.reportContentBox {
					width: 100%;
					height: 100%;
					z-index: 17;
					background-color: rgba(0, 0, 0, .3);

					.title {
						text-align: center;
						font-size: 36rpx;
						color: white;
						line-height: 100rpx;
					}

					.splitLine {
						border: 2rpx solid #D3D3D3;
						width: 100%;
						margin: 0 auto;
					}

					.subTitle {
						color: white;
						margin: 10rpx 0 0 10rpx;
						font-size: 30rpx;
					}

					.closeBox {
						position: absolute;
						width: 46rpx;
						height: 46rpx;
						right: 20rpx;
						top: 20rpx;

						.closeIcon {
							width: 100%;
							height: 100%;
							background: url(../../static/icon/close.png) no-repeat center;
							background-size: 46rpx;
						}
					}

					.reportContent {
						.uni-list {
							.checkBox {
								margin: 30rpx 0 0 30rpx;
								display: flex;
								justify-content: flex-start;

								.nameBox {
									height: 48rpx;

									.name {
										line-height: 48rpx;
										color: white;
									}
								}
							}
						}

						.uni-textarea {
							margin: 30rpx 0 0 30rpx;

							textarea {
								background: white;
							}
						}

						.uploadBox {
							margin: 30rpx 0 0 0;

							.subTitle {
								color: white;
								font-size: 30rpx;
							}

							.uploadBtnBox {
								margin: 30rpx 0 0 30rpx;
								border: 2rpx solid white;
								width: 200rpx;
								height: 300rpx;

								icon {
									width: 100%;
									height: 100%;
									background: url(../../static/icon/add.png) no-repeat center;
									background-size: 200rpx 200rpx;
								}

								;
							}

							.uploadImageBox {
								margin: 30rpx 0 0 30rpx;
								border: 2rpx solid red;
								width: 200rpx;
								height: 300rpx;
								border: 2rpx solid white;

								image {
									width: 100%;
									height: 100%;
								}

								;
							}
						}

						.submitBtnBox {
							margin: 0 auto;
							margin-top: 20rpx;
							font-size: 30rpx;
							width: 150rpx;
							height: 60rpx;
							color: white;
							border: 2rpx solid white;

							.btnText {
								line-height: 60rpx;
								text-align: center;
							}
						}
					}
				}
			}
		}
	}

	page {
		width: 100%;
		height: 100%;
	}
</style>
