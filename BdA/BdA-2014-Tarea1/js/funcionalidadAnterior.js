/*
//Se lee linea a linea
var lineas = e.target.result.split("\n");
for(var cont = 0; cont < lineas.length - 1; cont++){
	//La primera linea son las preguntas
	if(cont == 0){
		preguntas = lineas[0].split(",");
		csv = csv + "\n\t<preguntas>";
		for (var aux = 0; aux < preguntas.length; aux++){
			csv = csv + "\n\t\t<pregunta id='"+aux+"'>"+preguntas[aux]+"</pregunta>";
		}
		csv = csv + "\n\t</preguntas>";
	}else{
		//Cada linea representa un sansano
		csv = csv + "\n\t<sansano>\n";
		var columnas = lineas[cont].split(",");
		//Se lee respuesta a respuesta y se inserta con el formato xml establecido
		for(var cont2 = 0; cont2 < columnas.length; cont2++){
			csv = csv + "\t\t<respuesta id='"+cont2+"'>"+columnas[cont2]+"</respuesta>\n";
		}
		//Cierre de entrada sansano
		csv = csv + "\t</sansano>";
	}
}
//Cierre de archivo xml
csv = csv + "\n</encuesta>";
*/