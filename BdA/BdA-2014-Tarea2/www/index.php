<html>

<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<script type="text/javascript" src="./jquery-2.1.1.min.js"></script>
<script type="text/javascript" src="./bootstrap/js/bootstrap.min.js"></script>
<link href="./bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css">
<script type="text/javascript" src="./openlayers/OpenLayers.js"></script>

<script type="text/javascript" src="funciones.js"></script>

</head>
<body onload="init()" style="background: #000000">
	<div class="container">
		<div class="row">
			<div class="col-md-12 well">
				<center>
					<h1>Tarea 2 - BDA</h1>
				</center>
			</div>
		</div>
		<div class="row">
			<div class="col-md-6 well">
				<div id="map" class="col-md-12"></div>
			</div>
			<div class="col-md-6 well">
				<div class="row col-md-12">
					<center>
						<h2>Consultas</h2>
					</center>
				</div>
				<div class="row col-md-12 well">
					<center>
						<button id="consulta1" class="btn btn-primary">Estacionamiento más cercano al punto</button>
						<br>
						<br>
						<span id="labelconsulta1" class="label label-warning"></span>
					</center>
				</div>
				<div class="row col-md-12 well">
					<center>
						<button id="consulta2" class="btn btn-primary">Estacionamientos fuera de la Universidad</button>
						<br>
						<br>
						<span id="labelconsulta2" class="label label-warning"></span>
					</center>
				</div>
				<div class="row col-md-12 well">
					<center>
						<button id="consulta3" class="btn btn-primary">Estacionamientos por Edificio</button>
						<br>
						<br>
						<span id="labelconsulta3" class="label label-warning"></span>
					</center>
				</div>
				<div class="row col-md-12 well">
					<center>
						<button id="consulta4" class="btn btn-primary">Estacionamientos Reservados en un Radio</button>
						<br>
						<br>
						<span id="labelconsulta4" class="label label-warning"></span>
					</center>
				</div>
				<div class="row col-md-12 well">
					<center>
						<button id="consulta5" class="btn btn-primary">Edificio con más Estacionamientos Grandes</button>
						<br>
						<br>
						<span id="labelconsulta5" class="label label-warning"></span>
					</center>
				</div>
				<div class="row col-md-12 well">
					<center>
						<button id="consulta6" class="btn btn-primary">Estacionamientos Cerca de la Calle Interna</button>
						<br>
						<br>
						<span id="labelconsulta6" class="label label-warning"></span>
					</center>
				</div>
				<div class="row col-md-12 well">
					<center>
						<button id="consulta7" class="btn btn-primary">Sub-Calle con más estacionamientos</button>
						<br>
						<br>
						<span id="labelconsulta7" class="label label-warning"></span>
					</center>
				</div>
			</div>
		</row>
	</div>
</body>