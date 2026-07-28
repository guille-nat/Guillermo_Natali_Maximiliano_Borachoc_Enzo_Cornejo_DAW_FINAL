# Memotest Pokémon

Juego de memoria desarrollado como Proyecto Final de la materia Desarrollo y Arquitecturas Web — Ingeniería en Sistemas Informáticos, UAI 2026.

## Descripción del juego

El juego presenta un tablero con cartas dadas vuelta. El jugador selecciona dos cartas por turno intentando encontrar los pares. Si coinciden, quedan descubiertas y suman puntos. Si no coinciden, vuelven a ocultarse luego de un breve intervalo y se aplica una penalización.

El objetivo es encontrar todos los pares en el menor tiempo posible, con la menor cantidad de intentos y obteniendo el mayor puntaje.

## Temática elegida

**Pokémon.** Las cartas muestran distintos Pokémon, y los colores, tipografías y estilos visuales de toda la aplicación acompañan esa temática.

## Reglas del juego

1. El jugador ingresa su nombre (mínimo 3 caracteres) y elige un nivel de dificultad antes de comenzar.
2. Las cartas se mezclan aleatoriamente y se muestran boca abajo.
3. Se seleccionan dos cartas por turno.
4. Si forman un par correcto: quedan descubiertas y suman puntos.
5. Si no forman par: se aplica penalización y las cartas vuelven a ocultarse.
6. Mientras dos cartas incorrectas están visibles, no se pueden seleccionar cartas nuevas.
7. La partida termina cuando se encuentran todos los pares del tablero.

### Niveles de dificultad

| Nivel | Tablero | Cartas | Pares | Penalización |
|---|---|---|---|---|
| Fácil | 4x4 | 16 | 8 | Baja |
| Medio | 4x5 | 20 | 10 | Media |
| Difícil | 6x6 | 36 | 18 | Alta |

### Modo Elite

Elite es un cuarto nivel, seleccionable desde el mismo formulario de inicio, con reglas propias:

- El cronómetro es regresivo: inicia en 2:00 (120 segundos).
- La partida no termina al completar un tablero: al encontrar todos los pares se pasa automáticamente al siguiente, sin recargar la página.
- La progresión de tableros es: fácil (4x4) → medio (4x5) → difícil (6x6) → difícil (6x6) → difícil (6x6)... A partir del tercer tablero, todos los siguientes son de nivel difícil.
- Cada par correcto suma 3 segundos al cronómetro.
- Cada 10 errores acumulados restan 5 segundos del cronómetro.
- La partida termina cuando el cronómetro llega a 0.

## Sistema de puntaje



| Concepto | Puntos |
|---|---|
| Par correcto | +100 |
| Error en nivel fácil | -10 |
| Error en nivel medio | -20 |
| Error en nivel difícil | -30 |
| Bonus por finalizar la partida | +300 |
| Penalización por tiempo | -1 por segundo transcurrido |

**Fórmula final:**

```
puntaje = (pares × 100) - (errores × penalizacionDelNivel) - segundos + 300
```

El puntaje se muestra y actualiza durante toda la partida, y nunca queda en valores incoherentes.

### Puntaje en modo Elite

Elite no usa la fórmula anterior: no penaliza por error ni por tiempo transcurrido los puntos, aunque sí penaliza por error el tiempo. En cambio:

- Cada par correcto suma `15 × rondaActual` puntos. La ronda arranca en 1 (primer tablero, fácil) y sube en 1 cada vez que se pasa a un tablero nuevo, así que los pares valen cada vez más a medida que avanza la partida.
- Cada vez que se completa un tablero difícil (6x6) se suman 150 puntos extra, sin importar cuántas veces se repita.

```
puntajePorPar = 15 × rondaActual
puntajeFinal = suma de todos los pares encontrados + 150 por cada tablero difícil completado
```


## Tecnologías

- HTML5
- CSS3 (Flexbox)
- JavaScript ES5 (`'use strict'`, sin frameworks ni librerías externas)

## Estructura del proyecto

```
/assets
  /images
  /sounds
/css
  reset.css
  estilos.css
/js
  main.js
  juego.js
  validaciones.js
  almacenamiento.js
/pages
  contacto.html
index.html
README.md
.gitignore
```

## Link a GitHub Pages



## Integrantes

- Guillermo Natali
- Enzo Cornejo
- Maximiliano Borachoc