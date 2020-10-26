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
materials();

console.log('positions()...');
positions();

console.log('lights()...');
lights();

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
	renderer.shadowMap.enabled = true;
	document.body.appendChild(renderer.domElement);

	// Escena
	scene = new THREE.Scene();

	// Camara Perspectiva
	var aspectRatio = window.innerWidth / window.innerHeight;
	camera = new THREE.PerspectiveCamera(50, aspectRatio, 0.1, 2000);
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


	// STATS
	stats = new Stats();
	stats.setMode( 0 );					// Muestra FPS
	stats.domElement.style.removeProperty('top');
	stats.domElement.style.bottom = '0px';
	document.body.appendChild( stats.domElement );
}


function lights(){
	luzAmbiental = new THREE.AmbientLight('white', 0.3);
	luzPuntual   = new THREE.PointLight(  'white', 0.7, 0, 0);
	luzFocal     = new THREE.SpotLight(   'red', 0.7, 0, Math.PI/4, 0.9);

	luzPuntual.position.set(400, 400, 0);
	luzFocal.position.set(0, 300, 400);
	luzFocal.target.position.set(0, 280, 0);
	luzFocal.castShadow = true;
	luzFocal.shadow.camera.far = 1000;

	scene.add(luzAmbiental);
	scene.add(luzPuntual);
	scene.add(luzFocal);
}


function materials(){

	let sueloTextura = new THREE.TextureLoader().load('textures/table.jpg');
	suelo.material = new THREE.MeshLambertMaterial({color: 'white', map: sueloTextura});


	var path = 'textures/House/', format = '.jpg';
	var urls = [
		path + 'posx' + format, path + 'negx' + format,
		path + 'posy' + format, path + 'negy' + format,
		path + 'posz' + format, path + 'negz' + format
	];

	scene.background = new THREE.CubeTextureLoader().load( urls );
	rotula.material  = new THREE.MeshLambertMaterial( {	// color: 0xff6600,
																											envMap: scene.background,
																											combine: THREE.MixOperation,
																											reflectivity: 0.8 } );


	let baseTextura = new THREE.TextureLoader().load('textures/metal.jpg');
	base.material = new THREE.MeshPhongMaterial({map: baseTextura, specular: 'white', shininess: 70});


	let brazoTextura = new THREE.TextureLoader().load('textures/metal_128.jpg');
	giveMaterial(new THREE.MeshPhongMaterial({map: brazoTextura, specular: 'white'}),
		[brazo, eje, esparrago]);

	let antebrazoTextura = new THREE.TextureLoader().load('textures/wood512.jpg');
	giveMaterial(new THREE.MeshLambertMaterial({map: antebrazoTextura}),
		[antebrazo, disco, nervio, mano, pinzaIz, pinzaDe].concat(nervio.children));


	// Shadows
	let elements = [robot, base, brazo, eje, esparrago, rotula, antebrazo, disco, mano, pinzaIz, pinzaDe].concat(nervio.children);
	for (let i = 0; i < elements.length; i++){
		elements[i].castShadow = true;
		elements[i].receiveShadow = true;
	}
	suelo.receiveShadow = true;

}



function updateAspectRatio(){
	renderer.setSize(window.innerWidth * .97, window.innerHeight * .955);

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
}



var h;

function setFocoColor(color){	luzFocal.color = new THREE.Color(color);}

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
		vista: 'ninguna',
		stats: false,
		reset: reset,
		foco: 'rgb(255,0,0)'
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
	h.addColor(effectController, "foco").name("Color foco: ").onChange(setFocoColor);
	h.close();
}



function update(){
	angle += Math.PI / 700;

	if (effectController.stats && !document.body.contains(stats.domElement)) {
		document.body.appendChild(stats.domElement);
	} else if (!effectController.stats && document.body.contains(stats.domElement)){
		document.body.removeChild(stats.domElement);
	}

	if (brazo.rotation.z !== -effectController.giroBrazo * Math.PI / 180) {
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

	if (effectController.vista !== "ninguna") {
		var size = Math.min(window.innerWidth, window.innerHeight) / 4;
		renderer.setViewport(0, 0, size, size);
		var lookat = new THREE.Vector3();
		rotula.getWorldPosition(lookat);
	}
	if (effectController.vista === "planta") {
		planta.position.set(lookat.x, 300, lookat.z);
		planta.up = new THREE.Vector3(-1, 0, 0);
		planta.lookAt(lookat);
		renderer.render(scene, planta);
	} else if (effectController.vista === "alzado") {
		alzado.position.set(lookat.x + 150, lookat.y, lookat.z);
		alzado.lookAt(lookat);
		renderer.render(scene, alzado);
	} else if (effectController.vista === "perfil"){
		perfil.position.set(lookat.x, lookat.y, lookat.z + 150);
		perfil.lookAt(lookat);
		renderer.render(scene, perfil);
	}

	renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
	renderer.render(scene, camera);
}
