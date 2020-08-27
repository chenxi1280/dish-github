<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			uni.login({
			  provider: 'weixin',
			  success: loginRes => {
			    console.log(loginRes.code)
			    // 获取用户信息
			    uni.getUserInfo({
			      provider: 'weixin',
			      success: infoRes => {
			        console.log('用户昵称为:' + infoRes.userInfo.nickName)
			      }
			    })
			  }
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
