"use strict";

var CLASE_OCULTO_RANKING = "oculto";
var ID_MODAL_RESULTADO_RANKING = "modalResultado";
var ID_BOTON_RANKING = "botonRanking";
var ID_MODAL_RANKING = "modalRanking";
var ID_CONTENIDO_RANKING = "contenidoRanking";
var ID_BOTON_CERRAR_RANKING = "botonCerrarRanking";
var ID_BOTON_BORRAR_RANKING = "botonBorrarRanking";
var ID_MODAL_CONFIRMAR_RANKING = "modalConfirmarRanking";
var ID_BOTON_CONFIRMAR_BORRADO_RANKING = "botonConfirmarBorradoRanking";
var ID_BOTON_CANCELAR_BORRADO_RANKING = "botonCancelarBorradoRanking";
var ultimaFirmaResultadoRanking = "";

function obtenerTextoResultado(idElemento) {
  var elemento;

  elemento = document.getElementById(idElemento);

  if (elemento === null) {
    return "";
  }

  return elemento.textContent.trim();
}

function ordenarRankingPorPuntaje(ranking) {
  ranking.sort(function (partidaA, partidaB) {
    return partidaB.puntaje - partidaA.puntaje;
  });

  return ranking;
}

function crearFirmaResultado(partida) {
  return partida.nombre + "|" + partida.puntaje + "|" + partida.nivel + "|" +
    partida.intentos + "|" + partida.errores + "|" + partida.duracion;
}

function crearPartidaDesdeResultado() {
  var partida;

  partida = {
    nombre: obtenerTextoResultado("resultadoNombre"),
    puntaje: parseInt(obtenerTextoResultado("resultadoPuntaje"), 10),
    nivel: obtenerTextoResultado("resultadoNivel"),
    intentos: parseInt(obtenerTextoResultado("resultadoIntentos"), 10),
    errores: parseInt(obtenerTextoResultado("resultadoErrores"), 10),
    fechaHora: new Date().toLocaleString("es-AR"),
    duracion: obtenerTextoResultado("resultadoTiempo")
  };

  if (isNaN(partida.puntaje) === true) {
    partida.puntaje = 0;
  }

  if (isNaN(partida.intentos) === true) {
    partida.intentos = 0;
  }

  if (isNaN(partida.errores) === true) {
    partida.errores = 0;
  }

  return partida;
}

function guardarResultadoPartida() {
  var ranking;
  var partida;
  var firmaResultado;

  partida = crearPartidaDesdeResultado();
  firmaResultado = crearFirmaResultado(partida);

  if (partida.nombre === "" || firmaResultado === ultimaFirmaResultadoRanking) {
    return;
  }

  ranking = obtenerRankingGuardado();
  ranking.push(partida);
  guardarRanking(ranking);

  ultimaFirmaResultadoRanking = firmaResultado;
}

function crearElementoTexto(etiqueta, valor) {
  var parrafo;
  var textoValor;

  parrafo = document.createElement("p");
  parrafo.className = "modal-item";
  textoValor = document.createElement("span");

  parrafo.appendChild(document.createTextNode(etiqueta + ": "));
  textoValor.textContent = valor;
  parrafo.appendChild(textoValor);

  return parrafo;
}

function limpiarContenidoRanking() {
  var contenidoRanking;

  contenidoRanking = document.getElementById(ID_CONTENIDO_RANKING);

  if (contenidoRanking !== null) {
    contenidoRanking.innerHTML = "";
  }

  return contenidoRanking;
}

function mostrarRankingVacio(contenidoRanking) {
  var mensaje;

  mensaje = document.createElement("p");
  mensaje.className = "modal-item";
  mensaje.textContent = "Todavia no hay partidas guardadas.";

  contenidoRanking.appendChild(mensaje);
}

function agregarPartidaAlRanking(contenidoRanking, partida, posicion) {
  var item;

  item = document.createElement("li");
  item.className = "modal-item";

  item.appendChild(crearElementoTexto("Puesto", posicion));
  item.appendChild(crearElementoTexto("Entrenador", partida.nombre));
  item.appendChild(crearElementoTexto("Puntaje", partida.puntaje));
  item.appendChild(crearElementoTexto("Nivel", partida.nivel));
  item.appendChild(crearElementoTexto("Intentos", partida.intentos));
  item.appendChild(crearElementoTexto("Errores", partida.errores));
  item.appendChild(crearElementoTexto("Duracion", partida.duracion));
  item.appendChild(crearElementoTexto("Fecha y hora", partida.fechaHora));

  contenidoRanking.appendChild(item);
}

function renderizarRanking() {
  var contenidoRanking;
  var ranking;
  var i;

  contenidoRanking = limpiarContenidoRanking();

  if (contenidoRanking === null) {
    return;
  }

  ranking = ordenarRankingPorPuntaje(obtenerRankingGuardado());

  if (ranking.length === 0) {
    mostrarRankingVacio(contenidoRanking);
    return;
  }

  for (i = 0; i < ranking.length; i++) {
    agregarPartidaAlRanking(contenidoRanking, ranking[i], i + 1);
  }
}

function mostrarModalPorId(idModal) {
  var modal;

  modal = document.getElementById(idModal);

  if (modal !== null) {
    modal.classList.remove(CLASE_OCULTO_RANKING);
  }
}

function ocultarModalPorId(idModal) {
  var modal;

  modal = document.getElementById(idModal);

  if (modal !== null) {
    modal.classList.add(CLASE_OCULTO_RANKING);
  }
}

