//Funciones respecto al mapa
var map;
var mouse;
var markers;
function init() {
	//Opciones del mapa
	var limites = new OpenLayers.Bounds(-71.8425687780256, -33.9544980306097,-69.9769349572885, -32.0205669052588);
	var opciones = {
					maxExtent: limites,
					maxResolution: 0.007554418458402,
					projection: "EPSG:4326",
					units: 'degrees'
	                };
	map = new OpenLayers.Map('map',opciones);
	mouse = new OpenLayers.Control.MousePosition({
						prefix: 'Coordenadas: ',
						separator: ' | ',
						numDigits: 7,
						emptyString: ''
						});
	map.addControl(mouse);
	//Capas
	var provincia = new OpenLayers.Layer.WMS("Provincia","http://localhost:8080/geoserver/BDA2/wms",{layers: 'BDA2:provincia'});
	var base = new OpenLayers.Layer.WMS("Base","http://localhost:8080/geoserver/BDA2/wms",{layers: 'BDA2:base',transparent: "true"});
	var edificios = new OpenLayers.Layer.WMS("Edificios","http://localhost:8080/geoserver/BDA2/wms",{layers: 'BDA2:edificios',transparent: "true"});
	var calle = new OpenLayers.Layer.WMS("Calles","http://localhost:8080/geoserver/BDA2/wms",{layers: 'BDA2:calle',transparent: "true"});
	var estacionamientos = new OpenLayers.Layer.WMS("Estacionamientos","http://localhost:8080/geoserver/BDA2/wms",{layers: 'BDA2:estacionamientos',transparent: "true"});
	map.addLayers([provincia,base,edificios,calle,estacionamientos]);
	markers = new OpenLayers.Layer.Markers( "Markers" );
	map.addLayer(markers);
	map.zoomToMaxExtent();
	//Función al momento de hacer click
	map.events.register("click", map, function(e){
		var lonlat = map.getLonLatFromViewPortPx(mouse.lastXy);
		doAction(lonlat.lon,lonlat.lat);
	});
}

//Funciones respecto a las consultas
var consulta = 0;
$(document).ready(function(){
	$("#consulta1").click(function(){
		resetConsultas();
		consulta = 1;
		$(this).removeClass("btn-primary").addClass("btn-warning");
		$("#labelconsulta1").text("Haga click en el mapa");
	});
	$("#consulta2").click(function(){
		resetConsultas();
		consulta = 2;
		$(this).removeClass("btn-primary").addClass("btn-warning");
		doAction(0,0);
	});
	$("#consulta3").click(function(){
		resetConsultas();
		consulta = 3;
		$(this).removeClass("btn-primary").addClass("btn-warning");
		$("#labelconsulta3").text("Haga click en el edificio a buscar");
	});
	$("#consulta4").click(function(){
		resetConsultas();
		consulta = 4;
		$(this).removeClass("btn-primary").addClass("btn-warning");
		$("#labelconsulta4").text("Haga click en el mapa");
	});
	$("#consulta5").click(function(){
		resetConsultas();
		consulta = 5;
		$(this).removeClass("btn-primary").addClass("btn-warning");
		$("#labelconsulta5").text("Calculando...");
		doAction(0,0);
	});
	$("#consulta6").click(function(){
		resetConsultas();
		consulta = 6;
		$(this).removeClass("btn-primary").addClass("btn-warning");
		$("#labelconsulta6").text("Calculando...");
		doAction(0,0);
	});
	$("#consulta7").click(function(){
		resetConsultas();
		consulta = 7;
		$(this).removeClass("btn-primary").addClass("btn-warning");
		$("#labelconsulta7").text("Calculando...");
		doAction(0,0);
	});
});

//En caso de llamar a una consulta sin haber terminado otra previa;
function resetConsultas(){
	for(var cont=1; cont<8; cont++){
		consulta = 0;
		$("#consulta"+cont).removeClass("btn-warning").addClass("btn-primary");
		$("#labelconsulta"+cont).text("");
	}
}

