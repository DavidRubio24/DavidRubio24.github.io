
var suelo, pantalla, pelota, luxo, cilindro, campanaBase, eje, bola, tetraedro, nervio1, nervio2, nervio3, rotula, nervio4, nervio5, triangulo, eje2, campana, bombilla, target;

var video, videoImage, videoImageContext, videoTexture;

var radioNervios = 5, alturaNervios = 300;

function BombillaGeometry(radiusBottom, radiusTop, height, radialSegments, heightSegments){
	let points = [];

	// Circle
	for(let i = 0; i < radiusBottom; i+= radiusBottom / heightSegments){
		points.push(new THREE.Vector2(Math.sqrt(radiusBottom*radiusBottom - (radiusBottom - i)*(radiusBottom - i)), i - radiusBottom));
	}

	for (var angle = -Math.PI/2, i = 0; angle <= Math.PI/2; angle += Math.PI / heightSegments, i+= height/heightSegments){
		points.push(new THREE.Vector2((radiusBottom + radiusTop)/2  + (radiusTop - radiusBottom) * Math.sin(angle) / 2, i*1.7));
	}
	for (let j = 0; j <= radiusTop; j += radiusTop / heightSegments){
		points.push(new THREE.Vector2(Math.sqrt(radiusTop*radiusTop - j*j), i*1.7 + j));
	}

	return new THREE.LatheGeometry(points, radialSegments);
}

function CampanaGeometry(radiusBottom, radiusTop, height, maxAngle, radialSegments, heightSegments){
	let points = [];

	// Circle
	for(var i = 0; i < radiusBottom; i+= radiusBottom / heightSegments){
		points.push(new THREE.Vector2(Math.sqrt(radiusBottom*radiusBottom - (radiusBottom - i)*(radiusBottom - i)), i - radiusBottom));
	}

	// Sin
	let startRadius = (radiusTop + radiusBottom) / 2 ;
	for (let angle = -Math.PI/2, i = 0; angle <= maxAngle; angle += (maxAngle - -Math.PI/2) / heightSegments, i+= height/heightSegments){
		points.push(new THREE.Vector2(startRadius  + (radiusTop - radiusBottom) * Math.sin( angle ) / 2, i*1.7));
	}
	return new THREE.LatheGeometry(points, radialSegments);
}

function CampanaBaseGeometry(radiusBottom, radiusTop, radialSegments, heightSegments){

	let height = radiusBottom - radiusTop;
	function circle(x) {
		return Math.sqrt(1 - x * x);
	}

	let points = [];
	for (let i = 0; i < heightSegments; i++){
		points.push(new THREE.Vector2(radiusTop + height * circle(i / heightSegments), i * height / heightSegments));
	}
	points.push(new THREE.Vector2(0, height))
	return new THREE.LatheGeometry(points, radialSegments);
}


