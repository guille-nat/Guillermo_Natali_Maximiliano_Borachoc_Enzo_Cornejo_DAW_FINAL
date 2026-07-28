"use strict";

var CLASE_OCULTO = "oculto";
var LARGO_MINIMO_NOMBRE = 3;
var NIVELES_VALIDOS = ["facil", "medio", "dificil", "elite"];

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

  for (indice = 0; indice < NIVELES_VALIDOS.length; indice++) {
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

function esNombreContactoValido(nombre) {
  var nombreLimpio;
  var patronAlfanumerico;

  if (typeof nombre !== "string") {
    return false;
  }

  nombreLimpio = nombre.trim();
  patronAlfanumerico = /^[a-zA-Z0-9 ]+$/;

  return nombreLimpio.length > 0 && patronAlfanumerico.test(nombreLimpio) === true;
}

function esMailValido(mail) {
  var mailLimpio;
  var patronMail;

  if (typeof mail !== "string") {
    return false;
  }

  mailLimpio = mail.trim();
  patronMail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return patronMail.test(mailLimpio) === true;
}

function esMensajeValido(mensaje) {
  if (typeof mensaje !== "string") {
    return false;
  }

  return mensaje.trim().length > 5;
}

function validarFormularioContacto(nombre, mail, mensaje) {
  var nombreValido;
  var mailValido;
  var mensajeValido;

  nombreValido = esNombreContactoValido(nombre);
  mailValido = esMailValido(mail);
  mensajeValido = esMensajeValido(mensaje);

  if (nombreValido === true) {
    ocultarError("errorContactoNombre");
  } else {
    mostrarError("errorContactoNombre");
  }

  if (mailValido === true) {
    ocultarError("errorContactoMail");
  } else {
    mostrarError("errorContactoMail");
  }

  if (mensajeValido === true) {
    ocultarError("errorContactoMensaje");
  } else {
    mostrarError("errorContactoMensaje");
  }

  return nombreValido === true && mailValido === true && mensajeValido === true;
}

function crearEnlaceMailto(nombre, mail, mensaje) {
  var asunto;
  var cuerpo;

  asunto = encodeURIComponent("Consulta Memotest Pokemon");
  cuerpo = encodeURIComponent(
    "Nombre: " + nombre.trim() + "\n" +
    "Mail: " + mail.trim() + "\n\n" +
    mensaje.trim()
  );

  return "mailto:?subject=" + asunto + "&body=" + cuerpo;
}

function manejarEnvioContacto(evento) {
  var entradaNombreContacto;
  var entradaMailContacto;
  var entradaMensajeContacto;
  var nombre;
  var mail;
  var mensaje;

  evento.preventDefault();

  entradaNombreContacto = document.getElementById("contactoNombre");
  entradaMailContacto = document.getElementById("contactoMail");
  entradaMensajeContacto = document.getElementById("contactoMensaje");

  nombre = entradaNombreContacto.value;
  mail = entradaMailContacto.value;
  mensaje = entradaMensajeContacto.value;

  if (validarFormularioContacto(nombre, mail, mensaje) === true) {
    window.location.href = crearEnlaceMailto(nombre, mail, mensaje);
  }
}

function iniciarFormularioContacto() {
  var formularioContacto;

  formularioContacto = document.getElementById("formularioContacto");

  if (formularioContacto !== null) {
    formularioContacto.addEventListener("submit", manejarEnvioContacto);
  }
}

iniciarFormularioContacto();
