var camera, renderer, scene;

// add your global variables here:
var helloWorld;

head.ready(function() {
    helloWorld = new THREE.Object3D();
    Init();
    animate();
});

function Init() {
    scene = new THREE.Scene();

    //manually setup distance, zdp orientation,baseline scale etc
   // _camPosition = {x:0.00,y:0.00,z:500.00};
   // _tarPosition = {x:0.00,y:0.00,z:0.00};
    _baselineScale = 1.0;
    _maxDisparity = 5;
    _ZDPSize = 40;
     Leia_setDeviceResolution(200,200);
  
    // camera setup
    camera = new LeiaCamera({
      dCtoZDP:_ZDPDistanceToCamera,
      zdpNormal:new THREE.Vector3(_ZDPNormal.x, _ZDPNormal.y, _ZDPNormal.z),
        targetPosition: new THREE.Vector3(_ZDPCenter.x, _ZDPCenter.y, _ZDPCenter.z)
    });
    scene.add(camera);

    // rendering setup
    renderer = new LeiaWebGLRenderer({
        antialias: true,
        renderMode: _renderMode,
        colorMode: _colorMode,
        devicePixelRatio: 1,
        holoScreenSize: _ZDPSize,
        tunedsp:_maxDisparity,
        holoBaseLineScale:_baselineScale,
        messageFlag: _targetEnvironment
    });
    renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.BasicShadowMap;
    Leia_addRender(renderer,{bFPSVisible:true});

    //add object to scene
    addObjectsToScene();

    //add Light
    addLights();
}

function animate() {
  requestAnimationFrame(animate);
  renderer.Leia_render({
        scene: scene,
        camera: camera
    });
}

function addObjectsToScene() { // Add your objects here
    // background Plane
    var plane = Leia_createTexturePlane({
        filename: 'resource/brickwall_900x600_small.jpg',
        width: 40,
        height: 40
    });
    plane.position.z = -6;
    plane.castShadow = false;
    plane.receiveShadow = true;
    scene.add(plane);

    // hello world text
    var helloWorldGeometry = new THREE.TextGeometry(
        "Hello World", {
            size: 4,
            height: 2,
            curveSegments: 1,
            font: "helvetiker",
            weight: "normal",
            style: "normal",
            bevelThickness: 0.5,
            bevelSize: 0.25,
            bevelEnabled: true,
            material: 0,
            extrudeMaterial: 1
        }
    );
    helloWorldGeometry.computeBoundingBox();
    var hwbb = helloWorldGeometry.boundingBox;
    var hwbbx = -0.5 * (hwbb.max.x - hwbb.min.x);
    var hwbby = -0.5 * (hwbb.max.y - hwbb.min.y);
    var hwbbz = -0.5 * (hwbb.max.z - hwbb.min.z);
    var helloWorldMaterial = new THREE.MeshFaceMaterial(
        [
            new THREE.MeshLambertMaterial({
                color: 0xffffff,
                shading: THREE.FlatShading
            }), // front
            new THREE.MeshLambertMaterial({
                color: 0xffffff,
                shading: THREE.SmoothShading
            }) // side
        ]
    );
    var helloWorldMesh = new THREE.Mesh(helloWorldGeometry, helloWorldMaterial);
    helloWorldMesh.castShadow = true;
    helloWorldMesh.position.set(hwbbx, hwbby, hwbbz);
    helloWorld.add(helloWorldMesh);
    scene.add(helloWorld);
}

function addLights() {
    //Add Lights Here
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(0, 0, 70);
    spotLight.shadowCameraVisible = false;
    spotLight.castShadow = true;
    spotLight.shadowMapWidth = spotLight.shadowMapHeight = 256;
    spotLight.shadowDarkness = 0.7;
    scene.add(spotLight);

    var ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(ambientLight);
}