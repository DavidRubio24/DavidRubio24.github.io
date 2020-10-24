

function pickerListener(event, camera, scene) {
	let x = (event.clientX /  window.innerWidth) * 2 - 1;
	let y = - (event.clientY / window.innerHeight) * 2 + 1;

	let ray = new THREE.Raycaster();
	ray.setFromCamera(new THREE.Vector2(x, y), camera);
	return ray.intersectObjects(scene.children, true);

}