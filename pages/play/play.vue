<template>
	<view class="playBox">
		<view class="play">
			<view class="videoBox">
				<video :src="videoUrl" autoplay="true" direction="0" show-mute-btn="true" 
				show-fullscreen-btn="false" id="myVideo" enable-play-gesture="true" @ended="videoEnd"></video>
			</view>
			<view class="chooseTipsMask16" v-if="chooseTipsShowFlag">
				<view class="chooseTips" >
					<view class="closeBox" @click="closeChooseTips">
						<icon class="closeIcon"></icon>
					</view>
					<view class="title">请做出你的选择</view>
					<view class="splitLine"></view>
					<view class="tips" v-for="(item, index) in tipsArray" :key="index">
						<view class="optionBox" @touchstart="changeBackground(index)" @touchend="rebackBackground(index)" :style="{'background': background[index]}">
							<view class="option">{{option[index]}}</view>
						</view>
					</view>
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
				option: ["我是选项1","我是选项2","我是选项3","我是选项4"],
				background: ["","","",""],
				chooseTipsShowFlag: false,
				storyLineContentFlag: false,
				reportContentFlag: false,
				artworkId: 113,
				detailId: 0,
				playedHistoryArray: [],
				childs: [],
				tipsArray: []
			}
		},
		onReady(){
			let artworkTree = uni.getStorageSync("artworkTree");
			if(artworkTree == null || typeof(artworkTree) == "undefined" || artworkTree.length == 0){
				this.getArtworkTree();
			}else{
				//初始化数据
				this.initPlayData(artworkTree);
			}
		},
		methods: {
			initPlayData(artworkTree){
				//初始化视频及选项
				this.videoUrl = artworkTree.videoUrl;
				this.playedHistoryArray.push(artworkTree.pkDetailId);
				this.savaPlayRecord();
				let childs = artworkTree.childs;
				if(childs){
					this.tipsArray.length = childs.length;
					for(let i = 0;i < childs.length;i++){
						this.childs.splice(i,1,childs[i]);
						this.option[i] = childs[i].selectTitle;
					}
					console.log(this.childs);
				}
			},
			async getArtworkTree(){
				await uni.request({
					url: baseURL + "/wxPlay/playArtWork",
					method: 'POST',
					dataType: 'json',
					data: {
						pkArtworkId: this.artworkId
					},
					success: res=> {
						uni.setStorageSync("artworkTree",res.data.data);
						this.detailId = res.data.data.pkDetailId;
						this.initPlayData(res.data.data);
					}
				})
			},
			async savaPlayRecord(){
				await uni.request({
					url: baseURL + "/wxPlay/savaPlayRecord",
					method: 'POST',
					dataType: 'json',
					data: {
						pkArtworkId: this.artworkId,
						userId: uni.getStorageSync("userId"),
						detailId: this.detailId
					},
					success: res=> {
						if(res.data.status == 200){
							console.log("我去存数据"+this.detailId+":"+ this.artworkId)
						}
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
				}
			},
			rebackBackground(index){
				switch(index){
					case 0: {
						this.background.splice(index,1,"");
						this.chooseTipsShowFlag = false
						this.initPlayData(this.childs[index])
						break;
					}
					case 1: {
						this.background.splice(index,1,"");
						this.chooseTipsShowFlag = false
						this.initPlayData(this.childs[index])
						break;
					}
					case 2: {
						this.background.splice(index,1,"");
						this.chooseTipsShowFlag = false
						this.initPlayData(this.childs[index])
						break;
					}
					case 3: {
						this.background.splice(index,1,"");
						this.chooseTipsShowFlag = false
						this.initPlayData(this.childs[index])
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
				.chooseTipsMask16{
					background-color: rgba(255,255,255,.9);
					position: fixed;
					left: 10%;
					top: 50%;
					width: 80%;
					height: 38%;
					z-index: 16;
					.chooseTips{
						width: 100%;
						height: 100%;
						z-index: 25;
						background-color: rgba(0,0,0,.3);
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
						.tips{
							.optionBox{
								width: 100%;
								margin: 0 auto;
								line-height: 80rpx;
								display: flex;
								justify-content: space-between;
								.option{
									color: white;
									padding-left: 20rpx;
								}
							}
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