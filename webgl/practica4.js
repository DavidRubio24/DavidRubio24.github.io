/* Práctica 3
 *
 * David Rubio Ibáñez
 *
 *
 */



var renderer, scene, camera, planta, alzado, perfil;

var robot, base, brazo, eje, esparrago, rotula, antebrazo, disco, nervios, mano, pinzaDe, pinzaIz, suelo, angle = 0;


var cameraControls;


var effectController;

var keyboard	= new THREEx.KeyboardState();


console.log('init()...');
init();

console.log('tree()...');
tree();

console.log('materialsBasic()...');
materialsBasic();

console.log('positions()...');
positions();

console.log('setupGui()...')
setupGui();

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
	scene.add(camera);

	// Camaras Ortograficas
	viewsCameras(scene, 250);

	// OrbitControls
	cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
	cameraControls.target.set(0, 120, 0);
	cameraControls.enableKeys = false;
	cameraControls.update();

	window.addEventListener('resize', updateAspectRatio);
	renderer.domElement.addEventListener('dblclick', changeColor);


	// STATS
	stats = new Stats();
	stats.setMode( 0 );					// Muestra FPS
	stats.domElement.style.removeProperty('top');
	stats.domElement.style.bottom = '0px';
	document.body.appendChild( stats.domElement );
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



var h;

function reset(){
	effectController.robotX = 0;
	effectController.robotZ = 0;
	effectController.giroBase = 0;
	effectController.giroBrazo = 0;
	effectController.giroAntebrazoY = 0;
	effectController.giroAntebrazoZ = 0;
	effectController.giroPinza = 0;
	effectController.aperturaPinza = 7;
	h.updateDisplay();
}

function setupGui(){

	// Definicion de los controles
	effectController = {
		robotX: 0,
		robotZ: 0,
		giroBase: 0,
		giroBrazo: 0,
		giroAntebrazoY: 0,
		giroAntebrazoZ: 0,
		giroPinza: 0,
		aperturaPinza: 7,
		vista: 'planta',
		stats: true,
		fixCamera: false,
		reset: reset,
	};

	// Creación interfaz
	var gui = new dat.GUI();

	// Construcción del menú
	h = gui.addFolder("Control robot");
	h.add(effectController, "robotX", -450, 450, 1).name("Posicion x:");
	h.add(effectController, "robotZ", -450, 450, 1).name("Posicion z:");
	h.add(effectController, "giroBase", -180, 180, 1).name("Giro Base:");
	h.add(effectController, "giroBrazo", -45, 45, 1).name("Giro Brazo:");
	h.add(effectController, "giroAntebrazoY", -180, 180, 1).name("Giro Antebrazo Y: ");
	h.add(effectController, "giroAntebrazoZ",  -90,  90, 1).name("Giro Antebrazo Z: ");
	h.add(effectController, "giroPinza", -40, 220, 1).name("Giro Pinza:");
	h.add(effectController, "aperturaPinza", 0, 15, 1).name("Apertura Pinza:");
	h.add(effectController, "reset").name("Reset");
	h.add(effectController, "vista", ["planta", "alzado", "perfil", "ninguna"]).name("Vista:");
	h.add(effectController, "stats").name("Stats");
	h.add(effectController, "fixCamera").name("Fija camara vistas");
	h.open();
}



function update(){
	angle += Math.PI / 700;

	if (effectController.stats && !document.body.contains(stats.domElement)) {
		document.body.appendChild(stats.domElement);
	} else if (!effectController.stats && document.body.contains(stats.domElement)){
		document.body.removeChild(stats.domElement);
	}

	if (brazo.rotation.z != -effectController.giroBrazo * Math.PI / 180) {
		planta.b = effectController.giroBrazo;
		planta.updateProjectionMatrix();
	}

	robot.position.x = effectController.robotX;
	robot.position.z = -effectController.robotZ;
	base.rotation.y =  effectController.giroBase * Math.PI / 180;
	brazo.rotation.z =  -effectController.giroBrazo * Math.PI / 180;
	antebrazo.rotation.y = effectController.giroAntebrazoY * Math.PI / 180;
	antebrazo.rotation.z = -effectController.giroAntebrazoZ * Math.PI / 180;
	mano.rotation.y =  effectController.giroPinza * Math.PI / 180;
	pinzaDe.position.y =  2 + effectController.aperturaPinza;
	pinzaIz.position.y = -2 - effectController.aperturaPinza;



	if (keyboard.pressed('left') && robot.position.z < 450 ){
		robot.position.z += 1;
		effectController.robotZ -= 1;
		h.updateDisplay();
	}
	if (keyboard.pressed('right')  && -450 < robot.position.z) {
		robot.position.z -= 1;
		effectController.robotZ += 1;
		h.updateDisplay();
	}
	if (keyboard.pressed('down')  && robot.position.x < 450) {
		robot.position.x -= 1;
		effectController.robotX += 1;
		h.updateDisplay();
	}
	if (keyboard.pressed('up')  && -450 < robot.position.x) {
		robot.position.x += 1;
		effectController.robotX -= 1;
		h.updateDisplay();
	}
	if (keyboard.pressed('escape')){
		reset();
	}

	stats.update();
}



function render() {
	requestAnimationFrame(render);
	update();

	showViews(effectController.vista, effectController.fixCamera);

	renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
	renderer.render(scene, camera);
}
