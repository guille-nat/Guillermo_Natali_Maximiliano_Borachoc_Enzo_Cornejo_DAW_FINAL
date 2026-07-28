"use strict";

// Constantes con los elementos del HTML
var ID_TABLERO = "tablero";
var ID_MARCADOR_NOMBRE = "marcadorNombre";
var ID_MARCADOR_NIVEL = "marcadorNivel";
var ID_MARCADOR_INTENTOS = "marcadorIntentos";
var ID_MARCADOR_PARES = "marcadorPares";
var ID_MARCADOR_ERRORES = "marcadorErrores";
var ID_MARCADOR_PUNTAJE = "marcadorPuntaje";
var ID_MARCADOR_TIEMPO = "marcadorTiempo";
var ID_MODAL_RESULTADO = "modalResultado";
var ID_RESULTADO_NOMBRE = "resultadoNombre";
var ID_RESULTADO_NIVEL = "resultadoNivel";
var ID_RESULTADO_INTENTOS = "resultadoIntentos";
var ID_RESULTADO_ERRORES = "resultadoErrores";
var ID_RESULTADO_TIEMPO = "resultadoTiempo";
var ID_RESULTADO_PUNTAJE = "resultadoPuntaje";

// Constantes con los elementos del CSS
var CLASE_CARTA = "carta";
var CLASE_CARTA_REVELADA = "carta-revelada";
var CLASE_CARTA_CORRECTA = "carta-correcta";
var CLASE_CARTA_INCORRECTA = "carta-incorrecta";
var CLASE_OCULTO = "oculto";

// Texto alternativo mientras la carta todavía no fue revelada
var TEXTO_ALT_OCULTA = "¿Quién es ese Pokémon?";

// Tiempo de espera antes de volver a ocultar un par incorrecto
var MILISEGUNDOS_ESPERA_ERROR = 900;

// Puntos que suma cada par correcto y bonus por terminar la partida
var PUNTOS_POR_PAR = 100;
var BONUS_FINAL_PARTIDA = 300;

// Configuración del modo Elite: cronómetro regresivo y puntaje propio
var SEGUNDOS_INICIALES_ELITE = 120;
var SEGUNDOS_BONUS_POR_PAR_ELITE = 3;
var ERRORES_POR_PENALIZACION_TIEMPO_ELITE = 10;
var SEGUNDOS_PENALIZACION_ELITE = 5;
var PUNTOS_BASE_POR_PAR_ELITE = 15;
var BONUS_TABLERO_DIFICIL_ELITE = 150;
var SECUENCIA_NIVELES_ELITE = ["facil", "medio", "dificil"];

// Dirección de las imágenes
var RUTA_IMAGENES = "assets/images/";

// Lista de los Pokémon disponibles que indica su nombre e imagen
var POKEMONES = [
  { nombre: "Bulbasaur", imagen: RUTA_IMAGENES + "bulbasaur.png" },
  { nombre: "Ivysaur", imagen: RUTA_IMAGENES + "ivysaur.png" },
  { nombre: "Venusaur", imagen: RUTA_IMAGENES + "venusaur.png" },
  { nombre: "Charmander", imagen: RUTA_IMAGENES + "charmander.png" },
  { nombre: "Charmeleon", imagen: RUTA_IMAGENES + "charmeleon.png" },
  { nombre: "Charizard", imagen: RUTA_IMAGENES + "charizard.png" },
  { nombre: "Squirtle", imagen: RUTA_IMAGENES + "squirtle.png" },
  { nombre: "Wartortle", imagen: RUTA_IMAGENES + "wartortle.png" },
  { nombre: "Blastoise", imagen: RUTA_IMAGENES + "blastoise.png" },
  { nombre: "Caterpie", imagen: RUTA_IMAGENES + "caterpie.png" },
  { nombre: "Metapod", imagen: RUTA_IMAGENES + "metapod.png" },
  { nombre: "Butterfree", imagen: RUTA_IMAGENES + "butterfree.png" },
  { nombre: "Weedle", imagen: RUTA_IMAGENES + "weedle.png" },
  { nombre: "Kakuna", imagen: RUTA_IMAGENES + "kakuna.png" },
  { nombre: "Beedrill", imagen: RUTA_IMAGENES + "beedrill.png" },
  { nombre: "Pidgey", imagen: RUTA_IMAGENES + "pidgey.png" },
  { nombre: "Pidgeotto", imagen: RUTA_IMAGENES + "pidgeotto.png" },
  { nombre: "Pidgeot", imagen: RUTA_IMAGENES + "pidgeot.png" }
];

