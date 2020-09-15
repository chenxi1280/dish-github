<template>
	<view class="signin">
		<view class="top">嗨！你好
			<view>欢迎注册四刻互动视频</view>
		</view>
		<view class="content">
			<view :class="isVerifyStyle.username ? 'user_right_box' : 'user_error_box'">
				<input v-model.trim="username" @blur="onblurUsername" class="userName" type="text" placeholder="昵称" />
			</view>
			<view :class="isVerifyStyle.phone ? 'user_right_box' : 'user_error_box'">
				<input v-model.trim="phone" @blur="onblurPhone" class="phone" type="text" placeholder="手机号" />
			</view>
			<view :class="isVerifyStyle.password ? 'user_right_box' : 'user_error_box'" :style="{'border': pwdBoxBorder}">
				<input v-model.trim="password" @blur="onblurPassword" onkeyup="value=value.replace(/[^a-z0-9]/g,'');" class="pwd"
				 password placeholder="密码" />
			</view>
			<view :class="isVerifyStyle.isPassword ? 'user_right_box' : 'user_error_box'" :style="{'border': isPwdBoxBorder}">
				<input v-model.trim="isPassword" @blur="onblurIsPassword" class="confirmPwd" password placeholder="确认密码" />
			</view>
			<view class="codeBox" v-if="!isShowTime">
				<view :class="isVerifyStyle.verify ? 'code_right_box' : 'code_error_box'">
					<input v-model.trim="verify" @blur="onblurVerify" type="text" placeholder="图文验证码" />
				</view>
				<view class="codeImage" @click="getTextVerify">
					<img :src="'data:image/jpeg;base64,' + imgSrc">
				</view>
			</view>
			<view class="phoneCodeBox">
				<view :class="isVerifyStyle_phone ? 'phoneCode_right_box' : 'phoneCode_error_box'" :style="{'border': phoneCodeBorder}">
					<input v-model.trim="verify_phone" @blur="onblurPhoneVerify" type="text" placeholder="手机验证码" />
				</view>
				<view class="button" >
					<a class="getPhoneCode" href="javascript:;" @click="phoneVerify">{{isShowTime ? times + 'S后再次发送' : '获取短信验证码'}}</a>
				</view>
			</view>
			<view class="deal_box">
				<checkbox :value="isChecked" color="black" @click="isClick" ></checkbox>
				<a href="javascript:;">同意用户注册协议</a>
			</view>
			<view class="signin-btn" @click="signin">
				<button type="default" plain="true">注册</button>
			</view>
			
		</view>
	</view>
</template>

