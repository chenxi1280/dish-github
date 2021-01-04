<template>
	<view>
	   <view class="popup-box" v-if="horizontalJumpDialogFlag">
			<image :src="imageUrl" @click="JumpToOtherApplets" ></image>
			<icon @click="closeDialog" ></icon>
	   </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				horizontalJumpDialogFlag: true
			}
		},
		//wxa001a9842ad0f851
		props: {
			imageUrl: {
				type: String,
				default: 'https://sike-1259692143.cos.ap-chongqing.myqcloud.com/baseImg/1605600100857%E5%9C%86%E5%BD%A2%E7%94%A8JPG.jpg'
			},
			navigatorUrl: {
				type: String,
				default: 'pages/index/index'
			},
			appId: {
				type: String,
				default: 'wx25e1eb19e2d9e715'
			},
			artworkName:{
				type: String,
				default: '灵巫'
			}
		},
		onReady() {
			
		},
		onLoad() {
			
		},
		methods: {
			closeDialog(){
				this.horizontalJumpDialogFlag = false
			},
			JumpToOtherApplets(){
				console.log("进来跳转了")
				uni.navigateToMiniProgram({
					appId: this.appId,
					path: this.navigatorUrl,
					envVersion: 'release',
					extraData: {
					          source:'CandleWitches',
					          miniProgramName:'灵巫互动',
					          artwork: this.artworkName
					},
					success(res){
						console.log('跳转成功')
					},
					fail(res){
						console.log('跳转失败: ',res)
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: white;
		.popup-box{
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, .8);
			z-index: 10;
			image{
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%) rotateZ(90deg);
				width: 400rpx;
				height: 400rpx;
				border-radius: 40rpx;
				z-index: 15;
			}
			icon{
				position: absolute;
				right: 10%;
				top: 70%;
				width: 60rpx;
				height: 60rpx;
				background: url(../../static/icon/dialogClose.png) no-repeat center;
				background-size: 60rpx;
				z-index: 15;
			}
		}
	}
</style>