// Configuración de cada nivel: tamaño del tablero, cantidad de pares,
// penalización por error y la imagen que se usa como carta boca abajo
var CONFIGURACION_NIVELES = {
  facil: { etiqueta: "Fácil", columnas: 4, pares: 8, penalizacion: 10, claseTablero: "tablero-facil", imagenDorso: RUTA_IMAGENES + "pokebola.png" },
  medio: { etiqueta: "Medio", columnas: 4, pares: 10, penalizacion: 20, claseTablero: "tablero-medio", imagenDorso: RUTA_IMAGENES + "superbola.png" },
  dificil: { etiqueta: "Difícil", columnas: 6, pares: 18, penalizacion: 30, claseTablero: "tablero-dificil", imagenDorso: RUTA_IMAGENES + "ultrabola.png" },
  elite: { etiqueta: "Elite" }
};

// Referencias a los elementos del HTML (se completan en obtenerElementos)
var tablero;
var marcadorNombre;
var marcadorNivel;
var marcadorIntentos;
var marcadorPares;
var marcadorErrores;
var marcadorPuntaje;
var marcadorTiempo;
var modalResultado;
var resultadoNombre;
var resultadoNivel;
var resultadoIntentos;
var resultadoErrores;
var resultadoTiempo;
var resultadoPuntaje;

// Datos de la partida en curso
var nombreJugador;
var nivelActual;
var totalParesNivel;
var cartasSeleccionadas;
var carta1;
var carta2;
var tableroBloqueado;
var contadorIntentos;
var contadorPares;
var contadorErrores;
var contadorPuntaje;

// Datos del cronómetro
var cronometroActivo;
var idIntervaloCronometro;
var segundosTranscurridos;

// Datos del modo Elite
var eliteEtapaActual;
var eliteRondaActual;
var segundosRestantesElite;

// Busca en el DOM los elementos que el juego necesita y los guarda en las variables globales
function obtenerElementosJuego() {
  tablero = document.getElementById(ID_TABLERO);
  marcadorNombre = document.getElementById(ID_MARCADOR_NOMBRE);
  marcadorNivel = document.getElementById(ID_MARCADOR_NIVEL);
  marcadorIntentos = document.getElementById(ID_MARCADOR_INTENTOS);
  marcadorPares = document.getElementById(ID_MARCADOR_PARES);
  marcadorErrores = document.getElementById(ID_MARCADOR_ERRORES);
  marcadorPuntaje = document.getElementById(ID_MARCADOR_PUNTAJE);
  marcadorTiempo = document.getElementById(ID_MARCADOR_TIEMPO);
  modalResultado = document.getElementById(ID_MODAL_RESULTADO);
  resultadoNombre = document.getElementById(ID_RESULTADO_NOMBRE);
  resultadoNivel = document.getElementById(ID_RESULTADO_NIVEL);
  resultadoIntentos = document.getElementById(ID_RESULTADO_INTENTOS);
  resultadoErrores = document.getElementById(ID_RESULTADO_ERRORES);
  resultadoTiempo = document.getElementById(ID_RESULTADO_TIEMPO);
  resultadoPuntaje = document.getElementById(ID_RESULTADO_PUNTAJE);
}

// Mezcla los elementos de un array en orden aleatorio (algoritmo Fisher-Yates)
function mezclarArray(lista) {
  var i;
  var aleatorio;
  var temp;

  i = lista.length - 1;

  while (i > 0) {
    aleatorio = Math.floor(Math.random() * (i + 1));

    temp = lista[i];
    lista[i] = lista[aleatorio];
    lista[aleatorio] = temp;

    i = i - 1;
  }

  return lista;
}

// Toma del catálogo Pokemones los que necesita el nivel del juego
function elegirPokemones(cantidadPares) {
  var elegidos;
  var i;

  elegidos = [];

  for (i = 0; i < cantidadPares; i++) {
    elegidos.push(POKEMONES[i]);
  }

  return elegidos;
}

