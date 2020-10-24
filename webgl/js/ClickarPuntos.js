/**16/9/2020*/

// Shader vertices

var VSHADER_SOURCE =
'attribute vec4 position;  \n' +
'void main(){ gl_Position = position; gl_PointSize = 10.0;} \n';


var FSHADER_SOURCE = 
'void main(){ gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); }'




function main() {
	var gl = getGL("canvas");
	
	var get_shader=function(shadersource,shadertype)
{
    var shader=gl.createShader(shadertype);
    gl.shaderSource(shader,shadersource);
    gl.compileShader(shader);
        // Check for any compilation error
        alert(gl.getShaderInfoLog(shader));
    
    return shader;
}

// Now using the above function get compiled vertex and fragment shaders. The following two varibales are compiled shaders
var vertex_shader=get_shader(VSHADER_SOURCE,gl.VERTEX_SHADER);
var fragment_shader=get_shader(FSHADER_SOURCE,gl.FRAGMENT_SHADER);
	
	gl.clear(gl.COLOR_BUFFER_BIT);

	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
		console.log("Fallo de carga de shaders");
	}

	console.log("Shader cargado.	");

	var coordenadas = gl.getAttribLocation( gl.createProgram(), 'position');
	canvas.onmousedown = function( evento ){click(evento, gl, canvas, coordenadas); };

}

var puntos = [];
function click( evento, gl, canvas, coordenadas) {

	var X = evento.clientX;
	var Y = evento.clientY;
	var rect = evento.target.getBoundingClientRect();

	X = ((X - rect.left) - canvas.width / 2) * 2 / canvas.width;
	Y = (canvas.height / 2 - (Y - rect.top)) * 2 / canvas.height;

	puntos.push(X); puntos.push(Y);

	gl.clear(gl.COLOR_BUFFER_BIT);

	for( var i=0; i < puntos.length; i +=2) {
		gl.vertexAttrib3f(coordenadas, puntos[i], puntos[i+1], 0.0);
		gl.drawArrays( gl.POINTS, 0, 1);
	}


}


main();



