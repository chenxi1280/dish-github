// import React, { useEffect } from 'react';

// import gsap from "gsap";
function init(imgFlag){
    var camera, scene, renderer,controls,mouse,raycaster ,cube ,shoe,htmlVideoElement,calculateList,buoyNewTime = 0,clickFlag = false,stopVideoFlag = true;
    var moveList = []
    var stopMoveList = []
    var newTime = 0, oldTime = 0

    //'https://1259692143.vod2.myqcloud.com/46c44474vodtranscq1259692143/b2a9724d5285890815071920936/v.f100020.mp4'
    // 可替换的  视频地址
    var videoUrl = 'http://1259692143.vod2.myqcloud.com/6fda56ccvodcq1259692143/6479003d5285890815766187729/GMSMgREou44A.mp4';

    let  ii = 0
    //是否启用触摸 滑动画面
    var flag3 = false

    var isUserInteracting = false,
        lon = 0, lat = 0,
        phi = 0, theta = 0,
        distance = 50,
        onPointerDownPointerX = 0,
        onPointerDownPointerY = 0,
        onPointerDownLon = 0,
        onPointerDownLat = 0;


    start();
    animate();

    const playVR = () => {
        flag3 = !flag3
    }

    //初始化相机
    function start() {

        camera = cameraInit()

        controls= DeviceOrientationControls(camera);

        console.log(controls)

        htmlVideoElement = videoInit();
        const texture = new THREE.VideoTexture( htmlVideoElement );
        texture.minFilter = THREE.LinearFilter

        // const imgInit = imgInit()

        //场景
        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0x000000);

        let mesh = meshInit({texture});
        scene.add(mesh );




        // scene.add();

        // var spriteMap = new THREE.TextureLoader().load( 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fa1.att.hudong.com%2F24%2F78%2F20300000291746133783784887147.jpg&refer=http%3A%2F%2Fa1.att.hudong.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1618549456&t=aab275a2d198f8310ae87e2feace44a6' );
        // var spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, color: 0xffffff } );
        //
        // var sprite = new THREE.Sprite( spriteMaterial );
        // sprite.scale.set(100, 100, 100)

        // scene.add( sprite );

        // 相机辅助
        // var helper = new THREE.CameraHelper( camera );
        // scene.add( helper );
        //  坐标系
        // var axesHelper = new THREE.AxesHelper( 10000 );
        // scene.add( axesHelper );


        // 球的 准确率最高        cube.position.set(-145,-65,-180) 球的 xyz
        cube = new THREE.Mesh(  new THREE.SphereGeometry( 40, 32, 32 ),  new THREE.MeshBasicMaterial( {color: "0xffffff",opacity: 0 ,transparent:false} ) );
        cube.position.set(-145,-65,-180)
        cube.name = "cube"
        scene.add( cube );

        // 2s  （-295,-235,-190）   29s移动      30s最高点(-380,-260,-190)   31.10 完成(-300,-250,-110)  33.2S 开始移动   34.1 完成 (-300,-200,-12)
        shoe = new THREE.Mesh(  new THREE.SphereGeometry( 30, 32, 32 ),  new THREE.MeshBasicMaterial( {color: " 0xffffff",opacity: 0,transparent:false } ) );
        shoe.position.set(-295,-235,-190)
        shoe.name = "shoe"

        // 设置时间回调 250 ms 一次
        htmlVideoElement.addEventListener( "timeupdate", videoTimeupdate)

        scene.add( shoe );

        // console.log(shoe)

        // initObject ()

        raycaster = new THREE.Raycaster();
        raycaster.far = 500

        console.log(raycaster,"raycaster")

        mouse = new THREE.Vector2();

        calculateList =  initShoeV()

        // 渲染器
        renderer = rendererInit(315, 560)

        let elementsByTagName = document.querySelector("canvas");
        //点击事件
        elementsByTagName.addEventListener( 'click', onMouseClick );
        // 触摸事件
        elementsByTagName.addEventListener( 'touchstart', onTouchstart );

        // 鼠标滑动事件
        elementsByTagName.addEventListener( 'mousedown', onDocumentMouseDown, false );
        elementsByTagName.addEventListener( 'mousemove', onDocumentMouseMove, false );
        elementsByTagName.addEventListener( 'mouseup', onDocumentMouseUp, false );

        // 触摸事件
        elementsByTagName.addEventListener( 'touchstart', onDocumentTouchstart, false );
        elementsByTagName.addEventListener( 'touchmove', onDocumentTouchmove, false );
        elementsByTagName.addEventListener( 'touchend', onDocumentTouchend, false );

        window.addEventListener( 'resize', onWindowResize, false );


    }

    function initObject () {
        let geometry = new THREE.Geometry();
        geometry.vertices.push(
            new THREE.Vector3(-100, 0, 100),
            new THREE.Vector3(100, 0, -100)
        );
        geometry.colors.push(
            new THREE.Color( 0x444444 ),
            new THREE.Color( 0xFF0000 )
        )
        let material = new THREE.LineBasicMaterial({ vertexColors: true });
        var line = new THREE.Line(geometry, material);
        scene.add(line);
    }

    function onDocumentTouchstart( event ) {

        event.preventDefault();
        isUserInteracting = true;
        onPointerDownPointerX = event.touches[0].clientX ;
        onPointerDownPointerY = event.touches[0].clientY;

        onPointerDownLon = lon;
        onPointerDownLat = lat;

    }
    function onDocumentTouchmove( event ) {

        if ( isUserInteracting === true ) {

            lon = ( onPointerDownPointerX - event.touches[0].clientX ) * 0.1 + onPointerDownLon;
            lat = ( onPointerDownPointerY - event.touches[0].clientY  ) * 0.1 + onPointerDownLat;

        }

    }
    function onDocumentTouchend() {
        isUserInteracting = false;

    }
    function onDocumentMouseDown( event ) {

        event.preventDefault();


        isUserInteracting = true;

        onPointerDownPointerX = event.clientX;
        onPointerDownPointerY = event.clientY;

        onPointerDownLon = lon;
        onPointerDownLat = lat;

    }
    function onDocumentMouseMove( event ) {

        if ( isUserInteracting === true ) {

            lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
            lat = ( onPointerDownPointerY - event.clientY ) * 0.1 + onPointerDownLat;

        }

    }
    function onDocumentMouseUp() {
        isUserInteracting = false;

    }

    //初始化速度
    function initShoeV() {
        let  a = {}
        a.vx  = v(-300 , -295 , 1)
        a.vy  = v(-250 , -235 , 1)
        a.vz  = v(-110 , -190 , 1)
        a.targetX = -300
        a.targetY = -250
        a.targetZ = -100
        a.ctime = 28
        a.radius = 30

        // let  b = {}
        // b.vx  = v(-300 , -380 , 1)
        // b.vy  = v(-250 , -260 , 1)
        // b.vz  = v(-100 , -190 , 1)
        // b.ctime = 29

        let  c = {}
        c.vx  = v(0 , -0 , 1)
        c.vy  = v(-0 , -0 , 1)
        c.vz  = v(-0 , -0 , 1)
        c.ctime = 30
        c.radius = 32

        let  d = {}
        d.vx  = v(-300 , -300 , 1)
        d.vy  = v(-200 , -250 , 1)
        d.vz  = v(-12 , -100 , 1)
        d.targetX = -300
        d.targetY = -200
        d.targetZ = -12
        d.ctime = 33
        d.radius = 30

        let  e = {}
        e.vx  = v(-0 , -0 , 1)
        e.vy  = v(-0 , -0 , 1)
        e.vz  = v(-0 , -0 , 1)
        e.ctime = 34
        e.radius = 30

        return [a,c,d,e]

        function v(a,b,t) {
            return ( (a - 0) - (b - 0) ) / ((t - 0) * 60)
        }

    }
    // 视频时间 回调
    function videoTimeupdate() {
        let currentTime = htmlVideoElement.currentTime
        let newTime =  Math.floor(currentTime)
        // console.log(currentTime)
        if (buoyNewTime == newTime || newTime == 0) {
            // this.buoyCanvas.requestAnimationFrame(() => this.buoyDraw())
            return
        }
        // console.log(currentTime - 28.4 ,currentTime,currentTime > 28.4)
        buoyNewTime = newTime
        calculateList.forEach( (v,i) => {
            //无用
            if (currentTime > 28.4 && currentTime  <  29.9  ) {
                // console.log("currentTime",currentTime)
                moveList[0] = calculateList[0]
            }
            if( buoyNewTime == v.ctime ) {
                moveList[0] = v
            }
        })

    }

    function onWindowResize() {

        // camera.aspect = window.innerWidth / window.innerHeight


        camera.aspect = 315 / 560;

        camera.updateProjectionMatrix();

        renderer.setSize( 315, 560 );
        // renderer.setSize( window.innerWidth, window.innerHeight );

    }

    // 鼠标点击
    function onMouseClick( event ) {
        clickFlag = true
        // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
        event.preventDefault();
        // 注意坐标
        // console.log(event.clientX,event.clientY,window.innerWidth,window.innerHeight)
        mouse.x = ( (event.clientX - 10 ) / (315 )  ) * 2 - 1;
        mouse.y = - ( (event.clientY - 40) / (560) ) * 2 + 1;

    }
    // 触摸点击
    function onTouchstart( event ) {
        clickFlag = true
        // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
        event.preventDefault();
        // 注意坐标
        // console.log(event.clientX,event.clientY,window.innerWidth,window.innerHeight)
        mouse.x = ( ( event.touches[0].clientX - 10 ) / (315 )  ) * 2 - 1;
        mouse.y = - ( (event.touches[0].clientY  - 40) / (560) ) * 2 + 1;

    }

    // 获取position
    function getPosition(lng, lat, alt) {
        var phi = (90-lat) * (Math.PI/180),
            theta = (lng+180) * (Math.PI/180),
            radius = alt+200,
            x = -(radius * Math.sin(phi) * Math.cos(theta)),
            z = (radius * Math.sin(phi) * Math.sin(theta)),
            y = (radius * Math.cos(phi));
        return {x: x, y: y, z: z};
    }

    function deepCopy(o) {
        return JSON.parse(JSON.stringify(o))
    }

    //视频浮标暂停
    function stopBuoy() {
        stopMoveList = deepCopy(moveList)
        moveList.forEach( v => {
            v.vx = 0
            v.vy = 0
            v.vz = 0
        })
        htmlVideoElement.pause()



    }

    //视频浮标回复
    function recoveryBuoy() {
        moveList = deepCopy(stopMoveList)
        htmlVideoElement.play()

    }


    // 移动
    function move(){

        // if ( cube.position.y  > 500) {
        //     cube.position.y -=  0.5
        // }else if ( cube.position.y  < -500  ){
        //     cube.position.y +=  0.5
        // }else {
        //     cube.position.y +=  0.5
        // }

        if (moveList !=  null && moveList.length > 0  ){
            moveList.forEach( v => {
                if (v.targetX != null) {
                    if (v.vx > 0) {
                        if (shoe.position.x >= v.targetX) {
                            v.vx = 0
                        }
                    }
                    if (v.vx < 0) {
                        if (shoe.position.x <= v.targetX) {
                            v.vx = 0
                        }
                    }
                    if (v.vy > 0) {
                        if (shoe.position.y >= v.targetY) {
                            v.vy = 0
                        }
                    }
                    if (v.vy < 0) {
                        if (shoe.position.y<= v.targetY) {
                            v.vy = 0
                        }
                    }
                    if (v.vz > 0) {
                        if (shoe.position.z >= v.targetZ) {
                            v.vz = 0
                        }
                    }
                    if (v.vz < 0) {
                        if (shoe.position.z <= v.targetZ) {
                            v.vz = 0
                        }
                    }
                }

                shoe.position.x += v.vx
                shoe.position.y += v.vy
                shoe.position.z += v.vz

                // if (v.ctime == 30) {
                //     shoe.geometry.parameters.radius = 32
                // }

            })
            // console.log(shoe.position)
        }

    }

    // 重绘
    function animate() {
        requestAnimationFrame( animate );
        update();
        function update() {
            controls.update();
            move()
            mouse.x = 0
            mouse.y = 0
            raycaster.setFromCamera( mouse, camera );
            // if ( ii % 100 == 0 ){
            //     console.log(raycaster)

            // }
            var intersects = raycaster.intersectObjects( [cube,shoe] )

            if (0 < intersects.length && clickFlag) {
                // 事件
                for (let i = 0; i < intersects.length; i++) {
                    //变色
                    console.log((new Date()).valueOf())
                    // if ( ii % 10 == 0 ) {
                    //     console.log("点中了")
                    // }
                    // console.log("点中了", intersects[0].object.name,ii)
                    if (!imgFlag) {
                        oldTime = (new Date()).valueOf()
                    }
                    if ( (new Date()).valueOf() - 1900 >= oldTime) {
                        intersects[0].object.material.color.set( color16() )
                        // 事件
                        if ("cube" == intersects[0].object.name) {
                            htmlVideoElement.src = "https://1259692143.vod2.myqcloud.com/46c44474vodtranscq1259692143/b2a9724d5285890815071920936/v.f100020.mp4"
                        }
                    }
                    imgFlag = true

                }
            }else {
                imgFlag = false
            }
            // if (ii % 100 == 0){
            //     console.log("imgFlag",imgFlag)
            // }
            // ii++
            //启用触摸移动
            if (flag3) {
                lat = Math.max( - 85, Math.min( 85, lat ) );
                phi = THREE.MathUtils.degToRad( 90 - lat );
                theta = THREE.MathUtils.degToRad( lon );

                camera.position.x = distance * Math.sin( phi ) * Math.cos( theta );
                camera.position.y = distance * Math.cos( phi );
                camera.position.z = distance * Math.sin( phi ) * Math.sin( theta );

                // console.log("camera.target ",camera.target )
                camera.lookAt( camera.target );
                camera.position.copy( camera.target ).negate();


            }

            renderer.render( scene, camera );
        }
    }

    //视频初始化
    function videoInit() {
        let video = document.createElement('video');
        video.height = 0
        video.width = 0

        // video.src = mp4
        video.src = videoUrl
        video.crossOrigin = 'anonymous';
        //video.autoplay = "autoplay"; //要设置播放
        // video对象作为VideoTexture参数创建纹理对象
        document.body.appendChild(video);
        // console.log('这是本地区比我大不定期', document.getElementById("play"), uni.createSelectorQuery().select("#play"))
        const play = () => {
            var isiPhone = navigator.userAgent.indexOf("iPhone") > 0;
            if(isiPhone){
                window.DeviceOrientationEvent.requestPermission()
                    .then(state => {
                        if(state === "granted"){//允许
                            // videoplay.style.display='none'
                            video.play()
                            // alert('允许')
                        }else if(state === "denied"){//拒绝
                            alert('您拒绝了唤起陀螺仪，无法查看全景视频')
                        }else if(state === "prompt"){
                            // alert('允许')
                        }
                    })
            }else{
                // videoplay.style.display='none'
                video.play()
                video.currentTime = 24
                // video.pause()
            }
        };
        const stop = () => {
            if (stopVideoFlag ){
                stopBuoy()
            }else {
                recoveryBuoy()
            }
            stopVideoFlag = !stopVideoFlag
        }
        return video
    }

    function color16(){//十六进制颜色随机
        return '#' + random16() + random16() + random16();
        function random16(){
            return Math.floor(Math.random()*256).toString(16)
        }
    }

}

