/* Práctica 3
 *
 * David Rubio Ibáñez
 *
 *
 */



var renderer, scene, camera, orto, alzado, planta, perfil;

var cameraControls, effectController, reloj0, reloj;

var luzDireccional, luzFocal, luzAmbiental;


var keyboard	= new THREEx.KeyboardState();


init();

tree();

lights();


materials();


positions();

physics();

shadows(true);


setupGui();

listeners();
reloj0.start()
render();

function init() {
	// Render
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth * .97, window.innerHeight * .955);
	renderer.autoClear = false;
	document.body.appendChild(renderer.domElement);

	// Escena
	scene = new THREE.Scene();

	// Camara Perspectiva
	var aspectRatio = window.innerWidth / window.innerHeight;
	camera = new THREE.PerspectiveCamera(50, aspectRatio, 0.1, 4000);
	camera.position.set(1400, 600, 0);
	scene.add(camera);

	// Camaras Ortograficas
	viewsCameras(scene, 500);

	// OrbitControls
	cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
	cameraControls.target.set(0, 400, 0);
	cameraControls.enableKeys = false;
	cameraControls.update();

	window.addEventListener('resize', updateAspectRatio);


	// STATS
	stats = new Stats();
	stats.setMode( 0 );					// Muestra FPS
	stats.domElement.style.removeProperty('top');
	stats.domElement.style.bottom = '0px';
	document.body.appendChild( stats.domElement );


	reloj0 = new THREE.Clock(false);
	reloj = new THREE.Clock(false);
}



function listeners(){

	//LISTENERS
	var domEvents	= new THREEx.DomEvents(camera, renderer.domElement);

	var luxoBall = true, lightOn = true;

	domEvents.addEventListener(pantalla, 'dblclick', function (event){video.paused ? video.play() :video.pause();});
	domEvents.addEventListener(campanaBase, 'dblclick', salto);
	domEvents.addEventListener(cilindro, 'dblclick', salto);
	domEvents.addEventListener(eje, 'dblclick', salto);
	domEvents.addEventListener(suelo, 'dblclick', huida);
	domEvents.addEventListener(pelota,   'dblclick', function (event){
		let pathW = 'textures/world.jpg', pathL = 'textures/ball.jpg';
		pelota.material = new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load(luxoBall ? pathW : pathL)});
		luxoBall = !luxoBall;
	});

	function changeLight(event) {
		if (lightOn) {
			luzFocal.intensity = bombilla.material.emissiveIntensity = campanaInterior.material.emissiveIntensity = 0;
			luzFocal.castShadow = false;
		} else {
			luzFocal.intensity = 2;
			setFocoColor(effectController.foco);
			bombilla.material.emissiveIntensity = 10;
			campanaInterior.material.emissiveIntensity = 1;
			luzFocal.castShadow = true;
		}
		lightOn = !lightOn;
	}

	domEvents.addEventListener(campana,   'dblclick', changeLight);
	domEvents.addEventListener(bombilla,   'dblclick', changeLight);

	keyboard.domElement.addEventListener('keydown', function(event){
		if (keyboard.eventMatches(event, 'space')) video.paused ? video.play() :video.pause();
		if (keyboard.eventMatches(event, 'escape')) reset();
		if (keyboard.eventMatches(event, 'm') || keyboard.eventMatches(event, 'M')) video.muted = !video.muted;
		if (keyboard.eventMatches(event, 'left')  && luxo.position.z < 910)  effectController.luxoZ -= 3;
		if (keyboard.eventMatches(event, 'right') && luxo.position.z > -910) effectController.luxoZ += 3;
		if (keyboard.eventMatches(event, 'down')  && luxo.position.x < 910)  effectController.luxoX += 3;
		if (keyboard.eventMatches(event, 'up')    && luxo.position.x > -910) effectController.luxoX -= 3;
		updateControls();
	});

}

function fijaFocoABomobilla(){
	let position = new THREE.Vector3(0, 50, 0);
	bombilla.localToWorld(position);
	luzFocal.position.set(position.x, position.y, position.z);
}


function lights(){
	luzAmbiental = new THREE.AmbientLight('white', 0.4);
	luzDireccional = new THREE.DirectionalLight('white', .2);
	luzFocal     = new THREE.SpotLight(0x005AFF, 2, 0, Math.PI/4, 0.9);

	fijaFocoABomobilla();
	luzFocal.target = target;
	luzFocal.castShadow = true;
	luzFocal.shadow.camera.far = 1000;

	scene.add(luzAmbiental);
	scene.add(luzDireccional);
	scene.add(luzFocal);
}



