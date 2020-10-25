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

init();
loadScene();
setupGui()
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
	camera = new THREE.PerspectiveCamera(50, aspectRatio, 0.1, 1000);
	camera.position.set(300, 120, 0);
	scene.add(camera);

	// Camaras Ortograficas
	planta = new THREE.OrthographicCamera(-150, 150, 150, -150, 1, 301);
	alzado = new THREE.OrthographicCamera(-150, 150, 150, -150, 1, 301);
	perfil = new THREE.OrthographicCamera(-150, 150, 150, -150, 1, 301);
	scene.add(planta);

	// OrbitControls
	cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
	cameraControls.target.set(0, 120, 0);
	cameraControls.enableKeys = false;
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
		reset: function(){
			effectController.robotX = 0;
			effectController.robotZ = 0;
			effectController.giroBase = 0;
			effectController.giroBrazo = 0;
			effectController.giroAntebrazoY = 0;
			effectController.giroAntebrazoZ = 0;
			effectController.giroPinza = 0;
			effectController.aperturaPinza = 7;
			h.updateDisplay();
		},
	};

	// Creación interfaz
	var gui = new dat.GUI();

	// Construcción del menú
	var h = gui.addFolder("Control robot");
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
	h.open();
}

function update(){
	angle += Math.PI / 700;


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

	plantaView = effectController.planta;

}

function render() {
	requestAnimationFrame(render);
	update();

	if (effectController.vista != "ninguna") {
		var size = Math.min(window.innerWidth, window.innerHeight) / 4;
		renderer.setViewport(0, 0, size, size);
		var lookat = new THREE.Vector3();
		rotula.getWorldPosition(lookat);
	}
	if (effectController.vista == "planta") {
		planta.position.set(lookat.x, 300, lookat.z);
		planta.up = new THREE.Vector3(-1, 0, 0);
		planta.lookAt(lookat);
		renderer.render(scene, planta);
	} else if (effectController.vista == "alzado") {
		alzado.position.set(lookat.x + 150, lookat.y, lookat.z);
		alzado.lookAt(lookat);
		renderer.render(scene, alzado);
	} else if (effectController.vista == "perfil"){
		perfil.position.set(lookat.x, lookat.y, lookat.z + 150);
		perfil.lookAt(lookat);
		renderer.render(scene, perfil);
	}
	renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);

	// Nos aseguramos que se vea toda la escena
	let far = Math.min(scene.fog.far,
										 Math.sqrt(Math.pow(500 + Math.abs(camera.position.x), 2)
																+ Math.pow(500 + Math.abs(camera.position.z), 2)
																+ Math.pow(camera.position.y, 2)));
	if (camera.far < far) {
		camera.far = far;
		camera.updateProjectionMatrix();
	}

	renderer.render(scene, camera);
}
