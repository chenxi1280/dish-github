<template>
	<view class="playBox">
		<!-- 入场loading -->
		<view v-if="videoloadFlag" class="videoLoadImageBox" style="z-index: 999;">
			<!-- <view style="position: absolute;text-align: center;width: 100%;font-size: 40rpx;top: 40%;color: #fff;">Tips :</view> -->
			<view style="white-space: pre-line;position: absolute;left: 50%; top: 50%;transform: translate(-50%, -50%);color: #fff;font-size: 40rpx;width: 750rpx;text-align: center;line-height: 60rpx;">{{tipsText}}</view>
			<image src="https://sike-1259692143.cos.ap-chongqing.myqcloud.com/baseImg/1609384346693loading2.gif"></image>
		</view>
		<view v-if="!playMode" :style="{transform: transform, position: 'fixed', left: '160rpx', top:'40rpx',zIndex: '9'}">
			<Advertising ref="verticalAdvertising" isCustom @customAddEvent="showDialog" @customConfirmEvent="openAdvertising"
			 @customCloseEvent="closeDialog" :lightNumber="lightNumber" :ecmUserLightUpLimit="ecmUserLightUpLimit"></Advertising>
		</view>

		<view v-if="playMode" :style="{transform: transform, position: 'fixed', right: '-200rpx', top:'140rpx', zIndex: '9'}">
			<Advertising ref="horizontalAdvertising" isCustom @customAddEvent="showDialog" @customConfirmEvent="openAdvertising"
			 @customCloseEvent="closeDialog" :lightNumber="lightNumber" :ecmUserLightUpLimit="ecmUserLightUpLimit"></Advertising>
		</view>
		<!-- 确认观看激励视频广告的弹窗 -->
		<view v-if="playMode">
			<u-modal v-model="showAdvertisingFlag" title="温馨提示" :show-confirm-button="false" z-index="999">
				<view class="slot-content">
					<view style="padding: 0 20rpx;padding-top: 40rpx;">
						<view v-if="isHaveLight">观看作品过程中会消耗光，完整观看激励视频可以获得{{rewardLight}}个光的奖励哦</view>
						<view v-if="!isHaveLight">当前光的数量不足，完整观看激励视频可以获得{{rewardLight}}个光的奖励哦</view>
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
						<view v-if="isHaveLight">观看作品过程中会消耗光，完整观看激励视频可以获得{{rewardLight}}个光的奖励哦</view>
						<view v-if="!isHaveLight">当前光的数量不足，完整观看激励视频可以获得{{rewardLight}}个光的奖励哦</view>
						<view @click="openAdvertising" style="padding: 20rpx;background-color: #985ba9;width: 400rpx;margin-left: calc(50% - 200rpx); margin-top: 60rpx;text-align: center;border-radius: 10rpx;margin-bottom: 40rpx;">
							<image src="../../static/icon/showVideo.png" style="width: 40rpx;height: 40rpx;display: inline-block;transform: translateY(4rpx);"></image>
							<view style="display: inline-block;margin-left: 10rpx;color: #fff;transform: translateY(-4rpx);">立即获取</view>
						</view>
						<view @click="closeDialog" style="position: absolute;right: 20rpx; top: 20rpx;width: 40rpx;height: 40rpx;text-align: center;line-height: 40rpx;font-size: 40rpx;">x</view>
					</view>
				</view>
			</u-modal>
		</view>

		<view >
			<u-modal v-model="showConditionAdvertisingFlag" title="温馨提示" :show-confirm-button="false" z-index="999">
				<view class="slot-content">
					<view style="padding: 0 20rpx;padding-top: 40rpx;">
						<view >此选项作者设置必须观看激励视频才能播放哦</view>
						<!-- <view v-if="!isHaveLight">当前光的数量不足，完整观看激励视频可以获得{{rewardLight}}个光的奖励哦</view> -->
						<view @click="openAdvertising" style="padding: 20rpx;background-color: #985ba9;width: 400rpx;margin-left: calc(50% - 200rpx); margin-top: 60rpx;text-align: center;border-radius: 10rpx;margin-bottom: 40rpx;">
							<image src="../../static/icon/showVideo.png" style="width: 40rpx;height: 40rpx;display: inline-block;transform: translateY(4rpx);"></image>
							<view style="display: inline-block;margin-left: 10rpx;color: #fff;transform: translateY(-4rpx);">立即观看</view>
						</view>
						<view @click="closeConditionDialog" style="position: absolute;right: 20rpx; top: 20rpx;width: 40rpx;height: 40rpx;text-align: center;line-height: 40rpx;font-size: 40rpx;">x</view>
					</view>
				</view>
			</u-modal>
		</view>

		<view class="play" :style="{'width': mobilePhoneWidth+'px', 'height': mobilePhoneHeight+'px'}">
			<!-- 定位选项画布 -->
			<view class="container" v-show="showCanvasFlag" :style="{'width': canvasWidth+'px', 'height': canvasHeight+'px'}">
				<canvas canvas-id="myCanvas" @touchstart="getTouchPosition" @touchend="canvasTouchendEvent"></canvas>
			</view>
			<view class="container" v-show="showBuoyCanvasFlag" :style="{'width': canvasWidth+'px', 'height': canvasHeight+'px'}">
				<canvas type="2d" id='posterCanvas' @touchstart="canvasBuoyTouchstart"></canvas>
			</view>
			<!-- 播放主体   @click="showButton" @timeupdate="videoTimeupdate" -->
			<view class="videoBox" :style="{'width': videoWidth+'px', 'height': videoHeight+'px', 'transform': transform}">
				<video :src="videoUrl" :autoplay="autopalyFlag" :show-mute-btn="true" :show-fullscreen-btn="false" id="myVideo"
				 :enable-play-gesture="playGestureFlag" :enable-progress-gesture="progressGestureFlag" @ended="videoEnd(false)"
				 @pause="videoPause" @loadedmetadata="loadeddata" @touchend="videoTouchend" @touchstart="videoTouchstart" v-if="videoShowFlag"
				 @timeupdate="videoTimeupdate" :controls="controlsFlag" @play="videoPlay" @waiting="waitingVideo"></video>
				<!-- 视频播放结束触发事件显示最后一帧截图 -->
				<view v-if="screenshotShowFlag" class="screenshot" :style="{backgroundImage: 'url(' + imageSrc + ')',
				'background-repeat':'no-repeat', backgroundSize:'100% 100%'}"></view>
			</view>
			<!-- 普通选项 -->
			<view class="chooseTipsMask15" v-if="chooseTipsMaskFlag">
				<view class="chooseTipsMask16" v-if="chooseTipsShowFlag" :style="{'transform': transform}">
					<view class="chooseTips">
						<view class="tips" v-for="(item, index) in tipsArray" :key="index">
							<view class="optionBox" @touchstart="changeBackground(index)" @touchend="rebackBackground(index)" :style="{'background': background[index]}">
								<view class="option" style="text-align: center;" v-if="!conditionState[index]">
									<text>{{option[index]}}</text>
								</view>
								<view class="option" style="text-align: center;" v-if="conditionState[index]">
									<text>{{option[index]}}</text>
									<view class="iconBox">
										<icon></icon>
										<text>广告解锁</text>
									</view>
								</view>
							</view>
						</view>
						<view class="video_rebroadcast" @click="closeChooseTips(false)">
							<img src="/static/icon/replay.png">
						</view>
					</view>
				</view>
			</view>
			<!-- 好感度 -->
			<view :style="showStyleFlag?'display: block':'display: none'" class="verticalLikabilityBox">
				<view class="likabilityTips" v-if="likabilityFlag" style="pointer-events: none;">
					<view class="lbtips" v-for="(item, index) in likabilityArray" :key="index">
						<view class="likabilityBox">
							<view class="likability">{{likabilityArray[index].title}}{{' : '}}{{likabilityArray[index].value}}</view>
						</view>
					</view>
				</view>
			</view>
			<view :style="!showStyleFlag?'display: block':'display: none'" class="horizontalLikabilityBox">
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
			<!-- 竖屏 -->
			<view v-if="hiddenBtnFlag" :style="showStyleFlag?'display: block':'display: none'" class="verticalBox">
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
				<view class="returnToPreviousBox" @click="returnToPrevious">
					<view class="returnToPreviousIconBox">
						<icon class="returnToPreviousIcon"></icon>
					</view>
					<view class="returnToPrevious">返回上级</view>
				</view>
			</view>
			<!-- 横屏 -->
			<view v-if="hiddenBtnFlag" :style="!showStyleFlag?'display: block':'display: none'" class="horizontalBox">
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
				<view class="returnToPreviousBox" @click="returnToPrevious">
					<view class="returnToPreviousIconBox">
						<icon class="returnToPreviousIcon"></icon>
					</view>
					<view class="returnToPrevious">返回上级</view>
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
						<horizontalStoryLine :pkArtworkId="artworkId" :pkDetailIds="playedHistoryArray" @goPlay="storyLineJumpPlayTodo"
						 v-if="!storyLineFlag"></horizontalStoryLine>
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
		<u-modal v-model="multipleResultAdvertiseShow" title="温馨提示" :show-confirm-button="false" z-index="999">
			<view class="slot-content">
				<view style="padding: 0 20rpx;padding-top: 40rpx;">
					<view style="text-align: center;">
						<view >结果正在分析中</view>
						<view >完整观看激励视频,免费查看结果</view>
					</view>
					<view @click="goAdvertisement" style="padding: 20rpx;background-color: #985ba9;width: 400rpx;margin-left: calc(50% - 200rpx); margin-top: 60rpx;text-align: center;border-radius: 10rpx;margin-bottom: 40rpx;">
						<image src="../../static/icon/showVideo.png" style="width: 40rpx;height: 40rpx;display: inline-block;transform: translateY(4rpx);"></image>
						<view style="display: inline-block;margin-left: 10rpx;color: #fff;transform: translateY(-4rpx);">查看结果</view>
					</view>
				</view>
			</view>
		</u-modal>
		<u-modal v-model="returnToPreviouShow" title="温馨提示" :show-confirm-button="false" z-index="999">
			<view class="slot-content">
				<view style="padding: 0 20rpx;padding-top: 40rpx;">
					<view style="text-align: center;">
						<view >别点了，真的回不去了</view>
					</view>
					<view @click="returnToPreviouConfirm" style="padding: 20rpx;background-color: #985ba9;width: 400rpx;margin-left: calc(50% - 200rpx); margin-top: 60rpx;text-align: center;border-radius: 10rpx;margin-bottom: 40rpx;">
						<view style="display: inline-block;margin-left: 10rpx;color: #fff;transform: translateY(-4rpx);">确定</view>
					</view>
				</view>
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
		<view v-if="verticalJumpDialogFlag">
			<vertical-jump-dialog :imageUrl="popupImageUrl" :navigatorUrl="navigatorUrl" :appId="appId" :artworkId="artworkId"
			:popupPosition="popupPosition" v-on:videoEnd="videoEnd" v-on:initPlayData="initPlayData" :artworkTree="artworkTree"
			ref="verticalJumpDialog" v-on:multipleResultCallbackTodo="multipleResultCallbackTodo" >
			</vertical-jump-dialog>
		</view>
		<view v-if="horizontalJumpDialogFlag">
			<horizontal-jump-dialog :imageUrl="popupImageUrl" :navigatorUrl="navigatorUrl" :appId="appId" :artworkId="artworkId"
			:popupPosition="popupPosition" v-on:videoEnd="videoEnd" v-on:initPlayData="initPlayData" :artworkTree="artworkTree"
			ref="horizontalJumpDialog" v-on:multipleResultCallbackTodo="multipleResultCallbackTodo">
			</horizontal-jump-dialog>
		</view>
		<view v-if="popupNameState && popupTotalNumber > 0 ? true : false">
			<view class="verticalPopupNameBox" v-if="!playMode">
				<text>{{popupName+": "+popupCountNumber+"/"+popupTotalNumber}}</text>
			</view>
			<view class="horizontalPopupNameBox" v-if="playMode">
				<text>{{popupName+": "+popupCountNumber+"/"+popupTotalNumber}}</text>
			</view>
		</view>
		<!-- 多结局作品结局视频播放前弹窗背景不符合需求用蒙版挡起来 -->
		<view v-if="multipleResultFlag" :style="{'width': videoWidth+'px', 'height': videoHeight+'px', 'transform': transform}" class="multipleResultPlayEndMask">
		</view>
		<!-- 竖屏选项百分比 -->
		<view class="verticalOptionPercentagesBox" v-if="verticalOptionPercentageFlag" style="pointer-events: none;">
			<view class="optionPercentages" v-for="(item, index) in optionPercentageNames" :key="index">
				<view class="optionPercentageBox">
					<view class="optionPercentage">{{optionPercentageNames[index]}}{{' : '}}{{optionPercentageValues[index]}}{{'%'}}</view>
				</view>
			</view>
		</view>
		<!-- 横屏选项百分比 -->
		<view class="horizontalOptionPercentagesBox" v-if="horizontalOptionPercentageFlag" style="pointer-events: none;">
			<view class="optionPercentages" v-for="(item, index) in optionPercentageNames" :key="index">
				<view class="optionPercentageBox">
					<view class="optionPercentage">{{optionPercentageNames[index]}}{{' : '}}{{optionPercentageValues[index]}}{{'%'}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { baseURL } from '../login/config/config.js'
	import storyLine from './storyLine/storyLine.vue'
	import {horizontalStoryLine} from './storyLine/horizontalStoryLine.vue'
	import Advertising from '../../components/Advertising/Advertising.vue'
	import {globalBus} from '../../common/js/util.js'
	import {verticalJumpDialog} from '../../components/dialog/verticalJumpDialog.vue'
	import {horizontalJumpDialog} from '../../components/dialog/horizontalJumpDialog.vue'

	export default {
		components:{
			storyLine,
			horizontalStoryLine,
			Advertising,
			verticalJumpDialog,
			horizontalJumpDialog
		},
		data() {
			return {
				//用户身份唯一识别符
				token: null,
				// 是否有光
				isHaveLight: true,
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
				//选项最底层蒙板开关
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
				//普通选项下标
				optionIndex: 5,
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
				showAdvertisingFlag: false,
				// 光数量
				lightNumber: 0,
				// 光上限
				ecmUserLightUpLimit: 0,
				tips: [
					'Tips : \n\n人生的选择不能重做，\n还好互动视频可以。',
					'Tips : \n\n如果你做出了错误的选择，\n点击“换个选择”，\n可以再选一次。',
					'Tips : \n\n如果你想更改选择，\n点击“换个选择”，\n可以回顾你的所有选择。',
					'Tips : \n\n如果作品让你感觉不适，\n点击“投诉”，\n可以把情况反馈给我们。',
					'Tips : \n\n点击“观看更多”，\n或者去发现页面，\n都可以看到更多好看的互动视频。',
					'Tips : \n\n竖屏观看时，\n手指在屏幕任意位置拖动，\n就可以调整播放进度。',
					'Tips : \n\n横屏观看时，\n点击底部控制器上的圈15，\n可以向前后跳跃视频时长的15%。',
					'Tips : \n\n横屏观看时，\n点击底部控制器上的快进首尾，\n可以直接回到视频的开始或结尾。',
					'Tips : \n\n点击按钮或者其他可以互动的元素，\n可以操作剧情按照你的意思发展。',
					'Tips : \n\n点击右上角的省略号，\n可以和你的朋友一起玩耍。',
					'Tips : \n\n光是希望的凝结，\n消耗光，\n可以更改你的选择。',
					'Tips : \n\n获得光的最好方式，\n是跟随指引。',
					'Tips : \n\n制作互动视频，\n请登录ivetool.com。',
					'Tips : \n\n联系我们，\n请搜索灵巫互动公众号，\n使用底部菜单或留言。'
				],
				tipsText: '',
				rewardLight: 0,
				//视频是否播放结束的开关
				isVideoEndFlag: false,
				videoContext: null,
				//举报页面复选框的内容
				checkBoxValue: null,
				//条件选项标志的数组
				conditionState: [],
				//用户自定义弹窗的图片路径
				popupImageUrl: 'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/baseImg/1605600100857%E5%9C%86%E5%BD%A2%E7%94%A8JPG.jpg',
				//用户自定弹窗的跳转路径
				navigatorUrl: 'pages/dishover/dishover',//'pages/index/index'
				//跳转到的目标小程序的appId
				appId: "wxa001a9842ad0f851",//'wx25e1eb19e2d9e715'
				//弹窗出现位置的标志
				popupPosition: 0,//展示在视频开始
				//弹窗是否展示名称
				popupName: null,
				//弹窗名称是否展示开关
				popupNameState: 0,
				//弹窗是否启用
				popupState: 0,
				//弹出内容的标志
				popupContextState: 1,//1图片 2图片链接加地址
				//播放的作品的弹窗总数
				popupTotalNumber: 0,
				//播放作品的弹窗设置
				popupSettings: {},
				//竖屏弹窗开关
				verticalJumpDialogFlag: false,
				//横屏弹窗开关
				horizontalJumpDialogFlag: false,
				//关闭弹窗时需要传回当前树
				artworkTree: null,
				//统计用户当前作品触发弹窗的次数
				popupCountNumber: 0,
				//弹窗弹出的历史记录
				popupRecord: {},
				//获取多结局作品开关
				isGetMultipleFlag: false,
				//多结局查看广告的弹窗
				multipleResultAdvertiseShow: false,
				//重播标志
				isReplayPopupWindow: false,
				//多结局结局视频标志
				isMultipleResultPlayEnd: false,
				//多结局作品的最后一个视频的前一个视频的蒙板
				multipleResultFlag: false,
				//选项百分比名称
				optionPercentageNames: [],
				//竖屏选项百分比开关
				verticalOptionPercentageFlag: false,
				//横屏选项百分比开关
				horizontalOptionPercentageFlag: false,
				//百分比延时函数
				optionPercentageFunction: Function,
				//选项百分比的值
				optionPercentageValues: [],
				// 浮标
				// 后台数据
				ecmArtworkNodeBuoyList:[],
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
				// 是否为 浮标视频
				bouyNodeFlage:false,
				waitingVideoFlag: false,
				// 故事线位置
				storyLineBoxWidthMax: 0,
				storyLineBoxHeightMin: 0,
				storyLineBoxWidthMin : 0,
				storyLineBoxHeightMax : 0,
				// 举报位置
				reportBoxWidthMin: 0,
				reportBoxWidthMax: 0,
				reportBoxHeightMin: 0,
				reportBoxHeightMax: 0,
				// 看更多位置
				seeMoreBoxWidthMin : 0,
				seeMoreBoxWidthMax : 0,
				seeMoreBoxHeightMin: 0,
				seeMoreBoxHeightMax : 0,
				// 看更多位置
				returnToPreviouWidthMin : 0,
				returnToPreviouWidthMax : 0,
				returnToPreviouHeightMin: 0,
				returnToPreviouHeightMax : 0,
				
				// 浮标广告弹窗
				showConditionAdvertisingFlag:false,
				//是否展示返回上一级提示弹窗
				returnToPreviouShow: false,
				//开场节点的detailId
				startDetailId: 0,
				//是否返回上一级
				returnToPreviousFlag: false
			}
		},
		onReady(){
			uni.setStorageSync('historyNodeBuoyList',[])
			//重置重播
			uni.setStorageSync('isReplay',false)
			//重置弹窗状态
			uni.removeStorageSync('popupState')
			uni.removeStorageSync('popupSettings')
			// 监听是否重新获取光的数量
			this.isGetLight()
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
			this.isBouyClickCommonOptionTodo()
		},
		onLoad(option) {
			//初始化video对象
			this.videoContext = uni.createVideoContext('myVideo')
			this.token = uni.getStorageSync('token')
			// 初始化看广告获取光的数量
			this.rewardLight = uni.getStorageSync('rewardLight') || 3
			this.randomText()
			this.initLightNum()
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
					this.checkUserIdInfos(a)
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
			console.log(this.artworkId)
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
			    delta: 1,
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
			//返回上一级弹窗的确认事件
			returnToPreviouConfirm(){
				if(this.bouyNodeFlage){
					this.recoveryBuoyDraw()
				}else{
					this.videoContext.play()
				}
				this.returnToPreviouShow = false
			},
			//返回上级
			returnToPrevious(){
				//若parentId是0或-1时点击返回上一级弹框提示（parentId为0根节点为-1多结局作品的结局视频）
				if(this.parentId == -1 || this.parentId == 0){
					if(this.bouyNodeFlage){
						this.stopBuoyDraw()
					}else{
						this.videoContext.pause()
					}
					return this.returnToPreviouShow = true
				}
				//返回上一级时如果是开场不去获取百分比
				if(this.startDetailId == this.parentId){
					this.isShowOptionPercentageFlag = false
				}
				let pkDetailIds = uni.getStorageSync("pkDetailIds")
				// console.log("************pkDetailIds: ",pkDetailIds)
				//返回上一级不使用parentId 使用播放历史记录的倒数第二个detailid
				let currentDetailId = pkDetailIds[pkDetailIds.length-2]
				// console.log("************currentDetailId: ",currentDetailId)
				//砍掉倒数两个detailId 因为播放时会再存一次当前的播放记录
				pkDetailIds.splice(pkDetailIds.length-2,2)
				// console.log("************pkDetailIds: ",pkDetailIds)
				this.playedHistoryArray = pkDetailIds
				// console.log("************playedHistoryArray: ",this.playedHistoryArray)
				uni.setStorageSync("pkDetailIds",this.playedHistoryArray)
				//将多结局作品的路径砍掉 对照着播放历史截取
				if(uni.getStorageSync('isEndings') == 1){
					let multipleResultLine = uni.getStorageSync("multipleResultLine")
					//砍掉倒数第一个多结局作品的线路记录
					multipleResultLine.splice(multipleResultLine.length-1,1)
					this.multipleResultLine = multipleResultLine
					uni.setStorageSync("multipleResultLine",this.multipleResultLine)
				}
				//走故事线逻辑 组装option参数
				let option = {
					"pkArtworkId": this.artworkId,
					"pkDetailId": currentDetailId,
					"jumpFlag": true
				}
				this.storyLineJumpPlayTodo(option)
			},
			//截取选项的名称
			getOptionPercentageNames(option){
				this.optionPercentageNames = []
				for(let i = 0; i < option.length; i++){
					let len = option[i].length;
					if(len > 3){
						let name = option[i].substring(0,3)
						this.optionPercentageNames.push(name+"...")
					}else{
						this.optionPercentageNames.push(option[i])
					}
				}
			},
			//调出广告
			goAdvertisement(){
				this.openAdvertising()
			},
			// 随机填充Tips
			randomText () {
				const num = parseInt(Math.random() * 14)
				this.tipsText = this.tips[num]
			},
			// 监听是否重新获取光的数量
			isGetLight () {
				globalBus.$on('getNewLightOfComponents', () => {
					this.initLightNum()
				})
			},
			// 初始化光的数量
			initLightNum () {
				this.lightNumber = uni.getStorageSync('lightNumber') || 0
				this.ecmUserLightUpLimit = uni.getStorageSync('ecmUserLightUpLimit') || 0
			},
			closeConditionDialog(){
				this.showConditionAdvertisingFlag = false
				if(this.isVideoEndFlag){
					this.againPlayVideo()
				}else {
					this.recoveryBuoyDraw()
				}

			},
			againPlayVideo(){
				this.buoyRectList = []
				this.canvasNodeBuoyList = []
				//随机数
				const uuid = Math.random().toString(36).substring(2)
				//初始化视频及选项
				this.videoUrl = this.videoUrl+'?uuid='+uuid
			},
			// 关闭激励广告确认框
			closeDialog () {
				this.showAdvertisingFlag = false
				if(this.isVideoEndFlag){
					if(this.bouyNodeFlage) {
						this.againPlayVideo()
					}
					if(this.isPosition == 1){
						this.showCanvasFlag = true
					}

				}else{
					this.videoContext.play()
					// 浮标修改
					if (this.bouyNodeFlage) {
						this.recoveryBuoyDraw()
					}
				}
			},

			// 显示激励广告确认弹窗
			showDialog () {
				console.log('我们显示激励广告确认弹窗  被调用')
				if(!this.isVideoEndFlag){
					this.showCanvasFlag = false
					this.showAdvertisingFlag = true
					this.videoContext.pause()
					//浮标改动
					if (this.bouyNodeFlage) {
						this.stopBuoyDraw()
					}

				}else {
					//浮标改动
					if (this.bouyNodeFlage) {
						this.stopBuoyDraw()
					}
				}

			},
			// 观看激励广告
			openAdvertising () {
				this.showAdvertisingFlag = false
				if (this.advertising == null) {
					this.advertising = wx.createRewardedVideoAd({
						adUnitId: 'adunit-7423fd1b2c7c5724',
						multiton: true
					})
				}else {
					this.advertising.destroy() 
					this.advertising = wx.createRewardedVideoAd({
						adUnitId: 'adunit-8d7f7b5a86ac5537',
						multiton: true
					})
				}
				//捕捉错误
				this.advertising.onError(err => {
					console.log(err)
					uni.showToast({
						icon: 'none',
						title:'当前没有适合您的激励视频，请待会再试'
					})
					if(this.isVideoEndFlag){
						if(this.isGetMultipleFlag){
							this.multipleResultAdvertiseShow = true
						}
						if(this.isPosition == 1){
							if(this.playMode == 1){
								this.initHorizontalCanvas()
							}else{
								this.initVerticalCanvas()
							}
							this.showCanvasFlag = true
						}
						if(this.bouyNodeFlage) {
							this.showConditionAdvertisingFlag = false
							this.againPlayVideo()
						}
					}else {
						if (this.bouyNodeFlage && !this.showConditionAdvertisingFlag) {
							this.recoveryBuoyDraw()
						}
					}

					//广告拉取失败销毁对象
					this.advertising.destroy()
				})
				// 激励广告显示并加载
				if (this.advertising) {
					this.advertising.load().then(() => {
						this.advertising.show().then(() => {
						})
					}).catch(() => {
						if(this.isVideoEndFlag){
							if(this.isPosition == 1){
								this.showCanvasFlag = true
							}
						}
						this.advertising.load().then(() => {
							this.advertising.show().then(() => {
							})
						}).catch(() => {
							if(this.isVideoEndFlag){
								if(this.isPosition == 1){
									this.showCanvasFlag = true
								}
							}
							uni.showToast({
								icon: 'none',
								title:'当前没有适合您的激励视频，请待会再试'
							})
							if(this.isVideoEndFlag){
								if(this.isGetMultipleFlag){
									this.multipleResultAdvertiseShow = true
								}
								if(this.isPosition == 1){
									if(this.playMode == 1){
										this.initHorizontalCanvas()
									}else{
										this.initVerticalCanvas()
									}
									this.showCanvasFlag = true
								}
								if(this.bouyNodeFlage) {
									this.showConditionAdvertisingFlag = false
									this.againPlayVideo()
								}
							}else{
								if (this.bouyNodeFlage && !this.showConditionAdvertisingFlag) {
									this.recoveryBuoyDraw()
								}
							}
							
							// //广告拉取失败销毁对象
							// this.advertising.destroy()
						})
					})
				}
				// 监听激励广告关闭
				this.advertising.onClose((status) => {
					this.showConditionAdvertisingFlag = false
						if(this.isVideoEndFlag){
							if(this.isPosition == 1){
								if(this.playMode == 1){
									this.initHorizontalCanvas()
								}else{
									this.initVerticalCanvas()
								}
								this.showCanvasFlag = true
							}
						}else{
							// 浮标修改
							if (this.bouyNodeFlage && !this.showConditionAdvertisingFlag) {
								this.recoveryBuoyDraw()
							}else {
								this.videoContext.play()
							}
						}
					//status.isEnded
					if(status.isEnded){
						// 关闭条件浮标 弹窗
						this.showConditionAdvertisingFlag = false
						if(this.isPosition == 1){
							//获取多结局作品开关
							if(this.isGetMultipleFlag){
								this.multipleResultAdvertiseShow = false
								this.multipleResultCallbackTodo(false)
							}else{
								if(this.conditionState[this.touchRectNum] == 1){
									//成功播放完广告

									this.customLightSuccessCallBack(this.touchRectNum)
								}else{
									console.log('给光')
									globalBus.$emit('requestOfAES')

									// 浮标修改
									if (this.bouyNodeFlage) {
										this.recoveryBuoyDraw()
									}
								}
							}
						}else{
							if(this.isGetMultipleFlag){
								this.multipleResultAdvertiseShow = false
								this.multipleResultCallbackTodo(false)
							}else{

								// 条件 广告
								if(this.conditionState[this.optionIndex] == 1){
									//成功播放完广告
									this.customLightSuccessCallBack(this.optionIndex)
								}else{
									console.log('给光')
									globalBus.$emit('requestOfAES')
								}
							}
						}
					} else {
						if(this.isVideoEndFlag){
							if(this.isGetMultipleFlag){
								this.multipleResultAdvertiseShow = true
							}
							if(this.isPosition == 1){
								if(this.playMode == 1){
									this.initHorizontalCanvas()
								}else{
									this.initVerticalCanvas()
								}
								this.showCanvasFlag = true
							}
							// console.log('我进下面了')
							if(this.bouyNodeFlage ){
								this.buoyRectList = []
								this.canvasNodeBuoyList = []
								console.log('重新播放')
								this.againPlayVideo()
							}
						}else {
							// 浮标修改
							if (this.bouyNodeFlage) {
								if (this.showConditionAdvertisingFlag) {
									this.showConditionAdvertisingFlag = false
								}
								this.recoveryBuoyDraw()
							}
						}
						// 浮标 结尾 广告 未看完 时间添加
						console.log('憨批用户不给光')
					}
					//  this.advertising.destroy()
				})
			},
			openVideoShowFlag(){
				this.videoShowFlag = true
			},
			//故事线跳转播放页
			storyLineJumpPlayTodo(option){
				//清除视频的画面缓存直接删除video控件
				this.videoShowFlag = false
				//故事线跳回重置关闭故事重播不去保存播放记录的开关closeStoryLineReplayFlag为true不去保存播放记录
				this.closeStoryLineReplayFlag = false
				//重置是否展示百分比开关
				this.verticalOptionPercentageFlag = false
				this.horizontalOptionPercentageFlag = false
				//故事线跳回重置多结局作品的结局视频关闭故事线的回调标志
				this.multipleResultReplayFlag = false
				//多结局作品结局视频回调开关只有在重新进入作品和故事线跳转时需要重置
				this.multipleResultFlag = false
				//清除弹窗信息
				uni.removeStorageSync('popupState')
				uni.removeStorageSync('popupSettings')
				//重置重播状态
				uni.setStorageSync('isReplay',false)
				//重置是否重播开关
				this.iscustomLightFlag = false
				//故事线跳转重置跳转节点的目标节点的id
				this.linkNodeId = null
				//初始化是否此视频是否播放过开关
				this.isPlayedFlag = option.jumpFlag
				// 浮标修改 清楚信息
				this.clearNodeBuoyInfo()

				this.storyLineJumpFlag = true
				//故事线跳转时清除好感度延时函数
				clearTimeout(this.likabilityDelayFunction)
				//故事线跳转时清除选项百分比延时函数
				clearTimeout(this.optionPercentageFunction)
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
				this.detailId = null
				uni.setStorageSync("detailId",this.detailId)
				this.detailId = option.pkDetailId
				// console.log('storydetailId: ',this.detailId)
				//故事线跳转过来存一棵主树 跳转用
				this.videoloadFlag = false
				//跳转成功先关闭故事线
				this.storyLineContentFlag = false
				//请求获取主树
				this.getArtworkTreeByArtworkId()
				//请求获取子树
				this.getArtworkTreeByDetailId(option.pkDetailId)
				//获取播放历史记录
				this.playedHistoryArray = uni.getStorageSync("pkDetailIds")
				//重置多结局数组（故事线跳回时进行重组直接获取就好了）
				this.multipleResultLine = uni.getStorageSync("multipleResultLine")
				//获取存放节点数值的容器
				let appearConditionMap = uni.getStorageSync('appearConditionMap')
				//故事线跳回获取百分比数据
				if(this.isShowOptionPercentageFlag && !this.isPlayedFlag){
					this.getOptionSelectionRecord(option.pkDetailId,null)
				}
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
			initPlayData(artworkTree, isJumpDialogCallbackFlag){
				if(artworkTree.parentId === 0 ){
					this.startDetailId = artworkTree.pkDetailId
					if(artworkTree.percentageState == 1){
						this.isShowOptionPercentageFlag = true
					}
					if(this.popupTotalNumber > 0){
						this.popupName = artworkTree.popupName
					}
				}
				this.detailId = artworkTree.pkDetailId
				//获取用户的弹窗弹出数量
				let popupWindowRecord = uni.getStorageSync('popupWindowRecord')
				//存储弹窗跳回传参用
				this.artworkTree = artworkTree
				//初始化条件设置的容器
				this.conditionState = []
				//初始化是否显示弹窗
				this.popupState = uni.getStorageSync('popupState')
				console.log('this.popupState',this.popupState)
				if(this.popupState == 1){
					this.popupSettings = uni.getStorageSync('popupSettings')
					this.handlePopupSettings()
					this.isReplayPopupWindow = true
				}else{
					this.isReplayPopupWindow = false
				}
				console.log('this.videoShowFlag',this.videoShowFlag)
				if(!isJumpDialogCallbackFlag && this.popupPosition == 0 && this.popupState == 1 && !this.isPlayedFlag){
					this.videoShowFlag = false
					return this.popupWindowByPopupPositonEqualsZero()
				}
				console.log('这里不应该被执行')
				if(!popupWindowRecord){
					this.popupCountNumber = 0
				}else{
					let currentPopupWindowRecord = popupWindowRecord[this.artworkId]
					if(!currentPopupWindowRecord){
						this.popupCountNumber = 0
					}else{
						this.popupCountNumber = currentPopupWindowRecord.length
					}
				}
				//打开video开关
				if(uni.getStorageSync('isEndings') == 1){
					this.videoShowFlag = true
				}
				//是否是定位选项的标志2是浮标 1是定位选项 其他是普通选项
				console.log('artworkTree',artworkTree)
				this.isPosition = artworkTree.isPosition
				console.log('this.isPosition',this.isPosition)
				if(this.isPosition == 1){
					//获取定位选项位置数据
					this.nodeLocationList = artworkTree.nodeLocationList
					// 浮标改动
				}else if (this.isPosition === 2) {
					// 是否为浮标 选项
					this.ecmArtworkNodeBuoyList = artworkTree.ecmArtworkNodeBuoyVOList
					this.bouyNodeFlage = true
					this.showBuoyCanvasFlag = true
					// console.log('我进来了')

				}

				//随机数
				const uuid = Math.random().toString(36).substring(2)
				//初始化视频及选项
				this.videoUrl = artworkTree.videoUrl+'?uuid='+uuid
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
							let conditionState = childs[i].conditionState
							if(conditionState == 1){
								this.conditionState.push(1)
							}else{
								this.conditionState.push(0)
							}
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
						if(!uni.getStorageSync('isReplay')){
							this.playedHistoryArray.push(artworkTree.pkDetailId)
						}
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
					if(!uni.getStorageSync('isReplay')){
						if(!this.closeStoryLineReplayFlag){
							this.playedHistoryArray.push(artworkTree.pkDetailId);
						}else{
							this.closeStoryLineReplayFlag = false
						}
					}
					/* //不需要去重 记录故事线走向方便数值选项分数计算
					this.playedHistoryArray = Array.from(new Set(this.playedHistoryArray)); */
					uni.setStorageSync("pkDetailIds",this.playedHistoryArray);
					this.linkNodeId = null
				}
			},
			//视频 播放后弹窗
			popupWindowByPopupPositonEqualsOne(){
				// 浮标 改动
				if( uni.getStorageSync('playMode') == 1){
					try{
						this.stopBuoyDraw()
						this.horizontalJumpDialogFlag = true
						this.$refs.horizontalJumpDialog.horizontalJumpDialogFlag = true
					}catch(e){
					}
				}
				if(uni.getStorageSync('playMode') == 0){
					try{
						this.stopBuoyDraw()
						this.verticalJumpDialogFlag = true
						this.$refs.verticalJumpDialog.verticalJumpDialogFlag = true
					}catch(e){
					}
				}
				this.savaPopupWindowRecord()
				// if(this.isPosition == 1 && uni.getStorageSync('playMode') == 1){
				// 	try{
				// 		this.horizontalJumpDialogFlag = true
				// 		this.$refs.horizontalJumpDialog.horizontalJumpDialogFlag = true
				// 	}catch(e){
				// 	}
				// 	this.savaPopupWindowRecord()
				// }
				// if(this.isPosition == 1 && uni.getStorageSync('playMode') == 0){
				// 	try{
				// 		this.verticalJumpDialogFlag = true
				// 		this.$refs.verticalJumpDialog.verticalJumpDialogFlag = true
				// 	}catch(e){
				// 	}
				// 	this.savaPopupWindowRecord()
				// }
				// if(this.isPosition == 0 && uni.getStorageSync('playMode') == 1){
				// 	try{
				// 		this.horizontalJumpDialogFlag = true
				// 		this.$refs.horizontalJumpDialog.horizontalJumpDialogFlag = true
				// 	}catch(e){
				// 	}
				// 	this.savaPopupWindowRecord()
				// }
				// if(this.isPosition == 0 && uni.getStorageSync('playMode') == 0){
				// 	try{
				// 		this.verticalJumpDialogFlag = true
				// 		this.$refs.verticalJumpDialog.verticalJumpDialogFlag = true
				// 	}catch(e){
				// 	}
				// 	this.savaPopupWindowRecord()
				// }
			},
			// 视频播放器 弹窗
			popupWindowByPopupPositonEqualsZero(){
				console.log('视频暂停被启用过')
			
				// 浮标修改
				if (uni.getStorageSync('playMode') == 1) {
					try{
						this.stopBuoyDraw()
						this.horizontalJumpDialogFlag = true
						this.$refs.horizontalJumpDialog.horizontalJumpDialogFlag = true
					}catch(e){}
				}else {
					try{
						this.stopBuoyDraw()
						this.verticalJumpDialogFlag = true
						this.$refs.verticalJumpDialog.verticalJumpDialogFlag = true
					}catch(e){}
				}
				this.savaPopupWindowRecord()
				
				
				// if(this.isPosition == 1 && uni.getStorageSync('playMode') == 1){
				// 	try{
				// 		this.horizontalJumpDialogFlag = true
				// 		this.$refs.horizontalJumpDialog.horizontalJumpDialogFlag = true
				// 	}catch(e){
				// 	}
				// 	this.savaPopupWindowRecord()
				// }
				// if(this.isPosition == 1 && uni.getStorageSync('playMode') == 0){
				// 	try{
				// 		this.verticalJumpDialogFlag = true
				// 		this.$refs.verticalJumpDialog.verticalJumpDialogFlag = true
				// 	}catch(e){
				// 	}
				// 	this.savaPopupWindowRecord()
				// }
				// if(this.isPosition == 0 && uni.getStorageSync('playMode') == 1){
				// 	try{
				// 		this.horizontalJumpDialogFlag = true
				// 		this.$refs.horizontalJumpDialog.horizontalJumpDialogFlag = true
				// 	}catch(e){
				// 	}
				// 	this.savaPopupWindowRecord()
				// }
				// if(this.isPosition == 0 && uni.getStorageSync('playMode') == 0){
				// 	try{
				// 		this.verticalJumpDialogFlag = true
				// 		this.$refs.verticalJumpDialog.verticalJumpDialogFlag = true
				// 	}catch(e){
				// 	}
				// 	this.savaPopupWindowRecord()
				// }
			},
			savaPopupWindowRecord(){
				let popupWindowRecord = uni.getStorageSync('popupWindowRecord')
				let value = []
				let detailId = uni.getStorageSync('pkDetailId')
				value.push(detailId)
				this.popupRecord[this.artworkId] = value
				// console.log('artworkId: ',this.artworkId)
				// console.log('detailId: ',detailId)
				if(detailId != null && this.popupState == 1){
					if(!popupWindowRecord){
						uni.setStorageSync('popupWindowRecord', this.popupRecord)
					}else{
						let currentPopupWindowRecord = popupWindowRecord[this.artworkId]
						if(!currentPopupWindowRecord){
							popupWindowRecord[this.artworkId] = this.popupRecord[Object.keys(this.popupRecord)]
							uni.setStorageSync('popupWindowRecord', popupWindowRecord)
						}else{
							let checkResult = currentPopupWindowRecord.indexOf(detailId)
							if(checkResult > -1){
								//当前弹窗弹出已记录了不需要再记录
							}else{
								//当前弹窗未记录
								currentPopupWindowRecord.push(detailId)
								this.popupRecord[this.artworkId] = currentPopupWindowRecord
								popupWindowRecord[this.artworkId] = this.popupRecord[Object.keys(this.popupRecord)]
								uni.setStorageSync('popupWindowRecord', popupWindowRecord)
							}
						}
					}
				}
			},
			handlePopupSettings(){
				this.popupPosition = this.popupSettings.popupPosition
				this.popupContextState = this.popupSettings.popupContextStates
				this.navigatorUrl = this.popupSettings.popupSkip
				this.popupImageUrl = this.popupSettings.popupContext
				this.appId = this.popupSettings.popupAppId
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
					let conditionState = child.conditionState
					if(conditionState == 1){
						this.conditionState.push(1)
					}else{
						this.conditionState.push(0)
					}
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
					return this.initPlayData(mainTree, false);
				}else{
					const childs = mainTree.childs;
					if(childs){
						for(let i = 0;i < childs.length;i++){
							this.getTargetTree(childs[i],linkId);
						}
					}
				}
			},
			async savaOptionSelectionRecord(detailId,parentId){
				await uni.request ({
					url: baseURL + "/wxPlay/savaOptionSelectedRecord",
					method: 'POST',
					dataType: 'json',
					data: {
						pkArtworkId: this.artworkId,
						parentId: parentId,
						detailId: detailId
					},
					success: result=> {
						if(result.data.status == 200){
							console.log('data: ',result.data.data)
							this.optionPercentageValues = []
							for(let i=0; i<result.data.data.percent.length; i++){
								this.optionPercentageValues.push(result.data.data.percent[i])
							}
						}
					}
				});
			},
			async getOptionSelectionRecord(detailId,parentId){
				await uni.request ({
					url: baseURL + "/wxPlay/getOptionSelectionRecord",
					method: 'POST',
					dataType: 'json',
					data: {
						pkArtworkId: this.artworkId,
						parentId: parentId,
						detailId: detailId
					},
					success: result=> {
						if(result.data.status == 200){
							if(!parentId){
								console.log('故事线跳回我去查询了百分比')
								this.optionPercentageValues = []
								for(let i=0; i<result.data.data.percent.length; i++){
									this.optionPercentageValues.push(result.data.data.percent[i])
								}
								this.getOptionPercentageNames(result.data.data.option)
							}
						}
					}
				});
			},
			async checkUserIdInfos(a){
				await uni.request ({
					url: baseURL + "/wxPlay/checkUserIdInfos",
					method: 'POST',
					dataType: 'json',
					data: {
						pkArtworkId: a,
						token: this.token
					},
					success: result=> {
						if(result.data.status == 200){
							console.log(result.data.msg)
							if(result.data.msg === "success"){
								this.artworkId = a
							}
						}else{
							console.log(result.data.msg)
							if(result.data.msg === "fail"){
								uni.setStorageSync('previewArtworkId', a)
								this.previewShow = true
							}
						}
					}
				});
			},
			async customLightByUserId(eventId){
				// 默认假设有光
				this.isHaveLight = true
				//故事线消费的eventId = 3
				//初次播放消费eventId = 4
				await uni.request ({
					url: baseURL + "/wxPlay/customLight",
					method: 'POST',
					dataType: 'json',
					data: {
						token: this.token,
						eventId: eventId
					},
					success: result=> {
						if(result.data.status == 200){
							// console.log(result, '嘿嘿')
							this.setLight(result.data.data)
							this.customLightSuccessCallBack(this.optionIndex)
						}else if(result.data.status == 10086){

							this.isHaveLight = false
							this.showCanvasFlag = false
							this.showAdvertisingFlag = true
							// 视频暂停
							this.showDialog()
						}
					}
				});
			},

			customLightSuccessCallBack(index){
				console.log('扣光成功的回调')
				if(this.storyLineJumpFlag){
					this.iscustomLightFlag = true
					this.storyLineJumpFlag = false
				}else{
					this.iscustomLightFlag = true
				}
				clearTimeout(this.optionPercentageFunction)
				this.likabilityArray = []
				clearTimeout(this.likabilityDelayFunction)
				this.likabilityFlag = false
				if(this.isPosition == 1){
					this.screenshotShowFlag = false
					this.canvasTouchendEventTodo()
					this.videoShowFlag = true
				}else{
					this.background.splice(index,1,"")
					// 播放结束清除延时函数
					this.optionTouchendTodo(index)
				}
				//保存有效观看记录
				if(!this.isClickOptionFlag){
					this.statisticsPlayRecord()
					this.isClickOptionFlag = true
				}
			},
			// 重新设置光
			setLight (data) {
				uni.setStorageSync('lightNumber', data.lightNumber)
				uni.setStorageSync('ecmUserLightUpLimit', data.upLimit)
				globalBus.$emit('initLightStyle')
			},
			//异步请求获取作品树 by ArtworkId
			async getArtworkTreeByArtworkId(){
				console.log( this.artworkId)
				// this.artworkId = 10208
				await uni.request({
					url: baseURL + "/wxPlay/playArtWorkByChildTree",
					method: 'POST',
					dataType: 'json',
					data: {
						pkArtworkId: this.artworkId,
						token: this.token
					},
					success: res=> {
						if(res.data.status == 200){
							uni.setStorageSync("mainArtworkTree",res.data.data);
							//传到播放页面带pkDetailId参数 说明故事线跳转，只需要存一棵主树跳转节点不用去播放视频
							uni.setStorageSync('playMode',res.data.data.playMode);
							uni.setStorageSync('isEndings',res.data.data.isEndings );
							this.popupTotalNumber = res.data.data.nodePopupCount
							this.popupNameState = res.data.data.popupNameStatus
							if(this.pkDetailId != null) return;
							// 浮标改动

							this.initPlayData(res.data.data, false);
						}else{
							this.videoShowFlag = false
						}
					}
				})
			},
			//异步请求获取作品树 by DetailId
			async getArtworkTreeByDetailId(detailId){
				console.log( this.artworkId)
				await uni.request({
					url: baseURL + "/wxPlay/playArtWorkByChildTree",
					method: 'POST',
					dataType: 'json',
					data: {
						pkArtworkId: this.artworkId,
						detailId:  detailId,
						token: this.token
					},
					success: res=> {
						if(res.data.status == 200){
							this.videoShowFlag = true
							uni.setStorageSync("artworkTree",res.data.data);
							uni.setStorageSync('playMode',res.data.data.playMode);
							uni.setStorageSync('isEndings',res.data.data.isEndings);
							uni.setStorageSync('popupState',res.data.data.popupState)
							this.popupState = res.data.data.popupState
							uni.setStorageSync('popupSettings',res.data.data.ecmArtworkNodePopupSettings)
							// console.log('storyPopupState',	this.popupState)
							this.initPlayData(res.data.data, false);
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
							this.artworkTree =  res.data.data
							if(res.data.data.conditionState == 1){
								this.isGetMultipleFlag = true
								console.log('作者让你看广告啊，跟我没关系')
								this.multipleResultAdvertiseShow = true
							}else{
								this.multipleResultCallbackTodo(false)
							}
						}else{
							this.storyLineContentFlag = true
							console.log('我去请求500')
						}
					}
				})
			},
			multipleResultCallbackTodo(isJumpDialogCallbackFlag){
				//多结局作品的结局视频关闭故事线的回调标志
				this.multipleResultReplayFlag = true
				//获取最后一个视频的弹窗信息
				this.popupState = this.artworkTree.popupState
				if(this.popupState == 1){
					uni.setStorageSync('pkDetailId', this.artworkTree.fkNodeId)
					this.popupSettings = this.artworkTree.ecmArtworkNodePopupSettings
					this.handlePopupSettings()
				}
				if(this.popupState == 1 && !isJumpDialogCallbackFlag && this.popupPosition == 0){
					uni.setStorageSync('isEndingsJump',true)
					this.multipleResultFlag  = true
					this.popupWindowByPopupPositonEqualsZero()
					return
				}
				//获取用户的弹窗弹出数量
				let popupWindowRecord = uni.getStorageSync('popupWindowRecord')
				//弹窗计数
				if(!popupWindowRecord){
					this.popupCountNumber = 0
				}else{
					let currentPopupWindowRecord = popupWindowRecord[this.artworkId]
					if(!currentPopupWindowRecord){
						this.popupCountNumber = 0
					}else{
						this.popupCountNumber = currentPopupWindowRecord.length
					}
				}
				//关闭故事线回调
				if(this.closeStoryLineReplayFlag){
					this.videoShowFlag = true
				}
				//清空路线容器
				this.multipleResultLine = []
				//随机数
				const uuid = Math.random().toString(36).substring(2)
				//初始化视频
				this.videoUrl = this.artworkTree.videoUrl+'?uuid='+uuid
				uni.setStorageSync("detailId",this.artworkTree.fkNodeId)
				uni.setStorageSync("fkNodeId",this.artworkTree.fkNodeId)
				if(!this.closeStoryLineReplayFlag){
					this.playedHistoryArray.push(this.artworkTree.fkNodeId)
				}else{
					this.closeStoryLineReplayFlag = false
				}
				this.parentId = this.artworkTree.parentId
				this.isMultipleResultPlayEnd = true
				//存储多结局的结局视频播放历史
				uni.setStorageSync("pkDetailIds",this.playedHistoryArray)
				//保存播放记录
				this.savaPlayRecord()
			},
			//异步请求保存播放记录
			async savaPlayRecord(){
				let token = uni.getStorageSync("token")
				if(uni.getStorageSync("openid")){
					if(!token){
						if(this.savaRecordCount > 2){
							this.savaRecordCount == 0
							//三次都未请求到token
							token = -1
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
					token = -2
				}
				await uni.request({
					url: baseURL + "/wxPlay/savaPlayRecord",
					method: 'POST',
					dataType: 'json',
					data: {
						pkArtworkId: this.artworkId,
						token: token,
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
				let token = uni.getStorageSync("token")
				if(uni.getStorageSync("openid")){
					if(!token){
						if(this.savaRecordCount > 2){
							this.savaRecordCount == 0
							//三次都未请求到token
							token = -1
						}else{
							this.statisticsPlayRecord()
							this.savaRecordCount++
						}
					}else{
						this.savaRecordCount == 0
					}
				}else{
					//朋友圈点击
					token = -2
				}
				await uni.request({
					url: baseURL + "/wxPlay/statisticsPlayRecord",
					method: 'POST',
					dataType: 'json',
					data: {
						fkArtworkId: this.artworkId,
						token: token,
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
				let token = uni.getStorageSync("token")
				if(uni.getStorageSync("openid")){
					if(!token){
						if(this.savaRecordCount > 2){
							this.savaRecordCount == 0
							//三次都未请求到token
							token = -1
						}else{
							this.statisticsStorylineNaturalshow()
							this.savaRecordCount++
						}
					}else{
						this.savaRecordCount == 0
					}
				}else{
					//朋友圈点击
					token = -2
				}
				await uni.request({
					url: baseURL + "/wxPlay/statisticsStorylineNaturalshow",
					method: 'POST',
					dataType: 'json',
					data: {
						fkArtworkId: this.artworkId,
						token: token,
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
			videoEnd(isJumpDialogCallbackFlag){
				//根据是否是最后一个视频标志 最后一个视频播放结束弹出故事线 endFlag = true 表示不是最后一个视频
				//获取用户的弹窗弹出数量
				let popupWindowRecord = uni.getStorageSync('popupWindowRecord')
				if(!this.isMultipleResultPlayEnd){
					//不是多结局作品的结局视频从storage获取弹窗标志
					this.popupState = uni.getStorageSync('popupState')
				}else{
					//多结局作品的结局视频在请求结束后弹窗标志就被赋值了，此处只需要重置多结局作品的结局视频的播放结束开关
					this.isMultipleResultPlayEnd = true
				}
				if(!isJumpDialogCallbackFlag && this.popupState == 1 && this.popupPosition == 1){
					console.log('isJumpDialogCallbackFlag: ',1)
					this.popupWindowByPopupPositonEqualsOne()
					return
				}
				if(!popupWindowRecord){
					this.popupCountNumber = 0
				}else{
					let currentPopupWindowRecord = popupWindowRecord[this.artworkId]
					if(!currentPopupWindowRecord){
						this.popupCountNumber = 0
					}else{
						this.popupCountNumber = currentPopupWindowRecord.length
					}
				}
				this.percent = 100
				this.isVideoEndFlag = true
				if(this.endFlag){
					if(this.isPosition == 1){
						this.chooseTipsShowFlag = false
						this.chooseTipsMaskFlag = false
						this.screenshotShowFlag = true
						this.videoShowFlag = true
						this.hiddenBtnFlag = false
						this.showCanvasFlag = true
						this.videoUrl = ''
					}
					// 浮标修改
					else if (this.isPosition  === 2){
						// 默认选A
						this.optionIndex = 0
						this.clickCommonOptionTodo(0)
						// console.log(this.buoyRectList)
						// return
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
			videoPlay(){
				this.multipleResultFlag = false
				this.isVideoEndFlag = false
				this.isGetMultipleFlag = false
				
				if (this.waitingVideoFlag) {
					if (this.bouyNodeFlage) {
						console.log('play里面的  recoveryBuoyDraw 被启动了')
						this.recoveryBuoyDraw()
					}
				}
				
				
			},
			//视屏暂停操作
			videoPause(){

			},
			//展示故事线内容的时候暂停视频
			showStoryLineContent(){
				this.storyLineContentFlag = true
				if(uni.getStorageSync('isEndings') == 1){
					this.videoShowFlag = false
				}
				//需求要求统一逻辑故事线打开关闭都需要重新播放
				this.videoContext.seek(0)
				//暂停视屏
				this.videoContext.pause()
			},
			//展示举报内容的时候暂停视频
			showReportContent(){
				this.reportContentFlag = true
				this.uploadBtnFlag = true
				this.uploadImageFlag = false
				this.videoContext.pause()
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
						this.optionIndex = index
						this.clickCommonOptionTodo(index)
						break;
					}
					case 1: {
						this.optionIndex = index
						this.clickCommonOptionTodo(index)
						break;
					}
					case 2: {
						this.optionIndex = index
						this.clickCommonOptionTodo(index)
						break;
					}
					case 3: {
						this.optionIndex = index
						this.clickCommonOptionTodo(index)
						break;
					}
				}
			},
			clickCommonOptionTodo(index){
				//保存用户的选择记录
				this.savaOptionSelectionRecord(this.childs[index].pkDetailId,this.childs[index].parentId)
				//获取百分比的名称和数据
				if(this.isShowOptionPercentageFlag){
					this.getOptionPercentageNames(this.option)
				}
				//重置关闭故事线是否保存播放记录的开关
				this.closeStoryLineReplayFlag = false
				//清除storage中缓存的节点的弹窗信息
				uni.removeStorageSync('popupState')
				uni.removeStorageSync('popupSettings')
				uni.setStorageSync('isReplay',false)

				if(this.conditionState[index] == 1){
					console.log('作者让你看广告啊，跟我没关系')

					// this.videoContext.play()
					// 浮标修改
					if (this.bouyNodeFlage) {
						// this.recoveryBuoyDraw()
						//视频暂停
						this.videoContext.pause()
						this.stopBuoyDraw()
						this.showConditionAdvertisingFlag = true	
					}else {
						this.openAdvertising()
					}

				}else{
					if(!this.iscustomLightFlag){
						if(this.storyLineJumpFlag){
							return this.customLightByUserId(3)
						}else{
							return this.customLightByUserId(4)
						}
					}else{
						this.likabilityArray = []
						this.background.splice(index,1,"")
						this.likabilityFlag = false
						// 播放结束清除延时函数
						clearTimeout(this.optionPercentageFunction)
						clearTimeout(this.likabilityDelayFunction)
						this.optionTouchendTodo(index)
						//保存有效观看记录
						if(!this.isClickOptionFlag){
							this.statisticsPlayRecord()
							this.isClickOptionFlag = true
						}
					}
				}


			},
			// 选项touchend事件触发时所做的操作
			optionTouchendTodo(index){
				console.log('touchend我被触发了')
				// 浮标修改
				if(this.bouyNodeFlage) {
					// 关闭 动画
					this.clearAnimation()
					//清空数据
					this.clearNodeBuoyInfo()
				}
				// 是否为多结局
				if(uni.getStorageSync('isEndings') == 1){
					this.multipleResultLine.push(index + 1)
					uni.setStorageSync('multipleResultLine', this.multipleResultLine)
					this.chooseTipsShowFlag = false
					this.chooseTipsMaskFlag = false
					// console.log(' this.childs[index]', this.childs[index])
					// console.log(index)
					// let child = this.childs[index]
					// let popupState = this.childs[index].popupState
					// if(popupState == 1){
					// 	uni.setStorageSync('pkDetailId', this.childs[index].pkDetailId)
					// 	let popupSettings = this.childs[index].ecmArtworkNodePopupSettings
					// 	uni.setStorageSync('popupState',popupState)
					// 	uni.setStorageSync('popupSettings',popupSettings)
					// }


					// this.initPlayData( this.childs[index],false)
				}else{
					let advancedList = this.childs[index].onAdvancedList
					let userScore = uni.getStorageSync('userScore')
					let isNumericalOptions = this.childs[index].isNumberSelect == null ? 0 : 1
					console.log(isNumericalOptions)
					// 数值选项
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
						// let popupState = this.childs[index].popupState
						// if(popupState == 1){
						// 	uni.setStorageSync('pkDetailId', this.childs[index].pkDetailId)
						// 	let popupSettings = this.childs[index].ecmArtworkNodePopupSettings
						// 	uni.setStorageSync('popupState',popupState)
						// 	uni.setStorageSync('popupSettings',popupSettings)
						// }
						// this.initPlayData(this.childs[index], false)
					}else{
						this.chooseTipsShowFlag = false
						this.chooseTipsMaskFlag = false
						// let popupState = this.childs[index].popupState
						// if(popupState == 1){
						// 	uni.setStorageSync('pkDetailId', this.childs[index].pkDetailId)
						// 	let popupSettings = this.childs[index].ecmArtworkNodePopupSettings
						// 	uni.setStorageSync('popupState',popupState)
						// 	uni.setStorageSync('popupSettings',popupSettings)
						// }
						// this.initPlayData(this.childs[index], false)
					}
				}
						let popupState = this.childs[index].popupState
						if(popupState == 1){
							uni.setStorageSync('pkDetailId', this.childs[index].pkDetailId)
							let popupSettings = this.childs[index].ecmArtworkNodePopupSettings
							uni.setStorageSync('popupState',popupState)
							uni.setStorageSync('popupSettings',popupSettings)
					console.log(popupSettings)
						}
				console.log("重新吊起initPlayData",this.childs[index])
						this.initPlayData(this.childs[index], false)
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
				uni.setStorageSync('isReplay',true)
				/* if(this.isReplayPopupWindow){
					uni.setStorageSync('popupState',1)
					uni.setStorageSync('popupSettings', this.artworkTree.ecmArtworkNodePopupSettings)
				} */
				this.initPlayData(this.artworkTree,false)
			},
			//点击故事线关闭按钮触发事件
			closeStoryLineContent(){
				//新需求统一逻辑故事线关闭需要重头播放并且展示视频的前后弹窗
				if(uni.getStorageSync('isEndings') == 1){
					if(this.multipleResultReplayFlag){
						this.storyLineContentFlag = false
						//是否存放播放记录的标志 开关故事线重播但是不保存播放记录
						this.closeStoryLineReplayFlag = true
						this.multipleResultCallbackTodo(false)
					}else{
						this.storyLineContentFlag = false
						this.closeStoryLineReplayFlag = true
						this.initPlayData(this.artworkTree,false)
					}
				}else{
					// if(this.isVideoEndFlag){
						this.storyLineContentFlag = false
						this.closeStoryLineReplayFlag = true
						this.clearNodeBuoyInfo()
						this.initPlayData(this.artworkTree,false)
					/*} else{
						if(uni.getStorageSync('isEndings') == 1){
							this.videoShowFlag = true
						}
						this.storyLineContentFlag = false
						this.videoContext.play()
					} */
				}
				// 需要浮标修改
				// if (this.bouyNodeFlage) {
				// 	this.recoveryBuoyDraw()
				// }

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
				this.videoContext.play()
				// 浮标修改
				if (this.bouyNodeFlage) {
					this.recoveryBuoyDraw()
				}
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
						//校准，因为获取到的矩形框坐标是矩形框的中轴点的坐标，而绘制矩形传入的是左上角的坐标 故需要校正 横纵坐标减去矩形框宽高的一半
						let cr = 2
						this.drawLine(ctx, cX, cY, rectX, rectY)

						//画末尾小圆圈
						//x,y,r,sAngle（起始弧度,单位弧度（在3点钟方向）），eAngle（终止弧度）counterclockwise可选，默认是false 标识顺时针
						//让起始点转到12点就需要倒退0.5* Math.PI 但整圆是2 * Math.PI 故终止弧度加0.5* Math.PI
						//外圈
						this.drawcircule(ctx, cX, cY, cr*3, 0, 2 * Math.PI, '#87CEEB')
						//内圈
						this.drawcircule(ctx, cX, cY, cr, 0, 2 * Math.PI, '#E3E3E3')

						//画矩形
						//前两个值为左上角起始点坐标x,y，后面两位为矩形宽高 最后一个元素是矩形圆角的像素
						//校准，因为获取到的矩形框坐标是矩形框的中轴点的坐标，而绘制矩形传入的是左上角的坐标 故需要校正 横纵坐标减去矩形框宽高的一半
						let lineWidth = 2
						this.drawDisplayRect(ctx, parseInt(((this.nodeLocationList[i].textRectX+0)*this.canvasWidth-(rectW/2)).toFixed(0)),
						parseInt(((this.nodeLocationList[i].textRectY+0)*this.canvasHeight-(rectH/2)).toFixed(0)), rectW, rectH, lineWidth, i)

						// 画皮肤
						let imageW= 25
						let	imageH= 30
						this.drawImageForPositionOption(ctx,"../../static/icon/left.png",parseInt((rectX-(rectW/2)).toFixed(0))-imageW+lineWidth,
						parseInt((rectY-(rectH/2)).toFixed(0))-lineWidth/2, imageW, imageH+lineWidth)
						this.drawImageForPositionOption(ctx,"../../static/icon/right.png", parseInt((rectX-(rectW/2)).toFixed(0))+rectW-lineWidth,
						parseInt((rectY-(rectH/2)).toFixed(0))-lineWidth/2, imageW, imageH+lineWidth)

						//写字
						//设置字体颜色
						ctx.setFillStyle('white')
						//校准，因为获取到的矩形框坐标是矩形框的中轴点的坐标，而绘制矩形传入的是左上角的坐标 故需要校正 横纵坐标减去矩形框宽高的一半
						let textX = parseInt(((rectX+(marginLeftAndRightSides/2))-(rectW/2)).toFixed(0))
						let textY =  parseInt(((rectH+rectY-marginBottom)-(rectH/2)).toFixed(0))
						ctx.fillText(textContent, textX, textY)

						//绘制广告
						if(this.conditionState[i] == 1){
							let adX = rectX - 45
							let adY = rectY - 24
							this.drawVerticalAdvertisement(ctx,adX,adY)
						}
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
						this.drawTransparentRect(ctx, rectX, rectY, rectW, rectH, rectOpacity, i)
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
						//校准，因为获取到的矩形框坐标是矩形框的中轴点的坐标，而绘制矩形传入的是左上角的坐标 故需要校正 横纵坐标减去矩形框宽高的一半
						this.drawLine(ctx, this.canvasWidth - (cY + 2), cX, this.canvasWidth - (rectY), rectX)

						//画末尾小圆圈
						//x,y,r,sAngle（起始弧度,单位弧度（在3点钟方向）），eAngle（终止弧度）counterclockwise可选，默认是false 标识顺时针
						//让起始点转到12点就需要倒退0.5* Math.PI 但整圆是2 * Math.PI 故终止弧度加0.5* Math.PI
						//外圈
						this.drawcircule(ctx, this.canvasWidth - (cY + 2), cX, cr*3, 0, 2 * Math.PI, '#87CEEB')
						//内圈
						this.drawcircule(ctx, this.canvasWidth - (cY + 2), cX, cr, 0, 2 * Math.PI, '#E3E3E3')

						//画矩形
						//前两个值为左上角起始点坐标x,y，后面两位为矩形宽高 最后一个元素是矩形圆角的像素
						//校准，因为获取到的矩形框坐标是矩形框的中轴点的坐标，而绘制矩形传入的是左上角的坐标 故需要校正 横纵坐标减去矩形框宽高的一半
						let lineWidth = 2
						this.drawDisplayRect(ctx, this.canvasWidth - (parseInt((rectY-(rectH/2)).toFixed(0)) + rectH),
						parseInt((rectX-(rectW/2)).toFixed(0)), rectH, rectW, lineWidth, i)
						// console.log('矩形框的x轴坐标: ', this.canvasWidth - (parseInt((rectY-(rectH/2)).toFixed(0)) + rectH))
						// console.log('矩形框的y轴坐标: ', parseInt((rectX-(rectW/2)).toFixed(0)))

						// 画皮肤
						let imageW= 25
						let	imageH= 30
						this.drawImageForPositionOption(ctx,"../../static/icon/left_deg.png",
						this.canvasWidth - (parseInt((rectY-(rectH/2)).toFixed(0)) + rectH)-lineWidth/2,
						parseInt((rectX-(rectW/2)).toFixed(0))-imageW+lineWidth+1,
						imageH+lineWidth,imageW)
						this.drawImageForPositionOption(ctx,"../../static/icon/right_deg.png",
						this.canvasWidth - (parseInt((rectY-(rectH/2)).toFixed(0)) + rectH)-lineWidth/2,
						parseInt((rectX-(rectW/2)).toFixed(0))+rectW-lineWidth,
						imageH+lineWidth,
						imageW)

						//写字
						//设置字体颜色
						ctx.setFillStyle('white')
						ctx.save ()
						ctx.translate(this.canvasWidth - rectY, rectX)
						ctx.rotate ( 90 * Math .PI / 180 )
						ctx.fillText(textContent, -rectW*2/5, rectH/4)//-rectW/2, rectH/4
						ctx.setTextAlign('center')
						ctx.translate( -rectX  , this.canvasWidth - rectY)
						ctx.restore ()

						if(this.conditionState[i] == 1){
							let adX = this.canvasWidth - (rectY)
							let adY = rectX - 45
							this.drawHorizontalAdvertisement(ctx, adX ,adY)
						}
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
						this.drawTransparentRect(ctx, this.canvasWidth -(rectY+rectH), rectX, rectH, rectW, rectOpacity, i)
					}
				}
			},
			drawVerticalAdvertisement(ctx, x, y){
				let r = 12 //圆角矩形弧度
				let width = 90
				let height = 24
				let fontSize = 12
				let adImageWidth = 22
				let adImageHeight = 22
				let textContent = '广告解锁'
				let adImageUrl = '../../static/icon/advertisement.png'
				this.fillRoundRect(ctx, x, y, width, height, r , 'rgba(255, 255, 255,0.6)')
				this.drawImageForPositionOption(ctx, adImageUrl, x+10, y + 1, adImageWidth, adImageHeight)

				//设置字体颜色
				ctx.setFillStyle('#707070')
				ctx.setFontSize(fontSize)
				//校准，因为获取到的矩形框坐标是矩形框的中轴点的坐标，而绘制矩形传入的是左上角的坐标 故需要校正 横纵坐标减去矩形框宽高的一半
				let textX = x + 22 + 2 + 10
				let textY = y + 16
				ctx.fillText(textContent, textX, textY)
			},
			drawHorizontalAdvertisement(ctx, x, y){
				let r = 12 //圆角矩形弧度
				let width = 90
				let height = 24
				let fontSize = 12
				let adImageWidth = 20
				let adImageHeight = 20
				let textContent = '广告解锁'
				let adImageUrl = '../../static/icon/Hadvertisement.png'
				this.fillRoundRect(ctx, x, y, height, width, r , 'rgba(255, 255, 255,0.6)')
				this.drawImageForPositionOption(ctx, adImageUrl, x+2, y+10, adImageHeight, adImageWidth)

				//设置字体颜色
				ctx.setFillStyle('#707070')
				ctx.setFontSize(fontSize)
				//校准，因为获取到的矩形框坐标是矩形框的中轴点的坐标，而绘制矩形传入的是左上角的坐标 故需要校正 横纵坐标减去矩形框宽高的一半
				let textX = x + 22 + 2 + 10
				let textY = y + 16
				ctx.save ();
				ctx.translate(x, y)
				ctx.rotate ( 90 * Math .PI / 180 )
				ctx.translate(x-2*x, -y-24)
				ctx.fillText(textContent, textX, textY)
				ctx.restore()
			},
			drawcircule(ctx, cX, cY, cr, sAngle, eAngle, fillColor){
				ctx.beginPath()
				ctx.arc(cX, cY, cr, sAngle, eAngle)
				ctx.setFillStyle(fillColor)
				ctx.fill()
			},
			drawLine(ctx, cX, cY, rectX, rectY){
				ctx.beginPath()
				ctx.setLineWidth(1)
				ctx.moveTo(cX, cY)
				ctx.lineTo(rectX, rectY)
				ctx.setStrokeStyle('white')
				ctx.stroke()
			},
			drawDisplayRect(ctx, x, y, width, height, lineWidth, i){
				ctx.lineWidth = lineWidth
				ctx.rect(x, y, width, height)
				//将坐标收纳成对象保存到数组，为绑定事件做准备
				let rect={
					x: x,
					y: y,
					w: width,
					h: height
				}
				this.rectArray.push(rect)
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
			},
			//绘制横竖屏定位选项的皮肤
			drawImageForPositionOption(ctx, imagePath, x, y, width, height){
				ctx.beginPath()
				ctx.drawImage(imagePath, x, y, width, height)
			},
			//绘制横屏竖屏透明矩形的方法
			drawTransparentRect(ctx, x, y, width, height, rectOpacity, i){
				ctx.beginPath()
				//校准，因为获取到的矩形框坐标是矩形框的中轴点的坐标，而绘制矩形传入的是左上角的坐标 故需要校正 横纵坐标减去矩形框宽高的一半
				ctx.rect(x, y, width, height)
				//将坐标收纳成对象保存到数组，为绑定事件做准备
				let rect={
					x: x,
					y: y,
					w: width,
					h: height
				}
				this.rectArray.push(rect)
				if(this.isClickFlag){
					if(this.touchRectNum == i){
							//矩形边框颜色
							ctx.setStrokeStyle('rgba(255, 255, 255,0)')
							//矩形填充色
							ctx.setFillStyle('rgba(255, 255, 255,0)')
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
			},
			 /**该方法用来绘制一个有填充色的圆角矩形
			    *@param cxt:canvas的上下文环境
			    *@param x:左上角x轴坐标
			    *@param y:左上角y轴坐标
			    *@param width:矩形的宽度
			    *@param height:矩形的高度
			    *@param radius:圆的半径
			    *@param fillColor:填充颜色
			**/
			fillRoundRect(ctx, x, y, width, height, radius, fillColor) {
				//圆的直径必然要小于矩形的宽高
				if (2 * radius > width || 2 * radius > height) { return false; }

				ctx.save();
				ctx.translate(x, y);
				//绘制圆角矩形的各个边
				this.drawRoundRectPath(ctx, width, height, radius);
				ctx.fillStyle = fillColor || "#000"; //若是给定了值就用给定的值否则给予默认值
				ctx.fill();
				ctx.restore();
			},
			drawRoundRectPath(ctx, width, height, radius) {
				ctx.beginPath(0);
				//从右下角顺时针绘制，弧度从0到1/2PI
				ctx.arc(width - radius, height - radius, radius, 0, Math.PI / 2);
				//矩形下边线
				ctx.lineTo(radius, height);
				//左下角圆弧，弧度从1/2PI到PI
				ctx.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);
				//矩形左边线
				ctx.lineTo(0, radius);
				//左上角圆弧，弧度从PI到3/2PI
				ctx.arc(radius, radius, radius, Math.PI, Math.PI * 3 / 2);
				//上边线
				ctx.lineTo(width - radius, 0);
				//右上角圆弧
				ctx.arc(width - radius, radius, radius, Math.PI * 3 / 2, Math.PI * 2);
				//右边线
				ctx.lineTo(width, height - radius);
				ctx.closePath();
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
				this.touchRectNum = 5;
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
							console.log('this.touchRectNum: '+this.touchRectNum)
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
				console.log('this.touchRectNum: '+this.touchRectNum)
				if(this.touchRectNum == 0){
					this.clickPositionOptionTodo()
				}else if(this.touchRectNum == 1){
					this.clickPositionOptionTodo()
				}else if(this.touchRectNum == 2){
					this.clickPositionOptionTodo()
				}else if(this.touchRectNum == 3){
					this.clickPositionOptionTodo()
				}
			},
			clickPositionOptionTodo(){
				//保存用户的选择记录
				this.savaOptionSelectionRecord(this.childs[this.touchRectNum].pkDetailId,this.childs[this.touchRectNum].parentId)
				//获取百分比的名称和数据
				if(this.isShowOptionPercentageFlag){
					this.getOptionPercentageNames(this.option)
				}
				//重置关闭故事线是否保存播放记录的开关
				this.closeStoryLineReplayFlag = false
				uni.removeStorageSync('popupState')
				uni.removeStorageSync('popupSettings')
				uni.setStorageSync('isReplay',false)
				if(this.conditionState[this.touchRectNum] == 1){
					console.log('作者让你看广告啊，跟我没关系')
					this.openAdvertising()
					this.showCanvasFlag = false
				}else{
					if(!this.iscustomLightFlag){
						if(this.storyLineJumpFlag){
							return this.customLightByUserId(3)
						}else{
							return this.customLightByUserId(4)
						}
					}else{
						this.likabilityArray = []
						clearTimeout(this.optionPercentageFunction)
						clearTimeout(this.likabilityDelayFunction)
						this.screenshotShowFlag = false
						this.canvasTouchendEventTodo()
						this.likabilityFlag = false
						this.videoShowFlag = true
						//保存有效观看记录
						if(!this.isClickOptionFlag){
							this.statisticsPlayRecord()
							this.isClickOptionFlag = true
						}
					}
				}
			},
			// canvas的touchEnd事件触发时的操作
			canvasTouchendEventTodo(){
				if(uni.getStorageSync('isEndings') == 1){
					this.multipleResultLine.push(this.touchRectNum + 1)
					uni.setStorageSync('multipleResultLine', this.multipleResultLine)
					this.showCanvasFlag = false
					let child = this.childs[this.touchRectNum]
					let popupState = this.childs[this.touchRectNum].popupState
					if(popupState == 1){
						uni.setStorageSync('pkDetailId', child.pkDetailId)
						let popupSettings = child.ecmArtworkNodePopupSettings
						uni.setStorageSync('popupState',popupState)
						uni.setStorageSync('popupSettings',popupSettings)
					}
					this.initPlayData(child, false)
				}else{
					console.log(this.touchRectNum)
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
						let popupState = this.childs[this.touchRectNum].popupState
						if(popupState == 1){
							uni.setStorageSync('pkDetailId', this.childs[this.touchRectNum].pkDetailId)
							let popupSettings = this.childs[this.touchRectNum].ecmArtworkNodePopupSettings
							uni.setStorageSync('popupState',popupState)
							uni.setStorageSync('popupSettings',popupSettings)
						}
						this.initPlayData(this.childs[this.touchRectNum], false)
					}else{
						this.showCanvasFlag = false
						let popupState = this.childs[this.touchRectNum].popupState
						if(popupState == 1){
							uni.setStorageSync('pkDetailId', this.childs[this.touchRectNum].pkDetailId)
							let popupSettings = this.childs[this.touchRectNum].ecmArtworkNodePopupSettings
							uni.setStorageSync('popupState',popupState)
							uni.setStorageSync('popupSettings',popupSettings)
						}
						this.initPlayData(this.childs[this.touchRectNum], false)
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
				
				console.log('this.videoShowFlag: ', this.videoShowFlag)
				console.log('this.isPlayedFlag: ', this.isPlayedFlag)
				if(this.isShowOptionPercentageFlag && !this.isPlayedFlag && this.artworkTree.parentId != 0){
						if(uni.getStorageSync('playMode') == 1){
							this.horizontalOptionPercentageFlag = true
						}else{
							this.verticalOptionPercentageFlag = true
						}
						this.optionPercentageFunction= setTimeout(()=>{
							if(uni.getStorageSync('playMode') == 1){
								this.horizontalOptionPercentageFlag = false
							}else{
								this.verticalOptionPercentageFlag = false
							}
						},5000)	
					}else{
					if(this.bouyNodeFlage  && this.artworkTree.parentId != 0){
						if(uni.getStorageSync('playMode') == 1){
							this.horizontalOptionPercentageFlag = true
						}else{
							this.verticalOptionPercentageFlag = true
						}
						this.optionPercentageFunction= setTimeout(()=>{
							if(uni.getStorageSync('playMode') == 1){
								this.horizontalOptionPercentageFlag = false
							}else{
								this.verticalOptionPercentageFlag = false
							}
						},5000)
					}
				}
				this.duration = e.detail.duration
				let date = this.formatDate(this.duration)
				this.durationStr = date
				console.log('需要重投开始播放吗',this.bouyNodeFlage)
				// 浮标修改
				console.log("!this.bouyNodeFlage",!this.bouyNodeFlage)
				if(!this.bouyNodeFlage) {
					//判断是不是故事线跳转过来的第一个视频 第一个视频需要快进到结尾进行播放
					if(this.isPlayedFlag){
						this.videoContext.seek(parseInt((this.duration -3).toFixed(0)))
						this.isPlayedFlag = false
					}
				}else{
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
				// 浮标改动
				}else if (this.isPosition === 2) {
					// console.log('我又进来了')
					this.showBuoyCanvasFlag = true
					this.initVerticalBuoyCanvas()
				}

			},
			videoTimeupdate(e){

				//获取视频当前时间
				this.currentTime = e.detail.currentTime
								//获取视频当前时间
				if(this.duration - this.currentTime > 0.4){
					this.percent = parseInt(this.currentTime/this.duration*100)
				}else{
					this.percent = 100
				}

				if (this.bouyNodeFlage) {
					// 当前时间
					let newTime = Math.floor(this.currentTime)
					this.buoyNewTime = this.currentTime
					//速度校准
					this.buoySpeedCalibration()
					// 4舍5入 1s会触发4次 所以 ，修改只能1秒一次 （未知效率）
					if (this.buoyCurrentTime == newTime || newTime == 0) {
						// this.buoyCanvas.requestAnimationFrame(() => this.buoyDraw())
						return
					}
					
					//获取视频当前时间
					this.buoyCurrentTime = newTime
					// 遍历 初始化后的可直接用于画图的 类canvas对象2维数组 index 位置下表
					this.canvasNodeBuoyList.forEach((nodeBuoyList, index) => {
						// 变量 为几号位置 数组
						// console.log("nodeBuoyList",nodeBuoyList,"index",index)
						nodeBuoyList.forEach((nodeBuoy) => {

							//当时间相等时
							// console.log('时间',nodeBuoy.buoySectionTime === newTime)
							// console.log(newTime)
							if (nodeBuoy.buoySectionTime === newTime) {

								this.buoyRectList[index] = nodeBuoy
								
								
							}
						})
						this.buoyRef = this.buoyCanvas.requestAnimationFrame(() => this.buoyDraw())
					})
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
					this.videoContext.seek(0)
					this.progressBoxTouchEnd()
				}
			},
			jumpbackVideo(){
				if(!this.suspendFlag){
					let currentTime = this.deepCopy(this.currentTime)
					let targetPlayTime = currentTime - this.duration * 0.15
					if(targetPlayTime < 0){
						this.videoContext.seek(0)
					}else{
						this.videoContext.seek(parseInt(targetPlayTime))
					}
					this.progressBoxTouchEnd()
				}
			},
			suspendVideo(){
				this.videoContext.pause()
				this.suspendFlag = true
				this.progressBoxTouchEnd()
			},
			playVideo(){
				this.videoContext.play()
				this.suspendFlag = false
				this.progressBoxTouchEnd()
			},
			jumpForwardVideo(){
				if(!this.suspendFlag){
					let currentTime = this.deepCopy(this.currentTime)
					let targetPlayTime = currentTime + this.duration * 0.15
					if(targetPlayTime > parseInt(this.duration - 1)){
						this.videoContext.seek(parseInt(this.duration - 1))
					}else{
						this.videoContext.seek(parseInt(targetPlayTime))
					}
					this.progressBoxTouchEnd()
				}
			},
			endVideo(){
				if(!this.suspendFlag){
					this.videoContext.seek(parseInt(this.duration-1))
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
				if(!this.reportType || !this.checkBoxValue){
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
						token: this.token,
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
							this.videoContext.play()
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
				let items = this.items
				let values = e.detail.value
				//那用户最后点击的那个checkbox 实现单选
				const value = values[values.length-1]
				this.checkBoxValue = value
				// console.log('this.checkBoxValue: ',this.checkBoxValue)
				//避免用户单次数的点击导致values为空
				if(!value){return;}
				for (var i = 0, lenI = items.length; i < lenI; ++i) {
					const item = items[i]
					if(value.includes(item.value)){
						this.$set(item,'checked',true)
						this.reportType = item.value
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
			},

			// 浮标方法
			//初始化竖屏canvas画布
			initVerticalBuoyCanvas() {
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

						// canvas.width = 339
						// canvas.height =  603


						// console.log('this.canvasWidth',this.canvasWidth,'this.canvasHeight',this.canvasHeight)

						const ctx = canvas.getContext('2d')
						this.buoyCtx = ctx
						this.initializationBuoyList()
						this.initializationIconPosition()

					})

			},
			// 移动函数
			buoyDraw() {
				// 关闭 动画
				// if (this.buoyRef != null ) {
				// 	this.clearAnimation()
				// }
				this.clearAnimation()
				// console.log(this.rect)
				this.buoyCtx.clearRect(0, 0, this.buoyCanvas.width, this.buoyCanvas.height);
				this.buoyRectList.forEach((v, index) => {
					
					// if (this.playMode) {
						
					// }else {
						// 阻止移动出 指定位置
						if (v.vx > 0) {
							if (v.x >= v.targetX) {
								v.vx = 0
							}
						}
						if (v.vx < 0) {
							if (v.x <= v.targetX) {
								v.vx = 0
							}
						}
						if (v.vy > 0 ) {
							if (v.y >= v.targetY){
								v.vy = 0 
							}
						}
						if (v.vy < 0 ) {
							if (v.y <= v.targetY){
								v.vy = 0 
							}
						}
					// }
					
					if(v != null) {
						v.draw();
						v.x += v.vx;
						v.y += v.vy;
					}

				})
				// console.log('这是第',this.start)
				// this.start +=1

				this.buoyRef = this.buoyCanvas.requestAnimationFrame(() => this.buoyDraw());
			},
			// 初始化 浮标对象
			initializationBuoy(rectX, rectY, rectW, rectH, vx, vy, rectOpacity, nodeId, buoySectionTime, buoyType,targetX,targetY,targetTime) {
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
						this.ctx.rect(this.x, this.y, this.rectW, this.rectH)
						// 闭合路径
						this.ctx.closePath();
						// this.ctx.fillRect(255, 255, 255,0.5);
						this.ctx.fillStyle = "rgba(255, 255, 255," + this.opacity + ")";
						this.ctx.fill()
					}
				}
			},
			// 获取当前播放视频时间
			getNewVideoPlayTime(e) {
				// 当前时间
				let newTime = Math.floor(e.detail.currentTime)
				this.buoyNewTime = e.detail.currentTime
				// console.log('tie',e.detail.currentTime,'newTime',newTime)
				// 4舍5入 1s会触发4次 所以 ，修改只能1秒一次 （未知效率）
				if (this.buoyCurrentTime == newTime || newTime == 0) {
					// this.buoyCanvas.requestAnimationFrame(() => this.buoyDraw())
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
							// console.log(this.buoyRectList)
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
				// console.log(this.ecmArtworkNodeBuoyList)
				let hList = []
				let hLists = uni.getStorageSync('historyNodeBuoyList')
				if (hLists != null && hLists.length > 0 ) {
					hList = hLists
				}
				this.ecmArtworkNodeBuoyList.forEach((nodeBuoyList, index) => {
					
					let aList = []
					
					nodeBuoyList.forEach((v, i) => {
						if (v.buoyType == 0) {
							let hFlage = true
							hList.forEach( hBuoy => {
								if (v.nodeId == hBuoy.nodeId) {
									hFlage = false
								}
							})
							if (hFlage) {
								hList.push(v)
							}
						}
						if (v.buoyType != 2) {
							if (uni.getStorageSync('playMode') == 1) {
								// console.log("横屏")
								let rectOpacity = (v.buoyOpacity - 0) /100

								let rectX = parseInt(( (1 - (v.buoyCoordinateY - 0)  - (v.buoyHigh - 0))* this.canvasWidth).toFixed(0))
								// console.log('矩形框的x轴坐标: ',rectX)
								let rectY = parseInt(((v.buoyCoordinateX  - 0) * this.canvasHeight).toFixed(0))
								// console.log('矩形框的y轴坐标: ',rectY,'矩形框的x轴坐标: ',rectX)
								//矩形框高度
								let  rectW= parseInt(((v.buoyHigh - 0) * this.canvasWidth).toFixed(0))
								// console.log('矩形框的高: ',rectH)
								//矩形框宽度
								let  rectH= parseInt(((v.buoyWide - 0) * this.canvasHeight).toFixed(0))
								// 浮标出现的时间 
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
								aList.push(buoy)
							}else {
								// console.log("竖屏")
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
								aList.push(buoy)
							}

						} else {
							let buoy = this.initializationBuoy(0, 0, 0, 0, 0, 0, 0, v.fkNodeId,  parseInt(v.buoySectionTime - 0) , v.buoyType,0,0,0)
							aList.push(buoy)
						}

					})
					this.canvasNodeBuoyList.push(aList)
					// console.log("这是初始化",this.canvasNodeBuoyList[0])
				})
				uni.setStorageSync('historyNodeBuoyList',hList)
				
			},
			// canvas 触摸事件
			canvasBuoyTouchstart(e) {
				// 获取当前的xy
				let newX = e.changedTouches[0].x
				// 获取 当前y
				let newY = e.changedTouches[0].y
				// 获取当前 移动对象的 数组
				let nowBuoyRectList = this.deepCopy(this.buoyRectList)

				let stopFlag = false
				// console.log('nowBuoyRectList',nowBuoyRectList)
				// console.log('newY',newY,'newX',newX)
				// console.log('nowBuoyRectList',nowBuoyRectList)

				nowBuoyRectList.forEach((v, i) => {
					if (v != null) {


						if (v.x <= newX && (v.x + v.rectW) >= newX) {
							// 加10 增加判定区域
							if (v.y <= newY && (v.y + v.rectH) >= newY) {
								// console.log("我出发了选项点击")
								this.optionIndex = i
								this.clickCommonOptionTodo(i)
								stopFlag= true
								return
							}
						}

						// if(uni.getStorageSync('playMode') === 1) {
						// 	console.log("横屏")
						// 	if (v.x <= newX && (v.x + v.rectH) >= newX) {
						// 		// 加10 增加判定区域
						// 		if (v.y <= newY && (v.y + v.rectW + 10) >= newY) {
						// 			console.log("我出发了选项点击")
						// 			this.optionIndex = i
						// 			this.clickCommonOptionTodo(i)
						// 			stopFlag= true
						// 			return
						// 		}
						// 	}

						// }else{
						// 	console.log("竖屏")
						// 	if (v.x <= newX && (v.x + v.rectH) >= newX) {
						// 		// 加10 增加判定区域
						// 		if (v.y <= newY && (v.y + v.rectW + 10) >= newY) {
						// 			console.log("我出发了选项点击")
						// 			this.optionIndex = i
						// 			this.clickCommonOptionTodo(i)
						// 			stopFlag= true
						// 			return
						// 		}
						// 	}
						// }
					}
				})

				if(stopFlag) {
					return
				}

				if (this.storyLineBoxWidthMin<= newX && this.storyLineBoxWidthMax>= newX) {
					if (this.storyLineBoxHeightMin <= newY && this.storyLineBoxHeightMax >= newY) {
						console.log("故事线")
						this.showBuoyCanvasFlag = false

						this.stopBuoyDraw()
						this.showStoryLineContent()
						return
					}
				}
				if (this.reportBoxWidthMin<= newX && this.reportBoxWidthMax>= newX) {
					if (this.reportBoxHeightMin <= newY && this.reportBoxHeightMax >= newY) {
						console.log("举报")
						this.showBuoyCanvasFlag = false

						this.stopBuoyDraw()
						this.showReportContent()
						return
					}
				}
				if (this.seeMoreBoxWidthMin<= newX && this.seeMoreBoxWidthMax>= newX) {
					if (this.seeMoreBoxHeightMin <= newY && this.seeMoreBoxHeightMax >= newY) {
						this.showBuoyCanvasFlag = false
						console.log("更多")

						this.goDiscover()
						this.stopBuoyDraw()
						return
					}
				}
				if (this.returnToPreviouWidthMin<= newX && this.returnToPreviouWidthMax>= newX) {
					if (this.returnToPreviouHeightMin <= newY && this.returnToPreviouHeightMax >= newY) {
						this.showBuoyCanvasFlag = false
						console.log("返回上级")
						this.returnToPrevious()
						this.stopBuoyDraw()
						return
					}
				}
				if (this.advertisingDivWidthMin <= newX && this.advertisingDivWidthMax>= newX) {
					if (this.advertisingDivHeightMin <= newY && this.advertisingDivHeightMax >= newY) {
						console.log("广告")
						this.showBuoyCanvasFlag = false
						this.showDialog()
						// this.$refs.verticalAdvertising.showAdvertising()
						return
					}
				}
			},
			// 清除浮标
			clearNodeBuoyInfo() {
				this.clearAnimation()
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

			},
			// 初始化 图标定位
			initializationIconPosition() {
				let windowSize = uni.getStorageSync('windowSize')
				let ww =  windowSize.windowWidth
				let wh =  windowSize.windowHeight
				let cw = ((ww - this.canvasWidth) * 0.5)
				let ch = ((wh - this.canvasHeight) * 0.5)

				if (uni.getStorageSync('playMode')) {
					// console.log('cw',cw,'ch',ch)
					// 故事线 图标位置
					this.storyLineBoxWidthMin = ww - cw - this.getPxbyRpx(140)
					this.storyLineBoxWidthMax =  this.storyLineBoxWidthMin + this.getPxbyRpx(80)
					this.storyLineBoxHeightMin = (wh * 0.6) - ch - this.getPxbyRpx(60)

					this.storyLineBoxHeightMax = this.storyLineBoxHeightMin + this.getPxbyRpx(100)

					// 举报   图标位置
					this.reportBoxWidthMin = this.storyLineBoxWidthMin
					this.reportBoxWidthMax = this.storyLineBoxWidthMax
					this.reportBoxHeightMin = (wh * 0.7) - ch - this.getPxbyRpx(60)
					this.reportBoxHeightMax = this.reportBoxHeightMin + this.getPxbyRpx(100)

					// 更多   图标位置
					this.seeMoreBoxWidthMin = this.storyLineBoxWidthMin
					this.seeMoreBoxWidthMax = this.storyLineBoxWidthMax
					this.seeMoreBoxHeightMin = (wh * 0.8) - ch - this.getPxbyRpx(60)
					this.seeMoreBoxHeightMax = this.seeMoreBoxHeightMin + this.getPxbyRpx(100)

					// 返回上一级   图标位置
					this.returnToPreviouWidthMin = this.storyLineBoxWidthMin
					this.returnToPreviouWidthMax = this.storyLineBoxWidthMax
					this.returnToPreviouHeightMin = (wh * 0.9) - ch - this.getPxbyRpx(60)
					this.returnToPreviouHeightMax = this.returnToPreviouHeightMin + this.getPxbyRpx(100)

					// 广告 位置
					this.advertisingDivWidthMin = ww - this.getPxbyRpx(80) - cw
					this.advertisingDivWidthMax = this.advertisingDivWidthMin + this.getPxbyRpx(60)
					this.advertisingDivHeightMin= this.getPxbyRpx(40)- ch
					this.advertisingDivHeightMax = this.advertisingDivHeightMin  + this.getPxbyRpx(250)

					// console.log("宽",this.advertisingDivWidthMin  ,this.advertisingDivWidthMax  )
					// console.log("高",this.advertisingDivHeightMin ,this.advertisingDivHeightMax )

				}else {
					// console.log('cw',cw,'ch',ch)
					// 故事线 图标位置
					this.storyLineBoxWidthMax = (ww * 0.94) - cw
					this.storyLineBoxHeightMin = (wh * 0.37) - ch
					this.storyLineBoxWidthMin = this.storyLineBoxWidthMax  - this.getPxbyRpx(100)
					this.storyLineBoxHeightMax = this.storyLineBoxHeightMin + this.getPxbyRpx(80)

					// 举报   图标位置
					this.reportBoxWidthMin = this.storyLineBoxWidthMin
					this.reportBoxWidthMax = this.storyLineBoxWidthMax
					this.reportBoxHeightMin = (wh * 0.45) - ch
					this.reportBoxHeightMax = this.reportBoxHeightMin + this.getPxbyRpx(80)

					// 更多   图标位置
					this.seeMoreBoxWidthMin = this.storyLineBoxWidthMin
					this.seeMoreBoxWidthMax = this.storyLineBoxWidthMax
					this.seeMoreBoxHeightMin = (wh * 0.53) - ch
					this.seeMoreBoxHeightMax = this.seeMoreBoxHeightMin + this.getPxbyRpx(80)

					//返回上一级   图标位置
					this.returnToPreviouWidthMin = this.storyLineBoxWidthMin
					this.returnToPreviouWidthMax = this.storyLineBoxWidthMax
					this.returnToPreviouHeightMin = (wh * 0.61) - ch
					this.returnToPreviouHeightMax = this.returnToPreviouHeightMin + this.getPxbyRpx(80)

					// 广告 位置
					this.advertisingDivWidthMin = this.getPxbyRpx(60) - cw
					this.advertisingDivWidthMax = this.advertisingDivWidthMin + this.getPxbyRpx(250)
					this.advertisingDivHeightMin= this.getPxbyRpx(40)- ch
					this.advertisingDivHeightMax = this.advertisingDivHeightMin + this.getPxbyRpx(60)

					// console.log("宽",this.advertisingDivWidthMin  ,this.advertisingDivWidthMax  )
					// console.log("高",this.advertisingDivHeightMin ,this.advertisingDivHeightMax )

				}

			},
			// rpx -》 rpx  方法
			getPxbyRpx(rpx) {
				return rpx / 750 * uni.getStorageSync('windowSize').windowWidth;
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
			// (rectX, rectY, rectH, rectW, vx, vy, rectOpacity, nodeId, buoySectionTime, buoyType)
			// 浮标 视频回复方法
			recoveryBuoyDraw(){
				// 复制方式
				// this.stopBuoyRectList.forEach((v,i) => {
				// 	console.log(v)
				// 	this.buoyRectList.push(this.initializationBuoy(v.x,v.y,v.rectW,v.rectH,v.vx,v.vy,v.opacity,v.nodeId,v.buoySectionTime,v.buoyType))
				// })
				// console.log('this.buoyRectList111 ',this.buoyRectList )
				//视频回复
				this.videoContext.play()
				//canvas 回来
				this.showBuoyCanvasFlag = true
				// 动画开启
				this.buoyRef = this.buoyCanvas.requestAnimationFrame(() => this.buoyDraw())
				// if (this.bouyNodeFlage) {
				// 	this.showBuoyCanvasFlag = true
				// 	this.buoyRef = this.buoyCanvas.requestAnimationFrame(() => this.buoyDraw())
				// }

			},
			// 速度校准方法
			buoySpeedCalibration(){
				// 时间  当前位置  距离  =》  新的 速度
				
				// console.log('当前时间',this.currentTime)
				this.clearAnimation()
				// this.currentTime 
				this.buoyRectList.forEach( (buoyRect,index) => {
					if ((buoyRect.targetTime - this.currentTime ) > 0) {
						buoyRect.vx =( buoyRect.targetX - buoyRect.x)/( (buoyRect.targetTime - this.currentTime )  * 58)
						buoyRect.vy = (buoyRect.targetY - buoyRect.y)/ ( (buoyRect.targetTime  - this.currentTime )  * 58)
					}
				})

				this.buoyRef = this.buoyCanvas.requestAnimationFrame(() => this.buoyDraw())
			},
			//视频进入 缓冲
			waitingVideo() {
				if (this.bouyNodeFlage) {
					this.waitingVideoFlag = true
					this.stopBuoyDraw()
				}
			},
			// 浮标 加光回调
			bouyClickCommonOptionTodo() {
				if (this.bouyNodeFlage ) {
					// 浮标改动不稳定
					if(this.isVideoEndFlag){
						if(this.isVideoEndFlag){
							this.optionIndex = 0
							this.clickCommonOptionTodo(0)
						}
					}else{
						this.clickCommonOptionTodo(this.optionIndex)
					}
				}
			},
			// 浮标 加光回调 监听
			isBouyClickCommonOptionTodo(){
				globalBus.$on('bouyClickCommonOptionTodo',() => {
					this.bouyClickCommonOptionTodo()
				})
			},

		}
	}
</script>

<style lang="scss" >
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
