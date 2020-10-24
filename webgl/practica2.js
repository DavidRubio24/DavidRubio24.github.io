var renderer, scene, camera;

var robot, base, brazo, eje, esparrago, rotula, antebrazo, disco, nervios, mano, pinzaDe, pinzaIz, suelo, angle = 0;

var center = new THREE.Vector3(0, 110, 0);
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
	camera = new THREE.PerspectiveCamera(50, aspectRatio, 0.1, 1000);
	scene.add(camera)
	camera.position.set(300, 110, 0);
	camera.lookAt(center);

}


function loadScene(){

	var material  = new THREE.MeshBasicMaterial({color:'red', wireframe:true});

	// Robot
	robot = new THREE.Object3D();
	robot.position.y = 7.5;

	// Base
	var geobase = new THREE.CylinderGeometry(50, 50, 15, 32);
	var materialBase  = new THREE.MeshBasicMaterial({color:'blue', wireframe:true});
	base = new THREE.Mesh(geobase, materialBase);
	robot.add(base)

	// Brazo
	brazo = new THREE.Object3D();
	base.add(brazo)

	// Eje
	var geoeje = new THREE.CylinderGeometry(20, 20, 18, 32);
	eje = new THREE.Mesh(geoeje, material);
	eje.rotation.x = Math.PI / 2;
	brazo.add(eje);

	// Esparrago
	var geoesparrago = new THREE.BoxGeometry(12, 120, 18);
	esparrago = new THREE.Mesh(geoesparrago, material);
	esparrago.position.y = 60;
	brazo.add(esparrago);

	// Rotula
	var georotula = new THREE.SphereGeometry(20, 16, 16);
	rotula = new THREE.Mesh(georotula, material);
	rotula.position.y = 120;
	brazo.add(rotula);

	var materialAntebrazo  = new THREE.MeshBasicMaterial({color:'yellow', wireframe:true});

	// Antebrazo
	antebrazo = new THREE.Object3D();
	antebrazo.position.y = 120;
	brazo.add(antebrazo)

	// Disco
	var geodisco = new THREE.CylinderGeometry(22, 22, 6, 32);
	disco = new THREE.Mesh(geodisco, materialAntebrazo);
	antebrazo.add(disco);

	// Nervio
	nervio = new THREE.Object3D();
	nervio.position.y = 40;
	antebrazo.add(nervio);

	let geonervio = new THREE.BoxGeometry(4, 80, 4);
	let positionsX = [-4, 4];
	let positionsZ = [-7, 7];
	for (let i = 0; i < 2; i++) {
		for (let j = 0; j < 2; j++) {
			let ner = new THREE.Mesh(geonervio, materialAntebrazo);
			ner.position.x = positionsX[i];
			ner.position.z = positionsZ[j];
			nervio.add(ner);
		}
	}

	// Mano
	var geomano = new THREE.CylinderGeometry(15, 15, 40, 32);
	mano = new THREE.Mesh(geomano, materialAntebrazo);
	mano.position.y = 80;
	mano.rotation.x = Math.PI / 2;
	antebrazo.add(mano);

	// Pinzas
	function Pinza(){
		var geometry = new THREE.Geometry();
		let x = 7;
		geometry.vertices.push(
			new THREE.Vector3(-10,  2,  0), // 0
			new THREE.Vector3(-10, -2,  0), // 1
			new THREE.Vector3( 10, -2,  0), // 2
			new THREE.Vector3( 10,  2,  0), // 3
			new THREE.Vector3(-10,  2, 19), // 4
			new THREE.Vector3(-10, -2, 19), // 5
			new THREE.Vector3( 10, -2, 19), // 6
			new THREE.Vector3( 10,  2, 19), // 7
			new THREE.Vector3( -x,  0, 38), // 8
			new THREE.Vector3( -x, -2, 38), // 9
			new THREE.Vector3(  x, -2, 38), //10
			new THREE.Vector3(  x,  0, 38), //11
		);

		geometry.faces.push(
			new THREE.Face3( 0, 3, 1, new THREE.Vector3( 0, 0,-1)),
			new THREE.Face3( 1, 3, 2, new THREE.Vector3( 0, 0,-1)),
			new THREE.Face3( 0, 1, 4, new THREE.Vector3(-1, 0, 0)),
			new THREE.Face3( 1, 5, 4, new THREE.Vector3(-1, 0, 0)),
			new THREE.Face3( 2, 3, 7, new THREE.Vector3( 1, 0, 0)),
			new THREE.Face3( 2, 7, 6, new THREE.Vector3( 1, 0, 0)),
			new THREE.Face3( 0, 4, 3, new THREE.Vector3( 0, 1, 0)),
			new THREE.Face3( 3, 4, 7, new THREE.Vector3( 0, 1, 0)),
			new THREE.Face3( 1, 2, 5, new THREE.Vector3( 0,-1, 0)),
			new THREE.Face3( 2, 6, 5, new THREE.Vector3( 0,-1, 0)),
			new THREE.Face3( 4, 5, 8, new THREE.Vector3( -(38-19), 0, 10-x)),
			new THREE.Face3( 5, 9, 8, new THREE.Vector3( -(38-19), 0, 10-x)),
			new THREE.Face3( 6, 7,11, new THREE.Vector3(   38-19,  0, 10-x)),
			new THREE.Face3( 6,11,10, new THREE.Vector3(   38-19,  0, 10-x)),
			new THREE.Face3( 4, 8, 7, new THREE.Vector3( 0, 38-19, 2)),
			new THREE.Face3( 7, 8,11, new THREE.Vector3( 0, 38-19, 2)),
			new THREE.Face3( 5, 6, 9, new THREE.Vector3( 0,-1, 0)),
			new THREE.Face3( 6,10, 9, new THREE.Vector3( 0,-1, 0)),
			new THREE.Face3( 8, 9,11, new THREE.Vector3( 0, 0, 1)),
			new THREE.Face3( 9,10,11, new THREE.Vector3( 0, 0, 1)),
		);
		return geometry;
	}

	var geopinza = Pinza();
	pinzaDe = new THREE.Mesh(geopinza, materialAntebrazo);
	pinzaIz = new THREE.Mesh(geopinza, materialAntebrazo);
	pinzaDe.position.y = 10;
	pinzaIz.position.y = -10;
	pinzaDe.position.x = 10
	pinzaIz.position.x = 10
	pinzaDe.rotation.y = Math.PI / 2;
	pinzaIz.rotation.y = Math.PI / 2;
	pinzaIz.rotation.x = Math.PI;
	mano.add(pinzaDe);
	mano.add(pinzaIz);

	// Suelo
	var geosuelo = new THREE.PlaneGeometry( 1000, 1000, 32, 32);
	var materialSuelo = new THREE.MeshBasicMaterial({color:'green'});

	suelo = new THREE.Mesh(geosuelo, materialSuelo)
	suelo.rotation.x = - Math.PI / 2;

	scene.add(new THREE.AxisHelper(300));
	scene.add(suelo);
	scene.add(robot);
	scene.fog = new THREE.Fog(0);
}

function update(){
	angle += Math.PI / 700;
	camera.position.x = 300 * Math.cos(angle);
	camera.position.z = 300 * Math.sin(angle);
	camera.position.y = 110 + 150 * Math.cos(angle / 3);
	camera.lookAt(center);
}

function render(){
	requestAnimationFrame(render);
	update();
	renderer.render(scene, camera);
}
