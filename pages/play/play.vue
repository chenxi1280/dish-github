<template>
	<view class="playBox">
		<view class="play">
			<view class="videoBox">
				<video :src="videoUrl" autoplay="true" direction="0" show-mute-btn="true" 
				show-fullscreen-btn="false" id="myVideo" enable-play-gesture="true" @ended="videoEnd"></video>
			</view>
			<view class="chooseTips" v-if="chooseTipsShowFlag">
				<view class="closeBox" @click="closeChooseTips">
					<icon class="closeIcon"></icon>
				</view>
				<view class="title">请做出你的选择</view>
				<view class="splitLine"></view>
				<view class="option1Box" @touchstart="changeBackground(1)" @touchend="rebackBackground(1)"  :style="{'background': background1}">
					<view class="option1">{{option1Value}}</view>
				</view>
				<view class="option2Box" @touchstart="changeBackground(2)" @touchend="rebackBackground(2)" :style="{'background': background2}">
					<view class="option2">{{option2Value}}</view>
				</view>
				<view class="option3Box" @touchstart="changeBackground(3)" @touchend="rebackBackground(3)" :style="{'background': background3}">
					<view class="option3">{{option3Value}}</view>
				</view>
				<view class="option4Box" @touchstart="changeBackground(4)" @touchend="rebackBackground(4)" :style="{'background': background4}">
					<view class="option4">{{option4Value}}</view>
				</view>
			</view>
			<view class="storyLineBox" @click="showStoryLineContent">
				<view class="storyLine">故事线</view>
			</view>
			<view class="reportBox" @click="showReportContent">
				<view class="report">举报</view>
			</view>
			<view class="storyLineContentMask16" v-if="storyLineContentFlag">
				<view class="storyLineContentBox">
					<view class="closeBox" @click="closeStoryLineContent">
						<icon class="closeIcon"></icon>
					</view>
					<view class="title">故事线</view>
					<view class="splitLine"></view>
					<view class="storyLineContent"></view>
				</view>
			</view>
			<view class="reportContentMask16" v-if="reportContentFlag">
				<view class="reportContentBox">
					<view class="closeBox" @click="closeReportContent">
						<icon class="closeIcon"></icon>
					</view>
					<view class="title">举报</view>
					<view class="splitLine"></view>
					<view class="reportContent"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { baseURL } from '../login/config/config.js'
	export default {
		data() {
			return {
				videoUrl: "http://1259381296.vod2.myqcloud.com/68c83cf0vodcq1259381296/f500ff0e5285890801715884127/MEh0MnydAY8A.mp4",	
				option1Value: "我是选项1",
				option2Value: "我是选项2",
				option3Value: "我是选项3",
				option4Value: "我是选项4",
				background1: "",
				background2: "",
				background3: "",
				background4: "",
				chooseTipsShowFlag: false,
				storyLineContentFlag: false,
				reportContentFlag: false
			}
		},
		onReady(){
			this.getVideoUrl();
		},
		methods: {
			async getVideoUrl(){
				await uni.request({
					url: baseURL + "/wxPlay/playArtWork",
					method: 'POST',
					dataType: 'json',
					data: {
						pkArtworkId: 113
					},
					success: res=> {
						console.log(res)
						console.log(res.data.data)
					}
				})
			},
			videoEnd(){
				this.chooseTipsShowFlag = true
			},
			showStoryLineContent(){
				this.storyLineContentFlag = true
			},
			showReportContent(){
				this.reportContentFlag = true
			},
			changeBackground(index){
				switch(index){
					case 1: {
						this.background1 = "#96CDCD";
						break;
					}
					case 2: {
						this.background2 = "#96CDCD";
						break;
					}
					case 3: {
						this.background3 = "#96CDCD";
						break;
					}
					case 4: {
						this.background4 = "#96CDCD";
						break;
					}
				}
			},
			rebackBackground(index){
				switch(index){
					case 1: {
						this.background1 = "";
						break;
					}
					case 2: {
						this.background2 = "";
						break;
					}
					case 3: {
						this.background3 = "";
						break;
					}
					case 4: {
						this.background4 = "";
						break;
					}
				}
			},
			closeChooseTips(){
				this.chooseTipsShowFlag = false
			},
			closeStoryLineContent(){
				this.storyLineContentFlag = false
			},
			closeReportContent(){
				this.reportContentFlag = false
			}
		}
	}
</script>

<style lang="scss" >
	page{
		width: 100%;
		height: 100%;
		.playBox{
			width: 100%;
			height: 100%;
			.play{
				width: 100%;
				height: 100%;
				.videoBox{
					width: 100%;
					height: 100%;
					video{
						width: 100%;
						height: 100%;
					}
				}
				.chooseTips{
					position: fixed;
					left: 10%;
					top: 50%;
					width: 80%;
					height: 38%;
					z-index: 25;
					background-color: rgba(255,255,255,.5);
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
					.splitLine{
						border: 2rpx solid #D3D3D3;
						width: 80%;
						margin: 0 auto;
					}
					.option1Box{
						width: 100%;
						margin: 0 auto;
						margin-top: 30rpx;
						line-height: 80rpx;
						display: flex;
						justify-content: space-between;
						.option1{
							color: white;
							padding-left: 20rpx;
						}
						.selectedFlag1{
							color: white;
							padding-right: 20rpx;
						}
					}
					.option2Box{
						width: 100%;
						margin: 0 auto;
						line-height: 80rpx;
						display: flex;
						justify-content: space-between;
						.option2{
							color: white;
							padding-left: 20rpx;
						}
						.selectedFlag2{
							color: white;
							padding-right: 20rpx;
						}
					}
					.option3Box{
						width: 100%;
						margin: 0 auto;
						line-height: 80rpx;
						display: flex;
						justify-content: space-between;
						.option3{
							color: white;
							padding-left: 20rpx;
						}
						.selectedFlag3{
							color: white;
							padding-right: 20rpx;
						}
					}
					.option4Box{
						width: 100%;
						margin: 0 auto;
						line-height: 80rpx;
						display: flex;
						justify-content: space-between;
						.option4{
							color: white;
							padding-left: 20rpx;
						}
						.selectedFlag4{
							color: white;
							padding-right: 20rpx;
						}
					}
				}
				.storyLineBox{
					position: fixed;
					right: 40rpx;
					top: 40rpx;
					height: 80rpx;
					width: 120rpx;
					z-index: 15;
					background-color: rgba(255,255,255,.5);
					border-radius: 50%;
					.storyLine{
						color: white;
						line-height: 80rpx;
						padding-left: 18rpx;
					}
				}
				.reportBox{
					position: fixed;
					left: 40rpx;
					top: 40rpx;
					height: 80rpx;
					width: 120rpx;
					z-index: 15;
					background-color: rgba(255,255,255,.5);
					border-radius: 50%;
					.report{
						color: white;
						line-height: 80rpx;
						padding-left: 32rpx;
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
			}
		}
	}
	
	
</style>