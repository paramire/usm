<?php 
	require("DBManager.php");
	$db = new DBManager;
	if(!$db->conectar()){
		echo 'Error al conectar a la base de datos';
		return;	
	}
	//Obtener nombre del edificio
	if($_GET['accion']=="getEstacionamientoCercano"){
		echo $db->getEstacionamientoCercano($_GET['x'],$_GET['y']);
	}
	//Se obtienen todos los estacionamientos fuera de la universidad
	if($_GET['accion']=="getEstacionamientosFuera"){
		$db->getEstacionamientosFuera();
		//Uno a uno se genera el documento de respuesta
		while($linea = $db->getLinea()){
			$pos = str_replace(")","",str_replace("MULTIPOINT(","",$linea['pos']));
			$lon = explode(" ",$pos)[0];
			$lat = explode(" ",$pos)[1];
			echo $linea['id']."=_=".$lon."=_=".$lat."<br>";
		}
	}
	//Se obtienen los estacionamientos asociados a un edificio
	if($_GET['accion']=="getEstacionamientosEdificio"){
		$edificio = $db->getEstacionamientosEdificio($_GET['x'],$_GET['y']);
		while($linea = $db->getLinea()){
			$pos = str_replace(")","",str_replace("MULTIPOINT(","",$linea['pos']));
			$lon = explode(" ",$pos)[0];
			$lat = explode(" ",$pos)[1];
			echo $edificio."=_=".$lon."=_=".$lat."<br>";
		}
	}
	//Se obtienen los estacionamientos en un radio
	if($_GET['accion']=="getEstacionamientosRadio"){
		$db->getEstacionamientosRadio($_GET['x'],$_GET['y']);
		while($linea = $db->getLinea()){
			$pos = str_replace(")","",str_replace("MULTIPOINT(","",$linea['pos']));
			$lon = explode(" ",$pos)[0];
			$lat = explode(" ",$pos)[1];
			echo $lon."=_=".$lat."<br>";
		}
	}
	//
	if($_GET['accion']=="getEdificioEstacionamientosGrandes"){
		$db->getEdificioEstacionamientosGrandes();
		//Uno a uno se genera el documento de respuesta
		$arreglo = array();
		while($linea = $db->getLinea()){
			$Edifpos = str_replace(")","",str_replace("POINT(","",$linea['edificiopos']));
			$lonEdif = explode(" ",$Edifpos)[0];
			$latEdif = explode(" ",$Edifpos)[1];
			$Estapos = str_replace(")","",str_replace("MULTIPOINT(","",$linea['estacionamientopos']));
			$lonEsta = explode(" ",$Estapos)[0];
			$latEsta = explode(" ",$Estapos)[1];
			array_push($arreglo,$linea['nombre']."=_=".$lonEdif."=_=".$latEdif."=_=".$lonEsta."=_=".$latEsta."<br>");
		}
		//Se cuentan las frecuencias para determinar al edificio con más estacionamientos grandes.
		$arregloAux = array();
		for($i = 0; $i < sizeof($arreglo); $i++){
			if(!isset($arregloAux[explode("=_=",$arreglo[$i])[0]])){
				$arregloAux[explode("=_=",$arreglo[$i])[0]]=0;
			}
			$arregloAux[explode("=_=",$arreglo[$i])[0]]++;
		}
		$keys = array_keys($arregloAux);
		$frec=0;
		$mayor;
		for($i=0;$i < sizeof($keys);$i++){
			if($arregloAux[$keys[$i]] > $frec){
				$frec = $arregloAux[$keys[$i]];
				$mayor = $keys[$i];
			}
		}
		//Una vez obtenido el edificio con mayor estacionamientos grandes, se muestra por pantalla.
		for($i=0;$i < sizeof($arreglo);$i++){
			$datos = explode("=_=",$arreglo[$i]);
			if($datos[0]==$mayor){
				echo $datos[0]."=_=".$datos[1]."=_=".$datos[2]."=_=".$datos[3]."=_=".$datos[4];
			}
		}
	}
	//Se obtienen todos los estacionamientos cerca de la calle principal interna
	if($_GET['accion']=="getEstacionamientosInternos"){
		$db->getEstacionamientosInternos();
		//Uno a uno se genera el documento de respuesta
		while($linea = $db->getLinea()){
			$pos = str_replace(")","",str_replace("MULTIPOINT(","",$linea['pos']));
			$lon = explode(" ",$pos)[0];
			$lat = explode(" ",$pos)[1];
			echo $lon."=_=".$lat."<br>";
		}
	}
	//Se obtienen todos los estacionamientos cerca de la calle principal interna
	if($_GET['accion']=="getCalleMasEstacionamientos"){
		$arreglo = $db->getCalleMasEstacionamientos();
		for($i=0;$i < sizeof($arreglo);$i++){
			echo $arreglo[$i];
		}
	}
?>