<template>
	<view class="playBox">
		<view class="play">
			<!-- 播放主体 -->
			<view class="videoBox" @click="showButton">
				<video :src="videoUrl" :autoplay="true" direction="0" :show-mute-btn="true" :show-fullscreen-btn="false" id="myVideo"
				 :enable-play-gesture="true" @ended="videoEnd"></video>
			</view>
			<!-- 选项 -->
			<view class="chooseTipsMask15"  v-if="chooseTipsMaskFlag">
				<view class="chooseTipsMask16" v-if="chooseTipsShowFlag">
					<view class="chooseTips">
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
			</view>
			<!-- 故事线和举报 -->
			<view v-if="hiddenBtnFlag">
				<view class="reportBox" @click="showReportContent">
					<view class="report">举报</view>
				</view>
			</view>
			<view class="storyLineBox" @click="showStoryLineContent">
				<view class="storyLine">故事线</view>
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
						<storyLine :pkArtworkId="artworkId" :pkDetailIds="playedHistoryArray"></storyLine>
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
	</view>
</template>

<script>
	import { baseURL } from '../login/config/config.js'
	import storyLine from './storyLine/storyLine.vue'
	export default {
		components:{
			storyLine
		},
		data() {
			return {
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
				//视屏是否播放结束标志 true是未播放结束
				endFlag: true,
				artworkId: 0,
				detailId: 0,
				//播放历史的作品id容器
				playedHistoryArray: [],
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
				]
			}
		},
		onLoad(option) {
			this.artworkId = option.pkArtworkId
			this.pkDetailId = option.pkDetailId
			this.detailId = null;
			uni.setStorageSync("detailId",this.detailId);
		},
		onReady(){
			//是否是最后一个视频的标志在页面加载时要设置成true 不然不会弹框
			this.endFlag = true;
			if(this.pkDetailId != null){
				this.getArtworkTree();
				this.playedHistoryArray = uni.getStorageSync("pkDetailIds")
			}else{
				this.getArtworkTree();
				
				// let artworkTree = uni.getStorageSync("artworkTree");
				// if(artworkTree == null || typeof(artworkTree) == "undefined" || artworkTree.length == 0){
				// 	this.getArtworkTree();
				// 	console.log(2.1)
				// }else{
				// 	console.log(2.2)
				// 	//初始化数据
				// 	if(artworkTree.fkArtworkId != this.artworkId){
				// 		console.log(3.1)
				// 		this.getArtworkTree();
				// 	}else{
				// 		console.log(3.2)
				// 		this.initPlayData(artworkTree);
				// 	}
				// }
			}
			this.showButton();
		},
		onBackPress(){
			console.log(111)
		},
		onUnload(){
			uni.navigateBack({
			    delta: 1 ,
				animationDuration: 10,
				animationType: null
			});
		},
		methods: {
			showButton(){
				clearTimeout(this.time);
				this.hiddenBtnFlag = !this.hiddenBtnFlag;
				if(this.hiddenBtnFlag){
					this.time = setTimeout(() => {
						this.hiddenBtnFlag = false;
						console.log(this.hiddenBtnFlag)
					}, 5000);
				}
			},
			//上传截图到腾讯云
			uploadImage(){
				var COS = require('cos-wx-sdk-v5');
				let that = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['original'],
					sourceType: ['album','camera'],
					success: res=> {
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
			//提交举报
			async submit(){
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
							this.reportContentFlag = false;
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
			//视频播放初始化保存播放记录  将作品detailId留存提供给故事线
			initPlayData(artworkTree){
				//初始化视频及选项
				//0到10w的随机数 但还是有可能重复
				const uuid = Math.random().toString(36).substring(2);
				this.videoUrl = artworkTree.videoUrl+'?uuid='+uuid;
				this.detailId = artworkTree.pkDetailId;
				//将播放过的作品的detailId保存下来 playedHistoryArray此数组的最后一个元素为artworkId

				this.playedHistoryArray.push(artworkTree.pkDetailId);
				uni.setStorageSync("pkDetailIds",this.playedHistoryArray);
				//将当前播放的作品的detailId保存在缓存用于举报时确定是哪个具体的作品
				uni.setStorageSync("detailId",this.detailId);
				//保存播放过的作品的id
				this.savaPlayRecord();
				let childs = artworkTree.childs;
				if(childs){
					this.tipsArray.length = childs.length;
					for(let i = 0;i < childs.length;i++){
						this.childs.splice(i,1,childs[i]);
						this.option[i] = childs[i].selectTitle;
					}
					console.log(this.childs);
				}else{
					//islink不是null且值为1说明该节点是跳转节点
					if(artworkTree.isLink != null && artworkTree.isLink === 1){
						//从缓存中拿到主树
						const linkId = artworkTree.linkUrl;
						const mainTree = uni.getStorageSync("artworkTree");
						this.getTargetTree(mainTree,linkId)
					}else{
						//是不是最后一个视频标志 最后一个视频不需要弹窗
						this.endFlag = false;
					}
				}
			},
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
			//异步请求获取作品树
			async getArtworkTree(){
				console.log( this.artworkId)
				await uni.request({
					url: baseURL + "/wxPlay/playArtWorkByChildTree",
					method: 'POST',
					dataType: 'json',
					data: {
						pkArtworkId: this.artworkId,
						detailId:  this.pkDetailId
					},
					success: res=> {
						if(res.data.status == 200){
							console.log(res.data.data)
							uni.setStorageSync("artworkTree",res.data.data);
							this.initPlayData(res.data.data);
						}
					}
				})
			},
			//异步请求保存播放记录
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
			//开关控制是否展示 选项框 故事线 举报页面
			videoEnd(){
				//根据是否是最后一个视频标志 判断是否弹窗
				if(this.endFlag){
					this.chooseTipsShowFlag = true;
					this.chooseTipsMaskFlag = true;
				}else{
					this.storyLineContentFlag = true
					this.chooseTipsShowFlag = false;
					this.chooseTipsMaskFlag = false;
				}
			},
			showStoryLineContent(){
				this.storyLineContentFlag = true
			},
			showReportContent(){
				this.reportContentFlag = true
				this.uploadBtnFlag = true;
				this.uploadImageFlag = false;
			},
			//触摸start事件
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
			//触摸end事件
			rebackBackground(index){
				switch(index){
					case 0: {
						this.background.splice(index,1,"");
						this.chooseTipsShowFlag = false
						this.chooseTipsMaskFlag = false
						this.initPlayData(this.childs[index])
						break;
					}
					case 1: {
						this.background.splice(index,1,"");
						this.chooseTipsShowFlag = false
						this.chooseTipsMaskFlag = false
						this.initPlayData(this.childs[index])
						break;
					}
					case 2: {
						this.background.splice(index,1,"");
						this.chooseTipsShowFlag = false
						this.chooseTipsMaskFlag = false
						this.initPlayData(this.childs[index])
						break;
					}
					case 3: {
						this.background.splice(index,1,"");
						this.chooseTipsShowFlag = false
						this.chooseTipsMaskFlag = false
						this.initPlayData(this.childs[index])
						break;
					}
				}
			},
			//关闭按钮触发事件
			closeChooseTips(){
				this.chooseTipsShowFlag = false
				this.chooseTipsMaskFlag = false
				const videoContext = uni.createVideoContext('myVideo')
				videoContext.play()
				this.showButton()
			},
			closeStoryLineContent(){
				this.storyLineContentFlag = false
				if(!this.endFlag){
					const videoContext = uni.createVideoContext('myVideo')
					videoContext.play()
				}
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
				.chooseTipsMask15{
					background-color: rgba(0, 0, 0, .1);
					position: fixed;
					left: 0;
					top: 0;
					width: 100%;
					height: 100%;
					z-index: 15;
					.chooseTipsMask16{
						background-color: rgba(255,255,255,.9);
						position: fixed;
						left: 0;
						top: 50%;
						transform: translateY(-50%);
						width: 100%;
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
					right: 40rpx;
					bottom: 120rpx;
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
	}
	
	
</style>
