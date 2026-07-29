"use strict";

var CLASE_OCULTO_RANKING = "oculto";
var ID_MODAL_RESULTADO_RANKING = "modalResultado";
var ID_BOTON_RANKING = "botonRanking";
var ID_MODAL_RANKING = "modalRanking";
var ID_CONTENIDO_RANKING = "contenidoRanking";
var ID_SELECTOR_ORDEN_RANKING = "selectorOrdenRanking";
var ID_BOTON_DIRECCION_ORDEN_RANKING = "botonDireccionOrdenRanking";
var ID_BOTON_CERRAR_RANKING = "botonCerrarRanking";
var ID_BOTON_BORRAR_RANKING = "botonBorrarRanking";
var ID_MODAL_CONFIRMAR_RANKING = "modalConfirmarRanking";
var ID_BOTON_CONFIRMAR_BORRADO_RANKING = "botonConfirmarBorradoRanking";
var ID_BOTON_CANCELAR_BORRADO_RANKING = "botonCancelarBorradoRanking";

// Criterios disponibles para ordenar el ranking
var CRITERIO_ORDEN_PUNTAJE = "puntaje";
var CRITERIO_ORDEN_FECHA = "fecha";
var CRITERIO_ORDEN_DURACION = "duracion";
var CRITERIO_ORDEN_NIVEL = "nivel";
var ORDEN_NIVELES_RANKING = ["Fácil", "Medio", "Difícil", "Elite"];

// Dirección del ordenamiento, independiente del criterio elegido
var DIRECCION_ORDEN_ASCENDENTE = "asc";
var DIRECCION_ORDEN_DESCENDENTE = "desc";
var SIMBOLO_ORDEN_ASCENDENTE = "↑";
var SIMBOLO_ORDEN_DESCENDENTE = "↓";

var ultimaFirmaResultadoRanking = "";
var criterioOrdenActual = CRITERIO_ORDEN_PUNTAJE;
var direccionOrdenActual = DIRECCION_ORDEN_DESCENDENTE;

function obtenerTextoResultado(idElemento) {
  var elemento;

  elemento = document.getElementById(idElemento);

  if (elemento === null) {
    return "";
  }

  return elemento.textContent.trim();
}

// A partir de acá, los comparadores ordenan siempre ascendente;
// la dirección descendente se aplica invirtiendo el arreglo ya ordenado
function compararPorPuntaje(partidaA, partidaB) {
  return partidaA.puntaje - partidaB.puntaje;
}

function compararPorFecha(partidaA, partidaB) {
  return partidaA.marcaTiempo - partidaB.marcaTiempo;
}

// duracion es texto "mm:ss" con ceros a la izquierda, por eso se compara como string
function compararPorDuracion(partidaA, partidaB) {
  if (partidaA.duracion < partidaB.duracion) {
    return -1;
  }

  if (partidaA.duracion > partidaB.duracion) {
    return 1;
  }

  return 0;
}

function compararPorNivel(partidaA, partidaB) {
  return ORDEN_NIVELES_RANKING.indexOf(partidaA.nivel) - ORDEN_NIVELES_RANKING.indexOf(partidaB.nivel);
}

