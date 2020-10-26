/* Práctica 3
 *
 * David Rubio Ibáñez
 *
 *
 */



var renderer, scene, camera, planta;

var robot, base, brazo, eje, esparrago, rotula, antebrazo, disco, nervios, mano, pinzaDe, pinzaIz, suelo, angle = 0;


var cameraControls;

console.log('init()...');
init();

console.log('tree()...');
tree();

console.log('materialsBasic()...');
materialsBasic();

console.log('positions()...');
positions();

console.log('render()...');
render();

function init() {
	// Render
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth * .97, window.innerHeight * .955);
	// renderer.setClearColor(new THREE.Color(0x0000AA));   // Se ve mejor con el fondo negro
	renderer.autoClear = false;
	document.body.appendChild(renderer.domElement);

	// Escena
	scene = new THREE.Scene();

	// Camara Perspectiva
	var aspectRatio = window.innerWidth / window.innerHeight;
	camera = new THREE.PerspectiveCamera(50, aspectRatio, 0.1, 2000);
	camera.position.set(300, 120, 0);
	//camera.lookAt(new THREE.Vector3(0, 500, 0));  // No sirve al usar OrbitControls
	scene.add(camera);

	// Camara Ortografica     PLANTA
	planta = new THREE.OrthographicCamera(-80, 80, 60, -100, 1, 301);
	planta.up = new THREE.Vector3( -1, 0, 0)
	planta.position.set(0, 300, 0);
	planta.lookAt(new THREE.Vector3(0, 0, 0));
	scene.add(planta);

	// OrbitControls
	cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
	cameraControls.target.set(0, 120, 0);
	cameraControls.update();

	window.addEventListener('resize', updateAspectRatio);
	renderer.domElement.addEventListener('dblclick', changeColor);
}

function updateAspectRatio(){
	renderer.setSize(window.innerWidth * .97, window.innerHeight * .955);

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
}

function changeColor(event){
	// Invierte el color del elemento seleccionado

	let intersection = pickerListener(event, camera, scene);

	if (intersection.length > 0) {
		intersection[0].object.material.color.r = 1 - intersection[0].object.material.color.r;
		intersection[0].object.material.color.g = 1 - intersection[0].object.material.color.g;
		intersection[0].object.material.color.b = 1 - intersection[0].object.material.color.b;
	}
}


function update(){
	angle += Math.PI / 700;

	pinzaDe.position.y =  8 + 6 * Math.sin(11 * angle);
	pinzaIz.position.y = -8 - 6 * Math.sin(11 * angle);

	antebrazo.rotation.z = (Math.cos(7 * angle) - 1) * Math.PI / 10;
}

function render(){
	requestAnimationFrame(render);
	update();
	let size = Math.min(window.innerWidth, window.innerHeight) / 4;
	renderer.setViewport(0, 0, size, size);
	renderer.render(scene, planta);
	renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
	renderer.render(scene, camera);
}
