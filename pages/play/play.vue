<template>
	<view class="playBox">
		<!-- 入场loading -->
		<view v-if="videoloadFlag" class="videoLoadImageBox">
			<image src="https://sike-1259692143.cos.ap-chongqing.myqcloud.com/baseImg/1605168512421loading.gif"></image>
		</view>
		<view v-if="!playMode" :style="{transform: transform, position: 'fixed', left: '160rpx', top:'40rpx',zIndex: '9'}">
			<Advertising isCustom @customAddEvent="showDialog" @customConfirmEvent="openAdvertising" @customCloseEvent="closeDialog"></Advertising>
		</view>
		<view v-if="playMode" :style="{transform: transform, position: 'fixed', right: '-40rpx', bottom:'120rpx', zIndex: '9'}">
			<Advertising isCustom @customAddEvent="showDialog"  @customConfirmEvent="openAdvertising" @customCloseEvent="closeDialog"></Advertising>
		</view>
		<!-- 确认观看激励视频广告的弹窗 -->
		<view v-if="playMode">
			<u-modal v-model="showAdvertisingFlag" title="温馨提示" :show-confirm-button="false" z-index="999">
				<view class="slot-content">
					<view style="padding: 0 20rpx;padding-top: 40rpx;">
						<view>完整观看激励视频可以获得15个光的奖励哦</view>
						<view @click="openAdvertising" style="padding: 20rpx;background-color: #985ba9;width: 400rpx;margin-left: calc(50% - 200rpx); margin-top: 60rpx;text-align: center;border-radius: 10rpx;margin-bottom: 40rpx;">
							<image src="../../static/icon/showVideo.png" style="width: 40rpx;height: 40rpx;display: inline-block;transform: translateY(4rpx);"></image>
							<view style="display: inline-block;margin-left: 10rpx;color: #fff;transform: translateY(-4rpx);">立即获取</view>
						</view>
						<view @click="closeDialog" style="position: absolute;right: 20rpx; top: 20rpx;width: 40rpx;height: 40rpx;text-align: center;line-height: 40rpx;font-size: 40rpx;">x</view>
					</view>
				</view>
			</u-modal>
		</view>
		<view v-if="!playMode">
			<u-modal v-model="showAdvertisingFlag" title="温馨提示" :show-confirm-button="false" z-index="999">
				<view class="slot-content">
					<view style="padding: 0 20rpx;padding-top: 40rpx;">
						<view>完整观看激励视频可以获得15个光的奖励哦</view>
						<view @click="openAdvertising" style="padding: 20rpx;background-color: #985ba9;width: 400rpx;margin-left: calc(50% - 200rpx); margin-top: 60rpx;text-align: center;border-radius: 10rpx;margin-bottom: 40rpx;">
							<image src="../../static/icon/showVideo.png" style="width: 40rpx;height: 40rpx;display: inline-block;transform: translateY(4rpx);"></image>
							<view style="display: inline-block;margin-left: 10rpx;color: #fff;transform: translateY(-4rpx);">立即获取</view>
						</view>
						<view @click="closeDialog" style="position: absolute;right: 20rpx; top: 20rpx;width: 40rpx;height: 40rpx;text-align: center;line-height: 40rpx;font-size: 40rpx;">x</view>
					</view>
				</view>
			</u-modal>
		</view>
		<view class="play" :style="{'width': mobilePhoneWidth+'px', 'height': mobilePhoneHeight+'px'}">
			<!-- 定位选项画布 -->
			<view class="container"  v-show="showCanvasFlag" 
			:style="{'width': canvasWidth+'px', 'height': canvasHeight+'px'}">
			  <canvas canvas-id="myCanvas" @touchstart="getTouchPosition" @touchend="canvasTouchendEvent"></canvas>
			</view>
			<!-- 播放主体   @click="showButton" @timeupdate="videoTimeupdate" -->
			<view class="videoBox" :style="{'width': videoWidth+'px', 'height': videoHeight+'px', 'transform': transform}">
				<video :src="videoUrl" :autoplay="autopalyFlag" :show-mute-btn="true" :show-fullscreen-btn="false" id="myVideo"
				:enable-play-gesture="playGestureFlag" :enable-progress-gesture="progressGestureFlag" @ended="videoEnd" @pause="videoPause"  @loadedmetadata="loadeddata"
				@touchend="videoTouchend" @touchstart="videoTouchstart" v-if="videoShowFlag" @timeupdate="videoTimeupdate"
				:controls="controlsFlag" ></video>
				<!-- 视频播放结束触发事件显示最后一帧截图 -->
				<view v-if="screenshotShowFlag" class="screenshot" :style="{backgroundImage: 'url(' + imageSrc + ')',
				'background-repeat':'no-repeat', backgroundSize:'100% 100%'}"></view>
			</view>
			<!-- 选项 -->
			<view class="chooseTipsMask15"  v-if="chooseTipsMaskFlag">
				<view class="chooseTipsMask16" v-if="chooseTipsShowFlag" :style="{'transform': transform}">
					<view class="chooseTips">
						<view class="tips" v-for="(item, index) in tipsArray" :key="index">
							<view class="optionBox" @touchstart="changeBackground(index)" @touchend="rebackBackground(index)" :style="{'background': background[index]}">
								<view class="option" style="text-align: center;"><text>{{option[index]}}</text></view>
							</view>
						</view>
						<view class="video_rebroadcast" @click="closeChooseTips">
							<img src="/static/icon/replay.png">
						</view>
					</view>
				</view>
			</view>
			<!-- 好感度 -->
			<view :style="showStyleFlag?'display: block':'display: none'"  class="verticalLikabilityBox">
				<view class="likabilityTips" v-if="likabilityFlag" style="pointer-events: none;">
					<view class="lbtips" v-for="(item, index) in likabilityArray" :key="index">
						<view class="likabilityBox">
							<view class="likability">{{likabilityArray[index].title}}{{' : '}}{{likabilityArray[index].value}}</view>
						</view>
					</view>
				</view>
			</view>
			<view :style="!showStyleFlag?'display: block':'display: none'"  class="horizontalLikabilityBox">
				<view class="likabilityTips" v-if="likabilityFlag" style="pointer-events: none;">
					<view class="lbtips" v-for="(item, index) in likabilityArray" :key="index">
						<view class="likabilityBox">
							<view class="likability">{{likabilityArray[index].title}}{{' : '}}{{likabilityArray[index].value}}</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 光 -->
			<!-- <view class="lightBox">
				<view class="lightIconBox">
					<icon class="lightIcon"></icon>
				</view>
				<view class="lightText">{{'x'+lightNumber}}</view>
				<view class="addLightIconBox">
					<icon class="addLightIcon"></icon>
				</view>
			</view> -->
			<!-- 故事线和举报 -->
			<!-- :style="hiddenBtnFlag?'display: block':'display: none'" -->
			<!-- 横屏 -->
			<view v-if="hiddenBtnFlag" :style="showStyleFlag?'display: block':'display: none'" class= "verticalBox">
				<view class="reportBox" @click="showReportContent">
					<view class="reportIconBox">
						<icon class="reportIcon"></icon>
					</view>
					<view class="report">举报</view>
				</view>
				<view class="storyLineBox" @click="showStoryLineContent">
					<view class="storyLineIconBox">
						<icon class="storyLineIcon"></icon>
					</view>
					<view class="storyLine">换个选择</view>
				</view>
				<view class="seeMoreBox" @click="goDiscover">
					<view class="seeMoreIconBox">
						<icon class="seeMoreIcon"></icon>
					</view>
					<view class="seeMore">看更多</view>
				</view>
			</view>
			<!-- 竖屏 -->
			<view v-if="hiddenBtnFlag" :style="!showStyleFlag?'display: block':'display: none'" class= "horizontalBox">
				<view class="reportBox" @click="showReportContent">
					<view class="reportIconBox">
						<icon class="reportIcon"></icon>
					</view>
					<view class="report">举报</view>
				</view>
				<view class="storyLineBox" @click="showStoryLineContent">
					<view class="storyLineIconBox">
						<icon class="storyLineIcon"></icon>
					</view>
					<view class="storyLine">换个选择</view>
				</view>
				<view class="seeMoreBox" @click="goDiscover">
					<view class="seeMoreIconBox">
						<icon class="seeMoreIcon"></icon>
					</view>
					<view class="seeMore">看更多</view>
				</view>
			</view>
			<!-- 故事线内容呈现在蒙板之上 -->
			<view class="storyLineContentMask16" v-if="storyLineContentFlag">
				<view class="storyLineContentBox">
					<view class="closeBox" @click="closeStoryLineContent">
						<icon class="closeIcon"></icon>
					</view>
					<view class="title">故事线</view>
					<view class="splitLine"></view>
					<view class="storyLineContent">
						<horizontalStoryLine :pkArtworkId="artworkId" :pkDetailIds="playedHistoryArray" @goPlay="storyLineJumpPlayTodo" v-if="!storyLineFlag"></horizontalStoryLine>
						<storyLine :pkArtworkId="artworkId" :pkDetailIds="playedHistoryArray" @goPlay="storyLineJumpPlayTodo" v-if="storyLineFlag"></storyLine>
					</view>
				</view>
			</view>
				<!-- 举报内容呈现在蒙板之上 -->
			<view class="reportContentMask16" v-if="reportContentFlag">
				<view class="reportContentBox">
					<view class="closeBox" @click="closeReportContent">
						<icon class="closeIcon"></icon>
					</view>
					<view class="title">举报</view>
					<view class="splitLine"></view>
					<view class="subTitle">举报内容：</view>
					<view class="reportContent">
						<view class="uni-list">
							<checkbox-group @change="checkboxChange">
								<label class="checkBox" v-for="item in items" :key="item.value">
									<view>
										<checkbox :value="item.value" :checked="item.checked" />
									</view>
									<view class="nameBox">
										<view class="name">{{item.name}}</view>
									</view>
								</label>
							</checkbox-group>
						</view>
						<view class="uni-textarea">
							<textarea v-model="textareaContent" />
							</view>
						<view class="uploadBox">
							<view class="subTitle">上传图片</view>
							<view class="uploadBtnBox" v-if="uploadBtnFlag" @click="uploadImage">
								<icon></icon>
							</view>
							<view class="uploadImageBox" v-if="uploadImageFlag">
								<image :src="headImage" mode="scaleToFill"></image>
							</view>
						</view>
						<view class="submitBtnBox" @click="submit">
							<view class="btnText">提交</view>
						</view>
					</view>
				</view>
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
		<!-- horizontalControlsFlags -->
		<view class="progress-line-box" :style="{'width': videoWidth*0.8+'px'}" v-if="horizontalControlsFlags">
			<progress :percent="percent" stroke-width="2" active-mode="forwards" active-color="#FF7256"></progress>
			<view class="progress-time">{{durationStr}}</view>
		</view>
		<view class="progress-box" v-if="horizontalControlsFlags">
			<view class="f-text">首</view>
			<view class="replayVideoIconBox" @click="replayVideo">
				<icon></icon>
			</view>
			<view class="jumpbackIconBox" @click="jumpbackVideo">
				<icon></icon>
			</view>
		    <view class="suspendIconBox" @click="playVideo" v-if="suspendFlag">
				<icon></icon>
		    </view>
		    <view class="playIconBox" @click="suspendVideo" v-if="!suspendFlag">
		   		<icon></icon>
		    </view>
		    <view class="jumpforwardIconBox" @click="jumpForwardVideo">
		   		<icon></icon>
		    </view>
		    <view class="endVideoIconBox" @click="endVideo">
		   		<icon></icon>
		    </view>
			<view class="t-text">尾</view>
		</view>
	</view>
