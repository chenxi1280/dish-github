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
				verticalJumpDialogFlag: true
			}
		},
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
				this.verticalJumpDialogFlag = false
				this.$parent.openVideoShowFlag()
				let isEndings = uni.getStorageSync('isEndings')
				if(isEndings == 1 && uni.getStorageSync('isEndingsJump')){
					uni.setStorageSync('isEndingsJump',false)
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
				if(this.navigatorUrl.search('https') === -1){
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
				}else{
					uni.navigateTo({
						url: "./web-view/webView?src=" + navigatorUrl
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
    z-index: 9999;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    image {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 500rpx;
      height: 500rpx;
      // border-radius: 40rpx;
      z-index: 9999;
    }
    icon {
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

