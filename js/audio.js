"use strict";

var CLASE_OCULTO = "oculto";

// Carpeta local donde están guardados los audios del juego
var RUTA_AUDIO = "assets/audio/";
var EXTENSION_AUDIO = ".mp3";

// Nombres de archivo (sin extensión) según el nivel elegido
var PISTA_FACIL = "facil";
var PISTA_MEDIO = "medio";
var PISTA_DIFICIL = "dificil";
var PISTA_ELITE_1 = "elite-1";
var PISTA_ELITE_2 = "elite-2";

// Etiquetas que juego.js ya escribe en marcadorNivel para cada nivel
var ETIQUETA_NIVEL_FACIL = "Fácil";
var ETIQUETA_NIVEL_MEDIO = "Medio";
var ETIQUETA_NIVEL_DIFICIL = "Difícil";
var ETIQUETA_NIVEL_ELITE = "Elite";

// IDs de los elementos del HTML que este archivo necesita leer
var ID_PANTALLA_PARTIDA = "pantallaPartida";
var ID_MARCADOR_NIVEL = "marcadorNivel";
var ID_REPRODUCTOR_AUDIO = "reproductorAudio";

// Referencias a los elementos del HTML (se completan en obtenerElementosAudio)
var pantallaPartida;
var marcadorNivel;
var reproductorAudio;

// Pista de Elite que está sonando y la que sigue en el ciclo
var pistaEliteActual;
var pistaEliteSiguiente;

// Busca en el DOM los elementos que el audio necesita y los guarda en las variables globales
function obtenerElementosAudio() {
  pantallaPartida = document.getElementById(ID_PANTALLA_PARTIDA);
  marcadorNivel = document.getElementById(ID_MARCADOR_NIVEL);
  reproductorAudio = document.getElementById(ID_REPRODUCTOR_AUDIO);
}

// Arma la ruta completa de una pista a partir de su nombre de archivo
function obtenerRutaPista(nombrePista) {
  return RUTA_AUDIO + nombrePista + EXTENSION_AUDIO;
}

// Ignora el error que el navegador puede tirar si bloquea la reproducción automática
function ignorarErrorReproduccion() {
  return;
}

// Arranca el reproductor evitando que un rechazo de play() rompa la consola
function reproducirAudioSeguro() {
  reproductorAudio.play().catch(ignorarErrorReproduccion);
}

// Sortea cuál de las dos pistas de Elite arranca primero
function elegirPistaEliteInicial() {
  if (Math.random() < 0.5) {
    pistaEliteActual = PISTA_ELITE_1;
    pistaEliteSiguiente = PISTA_ELITE_2;
    return;
  }

  pistaEliteActual = PISTA_ELITE_2;
  pistaEliteSiguiente = PISTA_ELITE_1;
}

// Al terminar una pista de Elite, pasa a la otra y la reproduce
function reproducirSiguientePistaElite() {
  var pistaTemporal;

  pistaTemporal = pistaEliteActual;
  pistaEliteActual = pistaEliteSiguiente;
  pistaEliteSiguiente = pistaTemporal;

  reproductorAudio.src = obtenerRutaPista(pistaEliteActual);
  reproducirAudioSeguro();
}

// Prepara el reproductor para el modo Elite: dos pistas que se van alternando
function iniciarAudioElite() {
  elegirPistaEliteInicial();

  reproductorAudio.loop = false;
  reproductorAudio.src = obtenerRutaPista(pistaEliteActual);
  reproducirAudioSeguro();
}

// Prepara el reproductor para un nivel con una sola pista en loop
function iniciarAudioNivel(nombrePista) {
  reproductorAudio.loop = true;
  reproductorAudio.src = obtenerRutaPista(nombrePista);
  reproducirAudioSeguro();
}

// Elige y arranca la pista que corresponde según el nivel que muestra el marcador
function reproducirPistaSegunNivel() {
  var etiquetaNivel;

  etiquetaNivel = marcadorNivel.textContent;

  if (etiquetaNivel === ETIQUETA_NIVEL_FACIL) {
    iniciarAudioNivel(PISTA_FACIL);
    return;
  }

  if (etiquetaNivel === ETIQUETA_NIVEL_MEDIO) {
    iniciarAudioNivel(PISTA_MEDIO);
    return;
  }

  if (etiquetaNivel === ETIQUETA_NIVEL_DIFICIL) {
    iniciarAudioNivel(PISTA_DIFICIL);
    return;
  }

  if (etiquetaNivel === ETIQUETA_NIVEL_ELITE) {
    iniciarAudioElite();
  }
}

// Frena el audio de la partida actual
function detenerAudioPartida() {
  reproductorAudio.pause();
  reproductorAudio.currentTime = 0;
}

// Se ejecuta cuando pantallaPartida se muestra o se oculta, para arrancar o frenar el audio
function manejarCambioPantallaPartida() {
  if (pantallaPartida.classList.contains(CLASE_OCULTO) === true) {
    detenerAudioPartida();
    return;
  }

  reproducirPistaSegunNivel();
}

// Asigna el evento que alterna las pistas de Elite cuando una termina
function asignarEventosAudio() {
  reproductorAudio.addEventListener("ended", reproducirSiguientePistaElite);
}

// Observa pantallaPartida para saber cuándo empieza o termina una partida
function observarPantallaPartida() {
  var observador;

  if (typeof MutationObserver === "undefined") {
    return;
  }

  observador = new MutationObserver(manejarCambioPantallaPartida);
  observador.observe(pantallaPartida, { attributes: true, attributeFilter: ["class"] });
}

// Punto de entrada: prepara el reproductor y deja todo listo para la primera partida
function iniciarAudio() {
  obtenerElementosAudio();
  asignarEventosAudio();
  observarPantallaPartida();
}

iniciarAudio();
