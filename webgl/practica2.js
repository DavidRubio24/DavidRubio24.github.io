/* Práctica 2
 *
 * David Rubio Ibáñez
 *
 *Mi práctica difiere del enunciado en los siguientes aspectos:
 *  La camara se mueve automaticamente alrededor del robot (tanto en angulo como en altura) para poder ver el robot desde todas las perspectivas.
 *  El suelo no es transparente, es verde, y parece estar iluminado desde la camara (he puesto Fog a la escena).
 *  El robot se mueve: las pinzas se abren y cierran y el antebrazo se inclina respecto a la rótula.
 *  Distintas partes tienen distintos colores.
 *
 */



var renderer, scene, camera;

var robot, base, brazo, eje, esparrago, rotula, antebrazo, disco, nervios, mano, pinzaDe, pinzaIz, suelo, angle = 0;

var center = new THREE.Vector3(0, 110, 0);

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
	renderer.setSize(window.innerWidth, window.innerHeight);
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


function update(){
	angle += Math.PI / 700;
	camera.position.x = 300 * Math.cos(angle);
	camera.position.z = 300 * Math.sin(angle);
	camera.position.y = 120 + 100 * Math.cos(angle / 3);
	camera.lookAt(center);

	pinzaDe.position.y =  8 + 6 * Math.sin(11 * angle);
	pinzaIz.position.y = -8 - 6 * Math.sin(11 * angle);

	antebrazo.rotation.z = - (1 - Math.cos(7 * angle)) * Math.PI / 10;
}

function render(){
	requestAnimationFrame(render);
	update();
	renderer.render(scene, camera);
}