<script>
	import { baseURL } from '../config/config.js'
	
	export default {
		data() {
			return {
				// 判断输入框颜色
				isVerifyStyle: {
					username: true,
					phone: true,
					password: true,
					isPassword: true,
					verify: true
				},
				// 用户名
				username: '',
				// 手机验证码
				verify_phone: '',
				// 手机号
				phone: '',
				password: '',
				isPassword: '',
				verify: '',
				// 控制验证码时间显示与否
				isShowTime: false,
				times: 60,
				// 验证码
				imgSrc: '',
				// 复选框状态
				isChecked: false,
				// 表单验证通过纪录  通过验证为true 默认为false
				isVerifyList: {
					username: false,
					phone: false,
					password: false,
					isPassword: false,
					verify: false
				},
				// 手机验证码填写状态
				isVerify_phone: false,
				isVerifyStyle_phone: true,
				pwdBoxBorder: '',
				isPwdBoxBorder: '',
				phoneCodeBorder: ''
			}
		},
		onLoad() {
			// 页面加载即获取验证码倒计时
			this.getResidueTime()
			// 获取验证码
			this.getTextVerify()
		},
		onUnload() {
			uni.navigateBack({
				url: "../login/login"
			})
		},
		computed: {
			isShowVerify: (that) => {
				if (that.times === 59) {
					return false
				} else if (that.times === 60) {
					return true
				} else {
					return true
				}
			}
		},
		methods: {
			// 注册功能
			async signin() {
				// 将输入框状态给到样式
				this.isVerifyStyle.username = this.isVerifyList.username
				this.isVerifyStyle.phone = this.isVerifyList.phone
				this.isVerifyStyle.password = this.isVerifyList.password
				this.isVerifyStyle.isPassword = this.isVerifyList.isPassword
				this.isVerifyStyle_phone = this.isVerify_phone
				if (!this.isVerifyList.username || !this.isVerifyList.phone || !this.isVerifyList.password || !this.isVerifyList.isPassword ||
					!this.isVerify_phone) {
					return uni.showToast({
						icon: 'none',
						title: '请正确填写红色框内的信息'
					})
				} else if (!this.isChecked) {
					return uni.showToast({
						icon: 'none',
						title: '请先同意用户注册协议'
					})
				} else {
					await uni.request({
						url: baseURL + "/wxRegister",
						method: 'POST',
						dataType: 'json',
						data: {
							password: this.password,
							username: this.username,
							mobile: this.phone,
							confirmPwd: this.isPassword,
							phoneConfirmCode: this.verify_phone,
							openid: uni.getStorageSync("openid")
						},
						success: res => {
							if (res.data.status == 200) {
								// console.log(res)
								uni.showToast({
									title: '注册成功!'
								})
								uni.setStorageSync("userId",res.data.data)
								// 注册清空表单
								this.password = ''
								this.username = ''
								this.phone = ''
								this.email = ''
								this.verify = ''
								this.isPassword = ''
								this.verify_phone = ''
								setTimeout(function() {
									uni.reLaunch({
										animationDuration: 5000,
										url: "../login/login"
									})
								}, 1500);
							} else if (res.data.status === 502) {
								uni.showToast({
									icon: 'none',
									title: '请正确填写手机验证码'
								})
							} else if (res.data.status === 507) {
								uni.showToast({
									icon: 'none',
									title: '验证码超时，请重新获取'
								})
							} else {
								uni.showToast({
									icon: 'none',
									title: '注册失败，请重试'
								})
							}
						}
					})
				}
			},
			// 用户名校验
			async onblurUsername() {
				// 请求前的预校验
				const regUsername = (/^[\u4E00-\u9FA5A-Za-z0-9_]+$/.test(this.username))
				// 先进行长度判断
				if (this.username.length < 2 || this.username.length > 16) {
					// 启用红色提示框
					this.isVerifyStyle.username = false
					// 核验纪录
					this.isVerifyList.username = false
					return uni.showToast({
						icon: 'none',
						duration: 2000,
						title: '请按照规则输入用户名：长度为2-16，只能包含中文英文和下划线'
					})
				}
				// 正则校验
				if (!regUsername) {
					// 启用红色提示框
					this.isVerifyStyle.username = false
					// 核验纪录
					this.isVerifyList.username = false
					uni.showToast({
						icon: 'none',
						duration: 2000,
						title: '请按照规则输入用户名：长度为2-16，只能包含中文英文和下划线'
					})
				} else {
					await uni.request({
						url: baseURL + "/validateUserName",
						method: 'POST',
						dataType: 'json',
						data: {
							username: this.username
						},
						success: res => {
							if (res.data.status === 200) {
								this.isVerifyList.username = true
								// 关闭红色提示框
								this.isVerifyStyle.username = true
							} else {
								uni.showToast({
									icon: 'none',
									title: '昵称已被使用'
								})
								// 启用红色提示框
								this.isVerifyStyle.username = false
							}
						}
					})
				}
			},
			// 手机号校验
			async onblurPhone() {
				// 请求前的预校验
				const regPhone = /^1[3456789]\d{9}$/.test(this.phone)
				// 正则校验
				if (!regPhone) {
					uni.showToast({
						icon: 'none',
						title: '请输入正确的手机号'
					})
					this.isVerifyList.phone = false
					this.isVerifyStyle.phone = false
				} else {
					await uni.request({
						url: baseURL + "/isExistMobile",
						method: 'POST',
						dataType: 'json',
						data: {
							mobile: this.phone
						},
						success: res => {
							if (res.data.status === 200) {
								this.isVerifyStyle.phone = true
								this.isVerifyList.phone = true
							} else {
								this.isVerifyStyle.phone = false
								this.isVerifyList.phone = false
								uni.showToast({
									icon: 'none',
									title: '账号已被注册，请直接登录'
								})
							}
						}
					})
				}
			},
			// 密码校验
			onblurPassword() {
				// 请求前的预校验
				const regPassword = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/.test(this.password)
				// 正则校验
				if (!regPassword) {
					this.isVerifyStyle.password = false
					this.isVerifyList.password = false
					uni.showToast({
						icon: 'none',
						duration: 2000,
						title: '请输入同时包含数字和英文8-16位密码'
					})
					this.password = ''
				} else {
					this.isVerifyStyle.password = true
					this.isVerifyList.password = true
					this.pwdBoxBorder = '1px solid black'
				}
			},
			// 密码确认校验
			onblurIsPassword() {
				// 正则校验
				if (!(this.password === this.isPassword)) {
					uni.showToast({
						icon: 'none',
						title: '两次密码输入不一致，请重新输入'
					})
					this.isPwdBoxBorder = '1px solid red'
					this.isPassword = ''
					this.isVerifyList.isPassword = false
				} else {
					this.isVerifyList.isPassword = true
					this.isPwdBoxBorder = '1px solid black'
				}
			},
			// 图文验证码校验
			onblurVerify() {
				// 请求前的预校验
				const regPassword = /^[A-Za-z0-9]{4}$/.test(this.verify)
				// 正则校验
				if (!regPassword) {
					this.isVerifyList.verify = false
					this.isVerifyStyle.verify = false
					uni.showToast({
						icon: 'none',
						title: '请正确输入图文验证码'
					})
				} else {
					this.isVerifyList.verify = true
					this.isVerifyStyle.verify = true
				}
			},
			// 手机验证码校验
			onblurPhoneVerify() {
				// 请求前的预校验
				const regPassword = /^\d{6}$/.test(this.verify_phone)
				// 正则校验
				if (!regPassword) {
					this.isVerify_phone = false
					this.phoneCodeBorder = '1px solid red'
					uni.showToast({
						icon: 'none',
						title: '请正确输入手机验证码'
					})
				} else {
					this.isVerify_phone = true
					this.phoneCodeBorder = '1px solid black'
				}
			},
			// 获取手机验证码
			async phoneVerify() {
				if (this.times != 60) return
				const veriftStatus = this.isVerifyList
				const verifyStyle = this.isVerifyStyle
				// 请求前的预校验
				verifyStyle.username = veriftStatus.username
				verifyStyle.phone = veriftStatus.phone
				verifyStyle.password = veriftStatus.password
				verifyStyle.isPassword = veriftStatus.isPassword
				verifyStyle.verify = veriftStatus.verify
				for (const item in this.isVerifyList) {
					if (!this.isVerifyList[item]) {
						return uni.showToast({
							icon: 'none',
							title: '请正确填写红色框内的信息'
						})
					}
				}
				// 预校验通过 点击发送验证码先进行图文验证码判断
				await uni.request({
					url: baseURL + "/validateImageCode",
					method: 'POST',
					dataType: 'json',
					data: {
						confirmCode: this.verify,
						imageCodeKey: uni.getStorageSync('imageCodeKey')
					},
					success: async res => {
						if (res.data.status === 200) {
							this.getTextVerify()
							// 将时间常量存到本地
							const endDate = (new Date()).getTime() + 60000
							uni.setStorageSync('myEndTime', JSON.stringify(endDate))
							uni.setStorageSync('isShowTime', JSON.stringify(!this.isShowTime))
							this.codeDown(endDate)
							// 发送请求获取验证码请求
							await uni.request({
								url: baseURL + "/sendSMS",
								method: 'post',
								dataType: 'json',
								data: {
									mobile: this.phone
								},
								success: data => {
									if (data.data.status === 200) {
										uni.showToast({
											icon: 'none',
											title: '验证码发送成功'
										})
									} else {
										uni.showToast({
											icon: 'none',
											title: '验证码发送失败'
										})
									}
								},
							})
							// console.log(res)
						} else {
							uni.showToast({
								icon: 'none',
								title: '请正确输入验证码'
							})
							// 重新获取验证码
							this.getTextVerify()
						}
					}
				})
			},
			// 将保存到本地的时间进行计算  防止页面刷新时间重置
			codeDown(endDate) {
				this.times = Math.ceil((endDate - (new Date()).getTime()) / 1000)
				this.isShowTime = uni.getStorageSync('isShowTime')
				const time = setTimeout(() => {
					this.times--
					if (this.times < 1) {
						this.isShowTime = false
						this.times = 60
						uni.removeStorageSync('myEndTime')
						uni.removeStorageSync('isShowTime')
						clearTimeout(time)
					} else {
						this.codeDown(endDate)
					}
				})
			},
			// 刷新页面获取剩余可发送验证码时间
			getResidueTime() {
				const myEndTime = uni.getStorageSync('myEndTime')
				myEndTime && this.codeDown(myEndTime)
			},
			// 获取图文验证码
			async getTextVerify() {
				await uni.request({
					url: baseURL + "/getWxConfirmCode",
					method: 'post',
					dataType: 'json',
					success: res => {
						this.imgSrc = res.data.data.base64Str
						uni.setStorageSync('imageCodeKey', res.data.data.imageCodeKey)
					}
				})
			},
			isClick(){
				this.isChecked=!this.isChecked
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F08080;
	}
	.signin {
		.top {
			height: 150rpx;
			width: 750rpx;
			color: #FCFCFC;
			font-size: 40rpx;
			font-weight: bold;
			margin-left: 100rpx;
			margin-top: 100rpx;
		}

		.content {
			.user_right_box {
				width: 670rpx;
				height: 92rpx;
				border: 2rpx solid black;
				border-radius: 10rpx;
				margin: 0 auto;
				margin-top: 50rpx;
				display: flex;
				justify-content: flex-start;

				.userName {
					width: 100%;
					height: 100%;
					padding-left: 20rpx;
				}

				.phone {
					width: 100%;
					height: 100%;
					padding-left: 20rpx;
				}

				.pwd {
					width: 100%;
					height: 100%;
					padding-left: 20rpx;
				}

				.confirmPwd {
					width: 100%;
					height: 100%;
					padding-left: 20rpx;
				}
			}

			.user_error_box {
				width: 670rpx;
				height: 92rpx;
				border: 2rpx solid red;
				border-radius: 10rpx;
				margin: 0 auto;
				margin-top: 50rpx;
				display: flex;
				justify-content: flex-start;

				.userName {
					width: 100%;
					height: 100%;
					padding-left: 20rpx;
				}

				.phone {
					width: 100%;
					height: 100%;
					padding-left: 20rpx;
				}

				.pwd {
					width: 100%;
					height: 100%;
					padding-left: 20rpx;
				}

				.confirmPwd {
					width: 100%;
					height: 100%;
					padding-left: 20rpx;
				}
			}

			.codeBox {
				width: 670rpx;
				height: 92rpx;
				/* border: 2rpx solid black; */
				border-radius: 10rpx;
				margin: 0 auto;
				margin-top: 50rpx;
				display: flex;
				justify-content: space-between;

					.code_right_box {
						border: 2rpx solid black;
						border-radius: 10rpx;
						height: 100%;
						width: 60%;
						padding-left: 20rpx;

						input {
							width: 100%;
							height: 100%;
						}
					}

					.code_error_box {
						border: 2rpx solid red;
						border-radius: 10rpx;
						height: 100%;
						width: 60%;
						padding-left: 20rpx;

						input {
							width: 100%;
							height: 100%;
						}
					}

					.codeImage {
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
				.phoneCodeBox {
					width: 670rpx;
					height: 92rpx;
					/* border: 2rpx solid black; */
					border-radius: 10rpx;
					margin: 0 auto;
					margin-top: 50rpx;
					display: flex;
					justify-content: space-between;

					.phoneCode_error_box {
						border: 2rpx solid red;
						border-radius: 10rpx;
						height: 100%;
						width: 30%;
						padding-left: 20rpx;

						input {
							width: 100%;
							height: 100%;
						}
					}

					.phoneCode_right_box {
						border: 2rpx solid black;
						border-radius: 10rpx;
						height: 100%;
						width: 30%;
						padding-left: 20rpx;

						input {
							width: 100%;
							height: 100%;
						}
					}

					.button {
						border: 2rpx solid black;
						border-radius: 10rpx;
						height: 100%;
						width: 60%;

						.getPhoneCode {
							font-size: 35rpx;
							width: 100%;
							height: 100%;
							text-align: center;
							line-height: 92rpx;
						}
					}
				}

				.signin-btn {
					&:hover {
						background-color: #EEEEE0;
					}
					border: 2rpx solid black;
					border-radius: 10rpx;
					width: 670rpx;
					margin: 0 auto;
					margin-top: 50rpx;
					margin-bottom: 30rpx;
					button{
						border: none;
						width: 100%;
						height: 100%;
					}
				}
				
				.deal_box{
					width: 670rpx;
					display: flex;
					justify-content: flex-start;
					margin: 0 auto;
					margin-top: 50rpx;
				}
			}
		}
</style>
