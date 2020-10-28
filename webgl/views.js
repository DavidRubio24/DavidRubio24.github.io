
var delta = 500;

function viewsCameras(scene, size) {

	orto = new THREE.OrthographicCamera(-size, size, size, -size, 1, 1000);
	alzado = new THREE.OrthographicCamera(-500, 500, 500, -500, 1, 2000);
	planta = new THREE.OrthographicCamera(-500, 500, 500, -500, 1, 1000);
	perfil = new THREE.OrthographicCamera(-500, 500, 500, -500, 1, 2000);
	planta.up = new THREE.Vector3(-1, 0, 0);
	alzado.position.set(800, 500,   0);
	planta.position.set(  0, 900,   0);
	perfil.position.set(  0, 500, 500);
	alzado.lookAt(0,500,0);
	planta.lookAt(0,  0,0);
	perfil.lookAt(0,500,0);
	scene.add(orto);
	scene.add(alzado);
	scene.add(planta);
	scene.add(perfil);

	delta = size;
}

function showViews(vista, fixCamera){

	if (vista !== "ninguna") {
		var size = Math.min(window.innerWidth, window.innerHeight) / 4;
		renderer.setViewport(0, 0, size, size);
		if (fixCamera) {
			if (vista === "planta") {
				renderer.render(scene, planta);
			} else if (vista === "alzado") {
				renderer.render(scene, alzado);
			} else if (vista === "perfil") {
				renderer.render(scene, perfil);
			}
		} else {
			var lookat = new THREE.Vector3(0, 100, 0);
			antebrazo.localToWorld(lookat);
			orto.lookAt(lookat);
			if (vista === "planta") {
				orto.position.set(lookat.x, lookat.y + 400, lookat.z);
				orto.up = new THREE.Vector3(-1, 0, 0);
				renderer.render(scene, orto);
			} else if (vista === "alzado") {
				orto.position.set(lookat.x + delta, lookat.y , lookat.z);
				orto.up = new THREE.Vector3(0, 1, 0);
				renderer.render(scene, orto);
			} else if (vista === "perfil") {
				orto.position.set(lookat.x, lookat.y , lookat.z + delta);
				orto.up = new THREE.Vector3(0, 1, 0);
				renderer.render(scene, orto);
			}
		}
	}
}