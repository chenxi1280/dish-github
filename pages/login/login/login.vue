<template>
	<view class="login">
		<view class="top">
			<view class="login_redirect_btn">登录
				<view>Welcome</view>
			</view>
			<!-- <view class="signin_redirect_btn" @click="toSigninPage">注册</view> -->
		</view>
		 <!-- #ifdef MP-WEIXIN -->
		<view class="bottom">
			<view class="phoneBox" :style="{'border': phoneBoxBorder}">
				<icon class="phoneIcon"></icon>
				<input v-on:blur="onblurPhone" class="acount" type="text" v-model.trim="phone" placeholder="输入手机号"/>
			</view>
			<view class="pwdBox" :style="{'border': pwdBoxBorder}">
				<icon  class="pwdIcon"></icon>
				<input class="pwd" v-on:blur="onblurPassword" v-model.trim="password" password placeholder="密码"/>
			</view>
			<view class="codeBox">
				<view class="code" :style="{'border': codeBoxBorder}">
					<input v-on:blur="onblurVerfiy" onKeyUp="value=value.replace(/[\W]/g,'')" v-model.trim="verify" />
				</view>
				<view class="codeImage" @click="getTextVerify">
					<img :src="'data:image/jpeg;base64,'+imgSrc">
				</view>
			</view>
			<button class="login" type="default" plain="true" @click="login">登录</button>
			<!-- <view class="forgetPwdBox" @click="showLinkAddress">
				<view class="forgetPwd">忘记密码</view>
			</view> -->
		</view>
		<view class="component">
			<my-dialog message= '修改密码请前往灵巫互动专业版web端进行操作\n\n网站地址：https://wanxiangchengzhen.com/ivetool/#/login/password'
					  confirmContext="复制"
					  concelContext="取消"
					  @confirm="confirm" ></my-dialog>
		</view>
		<view>
			<temporary confirmContext="确定"
					  concelContext="取消"
					   @confirm="mistake"></temporary>
		</view>
		<!-- #endif -->
	</view>
</template>
<script>
	import { baseURL } from '../config/config.js'
	import myDialog from '../../../components/dialog/myDialog.vue'
	import {globalBus} from '../../../common/js/util.js'
	import temporary from '../../../components/dialog/temporary.vue'
	
	export default {
	  data () {
	    return {
	      phone: '', 
	      password: '', 
	      // 输入的图文验证码
	      verify: '',
	      // 图文验证码
	      imgSrc: '',
		  phoneBoxBorder: '',
		  pwdBoxBorder: '',
		  codeBoxBorder: '',
		  //是否式播放页跳转
		  isPlayJump: false
	    }
	  },
	  components: {
	  		myDialog,
			temporary
	  },
	  onLoad (option) {
		if(option.isPlayJump == 'true'){
			this.isPlayJump = true
		}
	    this.getTextVerify()
	  },
	  onUnload() {
	  	uni.switchTab({
	  		url: '../../mine/mine'
	  	})
	  },
	  methods: {
		showLinkAddress(){
			globalBus.$emit('deliver',true)
		},
		confirm(param){
			uni.setClipboardData({
			        data: 'https://wanxiangchengzhen.com/ivetool/#/login/password',
			        success: res=> {
						uni.showToast({
							icon: 'none',
							title:'复制成功'
						})
			        }
			    });
		},
	    // 登录功能
	    async login () {
	      // 请求前的预校验
	      const regPhone = !/^1[3456789]\d{9}$/.test(this.phone)
	      const regPwd = !/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/.test(this.password)
	      const regCode = !/^[A-Za-z0-9]{4}$/.test(this.verify)
	      if (regPhone) {
			return  uni.showToast({
				icon: 'none',
			  	title: '请正确输入手机号'
			  })
	      } else if (regPwd) {
			return  uni.showToast({
				icon: 'none',
			  	title: '密码输入错误'
			  })
	      } else if (regCode) {
			return uni.showToast({
				icon: 'none',
			  	title: '请正确输入验证码'
			  })
	      } else {
	        // console.log('成功发送登录请求')
	        const imageCodeKey = uni.getStorageSync('imageCodeKey')
			await uni.request ({
				url: baseURL + "/wxLogin",
				method: 'POST',
				dataType: 'json',
				data: {
					password: this.password,
					mobile: this.phone,
					confirmCode: this.verify,
					imageCodeKey: imageCodeKey,
					openid: uni.getStorageSync('openid')
				},
				success: res=> {
					if (res.data.status === 200) {
						// console.log(res)
						globalBus.$emit('getLight')
						uni.setStorageSync("token", res.data.data)
						uni.showToast({
							title: '登录成功'
						})
						//登陆页面跳转标志
						uni.setStorageSync('isLoginJump', 0)
						if(this.isPlayJump){
							setTimeout(function() {
								uni.redirectTo({
									url: '../../play/play',
								})
							}, 1500);
						}else{
							setTimeout(function() {
								uni.switchTab({
									url: '../../mine/mine',
									success: function (e) {
										var page = getCurrentPages().pop();
										if (page == undefined || page == null) return;
										page.onLoad();
									}
								}) 
							}, 1500);
						}
						
					} else if (res.data.status == 508) {
					  for (let i = 0; i < res.data.data.length; i++) {
					    if (res.data.data[i] == '501') {
					      this.getTextVerify()
						  return uni.showToast({
								icon: 'none',
						    	title: '请正确输入验证码'
						    })
					    } else if (res.data.data[i] == '505') {
					      this.getTextVerify()
						  return uni.showToast({
								icon: 'none',
								title: '账号未注册，请注册账号'
						    })
					    } else if (res.data.data[i] == '506') {
					      this.getTextVerify()
						  return uni.showToast({
								icon: 'none',
						    	title: '请正确输入密码'
						    })
					    } else if (res.data.data[i] == '509') {
					      this.getTextVerify()
						  return uni.showToast({
								icon: 'none',
						    	title: '账号被封禁'
						    })
					    }
					  }
					} else {
						uni.showToast({
							icon: 'none',
							title: '登录异常，请重试'
						})
						this.getTextVerify()
					}
				}
			})
	      }
	    },
	    // 前往注册页面
	    toSigninPage () {
	    	/* uni.navigateTo({
	    		url: "../signin/signin"
	    	}) */
			//暂不开放 显示邀请码弹窗
			globalBus.$emit('show',true)
	    },
		mistake(){
			//临时用来解决注册暂不开放的解决方案
			uni.showLoading({
				mask: true
			});
			setTimeout( () => {
				 uni.hideLoading();
				 uni.showToast({
				 	icon: 'none',
					title: '请输入正确邀请码'
				 })
			}, 200);
		},
	    // 获取图文验证码
	    async getTextVerify () {
			await uni.request({
				url: baseURL + "/getWxConfirmCode",
				method: 'POST',
				success: res => {
					this.imgSrc = res.data.data.base64Str
					uni.setStorageSync('imageCodeKey', res.data.data.imageCodeKey)
				}
			})
	    },
	    // 手机号校验
	    onblurPhone () {
	      // 请求前的预校验
	      const regPhone = /^1[3456789]\d{9}$/.test(this.phone)
	      // 正则校验
	      if (!regPhone) {
	        uni.showToast({
				icon: 'none',
	        	title: '请正确输入手机号'
	        })
			this.phoneBoxBorder = '1px solid red'
	      } else {
			this.phoneBoxBorder = '1px solid black'
	      }
	    },
	    // 密码校验
	    onblurPassword () {
	      // 请求前的预校验
	      const regPassword = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/.test(this.password)
	      // 正则校验
	      if (!regPassword) {
			uni.showToast({
				icon: 'none',
			  	title: '请正确输入密码'
			  })
	        this.password = ''
			this.pwdBoxBorder = '1px solid red'
	      } else {
	        this.pwdBoxBorder = '1px solid black'
	      }
	    },
	    // 验证码校验
	    onblurVerfiy () {
	      // 请求前的预校验
	      const regPassword = /^[A-Za-z0-9]{4}$/.test(this.verify)
	      // 正则校验
	      if (!regPassword) {
			uni.showToast({
				icon: 'none',
			  	title: '请正确输入图文验证码'
			  })
	        this.verify = ''
	        this.codeBoxBorder = '1px solid red'
	      } else {
	        this.codeBoxBorder = '1px solid black'
	      }
	    }
	  }
	}