function updateAspectRatio(){
	renderer.setSize(window.innerWidth * .97, window.innerHeight * .955);

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
}



var h;

function setFocoColor(color){
	luzFocal.color = new THREE.Color(color);
	bombilla.material.color = luzFocal.color;
	bombilla.material.emissive = luzFocal.color;
	campanaInterior.material.emissive = luzFocal.color;
}

function reset(){
	effectController.luxoX = 0;
	effectController.luxoZ = 0;
	effectController.giroBase = 0;
	effectController.giroBrazo = -40;
	effectController.giroAntebrazoY = 0;
	effectController.giroAntebrazoZ = 90;
	effectController.giroFocoZ = 120;
	effectController.giroFocoY = 0;
	h.updateDisplay();
}

function setupGui(){

	// Definicion de los controles
	effectController = {
		luxoX: 0,
		luxoZ: 0,
		giroBase: 0,
		giroBrazo: -40,
		giroAntebrazoY: 0,
		giroAntebrazoZ: 90,
		giroFocoZ: 115,
		giroFocoY: 0,
		vista: 'ninguna',
		stats: false,
		fixCamera: false,
		reset: reset,
		foco: 'rgb(0,90,255)'
	};

	// Creación interfaz
	var gui = new dat.GUI();

	// Construcción del menú
	h = gui.addFolder("Control Luxo");
	h.add(effectController, "luxoX", -910, 910, 1).name("Posicion x:");
	h.add(effectController, "luxoZ", -910, 910, 1).name("Posicion z:");
	h.add(effectController, "giroBase", -180, 180, 1).name("Giro Base:");
	h.add(effectController, "giroBrazo", -50, 50, 1).name("Giro Brazo:");
	h.add(effectController, "giroAntebrazoY", -180, 180, 1).name("Giro Antebrazo Y: ");
	h.add(effectController, "giroAntebrazoZ",  -90,  90, 1).name("Giro Antebrazo Z: ");
	h.add(effectController, "giroFocoZ", -120, 120, 1).name("Giro Foco Z:");
	h.add(effectController, "giroFocoY", -180, 180, 1).name("Giro Foco Y:");
	h.add(effectController, "reset").name("Reset");
	h.add(effectController, "vista", ["planta", "alzado", "perfil", "ninguna"]).name("Vista:");
	h.add(effectController, "stats").name("Stats");
	h.add(effectController, "fixCamera").name("Fija camara vistas");
	h.addColor(effectController, "foco").name("Color foco: ").onChange(setFocoColor);
	h.close();
}

function updateControls(){

	if (effectController.stats && !document.body.contains(stats.domElement)) {
		document.body.appendChild(stats.domElement);
	} else if (!effectController.stats && document.body.contains(stats.domElement)){
		document.body.removeChild(stats.domElement);
	}

	if (brazo.rotation.z !== -effectController.giroBrazo * Math.PI / 180) {
		orto.b = effectController.giroBrazo;
		orto.updateProjectionMatrix();
	}

	luxo.position.x = effectController.luxoX;
	luxo.position.z = -effectController.luxoZ;
	base.rotation.y =  effectController.giroBase * Math.PI / 180;
	brazo.rotation.z =  -effectController.giroBrazo * Math.PI / 180;
	antebrazo.rotation.y = effectController.giroAntebrazoY * Math.PI / 180;
	antebrazo.rotation.z = -effectController.giroAntebrazoZ * Math.PI / 180;
	campana.rotation.z =  -effectController.giroFocoZ * Math.PI / 180;
	campana.rotation.y =  -effectController.giroFocoY * Math.PI / 180;

	h.updateDisplay();
}
var xxx = 1;
function update() {

	TWEEN.update();

	if (reloj0.getElapsedTime() > 15) {
		reloj.start();
		reloj0.start();
		reloj0.stop();
	}
	world.step(reloj.getDelta());
	pelota.position.copy(pelotaFisica.position);
	pelota.quaternion.copy(pelotaFisica.quaternion);

	updateControls();

	fijaFocoABomobilla();

	stats.update();

	if (video.readyState === video.HAVE_ENOUGH_DATA) {
		videoImageContext.drawImage(video, 0, 0);
		if (videoTexture) videoTexture.needsUpdate = true;
	}
}



function render() {
	requestAnimationFrame(render);
	update();

	showViews(effectController.vista, effectController.fixCamera);

	renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
	renderer.render(scene, camera);
}
