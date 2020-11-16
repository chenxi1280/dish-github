<template>
	<view>
		<view>
			<view v-if="localFlag" class="tips" >
				<view class="work_publish" v-if="publish_flag">
					<button class="btn_publish" @click="publishArtWork">发布作品</button>
					<view class="line"></view>
				</view>
				<view class="work_code" v-if="code_flag">
					<button class="btn_code"  @click="getArtWorkCode">作品二维码</button>
					<view class="line"></view>
				</view>
				<view class="work_delete">
					<button class="btn_delete" @click="deleteArtWorkCode">删除</button>
					<view class="line"></view>
				</view>
				<view class="work_cancel">
					<button class="btn_cancel" @click="closeTips">取消</button>
				</view>
			</view>
			<view class="icon_box" @click="showTips">
				<icon class="more_icon"></icon>
			</view>
			<view class="demo-img-wrap" @click="play(xid,status)">
				<image class="demo-image" :src="image+'/common'" mode="widthFix" ></image>
			</view>
			<view class="padding_box">
				<view class="work_info">
					<view class="demo-title">
						{{title}}
					</view>
					<view class="hot_box">
						<view class="hot_icon_box">
							<icon></icon>
						</view>
						<view class="demo-price">{{broadcastCount}}</view>
					</view>
				</view>
			</view>
			<view class="mask17" v-if="codeFlag" @click="hiddenTips17"></view>
			<view>
				<u-modal v-model="publishShow" 
						:title-style="{color: 'black'}" 
						show-cancel-button="true" 
						title="确定要发布作品吗？" 
						:cancel-style="{background: '#B5B5B5'}"
						confirm-text="确定"
						:confirm-style="{background: '#F08080'}"
						cancel-color="white"
						confirm-color="white"
						:content-style="{'word-wrap': 'break-word', 
										'word-break': 'break-all',
										'white-space': 'pre-line',
										'text-align': 'center',
										'margin': '5% 5%'}"
						@confirm="publishLink">
					<view class="slot-content">
						<rich-text :nodes="publishContent"></rich-text>
					</view>
				</u-modal>
				<u-modal v-model="deleteShow"
						show-cancel-button="true" 
						:cancel-style="{background: '#B5B5B5'}"
						:confirm-style="{background: '#F08080'}"
						:show-title = 'false'
						cancel-color="white"
						confirm-color="white"
						:content-style="{'text-align': 'center',
										'margin': '10% 10%'}"
						@confirm="confirmDelete">
					<view class="slot-content">
						<rich-text :nodes="deleteContent"></rich-text>
					</view>
				</u-modal>
				<u-modal v-model="codeShow"
						show-cancel-button="true" 
						:cancel-style="{background: '#B5B5B5'}"
						confirm-text="复制链接"
						:confirm-style="{background: '#F08080'}"
						:show-title = 'false'
						cancel-color="white"
						confirm-color="white"
						:content-style="{'word-wrap': 'break-word', 
										'word-break': 'break-all',
										'white-space': 'pre-line',
										'text-align': 'center',
										'margin': '20% 8%'}"
						@confirm="codeLink">
					<view class="slot-content">
						<rich-text :nodes="codeContent"></rich-text>
						<img :src="imgCodeSrc" class = "wxCode">
					</view>
				</u-modal>
			</view>
		</view>
	</view>
</template>