//Funcion llamada al hacer click en el mapa con los parametros de posición del click.
function doAction(x,y){
	//Consulta sobre el estacionamiento más cercano al punto que se le hizo click.
	if(consulta==1){
		$.ajax({
			url: "datos.php?accion=getEstacionamientoCercano&x="+x+"&y="+y,
			success: function(datos,status,algo){
				var aux = datos.split("=_=");
				//Se crea el marcador sobre el punto y se actualiza la información del label.
				$("#labelconsulta1").text("ID Estacionamiento: "+aux[1]+" - Distancia: "+aux[0]+" metros");
				markers.clearMarkers();
				markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(aux[2],aux[3]),new OpenLayers.Icon('marker.png', new OpenLayers.Size(21,25), new OpenLayers.Pixel(-(10.5), -12.5))));
			}
		});
		consulta = 0;
		$("#consulta1").removeClass("btn-warning").addClass("btn-primary");
	}
	//Consulta sobre los estacionamientos fuera de la universidad.
	if(consulta==2){
		$.ajax({
			url: "datos.php?accion=getEstacionamientosFuera",
			success: function(datos,status,algo){
				var lineas = datos.split("<br>");
				var total = lineas.length -1;
				//Por cada linea, que corresponde a un estacionamiento, se crea un marcador en el mapa.
				$("#labelconsulta2").text("Hay un total de "+total+" estacionamientos fuera de la universidad");
				$("#consulta2").removeClass("btn-warning").addClass("btn-primary");
				markers.clearMarkers();
				var icon = new OpenLayers.Icon('marker.png', new OpenLayers.Size(21,25), new OpenLayers.Pixel(-(10.5), -12.5));
				for(var cont = 0; cont < lineas.length; cont++){
					var aux = lineas[cont].split("=_=");
					//Se crea el marcador sobre el punto y se actualiza la información del label.
					markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(aux[1],aux[2]),icon.clone()));
				}
			}
		});
		consulta = 0;
		$("#consulta5").removeClass("btn-warning").addClass("btn-primary");
	}
	//Consulta por los estacionamientos asociados a un edificio
	if(consulta==3){
		$.ajax({
			url: "datos.php?accion=getEstacionamientosEdificio&x="+x+"&y="+y,
			success: function(datos,status,algo){
				var lineas = datos.split("<br>");
				var total = lineas.length -1;
				if(total > 0){
					//Por cada linea, que corresponde a un estacionamiento, se crea un marcador en el mapa.
					$("#labelconsulta3").text("Hay un total de "+total+" estacionamientos asociados al edificio "+lineas[0].split("=_=")[0]);
					$("#consulta3").removeClass("btn-warning").addClass("btn-primary");
					markers.clearMarkers();
					var icon = new OpenLayers.Icon('marker.png', new OpenLayers.Size(21,25), new OpenLayers.Pixel(-(10.5), -12.5));
					for(var cont = 0; cont < lineas.length; cont++){
						var aux = lineas[cont].split("=_=");
						//Se crea el marcador sobre el punto y se actualiza la información del label.
						markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(aux[1],aux[2]),icon.clone()));
					}
				}else{
					$("#labelconsulta3").text("No se han encontrado estacionamientos asociados");
				}
			}
		});
		consulta = 0;
		$("#consulta3").removeClass("btn-warning").addClass("btn-primary");
	}
	//Consulta por los estacionamientos asociados a un edificio
	if(consulta==4){
		$.ajax({
			url: "datos.php?accion=getEstacionamientosRadio&x="+x+"&y="+y,
			success: function(datos,status,algo){
				var lineas = datos.split("<br>");
				var total = lineas.length -1;
				if(total >= 0){
					//Por cada linea, que corresponde a un estacionamiento, se crea un marcador en el mapa.
					$("#labelconsulta4").text("Hay un total de "+total+" estacionamientos en un radio de 30 metros");
					$("#consulta4").removeClass("btn-warning").addClass("btn-primary");
					markers.clearMarkers();
					var icon = new OpenLayers.Icon('marker.png', new OpenLayers.Size(21,25), new OpenLayers.Pixel(-(10.5), -12.5));
					for(var cont = 0; cont < lineas.length; cont++){
						var aux = lineas[cont].split("=_=");
						//Se crea el marcador sobre el punto y se actualiza la información del label.
						markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(aux[0],aux[1]),icon.clone()));
					}
				}else{
					$("#labelconsulta4").text("No se han encontrado estacionamientos en el radio");
				}
			}
		});
		consulta = 0;
		$("#consulta4").removeClass("btn-warning").addClass("btn-primary");
	}
	if(consulta==5){
		$.ajax({
			url: "datos.php?accion=getEdificioEstacionamientosGrandes",
			success: function(datos,status,algo){
				var lineas = datos.split("<br>");
				var total = lineas.length -1;
				//Por cada linea, que corresponde a un estacionamiento, se crea un marcador en el mapa.
				$("#labelconsulta5").text("El edificio con más estacionamientos grandes es el edificio "+lineas[0].split("=_=")[0]+" con "+total+" estacionamientos.");
				$("#consulta5").removeClass("btn-warning").addClass("btn-primary");
				markers.clearMarkers();
				var icon = new OpenLayers.Icon('marker.png', new OpenLayers.Size(21,25), new OpenLayers.Pixel(-(10.5), -12.5));
				for(var cont = 0; cont < lineas.length; cont++){
					var aux = lineas[cont].split("=_=");
					//Se crea el marcador sobre el punto y se actualiza la información del label.
					//La primera iteracion se agrega el marcador sobre el edificio en cuestion.
					if(cont==0){
						markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(aux[1],aux[2]),icon.clone()));
					}
					markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(aux[3],aux[4]),icon.clone()));
				}
			}
		});
		consulta = 0;
		$("#consulta5").removeClass("btn-warning").addClass("btn-primary");
	}
	//Consulta sobre los estacionamientos fuera de la universidad.
	if(consulta==6){
		$.ajax({
			url: "datos.php?accion=getEstacionamientosInternos",
			success: function(datos,status,algo){
				var lineas = datos.split("<br>");
				var total = lineas.length -1;
				//Por cada linea, que corresponde a un estacionamiento, se crea un marcador en el mapa.
				$("#labelconsulta6").text("Hay un total de "+total+" estacionamientos cerca de la calle principal interna");
				$("#consulta6").removeClass("btn-warning").addClass("btn-primary");
				markers.clearMarkers();
				var icon = new OpenLayers.Icon('marker.png', new OpenLayers.Size(21,25), new OpenLayers.Pixel(-(10.5), -12.5));
				for(var cont = 0; cont < lineas.length; cont++){
					var aux = lineas[cont].split("=_=");
					//Se crea el marcador sobre el punto y se actualiza la información del label.
					markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(aux[0],aux[1]),icon.clone()));
				}
			}
		});
		consulta = 0;
		$("#consulta6").removeClass("btn-warning").addClass("btn-primary");
	}
	if(consulta==7){
		$.ajax({
			url: "datos.php?accion=getCalleMasEstacionamientos",
			success: function(datos,status,algo){
				var lineas = datos.split("<br>");
				var total = lineas.length -1;
				//Por cada linea, que corresponde a un estacionamiento, se crea un marcador en el mapa.
				$("#labelconsulta7").text("La sub-calle con más estacionamientos es la calle con ID: "+lineas[0].split("=_=")[0]+" con "+total+" estacionamientos.");
				$("#consulta7").removeClass("btn-warning").addClass("btn-primary");
				markers.clearMarkers();
				var icon = new OpenLayers.Icon('marker.png', new OpenLayers.Size(21,25), new OpenLayers.Pixel(-(10.5), -12.5));
				for(var cont = 0; cont < lineas.length; cont++){
					var aux = lineas[cont].split("=_=");
					//Se crea el marcador sobre el punto y se actualiza la información del label.
					markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(aux[1],aux[2]),icon.clone()));
				}
			}
		});
		consulta = 0;
		$("#consulta7").removeClass("btn-warning").addClass("btn-primary");
	}
}