</script>

<style lang="scss">
	page{
		background-color: white;
	}
	.login {
		.top{
			display: flex;
			justify-content: space-between;
			height: 500rpx;
			width: 750rpx;
			.login_redirect_btn {
				color: black;
				font-size: 50rpx;
				font-weight: bold;
				margin-left: 100rpx;
				margin-top: 100rpx;
			}
			.signin_redirect_btn{
				// border: 2rpx solid red;
				height: 80rpx;
				width: 80rpx;
				color: #FCFCFC;
				font-weight: bold;
				font-size: 36rpx;
				margin: 20rpx;
			}
		}
		.bottom{
			.phoneBox{
				border: 2rpx solid black;
				height: 92rpx;
				border-radius: 10rpx;
				width: 670rpx;
				margin: 0 auto;
				margin-top: 100rpx;
				display: flex;
				justify-content: flex-start;
				.acount{
					width: 100%;
					height: 100%;
				}
				.phoneIcon{
					background: url(../../../static/icon/mobile.png) no-repeat center;
					width: 80rpx;
					height: 92rpx;
					background-size: 60rpx;
				}
			}
			.pwdBox{
				width: 670rpx;
				height: 92rpx;
				border: 2rpx solid black;
				border-radius: 10rpx;
				margin: 0 auto;
				margin-top: 50rpx;
				display: flex;
				justify-content: flex-start;
				.pwdIcon{
					background: url(../../../static/icon/password.png) no-repeat center;
					width: 80rpx;
					height: 80rpx;
					background-size: 60rpx;
				}
				.pwd{
					width: 100%;
					height: 100%;
				}
			}
			.codeBox{
				width: 670rpx;
				height: 92rpx;
				border-radius: 10rpx;
				margin: 0 auto;
				margin-top: 50rpx;
				display: flex;
				justify-content: space-between;
				.code{
					border: 2rpx solid black;
					border-radius: 10rpx;
					height: 100%;
					width: 60%;
					padding-left: 40rpx;
					input{
						width: 100%;
						height: 100%;
					}
				}
				.codeImage{
					border: 2rpx solid black;
					border-radius: 10rpx;
					height: 100%;
					width: 30%;
					img {
						border-radius: 10rpx;
						width: 100%;
						height: 100%;
					}
				}
			}
			.login{
				&:hover{
					background-color: #EEEEE0;
				}
				border: 2rpx solid black;
				width: 670rpx;
				margin: 0 auto;
				margin-top: 50rpx;
			}
			.forgetPwdBox{
				margin: 0 auto;
				margin-top: 20rpx;
				width: 670rpx;
				height: 50rpx;
				.forgetPwd{
					line-height: 50rpx;
					text-align: center;
				}
				.popup-box{
					border: 2rpx solid black;
					background-color: white;
					width: 400rpx;
					height: 300rpx;
				}
			}
		}
	}
</style>
