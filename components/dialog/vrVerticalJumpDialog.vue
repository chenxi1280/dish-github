<template>
	<view>
	   <view class="popup-box" v-if="verticalJumpDialogFlag">
		  <image :src="imageUrl" @click="JumpToOtherApplets" ></image>
		  <icon @click="closeDialog" ></icon>
	   </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// verticalJumpDialogFlag: true
			}
		},
		props: {
			verticalJumpDialogFlag: {
				type: Boolean,
				default: true
			},
			// 图片地址
			imageUrl: {
				type: String,
				default: null
			},
			// 跳转 连接地址 
			navigatorUrl: {
				type: String,
				default: null
			},
			// 小程序id
			appId: {
				type: String,
				default: null
			},
			//作品 id
			artworkId:{
				type: String,
				default: null
			},
			popupPosition: {
				type: Number,
				default: 2
			},
			artworkTree: {
				type: Object,
				default: null
			}
		},
		onReady() {
			
		},
		onLoad() {
			
		},
		methods: {
			closeDialog(){
				this.$emit("closeDialog")
			},
			JumpToOtherApplets(){
				console.log("进来跳转了")
				if(this.appId && this.navigatorUrl){
					uni.navigateToMiniProgram({
						appId: this.appId,
						path: this.navigatorUrl,
						envVersion: 'release',
						extraData: {
						          source:'CandleWitches',
						          miniProgramName:'灵巫互动',
						          artwork: this.artworkId
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
			z-index: 17;
			image{
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
				width: 500rpx;
				height: 500rpx;
				// border-radius: 40rpx;
				z-index: 18;
			}
			icon{
				position: absolute;
				left: 80%;
				top: 20%;
				width: 60rpx;
				height: 60rpx;
				background: url(../../static/icon/dialogClose.png) no-repeat center;
				background-size: 60rpx;
				z-index: 18;
			}
		}
	}
</style>