<script>
	import { baseURL } from '../../pages/login/config/config.js'
	import { globalBus } from '../../common/js/util.js'
	export default {
		data() {
			return {
				imgCodeSrc: '',
				//组件是否展示开关
				localFlag: false,
				//蒙板开关
				mask15Flag: false,
				//tip的开关 分辨是发布和作品品二维码
				publish_flag: false,
				code_flag: false,
				//弹窗开关及对应内容
				publishContent: '发布的作品将展示在发现页面\n\n作品二维码和播放链接将会在点击确定后生成，可前往web端个人空间已发布中查看\n\n网站地址：https://wanxiangchengzhen.com',
				publishShow: false,
				deleteContent: '确认删除？',
				deleteShow: false,
				codeShow: false,
				codeContent: '播放链接获取网站地址：\n\nhttps://wanxiangchengzhen.com\n\n'
			}
		},
		props: {
			broadcastCount: {
				type: Number,
				default: 88888
			},
			title: {
				type: String,
				default: '北国风光，千里冰封，万里雪飘'
			},
			shop: {
				type: String,
				default: '李白杜甫白居易旗舰店'
			},
			image: {
				type: String,
				default: 'http://pic.sc.chinaz.com/Files/pic/pic9/202002/zzpic23327_s.jpg'
			},
			xid: {
				type: Number,
			},
			status: {
				type: Number,
				default: 2
			}
		},
		onReady() {
			if(this.status == 2){
				this.publish_flag = true
			}else{
				this.code_flag = true
			}
		},
		mounted() {
			this.hiddenTips()
		},
		methods: {
			play(xid,status){
				console.log(xid)
				if(status == 4){
					uni.navigateTo({
						url: "../play/play?pkArtworkId=" + xid,
					})
				}
			},
			async publishLink(){
				uni.setClipboardData({
					data: 'https://wanxiangchengzhen.com',
					success: res=> {
						uni.showToast({
							icon: 'none',
							title:'链接已复制到剪切板'
						})
					}
				})
				await uni.request ({
					url: baseURL + "/ecmArtWorkManager/modifyArtWorksStatus",
					method: 'POST',
					dataType: 'json',
					data: {
						pkArtworkId: this.xid,
						code: 'publish'
					},
					success: res=> {
						if(res.data.status == 200){
							if(this.status == 2){
								setTimeout(function() {
									uni.setStorageSync("mine_current",0)
									uni.reLaunch({
										url: "../../pages/mine/mine",
									})
								}, 1500);
							}else{
								setTimeout(function() {
									uni.setStorageSync("mine_current",1)
									uni.reLaunch({
										url: "../../pages/mine/mine",
									})
								}, 1500);
							}
						}
					}
				})
			},
			codeLink(){
				uni.setClipboardData({
					data: 'https://wanxiangchengzhen.com',
					success: res=> {
						uni.showToast({
							icon: 'none',
							title:'复制成功'
						})
					}
				});
			},
			async confirmDelete(){
				await uni.request ({
					url: baseURL + "/ecmArtWorkManager/modifyArtWorksStatus",
					method: 'POST',
					dataType: 'json',
					data: {
						pkArtworkId: this.xid,
						code: 'delete'
					},
					success: res=> {
						if(res.data.status == 200){
							uni.showToast({
								icon: 'none',
							  	title: '删除成功'
							})
							if(this.status == 2){
								setTimeout(function() {
									uni.setStorageSync("mine_current",0)
									uni.reLaunch({
										url: "../../pages/mine/mine"
									})
								}, 1500);
							}else{
								setTimeout(function() {
									uni.setStorageSync("mine_current",1)
									uni.reLaunch({
										url: "../../pages/mine/mine"
									})
								}, 1500);
							}
						}
					}
				})
			},
			showTips(e) {
				e.cancelBubble = true;
				//先触发了tips 将所有的置为false 再将当前组件置为true
				globalBus.$emit("tips")
				this.localFlag = true;
			},
			hiddenTips(){
				globalBus.$on("tips",() => {
					this.localFlag = false;
				})
			},
			publishArtWork(){
				console.log(this.xid)
				console.log(this.status)
				this.publishShow = true;
			},
			deleteArtWorkCode(){
				console.log(this.xid)
				console.log(this.status)
				this.deleteShow = true
			},
			closeTips(){
				this.localFlag=false
			},
			/* 获取二维码和web端链接暂时不看  */
			async getArtWorkCode(){
				console.log(this.xid)
				console.log(this.status)
				await uni.request ({
					url: baseURL + "/wxPersonalCenter/getWxcode",
					method: 'POST',
					dataType: 'json',
					data: {
						token: uni.getStorageSync("token"),
						pkArtworkId: this.xid
					},
					success: res=> {
						if(res.data.status == 200){
							this.codeShow = true
							this.imgCodeSrc = res.data.data
						}else{
							return uni.showToast({
								icon: 'none',
							  	title: res.data.msg
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.slot-content{
		.wxCode{
			width: 300rpx;
			height: 300rpx;
		}
	}
	.tips{
		z-index: 16;
		width: 190rpx;
		height: 240rpx;
		border-radius: 10rpx;
		position: absolute;
		top: 20%;
		left: 50%;
		transform: translateX(-50%);
		.work_publish{
			width: 100%;
			height: 80rpx;
			box-sizing: border-box;
			
			position: relative;
			.btn_publish{
				line-height: 80rpx;
				text-align: center;
				font-size: 26rpx;
				color: white;
				background-color: rgba(0,0,0,.4);
				&:hover{
					background: #D3D3D3;
				};
			}
			.line{
				position: absolute;
				bottom: 0;
				width: 100%;
				border: 2rpx solid #D1D1D1;
			}
		}
		.work_code{
			width: 100%;
			height: 80rpx;
			box-sizing: border-box;
			position: relative;
			.btn_code{
				line-height: 80rpx;
				text-align: center;
				font-size: 26rpx;
				color: white;
				background-color: rgba(0,0,0,.4);
				&:hover{
					background: #D3D3D3;
				};
			}
			.line{
				position: absolute;
				bottom: 0;
				width: 100%;
				border: 2rpx solid #D1D1D1;
			}
		}
		.work_delete{
			width: 100%;
			height: 80rpx;
			box-sizing: border-box;
			position: relative;
			.btn_delete{
				line-height: 80rpx;
				text-align: center;
				font-size: 26rpx;
				color: white;
				background-color: rgba(0,0,0,.4);
				&:hover{
					background: #D3D3D3;
				};
			}
			.line{
				position: absolute;
				bottom: 0;
				width: 100%;
				border: 2rpx solid #D1D1D1;
			}
		}
		.work_cancel{
			width: 100%;
			height: 80rpx;
			.btn_cancel{
				line-height: 80rpx;
				text-align: center;
				font-size: 26rpx;
				color: white;
				background-color: rgba(0,0,0,.4);
				&:hover{
					background: #D3D3D3;
				};
			}
		}
	}
	.icon_box{
		// border: 2rpx solid red;
		width: 80rpx;
		height: 50rpx;
		position: absolute;
		right: 26rpx;
		top: 26rpx;
		border-radius: 16rpx;
		background-color: rgba(0,0,0,.2);
		.more_icon{
			background: url(../../static/icon/more.png) center no-repeat;
			width: 100%;
			height: 100%;
			background-size: 30rpx;
		}
	}
	.demo-img-wrap{
		.demo-image {
			width: 100%;
			border-radius: 8rpx;
		}
	}
	.padding_box{
		width: 100%;
		padding: 0 16rpx;
		position: absolute;
		left: 0;
		bottom: 10rpx;
		.work_info{
			width: 100%;
			background-color: rgba(0,0,0,.2);
			.demo-title {
				font-size: 26rpx;
				padding: 10rpx 0 0 10rpx;
				color: white;
			}
			.hot_box{
				padding: 10rpx 0 10rpx 10rpx;
				display: flex;
				justify-content: flex-start;
				.hot_icon_box{
					width: 30rpx;
					height: 30rpx;
					icon{
						background: url(../../static/icon/heat_degree.png) center no-repeat;
						width: 100%;
						height: 100%;
						background-size: 100%;
					}
				}
				.demo-price {
					margin-left: 8rpx;
					font-size: 28rpx;
					color: white;
					line-height: 30rpx;
				}
			}
		}
	}
</style>
