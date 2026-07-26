// Constantes con los elementos del HTML
var ID_TABLERO = "tablero";
var ID_MARCADOR_NOMBRE = "marcadorNombre";
var ID_MARCADOR_NIVEL = "marcadorNivel";

// Constantes con los elementos del CSS
var CLASE_CARTA = "carta";
var CLASE_CARTA_REVELADA = "carta-revelada";

// Texto alternativo mientras la carta todavía no fue revelada
var TEXTO_ALT_OCULTA = "¿Quién es ese Pokémon?";

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

// Configuración de cada nivel: tamaño del tablero, cantidad de pares
// y la imagen que se usa como carta boca abajo
var CONFIGURACION_NIVELES = {
  facil: { etiqueta: "Fácil", columnas: 4, pares: 8, claseTablero: "tablero-facil", imagenDorso: RUTA_IMAGENES + "pokebola.png" },
  medio: { etiqueta: "Medio", columnas: 4, pares: 10, claseTablero: "tablero-medio", imagenDorso: RUTA_IMAGENES + "superbola.png" },
  dificil: { etiqueta: "Difícil", columnas: 6, pares: 18, claseTablero: "tablero-dificil", imagenDorso: RUTA_IMAGENES + "ultrabola.png" }
};

// Referencias a los elementos del HTML (se completan en obtenerElementos)
var tablero;
var marcadorNombre;
var marcadorNivel;

// Datos de la partida en curso
var nombreJugador;
var nivelActual;
var totalParesNivel;

// Busca en el DOM los elementos que el juego necesita y los guarda en las variables globales
function obtenerElementosJuego() {
  tablero = document.getElementById(ID_TABLERO);
  marcadorNombre = document.getElementById(ID_MARCADOR_NOMBRE);
  marcadorNivel = document.getElementById(ID_MARCADOR_NIVEL);
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

// Evento click sobre una carta
function clickCarta(evento) {
  var carta;

  carta = evento.currentTarget;

  // Si la carta ya estaba revelada no hago nada
  if (carta.classList.contains(CLASE_CARTA_REVELADA) === true) {
    return;
  }

  // Al dar vuelta la carta, muestro el nombre del Pokémon
  carta.src = carta.getAttribute("data-imagen");
  carta.alt = "Es " + carta.getAttribute("data-nombre");
  carta.classList.add(CLASE_CARTA_REVELADA);
}

// Empieza una partida nueva con el nombre y nivel establecidos en el formulario
function iniciarPartida(nombre, nivel) {
  nombreJugador = nombre;
  nivelActual = nivel;

  marcadorNombre.textContent = nombre;
  marcadorNivel.textContent = CONFIGURACION_NIVELES[nivel].etiqueta;

  construirTablero(nivel);
}

// Busca los elementos del HTML al inicio
obtenerElementosJuego();