// Arma el mazo completo del nivel
function crearMazoMezclado(nivel) {
  var configuracion;
  var listaPokemones;
  var mazo;
  var i;

  configuracion = CONFIGURACION_NIVELES[nivel];
  listaPokemones = elegirPokemones(configuracion.pares);
  mazo = [];

  // Duplica cada Pokémon elegido para formar los pares
  for (i = 0; i < listaPokemones.length; i++) {
    mazo.push(listaPokemones[i]);
    mazo.push(listaPokemones[i]);
  }

  // Mezcla el mazo para presentarlo en desordenado
  return mezclarArray(mazo);
}

// Crea en el DOM la imagen de una carta boca abajo y le asigna el evento de click
function crearElementoCarta(datoCarta, imagenDorso) {
  var carta;

  carta = document.createElement("img");
  carta.className = CLASE_CARTA;
  carta.src = imagenDorso;
  carta.alt = TEXTO_ALT_OCULTA;
  carta.setAttribute("data-nombre", datoCarta.nombre);
  carta.setAttribute("data-imagen", datoCarta.imagen);
  carta.addEventListener("click", clickCarta);

  return carta;
}

// Limpia el tablero y genera las cartas dentro del mismo según el nivel elegido 
function construirTablero(nivel) {
  var configuracion;
  var mazo;
  var i;
  var carta;

  configuracion = CONFIGURACION_NIVELES[nivel];
  mazo = crearMazoMezclado(nivel);
  totalParesNivel = configuracion.pares;

  tablero.innerHTML = "";
  tablero.className = "tablero " + configuracion.claseTablero;

  for (i = 0; i < mazo.length; i++) {
    carta = crearElementoCarta(mazo[i], configuracion.imagenDorso);
    tablero.appendChild(carta);
  }
}

// Convierte una cantidad de segundos al formato mm:ss para mostrarlo en pantalla
function formatearTiempo(segundos) {
  var minutos;
  var segundosRestantes;
  var textoMinutos;
  var textoSegundos;

  minutos = Math.floor(segundos / 60);
  segundosRestantes = segundos % 60;

  textoMinutos = minutos < 10 ? "0" + minutos : "" + minutos;
  textoSegundos = segundosRestantes < 10 ? "0" + segundosRestantes : "" + segundosRestantes;

  return textoMinutos + ":" + textoSegundos;
}

// Actualiza en la interfaz los valores de intentos, pares, errores y puntaje
function actualizarMarcadores() {
  marcadorIntentos.textContent = contadorIntentos;
  marcadorPares.textContent = contadorPares;
  marcadorErrores.textContent = contadorErrores;
  marcadorPuntaje.textContent = contadorPuntaje;
}

// Calcula el puntaje actual según los pares encontrados, los errores y el tiempo transcurrido
function calcularPuntaje() {
  var configuracion;
  var puntaje;

  configuracion = CONFIGURACION_NIVELES[nivelActual];
  puntaje = (contadorPares * PUNTOS_POR_PAR) - (contadorErrores * configuracion.penalizacion) - segundosTranscurridos;

  if (puntaje < 0) {
    puntaje = 0;
  }

  return puntaje;
}

// Calcula los puntos que suma un par correcto en modo Elite: crecen con cada tablero superado
function calcularPuntosParElite() {
  return PUNTOS_BASE_POR_PAR_ELITE * eliteRondaActual;
}

// Refleja segundosRestantesElite en el marcador de tiempo, sin bajar de cero
function actualizarMarcadorTiempoElite() {
  if (segundosRestantesElite < 0) {
    segundosRestantesElite = 0;
  }

  marcadorTiempo.textContent = formatearTiempo(segundosRestantesElite);
}

// Frena el cronómetro de la partida
function detenerCronometro() {
  clearInterval(idIntervaloCronometro);
  cronometroActivo = false;
}

// Completa los datos del resultado final y muestra el modal
function mostrarResultado() {
  var configuracion;

  configuracion = CONFIGURACION_NIVELES[nivelActual];

  resultadoNombre.textContent = nombreJugador;
  resultadoNivel.textContent = configuracion.etiqueta;
  resultadoIntentos.textContent = contadorIntentos;
  resultadoErrores.textContent = contadorErrores;
  resultadoTiempo.textContent = formatearTiempo(segundosTranscurridos);
  resultadoPuntaje.textContent = contadorPuntaje;

  modalResultado.classList.remove(CLASE_OCULTO);
}

// Termina la partida del modo Elite cuando el cronómetro regresivo llega a cero
function finalizarPartidaElite() {
  segundosRestantesElite = 0;
  marcadorTiempo.textContent = formatearTiempo(0);
  detenerCronometro();
  mostrarResultado();
}

