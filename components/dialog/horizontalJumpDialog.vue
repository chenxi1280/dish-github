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
				default: null
			},
			navigatorUrl: {
				type: String,
				default: null
			},
			appId: {
				type: String,
				default: null
			},
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
			console.log("******************************popImageUrl: ",popImageUrl)
		},
		methods: {
			closeDialog(){
				this.horizontalJumpDialogFlag = false
				this.$parent.openVideoShowFlag()
				let isEndings = uni.getStorageSync('isEndings')
				if(isEndings == 1 && uni.getStorageSync('isEndingsJump')){
					uni.setStorageSync('isEndingsJump',false)
					//&& isGetMultipleFlag
					if(this.popupPosition == 1){
						this.$emit("videoEnd",true)
					}else{
						this.$emit("multipleResultCallbackTodo",true)
					}
				}else{
					if(this.popupPosition == 1){
						this.$emit("videoEnd",true)
					}else{
						this.$emit("initPlayData",this.artworkTree,true)
					}
				}
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
page {
  background-color: white;
  .popup-box {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 99999;
    image {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%) rotateZ(90deg);
      width: 500rpx;
      height: 500rpx;
      // border-radius: 40rpx;
      z-index: 18;
    }
    icon {
      position: absolute;
      right: 10%;
      top: 70%;
      width: 60rpx;
      height: 60rpx;
      background: url(../../static/icon/dialogClose.png) no-repeat center;
      background-size: 60rpx;
      z-index: 18;
    }
  }
}
</style>