const rendererInit = (width, height) => {
    // antialias 抗锯齿
    const renderer = new THREE.WebGLRenderer({antialias: true})
    //像素比率
    // renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height)
    const canvas = renderer.domElement;
    document.body.appendChild(canvas)

    return renderer
}
function meshInit ({texture, radius1 = 500, radius2 = 100, radius3 = 100}) {
    //材质
    const material = new THREE.MeshBasicMaterial( { map: texture } );
    // 球形 皮肤 大小                                 （球体半径 ，水平分段数 （沿着经线分段） ， 垂直分段数 （沿着纬线分段） ）
    const sphereGeo = new THREE.SphereBufferGeometry( radius1, radius2, radius3 );

    // 大小
    sphereGeo.scale( -1, 1, 1 );
    //const sphereGeo = new THREE.SphereGeometry(radius1,radius2,radius3)

    return new THREE.Mesh(sphereGeo, material);
}

const cameraInit = () => {
    // const aspectRatio = window.innerWidth / window.innerHeight
    const aspectRatio = 315 / 560

    const camera = new THREE.PerspectiveCamera( 70, aspectRatio, 0.1, 10000 );

    camera.position.set( 0 , 0, 0)
    camera.lookAt(camera.position);
    // camera.position.set( 500, 500, 500)
    camera.target = new THREE.Vector3( 0 , 0, 0 );
    return camera

    // const aspectRatio = 450 / 800
    //
    // const camera = new THREE.OrthographicCamera( 75, aspectRatio, 1, 1100 );
    // camera.target = new THREE.Vector3( 0, 0, 0 );
    // return new THREE.OrthographicCamera( 800 / - 2, 800 / 2, 800 / 2, 800 / - 2, 1, 1000 );
}



export default init

    // var imgFlag = false

    // const isShow = imgFlag ? 'block' : 'none'
    // useEffect(() => {
    //     init(imgFlag);
    // }, [])

    // return <div >
    //      <button id='play' style={{width: '100px',height: '30px'}}>play</button>
    //     <button id='stop' style={{width: '100px',height: '30px'}}>stop</button>
    //     <button id='play3' style={{width: '100px',height: '30px'}}>play3D</button>
    //     <div style={{width: '315px', height: '560px', position: 'absolute', pointerEvents: 'none'}}>
    //         <div style={{width: '6px', height: '6px', background: 'red', borderRadius: '3px', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}></div>
    //         <div style={{display: imgFlag ? 'block' : 'none'}}><ImgItem></ImgItem></div>
    //     </div>
    //     {/*<img src="https://pic4.zhimg.com/80/v2-4d7606d28f4a687c2d5861124edb98e6_qhd.jpg" style={{top:'295px',position:"absolute",left:'50%'}}></img>*/}
    //     </div>
// }