// Se ejecuta cada segundo mientras el cronómetro está activo
function actualizarCronometro() {
  segundosTranscurridos = segundosTranscurridos + 1;

  if (nivelActual === "elite") {
    segundosRestantesElite = segundosRestantesElite - 1;
    actualizarMarcadorTiempoElite();

    if (segundosRestantesElite <= 0) {
      finalizarPartidaElite();
      return;
    }
  } else {
    marcadorTiempo.textContent = formatearTiempo(segundosTranscurridos);
    contadorPuntaje = calcularPuntaje();
  }

  actualizarMarcadores();
}

// Arranca el cronómetro de la partida, solo si todavía no estaba activo
function iniciarCronometro() {
  if (cronometroActivo === true) {
    return;
  }

  cronometroActivo = true;
  idIntervaloCronometro = setInterval(actualizarCronometro, 1000);
}

// Vuelve a cero todos los contadores y el cronómetro para empezar o reiniciar una partida
function reiniciarEstadoPartida() {
  cartasSeleccionadas = [];
  tableroBloqueado = false;
  contadorIntentos = 0;
  contadorPares = 0;
  contadorErrores = 0;
  contadorPuntaje = 0;
  segundosTranscurridos = 0;

  marcadorTiempo.textContent = formatearTiempo(0);
  actualizarMarcadores();
}

// Marca visualmente una carta como parte de un par correcto
function bloquearCarta(carta) {
  carta.classList.add(CLASE_CARTA_CORRECTA);
}

// Devuelve la configuración del tablero que está en pantalla: la del nivel elegido,
// o la de la etapa actual cuando se está jugando en modo Elite
function obtenerConfiguracionTableroActual() {
  if (nivelActual === "elite") {
    return CONFIGURACION_NIVELES[eliteEtapaActual];
  }

  return CONFIGURACION_NIVELES[nivelActual];
}

// Vuelve a mostrar la imagen boca abajo de una carta que no formó par
function ocultarCartaIncorrecta(carta) {
  var configuracion;

  configuracion = obtenerConfiguracionTableroActual();
  carta.src = configuracion.imagenDorso;
  carta.alt = TEXTO_ALT_OCULTA;

  carta.classList.remove(CLASE_CARTA_REVELADA);
  carta.classList.remove(CLASE_CARTA_INCORRECTA);
}

// Marca visualmente las dos cartas que no formaron un par correcto
function marcarCartasIncorrectas() {
  carta1.classList.add(CLASE_CARTA_INCORRECTA);
  carta2.classList.add(CLASE_CARTA_INCORRECTA);
}

// Oculta el par incorrecto y desbloquea el tablero para seguir jugando
function parIncorrecto() {
  ocultarCartaIncorrecta(carta1);
  ocultarCartaIncorrecta(carta2);
  cartasSeleccionadas = [];
  tableroBloqueado = false;
}

// Suma el bonus de finalización al puntaje actual, para mostrarlo en el resultado
function calcularPuntajeFinal() {
  var puntaje;

  puntaje = contadorPuntaje + BONUS_FINAL_PARTIDA;

  if (puntaje < 0) {
    puntaje = 0;
  }

  return puntaje;
}

// Genera el siguiente tablero del modo Elite: suma el bonus si se completó un tablero
// difícil y avanza a la siguiente etapa (facil -> medio -> dificil -> dificil...)
function avanzarEtapaElite() {
  var indiceSiguienteEtapa;

  if (eliteEtapaActual === "dificil") {
    contadorPuntaje = contadorPuntaje + BONUS_TABLERO_DIFICIL_ELITE;
  }

  eliteRondaActual = eliteRondaActual + 1;
  indiceSiguienteEtapa = eliteRondaActual - 1;

  if (indiceSiguienteEtapa < SECUENCIA_NIVELES_ELITE.length) {
    eliteEtapaActual = SECUENCIA_NIVELES_ELITE[indiceSiguienteEtapa];
  }

  contadorPares = 0;
  cartasSeleccionadas = [];
  tableroBloqueado = false;
  actualizarMarcadores();
  construirTablero(eliteEtapaActual);
}

