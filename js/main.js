"use strict";

/*
    CONTRATO CON juego.js (Enzo) - BORRAR ESTE COMENTARIO AL INTEGRAR

    main.js llama a tres funciones que deben estar declaradas en juego.js:

    iniciarPartida(nombre, nivel)
        nombre: string ya validado y sin espacios sobrantes.
        nivel: string, solo puede valer 'facil', 'medio' o 'dificil'.
        Genera el tablero, resetea marcadores y prepara el temporizador.

    reiniciarPartida()
        Sin parametros. Reutiliza el nombre y el nivel de la partida actual.
        Vuelve a mezclar las cartas y resetea intentos, pares, errores,
        puntaje y temporizador.

    detenerPartida()
        Sin parametros. Solo frena el temporizador. Se usa al volver al inicio.

    IDs del HTML disponibles:

    Contenedor del tablero: tablero
    Marcadores: marcadorNombre, marcadorNivel, marcadorIntentos,
                marcadorPares, marcadorErrores, marcadorPuntaje, marcadorTiempo
    Modal de victoria: modalResultado (se muestra quitando la clase 'oculto')
    Datos del modal: resultadoNombre, resultadoNivel, resultadoIntentos,
                     resultadoErrores, resultadoTiempo, resultadoPuntaje

    main.js se encarga de cambiar de pantalla y de cerrar el modal.
    juego.js solo abre el modal al detectar que se completaron todos los pares.
*/

var CLASE_OCULTO = "oculto";

var pantallaInicio;
var pantallaPartida;
var formularioInicio;
var entradaNombre;
var selectorNivel;
var botonReiniciar;
var botonVolver;
var botonJugarDeNuevo;
var modalResultado;

function mostrarElemento(elemento) {
  if (elemento !== null) {
    elemento.classList.remove(CLASE_OCULTO);
  }
}

function ocultarElemento(elemento) {
  if (elemento !== null) {
    elemento.classList.add(CLASE_OCULTO);
  }
}

function mostrarPantallaInicio() {
  ocultarElemento(pantallaPartida);
  ocultarElemento(modalResultado);
  mostrarElemento(pantallaInicio);
}

function mostrarPantallaPartida() {
  ocultarElemento(pantallaInicio);
  ocultarElemento(modalResultado);
  mostrarElemento(pantallaPartida);
}

function manejarEnvioFormulario(evento) {
  var nombre;
  var nivel;

  evento.preventDefault();

  nombre = entradaNombre.value.trim();
  nivel = selectorNivel.value;

  if (validarFormularioInicio(nombre, nivel) === false) {
    return;
  }

  mostrarPantallaPartida();
  iniciarPartida(nombre, nivel);
}

function manejarReinicio() {
  ocultarElemento(modalResultado);
  reiniciarPartida();
}

function manejarVueltaAlInicio() {
  detenerPartida();
  mostrarPantallaInicio();
}

function asignarEventos() {
  formularioInicio.addEventListener("submit", manejarEnvioFormulario);
  botonReiniciar.addEventListener("click", manejarReinicio);
  botonVolver.addEventListener("click", manejarVueltaAlInicio);
  botonJugarDeNuevo.addEventListener("click", manejarReinicio);
}

function obtenerElementos() {
  pantallaInicio = document.getElementById("pantallaInicio");
  pantallaPartida = document.getElementById("pantallaPartida");
  formularioInicio = document.getElementById("formularioInicio");
  entradaNombre = document.getElementById("nombreJugador");
  selectorNivel = document.getElementById("nivelDificultad");
  botonReiniciar = document.getElementById("botonReiniciar");
  botonVolver = document.getElementById("botonVolver");
  botonJugarDeNuevo = document.getElementById("botonJugarDeNuevo");
  modalResultado = document.getElementById("modalResultado");
}

function iniciarAplicacion() {
  obtenerElementos();
  asignarEventos();
  mostrarPantallaInicio();
}

iniciarAplicacion();
