 function loadXMLString(txt){
if (window.DOMParser)
  {
  parser=new DOMParser();
  xmlDoc=parser.parseFromString(txt,"text/xml");
  }
else // code for IE
  {
  xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
  xmlDoc.async=false;
  xmlDoc.loadXML(txt);
  }
return xmlDoc;
}


function loadXMLDoc(dname){
	if (window.XMLHttpRequest){
	  xhttp=new XMLHttpRequest();
	}
	else{
	  xhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xhttp.open("GET",dname,false);
	try {xhttp.responseType="msxml-document"} catch(err) {} // Helping IE
	xhttp.send("");
	return xhttp;
}

function cleanUni(str){
	var aux = str.split('[');
	var clean = aux[1].toString().substring(0,aux[1].length-1);
	return clean;
}


function getPrefijo(str){
	var prefijo = str.split('[');
	return prefijo[0];
}

var doc;
var datos;
var datosXML;
var cont = 0;
function loadCSV(archivo){
	//Cabecera del xml
	var xmlDoc = loadXMLString('<?xml version="1.0" encoding="ISO-8859-1"?><encuesta></encuesta>');
	//TAGS
	var groupDatos = ["edad","nivel","puntaje","media","pregrado","carrera","egreso","titulacion","ciudad"];
	var groupOpinion = ["uchile","uc","usach","udec","utalca","inacap","pucv","uai","duoc","uv","ubiobio"];
	var groupTrabajo = ["situacionTrabajo","motivo","contEstudios","tamanioEmpresa","cargo","tiempo","estado","sueldo","sector","trabajoEspecialidad","tiempoBuscando","sueldoActual","expectativas"];
	var groupEstudio = ["postgrado","hijo","postgradoFuturo","postgradoUSM","padreUSM","parienteUSM","proceso","infrastructura","experiencia"];
	var groupUniversidad = ["prestigio","formacion","base","plan","carreras","calidadDocente"];
	var groupCapacidades = ["adaptacion","compromiso","empatia","productividad","autocuidado","frustacion","liderazgo","comEfectiva","delegar","negociacion","planificacion","gestion","capTrabajarEquipo","capActualizacion","relacionesPublicas","pensamientoAnalitico","manejoTec","domInglesEscr","domInglesHabl","dinamismo","orientacionCliente"];
	//Se oculta el uploader
	document.getElementById("uploader").style.display = "NONE";
	if (archivo.files && archivo.files[0]){
		var reader = new FileReader();
		//Función asyncronica que es llamada cuando el file input cambia
		reader.onload = function (e){
			var preguntasXML = xmlDoc.createElement("preguntas");
			var sansanos = xmlDoc.createElement("sansanos");
			//Leemos la primera linea con las preguntas
			var lineas = e.target.result.split('\n');
			for(var i = 0; i < lineas.length ; i++){
				//Primera linea con las preguntas
				if(i == 0){
					preguntas = lineas[i].split(',');
					//Agregamos los nombres de las preguntas
					var preg_aux, t;
					dataDatos = xmlDoc.createElement("datosPregunta");
					dataOpinion = xmlDoc.createElement("opinionPregunta");
					dataTrabajo = xmlDoc.createElement("trabajoPregunta");
					dataEstudio = xmlDoc.createElement("estudioPregunta")
					dataUniversidad = xmlDoc.createElement("universidadPregunta");
					dataCapacidades = xmlDoc.createElement("capacidadesPregunta");
					for(var j = 1; j < preguntas.length; j++){
						if(j>=1 && j<10){
							preg_aux = xmlDoc.createElement("pregunta");
							preg_aux.setAttribute("pid",j);
							preg_aux.setAttribute("tag",groupDatos[j-1]);
							t = document.createTextNode(preguntas[j]);
							preg_aux.appendChild(t);
							dataDatos.appendChild(preg_aux);
						}					
						//Preguntas Opinion
						if(j>=10 && j<21){
							preg_aux = xmlDoc.createElement("pregunta");
							preg_aux.setAttribute("pid",j);
							preg_aux.setAttribute("tag",groupOpinion[j-10]);
							t = document.createTextNode(preguntas[j]);
							preg_aux.appendChild(t);
							dataOpinion.appendChild(preg_aux);
						}
						//Preguntas Trabajo
						if(j>=21 && j<34){
							preg_aux = xmlDoc.createElement("pregunta");
							preg_aux.setAttribute("pid",j);
							preg_aux.setAttribute("tag",groupTrabajo[j-21]);
							t = document.createTextNode(preguntas[j]);
							preg_aux.appendChild(t);
							dataTrabajo.appendChild(preg_aux);
						}
						//Preguntas Estudio
						if(j>=34 && j< 43){
							preg_aux = xmlDoc.createElement("pregunta");
							preg_aux.setAttribute("pid",j);
							preg_aux.setAttribute("tag",groupEstudio[j-34]);
							t = document.createTextNode(preguntas[j]);
							preg_aux.appendChild(t);
							dataEstudio.appendChild(preg_aux);
						}
						//Preguntas Universidad
						if(j>=43 && j<49){
							preg_aux = xmlDoc.createElement("pregunta");
							preg_aux.setAttribute("pid",j);
							preg_aux.setAttribute("tag",groupUniversidad[j-43]);
							t = document.createTextNode(preguntas[j]);
							preg_aux.appendChild(t);
							dataUniversidad.appendChild(preg_aux);
						}
						//Preguntas Capacidades
						if(j>=49 && j<preguntas.length){
							preg_aux = xmlDoc.createElement("pregunta");
							preg_aux.setAttribute("pid",j);
							preg_aux.setAttribute("tag",groupCapacidades[j-49]);
							t = document.createTextNode(preguntas[j]);
							preg_aux.appendChild(t);
							dataCapacidades.appendChild(preg_aux);
						}
					}
					preguntasXML.appendChild(dataDatos);
					preguntasXML.appendChild(dataOpinion);
					preguntasXML.appendChild(dataTrabajo);
					preguntasXML.appendChild(dataEstudio);
					preguntasXML.appendChild(dataUniversidad);
					preguntasXML.appendChild(dataCapacidades);

				}
				else{
					//LEEMOS EL RESTO DE LOS DATOS
					var preg_aux, t;
					sansano = xmlDoc.createElement("sansano");
					sansano.setAttribute("sansano_id",i)
					dataDatos = xmlDoc.createElement("datos");
					dataOpinion = xmlDoc.createElement("opinion");
					dataTrabajo = xmlDoc.createElement("trabajo");
					dataEstudio = xmlDoc.createElement("estudio")
					dataUniversidad = xmlDoc.createElement("universidad");
					dataCapacidades = xmlDoc.createElement("capacidades");
					preguntas = lineas[i].split(',');
					for(var j = 1; j < preguntas.length; j++){
						//Datos
						if(j>=1 && j<10){
							preg_aux = xmlDoc.createElement("respuesta");
							preg_aux.setAttribute("tag",groupDatos[j-1]);
							if(preguntas[j] != ""){
								t = document.createTextNode(preguntas[j]);
							}
							else{
								t = document.createTextNode("No Ingresa");
							}
							preg_aux.appendChild(t);
							dataDatos.appendChild(preg_aux);
						}					
						//Preguntas Opinion
						if(j>=10 && j<21){
							preg_aux = xmlDoc.createElement("respuesta");
							preg_aux.setAttribute("tag",groupOpinion[j-10]);
							t = document.createTextNode(preguntas[j]);
							preg_aux.appendChild(t);
							dataOpinion.appendChild(preg_aux);
						}
						//Preguntas Trabajo
						if(j>=21 && j<34){
							preg_aux = xmlDoc.createElement("respuesta");
							preg_aux.setAttribute("tag",groupTrabajo[j-21]);
							if(preguntas[j] != ""){
								t = document.createTextNode(preguntas[j]);
							}
							else{
								t = document.createTextNode("No opino");
							}
							preg_aux.appendChild(t);
							dataTrabajo.appendChild(preg_aux);
						}
						//Preguntas Estudio
						if(j>=34 && j<43){
							preg_aux = xmlDoc.createElement("respuesta");
							preg_aux.setAttribute("tag",groupEstudio[j-34]);
							t = document.createTextNode(preguntas[j]);
							preg_aux.appendChild(t);
							dataEstudio.appendChild(preg_aux);
						}
						//Preguntas Universidad
						if(j>=43 && j<49){
							preg_aux = xmlDoc.createElement("respuesta");
							preg_aux.setAttribute("tag",groupUniversidad[j-43]);
							t = document.createTextNode(preguntas[j]);
							preg_aux.appendChild(t);
							dataUniversidad.appendChild(preg_aux);
						}
						if(j>=49 && j<preguntas.length){
							preg_aux = xmlDoc.createElement("respuesta");
							preg_aux.setAttribute("tag",groupCapacidades[j-49]);
							t = document.createTextNode(preguntas[j]);
							preg_aux.appendChild(t);
							dataCapacidades.appendChild(preg_aux);
						}
						
					}
					//Juntamos todos las preguntas obtenidas
					sansano.appendChild(dataDatos);
					sansano.appendChild(dataOpinion);
					sansano.appendChild(dataTrabajo);
					sansano.appendChild(dataEstudio);
					sansano.appendChild(dataUniversidad);
					sansano.appendChild(dataCapacidades);
					sansanos.appendChild(sansano);
				}
			}

			header = '<?xml version="1.0" encoding="ISO-8859-1"?>\n'
			//dtd 
			doc = xmlDoc.createElement("encuesta")
			//APPEND DE LOS HIJO MAS GRANDES
			doc.appendChild(preguntasXML);
			doc.appendChild(sansanos);
			//El XML final, se serializa en un string.
			var oSerializer = new XMLSerializer();
			var sXML = oSerializer.serializeToString(doc);
			//Se crea un archivo blob con el resultado de la transformacion y se muestra un link al usuario para descargarlo
			datos = new Blob([header,sXML], {type: 'text/xml'});
			datosXML = header + sXML;
			document.getElementById("linkDeDescarga").href =  window.URL.createObjectURL(datos);
			document.getElementById("linkDeDescarga").style.display = "BLOCK";
			document.getElementById("uploaderXML").style.display = "INLINE";
			//Tablas
			document.getElementById("infTable").style.display = "INLINE";
			document.getElementById("infBuscador").style.display = "INLINE";
			document.getElementById("referBuscador").style.display = "INLINE"
			createSelect();
			graficos();
			//createBuscador();
			
		}

		reader.readAsText(archivo.files[0],'ISO-8859-1');
	}
}

function valores(arrayOp){
	var valores = new Array();
	valores[0] = arrayOp[0]; 
	for(var i =1; i<arrayOp.length; i++){
		if(valores.indexOf(arrayOp[i]) < 0){
			valores.push(arrayOp[i]);
		}
	}
	return valores;
}

function createSelect(){

	var docTables = loadXMLString(datosXML);
	var path = "/encuesta/preguntas//pregunta";

	var nodes= docTables.evaluate(path, docTables, null, XPathResult.ANY_TYPE, null);
	var result = nodes.iterateNext();
	var i = 0;
	select = document.getElementById('campo');
	while (result){	  	
	  	var opt = document.createElement('option');
    	opt.value = result.getAttributeNode("tag").nodeValue;
    	opt.innerHTML = result.childNodes[0].nodeValue;
    	select.appendChild(opt);
    	result=nodes.iterateNext();
    	i++;
	}
}
function makeTable(iLength, jLength, arrayTable,arrayPreguntas,arrayCampus){
	var table = document.getElementById("miTabla")
	table.innerHTML = ""
	document.getElementById("contTable").style.display = "INLINE";
	document.getElementById("tablas").style.height = "auto";
	for(var i=0;i<iLength+1;i++){
		var row = table.insertRow(i);
		if(i!=0){
			for(var j=0;j<jLength+1;j++){
				if(j!=0){
					var cell = row.insertCell(j);
					cell.innerHTML = arrayTable[(j-1)+(i-1)*jLength];
				}
				else{
					var cell = row.insertCell(j);
					cell.innerHTML = arrayPreguntas[i-1];
				}
			}
		}
		else{
			for(var j=0;j<jLength+1;j++){
				if(j!=0){
					var cell = row.insertCell(j);
					cell.innerHTML = arrayCampus[j-1];
				}
				else{
					var cell = row.insertCell(j);
					cell.innerHTML = " ";
				}

			}
		}

	}
}


function createTable(){
	var docTables = loadXMLString(datosXML);
	var index = document.getElementById("campo");
	var preguntaPath = index.options[index.selectedIndex].value;
	//HACERLO para cada wea menos campus

	var pathPregunta = "/encuesta/sansanos/sansano//respuesta[@tag='"+preguntaPath+"']";
	var nodes = docTables.evaluate(pathPregunta, docTables, null, XPathResult.ANY_TYPE, null);
	var result = nodes.iterateNext();

	var arrayResultPreguntas = new Array();
	while (result){
		arrayResultPreguntas.push(result.childNodes[0].nodeValue);
		result=nodes.iterateNext();
	}
	var arrayPreguntas = valores(arrayResultPreguntas);

	var pathCampus = "/encuesta/sansanos/sansano/datos/respuesta[@tag='pregrado']";
	var nodes = docTables.evaluate(pathCampus, docTables, null, XPathResult.ANY_TYPE, null);
	var result =nodes.iterateNext();
	var arrayResultCampus = new Array();
	while (result){
	  	arrayResultCampus.push(result.childNodes[0].nodeValue);
	  	result = nodes.iterateNext();
	}
	var arrayCampus = valores(arrayResultCampus);

	var arrayList = new Array(arrayCampus.length*arrayPreguntas.length);

	for(var k = 0; k<arrayCampus.length*arrayPreguntas.length;k++){
		arrayList[k]=0;
	}

	var i=0,j=0;
	for(var k=0; k<arrayResultPreguntas.length;k++){
		i = arrayCampus.indexOf(arrayResultCampus[k]);
		j = arrayPreguntas.indexOf(arrayResultPreguntas[k]);
		if(i >= 0 && j >= 0){
			arrayList[i + j*arrayCampus.length]++;
		}
	}
	makeTable(arrayPreguntas.length,arrayCampus.length,arrayList,arrayPreguntas,arrayCampus);
	arrayResultPreguntas = null;
	arrayResultCampus = null;
}

function addField(){
	var docTables = loadXMLString(datosXML);
	var path = "/encuesta/preguntas//pregunta";
	var nodes = docTables.evaluate(path, docTables, null, XPathResult.ANY_TYPE, null);
	var result = nodes.iterateNext();
	var i = 0;
	campoBuscador = document.createElement('div');
	select = document.createElement('select');
	select.setAttribute("id",'criterio');
	while (result){	  	
	  	var opt = document.createElement('option');
    	opt.value = result.getAttributeNode("tag").nodeValue;
    	if(i>=9 && i<20){
    		opt.innerHTML = cleanUni(result.childNodes[0].nodeValue);
    	}
    	else if(i>=43 && i<69){
    		if(i!=61){
    			opt.innerHTML = cleanUni(result.childNodes[0].nodeValue);
    		}
    		else{
    			opt.innerHTML = cleanUni(result.childNodes[0].nodeValue).substring(0,30);
    		}
    	}
    	else{
    		opt.innerHTML = result.childNodes[0].nodeValue;
    	}
    	
    	select.appendChild(opt);
    	result=nodes.iterateNext();
    	i++;
	}
	return campoBuscador.appendChild(select);
}

function addInput(){
	var input = document.createElement('input');
	input.setAttribute("id",'inp');

	return input;
}

function addOper(contador){
	if(contador < 3){
		var oper = document.createElement('select');
		oper.setAttribute("id",'oper');
		var yOper = document.createElement('option');
		yOper.setAttribute("value","0");
		yOper.innerHTML = "Y";
		var oOper = document.createElement("option");
		oOper.setAttribute("value","1");
		oOper.innerHTML = "O";
		oper.appendChild(yOper);
		oper.appendChild(oOper);
		return oper;
	}
	else{
		return null
	}
}

function createBuscador(){
	
	if(cont == 0){
		document.getElementById("botonBuscador").style.display = "INLINE";
	}

	if(cont < 3){
		var buscador = document.getElementById("infBuscador");
		buscador.appendChild(addField());
		buscador.appendChild(addInput());
		cont++;
		buscador.appendChild(addOper(cont));
	}

}

function search(){
	var docTables = loadXMLString(datosXML);
	var crit = document.getElementById("criterio");
	var critPath = crit.options[crit.selectedIndex].value;
	var field = document.getElementById("inp");
	var fieldPath = field.value;
	var oper = document.getElementById("oper");
	var operPath = oper.options[oper.selectedIndex].value;

	if(cont == 1){
		var preguntaPath = critPath + fieldPath + operPath
		var pathBuscador = "/encuesta/sansanos/sansano[respuesta='"+fieldPath+"']"
		//respuesta[@tag='"+critPath+"']";
		var nodes = docTables.evaluate(pathBuscador, docTables, null, XPathResult.ANY_TYPE, null);
		printResults(nodes);
	}
}

function printResults(nodes){
	var result = nodes.iterateNext();
	var arrayResult = new Array();
	while (result){
		arrayResult.push(result.childNodes[0].nodeValue);
		result = nodes.iterateNext();
	}
	alert(arrayResult.toString());	

}

function loadXML(archivo){
	//Leemos el XML para obtener los datos
	//var node = doc.getElementsByTagName("opinion")[0].tagName;
	//document.getElementById("inf").innerHTML = node;
}	

//Sección Gráficos
var preguntaEstudios = new Array();
var frecuenciasPreguntaEstudios = new Array();
var preguntaRangoSueldoLiquido = new Array();
var frecuenciasPreguntaRangoSueldoLiquido = new Array();
var preguntaRemuneracionAcorde = new Array();
var frecuenciasPreguntaRemuneracionAcorde = new Array();
function graficos(){
	//Obtencion de datos para primera pregunta, "Nivel de estudios de los padres"
	//Arreglo con las opciones
	var x = loadXMLString(datosXML);
	preguntaEstudios.push('Enseñanza Media completa');
	preguntaEstudios.push('Estudios Superiores Completos');
	preguntaEstudios.push('Enseñanza Básica');
	preguntaEstudios.push('Técnico Nivel Medio');
	preguntaEstudios.push('Estudios Superiores incompletos');
	preguntaEstudios.push('Técnico Universitario');
	preguntaEstudios.push('Postgrado');
	preguntaEstudios.push('Enseñanza Media incompleta');
	//Arreglo con las frecuencias de la pregunta inicializadas en cero
	for(var cont = 0; cont < 8; cont++){
		frecuenciasPreguntaEstudios.push(0);
	}
	//Busqueda por pregunta
	var nodos = x.evaluate("/encuesta/sansanos/sansano/datos/respuesta[@tag='nivel']",x,null,XPathResult.ANY_TYPE,null);
	var result = nodos.iterateNext();
	while(result){
		switch(result.childNodes[0].nodeValue){
			case preguntaEstudios[0]:
				frecuenciasPreguntaEstudios[0]++;
				break;
			case preguntaEstudios[1]:
				frecuenciasPreguntaEstudios[1]++;
				break;
			case preguntaEstudios[2]:
				frecuenciasPreguntaEstudios[2]++;
				break;
			case preguntaEstudios[3]:
				frecuenciasPreguntaEstudios[3]++;
				break;
			case preguntaEstudios[4]:
				frecuenciasPreguntaEstudios[4]++;
				break;
			case preguntaEstudios[5]:
				frecuenciasPreguntaEstudios[5]++;
				break;
			case preguntaEstudios[6]:
				frecuenciasPreguntaEstudios[6]++;
				break;
			case preguntaEstudios[7]:
				frecuenciasPreguntaEstudios[7]++;
				break;
			default:
				document.write(result.childNodes[0].nodeValue);
		}
		result = nodos.iterateNext();
	}

	//Obtencion de datos para primera pregunta, "Rango de sueldo líquido"
	//Arreglo con las opciones
	preguntaRangoSueldoLiquido.push('Menos de $200.000');
	preguntaRangoSueldoLiquido.push('$200.001 - $350.000');
	preguntaRangoSueldoLiquido.push('$350.001 - $500.000');
	preguntaRangoSueldoLiquido.push('$500.001 - $750.000');
	preguntaRangoSueldoLiquido.push('$750.001 - $1.000.000');
	preguntaRangoSueldoLiquido.push('$1.000.001 - $1.250.000');
	preguntaRangoSueldoLiquido.push('$1.250.001 - $1.500.000');
	preguntaRangoSueldoLiquido.push('$1.500.001 - $2.000.000');
	preguntaRangoSueldoLiquido.push('$2.000.001 - $2.500.000');
	preguntaRangoSueldoLiquido.push('$2.500.001 - $3.000.000');
	preguntaRangoSueldoLiquido.push('Más de $3.000.000');
	//Arreglo con las frecuencias de la pregunta inicializadas en cero
	for(var cont = 0; cont < 12; cont++){
		frecuenciasPreguntaRangoSueldoLiquido.push(0);
	}
	//Busqueda por pregunta
	nodos = x.evaluate("/encuesta/sansanos/sansano/trabajo/respuesta[@tag='sueldo']",x,null,XPathResult.ANY_TYPE,null);
	result = nodos.iterateNext();
	while(result){
		//Si existe respuesta, se le asigna a la frecuencia correspondiente
		if(result.childNodes[0] != null){
			switch(result.childNodes[0].nodeValue){
				case preguntaRangoSueldoLiquido[0]:
					frecuenciasPreguntaRangoSueldoLiquido[0]++;
					break;
				case preguntaRangoSueldoLiquido[1]:
					frecuenciasPreguntaRangoSueldoLiquido[1]++;
					break;
				case preguntaRangoSueldoLiquido[2]:
					frecuenciasPreguntaRangoSueldoLiquido[2]++;
					break;
				case preguntaRangoSueldoLiquido[3]:
					frecuenciasPreguntaRangoSueldoLiquido[3]++;
					break;
				case preguntaRangoSueldoLiquido[4]:
					frecuenciasPreguntaRangoSueldoLiquido[4]++;
					break;
				case preguntaRangoSueldoLiquido[5]:
					frecuenciasPreguntaRangoSueldoLiquido[5]++;
					break;
				case preguntaRangoSueldoLiquido[6]:
					frecuenciasPreguntaRangoSueldoLiquido[6]++;
					break;
				case preguntaRangoSueldoLiquido[7]:
					frecuenciasPreguntaRangoSueldoLiquido[7]++;
					break;
				case preguntaRangoSueldoLiquido[8]:
					frecuenciasPreguntaRangoSueldoLiquido[8]++;
					break;
				case preguntaRangoSueldoLiquido[9]:
					frecuenciasPreguntaRangoSueldoLiquido[9]++;
					break;
				case preguntaRangoSueldoLiquido[10]:
					frecuenciasPreguntaRangoSueldoLiquido[10]++;
					break;
			}
		}
		result = nodos.iterateNext();
	}

	//Obtencion de datos para primera pregunta, "¿Considera que su remuneración es acorde a su preparación profesional?"
	//Arreglo con las opciones
	preguntaRemuneracionAcorde.push('Si');
	preguntaRemuneracionAcorde.push('No');
	preguntaRemuneracionAcorde.push('No Responde');
	//Arreglo con las frecuencias de la pregunta inicializadas en cero
	for(var cont = 0; cont < 3; cont++){
		frecuenciasPreguntaRemuneracionAcorde.push(0);
	}
	//Busqueda por pregunta
	nodos = x.evaluate("/encuesta/sansanos/sansano/trabajo/respuesta[@tag='sueldoActual']",x,null,XPathResult.ANY_TYPE,null);
	result = nodos.iterateNext();
	while(result){
		//Si existe respuesta, se le asigna a la frecuencia correspondiente
		if(result.childNodes[0] != null){
			switch(result.childNodes[0].nodeValue){
				case preguntaRemuneracionAcorde[0]:
					frecuenciasPreguntaRemuneracionAcorde[0]++;
					break;
				case preguntaRemuneracionAcorde[1]:
					frecuenciasPreguntaRemuneracionAcorde[1]++;
					break;
			}
		}else{
			frecuenciasPreguntaRemuneracionAcorde[2]++;
		}
		result = nodos.iterateNext();
	}

	//Google Chart, copiado directamente de: "https://google-developers.appspot.com/chart/interactive/docs/quick_start"

	//Load con callback para hacerlo dinámico
	google.load('visualization', '1.0', {'packages':['corechart'], "callback":drawCharts});

	function drawCharts(){
		drawChart1();
		drawChart2();
		drawChart3();
	}

	function drawChart1() {
	  // Create the data table.
	  var data = new google.visualization.DataTable();
	  data.addColumn('string', 'Topping');
	  data.addColumn('number', 'Frecuencia');
	  data.addRows([
	    [preguntaEstudios[0],frecuenciasPreguntaEstudios[0]],
	    [preguntaEstudios[1],frecuenciasPreguntaEstudios[1]],
	    [preguntaEstudios[2],frecuenciasPreguntaEstudios[2]],
	    [preguntaEstudios[3],frecuenciasPreguntaEstudios[3]],
	    [preguntaEstudios[4],frecuenciasPreguntaEstudios[4]],
	    [preguntaEstudios[5],frecuenciasPreguntaEstudios[5]],
	    [preguntaEstudios[6],frecuenciasPreguntaEstudios[6]]
	  ]);

	  // Set chart options
	  var options = {'title':'Nivel de estudios de los Padres',
	                 'width':320,
	                 'height':240};

	  // Instantiate and draw our chart, passing in some options.
	  var chart1 = new google.visualization.PieChart(document.getElementById('graficoEstudiosPadres'));
	  chart1.draw(data, options);
	}

	function drawChart2() {

	  // Create the data table.
	  var data = new google.visualization.DataTable();
	  data.addColumn('string', 'Topping');
	  data.addColumn('number', 'Rango');
	  data.addRows([
	    [preguntaRangoSueldoLiquido[0],frecuenciasPreguntaRangoSueldoLiquido[0]],
	    [preguntaRangoSueldoLiquido[1],frecuenciasPreguntaRangoSueldoLiquido[1]],
	    [preguntaRangoSueldoLiquido[2],frecuenciasPreguntaRangoSueldoLiquido[2]],
	    [preguntaRangoSueldoLiquido[3],frecuenciasPreguntaRangoSueldoLiquido[3]],
	    [preguntaRangoSueldoLiquido[4],frecuenciasPreguntaRangoSueldoLiquido[4]],
	    [preguntaRangoSueldoLiquido[5],frecuenciasPreguntaRangoSueldoLiquido[5]],
	    [preguntaRangoSueldoLiquido[6],frecuenciasPreguntaRangoSueldoLiquido[6]],
	    [preguntaRangoSueldoLiquido[7],frecuenciasPreguntaRangoSueldoLiquido[7]],
	    [preguntaRangoSueldoLiquido[8],frecuenciasPreguntaRangoSueldoLiquido[8]],
	    [preguntaRangoSueldoLiquido[9],frecuenciasPreguntaRangoSueldoLiquido[9]],
	    [preguntaRangoSueldoLiquido[10],frecuenciasPreguntaRangoSueldoLiquido[10]],
	    [preguntaRangoSueldoLiquido[11],frecuenciasPreguntaRangoSueldoLiquido[11]]
	  ]);

	  // Set chart options
	  var options = {'title':'Rango de sueldo Líquido',
	                 'width':320,
	                 'height':240};

	  // Instantiate and draw our chart, passing in some options.
	  var chart2 = new google.visualization.BarChart(document.getElementById('graficoSueldo'));
	  chart2.draw(data, options);
	}

	function drawChart3() {

	  // Create the data table.
	  var data = new google.visualization.DataTable();
	  data.addColumn('string', 'Topping');
	  data.addColumn('number', 'Remuneración Acorde');
	  data.addRows([
	    [preguntaRemuneracionAcorde[0],frecuenciasPreguntaRemuneracionAcorde[0]],
	    [preguntaRemuneracionAcorde[1],frecuenciasPreguntaRemuneracionAcorde[1]],
	    [preguntaRemuneracionAcorde[2],frecuenciasPreguntaRemuneracionAcorde[2]]
	  ]);

	  // Set chart options
	  var options = {'title':'¿Considera que su remuneración es acorde a su preparación profesional?',
	                 'width':320,
	                 'height':240};

	  // Instantiate and draw our chart, passing in some options.
	  var chart3 = new google.visualization.PieChart(document.getElementById('graficoRemuneracionAcorde'));
	  chart3.draw(data, options);
	}
}