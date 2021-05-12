<template>
	<view class="horizontalButtonMenu">
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
		<!-- open-type="share" -->
		<view class="shareBox" @click="share">
			<view class="shareIconBox">
				<icon class="shareIcon"></icon>
			</view>
			<view class="share">分享</view>
		</view>
		<button open-type="share" class="shareButton"></button>
		<!-- 故事线内容呈现在蒙板之上 -->
		<view class="storyLineContentMask16" v-if="storyLineContentFlag" style="z-index: 999;">
			<view class="storyLineContentBox">
				<view class="closeBox" @click="closeStoryLineContent">
					<icon class="closeIcon"></icon>
				</view>
				<view class="title">故事线</view>
				<view class="splitLine"></view>
				<view class="storyLineContent">
					<horizontalStoryLine :pkArtworkId="artworkId" :pkDetailIds="playedHistoryArray"></horizontalStoryLine>
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
									<checkbox :value="item.value" :checked="item.checked"/>
								</view>
								<view class="nameBox">
									<view class="name">{{item.name}}</view>
								</view>
							</label>
						</checkbox-group>
					</view>
					<view class="content_tips">为帮助审核人员尽快处理，请补充详细信息</view>
					<view class="uni-textarea">
						<textarea v-model="textareaContent" style="background-color: #e5e5e5;padding: 10rpx;box-sizing: border-box;" />
						</view>
					<view class="uploadBox">
						<view class="subTitle">上传图片</view>
						<view class="uploadBtnBox" v-if="uploadBtnFlag" @click="uploadImage">
							<view class="add_btn">
								<view></view>
								<view></view>
							</view>
						</view>
						<view class="uploadImageBox" v-if="uploadImageFlag" @click="uploadImage">
							<image :src="headImage" mode="scaleToFill"></image>
						</view>
					</view>
					<u-button type="error" style="margin-top: 20rpx;display: inline-block; width: 90%;margin-left: 5%;" @click="submit">提交举报</u-button>
				</view>
			</view>
		</view>
		
		<u-modal v-model="returnToPreviouShow" title="温馨提示" :show-confirm-button="false" z-index="999">
			<view class="slot-content">
				<view style="padding: 0 20rpx;padding-top: 40rpx;">
					<view style="text-align: center;">
						<view >别点了，真的回不去了</view>
					</view>
					<view @click="returnToPreviouConfirm" style="padding: 20rpx;background-color: #985ba9;
																width: 400rpx;margin-left: calc(50% - 200rpx); 
																margin-top: 60rpx;text-align: center;
																border-radius: 10rpx;margin-bottom: 40rpx;">
						<view style="display: inline-block;margin-left: 10rpx;color: #fff;transform: translateY(-4rpx);">确定</view>
					</view>
				</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import { baseURL } from '../../../pages/dishover/config/config.js'
	import { horizontalStoryLine } from '../storyLine/horizontalStoryLine.vue'
	export default {
		components: {
			horizontalStoryLine,
		},
		props: {
			//故事线flag true表示展示竖版的故事线
			storyLineFlag: {
				type: Boolean,
				default: true
			},
			parentId: {
				type: Number,
				default: 0
			},
			artworkId: {
				type: Number,
				default: 0
			},
			multipleResultLine: {
				type: Array,
				default: null
			},
			bouyNodeFlage: {
				type: Boolean,
				default: false
			},
			artworkTree: {
				type: Object,
				default: null
			},
			//故事线跳回重置多结局作品的结局视频关闭故事线的回调标志
			multipleResultReplayFlag: {
				type: Boolean,
				default: false
			},
			playedHistoryArray: {
				type: Array,
				default: null
			},
			singlePageFlag: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				//是否展示返回上一级提示弹窗
				returnToPreviouShow: false,
				//是否展示举报开关
				reportContentFlag: false,
				//是否展示故事线开关
				storyLineContentFlag: false,
				//是否显示上传图片按钮开关
				uploadBtnFlag: true,
				//上传图片展示开关
				uploadImageFlag: false,
				//举报类型
				reportType: "",
				//举报内容
				textareaContent: "",
				//云端举报图片url
				headImage: "",
				//举报页面复选框的内容
				checkBoxValue: null,
				//举报类型选项数组
				items: [{
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
			}
		},
		onLoad() {
			uni.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage', 'shareTimeline']
			})
		},
		onShareAppMessage(res) {
			let artworkInfo = uni.getStorageSync('artworkInfo')
			let param = 'artWorkId=' + artworkInfo.pkArtworkId + '=status=4'
			let title = artworkInfo.artworkName
			let imageUrl = artworkInfo.artworkDescribe
			if (artworkInfo.artworkStatus !== 4) {
				param = 'artWorkId=' + artworkInfo.pkArtworkId + '=status=1'
				title = '灵巫互动'
				imageUrl =
					'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/baseImg/1605600100857%E5%9C%86%E5%BD%A2%E7%94%A8JPG.jpg'
			}
			return {
				title: title,
				imageUrl: imageUrl,
				path: 'pages/play/play?scene=' + param
			}
		
		},
		methods: {
			//提交举报
			async submit() {
				if (!this.reportType || !this.checkBoxValue) {
					return uni.showToast({
						icon: 'none',
						title: '请选择举报类型'
					})
				}
				const regPhone = /([\u4e00-\u9fa5]|[\（\）\《\》\——\；\，\。\“\”\<\>\！\？]){8}/.test(this.textareaContent);
				if (!regPhone) {
					return uni.showToast({
						icon: 'none',
						title: '请填写举报内容，不少于8个字'
					})
				}
				await uni.request({
					url: baseURL + "/wxPlay/savaReportInfo",
					method: 'POST',
					dataType: 'json',
					data: {
						imgUrl: this.headImage,
						content: this.textareaContent,
						reportStatue: this.reportType,
						token: uni.getStorageSync('token'),
						fkArtworkNodeId: uni.getStorageSync("detailId"),
						fkArtworkId: this.artworkId
					},
					success: res => {
						console.log("res:",res)
						console.log("res:",res.data.status)
						if (res.data.status == 200) {
							uni.showToast({
								icon: 'none',
								title: "举报成功,待管理员审核",
								position: 'center'
							})
							this.reportContentFlag = false
							//举报提交之后接着播放
							this.$parent.videoContext.play()
							this.items = [{
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
			// 举报页面上传截图到腾讯云
			uploadImage() {
				var COS = require('cos-wx-sdk-v5');
				let that = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['original'],
					sourceType: ['album', 'camera'],
					success: res => {
						//显示上传loading
						uni.showLoading({
							title: '加载中',
							mask: true
						});
						uni.request({
							url: baseURL + "/artworkMaking/findCosSingature",
							method: 'POST',
							success: result => {
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
								let Key = filePath.substr(filePath.lastIndexOf('/') + 1);
								let dateObj = new Date();
								let timestamp = dateObj.getTime();
								let nowDate = dateObj.toLocaleDateString();
								//格式斜杠日期
								let formatDate = nowDate.replace(/\//g, '-');
								//cos上定义目录
								let newKey = formatDate + '/' + timestamp + Key;
								let tempObj = {};
								tempObj.imgLocation = 'https://' + 'sike-1259692143' + '.cos.' + 'ap-chongqing' + '.myqcloud.com/' +
									newKey; //返回上传的绝对 URL
								//SDK 提供的cos上传函数，如果想批量上传，可以在这里加上for循环。
								cos.postObject({
									//存储桶名称
									Bucket: 'sike-1259692143',
									//地域名字
									Region: 'ap-chongqing',
									Key: newKey,
									//本地文件临时地址
									FilePath: filePath,
								}, function(err, data) {
									if (err) {
										wx.showModal({
											title: '返回错误',
											content: '请求失败' + err,
											showCancel: false
										})
									} else {
										if (data) {
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
			
			//举报页面复选框
			checkboxChange(e) {
				let items = this.items
				let values = e.detail.value
				//那用户最后点击的那个checkbox 实现单选
				const value = values[values.length - 1]
				this.checkBoxValue = value
				// console.log('this.checkBoxValue: ',this.checkBoxValue)
				//避免用户单次数的点击导致values为空
				if (!value) {
					return;
				}
				for (var i = 0, lenI = items.length; i < lenI; ++i) {
					const item = items[i]
					if (value.includes(item.value)) {
						this.$set(item, 'checked', true)
						this.reportType = item.value
					} else {
						this.$set(item, 'checked', false)
					}
				}
			},
			//点击举报关闭按钮触发事件
			closeReportContent() {
				this.reportContentFlag = false
				this.items = [{
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
				this.$parent.videoContext.play()
				// 浮标修改
				if (this.bouyNodeFlage) {
					this.$parent.recoveryBuoyDraw()
				}
			},
			//点击故事线关闭按钮触发事件
			closeStoryLineContent() {
				//新需求统一逻辑故事线关闭需要重头播放并且展示视频的前后弹窗
				if (uni.getStorageSync('isEndings') == 1) {
					if (this.multipleResultReplayFlag) {
						this.storyLineContentFlag = false
						//是否存放播放记录的标志 开关故事线重播但是不保存播放记录
						this.$parent.closeStoryLineReplayFlag = true
						this.$parent.multipleResultCallbackTodo(false)
					} else {
						this.storyLineContentFlag = false
						this.$parent.closeStoryLineReplayFlag = true
						this.$parent.initPlayData(this.artworkTree, false)
					}
				} else {
					this.storyLineContentFlag = false
					this.$parent.closeStoryLineReplayFlag = true
					this.$parent.clearNodeBuoyInfo()
					this.$parent.initPlayData(this.artworkTree, false)
				}
			
			},
			//展示举报内容的时候暂停视频
			showReportContent() {
				this.reportContentFlag = true
				this.uploadBtnFlag = true
				this.uploadImageFlag = false
				this.$parent.videoContext.pause()
			},
			showStoryLineContent() {
				console.log("**********showStoryLineContent")
				this.storyLineContentFlag = true
				if (uni.getStorageSync('isEndings') == 1) {
					this.$parent.videoShowFlag = false
				}
				//需求要求统一逻辑故事线打开关闭都需要重新播放
				this.$parent.videoContext.seek(0)
				//暂停视屏
				this.$parent.videoContext.pause()
			},
			goDiscover() {
				//单页面模式的时候使用 switchTab
				if(this.singlePageFlag){
					console.log("jump for switchTab mode")
					this.$parent.singlePageFlag = false
					uni.switchTab({
						url: '../dishover/dishover'
					})
				}else{
					console.log("jump for navigateBack mode")
					uni.navigateBack({
						delta: 1,
						fail(err) {
							console.log('跳转失败:', err)
							uni.switchTab({
								url: '../dishover/dishover'
							})
						}
					})
				}
			},
			//返回上级
			returnToPrevious() {
				//设置返回上一级开关 给是否快进视频做标识
				this.$parent.returnToPreviousFlag = true
				//若parentId是0或-1时点击返回上一级弹框提示（parentId为0根节点为-1多结局作品的结局视频）
				if (this.parentId == -1 || this.parentId == 0) {
					if (this.bouyNodeFlage) {
						 this.$parent.stopBuoyDraw()
					} else {
						this.$parent.videoContext.pause()
					}
					//若作品结构只有两级此时返回到上一级就直接到开场了不会走故事线跳转逻辑所以要把弹故事线开关重置
					this.endFlag = true
					return this.returnToPreviouShow = true
				}
				//返回上一级时如果是开场不去获取百分比
				if (this.startDetailId == this.parentId) {
					this.$parent.isShowOptionPercentageFlag = false
				}
				let pkDetailIds = JSON.parse(uni.getStorageSync("pkDetailIds"))
				//获取浮标视频的选项初始渲染时间
				let historyNodeBuoyList = uni.getStorageSync("historyNodeBuoyList")
				for (let i = 0; i < historyNodeBuoyList.length; i++) {
					let currentId = historyNodeBuoyList[i].fkNodeId
					let detailId = pkDetailIds[pkDetailIds.length - 1]
					console.log("************detailId return: ", detailId)
					//此处还是不能使用this.detailId来对比要使用历史记录的来对比 因为返回的节点可能是跳转节点
					if (currentId == detailId) {
						this.$parent.bouySectionTime = historyNodeBuoyList[i].buoySectionTime
						console.log("*************bouySectionTime1: ", this.bouySectionTime)
						break
					}
				}
				let ecmArtworkNodeActionVOList = this.$parent.ecmArtworkNodeActionVOList
				for (let i = 0; i < ecmArtworkNodeActionVOList.length; i++) {
					let currentId = ecmArtworkNodeActionVOList[i].fkNodeId
					let detailId = pkDetailIds[pkDetailIds.length - 1]
					console.log("************detailId return: ", detailId)
					//此处还是不能使用this.detailId来对比要使用历史记录的来对比 因为返回的节点可能是跳转节点
					if (currentId == detailId) {
						this.$parent.actionSectionTime = ecmArtworkNodeActionVOList[i].actionSectionTime
						console.log("*************actionSectionTime1: ", this.actionSectionTime)
						break
					}
				}
				// console.log("************pkDetailIds: ",pkDetailIds)
				//返回上一级不使用parentId 使用播放历史记录的倒数第二个detailid
				let currentDetailId = pkDetailIds[pkDetailIds.length - 2]
				// console.log("************currentDetailId: ",currentDetailId)
				//砍掉倒数两个detailId 因为播放时会再存一次当前的播放记录
				pkDetailIds.splice(pkDetailIds.length - 2, 2)
				// console.log("************pkDetailIds: ",pkDetailIds)
				this.$parent.playedHistoryArray = pkDetailIds
				// console.log("************playedHistoryArray: ",this.playedHistoryArray)
				uni.setStorageSync("pkDetailIds", JSON.stringify(pkDetailIds))
				//将多结局作品的路径砍掉 对照着播放历史截取
				if (uni.getStorageSync('isEndings') == 1) {
					let multipleResultLine = uni.getStorageSync("multipleResultLine")
					//砍掉倒数第一个多结局作品的线路记录
					multipleResultLine.splice(multipleResultLine.length - 1, 1)
					this.$parent.multipleResultLine = multipleResultLine
					uni.setStorageSync("multipleResultLine", this.multipleResultLine)
				}
				//走故事线逻辑 组装option参数
				let option = {
					"pkArtworkId": this.artworkId,
					"pkDetailId": currentDetailId,
					"jumpFlag": true
				}
				this.$parent.storyLineJumpPlayTodo(option)
			},
			//返回上一级弹窗的确认事件
			returnToPreviouConfirm() {
				if (this.bouyNodeFlage) {
					this.$parent.recoveryBuoyDraw()
				} else {
					this.$parent.videoContext.play()
				}
				this.returnToPreviouShow = false
			},
		}
	}
</script>

<style lang="scss">
	page {
	  width: 100%;
	  height: 100%;
	}
	.horizontalButtonMenu{
		z-index: 90;
		.shareBox{
			position: fixed;
			right: 0;
			top: 90%;
			height: 80rpx;
			width: 100rpx;
			transform: translate(-50%, -50%) rotateZ(90deg);
			z-index: 30;
			background-color: rgba(0, 0, 0, 0.3);
			border-radius: 20rpx;
			.shareIconBox {
			  width: 100rpx;
			  height: 50rpx;
			  text-align: center;
			  .shareIcon {
				width: 50rpx;
				height: 50rpx;
				background: url(../../../static/icon/share.png) no-repeat center;
				background-size: 50rpx;
			  }
			}
			.share {
			  text-align: center;
			  color: white;
			  font-size: 20rpx;
			  line-height: 30rpx;
			}
		}
		.shareButton{
			position: fixed;
			right: 0;
			top: 90%;
			height: 80rpx;
			width: 100rpx;
			transform: translate(-50%, -50%) rotateZ(90deg);
			z-index: 30;
			background-color: rgba(0, 0, 0, 0);
			border-radius: 20rpx;
		}
		
		.storyLineBox {
		  position: fixed;
		  right: 0;
		  top: 50%;
		  height: 80rpx;
		  width: 100rpx;
		  transform: translate(-50%, -50%) rotateZ(90deg);
		  z-index: 30;
		  background-color: rgba(0, 0, 0, 0.3);
		  border-radius: 20rpx;
		
		  .storyLineIconBox {
		    width: 100rpx;
		    height: 50rpx;
		    text-align: center;
		
		    .storyLineIcon {
		      width: 50rpx;
		      height: 50rpx;
		      background: url(../../../static/icon/fenzhi.png) no-repeat center;
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
		  top: 60%;
		  transform: translate(-50%, -50%) rotateZ(90deg);
		  height: 80rpx;
		  width: 100rpx;
		  z-index: 30;
		  background-color: rgba(0, 0, 0, 0.3);
		  border-radius: 20rpx;
		
		  .reportIconBox {
		    width: 100rpx;
		    height: 50rpx;
		    text-align: center;
		
		    .reportIcon {
		      width: 50rpx;
		      height: 50rpx;
		      background: url(../../../static/icon/report.png) no-repeat center;
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
		  top: 70%;
		  transform: translate(-50%, -50%) rotateZ(90deg);
		  height: 80rpx;
		  width: 100rpx;
		  z-index: 30;
		  background-color: rgba(0, 0, 0, 0.3);
		  border-radius: 20rpx;
		
		  .seeMoreIconBox {
		    width: 100rpx;
		    height: 50rpx;
		    text-align: center;
		
		    .seeMoreIcon {
		      width: 50rpx;
		      height: 50rpx;
		      background: url(../../../static/icon/seeMore.png) no-repeat center;
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
		
		.returnToPreviousBox {
		  position: fixed;
		  right: 0;
		  top: 80%;
		  transform: translate(-50%, -50%) rotateZ(90deg);
		  height: 80rpx;
		  width: 100rpx;
		  z-index: 30;
		  background-color: rgba(0, 0, 0, 0.3);
		  border-radius: 20rpx;
		
		  .returnToPreviousIconBox {
		    width: 100rpx;
		    height: 50rpx;
		    text-align: center;
		
		    .returnToPreviousIcon {
		      width: 50rpx;
		      height: 50rpx;
		      background: url(../../../static/icon/returnToPrevious.png) no-repeat
		        center;
		      background-size: 50rpx;
		    }
		  }
		
		  .returnToPrevious {
		    text-align: center;
		    color: white;
		    font-size: 20rpx;
		    line-height: 30rpx;
		  }
		}
		
		.storyLineContentMask16 {
		  position: fixed;
		  z-index: 999;
		  left: 0;
		  top: 0;
		  width: 100%;
		  height: 100%;
		  background-color: rgba(255, 255, 255, 0.9);
		  .storyLineContentBox {
		    width: 100%;
		    height: 100%;
		    z-index: 999;
		    background-color: rgba(0, 0, 0, 0.3);
		    .title {
		      text-align: center;
		      font-size: 36rpx;
		      color: white;
		      line-height: 100rpx;
		    }
		    .splitLine {
		      border: 2rpx solid #d3d3d3;
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
		        background: url(../../../static/icon/close.png) no-repeat center;
		        background-size: 46rpx;
		      }
		    }
		  }
		}
	  .reportContentMask16 {
		position: fixed;
		z-index: 999;
		left: 0;
		top: 0;
		width: 100%;
		height: 100vh;
		padding-bottom: 20rpx;
		background-color: rgba($color: #fff, $alpha: 1);
		color: #1a1a1a!important;
		overflow: auto;
		.reportContentBox {
		  width: 100%;
		  z-index: 17;
		  color: #1a1a1a;
		  .title {
			color: #1a1a1a;
			text-align: center;
			font-size: 36rpx;
			line-height: 100rpx;
		  }
		  .splitLine {
			border-top: 2rpx solid #d3d3d3;
			width: 100%;
			margin: 0 auto;
		  }
		  .subTitle {
			color: #1a1a1a;
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
			  background: url(../../../static/playIcon/close.png) no-repeat center;
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
					color: #1a1a1a;
				  }
				}
			  }
			}
			.content_tips {
				margin-left: 26rpx;
				transform: translateY(20rpx);
				color: #1a1a1a;
				font-size: 20rpx;
			}
			.uni-textarea {
				width: 100%;
				padding: 30rpx 0 0 30rpx;
			  textarea {
				width: calc(100% - 30rpx);
				background: white;
			  }
			}
			.uploadBox {
			  margin: 30rpx 0 0 0;
			  .subTitle {
				color: #1a1a1a;
				font-size: 30rpx;
			  }
			  .uploadBtnBox {
				margin: 30rpx 0 0 30rpx;
				border: 2rpx dashed #1a1a1a;
				width: 200rpx;
				height: 200rpx;
				.add_btn {
					position: relative;
					top: 50%;
					transform: translateY(-50%);
					view {
						height: 60rpx;
						width: 8rpx;
						border-radius: 4rpx;
						background-color: black;
						position: absolute;
						left: 50%;
						top: 50%;
						transform: translate(-50%, -50%);
						&:nth-child(2) {
							position: absolute;
							left: 50%;
							top: 50%;
							transform: translate(-50%, -50%) rotate(90deg);
						}
					}
				}
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
			  }
			}
		  }
		}
	  }
	  
	}
</style>
