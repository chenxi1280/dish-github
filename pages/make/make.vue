<template>
	<view>
		<view id="b">
			<view id="b1">制作页面1</view>
			<view id="b2">制作页面2</view>
		</view>		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	#b {
		#b1 {
			color: #007AFF;
			&:hover {
				color: red;
			}
		}
	}
</style>
