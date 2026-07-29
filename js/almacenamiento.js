"use strict";

var CLAVE_RANKING_PARTIDAS = "memotestPokemonRanking";

// Lee el ranking guardado en LocalStorage. Si no hay nada guardado o el
// contenido está corrupto, devuelve un array vacío
function obtenerRankingGuardado() {
  var textoRanking;
  var ranking;

  textoRanking = localStorage.getItem(CLAVE_RANKING_PARTIDAS);

  if (textoRanking === null || textoRanking === "") {
    return [];
  }

  try {
    ranking = JSON.parse(textoRanking);
  } catch (error) {
    ranking = [];
  }

  if (Object.prototype.toString.call(ranking) !== "[object Array]") {
    return [];
  }

  return ranking;
}

// Guarda el ranking completo en LocalStorage
function guardarRanking(ranking) {
  localStorage.setItem(CLAVE_RANKING_PARTIDAS, JSON.stringify(ranking));
}

// Borra todo el historial de partidas guardado
function borrarRankingGuardado() {
  localStorage.removeItem(CLAVE_RANKING_PARTIDAS);
}
