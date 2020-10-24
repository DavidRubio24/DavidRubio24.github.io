var renderer, scene, camera;

function init() {

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(new THREE.Color(0x0000AA), 1.0);
	document.body.appendChild(renderer.domElement);

	scene = new THREE.Scene();

	var aspectRatio = window.innerWidth / window.innerHeight;
	camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100);
	camera.position.set(0, 0, 3);
}

function loadScene(){
	var geometria = new THREE.TetrahedronGeometry();
	var material  = new THREE.MeshBasicMaterial({color:0xFF0000, wireframe:true});
	var tetraedro = new THREE.Mesh(geometria, material);

	scene.add(tetraedro);
}

function update(){}

function render(){
	requestAnimationFrame(render);
	update();
	renderer.render(scene, camera);
}

init();
loadScene();
render();