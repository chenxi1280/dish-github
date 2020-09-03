<template>
	<view>
		<text> {{pkArtworkId}}</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pkArtworkId: 0
			}
		},

		onLoad(option) {
			this.pkArtworkId = option.pkArtworkId
			uni.request({
				url: 'http://192.168.1.15:8008/Ecmartwork/playArtWork',
				method: 'POST',
				data: {
					pkArtworkId: this.pkArtworkId
				},
				success: res => {
					console.log(res.data.data)
				}
			})
		},
		onReady(){
			
		}
	}
</script>

<style lang="scss">
</style>
