<template>
	<view>
		<button v-if="flag3" id='play' class="btn" style="width: '20px',height: '30px'" @click="playBtnClick" @touchstart="onTouchstart"
		 @mousedown="onDocumentMouseDown">play</button>
		<button v-if="flag3" id='stop' class="btn" style="width: '20px', height: '30px'" @click="stopBtnClick">stop</button>
		<button v-if="flag3" id='play3' class="btn" style="width: '20px', height: '30px'" @click="playVRBtnClick">play3D</button>
		<view class="vr_loading">
			<view class="circle"></view>
			<img v-if="imgFlag" :src="loadinImgUrl">
		</view>
		<view>
			<view v-if="arrowFlag" class="to_top" :style="{top:shoeArrowXY.arrowTop, left:shoeArrowXY.arrowLeft}"> </view>
			
			<view v-if="arrowFlag" class="to_top" :style="{top:cubeArrowXY.arrowTop,  left:cubeArrowXY.arrowLeft}"> </view>
		</view>
		<view class="vr_container"></view>
		<!-- <view style="width: '315px', height: '560px', position: 'absolute', pointerEvents: 'none'"></view> -->
		<view style="width: '6px', height: '6px', background: 'red', borderRadius: '3px', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'"></view>
		<!-- 		<video id="myVideo" style="width: 100px;height: 100px;" autoplay="false" :src="videoUrl"   @timeupdate="videoTimeupdate" ></video> -->
		<video id="myVideo" style="width: 0px;height: 0px;transform: rotate(90deg)" :src="videoUrl" crossorigin="anonymous" :autoplay="true"
		 @timeupdate="videoTimeupdate"></video>

		<view v-if="verticalJumpDialogFlag">
			<vr-vertical-jump-dialog :imageUrl="popImgUrl" :verticalJumpDialogFlag="verticalJumpDialogFlag" @closeDialog="closeDialog"
			 :navigatorUrl="navigatorUrl">
			</vr-vertical-jump-dialog>
		</view>
		<view class="canvasBox" :style="{'width': windowWidth+'px', 'height': windowHeight+'px'}">
			<canvas type="webgl" id="c" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" 
			@touchcancel="touchCancel" @longtap="longTap" @tap="tap"></canvas>
		</view>
	</view>
</template>