function ordenarRanking(ranking, criterio, direccion) {
  if (criterio === CRITERIO_ORDEN_FECHA) {
    ranking.sort(compararPorFecha);
  } else if (criterio === CRITERIO_ORDEN_DURACION) {
    ranking.sort(compararPorDuracion);
  } else if (criterio === CRITERIO_ORDEN_NIVEL) {
    ranking.sort(compararPorNivel);
  } else {
    ranking.sort(compararPorPuntaje);
  }

  if (direccion === DIRECCION_ORDEN_DESCENDENTE) {
    ranking.reverse();
  }

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
    marcaTiempo: Date.now(),
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

// Fila corta y clickeable: "1. Entrenador — 100 pts"
function crearFilaResumenRanking(partida, posicion) {
  var fila;

  fila = document.createElement("button");
  fila.type = "button";
  fila.className = "ranking-fila";
  fila.setAttribute("aria-expanded", "false");
  fila.textContent = posicion + ". " + partida.nombre + " — " + partida.puntaje + " pts";

  return fila;
}

// Detalle completo de la partida, oculto hasta que se despliega la fila
function crearDetalleRanking(partida) {
  var detalle;

  detalle = document.createElement("div");
  detalle.className = "ranking-detalle oculto";

  detalle.appendChild(crearElementoTexto("Nivel", partida.nivel));
  detalle.appendChild(crearElementoTexto("Intentos", partida.intentos));
  detalle.appendChild(crearElementoTexto("Errores", partida.errores));
  detalle.appendChild(crearElementoTexto("Duracion", partida.duracion));
  detalle.appendChild(crearElementoTexto("Fecha y hora", partida.fechaHora));

  return detalle;
}

function alternarDetalleRanking(evento) {
  var fila;
  var detalle;
  var estaExpandido;

  fila = evento.currentTarget;
  detalle = fila.nextElementSibling;

  if (detalle === null) {
    return;
  }

  estaExpandido = detalle.classList.contains(CLASE_OCULTO_RANKING) === false;

  if (estaExpandido === true) {
    detalle.classList.add(CLASE_OCULTO_RANKING);
    fila.setAttribute("aria-expanded", "false");
    return;
  }

  detalle.classList.remove(CLASE_OCULTO_RANKING);
  fila.setAttribute("aria-expanded", "true");
}

function agregarPartidaAlRanking(contenidoRanking, partida, posicion) {
  var item;
  var fila;
  var detalle;

  item = document.createElement("li");
  item.className = "ranking-item";

  fila = crearFilaResumenRanking(partida, posicion);
  fila.addEventListener("click", alternarDetalleRanking);

  detalle = crearDetalleRanking(partida);

  item.appendChild(fila);
  item.appendChild(detalle);
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

  ranking = ordenarRanking(obtenerRankingGuardado(), criterioOrdenActual, direccionOrdenActual);

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

// Cierra el modal si el click fue sobre el fondo oscuro, no sobre su contenido
function manejarClickFueraDelModal(evento) {
  if (evento.target === evento.currentTarget) {
    evento.currentTarget.classList.add(CLASE_OCULTO_RANKING);
  }
}

function agregarOpcionOrden(selector, etiqueta, valor) {
  var opcion;

  opcion = document.createElement("option");
  opcion.value = valor;
  opcion.textContent = etiqueta;

  selector.appendChild(opcion);
}

function manejarCambioOrdenRanking(evento) {
  criterioOrdenActual = evento.target.value;
  renderizarRanking();
}

// Alterna entre ascendente y descendente, sin importar el criterio elegido
function alternarDireccionOrden() {
  var boton;

  boton = document.getElementById(ID_BOTON_DIRECCION_ORDEN_RANKING);

  if (direccionOrdenActual === DIRECCION_ORDEN_DESCENDENTE) {
    direccionOrdenActual = DIRECCION_ORDEN_ASCENDENTE;
    boton.textContent = SIMBOLO_ORDEN_ASCENDENTE;
  } else {
    direccionOrdenActual = DIRECCION_ORDEN_DESCENDENTE;
    boton.textContent = SIMBOLO_ORDEN_DESCENDENTE;
  }

  renderizarRanking();
}

function crearModalRanking() {
  var modal;
  var contenido;
  var titulo;
  var contenedorOrden;
  var etiquetaOrden;
  var selectorOrden;
  var botonDireccion;
  var lista;
  var acciones;
  var botonBorrar;
  var botonCerrar;

  modal = document.createElement("div");
  modal.className = "modal oculto";
  modal.id = ID_MODAL_RANKING;
  modal.addEventListener("click", manejarClickFueraDelModal);

  contenido = document.createElement("div");
  contenido.className = "modal-contenido";

  titulo = document.createElement("h2");
  titulo.className = "modal-titulo";
  titulo.textContent = "Ranking";

  contenedorOrden = document.createElement("div");
  contenedorOrden.className = "ranking-orden";

  etiquetaOrden = document.createElement("span");
  etiquetaOrden.className = "ranking-orden-etiqueta";
  etiquetaOrden.textContent = "Ordenar por:";

  selectorOrden = document.createElement("select");
  selectorOrden.className = "campo-entrada";
  selectorOrden.id = ID_SELECTOR_ORDEN_RANKING;
  selectorOrden.setAttribute("aria-label", "Ordenar ranking por");

  agregarOpcionOrden(selectorOrden, "Puntaje", CRITERIO_ORDEN_PUNTAJE);
  agregarOpcionOrden(selectorOrden, "Fecha", CRITERIO_ORDEN_FECHA);
  agregarOpcionOrden(selectorOrden, "Duracion", CRITERIO_ORDEN_DURACION);
  agregarOpcionOrden(selectorOrden, "Nivel", CRITERIO_ORDEN_NIVEL);

  botonDireccion = crearBoton(SIMBOLO_ORDEN_DESCENDENTE, "boton boton-secundario", ID_BOTON_DIRECCION_ORDEN_RANKING);
  botonDireccion.setAttribute("aria-label", "Invertir orden ascendente o descendente");

  contenedorOrden.appendChild(etiquetaOrden);
  contenedorOrden.appendChild(selectorOrden);
  contenedorOrden.appendChild(botonDireccion);

  lista = document.createElement("ul");
  lista.className = "modal-lista modal-lista-ranking";
  lista.id = ID_CONTENIDO_RANKING;

  acciones = document.createElement("div");
  acciones.className = "acciones";

  botonBorrar = crearBoton("Borrar historial", "boton boton-secundario", ID_BOTON_BORRAR_RANKING);
  botonCerrar = crearBoton("Cerrar", "boton boton-principal", ID_BOTON_CERRAR_RANKING);

  acciones.appendChild(botonBorrar);
  acciones.appendChild(botonCerrar);
  contenido.appendChild(titulo);
  contenido.appendChild(contenedorOrden);
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
  modal.addEventListener("click", manejarClickFueraDelModal);

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
  document.getElementById(ID_SELECTOR_ORDEN_RANKING).addEventListener("change", manejarCambioOrdenRanking);
  document.getElementById(ID_BOTON_DIRECCION_ORDEN_RANKING).addEventListener("click", alternarDireccionOrden);
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