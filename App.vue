<script>
	
	import { baseURL } from 'pages/login/config/config.js'
	
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
            getUserInfo() {
                let _this = this
				uni.getUserInfo({
					provider: 'weixin',
					success: function(infoRes) {
						_this.nickName = infoRes.userInfo.nickName; 
						_this.gender = infoRes.userInfo.gender; 
						_this.avatarUrl = infoRes.userInfo.avatarUrl; 
						_this.country =infoRes.userInfo.country;
						_this.province = infoRes.userInfo.province;
						_this.city = infoRes.userInfo.city;
						_this.language = infoRes.userInfo.language
						_this.login();
					}
				})
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
                            uni.reLaunch({
                                url: 'pages/dishover/dishover'
                            })
                        }
                    }
                   
                })
            },
			onLaunch: function() {
				let _this = this;
				let openid = uni.getStorageSync("openid")
				if(openid){
					uni.navigateTo({
						//不是第一次登录直接去首页
						url: "pages/dishover/dishover"
					})
				}else{
					_this.getUserInfo()
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