<script>
	import * as THREE from "./vr-js/three.weapp.js";
	import DeviceOrientationControls from './vr-js/DeviceOrientationControls';
	import vrVerticalJumpDialog from '../../../components/dialog/vrVerticalJumpDialog.vue'
	import {StereoEffect} from './vr-js/StereoEffect.js'
	
	export default {
		components: {
			vrVerticalJumpDialog
		},
		data() {
			return {
				//
				popImgUrl: 'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/O1CN01THJddH2MpiXK1JhQN_!!2206776679877.jpg/mobilePop',
				// loading url
				loadinImgUrl: '',
				camera: null,
				// three  场景对象
				scene: null,
				// three  渲染器对象
				renderer: null,
				// three  陀螺仪移动js对象
				controls: null,
				// 鼠标事件
				mouse: {},
				// three  光线投影对象
				raycaster: null,
				// three  瑜伽球对象
				cube: null,
				// three  鞋子球对象
				shoe: null,
				box: null,
				// video dom 对象
				htmlVideoElement: null,
				// 计算完成的 移动数据 数组- 本应该是2维数组 ，本次只有一个可以移动
				calculateList: [],
				//当前时间
				buoyNewTime: 0,
				// 是否有 点击事件
				clickFlag: false,
				// 暂停视频
				stopVideoFlag: true,
				//正在移动的  对象
				moveList: [],
				//暂停储存的 移动对象
				stopMoveList: [],
				// 2Sloading 进去的时间 （时间戳）
				oldTime: 0,
				//视频地址
				videoUrl: 'http://1259692143.vod2.myqcloud.com/6fda56ccvodcq1259692143/6479003d5285890815766187729/GMSMgREou44A.mp4',
				//打印用的
				ii: 0,
				//陀螺仪还是鼠标触摸
				flag3: true,
				// 鼠标触摸 计算使用
				isUserInteracting: false,
				// 鼠标触摸 计算使用
				lon: 0,
				// 鼠标触摸 计算使用
				lat: 0,
				// 鼠标触摸 计算使用
				phi: 0,
				// 鼠标触摸 计算使用
				theta: 0,
				// 鼠标触摸 计算使用
				distance: 50,
				// 鼠标触摸 计算使用
				onPointerDownPointerX: 0,
				// 鼠标触摸 计算使用
				onPointerDownPointerY: 0,
				// 鼠标触摸 计算使用
				onPointerDownLon: 0,
				// 鼠标触摸 计算使用
				onPointerDownLat: 0,
				//loading 出现flag
				imgFlag: false,
				// three.js 视频材质
				textureMaterial: null,
				//弹窗flag
				verticalJumpDialogFlag: false,
				//弹窗 一次性触发flag
				diaLogFlag: true,
				//跳转视频后 flag
				openVideoUrlFlag: true,
				//弹窗跳转地址
				navigatorUrl: "https://www.adidas.com.cn/originals",
				shoeArrowXY:{
					arrowTop: '1000px',
					arrowLeft: '1000px'
				},
				cubeArrowXY:{
					arrowTop: '1000px',
					arrowLeft: '1000px',
				},
				faceflag: true,
				arrowFlag: true,
				windowWidth: 0,
				windowHeight: 0,
				canvas: null,
				canvasId: '',
				videoDom: null
			}
		},
		onLoad() {
			const {windowWidth,windowHeight} = uni.getSystemInfoSync()
			this.windowWidth = windowWidth
			this.windowHeight = windowHeight
			uni.createSelectorQuery().select("#c").node().exec((res) => {
				this.canvasId  = res[0].node._canvasId
				this.canvas = THREE.global.registerCanvas(this.canvasId , res[0].node)
				this.start();
				this.animate();
			})
		},
		onUnload() {
			THREE.global.unregisterCanvas(this.canvasId)
		},
		onReady() {
			
		},
		methods: {
			//初始化
			start() {
				//初始化相机
				this.camera = this.cameraInit()
				//初始化陀螺仪
				this.controls = DeviceOrientationControls(this.camera);
				//初始化 视频 返回视频dom
				this.htmlVideoElement = this.videoInit();
				console.log("this.htmlVideoElement: ",this.htmlVideoElement)
				//生产材质
				//此处有问题视频材质未生成成功
				const texture = new THREE.VideoTexture(this.htmlVideoElement);
				texture.minFilter = THREE.LinearFilter
				console.log("controls: ", this.controls)
				//场景
				this.scene = new THREE.Scene();
				this.scene.background = new THREE.Color(0x000000);
				//初始化球体
				this.intSphereGeo()
				let mesh = this.meshInit({
					texture
				});
				this.scene.add(mesh);
				//初始化物体
				this.initBuoyThing()
				//初始化 光线投影
				this.raycaster = new THREE.Raycaster();
				this.raycaster.far = 500
				//初始化 鼠标点击 对象
				this.mouse = new THREE.Vector2();
				//初始化物体移动速度对象
				this.calculateList = this.initShoeV()
				// 渲染器
				this.renderer = this.rendererInit(this.windowWidth, (this.windowHeight))
				//初始化事件
				// this.intDomEvent()

			},
			//初始化事件
			intDomEvent() {
				let elementsByTagName = document.querySelector("canvas");
				//点击事件
				elementsByTagName.addEventListener('click', this.onMouseClick);
				// 触摸事件
				elementsByTagName.addEventListener('touchstart', this.onTouchstart);

				// 鼠标滑动事件
				elementsByTagName.addEventListener('mousedown', this.onDocumentMouseDown, false);
				elementsByTagName.addEventListener('mousemove', this.onDocumentMouseMove, false);
				elementsByTagName.addEventListener('mouseup', this.onDocumentMouseUp, false);

				// 触摸事件
				elementsByTagName.addEventListener('touchstart', this.onDocumentTouchstart, false);
				elementsByTagName.addEventListener('touchmove', this.onDocumentTouchmove, false);
				elementsByTagName.addEventListener('touchend', this.onDocumentTouchend, false);

				window.addEventListener('resize', this.onWindowResize, false);
			},

			deepCopy(o) {
				return JSON.parse(JSON.stringify(o))
			},
			calibrationVector(vector) {
				if (vector.x > 480) {
					vector.x = vector.x - 50
				} else if (vector.x < -480) {
					vector.x = vector.x + 50
				} else if (vector.x > 100 && vector.x < 480) {
					vector.x = vector.x - 30
				} else if (vector.x > -100 && vector.x < -480) {
					vector.x = vector.x + 30
				}
				if (vector.y > 480) {
					vector.y = vector.y - 50
				} else if (vector.y < -480) {
					vector.y = vector.y + 50
				} else if (vector.y > 100 && vector.y < 480) {
					vector.y = vector.y - 30
				} else if (vector.y > -100 && vector.y < -480) {
					vector.y = vector.y + 30
				}
				if (vector.z > 480) {
					vector.z = vector.z - 50
				} else if (vector.z < -480) {
					vector.z = vector.z + 50
				} else if (vector.z > 100 && vector.z < 480) {
					vector.z = vector.z - 30
				} else if (vector.z > -100 && vector.z < -480) {
					vector.z = vector.z + 30
				}

				if (this.ii % 100 == 0) {
					console.log(vector)
				}

				return vector

			},
			updateArrow(thing) {
				thing.rotation.copy(this.camera.rotation);
				thing.updateMatrix();
				thing.translateZ(-10);
				this.initIndicator(thing.position)

			},
			initIndicator(vector) {
				//demo 1 中心点  箭头
				let targetQuaternion = new THREE.Quaternion();
				let rotationMatrix = new THREE.Matrix4();
				// console.log(vector)
				this.cylinder.position = this.calibrationVector(vector)
				// console.log(this.cylinder)
				rotationMatrix.lookAt(this.shoe.position, this.cylinder.position, this.shoe.position);
				targetQuaternion.setFromRotationMatrix(rotationMatrix);

				this.cylinder.quaternion.rotateTowards(targetQuaternion, 20)

			},
			// 初传入物体 object 3d  旋转到 正对 相机 
			lookAtCamera(thing) {
				
				let targetQuaternion = new THREE.Quaternion();
				let rotationMatrix = new THREE.Matrix4();
				// console.log(this.cylinder)
				rotationMatrix.lookAt(this.camera.position, thing.position, this.camera.position);
				targetQuaternion.setFromRotationMatrix(rotationMatrix);
				
				thing.quaternion.rotateTowards(targetQuaternion, 0)
				thing.lookAt(this.camera.position)
				
			},
			// 屏幕坐标转 空间坐标
			screenToSpace(sx, sy, box) {

				let x = (sx / (this.windowWidth)) * 2 - 1;
				let y = -(sy / (this.windowHeight)) * 2 + 1;

				let v = new THREE.Vector3(x, y, 0.999)

				v.unproject(this.camera)

				box.position = v
				box.position.normalize();
				console.log(v,box)
			},

			// 导航 原点
			arrowXY(vector,arrowXY) {
				let a = new THREE.Vector3().copy(vector)
				const standardVec = a.project(this.camera)
				const screenX = Math.round(this.windowWidth * 0.5 * standardVec.x + this.windowWidth * 0.5);
				const screenY = Math.round(-this.windowHeight * 0.5 * standardVec.y + -this.windowHeight * 0.5);

				if (standardVec.z < 1) {
					if (screenX > this.windowWidth) {
						arrowXY.arrowLeft = (this.windowWidth - 10) + "px"
					} else if (screenX < 0) {
						arrowXY.arrowLeft = "0px"
					} else {
						arrowXY.arrowLeft = screenX + 'px'
					}

					if (screenY > this.windowHeight) {
						arrowXY.arrowTop = (-this.windowHeight - 10) + "px"
					} else if (screenY < 0) {
						arrowXY.arrowTop = "0px"
					} else {
						arrowXY.arrowTop = screenY + 'px'
					}

				}

				if (this.ii % 100 == 0) {
					// console.log("unproject",screenX , screenY,standardVec)
				}
			},
			//低头检测
			bowHead(face) {
				// this.iiConsol(face,"bowHead")
				if (!this.flag3) {
					if ((face.a > 6500 || face.b > 6500 || face.c > 6500)) {
						if (this.faceflag) {
							console.log('按钮出现')
							this.screenToSpace(90, 580,  this.vrPlayBtn)
							this.screenToSpace(210, 580, this.vrRotateBtn)
						}

						this.faceflag = false
					} else {
						this.removeBowHeadBox()
						this.faceflag = true
					}
				}


			},
			//初始化 浮标物体
			initBuoyThing() {
				// 球的 准确率最高        cube.position.set(-145,-65,-180) 球的 xyz
				this.cube = new THREE.Mesh(new THREE.SphereGeometry(40, 32, 32), new THREE.MeshBasicMaterial({
					color: "0xffffff",
					opacity: 0,
					transparent: true
				}));
				this.cube.position.set(-145, -65, -180)
				this.cube.name = "cube"
				this.scene.add(this.cube);

				// // 2s  （-295,-235,-190）   29s移动      30s最高点(-380,-260,-190)   31.10 完成(-300,-250,-110)  33.2S 开始移动   34.1 完成 (-300,-200,-12)
				this.shoe = new THREE.Mesh(new THREE.SphereGeometry(30, 32, 32), new THREE.MeshBasicMaterial({
					color: " 0xffffff",
					opacity: 0,
					transparent: true
				}));
				// this.shoe.position.set(-353, -278, -217)
				this.shoe.position.set(-318, -250, -199)
				this.shoe.name = "shoe"
				this.scene.add(this.shoe);

				this.scene.add(this.camera);
			},
			cameraFloat(vector) {

				let tempV = vector.applyMatrix4(this.camera.matrixWorldInverse).applyMatrix4(this.camera.projectionMatrix);

				if ((Math.abs(tempV.x) > 1) || (Math.abs(tempV.y) > 1) || (Math.abs(tempV.z) > 1)) {
					// 在视野外了
					if (this.ii % 100 == 0) {
						// console.log(" 在视野外了",tempV)
						this.showShoeFlag = false
					}
				} else {
					// 在视野内
					if (this.ii % 100 == 0) {
						// console.log(" 在视野内了")
						this.showShoeFlag = true
					}
				}

			},

			//初始化速度
			initShoeV() {
				let a = {}
				a.vx = v(-300, -295, 1)
				a.vy = v(-250, -235, 1)
				a.vz = v(-110, -190, 1)
				a.targetX = -300
				a.targetY = -250
				a.targetZ = -100
				a.ctime = 28
				a.radius = 30

				let c = {}
				c.vx = v(0, -0, 1)
				c.vy = v(-0, -0, 1)
				c.vz = v(-0, -0, 1)
				c.ctime = 30
				c.radius = 32

				let d = {}
				d.vx = v(-300, -300, 1)
				d.vy = v(-200, -250, 1)
				d.vz = v(-12, -100, 1)
				d.targetX = -300
				d.targetY = -200
				d.targetZ = -12
				d.ctime = 33
				d.radius = 30

				let e = {}
				e.vx = v(-0, -0, 1)
				e.vy = v(-0, -0, 1)
				e.vz = v(-0, -0, 1)
				e.ctime = 34
				e.radius = 30

				return [a, c, d, e]

				function v(a, b, t) {
					return ((a - 0) - (b - 0)) / ((t - 0) * 60)
				}

			},
			// 视频时间 回调
			videoTimeupdate(e) {
				// console.log("videoTimeupdate")
				let currentTime = e.detail.currentTime
				let newTime = Math.floor(currentTime)
				// console.log("this.htmlVideoElement.currentTime",this.htmlVideoElement.currentTime)
				if (this.buoyNewTime == newTime || newTime == 0) {
					// this.buoyCanvas.requestAnimationFrame(() => this.buoyDraw())
					return
				}
				// console.log(this.buoyNewTime)
				// console.log(currentTime - 28.4 ,currentTime,currentTime > 28.4)
				this.buoyNewTime = newTime

				this.calculateList.forEach((v, i) => {
					if (this.buoyNewTime == v.ctime) {
						this.moveList[0] = v
					}
				})

			},

			//视频浮标暂停
			stopBuoy() {
				this.stopMoveList = this.deepCopy(this.moveList)
				this.moveList.forEach(v => {
					v.vx = 0
					v.vy = 0
					v.vz = 0
				})
				this.htmlVideoElement.pause()
			},

			//视频浮标回复
			recoveryBuoy() {
				this.moveList = this.deepCopy(this.stopMoveList)
				this.htmlVideoElement.play()

			},

			// 移动
			move() {
				if (this.moveList != null && this.moveList.length > 0) {
					this.moveList.forEach(v => {

						if (v.targetX != null) {
							if (v.vx > 0) {
								if (this.shoe.position.x >= v.targetX) {
									v.vx = 0
								}
							}
							if (v.vx < 0) {
								if (this.shoe.position.x <= v.targetX) {
									v.vx = 0
								}
							}
							if (v.vy > 0) {
								if (this.shoe.position.y >= v.targetY) {
									v.vy = 0
								}
							}
							if (v.vy < 0) {
								if (this.shoe.position.y <= v.targetY) {
									v.vy = 0
								}
							}
							if (v.vz > 0) {
								if (this.shoe.position.z >= v.targetZ) {
									v.vz = 0
								}
							}
							if (v.vz < 0) {
								if (this.shoe.position.z <= v.targetZ) {
									v.vz = 0
								}
							}
						}

						this.shoe.position.x += v.vx
						this.shoe.position.y += v.vy
						this.shoe.position.z += v.vz
					})
				}

			},

			// 重绘
			animate() {
				this.canvas.requestAnimationFrame(() => {
					this.animate()
				});
				this.update();
			},

			update() {
				this.controls.update();
				this.move()
				this.mouse.x = 0
				this.mouse.y = 0
				this.raycaster.setFromCamera(this.mouse, this.camera);
				let intersects = this.raycaster.intersectObjects(this.scene.children)
				
				this.arrowXY(this.shoe.position,this.shoeArrowXY)
				this.arrowXY(this.cube.position,this.cubeArrowXY)
				
				if (0 < intersects.length && this.clickFlag) {
					// 事件
					this.bowHead(intersects[intersects.length - 1].face)
					if (1 < intersects.length) {

						for (let i = 0; i < intersects.length; i++) {
							if (!this.imgFlag) {
								this.oldTime = (new Date()).valueOf()
								this.loadinImgUrl = 'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/img/16167470007553sLoading.gif?' +
									Math.random()
							}

							if (this.openVideoUrlFlag) {
								this.imgFlag = true
							}
							if ((new Date()).valueOf() - 2950 >= this.oldTime && this.openVideoUrlFlag) {
								this.openVideoUrlFlag = false
								// intersects[0].object.material.color.set(this.color16())

								// 事件
								if ("cube" == intersects[i].object.name) {
									this.imgFlag = false
									this.scene.remove(this.cube)
									this.scene.remove(this.shoe)
									this.scene.remove(this.vrPlayBtn)
									this.scene.remove(this.vrRotateBtn)
								}

								if ("shoe" == intersects[0].object.name) {
									if (this.diaLogFlag) {
										this.diaLogFlag = false
										this.openDialog()
									}
								}
								if ("play" == intersects[0].object.name) {
									console.log("play事件")
									this.stopBtnClick()
								}

								if ("play3D" == intersects[0].object.name) {
									console.log("play3D事件")
									// this.playVRBtnClick()
									this.flag3 = true
									this.vrPlayBtn.position.z = 50000
									this.vrRotateBtn.position.z = 50000
								}

							}
						}

					} else {
						this.imgFlag = false
						this.loadinImgUrl = ''
						this.diaLogFlag = true
						this.openVideoUrlFlag = true
					}
				}
				this.ii++
				this.renderer.render(this.scene, this.camera);
			},

			//视频初始化
			videoInit() {
				let myVideo = uni.createVideoContext('myVideo',this)
				let query = uni.createSelectorQuery()
				let video = query.select('myVideo')
				return video
			},

			playBtnClick() {
				this.mouse.x = 0;
				this.mouse.y = 0;

				this.htmlVideoElement.play()
			},
			stopBtnClick() {
				if (this.stopVideoFlag) {
					this.stopBuoy()
				} else {
					this.recoveryBuoy()
				}
				this.stopVideoFlag = !this.stopVideoFlag
			},
			playVRBtnClick() {
				// this.aaaaaaflag = true
				this.flag3 = !this.flag3
			},
			color16() { //十六进制颜色随机
				return '#' + random16() + random16() + random16();

				function random16() {
					return Math.floor(Math.random() * 256).toString(16)
				}
			},
			// 相机初始化
			cameraInit() {
				// 注意相机位置 相机位置会导致 中心点不准
				const aspectRatio = this.windowWidth / this.windowHeight
				// console.log("(  window.innerHeight )", (window.innerHeight))
				const camera = new THREE.PerspectiveCamera(70, aspectRatio, 0.1, 10000);
				//设置相机位置  (3行都是，必须要)
				camera.position.set(0, 0, 0)
				camera.lookAt(camera.position);
				camera.target = new THREE.Vector3(0, 0, 0);
				return camera

			},
			// 材质球初始化
			meshInit({
				texture
			}) {
				//材质
				// 球形 皮肤 大小  球体半径 ，水平分段数 （沿着经线分段） ， 垂直分段数 （沿着纬线分段） ）
				//const sphereGeo = new THREE.SphereGeometry(radius1,radius2,radius3)
				this.textureMaterial = this.initTextureMaterial(texture)
				return new THREE.Mesh(this.sphereGeo, this.textureMaterial);
			},
			//初始化 材质
			initTextureMaterial(texture) {
				return new THREE.MeshBasicMaterial({
					map: texture
				});
			},
			//初始化球体
			intSphereGeo() {
				const radius1 = 500,
					radius2 = 100,
					radius3 = 100
				//参数定义 半径 经纬度上点的数量
				this.sphereGeo = new THREE.SphereBufferGeometry(radius1, radius2, radius3);
				// 大小
				this.sphereGeo.scale(-1, 1, 1);
			},
			//渲染器 初始化
			rendererInit(width, height) {
				// antialias 抗锯齿
				const renderer = new THREE.WebGLRenderer({
					antialias: true
				})
				//像素比率
				// renderer.setPixelRatio(window.devicePixelRatio);
				renderer.setSize(width, height)

				return renderer
			},
			// 打开 弹窗
			openDialog() {
				this.verticalJumpDialogFlag = true
				this.stopBuoy()
			},
			// 关闭 弹窗
			closeDialog() {
				this.verticalJumpDialogFlag = false
				this.recoveryBuoy()
				// this.loadinImgUrl = ''
				// this.imgFlag = false
			},
			vrRendererInit(width, height) {
				//此处获取canvas dom的宽高 重新拉起rendererInit（）方法 重新渲染回去
				const renderer = this.rendererInit(this.windowWidth, this.windowHeight)
				const vrRender = new StereoEffect(renderer)
				return vrRender
			},
			// dom 事件方法
			onDocumentTouchstart(event) {
				event.preventDefault();
				this.isUserInteracting = true;
				this.onPointerDownPointerX = event.touches[0].clientX;
				this.onPointerDownPointerY = event.touches[0].clientY;

				this.onPointerDownLon = this.lon;
				this.onPointerDownLat = this.lat;

			},
			onDocumentTouchmove(event) {
				if (this.isUserInteracting === true) {
					this.lon = (this.onPointerDownPointerX - event.touches[0].clientX) * 0.1 + this.onPointerDownLon;
					this.lat = (this.onPointerDownPointerY - event.touches[0].clientY) * 0.1 + this.onPointerDownLat;
				}
			},
			onDocumentTouchend() {
				this.isUserInteracting = false;
			},
			onDocumentMouseDown(event) {
				event.preventDefault();
				this.isUserInteracting = true;

				this.onPointerDownPointerX = event.clientX;
				this.onPointerDownPointerY = event.clientY;

				this.onPointerDownLon = this.lon;
				this.onPointerDownLat = this.lat;
			},
			onDocumentMouseMove(event) {
				if (this.isUserInteracting === true) {
					this.lon = (this.onPointerDownPointerX - event.clientX) * 0.1 + this.onPointerDownLon;
					this.lat = (this.onPointerDownPointerY - event.clientY) * 0.1 + this.onPointerDownLat;
				}
			},
			onDocumentMouseUp() {
				this.isUserInteracting = false;
			},
			// 限制
			onWindowResize() {
				this.camera.aspect = this.windowWidth / (this.windowHeight)
				this.camera.updateProjectionMatrix();

				this.renderer.setSize(this.windowWidth, (this.windowHeight));
			},

			// 鼠标点击
			onMouseClick(event) {
				this.clickFlag = true
				// 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
				event.preventDefault();
				// 注意坐标
				// console.log(event.clientX,event.clientY,window.innerWidth,window.innerHeight)
				this.mouse.x = ((event.clientX) / (this.windowWidth)) * 2 - 1;
				this.mouse.y = -((event.clientY) / (this.windowHeight)) * 2 + 1;
				// console.log("this.mouse",this.mouse)
			},
			// 触摸点击
			onTouchstart(event) {
				this.clickFlag = true
				// 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
				event.preventDefault();
				// console.log(JSON.stringify(event))
				// 注意坐标
				// console.log(event.clientX,event.clientY,window.innerWidth,window.innerHeight)
				this.mouse.x = ((event.touches[0].clientX) / (this.windowWidth)) * 2 - 1;
				this.mouse.y = -((event.touches[0].clientY) / (this.windowHeight)) * 2 + 1;

				// console.log(this.mouse)
			},
			iiConsol(v, str) {
				if (this.ii % 60 == 0) {
					console.log(v, str)
				}
			}
		}
	}
