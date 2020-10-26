
function PinzaGeometry(){
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
		new THREE.Face3( 2, 3, 7, new THREE.Vector3( 1, 0, 0)), //4
		new THREE.Face3( 2, 7, 6, new THREE.Vector3( 1, 0, 0)),
		new THREE.Face3( 0, 4, 3, new THREE.Vector3( 0, 1, 0)),
		new THREE.Face3( 3, 4, 7, new THREE.Vector3( 0, 1, 0)),
		new THREE.Face3( 1, 2, 5, new THREE.Vector3( 0,-1, 0)), //8
		new THREE.Face3( 2, 6, 5, new THREE.Vector3( 0,-1, 0)),
		new THREE.Face3( 4, 5, 8, new THREE.Vector3( -(38-19), 0, 10-x)),
		new THREE.Face3( 5, 9, 8, new THREE.Vector3( -(38-19), 0, 10-x)),
		new THREE.Face3( 6, 7,11, new THREE.Vector3(   38-19,  0, 10-x)), //12
		new THREE.Face3( 6,11,10, new THREE.Vector3(   38-19,  0, 10-x)),
		new THREE.Face3( 4, 8, 7, new THREE.Vector3( 0, 38-19, 2)),
		new THREE.Face3( 7, 8,11, new THREE.Vector3( 0, 38-19, 2)),
		new THREE.Face3( 5, 6, 9, new THREE.Vector3( 0,-1, 0)), //16
		new THREE.Face3( 6,10, 9, new THREE.Vector3( 0,-1, 0)),
		new THREE.Face3( 8, 9,11, new THREE.Vector3( 0, 0, 1)),
		new THREE.Face3( 9,10,11, new THREE.Vector3( 0, 0, 1)),
	);

	geometry.faceVertexUvs[0] =[
		[new THREE.Vector2(1, .55), 				new THREE.Vector2(0, .51666666), 	new THREE.Vector2(1, .45)],
		[new THREE.Vector2(1, .45), 				new THREE.Vector2(0, .51666666), 	new THREE.Vector2(0, .45)],
		[new THREE.Vector2(.0666666666,0), 	new THREE.Vector2(0,0), 					new THREE.Vector2(.0666666666,.5)],
		[new THREE.Vector2(0,0), 						new THREE.Vector2(0,.5), 					new THREE.Vector2(.0666666666,.5)],
		[new THREE.Vector2(.06666,0), 			new THREE.Vector2(0,0), 					new THREE.Vector2(0,.5)],
		[new THREE.Vector2(.06666,0),				new THREE.Vector2(0,.5), 					new THREE.Vector2(.06666,.5)],
		[new THREE.Vector2( 1,.51666666), 	new THREE.Vector2( 1,.7666666), 	new THREE.Vector2( 0,.51666666)], // 6
		[new THREE.Vector2( 0,.51666666), 	new THREE.Vector2( 1,.7666666), 	new THREE.Vector2( 0,.7666666)],
		[new THREE.Vector2( 1,.45), 				new THREE.Vector2( 0,.45), 				new THREE.Vector2( 1,.2)], // 8
		[new THREE.Vector2( 0,.45), 				new THREE.Vector2( 0,.2), 				new THREE.Vector2(11,.2)],
		[new THREE.Vector2(.0666666666,.5), new THREE.Vector2(0,.5), 					new THREE.Vector2(.0666666666,1)],
		[new THREE.Vector2(0,.5), 					new THREE.Vector2(0,1), 					new THREE.Vector2(0,.0666666666)],
		[new THREE.Vector2(.0666666666,.2), new THREE.Vector2(0,.5), 					new THREE.Vector2(0,1)], // 12
		[new THREE.Vector2(.0666666666,.5), new THREE.Vector2(0,1), 					new THREE.Vector2(.0666666666,1)],
		[new THREE.Vector2( 1,.7666666), 		new THREE.Vector2(1,.9666666), 		new THREE.Vector2( 0,.7666666)],
		[new THREE.Vector2( 0,.7666666), 		new THREE.Vector2(1,.9666666), 		new THREE.Vector2( 0,.9666666)],
		[new THREE.Vector2( 1,.2), 					new THREE.Vector2( 0,.2), 				new THREE.Vector2(1,0)], // 16
		[new THREE.Vector2( 0,.2), 					new THREE.Vector2( 0,0), 					new THREE.Vector2(1,0)],
		[new THREE.Vector2( 1, .9666666), 	new THREE.Vector2(1, 1), 					new THREE.Vector2(0,7666666)],
		[new THREE.Vector2( 1, 1), 					new THREE.Vector2(0, 1), 					new THREE.Vector2(0, 7666666)]];
	return geometry;
}

