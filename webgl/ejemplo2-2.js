var renderer, scene, camera;

var esferacubo, cubo, angulo = 0;


init();
loadScene();
render();

function init() {
	// Render
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(new THREE.Color(0x0000AA));
	document.body.appendChild(renderer.domElement);

	// Escena
	scene = new THREE.Scene();

	// Camara
	var aspectRatio = window.innerWidth / window.innerHeight;
	camera = new THREE.PerspectiveCamera(50, aspectRatio, 0.1, 100);
	scene.add(camera)
	camera.position.set(0.5, 3, 9);
	camera.lookAt(new THREE.Vector3(0, 0, 0))

}


function loadScene(){

	var material  = new THREE.MeshBasicMaterial({color:'red', wireframe:true});


	var geocubo   = new THREE.BoxGeometry(2, 2, 2);
	var geoesfera = new THREE.SphereGeometry(1, 30, 30);


	cubo = new THREE.Mesh(geocubo, material);
	cubo.position.x = -1;

	var esfera = new THREE.Mesh(geoesfera, material);
	esfera.position.y = 1;


	esferacubo = new THREE.Object3D();
	esferacubo.position.y = 1;

	var loader = new THREE.ObjectLoader();
	loader.load('models/soldado/soldado.json',
							function (obj){
								obj.position.y = 1;
								cubo.add(obj);
							});

	esferacubo.add(cubo);
	esferacubo.add(esfera);
	scene.add(esferacubo);
	cubo.add(new THREE.AxisHelper(1));
	scene.add(new THREE.AxisHelper(3));
}

function update(){
	angulo += Math.PI/200;
	esferacubo.rotation.y = angulo;
	cubo.rotation.x = angulo/2;
}

function render(){
	requestAnimationFrame(render);
	update();
	renderer.render(scene, camera);
}
