<template>
	<view class="waterfall">
		<view class="left">
			<block v-for="(item, index) in leftList" :key="index">
				<view class="waterfall-item" @click="goPlayPage(item.pkArtworkId,item.playMode)">
					
<!-- 					<view v-if="item.code  == 'ad'" >
						<ad-custom unit-id="adunit-59f062ee3b27d685" @onload="adLoad" @onerror="adError" @bindload="adLoad" @binderror="adError" ></ad-custom>
					</view> -->
					
					<view v-if ="item.code  != 'ad'">
						<image :src="item.logoPath" mode="widthFix" lazy-load ></image>
							<view class="mask_box">
								<view class="production_userinfo">
									<img :src="item.userLogoUrl">
									<text>{{item.userName}}</text>
								</view>
								<view class="production_title">
									<text>{{item.artworkName}}</text>
								</view>
								<view class="production_hot">
									<img src="../../../static/icon/heat_degree.png">
									<text>{{item.hotCount}}</text>
								</view>
							</view>
						</view>
					</view>
			</block>
		</view>
		<view :class="{'right': isRightStyle ,'rightOne': !isRightStyle}">
			<block v-for="(item, index) in rightList" :key="index">
				
				
				
				<view class="waterfall-item" @click="goPlayPage(item.pkArtworkId,item.playMode)">
					
					
<!-- 					<view v-if="item.code  == 'ad'" >
						<ad-custom unit-id="adunit-59f062ee3b27d685" @onload="adLoad" @onerror="adError" @bindload="adLoad" @binderror="adError" ></ad-custom>
					</view>
					 -->
					<view v-if ="item.code  != 'ad'">
						<image :src="item.logoPath" mode="widthFix" lazy-load  @load="onImageLoad" v-if="isRightStyle" ></image>
						<view class="mask_box" >
							<view class="production_userinfo" v-if="isRightStyle">
								<img :src="item.userLogoUrl">
								<text>{{item.userName}}</text>
							</view>
							<view class="production_title" v-if="isRightStyle">
								<text>{{item.artworkName}}</text>
							</view>
							<view class="production_hot" v-if="isRightStyle">
								<img src="../../../static/icon/heat_degree.png">
								<text>{{item.hotCount}}</text>
							</view>
						</view>
					</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			list: {
				type: Array,
			}
		},
		watch: {
			list(n, o) {
				let that = this;
				let ol = o.length;
				let nl = n.length;
				// console.log('=====watch  list=====', n, o,ol,nl,this.leftHeight , this.rightHeight );
				if (nl > ol) {
		
		
					if (this.list.length == 1 ) {
						console.log(that.list[0],144)
						this.isRightStyle = false
						this.leftList.push(this.list[0]); 
						this.rightList.push(this.list[0]); 
						return
					}
					
					// if (this.list.length == 1 ) {
					// 	console.log(that.list[0],144)
					// 	this.isRightStyle = false
					// 	this.rightList.push(this.list[0]); 
					// 	return
					// }
					
					if (this.leftHeight >= this.rightHeight) {
							this.rightLeftPush(nl,ol)
					} else {
						this.leftRightPush(nl,ol)
					}
					
					
					
					
					
					// this.onImageLoad({addImgUrlFlag : null},{detail:{height: 480, width: 270}} );
				}
				
				
			}
		},
		data() {
			return {
				isRightStyle: true,
				leftList: [],
				rightList: [],
				itemIndex: 0,
				leftHeight: 0,
				rightHeight: 0
			};
		},
		created() {
			// console.log([this.list[]] )
			console.log(this.list)
			// this.leftList = []
			// if (this.list && this.list.length > 0) {
			// 	// this.list[0].addImgUrlFlag = 123123
			// 	this.leftList = [this.list[0]]; //第一张图片入栈
			// }
		},
		destroyed() {
			console.log('destroy');
		},
		methods: {
			
			leftRightPush(nl,ol){
				for (var i = ol; i < nl; i++) {
					if (i % 2 ) {
						this.leftList.push(this.list[i]);
					}else{
						this.rightList.push(this.list[i]);
					}
				}
			},
			
			rightLeftPush(nl,ol){
				for (var i = ol; i < nl; i++) {
					if (i % 2 ) {
						this.rightList.push(this.list[i]);
					}else{
						this.leftList.push(this.list[i]);
					}
				}

			},
			
			async onImageLoad(item, e) {
				// console.log(item,e,"item")
				if (!e) {
					console.log('无图片！！！！');
					return;
				}
				if (item.addImgUrlFlag == null) {
					item.addImgUrlFlag = 112121212
				} else {
					return
				}
				// 算出图片在 瀑布流的 高度和 div 的 高
				let imgH = (e.detail.height / e.detail.width) * 162 + 10; //图片显示高度加上下面的文字的高度100rpx,加上margin-bottom20rpx

				
				let that = this;
				if (that.itemIndex === 0) {
					that.leftHeight += imgH; //第一张图片高度加到左边
					that.itemIndex++;
					if (that.list.length == 1 && that.itemIndex == 1) {
						console.log(that.list[0],144)
						this.isRightStyle = false
						that.rightList.push(that.list[0]); //第二张图片先入栈
						return
					}
					// console.log('that，itemIndex',that.itemIndex)
					that.rightList.push(that.list[that.itemIndex]); //第二张图片先入栈
				} else {
					//再加高度
					that.itemIndex++;
					// 左右高度比
					if (that.leftHeight > that.rightHeight) {
						that.rightHeight += imgH;
					} else {
						that.leftHeight += imgH;
					}
					// 是否还需要新增
					if (that.itemIndex < that.list.length) {
						// console.log('新增了，itemIndex',that.itemIndex)
						//下一张图片入栈
						if (that.leftHeight > that.rightHeight) {
							// console.log('rightHeight')
							that.rightList.push(that.list[that.itemIndex]);
						} else if (that.leftHeight < that.rightHeight) {
							// console.log('leftHeight')
							that.leftList.push(that.list[that.itemIndex]);
						} else {
							if (that.leftHeight <=  that.rightHeight) {
									that.leftList.push(that.list[that.itemIndex]);
							} else {
									that.rightList.push(that.list[that.itemIndex]);
							}
						}
					}
				}
				
			},
			goPlayPage(pkArtworkId,playMode) {
				console.log("************playMode: ",playMode)
				if(playMode === 2){
					uni.navigateTo({
						url: "../vrTransition/vrTransition?pkArtworkId=" + pkArtworkId,
					})
				}else{
					uni.navigateTo({
						url: "../play/play?pkArtworkId=" + pkArtworkId,
					})
				}
			},
		}
	};