function tree(){
	console.log('suelo');
	suelo = new THREE.Mesh(new THREE.PlaneGeometry( 1000, 1000, 40, 40));

	console.log('robot');
	robot 		= new THREE.Object3D();
	base  		= new THREE.Mesh(new THREE.CylinderGeometry(50, 50, 15, 32));
	brazo 		= new THREE.Object3D();
	eje 			= new THREE.Mesh(new THREE.CylinderGeometry(20, 20, 18, 32));
	esparrago = new THREE.Mesh(new THREE.BoxGeometry(12, 120, 18));
	rotula 		= new THREE.Mesh(new THREE.SphereGeometry(20, 32, 32));
	antebrazo = new THREE.Object3D();
	disco 		= new THREE.Mesh(new THREE.CylinderGeometry(22, 22, 6, 32));
	nervio 		= new THREE.Object3D();
	mano 			= new THREE.Mesh(new THREE.CylinderGeometry(15, 15, 40, 32));

	console.log('pinzas');
	let geopinza = PinzaGeometry();
	pinzaDe = new THREE.Mesh(geopinza);
	pinzaIz = new THREE.Mesh(geopinza);
	let geonervio = new THREE.BoxGeometry(4, 80, 4);

	console.log('adds');

	scene.add(suelo);

	scene.add(robot);
	robot.add(base);
	base.add(brazo);
	brazo.add(eje);
	brazo.add(esparrago);
	brazo.add(rotula);
	brazo.add(antebrazo);
	antebrazo.add(disco);
	antebrazo.add(nervio);
	antebrazo.add(mano);
	mano.add(pinzaIz);
	mano.add(pinzaDe);
	nervio.add(new THREE.Mesh(geonervio));
	nervio.add(new THREE.Mesh(geonervio));
	nervio.add(new THREE.Mesh(geonervio));
	nervio.add(new THREE.Mesh(geonervio));

	scene.add(new THREE.AxesHelper(300));

}


function giveMaterial(material, elements){
	for (let i = 0; i < elements.length; i++)
		elements[i].material = material;
}

function materialsBasic(){

	suelo.material = new THREE.MeshBasicMaterial({color: 'green'});

	base.material = new THREE.MeshBasicMaterial({color: 'blue', wireframe: true});
	giveMaterial(new THREE.MeshBasicMaterial({color: 'red', wireframe: true}),
							 [brazo, eje, esparrago, rotula]);
	giveMaterial(new THREE.MeshBasicMaterial({color: 'yellow', wireframe: true}),
							 [antebrazo, disco, nervio, mano, pinzaIz, pinzaDe].concat(nervio.children));
}

function positions(){

	suelo.rotation.x = - Math.PI / 2;

	robot.position.y = 7.5;
	eje.rotation.x = Math.PI / 2;
	esparrago.position.y = 60;
	rotula.position.y = 120;
	antebrazo.position.y = 120;
	nervio.position.y = 40;
	mano.position.y = 80;
	mano.rotation.x = Math.PI / 2;
	pinzaDe.position.y = 8;
	pinzaIz.position.y = -8;
	pinzaDe.position.x = 10;
	pinzaIz.position.x = 10;
	pinzaDe.rotation.y = Math.PI / 2;
	pinzaIz.rotation.y = Math.PI / 2;
	pinzaIz.rotation.x = Math.PI;

	let positions = [[-4, -7],[-4, 7],[4, 7],[4, -7]];
	for (let i = 0; i < 4; i++) {
		nervio.children[i].position.x = positions[i][0];
		nervio.children[i].position.z = positions[i][1];
	}

}