</script>

<style lang="scss">
	// .vr_container {
	//   position: fixed;
	//   left: 50%;
	//   top: 50%;
	//   transform: translate(-50%, -50%) rotate(90deg);
	//   width: 100vh;
	//   height: 100vw;
	// }
	page{
		width: 100%;
		height: 100%;
	}
	.canvasBox{
		background-color: black;
		canvas{
			width: 100%;
			height: 100%;
		}
	}
	.vr_container {
		width: 750rpx;
		height: 100%;
		// position: fixed;
		left: 0;
		top: 0;
	}

.btn {
  z-index: 999;
  display: inline-block;
  position: absolute;
  margin-left: 10px;

  &:nth-child(2) {
    margin-left: 100px;
  }

  &:nth-child(3) {
    margin-left: 200px;
  }
}

.vr_loading {
  width: 20px;
  height: 20px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .circle {
    width: 6px;
    height: 6px;
    border-radius: 3px;
    background-color: red;
    margin: 0 auto;
    line-height: 16px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
  }
}

// .to_top {
// 	width: 0;
// 	height: 0;
// 	border-bottom: 10px solid #000;
// 	border-left: 8px solid transparent;
// 	border-right: 8px solid transparent;
// 	position: absolute;
// 	transform: rotate(90deg);

// }

.to_top {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  border-bottom: 10px solid #f1f1f1;
  // top: 50%;
}
</style>
