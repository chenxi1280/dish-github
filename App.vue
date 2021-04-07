<script>
	
	import { baseURL } from 'pages/login/config/config.js'
	import {globalBus} from './common/js/util'
	
	export default {
		data() {
		    return {
		        nickName: null,
				gender: null,
		        avatarUrl: null,
				country: null,
				province: null,
				city: null,
				language: null
		    }
		},
		 methods: {
			checkUpdate(){
				const updateManager = uni.getUpdateManager();
				updateManager.onCheckForUpdate(function (res) {
				    // 请求完新版本信息的回调
					console.log("是否有更新: ",res.hasUpdate);
					if(res.hasUpdate){
						this.updateApplets()
					}
				});
				updateManager.onUpdateFailed(function (res) {
					this.checkUpdate()
				});
			},
			updateApplets(){
				updateManager.onUpdateReady(function (res) {
				    uni.showModal({
						title: '更新提示',
						content: '新版本已经准备好，是否重启应用？',
						success(res) {
							if (res.confirm) {
								 // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
								updateManager.applyUpdate();
							}
						}
					});
				});
			},
			login() {
					let _this = this
					uni.login({
						provider: 'weixin',
						success: async loginRes => {
							let code = loginRes.code
							await uni.request({
								url: baseURL + '/getOpenid',
								data: {
										code: code,
								},
								method: 'POST',
								header: {
										'content-type': 'application/json'
								},
								success: res => {
									if (res.data.status == 200) {
										uni.setStorageSync("openid",res.data.data.openid)
										_this.updateUserInfo()
									}else{
										return uni.showToast({
										icon: 'none',
										title: '授权失败，请退出重新进入小程序'
										})
									}
								}
							})
						},
					})
			},
			async updateUserInfo() {
				let _this = this
				let token = uni.getStorageSync("token")
				if(!token){
					await uni.request({
						url: baseURL + '/savaUserInfo',
						data: {
							openid: uni.getStorageSync("openid"),
							nickname: _this.nickName,
							gender: _this.gender,
							avatarurl: _this.avatarUrl,
							country: _this.country,
							province: _this.province,
							city: _this.city,
							language: _this.language
						},
						method: 'POST',
						header: {
							'content-type': 'application/json'
						},
						success: (res) => {
							if (res.data.status == 200) {
								uni.setStorageSync("token",res.data.data)
								uni.reLaunch({
									url: 'pages/dishover/dishover'
								})
								globalBus.$emit('getLightOfAppReady')
							}
						}
					})
				}
			},
			onLaunch: function() {
				let _this = this;
				_this.checkUpdate()
				let openid = uni.getStorageSync("openid")
				if(openid){
					uni.navigateTo({
						//不是第一次登录直接去首页
						url: "pages/dishover/dishover"
					})
				}else{
					_this.login()
				}
				
			},
			onShow: function() {
				console.log('App Show')
			},
			onHide: function() {
				console.log('App Hide')
			}
		 }
		
		}
</script>

<style lang="scss">
	@import "./common/css/base.scss";
	
	/*每个页面公共css */
</style>