function tree(){

	suelo = new THREE.Mesh(new THREE.PlaneGeometry( 2000, 2000, 200, 200));


	pelota = new THREE.Mesh(new THREE.SphereGeometry(40, 32, 32, 1));

	luxo  		= new THREE.Object3D();
	base  		= new THREE.Object3D();
	brazo  		= new THREE.Object3D();
	antebrazo	= new THREE.Object3D();

	cilindro = new THREE.Mesh(new THREE.CylinderGeometry(90, 90, 3, 40));
	campanaBase = new THREE.Mesh(CampanaBaseGeometry(cilindro.geometry.parameters.radiusBottom - 3,
		cilindro.geometry.parameters.radiusBottom - 18,
		40, 10));
	eje = new THREE.Mesh(new THREE.CylinderGeometry(7, 7, 30, 20));
	bola = new THREE.Mesh(new THREE.SphereGeometry(7, 16, 16));
	tetraedro = new THREE.Mesh(new THREE.TetrahedronGeometry(20));
	nervio1 = new THREE.Mesh(new THREE.LatheGeometry([new THREE.Vector2(radioNervios, 0), new THREE.Vector2(radioNervios, alturaNervios)], 3, Math.PI / 2));
	nervio2 = new THREE.Mesh(nervio1.geometry);
	nervio3 = new THREE.Mesh(nervio1.geometry);
	rotula = new THREE.Mesh(new THREE.SphereGeometry(tetraedro.geometry.parameters.radius, 36, 36));
	nervio4 = new THREE.Mesh(new THREE.BoxGeometry(radioNervios * 1.5, alturaNervios, radioNervios * 1.5));
	nervio5 = new THREE.Mesh(nervio4.geometry);
	triangulo = new THREE.Mesh(new THREE.CylinderGeometry(20,20, nervio4.geometry.parameters.width, 3));
	eje2 = new THREE.Mesh(new THREE.CylinderGeometry(triangulo.geometry.parameters.height / 2, triangulo.geometry.parameters.height / 2, 50, 20));

	campana = new THREE.Mesh(CampanaGeometry(20, 110, 70, Math.PI/2,  32, 16));
	bombilla = new THREE.Mesh(BombillaGeometry(10, 30, 35, 32, 16));
	target = new THREE.Object3D();

	video = document.createElement('video');
	video.src = 'videos/Luxo.mp4';
	video.loop = true;
	video.muted = true;
	video.load();
	video.play();

	videoImage = document.createElement('canvas');
	videoImage.width = 790;
	videoImage.height = 480;

	videoImageContext = videoImage.getContext('2d');
	videoImageContext.fillStyle = '#0000FF';
	videoImageContext.fillRect(0, 0, videoImage.width, videoImage.height);

	videoTexture = new THREE.Texture(videoImage);
	videoTexture.minFilter = THREE.LinearFilter;
	videoTexture.magFilter = THREE.LinearFilter;
	let videoMaterial = new THREE.MeshBasicMaterial({map: videoTexture, side: THREE.DoubleSide});
	pantalla = new THREE.Mesh(new THREE.PlaneGeometry(videoImage.width, videoImage.height), videoMaterial);

	scene.add(suelo);

	scene.add(pantalla);

	scene.add(pelota);

	scene.add(luxo);
	luxo.add(base);
	base.add(cilindro);
	base.add(campanaBase);
	base.add(eje);
	base.add(brazo);
	brazo.add(bola);
	brazo.add(tetraedro);
	brazo.add(nervio1);
	brazo.add(nervio2);
	brazo.add(nervio3);
	brazo.add(rotula);
	rotula.add(antebrazo);
	antebrazo.add(nervio4);
	antebrazo.add(nervio5);
	antebrazo.add(triangulo);
	antebrazo.add(eje2);
	antebrazo.add(campana);
	campana.add(bombilla);
	bombilla.add(target);



	scene.add(new THREE.AxesHelper(300));

}


function giveMaterial(material, elements){
	for (let i = 0; i < elements.length; i++)
		elements[i].material = material;
}

function materials(){


	var path = 'textures/House/', format = '.jpg';
	var urls = [
		path + 'posx' + format, path + 'negx' + format,
		path + 'posy' + format, path + 'negy' + format,
		path + 'posz' + format, path + 'negz' + format
	];

	scene.background = new THREE.CubeTextureLoader().load( urls );


	let sueloTextura = new THREE.TextureLoader().load('textures/table.jpg');
	sueloTextura.repeat.set(2,2);
	sueloTextura.wrapS = sueloTextura.wrapT = THREE.MirroredRepeatWrapping;
	suelo.material = new THREE.MeshLambertMaterial({color: 'white', map: sueloTextura});


	let pelotaTextura = new THREE.TextureLoader().load('textures/ball4.jpg');
	pelota.material = new THREE.MeshLambertMaterial({map: pelotaTextura});

	campana.material = new THREE.MeshPhongMaterial({color: 'white', side: THREE.DoubleSide});

	cilindro.material = new THREE.MeshLambertMaterial({color: 'black'});
	campanaBase.material = campana.material;
	eje.material = new THREE.MeshPhongMaterial({color: 'black'});
	tetraedro.material = new THREE.MeshLambertMaterial({color: 'grey'});
	nervio1.material = new THREE.MeshPhongMaterial({color: 'white'});
	nervio2.material = nervio3.material = nervio4.material = nervio5.material = nervio1.material;
	rotula.material = new THREE.MeshPhysicalMaterial({reflectivity: 1});
	eje2.material = eje.material;
	triangulo.material = tetraedro.material;
	bombilla.material = new THREE.MeshPhongMaterial({emissiveIntensity: 10});
	bombilla.material.color = bombilla.material.emissive = luzFocal.color;


}

