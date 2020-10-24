/** David Rubio
 *
 *  Este script contiene funciones que me resultan útiles.
 **/

/** Debuelve el contexto del canvas con el ID dado.*/
function getGL(canvasID) {
	var canvas = document.getElementById(canvasID);

	if (! canvas) {
		console.log("Fail while loading canvas.");
		return;
	}

	console.log("Canvas loaded.");

	var gl = canvas.getContext("experimental-webgl");
	if (! gl) {
		console.log("Fail while loading context.");
		return;
	}

	return gl;
}
