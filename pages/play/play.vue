<template>
	<view class="playBox">
		<view class="play">
			<view class="container"  v-show="showCanvasFlag">
			  <canvas canvas-id="myCanvas" @touchstart="getTouchPosition" @touchend="canvasTouchendEvent" :style="{'width': windowWidth+'rpx', 'height': windowHeight+'rpx'}"></canvas>
			</view>
			<!-- 播放主体   @click="showButton"-->
			<view class="videoBox">
				<video :src="videoUrl" :autoplay="true" direction="0" :show-mute-btn="true" :show-fullscreen-btn="false" id="myVideo"
				 :enable-play-gesture="true" @ended="videoEnd" @pause="videoPause"></video>
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
				//定位选项标志
				isPosition: 0,
				//定位选项数据
				nodeLocationList: [],
				//视频黑边像素 (单边的 height)
				hblackSideNum: 0,
				//视频黑边像素 (单边的 width)
				wblackSideNum: 0,
				//视频路径
				videoUrl: "",
				//选项参数
				option: ["我是选项1","我是选项2","我是选项3","我是选项4"],
				//选项背景颜色
				background: ["","","",""],
				//隐藏按钮开关
				hiddenBtnFlag: true,
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
				//由于设置canvas画布宽度
				windowWidth: '750rpx',
				//由于设置canvas画布高度（不包括手机通知栏、小程序标题栏和tabBar）
				windowHeight: '300rpx',
				//矩形框数据数组
				rectArray: [],
				//默认是个不会被触发的数字 
				touchRectNum: 5,
				//是否被点击的标志
				isClickFlag: false
			}
		},
		onLoad(option) {
			//option.scene 不为空说明是扫码跳转过来播放的
			if(option.scene){
				let scene = decodeURIComponent(option.scene);
				var arr = scene.split('=')
				//a是artworkId b是status -0是为了将string 转化成number
				let a = arr[1] - 0
				let b = arr[3] - 0
				if(b == 1){
					uni.request ({
						url: baseURL + "/wxPlay/getUserIdByArtwordId",
						method: 'POST',
						dataType: 'json',
						data: {
							pkArtworkId: a
						},
						success: result=> {
							if(result.data.status == 200){
								const userId = uni.getStorageSync('userId');
								if(result.data.data == userId){
									this.artworkId = a;
								}else{
									uni.showToast({
										icon: 'none',
										title: '预览作品只能作者自己观看'
									})
								}
							}
						}
					});
				}else{
					this.artworkId = a;
				}
			}else{
				this.artworkId = option.pkArtworkId
			}
			// 故事线跳转进来的地方 会带上pkArtworkId and pkDetailId
			this.pkDetailId = option.pkDetailId
			// 每次的故事线跳转都要重置当前播放节点
			this.detailId = null;
			uni.setStorageSync("detailId",this.detailId);
		},
		onReady(){
			//test
			// this.artworkId = 350;
			//初始化定位选项画布
			//获取手机屏幕尺寸 单位是px
			const {windowWidth, windowHeight} = uni.getSystemInfoSync()
			let windowSizeArray = {
				'windowWidth': windowWidth,
				'windowHeight': windowHeight
			}
			uni.setStorageSync('windowSizeArray',windowSizeArray)
			this.validateBlackSide(windowWidth, windowHeight)
			//小程序将所有设备的宽都等分成750等份即750rpx
			this.windowWidth = 750
			//宽高是等比的 单位rpx
			this.windowHeight = windowHeight*750/windowWidth
			uni.setStorageSync('userScore',[])
			//是否是最后一个视频的标志在页面加载时要设置成true 不然不会弹框
			this.endFlag = true;
			if(this.pkDetailId != null){
				//故事线跳转过来存一棵主树 跳转用
				this.getArtworkTreeByArtworkId();
				this.getArtworkTreeByDetailId();
				this.playedHistoryArray = uni.getStorageSync("pkDetailIds")
				let appearConditionMap = uni.getStorageSync('appearConditionMap')
				//根据当前节点 在节点分值容器中是否有值来判断是否是数值节点
				let symbolIndex = this.pkDetailId+''
				let symbol = appearConditionMap[symbolIndex]
				console.log('symbol:'+symbol)
				if(typeof(symbol) != 'undefined' && symbol.length != 0){
					//计算跳转到的目标节点时此时用户的得分 所使用的临时数组变量 因为跳转过来没有当前节点的分数计算情况
					let currentArray = this.deepCopy(this.playedHistoryArray)
					//如果此时的currentArray 是空的话则说明是跳转的根节点不做操作
					if(currentArray.length != 0){
						//前面为了判断是否是数值选项被设置形成了String 故+0转化回来
						currentArray.push(parseInt(this.pkDetailId))
						//需要的是计算过了当前节点的分数
						console.log('播放记录：'+currentArray)
						//初始化userScore数组 currentArray第一个元素是根节点没有 changeConditionValue
						let index = ''+currentArray[1]
						let len = appearConditionMap[index].length
						let userScore = uni.getStorageSync('userScore')
						for(let k = 0; k < len; k++){
							userScore.push(0);
						}
						for(let i = 1; i < currentArray.length; i++){
							let key = ''+currentArray[i]
							let value = appearConditionMap[key]
							if(typeof(value) != 'undefined' && value.length != 0 ){
								for(let j = 0; j < value.length; j++){
									userScore[j] += value[j].changeConditionValue
								}
							}
						}
						uni.setStorageSync('userScore', userScore)
					}
				}
			}else{
				//存一棵主树
				this.getArtworkTreeByArtworkId();
			}
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
			//关闭页面时重置选项类型为默认
			uni.setStorageSync('isNumericalOptions',0)
			//关闭页面时重置节点分数容器
			uni.setStorageSync('appearConditionMap',{})
		},
		methods: {
			// 举报页面上传截图到腾讯云
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
				if(!this.reportType){
					return uni.showToast({
						icon: 'none',
						title: '请选择举报类型'
					})
				}
				const regPhone = /[\u4e00-\u9fa5]{8,}/.test(this.textareaContent);
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
				//随机数 
				const uuid = Math.random().toString(36).substring(2)
				this.videoUrl = artworkTree.videoUrl+'?uuid='+uuid
				this.detailId = artworkTree.pkDetailId
				//如果是根节点初始化存储节点分值的容器
				if(artworkTree.parentId === 0){
					//存进缓存是防止故事线进入时重置了data里面的数据
					uni.setStorageSync('appearConditionMap', artworkTree.appearConditionMap)
				}
				// 将选项置空 避免选项中出现上一次选项的情况
				this.option = []
				//将当前播放的作品的detailId保存在缓存用于举报时确定是哪个具体的作品
				uni.setStorageSync("detailId",this.detailId)
				//保存播放过的作品的id
				this.savaPlayRecord();
				//是否是定位选项的标志 1是定位选项 其他是普通选项
				this.isPosition = artworkTree.isPosition
				if(this.isPosition == 1){
					//获取定位选项位置数据
					this.nodeLocationList = artworkTree.nodeLocationList
				}
				let childs = artworkTree.childs;
				if(childs){
					for(let i = 0;i < childs.length;i++){
						this.childs.splice(i,1,childs[i]);
						//是否是数值选项的标志 1是数值选项 其它是普通选项
						let isNumericalOptions = childs[i].isNumberSelect
						if(isNumericalOptions == 1){
							//普通选项中的数值选项
							this.calculateOptionScore(childs[i])
						}else{
							//常规选项
							this.option.push(childs[i].selectTitle)
						}
					}
					this.tipsArray.length = this.option.length;
					//初始画布必须等到选项数据先初始化完才能进行
					if(this.isPosition == 1){
						//初始化画布
						this.initCanvas();
					}
				}else{
					//islink不是null且值为1说明该节点是跳转节点 需要注意叶子节点的孩子也是空的可能会走进else故要考虑过是否是叶子节点
					if(artworkTree.isLink != null && artworkTree.isLink === 1){
						//从缓存中拿到主树
						const linkId = artworkTree.linkUrl;
						//存储跳转目标节点的detailId
						this.linkNodeId = linkId
						const mainTree = uni.getStorageSync("mainArtworkTree");
						this.playedHistoryArray.push(artworkTree.pkDetailId);
						/* //不需要去重 记录故事线走向方便数值选项分数计算
						this.playedHistoryArray = Array.from(new Set(this.playedHistoryArray)); */
						uni.setStorageSync("pkDetailIds",this.playedHistoryArray);
						this.getTargetTree(mainTree,linkId)
					}else{
						//是不是最后一个视频标志 最后一个视频不需要弹窗
						this.endFlag = false;
					}
				}
				//非跳转节点存播放记录
				if (this.linkNodeId != this.detailId) {
					this.playedHistoryArray.push(artworkTree.pkDetailId);
					/* //不需要去重 记录故事线走向方便数值选项分数计算
					this.playedHistoryArray = Array.from(new Set(this.playedHistoryArray)); */
					uni.setStorageSync("pkDetailIds",this.playedHistoryArray);
					this.linkNodeId = null
				}
			},
			// 计算选项分数判断是否显示
			calculateOptionScore(child){
				//选项是否显示的标志
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
					let conditionSymbol = advancedList[j].appear
					let conditionNumber = advancedList[j].appearValue - 0
					if('>' === conditionSymbol){
						if(userScore[j] > conditionNumber){
							optionFlag = optionFlag && true
						}else{
							optionFlag = optionFlag && false
						}
					}else if('<' === conditionSymbol){
						if(userScore[j] < conditionNumber){
							optionFlag = optionFlag && true
						}else{
							optionFlag = optionFlag && false
						}
					}else if('=' === conditionSymbol){
						if(userScore[j] == conditionNumber){
							optionFlag = optionFlag && true
						}else{
							optionFlag = optionFlag && false
						}
					}
				}
				if(optionFlag){
					this.option.push(child.selectTitle)
				}else{
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
			//异步请求获取作品树 by ArtworkId
			async getArtworkTreeByArtworkId(){
				console.log( this.artworkId)
				await uni.request({
					url: baseURL + "/wxPlay/playArtWorkByChildTree",
					method: 'POST',
					dataType: 'json',
					data: {
						pkArtworkId: this.artworkId
					},
					success: res=> {
						if(res.data.status == 200){
							console.log(res.data.data)
							uni.setStorageSync("mainArtworkTree",res.data.data);
							//传到播放页面带pkDetailId参数 说明故事线跳转，只需要存一棵主树跳转节点用不用去播放视频
							if(this.pkDetailId != null) return;
							this.initPlayData(res.data.data);
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
				//根据是否是最后一个视频标志 最后一个视频播放结束弹出故事线 endFlag = true 表示不是最后一个视频
				if(this.endFlag){
					if(this.isPosition == 1){
						this.chooseTipsShowFlag = false;
						this.chooseTipsMaskFlag = false;
						this.showCanvasFlag = true;
					}else{
						this.showCanvasFlag = false;
						this.chooseTipsShowFlag = true;
						this.chooseTipsMaskFlag = true;
					}
				}else{
					this.storyLineContentFlag = true
					this.chooseTipsShowFlag = false;
					this.chooseTipsMaskFlag = false;
					this.showCanvasFlag = false;
					uni.setStorageSync('userScore',[])
				}
			},
			//视屏暂停操作
			videoPause(){
				console.log('我暂停了')
				this.hiddenBtnFlag = true;
			},
			//展示故事线内容的时候暂停视频
			showStoryLineContent(){
				this.storyLineContentFlag = true
				const videoContext = uni.createVideoContext('myVideo')
				//暂停视屏
				videoContext.pause()
			},
			//展示举报内容的时候暂停视频
			showReportContent(){
				this.reportContentFlag = true
				this.uploadBtnFlag = true;
				this.uploadImageFlag = false;
				const videoContext = uni.createVideoContext('myVideo')
				videoContext.pause()
			},
			//触摸选项touchstart事件
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
			//触摸选项touchend事件
			rebackBackground(index){
				switch(index){
					case 0: {
						// splice替换数组元素
						this.background.splice(index,1,"")
						this.optionTouchendTodo(index)
						break;
					}
					case 1: {
						this.background.splice(index,1,"")
						this.optionTouchendTodo(index)
						break;
					}
					case 2: {
						this.background.splice(index,1,"")
						this.optionTouchendTodo(index)
						break;
					}
					case 3: {
						this.background.splice(index,1,"")
						this.optionTouchendTodo(index)
						break;
					}
				}
			},
			// 选项touchend事件触发时所做的操作
			optionTouchendTodo(index){
				let advancedList = this.childs[index].onAdvancedList
				let userScore = uni.getStorageSync('userScore')
				let isNumericalOptions = this.childs[index].isNumberSelect
				if(isNumericalOptions == 1){
					for(let i = 0; i< advancedList.length; i++){
						let countSymbol = advancedList[i].change
						let countNumber = advancedList[i].changeValue - 0
						if('+' === countSymbol){
							userScore[i] =  userScore[i] + countNumber
						}else{
							userScore[i] =  userScore[i] - countNumber
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
			},
			//点击选项关闭按钮触发事件
			closeChooseTips(){
				this.chooseTipsShowFlag = false
				this.chooseTipsMaskFlag = false
				const videoContext = uni.createVideoContext('myVideo')
				videoContext.play()
			},
			//点击故事线按钮出发事件
			closeStoryLineContent(){
				this.storyLineContentFlag = false
				const videoContext = uni.createVideoContext('myVideo')
				videoContext.play()
			},
			//点击举报按钮出发事件
			closeReportContent(){
				this.reportContentFlag = false
				const videoContext = uni.createVideoContext('myVideo')
				videoContext.play()
			},
			//初始化canvas画布
			initCanvas(){
				this.rectArray = []
				const ctx = uni.createCanvasContext('myCanvas')
				let windowSizeArray = uni.getStorageSync('windowSizeArray');
				let windowWidth = windowSizeArray.windowWidth
				let windowHeight = windowSizeArray.windowHeight
				ctx.clearRect(0 , 0 , windowWidth, windowHeight)
				for(let i = 0; i < this.nodeLocationList.length; i++){
					if(this.nodeLocationList[i].isHide == 1){
						console.log(1)
						//矩形左上角点的坐标(X,Y)
						let rectX = parseInt(((this.nodeLocationList[i].textRectX+0)*(windowWidth-this.hblackSideNum*2)).toFixed(0))
						let rectY = parseInt(((this.nodeLocationList[i].textRectY+0)*(windowHeight-this.hblackSideNum*2)).toFixed(0)) 
						//文字距离左右两个边框的间距
						let marginLeftAndRightSides = 8
						//矩形框高度
						let rectH = 30 
						//字体大小
						let fontSize = 15
						//文字距离矩形框下边框边距
						let marginBottom = 10
						//文本内容
						let textContent = this.option[i]
						//测量之前要先确定字体大小 因为矩形宽是根据字体的长度来绘画的 不设置会影响测量
						ctx.setFontSize(fontSize)
						//测量文本宽度
						let metrics = ctx.measureText(textContent)
						//宽度取整 Math.ceil向上取整即省去小数再加1 宽度由文本的宽度加边距组成
						let rectW = parseInt((metrics.width).toFixed(0))+marginLeftAndRightSides;
						//末尾小圆圈的横纵坐标 算总长度时应该减去黑边
						let cX = parseInt(((this.nodeLocationList[i].circleX+0)*(windowWidth-this.wblackSideNum*2)).toFixed(0))
						let cY = parseInt(((this.nodeLocationList[i].circleY+0)*(windowHeight-this.hblackSideNum*2)).toFixed(0))
						
						//画线 连线到小圆心
						let cr = 2
						ctx.moveTo(cX+this.wblackSideNum,cY+this.hblackSideNum)
						//校准，因为获取到的矩形框坐标是矩形框的中轴点的坐标，而绘制矩形传入的是左上角的坐标 故需要校正 横纵坐标减去矩形框宽高的一半
						ctx.lineTo(rectX+this.wblackSideNum, rectY+this.hblackSideNum)
						ctx.setStrokeStyle('white')
						ctx.stroke()
						
						//画末尾小圆圈
						//x,y,r,sAngle（起始弧度,单位弧度（在3点钟方向）），eAngle（终止弧度）counterclockwise可选，默认是false 标识顺时针 
						//让起始点转到12点就需要倒退0.5* Math.PI 但整圆是2 * Math.PI 故终止弧度加0.5* Math.PI
						//外圈
						ctx.beginPath()
						ctx.arc(cX+this.wblackSideNum,cY+this.hblackSideNum, cr*3, 0, 2 * Math.PI)
						ctx.setFillStyle('#87CEEB')
						ctx.fill()
						//内圈
						ctx.beginPath()
						ctx.arc(cX+this.wblackSideNum,cY+this.hblackSideNum, cr, 0, 2 * Math.PI)
						ctx.setFillStyle('#E3E3E3')
						ctx.fill()
						
						//画矩形
						//前两个值为左上角起始点坐标x,y，后面两位为矩形宽高 最后一个元素是矩形圆角的像素
						ctx.beginPath()
						//校准，因为获取到的矩形框坐标是矩形框的中轴点的坐标，而绘制矩形传入的是左上角的坐标 故需要校正 横纵坐标减去矩形框宽高的一半
						this.drawRect(ctx, rectX-(rectW/2)+this.wblackSideNum, rectY-(rectH/2)+this.hblackSideNum, rectW, rectH, 4)
						//将坐标收纳成对象保存到数组，为绑定事件做准备
						let rect={
							x: rectX-(rectW/2)+this.wblackSideNum,
							y: rectY-(rectH/2)+this.hblackSideNum,
							w: rectW,
							h: rectH
						}
						this.rectArray.push(rect)
						if(this.isClickFlag){
							if(this.touchRectNum == i){
									//矩形边框颜色
									ctx.setStrokeStyle('#96CDCD')
									//矩形填充色
									ctx.setFillStyle('#96CDCD')
									this.isClickFlag = false
								}else{
									ctx.setStrokeStyle('rgba(255, 255, 255, 0.5)')
									ctx.setFillStyle('rgba(255, 255, 255, 0.5)')
								}
						}else{
							ctx.setStrokeStyle('rgba(255, 255, 255, 0.5)')
							ctx.setFillStyle('rgba(255, 255, 255, 0.5)')
						}
						ctx.fill()
						//开始描绘
						ctx.stroke()
						
						//写字
						//设置字体颜色
						ctx.setFillStyle('white')
						//校准，因为获取到的矩形框坐标是矩形框的中轴点的坐标，而绘制矩形传入的是左上角的坐标 故需要校正 横纵坐标减去矩形框宽高的一半
						let textX = (rectX+(marginLeftAndRightSides/2))-(rectW/2)+this.wblackSideNum
						let textY = (rectH+rectY-marginBottom)-(rectH/2)+this.hblackSideNum
						ctx.fillText(textContent, textX, textY)
						//开始描绘
						ctx.stroke()
						ctx.draw(true)
					}else{
						console.log(0)
						//矩形左上角点的坐标(X,Y)
						//rpx转px 故(this.windowWidth)/2 计算总长度时要减去黑边
						let rectX = parseInt(((this.nodeLocationList[i].textRectX+0)*(windowWidth-this.wblackSideNum*2)).toFixed(0))
						let rectY = parseInt(((this.nodeLocationList[i].textRectY+0)*(windowHeight-this.hblackSideNum*2)).toFixed(0))
						//矩形框高度
						let rectH = 22
						//字体大小
						let fontSize = 15
						//文本内容
						let textContent = this.option[i]
						//测量之前要先确定字体大小 因为矩形宽是根据字体的长度来绘画的 不设置会影响测量
						ctx.setFontSize(fontSize)
						//测量文本宽度
						let metrics = ctx.measureText(textContent)
						//宽度取整 Math.ceil向上取整即省去小数再加1 宽度由文本的宽度加边距组成
						let rectW = parseInt(metrics.width.toFixed(0));
						
						//画矩形
						//前两个值为左上角起始点坐标x,y，后面两位为矩形宽高 最后一个元素是矩形圆角的像素
						ctx.beginPath()
						//校准，因为获取到的矩形框坐标是矩形框的中轴点的坐标，而绘制矩形传入的是左上角的坐标 故需要校正 横纵坐标减去矩形框宽高的一半
						this.drawRect(ctx, rectX+this.wblackSideNum, rectY+this.hblackSideNum, rectW, rectH, 4)
						//将坐标收纳成对象保存到数组，为绑定事件做准备
						let rect={
							x: rectX+this.wblackSideNum,
							y: rectY+this.hblackSideNum,
							w: rectW,
							h: rectH
						}
						this.rectArray.push(rect)
						if(this.isClickFlag){
							if(this.touchRectNum == i){
									//矩形边框颜色
									ctx.setStrokeStyle('#96CDCD')
									//矩形填充色
									ctx.setFillStyle('#96CDCD')
									this.isClickFlag = false
								}else{
									ctx.setStrokeStyle('rgba(255, 255, 255, 0.3)')
									ctx.setFillStyle('rgba(255, 255, 255, 0.3)')
								}
						}else{
							ctx.setStrokeStyle('rgba(255, 255, 255, 0.3)')
							ctx.setFillStyle('rgba(255, 255, 255, 0.3)')
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
						let xLowLimit = this.rectArray[i].x;
						let yLowLimit = this.rectArray[i].y;
						let xUpperLimit = this.rectArray[i].x+this.rectArray[i].w;
						let yUpperLimit = this.rectArray[i].y+this.rectArray[i].h;
						//判断边界办法
						if(touchX > xLowLimit && touchX < xUpperLimit && touchY > yLowLimit && touchY < yUpperLimit){
							this.touchRectNum = i;
						}
					}
					if(this.touchRectNum < 4){
						this.isClickFlag = true
						this.initCanvas()
					}
				}
			},
			// canvas的touchEnd事件
			canvasTouchendEvent(){
				if(this.touchRectNum == 0){
					this.canvasTouchendEventTodo()
				}else if(this.touchRectNum == 1){
					this.canvasTouchendEventTodo()
				}else if(this.touchRectNum == 2){
					this.canvasTouchendEventTodo()
				}else if(this.touchRectNum == 3){
					this.canvasTouchendEventTodo()
				}
				//回到默认值
				this.touchRectNum = 5
			},
			// canvas的touchEnd事件触发时的操作
			canvasTouchendEventTodo(){
				let advancedList = this.childs[this.touchRectNum].onAdvancedList
				let userScore = uni.getStorageSync('userScore')
				let isNumericalOptions = this.childs[this.touchRectNum].isNumberSelect
				if(isNumericalOptions == 1){
					for(let i = 0; i< advancedList.length; i++){
						let countSymbol = advancedList[i].change
						let countNumber = advancedList[i].changeValue - 0
						if('+' === countSymbol){
							userScore[i] =  userScore[i] + countNumber
						}else{
							userScore[i] =  userScore[i] - countNumber
						}
					}
					this.showCanvasFlag = false
					uni.setStorageSync('userScore', userScore)
					this.initPlayData(this.childs[this.touchRectNum])
				}else{
					this.showCanvasFlag = false
					this.initPlayData(this.childs[this.touchRectNum])
				}
			},
			// 校正视频播放的黑边 单位px
			validateBlackSide(windowWidth, windowHeight){
				if(windowHeight/windowWidth>16/9){
					//高度变高了出现上下黑边
					this.hblackSideNum = parseInt(((windowHeight-(16/9)*windowWidth)/2).toFixed(0))
				}else{
					//宽度变宽了出现左右黑边
					this.wblackSideNum = parseInt(((windowWidth-(9/16)*windowHeight)/2).toFixed(0))
				}
				console.log("黑边的高："+this.hblackSideNum+"黑边的宽："+this.wblackSideNum)
			},
			// 深拷贝 方法
			deepCopy(o) {
				return JSON.parse(JSON.stringify(o))
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
				.container{
					width: 100%;
					height: 100%;
					position: fixed;
					left: 0;
					top: 0;
					z-index: 17;
					// background: url(https://sike-1259692143.cos.ap-chongqing.myqcloud.com/img/1600828961029) no-repeat center;
					// background-size: 100% 100%;
				}
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
					right: 6%;
					top: 6%;
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
					left: 6%;
					top: 6%;
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