// Revisa si ya se encontraron todos los pares del tablero actual. En modo Elite eso
// avanza al siguiente tablero; en el resto de los niveles, termina la partida
function verificarFinDePartida() {
  if (contadorPares < totalParesNivel) {
    return;
  }

  if (nivelActual === "elite") {
    avanzarEtapaElite();
    return;
  }

  detenerCronometro();
  contadorPuntaje = calcularPuntajeFinal();
  mostrarResultado();
}

// Compara las dos cartas elegidas
function compararCartasSeleccionadas() {
  var coincideNombre;

  carta1 = cartasSeleccionadas[0];
  carta2 = cartasSeleccionadas[1];
  coincideNombre = carta1.getAttribute("data-nombre") === carta2.getAttribute("data-nombre");

  // Si coinciden suma el par
  if (coincideNombre === true) {
    bloquearCarta(carta1);
    bloquearCarta(carta2);
    contadorPares = contadorPares + 1;

    if (nivelActual === "elite") {
      contadorPuntaje = contadorPuntaje + calcularPuntosParElite();
      segundosRestantesElite = segundosRestantesElite + SEGUNDOS_BONUS_POR_PAR_ELITE;
      actualizarMarcadorTiempoElite();
    } else {
      contadorPuntaje = calcularPuntaje();
    }

    cartasSeleccionadas = [];
    tableroBloqueado = false;
    actualizarMarcadores();
    verificarFinDePartida();
    return;
  }

  // Si no coinciden suma el error y oculta las cartas
  contadorErrores = contadorErrores + 1;

  if (nivelActual === "elite") {
    if (contadorErrores % ERRORES_POR_PENALIZACION_TIEMPO_ELITE === 0) {
      segundosRestantesElite = segundosRestantesElite - SEGUNDOS_PENALIZACION_ELITE;
      actualizarMarcadorTiempoElite();
    }
  } else {
    contadorPuntaje = calcularPuntaje();
  }

  marcarCartasIncorrectas();
  actualizarMarcadores();
  setTimeout(parIncorrecto, MILISEGUNDOS_ESPERA_ERROR);
}

// Evento click sobre una carta
function clickCarta(evento) {
  var carta;

  carta = evento.currentTarget;

  if (tableroBloqueado === true) {
    return;
  }

  // Si la carta ya estaba revelada no hago nada
  if (carta.classList.contains(CLASE_CARTA_REVELADA) === true) {
    return;
  }

  // Si la carta ya estaba marcada como correcta no hago nada
  if (carta.classList.contains(CLASE_CARTA_CORRECTA) === true) {
    return;
  }

  if (cronometroActivo !== true) {
    iniciarCronometro();
  }

  carta.src = carta.getAttribute("data-imagen");
  carta.alt = "Es " + carta.getAttribute("data-nombre");
  carta.classList.add(CLASE_CARTA_REVELADA);
  cartasSeleccionadas.push(carta);

  if (cartasSeleccionadas.length < 2) {
    return;
  }

  contadorIntentos = contadorIntentos + 1;
  actualizarMarcadores();
  tableroBloqueado = true; // Bloquea el tablero mientras muestra las cartas a comparar
  compararCartasSeleccionadas();
}

// Deja el modo Elite listo para empezar: ronda 1, etapa fácil y 120 segundos
function prepararTableroInicialElite() {
  eliteRondaActual = 1;
  eliteEtapaActual = SECUENCIA_NIVELES_ELITE[0];
  segundosRestantesElite = SEGUNDOS_INICIALES_ELITE;
  marcadorTiempo.textContent = formatearTiempo(segundosRestantesElite);
  construirTablero(eliteEtapaActual);
}

// Empieza una partida nueva con el nombre y nivel establecidos en el formulario
function iniciarPartida(nombre, nivel) {
  nombreJugador = nombre;
  nivelActual = nivel;

  marcadorNombre.textContent = nombre;
  marcadorNivel.textContent = CONFIGURACION_NIVELES[nivel].etiqueta;

  reiniciarEstadoPartida();

  if (nivel === "elite") {
    prepararTableroInicialElite();
    return;
  }

  construirTablero(nivel);
}

// Reinicia la partida manteniendo el mismo nombre y nivel
function reiniciarPartida() {
  detenerCronometro();
  reiniciarEstadoPartida();

  if (nivelActual === "elite") {
    prepararTableroInicialElite();
    return;
  }

  construirTablero(nivelActual);
}

// Frena el cronómetro al salir de la partida sin terminarla
function detenerPartida() {
  detenerCronometro();
}

// Busca los elementos del HTML al inicio
obtenerElementosJuego();