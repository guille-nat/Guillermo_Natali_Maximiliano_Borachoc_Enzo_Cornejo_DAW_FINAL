"use strict";

var CLASE_OCULTO = "oculto";
var LARGO_MINIMO_NOMBRE = 3;
var NIVELES_VALIDOS = ["facil", "medio", "dificil"];

function esNombreValido(nombre) {
  var nombreLimpio;

  if (typeof nombre !== "string") {
    return false;
  }

  nombreLimpio = nombre.trim();

  return nombreLimpio.length >= LARGO_MINIMO_NOMBRE;
}

function esNivelValido(nivel) {
  var indice;

  if (typeof nivel !== "string") {
    return false;
  }

  for (indice = 0; indice < NIVELES_VALIDOS.length; indice = indice++) {
    if (NIVELES_VALIDOS[indice] === nivel) {
      return true;
    }
  }

  return false;
}

function mostrarError(idElemento) {
  var elemento;

  elemento = document.getElementById(idElemento);

  if (elemento !== null) {
    elemento.classList.remove(CLASE_OCULTO);
  }
}

function ocultarError(idElemento) {
  var elemento;

  elemento = document.getElementById(idElemento);

  if (elemento !== null) {
    elemento.classList.add(CLASE_OCULTO);
  }
}

function validarFormularioInicio(nombre, nivel) {
  var nombreValido;
  var nivelValido;

  nombreValido = esNombreValido(nombre);
  nivelValido = esNivelValido(nivel);

  if (nombreValido === true) {
    ocultarError("errorNombre");
  } else {
    mostrarError("errorNombre");
  }

  if (nivelValido === true) {
    ocultarError("errorNivel");
  } else {
    mostrarError("errorNivel");
  }

  return nombreValido === true && nivelValido === true;
}