function shadows(activate){
	if (!activate) return;


	renderer.shadowMap.enabled = true;

	luzFocal.castShadow = true;

	let elementos = [suelo, pelota, luxo, cilindro, campanaBase, eje, bola, tetraedro, nervio1, nervio2, nervio3, nervio4, nervio5, triangulo, eje2, campana];


	for (let i=1; i<elementos.length; i++){
		elementos[i].castShadow = true;
		elementos[i].receiveShadow = true;
	}
	suelo.receiveShadow = true;
}

function positions(){

	suelo.rotation.x = - Math.PI / 2;

	pantalla.position.y = 50 +pantalla.geometry.parameters.height / 2;
	pantalla.position.z = - 1050;

	pelota.position.set(500, 40, 100);

	cilindro.position.y = cilindro.geometry.parameters.height / 2;
	eje.position.y = eje.geometry.parameters.height / 2;

	brazo.position.y = eje.geometry.parameters.height;
	tetraedro.position.y = tetraedro.geometry.parameters.radius;
	tetraedro.rotation._order = "ZYX";
	tetraedro.rotation.z = 0.31 * Math.PI;
	tetraedro.rotation.y = - Math.PI / 4;
	nervio1.position.y = tetraedro.geometry.parameters.radius * 1.35;
	nervio2.position.y = nervio1.position.y;
	nervio3.position.y = nervio1.position.y;
	nervio1.position.x = tetraedro.geometry.parameters.radius - radioNervios * 1.4;
	nervio2.position.x =   nervio1.position.x * Math.cos(2 * Math.PI / 3);
	nervio2.position.z = - nervio1.position.x * Math.sin(2 * Math.PI / 3);
	nervio3.position.x =   nervio2.position.x;
	nervio3.position.z = - nervio2.position.z;
	rotula.position.y  = alturaNervios + nervio1.position.y;
	nervio4.position.y = nervio4.geometry.parameters.height / 2;
	nervio5.position.y = nervio4.position.y;
	nervio4.position.x = tetraedro.geometry.parameters.radius - nervio4.geometry.parameters.depth;
	nervio5.position.x = - nervio4.position.x;
	triangulo.position.y = nervio4.geometry.parameters.height + 10;
	triangulo.rotation.x = - Math.PI / 2;
	eje2.position.y = triangulo.position.y + eje2.geometry.parameters.height / 2;
	campana.position.y = eje2.position.y + eje2.geometry.parameters.height / 2 + 17;
	campana.rotation.z = -Math.PI / 2;
	target.position.y = 100;

}

function salto(event){
	console.log('girando');
	var p = pelota.position;
	var l = luxo.position;
	var d = -Math.atan((p.z-l.z)/(p.x - l.x));
	var turn = new TWEEN.Tween(luxo.rotation).to({y: d}, 500);

	var c = new THREE.Vector3();
	campana.localToWorld(c);
	var t = new THREE.Vector3();
	target.localToWorld(t);
	turn.start();
}


function huida(event){
	var p = pelota.position;
	var to = new THREE.Vector3(2000*Math.random()-1000, p.y, 2000*Math.random()-1000);
	var move = new TWEEN.Tween(pelota.position).to({x:to.x, y:to.y, z:to.z}, 100);
	move.start();
}