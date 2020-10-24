/** 16/09/2020**/

function main() {
	var canvas = document.getElementById("canvas");

	if (! canvas) {
		console.log("Fallo al cargar canvas");
		return;
	}

	console.log("Canvas achived");

	var gl = canvas.getContext("experimental-webgl");
	if (! gl) {
		return;
	}

	gl.clearColor( 0.0, 0.0, 0.3, 1.0 );

	gl.clear(gl.COLOR_BUFFER_BIT);
}

main();