</script>


<style>
	/* page不能写带scope的style标签中，否则无效 */
	page {
		background-color: rgb(240, 240, 240);
	}
</style>

<style lang="scss">
	
	.waterfall {
		width: 100%;
		display: flex;
		justify-content: space-between;
		justify-content: space-evenly;
		// justify-content:flex-start ;
		box-sizing: border-box;

		.left,
		.right {
			.waterfall-item {
				border-radius: 16rpx;
				background-color: #FFFFFF;
				box-sizing: border-box;
				padding: 10rpx;
				width: 344rpx;
				margin-top: 20rpx;
				position: relative;

				image {
					width: 324rpx;
					display: block;
					border-radius: 8rpx;
				}

				.mask_box {
					position: absolute;
					bottom: 0;
					left: 0;
					display: block;
					padding: 10rpx 10rpx;
					background-color: rgba(0, 0, 0, .2);
					width: 324rpx;
					color: #fff;
					left: 50%;
					transform: translateX(-50%);
					margin-bottom: 10rpx;

					.production_userinfo {
						img {
							display: inline-block;
							width: 60rpx;
							height: 60rpx;
							border-radius: 30rpx;
							margin-right: 10rpx;
						}

						text {
							display: inline-block;
							width: 210rpx;
							height: 60rpx;
							line-height: 60rpx;
							overflow: hidden;
							white-space: nowrap
						}
					}

					.production_title {
						margin-bottom: 10rpx;
					}

					.production_hot {
						img {
							display: inline-block;
							width: 40rpx;
							height: 40rpx;
							vertical-align: top;
						}

						text {
							margin-left: 10rpx;
						}
					}
				}
			}
		}

		.rightOne {
			.waterfall-item {
				border-radius: 16rpx;
				background-color: #e3e3e3;
				box-sizing: border-box;
				// padding: 10rpx;
				width: 344rpx;
				// margin-top: 20rpx;
				position: relative;

				image {
					width: 324rpx;
					display: block;
					height: 0px
				}

				.mask_box {
					position: absolute;
					bottom: 0;
					left: 0;
					display: block;
					padding: 10rpx 10rpx;
					// background-color: rgba(0,0,0, .2);
					width: 324rpx;
					color: #e3e3e3;
					left: 50%;
					transform: translateX(-50%);
					margin-bottom: 10rpx;

					.production_userinfo {
						img {
							display: inline-block;
							width: 60rpx;
							// height: 60rpx;
							border-radius: 30rpx;
							margin-right: 10rpx;
						}

						text {
							display: inline-block;
							width: 210rpx;
							// height: 60rpx;
							// line-height: 60rpx;
							overflow: hidden;
							white-space: nowrap
						}
					}

					.production_title {
						margin-bottom: 10rpx;
					}

					.production_hot {
						img {
							display: inline-block;
							width: 40rpx;
							// height: 40rpx;
							vertical-align: top;
						}

						text {
							// margin-left: 10rpx;
						}
					}
				}
			}
		}
	}
</style>
