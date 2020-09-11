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
							<textarea v-model="textareaContent"/>
						</view>
						<view class="uploadBox">
							<view class="subTitle">上传图片</view>
							<view class="uploadBtnBox" v-if="uploadBtnFlag" @click="uploadImage">
								<icon></icon>
							</view>
							<view class="uploadImageBox" v-if="uploadImageFlag">
								<image></image>
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
	export default {
		data() {
			return {
				//视频路径
				videoUrl: "",
				//选项参数
				option: ["我是选项1","我是选项2","我是选项3","我是选项4"],
				//选项背景颜色
				background: ["","","",""],
				//是否展示选项开关
				chooseTipsShowFlag: false,
				//是否展示故事线开关
				storyLineContentFlag: false,
				//是否展示举报开关
				reportContentFlag: false,
				//上传图片展示开关
				uploadImageFlag:false,
				//是否显示上传图片按钮开关
				uploadBtnFlag: true,
				//视屏是否播放结束标志
				endFlag: true,
				artworkId: 113,
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
				//举报类型选项数组
				items: [
					{
						value: 'tort',
						name: '侵犯版权'
					},
					{
						value: 'illegal',
						name: '出现违规内容',
						// checked: 'true'
					},
					{
						value: 'other',
						name: '其它'
					}
				]
			}
		},
		onReady(){
			this.endFlag = true;
			let artworkTree = uni.getStorageSync("artworkTree");
			if(artworkTree == null || typeof(artworkTree) == "undefined" || artworkTree.length == 0){
				this.getArtworkTree();
			}else{
				//初始化数据
				this.initPlayData(artworkTree);
			}
		},
		methods: {
			uploadImage(){
				uni.chooseImage({
					count: 1,
					sizeType: ['original'],
					sourceType: ['album','camera'],
					success: res=> {
						let cos = this.getCos();
						let filePath = res.tempFilePaths[0];//获取文件路径
						let Key = filePath.substr(filePath.lastIndexOf('/')+1);//这里指定上传的文件名
						let dateObj = new Date();
						let timestamp = dateObj.getTime();
						let nowDate = dateObj.toLocaleDateString();
						let formatDate = nowDate.replace(/\//g,'-');//格式斜杠日期
						let newKey = formatDate +'/'+timestamp+Key;//cos上定义目录
						let tempObj = {};
						tempObj.imgLocation = 'https://' + 'sike-1259692143'+'.cos.' + 'ap-chongqing' + '.myqcloud.com/'+newKey;//返回上传的绝对 URL
						//SDK 提供的cos上传函数，如果想批量上传，可以在这里加上for循环。
						cos.putObject({
							Bucket:'sike-1259692143',//存储桶名称
							Region:'ap-chongqing',//地域名字
							Key:newKey,
							FilePath:filePath,//本地文件临时地址
						},function(err,data){
							if(err){
							   wx.showModal({
								  title:'返回错误',
								  content:'请求失败'+err,
								  showCancel:false
							   })
							}else{
							   if(data){
								  //data.headers.Location  这里是返回的图片URL，这里可以为界面中需要显示的图片src赋值
								  that.setData({
									  headImage:data.headers.Location
								  })
							   }
							}
						})
					}
				})
				
			},
			getCos(){
				var COS = require('cos-wx-sdk-v5');
				uni.request ({
					url: baseURL + "/artworkMaking/findCosSingature",
					method: 'POST',
					success: res=> {
						// console.log(JSON.parse(res.data.data))
						const data = JSON.parse(res.data.data);
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
						return cos;
					},
				})
			},
			submit(){
				console.log(this.textareaContent);
				console.log(this.reportType);
			},
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
						this.reportType = item.name;
					}else{
						this.$set(item,'checked',false)
					}
				}
			},
			initPlayData(artworkTree){
				//初始化视频及选项
				this.videoUrl = artworkTree.videoUrl;
				this.detailId = artworkTree.pkDetailId;
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
				}else{
					//控制视频播放结束是否弹框的标志
					this.endFlag = false;
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
				if(this.endFlag){
					this.chooseTipsShowFlag = true;
				}else{
					this.chooseTipsShowFlag = false;
				}
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