function abrirRanking() {
  renderizarRanking();
  mostrarModalPorId(ID_MODAL_RANKING);
}

function pedirConfirmacionBorradoRanking() {
  mostrarModalPorId(ID_MODAL_CONFIRMAR_RANKING);
}

function borrarHistorialRanking() {
  borrarRankingGuardado();
  ultimaFirmaResultadoRanking = "";
  ocultarModalPorId(ID_MODAL_CONFIRMAR_RANKING);
  renderizarRanking();
}

function manejarCierreRanking() {
  ocultarModalPorId(ID_MODAL_RANKING);
}

function manejarCierreConfirmacionBorrado() {
  ocultarModalPorId(ID_MODAL_CONFIRMAR_RANKING);
}

function crearBoton(texto, claseBoton, idBoton) {
  var boton;

  boton = document.createElement("button");
  boton.className = claseBoton;
  boton.id = idBoton;
  boton.type = "button";
  boton.textContent = texto;

  return boton;
}

function crearModalRanking() {
  var modal;
  var contenido;
  var titulo;
  var lista;
  var acciones;
  var botonBorrar;
  var botonCerrar;

  modal = document.createElement("div");
  modal.className = "modal oculto";
  modal.id = ID_MODAL_RANKING;

  contenido = document.createElement("div");
  contenido.className = "modal-contenido";

  titulo = document.createElement("h2");
  titulo.className = "modal-titulo";
  titulo.textContent = "Ranking";

  lista = document.createElement("ul");
  lista.className = "modal-lista";
  lista.id = ID_CONTENIDO_RANKING;

  acciones = document.createElement("div");
  acciones.className = "acciones";

  botonBorrar = crearBoton("Borrar historial", "boton boton-secundario", ID_BOTON_BORRAR_RANKING);
  botonCerrar = crearBoton("Cerrar", "boton boton-principal", ID_BOTON_CERRAR_RANKING);

  acciones.appendChild(botonBorrar);
  acciones.appendChild(botonCerrar);
  contenido.appendChild(titulo);
  contenido.appendChild(lista);
  contenido.appendChild(acciones);
  modal.appendChild(contenido);
  document.body.appendChild(modal);
}

function crearModalConfirmacionRanking() {
  var modal;
  var contenido;
  var titulo;
  var mensaje;
  var acciones;
  var botonCancelar;
  var botonConfirmar;

  modal = document.createElement("div");
  modal.className = "modal oculto";
  modal.id = ID_MODAL_CONFIRMAR_RANKING;

  contenido = document.createElement("div");
  contenido.className = "modal-contenido";

  titulo = document.createElement("h2");
  titulo.className = "modal-titulo";
  titulo.textContent = "Borrar ranking";

  mensaje = document.createElement("p");
  mensaje.className = "modal-item";
  mensaje.textContent = "Esta accion elimina todo el historial guardado.";

  acciones = document.createElement("div");
  acciones.className = "acciones";

  botonCancelar = crearBoton("Cancelar", "boton boton-secundario", ID_BOTON_CANCELAR_BORRADO_RANKING);
  botonConfirmar = crearBoton("Borrar historial", "boton boton-principal", ID_BOTON_CONFIRMAR_BORRADO_RANKING);

  acciones.appendChild(botonCancelar);
  acciones.appendChild(botonConfirmar);
  contenido.appendChild(titulo);
  contenido.appendChild(mensaje);
  contenido.appendChild(acciones);
  modal.appendChild(contenido);
  document.body.appendChild(modal);
}

function insertarBotonRanking() {
  var accionesPartida;
  var botonRanking;

  accionesPartida = document.querySelector(".partida .acciones");

  if (accionesPartida === null || document.getElementById(ID_BOTON_RANKING) !== null) {
    return;
  }

  botonRanking = crearBoton("Ver ranking", "boton boton-secundario", ID_BOTON_RANKING);
  accionesPartida.appendChild(botonRanking);
}

function asignarEventosRanking() {
  document.getElementById(ID_BOTON_RANKING).addEventListener("click", abrirRanking);
  document.getElementById(ID_BOTON_CERRAR_RANKING).addEventListener("click", manejarCierreRanking);
  document.getElementById(ID_BOTON_BORRAR_RANKING).addEventListener("click", pedirConfirmacionBorradoRanking);
  document.getElementById(ID_BOTON_CANCELAR_BORRADO_RANKING).addEventListener("click", manejarCierreConfirmacionBorrado);
  document.getElementById(ID_BOTON_CONFIRMAR_BORRADO_RANKING).addEventListener("click", borrarHistorialRanking);
}

function manejarCambioModalResultado() {
  var modalResultado;

  modalResultado = document.getElementById(ID_MODAL_RESULTADO_RANKING);

  if (modalResultado.classList.contains(CLASE_OCULTO_RANKING) === false) {
    guardarResultadoPartida();
    return;
  }

  ultimaFirmaResultadoRanking = "";
}

function observarResultadoPartida() {
  var modalResultado;
  var observador;

  modalResultado = document.getElementById(ID_MODAL_RESULTADO_RANKING);

  if (modalResultado === null || typeof MutationObserver === "undefined") {
    return;
  }

  observador = new MutationObserver(manejarCambioModalResultado);
  observador.observe(modalResultado, { attributes: true, attributeFilter: ["class"] });
}

function iniciarRanking() {
  insertarBotonRanking();
  crearModalRanking();
  crearModalConfirmacionRanking();
  asignarEventosRanking();
  observarResultadoPartida();
}

iniciarRanking();