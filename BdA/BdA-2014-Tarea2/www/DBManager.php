<?php
class DBManager{
	var $con;
	var $resultado;
	//Conecta con la base de datos
	function conectar(){
		//Variables de conexión
		$host = 'localhost';
		$puerto = 5432;
		$nombredb = 'postgis_21_sample';
		$usuario = 'postgres';
		$password = 'bda123';
		$this->con = pg_connect("host=$host port=$puerto dbname=$nombredb user=$usuario password=$password") or die ("Error de conexion.". pg_last_error());;
		if($this->con){
			return true;
		}else{
			return false;
		}
	}

	//Obtiene el estacionamiento más cercano respecto a las coordenadas x e y
	function getEstacionamientoCercano($x,$y){
		//Se obtienen todos los estacionamientos y se busca uno a uno el más cercano.
		$this->resultado = pg_query($this->con,"SELECT ST_DISTANCE_SPHERE(estacionamientos.geom, ST_GEOMFROMTEXT('POINT($x $y)', 4326)) as distancia,estacionamientos.id,ST_AsText(estacionamientos.geom) as pos from estacionamientos;");
		$distancia=-1;
		$estacionamiento = -1;
		$lon;
		$lat;
		while($linea = $this->getLinea()){
			if($distancia == -1 || $linea['distancia'] < $distancia){
				$distancia = $linea['distancia'];
				$estacionamiento = $linea['id'];
				$pos = str_replace(")","",str_replace("MULTIPOINT(","",$linea['pos']));
				$lon = explode(" ",$pos)[0];
				$lat = explode(" ",$pos)[1];
			}
		}
		return $distancia."=_=".$estacionamiento."=_=".$lon."=_=".$lat;
	}

	//Se buscan todos los estacionamientos que están fuera de la universidad.
	function getEstacionamientosFuera(){
		$this->resultado = pg_query($this->con,"SELECT estacionamientos.id as id,ST_AsText(estacionamientos.geom) as pos FROM estacionamientos, base WHERE NOT ST_CONTAINS(base.geom,estacionamientos.geom) and base.id = 1");	
	}

	//Se buscan todos los estacionamientos asociados a un edificio.
	function getEstacionamientosEdificio($x,$y){
		$this->resultado = pg_query($this->con,"SELECT edificios.id AS id,edificios.nombre FROM edificios WHERE ST_CONTAINS(edificios.geom, ST_GeomFromText('POINT($x $y)', 4326));");
		$linea = $this->getLinea();
		$edificio;
		if($linea){
			$edificio = $linea['nombre'];
			$this->resultado = pg_query($this->con,"SELECT ST_AsText(estacionamientos.geom) as pos FROM estacionamientos WHERE estacionamientos.edif = ".$linea['id'].";");
			return $edificio;
		}else{
			return false;
		}
	}

	//Se buscan todos los estacionamientos en un radio
	function getEstacionamientosRadio($x,$y){
		$this->resultado = pg_query($this->con,"SELECT ST_AsText(estacionamientos.geom) as pos FROM estacionamientos WHERE ST_DISTANCE_SPHERE(estacionamientos.geom, ST_GEOMFROMTEXT('POINT($x $y)', 4326)) <= 30 AND estacionamientos.Reservado = 1");
	}

	//Se buscan los edificios que tienen estacionamientos grandes asocaidos
	function getEdificioEstacionamientosGrandes(){
		$this->resultado = pg_query($this->con,"SELECT edificios.nombre,ST_AsText(ST_CENTROID(edificios.geom)) as edificioPos,ST_AsText(estacionamientos.geom) as estacionamientoPos FROM estacionamientos, edificios WHERE estacionamientos.tamanio = 2 AND estacionamientos.edif = edificios.id");	
	}

	//Se buscan los estacionamientos cerca de la calle principal interna
	function getEstacionamientosInternos(){
		$this->resultado = pg_query($this->con,"SELECT ST_AsText(estacionamientos.geom) AS pos FROM estacionamientos,calle WHERE ST_DISTANCE_SPHERE(estacionamientos.geom,calle.geom) <= 5 AND calle.id = 1");
	}

	//Se buscan los estacionamientos por sub calle
	function getCalleMasEstacionamientos(){
		//Primero se buscan todas las sub-calles
		$this->resultado = pg_query($this->con,"SELECT id FROM calle");
		$subcalles = array();
		while($linea = $this->getLinea()){
			array_push($subcalles,$linea['id']);
		}
		//Variables que guardan la calle con más estacionamientos
		$arreglocallemayor = array();
		//Por cada sub-calle se busca los estacionamientos asociados
		for($i = 0;$i < sizeof($subcalles);$i++){
			$this->resultado = pg_query($this->con,"SELECT ST_AsText(estacionamientos.geom) AS pos FROM estacionamientos WHERE estacionamientos.calle = ".$subcalles[$i]);
			$arregloauxiliar = array();
			while($linea = $this->getLinea()){
				$pos = str_replace(")","",str_replace("MULTIPOINT(","",$linea['pos']));
				$lon = explode(" ",$pos)[0];
				$lat = explode(" ",$pos)[1];
				array_push($arregloauxiliar,$subcalles[$i]."=_=".$lon."=_=".$lat."<br>");
			}
			//Se verifica si la sub-calle analizada resulta ser la con mayor estacionamientos
			if(sizeof($arregloauxiliar)>sizeof($arreglocallemayor)){
				$arreglocallemayor = $arregloauxiliar;
			}
		}
		return $arreglocallemayor;
	}

	//Leer línea
	function getLinea(){
		$linea = pg_fetch_assoc($this->resultado);
		return $linea;
	}
}
?>