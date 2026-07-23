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