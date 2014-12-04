var windowWidth = window.innerWidth, windowHeight = window.innerHeight;
var camera,renderer,scene;
var helloWorldMesh;

window.onload = function (){
     console.log("onload");
     Init();
     animate();
 };

function Init(){
  scene = new THREE.Scene();
  var helloWorldGeometry = new THREE.TextGeometry(
    "Hello World",
    {
      size: 12,
      height: 2,
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
  var material = new THREE.MeshFaceMaterial(
    [ 
      new THREE.MeshPhongMaterial(
        {
          color: 0xffffff,
          shading: THREE.FlatShading
        }
      ), // front
      new THREE.MeshPhongMaterial(
        {
          color: 0xffffff,
          shading: THREE.SmoothShading
        }
      ) // side
    ]
  );
  var helloWorldMesh = new THREE.Mesh( helloWorldGeometry, material );
  scene.add(helloWorldMesh);
  

  //setup camera
  camera = new LeiaCamera();
  camera.position.copy(new THREE.Vector3(_camPosition.x, _camPosition.y, _camPosition.z));
  camera.lookAt(new THREE.Vector3(_tarPosition.x, _tarPosition.y, _tarPosition.z));
  scene.add(camera);
  
  //setup rendering parameter
  renderer = new LeiaWebGLRenderer({
    antialias:true, 
    renderMode: _renderMode, 
    shaderMode: _nShaderMode,
    colorMode: _colorMode,
    devicePixelRatio: 1 
  });
  renderer.Leia_setSize( windowWidth, 0.75*windowWidth );
  renderer.shadowMapEnabled = true;
  renderer.shadowMapSoft = true;
  document.body.appendChild( renderer.domElement );
  
  //add object to Scene
  addObjectsToScene();
  
  //add Light
  addLights();
 }

 function animate() 
 {
 	requestAnimationFrame( animate );
    renderer.setClearColor(new THREE.Color().setRGB(1.0, 1.0, 1.0)); 
	renderer.Leia_render(scene, camera,undefined,undefined,_holoScreenSize,_camFov,_messageFlag);
 }
  
  

function addObjectsToScene(){
    //Add your objects here
  LEIA_setBackgroundPlane('resource/brickwall_900x600_small.jpg');
}

function addLights(){
    //Add Lights Here
 	var light = new THREE.SpotLight( 0xffffff);
	//light.color.setHSL( Math.random(), 1, 0.5 );
 	light.position.set(0,60,60);
    light.shadowCameraVisible = false;
    light.castShadow = true;
    light.shadowMapWidth = light.shadowMapHeight = 512;
    light.shadowDarkness = 0.7;
 	scene.add(light);
  
 	var ambientLight = new THREE.AmbientLight(0x222222);	
 	scene.add(ambientLight);
}

function LEIA_setBackgroundPlane(filename, aspect){
	var planeTexture = new THREE.ImageUtils.loadTexture( filename );
	planeTexture.wrapS = planeTexture.wrapT = THREE.RepeatWrapping; 
	planeTexture.repeat.set( 1, 1 );
	
  //
    var planeMaterial = new THREE.MeshPhongMaterial( {map: planeTexture, color: 0xffdd99 } );
    var planeGeometry = new THREE.PlaneGeometry(80, 60, 10, 10);
	plane = new THREE.Mesh(planeGeometry,   planeMaterial);
	plane.position.z = -6;
	plane.castShadow = false;
	plane.receiveShadow = true;
	scene.add(plane);
}