</template>

<script>
	import { baseURL } from '../login/config/config.js'
	import storyLine from './storyLine/storyLine.vue'
	import {horizontalStoryLine} from './storyLine/horizontalStoryLine.vue'
	import Advertising from '../../components/Advertising/Advertising.vue'
	export default {
		components:{
			storyLine,
			horizontalStoryLine,
			Advertising
		},
		data() {
			return {
				//定位选项标志
				isPosition: 0,
				//定位选项数据
				nodeLocationList: [],
				//视频路径
				videoUrl: "",
				//选项参数
				option: ["我是选项1","我是选项2","我是选项3","我是选项4"],
				//选项背景颜色
				background: ["","","",""],
				//隐藏按钮开关
				hiddenBtnFlag: false,
				//是否展示选项开关
				chooseTipsShowFlag: false,
				//选项最底层蒙版
				chooseTipsMaskFlag: false,
				//是否展示故事线开关
				storyLineContentFlag: false,
				//是否展示举报开关
				reportContentFlag: false,
				//上传图片展示开关
				uploadImageFlag:false,
				//是否显示上传图片按钮开关
				uploadBtnFlag: true,
				//是否播放到叶子视频 true是未播放结束
				endFlag: true,
				//展示画布开关
				showCanvasFlag: false,
				//作品id
				artworkId: 0,
				//作品详情id
				detailId: 0,
				//跳转目标节点的detailId
				linkNodeId: 0,
				//播放历史的作品id容器
				playedHistoryArray: [],
				//选项对象容器
				childs: [],
				//通过tipsArray数组长度控制选项个数
				tipsArray: [],
				//举报类型
				reportType: "",
				//举报内容
				textareaContent: "",
				//延时函数
				time: Function,
				//云端举报图片url
				headImage: "",
				//举报类型选项数组
				items: [
					{
						value: 1,
						name: '侵犯版权'
					},
					{
						value: 2,
						name: '出现违规内容',
						// checked: 'true'
					},
					{
						value: 3,
						name: '其它'
					}
				],
				//canvas画布的宽度
				canvasWidth: 0,
				//canvas画布的高度
				canvasHeight: 0,
				//video的宽度
				videoWidth: 0,
				//video的高度
				videoHeight: 0,
				//用户手机的高度
				mobilePhoneHeight: 0,
				//用户手机宽度
				mobilePhoneWidth: 0,
				//矩形框数据数组
				rectArray: [],
				//默认是个不会被触发的数字 
				touchRectNum: 5,
				//是否被点击的标志
				isClickFlag: false,
				//视频播放的信息
				duration: null,
				//是否自动播放标志
				autopalyFlag: true,
				//是否开启手势标志
				playGestureFlag: true,
				//是否开启进度控制手势开关
				progressGestureFlag: true,
				//touchstart 横轴坐标
				tsx: 0,
				//touchstart纵轴坐标
				tsy: 0,
				//视屏播放完成显示截图的截图路径
				imageSrc: '',
				//是否展示video标签的标志
				videoShowFlag: true,
				//是否展示截屏图片的标志
				screenshotShowFlag: false,
				//光的数值
				lightNumber: 25,
				//是否展示好感度标志
				likabilityFlag: false,
				//好感度数值容器
				likabilityArray: [],
				//入场loading的开关
				videoloadFlag: true,
				//好感度延时函数
				likabilityDelayFunction: Function,
				//横屏播放控件延时函数
				horizontalControlsFunction: Function,
				//故事线跳转到播放页的当前节点是否已播放标志
				isPlayedFlag: false,
				//是否点击了选项开关（用于保存有效观看记录使用）
				isClickOptionFlag: false,
				//扫码预览提示框开关
				previewShow: false,
				//video横屏播放行内样式动态设置变量
				transform: 'translate(-50%, -50%)',
				//播放如何展示举报和故事线按钮开关 默认竖屏展示true
				showStyleFlag: true,
				//是否显示video原生进度条的开关
				controlsFlag: false,
				//横屏视频播放控件开关
				horizontalControlsFlags: false,
				//播放暂停控件的开关
				suspendFlag: false,
				//视频的当前播放时间 250mm获取一次当前播放时间
				currentTime: 0,
				//故事线flag true表示展示竖版的故事线
				storyLineFlag: true,
				//多结局路线存储容器
				multipleResultLine: [],
				//多结局播放标志
				parentId: 0,
				//用于横屏播放时显示的视频的总时长
				durationStr: '',
				//用于横屏播放时显示的视频的当前时间
				currentTimeStr: '',
				//进度条进度
				percent: 0,
				//记录保存次数
				savaRecordCount: 0,
				//本次播放是否消费开关
				iscustomLightFlag: false,
				//是否是故事线跳回开关
				storyLineJumpFlag: false,
				// 播放模式
				playMode: 0,
				// 激励广告确认弹窗
				showAdvertisingFlag: false
			}
		},
		onReady(){
			//重置开关状态到初始值
			this.isClickOptionFlag = false
			//关闭好感度 视频加载结束时打开
			this.likabilityFlag = false
			//获取手机屏幕尺寸 单位是px
			const {windowWidth, windowHeight, brand, model} = uni.getSystemInfoSync()
			//将用户手机窗口尺寸记录方便在方法中调用
			uni.setStorageSync('windowSize',{
				'windowWidth': windowWidth,
				'windowHeight': windowHeight
			})
			this.mobilePhoneHeight = windowHeight
			this.mobilePhoneWidth = windowWidth
			//是否是最后一个视频的标志在页面加载时要设置成true 不然不会弹框
			this.endFlag = true;
			//重置用户选项分数
			uni.setStorageSync('userScore',[])
			//重置好感度数组
			this.likabilityArray = []
			//获取一颗作品树
			this.getArtworkTreeByArtworkId();
		},
		onLoad(option) {
			uni.showShareMenu({
			  withShareTicket: true,
			  menus: ['shareAppMessage', 'shareTimeline']
			})
			//option.scene 不为空说明是二维码跳转
			if(option.scene){
				let scene = decodeURIComponent(option.scene);
				var arr = scene.split('=')
				//a是artworkId b是status -0是为了将string 转化成number
				let a = arr[1] - 0
				let b = arr[3] - 0
				//b=1 表示用户扫描的预览的二维码
				if(b == 1){
					this.getUserIdByArtwordId(a)
				}else{
					this.artworkId = a;
				}
			}else{
				//发现页和我的页面跳转播放页携带作品id
				try{
					let isLoginJump = uni.getStorageSync('isLoginJump')
					if(isLoginJump === 0){
						this.artworkId = uni.getStorageSync('previewArtworkId')
						uni.setStorageSync('isLoginJump', 1)
					}else{
						this.artworkId = option.pkArtworkId
					}
				}catch(e){
					this.artworkId = option.pkArtworkId
				}
			}
			if(this.artworkId == 0){
				//作品id 初始化之后需要取拿作品信息存起来待用
				let previewArtworkId = uni.getStorageSync('previewArtworkId')
				this.getPlayArtworkInfo(previewArtworkId)
			}else{
				//作品id 初始化之后需要取拿作品信息存起来待用
				this.getPlayArtworkInfo(this.artworkId)
			}
		},
		onUnload(){
			uni.navigateBack({
			    delta: 1 ,
				animationDuration: 10,
				animationType: null
			});
			//关闭页面时重置选项类型为默认
			uni.setStorageSync('isNumericalOptions',0)
			//关闭页面时重置节点分数容器
			uni.setStorageSync('appearConditionMap',null)
		},
		onShareAppMessage (res) {
			let artworkInfo = uni.getStorageSync('artworkInfo')
			let param = 'artWorkId='+artworkInfo.pkArtworkId+'=status=4'
			let title = artworkInfo.artworkName
			let imageUrl = artworkInfo.artworkDescribe
			if(artworkInfo.artworkStatus !== 4){
				param = 'artWorkId='+artworkInfo.pkArtworkId+'=status=1'
				title = '灵巫互动'
				imageUrl = 'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/baseImg/1605600100857%E5%9C%86%E5%BD%A2%E7%94%A8JPG.jpg'
			}
			return {
				title: title,
				imageUrl: imageUrl,
				path: 'pages/play/play?scene='+param
			}
			
		},
		onShareTimeline (res) {
			let artworkInfo = uni.getStorageSync('artworkInfo')
			let param = 'artWorkId='+artworkInfo.pkArtworkId+'=status=4'
			let title = artworkInfo.artworkName
			let imageUrl = artworkInfo.artworkDescribe
			if(artworkInfo.artworkStatus !== 4){
				param = 'artWorkId='+artworkInfo.pkArtworkId+'=status=1'
				title = '灵巫互动'
				imageUrl = 'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/baseImg/1605600100857%E5%9C%86%E5%BD%A2%E7%94%A8JPG.jpg'
			}
			return {
			  title: title,
			  imageUrl: imageUrl,
			  path: 'pages/play/play?scene='+param
			}
		},
		methods: {
			// 关闭激励广告确认框
			closeDialog () {
				if (this.isCustom) {
					this.$emit('customCloseEvent')
				} else {
					this.showAdvertisingFlag = false
				}
			},
			// 观看激励广告
			openAdvertising () {
				this.showAdvertisingFlag = false
				this.advertising = wx.createRewardedVideoAd({
					adUnitId: 'adunit-7423fd1b2c7c5724'
				})
				//捕捉错误
				this.advertising.onError(err => {
					uni.showToast({
						title:'获取激励视频失败，请重试'
					})
				})
				// 激励广告显示并加载
				if (this.advertising) {
					this.advertising.load().then(() => {
						this.advertising.show().then(() => {
						})
					}).catch(() => {
						this.advertising.load().then(() => {
							this.advertising.show().then(() => {
							})
						}).catch(() => {
							uni.showToast({
								title:'激励视频加载失败，请重试'
							})
						})
					})
				}
				// 监听激励广告关闭
				this.advertising.onClose((status) => {
					if (status.isEnded) {
						console.log('给光')
					} else {
						console.log('憨批用户不给光')
					}
					this.advertising.destroy()
				})
			},
			showDialog () {
				this.showAdvertisingFlag = true
			},
			//故事线跳转播放页
			storyLineJumpPlayTodo(option){
				this.iscustomLightFlag = false
				//故事线跳转重置跳转节点的目标节点的id
				this.linkNodeId = null
				//初始化是否此视频是否播放过开关
				this.isPlayedFlag = option.jumpFlag
				this.storyLineJumpFlag = true
				//故事线跳转时清除好感度延时函数
				clearTimeout(this.likabilityDelayFunction)
				//是否是最后一个视频的标志在页面加载时要设置成true 不然不会弹框
				this.endFlag = true;
				//重置用户选项分数
				uni.setStorageSync('userScore',[])
				//重置好感度数组
				this.likabilityArray = []
				//重置canvas画布中的按钮是否被点击的开关
				this.isClickFlag = false
				this.artworkId = option.pkArtworkId
				//故事线跳转进来的地方 会带上pkArtworkId and pkDetailId 
				//pkDetailId变量存在this里面的 没有在data中声明
				this.pkDetailId = option.pkDetailId
				// 每次的故事线跳转都要重置当前播放节点
				this.detailId = null;
				uni.setStorageSync("detailId",this.detailId)
				//故事线跳转过来存一棵主树 跳转用
				this.videoloadFlag = false
				//跳转成功先关闭故事线
				this.storyLineContentFlag = false
				//请求获取主树
				this.getArtworkTreeByArtworkId()
				//请求获取子树
				this.getArtworkTreeByDetailId()
				//获取播放历史记录
				this.playedHistoryArray = uni.getStorageSync("pkDetailIds")
				//重置多结局数组（故事线跳回时进行重组直接获取就好了）
				this.multipleResultLine = uni.getStorageSync("multipleResultLine")
				/* let multipleResultLine = uni.getStorageSync("multipleResultLine")
				multipleResultLine.splice(this.playedHistoryArray.length,multipleResultLine.length -(this.playedHistoryArray.length))
				console.log('数组截取的起始长度: ',this.playedHistoryArray.length)
				console.log('数组截取的长度: ',multipleResultLine.length -(this.playedHistoryArray.length))
				this.multipleResultLine = multipleResultLine
				console.log("multipleResultLine: ", this.multipleResultLine)
				uni.setStorageSync("multipleResultLine",multipleResultLine) */
				//获取存放节点数值的容器
				let appearConditionMap = uni.getStorageSync('appearConditionMap')
				//不能判断是普通选项的跳转还是数值选项的跳转了 因为数值选项中也可能存在普通选项会导致误判
				//所以不管是普通选项还是数值选项都要做一次分数的重新计算
				//appearConditionMap != null 说明一定是树中含有数值选项的跳转 appearConditionMap == null 说明所有节点都是普通选项的跳转
				if(appearConditionMap != null && JSON.stringify(appearConditionMap) != "{}"){
					let currentArray = this.deepCopy(this.playedHistoryArray)
					//如果此时的currentArray 是空的话则说明是跳转的根节点不做操作
					if(currentArray.length != 0){
						//计算跳转到的目标节点时此时用户的得分 所使用的临时数组变量 因为跳转过来没有当前节点的detailId
						//但是计算计算时得到的分数是包括当前节点的分数 因此将当前节点加入临时的数组变量中
						currentArray.push(this.pkDetailId)
						// console.log('播放记录：',currentArray)
						//根据appearConditionMap里面的元素长度初始化用户分数数组 只需一个元素长度便可
						let len = 0
						for(let item in appearConditionMap){
							len = appearConditionMap[item].length
							break;
						}
						// console.log('节点条件数组的长度：',len)
						let userScore = uni.getStorageSync('userScore')
						for(let k = 0; k < len; k++){
							userScore.push(0);
						}
						for(let i = 1; i < currentArray.length; i++){
							let key = ''+currentArray[i]
							let value = appearConditionMap[key]
							let showConditionNameFlag = false
							if(typeof(value) != 'undefined' && value.length != 0 ){
								if(currentArray[i] === this.pkDetailId){
									if(value[0].nameFlag == 1){
										showConditionNameFlag = true
									}
								}
								for(let j = 0; j < value.length; j++){
									//根据开关判断是否进行数值判断
									if(value[j].changeFlag == 1){
										userScore[j] += value[j].changeConditionValue
									}
									if(showConditionNameFlag){
										if(value[j].nameDisplay == 1){
											let obj = {
												title: value[j].nameCondition,
												value: userScore[j]
											}
											this.likabilityArray.push(obj)
										}
									}
								}
							}
						}
						uni.setStorageSync('userScore', userScore)
						// console.log('likabilityArray: ',this.likabilityArray)
					}
				}
			},
			//对节点播放数据进行筛选和提取
			initPlayData(artworkTree){
				//打开video开关
				if(uni.getStorageSync('isEndings') == 1){
					this.videoShowFlag = true
				}
				//是否是定位选项的标志 1是定位选项 其他是普通选项
				this.isPosition = artworkTree.isPosition
				if(this.isPosition == 1){
					//获取定位选项位置数据
					this.nodeLocationList = artworkTree.nodeLocationList
				}
				//随机数 
				const uuid = Math.random().toString(36).substring(2)
				//初始化视频及选项
				this.videoUrl = artworkTree.videoUrl+'?uuid='+uuid
				this.detailId = artworkTree.pkDetailId
				this.parentId = artworkTree.parentId
				this.imageSrc = artworkTree.nodeLastImgUrl
				//如果是根节点初始化存储节点分值的容器
				if(this.parentId === 0){
					//存进缓存是防止故事线进入时重置了data里面的数据
					let appearConditionMap = artworkTree.appearConditionMap
					if(appearConditionMap == null || appearConditionMap.length === 0){
						uni.setStorageSync('appearConditionMap', {})
					}else{
						uni.setStorageSync('appearConditionMap', appearConditionMap)
					}
				}
				// 将选项置空 避免选项中出现上一次选项的情况
				this.option = []
				//将孩子节点容器置空 避免视频一直循环播放
				this.childs = []
				//将当前播放的作品的detailId保存在缓存用于举报时确定是哪个具体的作品
				uni.setStorageSync("detailId",this.detailId)
				//保存播放过的作品的id
				this.savaPlayRecord();
				let childs = artworkTree.childs;
				if(childs){
					for(let i = 0;i < childs.length;i++){
						//是否是数值选项的标志 1是数值选项 其它是普通选项
						let isNumericalOptions = childs[i].isNumberSelect
						if(isNumericalOptions == 1){
							//普通选项中的数值选项
							this.calculateOptionScore(childs[i])
						}else{
							//普通选项
							this.option.push(childs[i].selectTitle)
							this.childs.push(childs[i])
						}
					}
					this.tipsArray.length = this.option.length
				}else{
					//islink不是null且值为1说明该节点是跳转节点 需要注意叶子节点的孩子也是空的可能会走进else故要考虑过是否是叶子节点
					if(artworkTree.isLink != null && artworkTree.isLink === 1){
						//从缓存中拿到主树
						const linkId = artworkTree.linkUrl
						//存储跳转目标节点的detailId
						this.linkNodeId = linkId
						const mainTree = uni.getStorageSync("mainArtworkTree")
						this.playedHistoryArray.push(artworkTree.pkDetailId)
						/* //不需要去重 记录故事线走向方便数值选项分数计算
						this.playedHistoryArray = Array.from(new Set(this.playedHistoryArray)); */
						uni.setStorageSync("pkDetailIds",this.playedHistoryArray)
						this.getTargetTree(mainTree,linkId)
					}else{
						//是不是最后一个视频标志 最后一个视频不需要弹窗
						this.endFlag = false;
					}
				}
				//非跳转节点的目标节点存播放记录
				if (this.linkNodeId != this.detailId) {
					// 将作品detailId留存提供给故事线
					this.playedHistoryArray.push(artworkTree.pkDetailId);
					/* //不需要去重 记录故事线走向方便数值选项分数计算
					this.playedHistoryArray = Array.from(new Set(this.playedHistoryArray)); */
					uni.setStorageSync("pkDetailIds",this.playedHistoryArray);
					this.linkNodeId = null
				}
			},
			// 计算选项分数判断是否显示
			calculateOptionScore(child){
				//获取数值选项参数
				let advancedList = child.onAdvancedList
				let userScore = uni.getStorageSync('userScore')
				// 初始化用户数值选项的分数
				if(userScore == null || userScore.length == 0){
					for(let k = 0; k < advancedList.length; k++){
						userScore.push(0);
					}
					uni.setStorageSync('userScore',userScore)
				}
				// 是否显示选项的开关
				let optionFlag = true
				for(let j = 0; j < advancedList.length; j++){
					if(advancedList[j].appearFlag == 1){
						let appearValueMin = advancedList[j].appearValueMin - 0
						let appearValueMax = advancedList[j].appearValueMax - 0
						if(userScore[j] >= appearValueMin && userScore[j] <= appearValueMax){
							optionFlag = optionFlag && true
						}else{
							optionFlag = optionFlag && false
						}
					}
				}
				if(optionFlag){
					//分值检测通过将数据装入容器待展示
					this.childs.push(child)
					this.option.push(child.selectTitle)
				}else{
					//定位选项中的数值选项如果不显示的话 那么也要将对应的坐标位置根据pkDetailId在nodeLocationList中删除，
					for(let i = 0; i < this.nodeLocationList.length; i++){
						if(this.nodeLocationList[i].pkDetailId == child.pkDetailId){
							this.nodeLocationList.splice(i,1)
						}
					}
				}
			},
			// 递归获取跳转节点对应的目标节点的detailId并拿到对应子树再重新初始化数据
			getTargetTree(mainTree,linkId){
				if(mainTree.pkDetailId == linkId){
					return this.initPlayData(mainTree);
				}else{
					const childs = mainTree.childs;
					if(childs){
						for(let i = 0;i < childs.length;i++){
							this.getTargetTree(childs[i],linkId);
						}
					}
				}
			},
			async getUserIdByArtwordId(a){
				await uni.request ({
					url: baseURL + "/wxPlay/getUserIdByArtwordId",
					method: 'POST',
					dataType: 'json',
					data: {
						pkArtworkId: a
					},
					success: result=> {
						if(result.data.status == 200){
							const userId = uni.getStorageSync('userId')
							if(result.data.data == userId){
								this.artworkId = a
							}else{
								uni.setStorageSync('previewArtworkId', a)
								this.previewShow = true
							}
						}
					}
				});
			},
			async customLightByUserId(eventId){
				//故事线消费的eventId = 3
				//初次播放消费eventId = 4
				await uni.request ({
					url: baseURL + "/wxPlay/customLight",
					method: 'POST',
					dataType: 'json',
					data: {
						userId: uni.getStorageSync('userId'),
						eventId: eventId
					},
					success: result=> {
						if(result.data.status == 200){
							if(this.storyLineJumpFlag){
								this.iscustomLightFlag = true
								this.storyLineJumpFlag = false
							}else{
								this.iscustomLightFlag = true
							}
						}else if(result.data.status == 10086){
							this.showAdvertisingFlag = true
						}
					}
				});
			},
			//异步请求获取作品树 by ArtworkId
			async getArtworkTreeByArtworkId(){
				console.log( this.artworkId)
				await uni.request({
					url: baseURL + "/wxPlay/playArtWorkByChildTree",
					method: 'POST',
					dataType: 'json',
					data: {
						pkArtworkId: this.artworkId,
						userId: uni.getStorageSync("userId")
					},
					success: res=> {
						if(res.data.status == 200){
							uni.setStorageSync("mainArtworkTree",res.data.data);
							//传到播放页面带pkDetailId参数 说明故事线跳转，只需要存一棵主树跳转节点不用去播放视频
							uni.setStorageSync('playMode',res.data.data.playMode); 
							uni.setStorageSync('isEndings',res.data.data.isEndings ); 
							if(this.pkDetailId != null) return;
							this.initPlayData(res.data.data);
						}else{
							this.videoShowFlag = false
						}
					}
				})
			},
			//异步请求获取作品树 by DetailId
			async getArtworkTreeByDetailId(){
				console.log( this.artworkId)
				await uni.request({
					url: baseURL + "/wxPlay/playArtWorkByChildTree",
					method: 'POST',
					dataType: 'json',
					data: {
						pkArtworkId: this.artworkId,
						detailId:  this.pkDetailId,
						userId: uni.getStorageSync("userId")
					},
					success: res=> {
						if(res.data.status == 200){
							uni.setStorageSync("artworkTree",res.data.data);
							uni.setStorageSync('playMode',res.data.data.playMode);
							uni.setStorageSync('isEndings',res.data.data.isEndings ); 
							this.initPlayData(res.data.data);
						}else{
							this.videoShowFlag = false
						}
					}
				})
			},
			async getMultipleResultLastVideo(){
				let multipleResultStr = '0'
				for(let i = 0; i <  this.multipleResultLine.length; i++){
					multipleResultStr = multipleResultStr + this.multipleResultLine[i]
				}
				console.log(multipleResultStr)
				await uni.request({
					url: baseURL + "/wxPlay/getArtworkEndings",
					method: 'POST',
					dataType: 'json',
					data: {
						fkArtworkId: this.artworkId,
						playHistory: multipleResultStr
					},
					success: res=> {
						if(res.data.status == 200){
							//清空路线容器
							this.multipleResultLine = []
							//随机数
							const uuid = Math.random().toString(36).substring(2)
							//初始化视频
							this.videoUrl = res.data.data.videoUrl+'?uuid='+uuid
							uni.setStorageSync("detailId",res.data.data.fkNodeId)
							uni.setStorageSync("fkNodeId",res.data.data.fkNodeId)
							this.playedHistoryArray.push(res.data.data.fkNodeId)
							this.parentId = res.data.data.parentId
							//存储多结局的结局视频播放历史
							uni.setStorageSync("pkDetailIds",this.playedHistoryArray)
							//保存播放记录
							this.savaPlayRecord();
						}else{
							this.storyLineContentFlag = true
							console.log('我去请求500')
						}
					}
				})
			},
			//异步请求保存播放记录
			async savaPlayRecord(){
				let userId = uni.getStorageSync("userId")
				if(uni.getStorageSync("openid")){
					if(!userId){
						if(this.savaRecordCount > 2){
							this.savaRecordCount == 0
							//三次都未请求到userID
							userId = -1
						}else{
							setTimeout(()=>{
								this.savaPlayRecord()
							},100)
							this.savaRecordCount++
						}
					}else{
						this.savaRecordCount == 0
					}
				}else{
					//朋友圈点击
					userId = -2
				}
				await uni.request({
					url: baseURL + "/wxPlay/savaPlayRecord",
					method: 'POST',
					dataType: 'json',
					data: {
						pkArtworkId: this.artworkId,
						userId: userId,
						detailId: this.detailId
					},
					success: res=> {
						if(res.data.status == 200){
							// console.log("我去存数据"+this.detailId+":",this.artworkId)
						}
					}
				})
			},
			//异步请求获取作品信息
			async getPlayArtworkInfo(artworkId){
				await uni.request({
					url: baseURL + "/wxPlay/queryArtworkInfo",
					method: 'POST',
					dataType: 'json',
					data: {
						pkArtworkId: artworkId
					},
					success: res=> {
						if(res.data.status == 200){
							uni.setStorageSync("artworkInfo",res.data.data);
						}
					}
				})
			},
			//统计有效的播放记录（进入播放页面并点击了选项（只记录第一次选项的点击）
			async statisticsPlayRecord(){
				let userId = uni.getStorageSync("userId")
				if(uni.getStorageSync("openid")){
					if(!userId){
						if(this.savaRecordCount > 2){
							this.savaRecordCount == 0
							//三次都未请求到userID
							userId = -1
						}else{
							this.statisticsPlayRecord()
							this.savaRecordCount++
						}
					}else{
						this.savaRecordCount == 0
					}
				}else{
					//朋友圈点击
					userId = -2
				}
				await uni.request({
					url: baseURL + "/wxPlay/statisticsPlayRecord",
					method: 'POST',
					dataType: 'json',
					data: {
						fkArtworkId: this.artworkId,
						fkUserId: userId,
						fkArtworkDetailId: this.detailId
					},
					success: res=> {
						if(res.data.status == 200){
							// console.log("我去存数据: ",this.detailId,":",this.artworkId)
						}
					}
				})
			},
			//统计故事线自然呈现记录（自然播放结束）
			async statisticsStorylineNaturalshow(){
				let userId = uni.getStorageSync("userId")
				if(uni.getStorageSync("openid")){
					if(!userId){
						if(this.savaRecordCount > 2){
							this.savaRecordCount == 0
							//三次都未请求到userID
							userId = -1
						}else{
							this.statisticsStorylineNaturalshow()
							this.savaRecordCount++
						}
					}else{
						this.savaRecordCount == 0
					}
				}else{
					//朋友圈点击
					userId = -2
				}
				await uni.request({
					url: baseURL + "/wxPlay/statisticsStorylineNaturalshow",
					method: 'POST',
					dataType: 'json',
					data: {
						fkArtworkId: this.artworkId,
						fkUserId: userId,
						fkArtworkDetailId: this.detailId
					},
					success: res=> {
						if(res.data.status == 200){
							// console.log("我去存数据: ",this.detailId,":",this.artworkId)
						}
					}
				})
			},
			//开关控制是否展示 选项框 故事线 举报页面
			videoEnd(){
				//根据是否是最后一个视频标志 最后一个视频播放结束弹出故事线 endFlag = true 表示不是最后一个视频
				this.percent = 100
				if(this.endFlag){
					if(this.isPosition == 1){
						this.chooseTipsShowFlag = false
						this.chooseTipsMaskFlag = false
						this.screenshotShowFlag = true
						this.videoShowFlag = true
						this.hiddenBtnFlag = false
						this.showCanvasFlag = true
						this.videoUrl = ''
					}else{
						this.showCanvasFlag = false
						this.hiddenBtnFlag = false
						this.chooseTipsShowFlag = true
						this.chooseTipsMaskFlag = true
					}
				}else{
					this.chooseTipsShowFlag = false
					this.chooseTipsMaskFlag = false
					this.showCanvasFlag = false
					uni.setStorageSync('userScore',[])
					if(uni.getStorageSync('isEndings') == 1){
						if(this.parentId != -1){
							this.getMultipleResultLastVideo()
						}else{
							this.storyLineContentFlag = true
							this.videoShowFlag = false
							this.statisticsStorylineNaturalshow()
						}
					}else{
						this.storyLineContentFlag = true
						this.statisticsStorylineNaturalshow()
					}
				}
			},
			//视屏暂停操作
			videoPause(){
				// this.hiddenBtnFlag = true
				// console.log('我暂停了')
			},
			//展示故事线内容的时候暂停视频
			showStoryLineContent(){
				this.storyLineContentFlag = true
				if(uni.getStorageSync('isEndings') == 1){
					this.videoShowFlag = false
				}
				const videoContext = uni.createVideoContext('myVideo')
				//暂停视屏
				videoContext.pause()
			},
			//展示举报内容的时候暂停视频
			showReportContent(){
				this.reportContentFlag = true
				this.uploadBtnFlag = true
				this.uploadImageFlag = false
				const videoContext = uni.createVideoContext('myVideo')
				videoContext.pause()
			},
			//触摸选项touchstart事件
			changeBackground(index){
				/* switch(index){
					case 0: {
						this.background.splice(index,1,"#96CDCD");
						break;
					}
					case 1: {
						this.background.splice(index,1,"#96CDCD");
						break;
					}
					case 2: {
						this.background.splice(index,1,"#96CDCD");
						break;
					}
					case 3: {
						this.background.splice(index,1,"#96CDCD");
						break;
					}
				} */
			},
			//触摸选项touchend事件
			rebackBackground(index){
				switch(index){
					case 0: {
						if(!this.iscustomLightFlag){
							if(this.storyLineJumpFlag){
								return this.customLightByUserId(3)
							}else{
								return this.customLightByUserId(4)
							}
						}
						this.background.splice(index,1,"#96CDCD");
						// splice替换数组元素
						this.likabilityArray = []
						this.background.splice(index,1,"")
						this.likabilityFlag = false
						// 播放结束清除延时函数
						clearTimeout(this.likabilityDelayFunction)
						this.optionTouchendTodo(index)
						//保存有效观看记录
						if(!this.isClickOptionFlag){
							this.statisticsPlayRecord()
							this.isClickOptionFlag = true
						}
						break;
					}
					case 1: {
						if(!this.iscustomLightFlag){
							if(this.storyLineJumpFlag){
								return this.customLightByUserId(3)
							}else{
								return this.customLightByUserId(4)
							}
						}
						this.background.splice(index,1,"#96CDCD");
						this.likabilityArray = []
						this.background.splice(index,1,"")
						this.likabilityFlag = false
						clearTimeout(this.likabilityDelayFunction)
						this.optionTouchendTodo(index)
						//保存有效观看记录
						if(!this.isClickOptionFlag){
							this.statisticsPlayRecord()
							this.isClickOptionFlag = true
						}
						break;
					}
					case 2: {
						if(!this.iscustomLightFlag){
							if(this.storyLineJumpFlag){
								return this.customLightByUserId(3)
							}else{
								return this.customLightByUserId(4)
							}
						}
						this.background.splice(index,1,"#96CDCD");
						this.likabilityArray = []
						this.background.splice(index,1,"")
						this.likabilityFlag = false
						clearTimeout(this.likabilityDelayFunction)
						this.optionTouchendTodo(index)
						//保存有效观看记录
						if(!this.isClickOptionFlag){
							this.statisticsPlayRecord()
							this.isClickOptionFlag = true
						}
						break;
					}
					case 3: {
						if(!this.iscustomLightFlag){
							if(this.storyLineJumpFlag){
								return this.customLightByUserId(3)
							}else{
								return this.customLightByUserId(4)
							}
						}
						this.background.splice(index,1,"#96CDCD");
						this.likabilityArray = []
						this.background.splice(index,1,"")
						this.likabilityFlag = false
						clearTimeout(this.likabilityDelayFunction)
						this.optionTouchendTodo(index)
						//保存有效观看记录
						if(!this.isClickOptionFlag){
							this.statisticsPlayRecord()
							this.isClickOptionFlag = true
						}
						break;
					}
				}
			},
			// 选项touchend事件触发时所做的操作
			optionTouchendTodo(index){
				if(uni.getStorageSync('isEndings') == 1){
					this.multipleResultLine.push(index + 1)
					uni.setStorageSync('multipleResultLine', this.multipleResultLine)
					this.chooseTipsShowFlag = false
					this.chooseTipsMaskFlag = false
					let child = this.childs[index]
					this.initPlayData(child)
				}else{
					let advancedList = this.childs[index].onAdvancedList
					let userScore = uni.getStorageSync('userScore')
					let isNumericalOptions = this.childs[index].isNumberSelect
					if(isNumericalOptions == 1){
						for(let i = 0; i< advancedList.length; i++){
							if(advancedList[i].changeFlag == 1){
								let countSymbol = advancedList[i].change
								let countNumber = advancedList[i].changeValue - 0
								if('+' === countSymbol){
									userScore[i] =  userScore[i] + countNumber
								}else{
									userScore[i] =  userScore[i] - countNumber
								}
							}
							if(advancedList[i].nameDisplay == 1){
								let obj = {
									title: advancedList[i].nameCondition,
									value: userScore[i]
								}
								this.likabilityArray.push(obj)
							}
						}
						this.chooseTipsShowFlag = false
						this.chooseTipsMaskFlag = false
						uni.setStorageSync('userScore', userScore)
						this.initPlayData(this.childs[index])
					}else{
						this.chooseTipsShowFlag = false
						this.chooseTipsMaskFlag = false
						this.initPlayData(this.childs[index])
					}
				}
			},
			/* findmultipleResultChild(){
				for(let i = 0; i < this.childs.length; i++){
					if(this.childs[i].isLink == 1){
						continue;
					}
					return this.childs[i]
				}
			}, */
			//点击选项关闭按钮触发事件
			closeChooseTips(){
				this.chooseTipsShowFlag = false
				this.chooseTipsMaskFlag = false
				this.hiddenBtnFlag = true
				const videoContext = uni.createVideoContext('myVideo')
				videoContext.play()
			},
			//点击故事线关闭按钮触发事件
			closeStoryLineContent(){
				if(uni.getStorageSync('isEndings') == 1){
					this.videoShowFlag = true
				}
				this.storyLineContentFlag = false
				const videoContext = uni.createVideoContext('myVideo')
				videoContext.play()
			},
			//点击举报关闭按钮触发事件
			closeReportContent(){
				this.reportContentFlag = false
				this.items =  [
					{
						value: 1,
						name: '侵犯版权',
						checked: false
					},
					{
						value: 2,
						name: '出现违规内容',
						checked: false
					},
					{
						value: 3,
						name: '其它',
						checked: false
					}
				]
				this.textareaContent = ''
				const videoContext = uni.createVideoContext('myVideo')
				videoContext.play()
			},
			//初始化竖屏canvas画布
			initVerticalCanvas(){
				this.rectArray = []
				const ctx = uni.createCanvasContext('myCanvas')
				// console.log('画布的宽: ',this.canvasWidth)
				// console.log('画布的高: ',this.canvasHeight)
				ctx.clearRect(0 , 0 , this.canvasWidth, this.canvasHeight)
				for(let i = 0; i < this.nodeLocationList.length; i++){
					if(this.nodeLocationList[i].isHide == 1){
						// console.log(1)
						//矩形左上角点的坐标(X,Y)
						//toFixed(0) 四舍五入保留设置的位数 返回一个字符串
						let rectX = parseInt(((this.nodeLocationList[i].textRectX+0)*this.canvasWidth).toFixed(0))
						let rectY = parseInt(((this.nodeLocationList[i].textRectY+0)*this.canvasHeight).toFixed(0))
						// console.log("矩形框横坐标: ",rectX)
						// console.log("矩形框纵坐标: ",rectY)
						//文字距离左右两个边框的间距
						let marginLeftAndRightSides = 8
						//矩形框高度
						let rectH = 30
						// console.log('矩形框的高: ',rectW)
						//字体大小
						let fontSize = 16
						//文字距离矩形框下边框边距
						let marginBottom = 6
						//文本内容
						let textContent = this.option[i]
						// console.log("显示定位选项的内容: ",textContent)
						//测量之前要先确定字体大小 因为矩形宽是根据字体的长度来绘画的 不设置会影响测量
						ctx.setFontSize(fontSize)
						//测量文本宽度
						let metrics = ctx.measureText(textContent)
						//宽度取整 Math.ceil向上取整即省去小数再加1 宽度由文本的宽度加边距组成
						let rectW = parseInt(metrics.width.toFixed(0))+marginLeftAndRightSides
						// console.log('矩形框的宽: ',rectW)
						//末尾小圆圈的横纵坐标 算总长度时应该减去黑边
						let cX = parseInt(((this.nodeLocationList[i].circleX+0)*this.canvasWidth).toFixed(0))
						let cY = parseInt(((this.nodeLocationList[i].circleY+0)*this.canvasHeight).toFixed(0))
						
						//画线 连线到小圆心
						let cr = 2
						ctx.moveTo(cX, cY)
						//校准，因为获取到的矩形框坐标是矩形框的中轴点的坐标，而绘制矩形传入的是左上角的坐标 故需要校正 横纵坐标减去矩形框宽高的一半
						ctx.lineTo(rectX, rectY)
						ctx.setStrokeStyle('white')
						ctx.stroke()
						
						//画末尾小圆圈
						//x,y,r,sAngle（起始弧度,单位弧度（在3点钟方向）），eAngle（终止弧度）counterclockwise可选，默认是false 标识顺时针 
						//让起始点转到12点就需要倒退0.5* Math.PI 但整圆是2 * Math.PI 故终止弧度加0.5* Math.PI
						//外圈
						ctx.beginPath()
						ctx.arc(cX, cY, cr*3, 0, 2 * Math.PI)
						ctx.setFillStyle('#87CEEB')
						ctx.fill()
						//内圈
						ctx.beginPath()
						ctx.arc(cX, cY, cr, 0, 2 * Math.PI)
						ctx.setFillStyle('#E3E3E3')
						ctx.fill()
						
						//画矩形
						//前两个值为左上角起始点坐标x,y，后面两位为矩形宽高 最后一个元素是矩形圆角的像素
						ctx.beginPath()
						let lineWidth = 2
						ctx.lineWidth = lineWidth
						//校准，因为获取到的矩形框坐标是矩形框的中轴点的坐标，而绘制矩形传入的是左上角的坐标 故需要校正 横纵坐标减去矩形框宽高的一半
						// ctx.rect(parseInt((rectX-(rectW/2)).toFixed(0)), parseInt((rectY-(rectH/2)).toFixed(0)), rectW, rectH)
						ctx.rect(parseInt(((this.nodeLocationList[i].textRectX+0)*this.canvasWidth-(rectW/2)).toFixed(0)), 
						parseInt(((this.nodeLocationList[i].textRectY+0)*this.canvasHeight-(rectH/2)).toFixed(0)), rectW, rectH)
						
						//将坐标收纳成对象保存到数组，为绑定事件做准备
						let rect={
							x: parseInt((rectX-(rectW/2)).toFixed(0)),
							y: parseInt((rectY-(rectH/2)).toFixed(0)),
							w: rectW,
							h: rectH
						}
						this.rectArray.push(rect)
						//rgba(255, 255, 255, 0.5)
						if(this.isClickFlag){
							if(this.touchRectNum == i){
									//矩形边框颜色
									ctx.setStrokeStyle('#FFFFFF')
									//矩形填充色
									ctx.setFillStyle('#7E4DAB')
									this.isClickFlag = false
								}else{
									ctx.setStrokeStyle('#FFFFFF')
									ctx.setFillStyle('#7E4DAB')
								}
						}else{
							ctx.setStrokeStyle('#FFFFFF')
							ctx.setFillStyle('#7E4DAB')
						}
						ctx.fill()
						//开始描绘
						ctx.stroke()
						
						// 画皮肤
						ctx.beginPath()
						let imageW= 25
						let	imageH= 30
						ctx.drawImage("../../static/icon/left.png", parseInt((rectX-(rectW/2)).toFixed(0))-imageW+lineWidth/2, 
						parseInt((rectY-(rectH/2)).toFixed(0))-lineWidth/2, imageW, imageH+lineWidth)
						ctx.drawImage("../../static/icon/right.png", parseInt((rectX-(rectW/2)).toFixed(0))+rectW-lineWidth/2, 
						parseInt((rectY-(rectH/2)).toFixed(0))-lineWidth/2, imageW, imageH+lineWidth)
						
						//写字
						//设置字体颜色
						ctx.setFillStyle('white')
						//校准，因为获取到的矩形框坐标是矩形框的中轴点的坐标，而绘制矩形传入的是左上角的坐标 故需要校正 横纵坐标减去矩形框宽高的一半
						let textX = parseInt(((rectX+(marginLeftAndRightSides/2))-(rectW/2)).toFixed(0))
						let textY =  parseInt(((rectH+rectY-marginBottom)-(rectH/2)).toFixed(0))
						ctx.fillText(textContent, textX, textY)
						//开始描绘
						ctx.stroke()
						ctx.draw(true)
					}else{
						// console.log(0)
						//矩形左上角点的坐标(X,Y)
						//rpx转px 故(this.windowWidth)/2 计算总长度时要减去黑边
						let rectOpacity = this.nodeLocationList[i].rectOpacity + 0
						let rectX = parseInt(((this.nodeLocationList[i].textRectX+0)*this.canvasWidth).toFixed(0))
						// console.log('矩形框的x轴坐标: ',rectX)
						let rectY = parseInt(((this.nodeLocationList[i].textRectY+0)*this.canvasHeight).toFixed(0))
						// console.log('矩形框的y轴坐标: ',rectY)
						//矩形框高度
						let rectH = parseInt(((this.nodeLocationList[i].hideHeightScale+0)*this.canvasHeight).toFixed(0))
						// console.log('矩形框的高: ',rectH)
						//矩形框宽度
						let rectW = parseInt(((this.nodeLocationList[i].hideWidthScale+0)*this.canvasWidth).toFixed(0))
						// console.log('矩形框的宽: ',rectW)
						//画矩形
						//前两个值为左上角起始点坐标x,y，后面两位为矩形宽高 最后一个元素是矩形圆角的像素
						ctx.beginPath()
						//校准，因为获取到的矩形框坐标是矩形框的中轴点的坐标，而绘制矩形传入的是左上角的坐标 故需要校正 横纵坐标减去矩形框宽高的一半
						ctx.rect(rectX, rectY, rectW, rectH)
						//将坐标收纳成对象保存到数组，为绑定事件做准备
						let rect={
							x: rectX,
							y: rectY,
							w: rectW,
							h: rectH
						}
						this.rectArray.push(rect)
						if(this.isClickFlag){
							if(this.touchRectNum == i){
									//矩形边框颜色
									ctx.setStrokeStyle('rgba(255, 255, 255,0.1)')
									//矩形填充色
									ctx.setFillStyle('rgba(255, 255, 255,0.1)')
									this.isClickFlag = false
								}else{
									ctx.setStrokeStyle('rgba(255, 255, 255,'+ rectOpacity +')')
									ctx.setFillStyle('rgba(255, 255, 255, '+ rectOpacity +')')
								}
						}else{
							ctx.setStrokeStyle('rgba(255, 255, 255,'+ rectOpacity +')')
							ctx.setFillStyle('rgba(255, 255, 255,'+ rectOpacity +')')
						}
						ctx.fill()
						//开始描绘
						ctx.stroke()
						ctx.draw(true)
					}
				}
			},
			//初始化竖屏canvas画布
			initHorizontalCanvas(){
				this.rectArray = []
				const ctx = uni.createCanvasContext('myCanvas')
				// console.log('画布的宽: ',this.canvasWidth)
				// console.log('画布的高: ',this.canvasHeight)
				ctx.clearRect(0 , 0 , this.canvasWidth, this.canvasHeight)
				for(let i = 0; i < this.nodeLocationList.length; i++){
					if(this.nodeLocationList[i].isHide == 1){
						// console.log(1)
						//矩形左上角点的坐标(X,Y)
						//toFixed(0) 四舍五入保留设置的位数 返回一个字符串
						let rectX = parseInt(((this.nodeLocationList[i].textRectX+0)*this.canvasHeight).toFixed(0))
						let rectY = parseInt(((this.nodeLocationList[i].textRectY+0)*this.canvasWidth).toFixed(0))
						//文字距离左右两个边框的间距
						let marginLeftAndRightSides = 8
						//矩形框高度
						let rectH = 30
						// console.log('矩形框的高: ',rectW)
						//字体大小
						let fontSize = 16
						//文字距离矩形框下边框边距
						let marginBottom = 6
						//文本内容
						let textContent = this.option[i]
						//测量之前要先确定字体大小 因为矩形宽是根据字体的长度来绘画的 不设置会影响测量
						ctx.setFontSize(fontSize)
						//测量文本宽度
						let metrics = ctx.measureText(textContent)
						//宽度取整 Math.ceil向上取整即省去小数再加1 宽度由文本的宽度加边距组成
						let rectW = parseInt(metrics.width.toFixed(0))+marginLeftAndRightSides;
						//末尾小圆圈的横纵坐标 算总长度时应该减去黑边
						let cX = parseInt(((this.nodeLocationList[i].circleX+0)*this.canvasHeight).toFixed(0))
						// console.log('圆点的x轴坐标: ', cX)
						let cY = parseInt(((this.nodeLocationList[i].circleY+0)*this.canvasWidth).toFixed(0))
						// console.log('圆点的y轴坐标: ', cY)
						//画线 连线到小圆心
						let cr = 2
						ctx.moveTo(this.canvasWidth - (cY + 2), cX)
						//校准，因为获取到的矩形框坐标是矩形框的中轴点的坐标，而绘制矩形传入的是左上角的坐标 故需要校正 横纵坐标减去矩形框宽高的一半
						ctx.lineTo(this.canvasWidth - (rectY), rectX)
						ctx.setStrokeStyle('white')
						ctx.stroke()
						
						//画末尾小圆圈
						//x,y,r,sAngle（起始弧度,单位弧度（在3点钟方向）），eAngle（终止弧度）counterclockwise可选，默认是false 标识顺时针 
						//让起始点转到12点就需要倒退0.5* Math.PI 但整圆是2 * Math.PI 故终止弧度加0.5* Math.PI
						//外圈
						ctx.beginPath()
						ctx.arc(this.canvasWidth - (cY + 2), cX, cr*3, 0, 2 * Math.PI)
						ctx.setFillStyle('#87CEEB')
						ctx.fill()
						//内圈
						ctx.beginPath()
						ctx.arc(this.canvasWidth - (cY + 2), cX, cr, 0, 2 * Math.PI)
						ctx.setFillStyle('#E3E3E3')
						ctx.fill()
						
						//画矩形
						//前两个值为左上角起始点坐标x,y，后面两位为矩形宽高 最后一个元素是矩形圆角的像素
						ctx.beginPath()
						let lineWidth = 2
						ctx.lineWidth = lineWidth
						//校准，因为获取到的矩形框坐标是矩形框的中轴点的坐标，而绘制矩形传入的是左上角的坐标 故需要校正 横纵坐标减去矩形框宽高的一半
						ctx.rect(this.canvasWidth - (parseInt((rectY-(rectH/2)).toFixed(0)) + rectH), parseInt((rectX-(rectW/2)).toFixed(0)), rectH, rectW)
						// console.log('矩形框的x轴坐标: ', this.canvasWidth - (parseInt((rectY-(rectH/2)).toFixed(0)) + rectH))
						// console.log('矩形框的y轴坐标: ', parseInt((rectX-(rectW/2)).toFixed(0)))
						//将坐标收纳成对象保存到数组，为绑定事件做准备
						let rect={
							x: this.canvasWidth - (parseInt((rectY-(rectH/2)).toFixed(0)) + rectH),
							y: parseInt((rectX-(rectW/2)).toFixed(0)),
							w: rectH,
							h: rectW
						}
						this.rectArray.push(rect)
						//rgba(255, 255, 255, 0.5)
						if(this.isClickFlag){
							if(this.touchRectNum == i){
									//矩形边框颜色
									ctx.setStrokeStyle('#FFFFFF')
									//矩形填充色
									ctx.setFillStyle('#7E4DAB')
									this.isClickFlag = false
								}else{
									ctx.setStrokeStyle('#FFFFFF')
									ctx.setFillStyle('#7E4DAB')
								}
						}else{
							ctx.setStrokeStyle('#FFFFFF')
							ctx.setFillStyle('#7E4DAB')
						}
						ctx.fill()
						//开始描绘
						ctx.stroke()
						
						// 画皮肤
						ctx.beginPath()
						let imageW= 25
						let	imageH= 30
						ctx.drawImage("../../static/icon/left_deg.png", 
						this.canvasWidth - (parseInt((rectY-(rectH/2)).toFixed(0)) + rectH)-lineWidth/2,
						parseInt((rectX-(rectW/2)).toFixed(0))-imageW+lineWidth/2,
						imageH+lineWidth,
						imageW)
						console.log('皮肤的x轴坐标: ', parseInt((rectX-(rectW/2)).toFixed(0)))
						console.log('皮肤的y轴坐标: ', this.canvasWidth - (parseInt((rectY-(rectH/2)).toFixed(0)) + rectH))
						ctx.drawImage("../../static/icon/right_deg.png",
						this.canvasWidth - (parseInt((rectY-(rectH/2)).toFixed(0)) + rectH)-lineWidth/2,
						parseInt((rectX-(rectW/2)).toFixed(0))+rectW-lineWidth,
						imageH+lineWidth,
						imageW)
						//写字
						//设置字体颜色
						ctx.setFillStyle('white')
						//校准，因为获取到的矩形框坐标是矩形框的中轴点的坐标，而绘制矩形传入的是左上角的坐标 故需要校正 横纵坐标减去矩形框宽高的一半
						/* let textX = parseInt(((this.canvasWidth - (rectY)+(marginLeftAndRightSides/2))-(rectW/2)).toFixed(0))
						console.log('textX: ', textX)
						let textY =  parseInt(((rectH+rectX-marginBottom)-(rectH/2)).toFixed(0))
						console.log('textY: ', textY) */
						ctx .save ();
						ctx.translate(this.canvasWidth - rectY, rectX)
						ctx.rotate ( 90 * Math .PI / 180 )
						ctx.fillText(textContent, -rectW*2/5, rectH/4)//-rectW/2, rectH/4
						ctx.setTextAlign('center')
						ctx.translate( -rectX  , this.canvasWidth - rectY)
						ctx .restore ()
						//开始描绘
						ctx.stroke()
						ctx.draw(true)
					}else{
						// console.log(0)
						//矩形左上角点的坐标(X,Y)
						//rpx转px 故(this.windowWidth)/2 计算总长度时要减去黑边
						let rectOpacity = this.nodeLocationList[i].rectOpacity + 0
						let rectX = parseInt(((this.nodeLocationList[i].textRectX+0)*this.canvasHeight).toFixed(0))
						// console.log('矩形框的x轴坐标: ', rectX)
						let rectY = parseInt(((this.nodeLocationList[i].textRectY+0)*this.canvasWidth).toFixed(0))
						// console.log('矩形框的y轴坐标: ', rectY)
						//矩形框高度
						let rectH = parseInt(((this.nodeLocationList[i].hideHeightScale+0)*this.canvasWidth).toFixed(0))
						// console.log('矩形框的高: ',rectH)
						//矩形框宽度
						let rectW = parseInt(((this.nodeLocationList[i].hideWidthScale+0)*this.canvasHeight).toFixed(0))
						// console.log('矩形框的宽: ',rectW)
						//画矩形
						//前两个值为左上角起始点坐标x,y，后面两位为矩形宽高 最后一个元素是矩形圆角的像素
						ctx.beginPath()
						//校准，因为获取到的矩形框坐标是矩形框的中轴点的坐标，而绘制矩形传入的是左上角的坐标 故需要校正 横纵坐标减去矩形框宽高的一半
						ctx.rect(this.canvasWidth -(rectY+rectH), rectX, rectH, rectW)
						//将坐标收纳成对象保存到数组，为绑定事件做准备
						let rect={
							x: this.canvasWidth -(rectY+rectH),
							y: rectX,
							w: rectH,
							h: rectW
						}
						this.rectArray.push(rect)
						if(this.isClickFlag){
							if(this.touchRectNum == i){
									//矩形边框颜色
									ctx.setStrokeStyle('rgba(255, 255, 255,0.1)')
									//矩形填充色
									ctx.setFillStyle('rgba(255, 255, 255,0.1)')
									this.isClickFlag = false
								}else{
									ctx.setStrokeStyle('rgba(255, 255, 255,'+ rectOpacity +')')
									ctx.setFillStyle('rgba(255, 255, 255, '+ rectOpacity +')')
								}
						}else{
							ctx.setStrokeStyle('rgba(255, 255, 255,'+ rectOpacity +')')
							ctx.setFillStyle('rgba(255, 255, 255,'+ rectOpacity +')')
						}
						ctx.fill()
						//开始描绘
						ctx.stroke()
						ctx.draw(true)
					}
				}
			},
			// 绘制圆角矩形方法 (x,y):圆角矩形起始坐标; width: 矩形宽度; height: 矩形高度; r: 矩形圆角;
			drawRect(ctx, x, y, width, height, r){
				ctx.beginPath();
				ctx.moveTo(x + r, y);
				ctx.lineTo(x + width - r, y);
				ctx.arc(x + width - r, y + r, r, Math.PI*1.5, Math.PI*2);
				ctx.lineTo(x + width, y + height - r);
				ctx.arc(x + width - r, y + height - r, r, 0, Math.PI*0.5);
				ctx.lineTo(x + r, y + height);
				ctx.arc(x + r, y + height - r, r, Math.PI*0.5, Math.PI);
				ctx.lineTo(x, y + r);
				ctx.arc(x + r, y + r, r, Math.PI, Math.PI*1.5);
			},
			// canvas中计算控制文本换行方法
			drawText(t,x,y,w){
				//参数t是文本 w是屏幕宽度,
				var chr = t.split("");
				var temp = "";
				var row = [];
				
				context.font = "20px Arial";
				context.fillStyle = "black";
				context.textBaseline = "middle";
				
				for(var a = 0; a < chr.length; a++){
					if( context.measureText(temp).width > w ){
						row.push(temp);
						temp = "";
					}
					temp += chr[a];
				}
				
				row.push(temp);
				
				for(var b = 0; b < row.length; b++){
					context.fillText(row[b],x,y+(b+1)*20);
				}
			},
			// canvas的touchStart事件
			getTouchPosition(e){
				//之后写入for循环中
				if(this.rectArray.length != 0){
					for(let i = 0; i<this.nodeLocationList.length; i++){
						let touchX = e.changedTouches[0].x;
						let touchY = e.changedTouches[0].y;
						// console.log('touchY: ',touchY)
						let xLowLimit = this.rectArray[i].x;
						// console.log('x轴起始点: ',xLowLimit)
						let yLowLimit = this.rectArray[i].y;
						// console.log('y轴起始点: ',yLowLimit)
						let xUpperLimit = this.rectArray[i].x+this.rectArray[i].w;
						// console.log('x轴终点: ',xUpperLimit)
						let yUpperLimit = this.rectArray[i].y+this.rectArray[i].h;
						// console.log('y轴终点: ',yUpperLimit)
						if(touchX > xLowLimit && touchX < xUpperLimit && touchY > yLowLimit && touchY < yUpperLimit){
							this.touchRectNum = i;
							// console.log('this.touchRectNum: '+this.touchRectNum)
						}
					}
					if(this.touchRectNum < 4){
						this.isClickFlag = true
						if(uni.getStorageSync('playMode') == 1){
							this.initHorizontalCanvas()
						}else{
							this.initVerticalCanvas();
						}
					}
				}
			},
			// canvas的touchEnd事件
			canvasTouchendEvent(){
				// console.log('this.touchRectNum: '+this.touchRectNum)
				if(this.touchRectNum == 0){
					if(!this.iscustomLightFlag){
						if(this.storyLineJumpFlag){
							return this.customLightByUserId(3)
						}else{
							return this.customLightByUserId(4)
						}
					}
					this.likabilityArray = []
					clearTimeout(this.likabilityDelayFunction)
					this.canvasTouchendEventTodo()
					this.screenshotShowFlag = false
					this.videoShowFlag = true
					this.likabilityFlag = false
					//保存有效观看记录
					if(!this.isClickOptionFlag){
						this.statisticsPlayRecord()
						this.isClickOptionFlag = true
					}
				}else if(this.touchRectNum == 1){
					if(!this.iscustomLightFlag){
						if(this.storyLineJumpFlag){
							return this.customLightByUserId(3)
						}else{
							return this.customLightByUserId(4)
						}
					}
					this.likabilityArray = []
					clearTimeout(this.likabilityDelayFunction)
					this.canvasTouchendEventTodo()
					this.screenshotShowFlag = false
					this.videoShowFlag = true
					this.likabilityFlag = false
					//保存有效观看记录
					if(!this.isClickOptionFlag){
						this.statisticsPlayRecord()
						this.isClickOptionFlag = true
					}
				}else if(this.touchRectNum == 2){
					if(!this.iscustomLightFlag){
						if(this.storyLineJumpFlag){
							return this.customLightByUserId(3)
						}else{
							return this.customLightByUserId(4)
						}
					}
					this.likabilityArray = []
					clearTimeout(this.likabilityDelayFunction)
					this.canvasTouchendEventTodo()
					this.screenshotShowFlag = false
					this.videoShowFlag = true
					this.likabilityFlag = false
					//保存有效观看记录
					if(!this.isClickOptionFlag){
						this.statisticsPlayRecord()
						this.isClickOptionFlag = true
					}
				}else if(this.touchRectNum == 3){
					if(!this.iscustomLightFlag){
						if(this.storyLineJumpFlag){
							return this.customLightByUserId(3)
						}else{
							return this.customLightByUserId(4)
						}
					}
					this.likabilityArray = []
					clearTimeout(this.likabilityDelayFunction)
					this.canvasTouchendEventTodo()
					this.screenshotShowFlag = false
					this.videoShowFlag = true
					this.likabilityFlag = false
					//保存有效观看记录
					if(!this.isClickOptionFlag){
						this.statisticsPlayRecord()
						this.isClickOptionFlag = true
					}
				}
				//回到默认值
				this.touchRectNum = 5
			},
			// canvas的touchEnd事件触发时的操作
			canvasTouchendEventTodo(){
				if(uni.getStorageSync('isEndings') == 1){
					this.multipleResultLine.push(this.touchRectNum + 1)
					uni.setStorageSync('multipleResultLine', this.multipleResultLine)
					this.showCanvasFlag = false
					let child = this.childs[this.touchRectNum]
					this.initPlayData(child)
				}else{
					let advancedList = this.childs[this.touchRectNum].onAdvancedList
					let userScore = uni.getStorageSync('userScore')
					let isNumericalOptions = this.childs[this.touchRectNum].isNumberSelect
					if(isNumericalOptions == 1){
						for(let i = 0; i< advancedList.length; i++){
							if(advancedList[i].changeFlag == 1){
								let countSymbol = advancedList[i].change
								let countNumber = advancedList[i].changeValue - 0
								if('+' === countSymbol){
									userScore[i] =  userScore[i] + countNumber
								}else{
									userScore[i] =  userScore[i] - countNumber
								}
							}
							if(advancedList[i].nameDisplay == 1){
								let obj = {
									title: advancedList[i].nameCondition,
									value: userScore[i]
								}
								this.likabilityArray.push(obj)
							}
						}
						this.showCanvasFlag = false
						uni.setStorageSync('userScore', userScore)
						this.initPlayData(this.childs[this.touchRectNum])
					}else{
						this.showCanvasFlag = false
						this.initPlayData(this.childs[this.touchRectNum])
					}
				}
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
			},
			// 深拷贝 方法
			deepCopy(o) {
				return JSON.parse(JSON.stringify(o))
			},
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
			loadeddata(e){
				this.duration = e.detail.duration
				let date = this.formatDate(this.duration)
				this.durationStr = date
				//判断是不是故事线跳转过来的第一个视频 第一个视频需要快进到结尾进行播放
				if(this.isPlayedFlag){
					const videoContext = uni.createVideoContext('myVideo')
					videoContext.seek(parseInt((this.duration-3).toFixed(0)))
					this.isPlayedFlag = false
				}
				//加载完成将入场loading关闭
				this.videoloadFlag = false
				//展示故事线和举报
				this.hiddenBtnFlag = true
				//展示好感度
				this.likabilityFlag = true
				//视频清除延时
				this.likabilityDelayFunction= setTimeout(()=>{
					this.likabilityFlag = false
				},5000)
				uni.setStorageSync('videoSize',{
					videoHeight: e.detail.height,
					videoWidth: e.detail.width
				})
				//加载完视频加载视频的尺寸
				if(uni.getStorageSync('playMode') == 1){
					this.playMode = 1
					this.transform = 'translate(-50%, -50%) rotateZ(90deg)'
					this.showStyleFlag = false
					this.validateHorizontalWindowSize()
					this.playGestureFlag = false
					this.progressGestureFlag = false
					clearTimeout(this.horizontalControlsFunction)
					this.horizontalControlsFlags = true
					this.horizontalControlsFunction	= setTimeout(()=>{
						this.horizontalControlsFlags = false
					},5000)
					this.storyLineFlag = false
				}else{
					this.controlsFlag = true
					this.horizontalControlsFlags = false
					this.validateVerticalWindowSize()
				}
				//初始画布必须等到选项数据先初始化完才能进行
				if(this.isPosition == 1){
					//初始化画布
					if(uni.getStorageSync('playMode') == 1){
						this.initHorizontalCanvas()
					}else{
						this.initVerticalCanvas();
					}
				}
			},
			videoTimeupdate(e){
				//获取视频当前时间
				this.currentTime = e.detail.currentTime
				//获取视频当前时间
				if(this.duration -this.currentTime > 0.4){
					this.percent = parseInt(this.currentTime/this.duration*100)
				}else{
					this.percent = 100
				}
			},
			formatDate(date){
				let hour = (parseInt(date/3600)+'').length == 1 ? '0' + parseInt(date/3600) : parseInt(date/3600)
				let minute = (parseInt(date/60)+'').length == 1 ? '0'+ parseInt(date/60) : parseInt(date/60)
				let second = (parseInt(date%60)+'').length == 1 ? '0'+ parseInt(date%60) : parseInt(date%60)
				return hour+":"+minute+":"+second
			},
			replayVideo(){
				if(!this.suspendFlag){
					const videoContext = uni.createVideoContext('myVideo')
					videoContext.seek(0)
					this.progressBoxTouchEnd()
				}
			},
			jumpbackVideo(){
				if(!this.suspendFlag){
					const videoContext = uni.createVideoContext('myVideo')
					let currentTime = this.deepCopy(this.currentTime)
					let targetPlayTime = currentTime - this.duration * 0.15
					if(targetPlayTime < 0){
						videoContext.seek(0)
					}else{
						videoContext.seek(parseInt(targetPlayTime))
					}
					this.progressBoxTouchEnd()
				}
			},
			suspendVideo(){
				const videoContext = uni.createVideoContext('myVideo')
				videoContext.pause()
				this.suspendFlag = true
				this.progressBoxTouchEnd()
			},
			playVideo(){
				const videoContext = uni.createVideoContext('myVideo')
				videoContext.play()
				this.suspendFlag = false
				this.progressBoxTouchEnd()
			},
			jumpForwardVideo(){
				if(!this.suspendFlag){
					const videoContext = uni.createVideoContext('myVideo')
					let currentTime = this.deepCopy(this.currentTime)
					let targetPlayTime = currentTime + this.duration * 0.15
					if(targetPlayTime > parseInt(this.duration - 1)){
						videoContext.seek(parseInt(this.duration - 1))
					}else{
						videoContext.seek(parseInt(targetPlayTime))
					}
					this.progressBoxTouchEnd()
				}
			},
			endVideo(){
				if(!this.suspendFlag){
					const videoContext = uni.createVideoContext('myVideo')
					videoContext.seek(parseInt(this.duration-1))
					this.progressBoxTouchEnd()
				}
			},
			videoTouchstart(e){
				this.tsx = e.changedTouches[0].clientX
				this.tsy = e.changedTouches[0].clientY
			},
			videoTouchend(e){
				if(uni.getStorageSync('playMode') == 1){
					clearTimeout(this.horizontalControlsFunction)
					this.horizontalControlsFlags = !this.horizontalControlsFlags
					this.horizontalControlsFunction	= setTimeout(()=>{
						this.horizontalControlsFlags = false
					},5000)
				}
			},
			progressBoxTouchEnd(){
				clearTimeout(this.horizontalControlsFunction)
				this.horizontalControlsFlags = true
				this.horizontalControlsFunction	= setTimeout(()=>{
					this.horizontalControlsFlags = false
				},5000)
			},
			//提交举报
			async submit(){
				if(!this.reportType){
					return uni.showToast({
						icon: 'none',
						title: '请选择举报类型'
					})
				}
				const regPhone = /([\u4e00-\u9fa5]|[\（\）\《\》\——\；\，\。\“\”\<\>\！\？]){8}/.test(this.textareaContent);
				if(!regPhone){
					return uni.showToast({
						icon: 'none',
						title: '请填写举报内容，不少于8个字'
					})
				}
				await uni.request ({
					url: baseURL + "/wxPlay/savaReportInfo",
					method: 'POST',
					dataType: 'json',
					data: {
						imgUrl: this.headImage,
						content: this.textareaContent,
						reportStatue: this.reportType,
						fkUserid: uni.getStorageSync("userId"),
						fkArtworkNodeId: uni.getStorageSync("detailId"),
						fkArtworkId: this.artworkId
					},
					success: res=> {
						if(res.data.status == 200){
							uni.showToast({
								icon: 'none',
								title: "举报成功,待管理员审核",
								position: 'center'
							})
							this.reportContentFlag = false
							//举报提交之后接着播放
							const videoContext = uni.createVideoContext('myVideo')
							videoContext.play()
							this.items =  [
								{
									value: 1,
									name: '侵犯版权',
									checked: false
								},
								{
									value: 2,
									name: '出现违规内容',
									checked: false
								},
								{
									value: 3,
									name: '其它',
									checked: false
								}
							]
							this.textareaContent = ''
						}
					}
				})
			},
			//举报页面复选框
			checkboxChange(e) {
				var items = this.items,
				values = e.detail.value;
				//那用户最后点击的那个checkbox 实现单选
				const value = values[values.length-1];
				//避免用户单次数的点击导致values为空
				if(!value){return;}
				for (var i = 0, lenI = items.length; i < lenI; ++i) {
					const item = items[i]
					if(value.includes(item.value)){
						this.$set(item,'checked',true)
						this.reportType = item.value;
					}else{
						this.$set(item,'checked',false)
					}
				}
			},
			// 举报页面上传截图到腾讯云
			uploadImage(){
				var COS = require('cos-wx-sdk-v5');
				let that = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['original'],
					sourceType: ['album','camera'],
					success: res=> {
						//显示上传loading
						uni.showLoading({
						    title: '加载中',
							mask: true
						});
						uni.request ({
							url: baseURL + "/artworkMaking/findCosSingature",
							method: 'POST',
							success: result=> {
								// console.log(JSON.parse(res.data.data))
								const data = JSON.parse(result.data.data);
								// 创建COS实例  获取签名
								const cos = new COS({
									// 必选参数
									getAuthorization: (options, callback) => {
									  const obj = {
										TmpSecretId: data.credentials.tmpSecretId,
										TmpSecretKey: data.credentials.tmpSecretKey,
										XCosSecurityToken: data.credentials.sessionToken,
										StartTime: data.startTime, // 时间戳，单位秒，如：1580000000
										ExpiredTime: data.expiredTime // 时间戳，单位秒，如：1580000900
									  }
									  callback(obj)
									}
								});
								//获取文件路径
								let filePath = res.tempFilePaths[0];
								//这里指定上传的文件名
								let Key = filePath.substr(filePath.lastIndexOf('/')+1);
								let dateObj = new Date();
								let timestamp = dateObj.getTime();
								let nowDate = dateObj.toLocaleDateString();
								//格式斜杠日期
								let formatDate = nowDate.replace(/\//g,'-');
								//cos上定义目录
								let newKey = formatDate +'/'+timestamp+Key;
								let tempObj = {};
								tempObj.imgLocation = 'https://' + 'sike-1259692143'+'.cos.' + 'ap-chongqing' + '.myqcloud.com/'+newKey;//返回上传的绝对 URL
								//SDK 提供的cos上传函数，如果想批量上传，可以在这里加上for循环。
								cos.postObject({
									//存储桶名称
									Bucket:'sike-1259692143',
									//地域名字
									Region:'ap-chongqing',
									Key:newKey,
									//本地文件临时地址
									FilePath:filePath,
								},function(err,data){
									if(err){
									   wx.showModal({
										  title:'返回错误',
										  content:'请求失败'+err,
										  showCancel:false
									   })
									}else{
									   if(data){
										  // 这里是返回的图片URL
										  that.headImage = data.headers.Location;
										  //上传结束关闭上传loading
										  uni.hideLoading();
										  uni.showToast({
											icon: 'none',
										  	title: '上传成功'
										  })
										  that.uploadBtnFlag = false;
										  that.uploadImageFlag = true;
									   }
									}
								})
							},
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" >
	.playBox{
		width: 100%;
		height: 100%;
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
					left: 0;
					top: 10%;
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
					left: 54%;
					top: 22%;
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
			}
			.horizontalBox{
				.storyLineBox{
					position: fixed;
					right: 0;
					top: 70%;
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
					top: 80%;
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
					top: 90%;
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
