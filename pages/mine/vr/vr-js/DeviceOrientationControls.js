/**
 * @author richt / http://richt.me
 * @author WestLangley / http://github.com/WestLangley
 *
 * W3C Device Orientation control (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
 */
import * as THREE from "./three.weapp.js";

export default function DeviceOrientationControls(object) {

	var scope = {}; //= this;

	//相机
	scope.object = object;
	scope.object.rotation.reorder('YXZ');

	scope.enabled = true;

	scope.deviceOrientation = {};
	scope.screenOrientation = 0;

	scope.alphaOffset = 0; // radians

	var i = 0

	var ii = 0

	console.log(scope)

	var onDeviceOrientationChangeEvent = function (event) {
		// console.log("我被触发了")
		scope.deviceOrientation = event;

	};

	var onScreenOrientationChangeEvent = function () {

		scope.screenOrientation = 0;

	};

	// The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

	var setObjectQuaternion = function () {
		// console.log("调用")

		var zee = new THREE.Vector3(0, 0, 1);

		var euler = new THREE.Euler();

		var q0 = new THREE.Quaternion();

		var q1 = new THREE.Quaternion(- Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis-


		return function (quaternion, alpha, beta, gamma, orient) {

			euler.set(  beta, alpha,  -gamma, 'YXZ'); // 'ZXY' for the device, but 'YXZ' for us
			// console.log("euler",euler1._onChangeCallback())

			quaternion.setFromEuler(euler); // orient the device

			quaternion.multiply(q1); // camera looks out the back of the device, not the top

			if (ii % 1200 == 0) {
				// console.log("euler",euler1)
			}
			ii++
			quaternion.multiply(q0.setFromAxisAngle(zee, - orient)); // adjust for screen orientation


		};

	}();

	scope.connect = function () {

		// onScreenOrientationChangeEvent(); // run once on load

		// window.addEventListener('orientationchange', onScreenOrientationChangeEvent, false);
		// window.addEventListener('deviceorientation', onDeviceOrientationChangeEvent, false);
		
		uni.startGyroscope({
			interval: "normal",
			success() {
				console.log('success')
			},
			fail() {
				console.log('fail')
			}
		})

		scope.enabled = true;

	};

	scope.disconnect = function () {

		// window.removeEventListener('orientationchange', onScreenOrientationChangeEvent, false);
		// window.removeEventListener('deviceorientation', onDeviceOrientationChangeEvent, false);
		
		uni.stopGyroscope({
			success() {
				console.log('stop success!')
			},
			fail() {
				console.log('stop fail!')
			}
		})

		scope.enabled = false;

	};

	scope.update = function () {


		if (scope.enabled === false) return;
		
		// var device = scope.deviceOrientation;
		
		//modify
		uni.onGyroscopeChange((res) => {
			if (res) {
			   // if (device) {
				// const dev = JSON.parse(JSON.stringify(device))
			   
				// let dAlpha = dev.alpha
				// let dBeta = dev.beta
				// let dGamma = dev.gamma
				// dAlpha += 90
				// dBeta += 90
				// dGamma -= 90
				// if (dAlpha > 359) {
				// 	dAlpha = (dAlpha - 359)
				// }
				// if (dBeta > 179) {
				// 	dBeta = -(dBeta - 179)
				// }
				// if (dGamma < -179) {
				// 	dGamma = Math.abs(dBeta + 179)
				// }
				// const dev = JSON.parse(JSON.stringify(device))
				// let cloneAlpha = dev.alpha - 0
				// let cloneBeta = dev.beta
				// let cloneGamma = dev.gamma
			   
			   
				// cloneAlpha -= 180
				// if (cloneBeta > 0) {
				// 	cloneBeta = cloneBeta * 1
				// } else {
				// 	cloneBeta = Math.abs(cloneBeta * 2)
				// }
				// console.log(device.alpha, cloneAlpha, device.beta, cloneBeta, device.gamma, cloneGamma)
				// if (cloneGamma > 89) {
				// 	cloneGamma = -(cloneGamma - 90)
				// }
				// cloneBeta = cloneBeta / 2
				// cloneGamma = cloneGamma * 2
				// if (cloneBeta >= 0) {
				// 	cloneBeta /= 2
				// } else {
				// 	cloneBeta = Math.abs(cloneBeta)
				// }
				// console.log(device)
				// var alpha = device.alpha ? THREE.Math.degToRad(device.alpha) : 0; // Z
			   
				// var beta = cloneGamma ? THREE.Math.degToRad(cloneGamma) + scope.alphaOffset : 0; // X'
				// if (cloneAlpha < 0) {
				// 	cloneAlpha = 360 - Math.abs(cloneAlpha)
				// }
			   
			   
			   
				// 新测试
				// const dev = JSON.parse(JSON.stringify(device))
				// // 1、z需要加90度
				// let Alpha = dev.alpha + 90
				// if (Alpha > 360) {
				// 	Alpha = Alpha - 360
				// }
				// // 2、X、Y交换
				// // (1)正正为正
				// let Beta = dev.beta
				// let Gamma = dev.gamma
			   
				// Beta /= 2
				// Gamma *= 2
			   
				// var alpha = Alpha ? THREE.Math.degToRad(Alpha) : 0; // Z
			   
				// var beta = Gamma ? THREE.Math.degToRad(Gamma) + scope.alphaOffset : 0; // X'
			   
				// var gamma = Beta ? THREE.Math.degToRad(Beta) : 0; // Y''
				
				var alpha = res.z ? THREE.Math.degToRad(res.z) : 0; // Z
			   
				// var alpha = device.alpha ? THREE.Math.degToRad(device.alpha) : 0; // Z
			   
			    var beta = res.x ? THREE.Math.degToRad(res.x) + scope.alphaOffset : 0; // X'
			   
				// var beta = device.beta ? THREE.Math.degToRad(device.beta) + scope.alphaOffset : 0; // X'
				
				var gamma = res.y ? THREE.Math.degToRad(res.y) : 0; // Y''
			   
				// var gamma = device.gamma ? THREE.Math.degToRad(device.gamma) : 0; // Y''
			   
			   
			   
				// var alpha =  device.alpha ? THREE.Math.degToRad( device.alpha  ) : 0; // Z 
			   
				// var beta =     device.gamma   ? THREE.Math.degToRad(  device.gamma  )  + scope.alphaOffset : 0; // X'  // Y   控制 上下
			   
				// var gamma =     device.beta ?  THREE.Math.degToRad( device.beta )  : 0 ;
				// console.log(alpha, beta, gamma)
			   
				var orient = scope.screenOrientation ? THREE.Math.degToRad(scope.screenOrientation) : 0; // O
				if (i % 120 == 0) {
					console.log("device",res,scope)
			   
				}
			   
				i++
			   
			   
				setObjectQuaternion(scope.object.quaternion, alpha, beta, gamma, orient,);
			   
			   }
		});
		


	};

	scope.dispose = function () {

		scope.disconnect();

	};

	scope.connect();

	return scope;
};
