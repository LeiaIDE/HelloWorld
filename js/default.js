var camera, renderer, scene;
var helloWorld;


window.onload = function () {
  console.log("head.ready");
  helloWorld = new THREE.Object3D();
  Init();
  animate();
};

function Init() {
 // Leia_resetScreenObjectParameters();
   LEIA.virtualScreen.Init();
  scene = new THREE.Scene();

  //manually setup distance, zdp orientation,baseline scale etc
  Leia_setDeviceResolution(200, 150);
  
  // camera setup
  camera = new LeiaCamera({
    dCtoZDP: LEIA.virtualScreen.d,
    zdpNormal: LEIA.virtualScreen.normal,
    targetPosition: LEIA.virtualScreen.center
  });
  scene.add(camera);

  // rendering setup
  renderer = new LeiaWebGLRenderer({
    antialias: true,
    renderMode: _renderMode,
    colorMode: _colorMode,
    devicePixelRatio: 1,
    messageFlag: _targetEnvironment
  });
  renderer.shadowMapEnabled = true;
  // renderer.shadowMapType = THREE.BasicShadowMap;
  Leia_addRender(renderer, {
    bFPSVisible: true
  });
  
  

  //add object to scene
  addObjectsToScene();

  //add Light
  addLights();
}

function animate() {
  requestAnimationFrame(animate);

  helloWorld.rotation.x = 0.8 * Math.sin(5.0 * LEIA.time);
  helloWorld.rotation.z = 0.6 * 0.6 * Math.sin(3.0 * LEIA.time);

  renderer.Leia_render({
    scene: scene,
    camera: camera
  });
}

function addObjectsToScene() { // Add your objects here
  // background Plane
  var plane = Leia_createTexturePlane({
    filename: 'resource/brickwall_900x600_small.jpg',
    width: 44,
    height: 33
  });
  plane.position.z = -3;
  plane.castShadow = false;
  plane.receiveShadow = true;
  scene.add(plane);

  // hello world text
  var helloWorldGeometry = new THREE.TextGeometry(
    "Hello", {
      size: 6,
      height: 1,
      curveSegments: 4,
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
            new THREE.MeshPhongMaterial({
        color: 0xffffff,
        shading: THREE.FlatShading
      }), // front
            new THREE.MeshPhongMaterial({
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
  spotLight.position.set(0, 70, 70);
  spotLight.shadowCameraVisible = false;
  spotLight.castShadow = true;
  spotLight.shadowMapWidth = spotLight.shadowMapHeight = 256;
  spotLight.shadowDarkness = 0.7;
  scene.add(spotLight);

  var ambientLight = new THREE.AmbientLight(0x222222);
  scene.add(ambientLight);
}
