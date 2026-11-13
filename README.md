# 🚀 Desafío de Métodos Numéricos: Ascenso de un Cohete (Método de Euler)

[![Simulación Web](https://img.shields.io/badge/Demo-HTML5%20%2F%20JS-blue.svg)](index.html)
[![Métodos Numéricos](https://img.shields.io/badge/Métodos-Euler%20%7C%20Heun%20%7C%20RK4-green.svg)](#)
[![Licencia](https://img.shields.io/badge/Licencia-Educativa-orange.svg)](#)

Proyecto académico interactivo para modelar y simular el ascenso vertical de un cohete espacial experimental (inspirado en la misión **Mercury-Atlas 6** de 1962 y en la película *Talentos Ocultos* / *Hidden Figures*). Se resuelve el sistema de ecuaciones diferenciales mediante el **Método de Euler**, **Método de Heun** y **Runge-Kutta de 4.° Orden (RK4)**, comparándolos rigurosamente contra la **Solución Analítica Exacta**.

---

## 📋 Contenido del Repositorio

- **`index.html`**: Interfaz de usuario interactiva y moderna para la simulación del vuelo.
- **`style.css`**: Hoja de estilos con diseño aeroespacial responsivo y temas de alto contraste.
- **`app.js`**: Motor de cálculo numérico (Euler, Heun, RK4, Analítica), validaciones y renderizado de gráficos con Chart.js.
- **`INFORME.md`**: Informe técnico completo de la actividad evaluativa.
- **`informe_desafio_cohete.pdf`**: Documento formal en formato PDF listo para entrega académica.

---

## 🧮 1. Formulación del Modelo Físico-Matemático

### Diagrama de Fuerzas y Segunda Ley de Newton
Definiendo el sentido positivo hacia arriba ($+y$):
$$\Sigma F_y = T - mg - kv = m \frac{dv}{dt}$$

Sustituyendo los parámetros nominales ($m = 1000\text{ kg}$, $T = 15000\text{ N}$, $g = 9.81\text{ m/s}^2$, $k = 100\text{ kg/s}$):
$$\frac{dv}{dt} = \frac{15000}{1000} - 9.81 - \frac{100}{1000}v = 5.19 - 0.1v$$
$$\frac{dy}{dt} = v$$

**Condiciones iniciales:** $v(0) = 0\text{ m/s}$, $y(0) = 0\text{ m}$.

---

## 📐 2. Solución Analítica Exacta

### Ecuación de Velocidad (Separación de variables):
$$\frac{dv}{5.19 - 0.1v} = dt \implies -10 \ln|5.19 - 0.1v| = t + C$$
Aplicando $v(0) = 0$:
$$v(t) = 51.9\left(1 - e^{-0.1t}\right)$$
*Velocidad terminal teórica:* $v_{\infty} = 51.9\text{ m/s}$.

### Ecuación de Altura (Integración directa):
$$y(t) = \int_{0}^{t} 51.9\left(1 - e^{-0.1\tau}\right) d\tau = 51.9t - 519\left(1 - e^{-0.1t}\right)$$

A $t = 20\text{ s}$:
- $v(20) = 51.9\left(1 - e^{-2}\right) \approx \mathbf{44.8761\text{ m/s}}$
- $y(20) = 1038 - 519\left(1 - e^{-2}\right) \approx \mathbf{589.2390\text{ m}}$

---

## 🔢 3. Fórmulas de Euler y Desarrollo Manual ($h = 2\text{ s}$)

$$v_{n+1} = v_n + h(5.19 - 0.1v_n)$$
$$y_{n+1} = y_n + h v_n$$

- **$t_0 = 0\text{ s}$:** $v_0 = 0\text{ m/s}$, $y_0 = 0\text{ m}$
- **$t_1 = 2\text{ s}$:**  
  $v_1 = 0 + 2(5.19 - 0.1 \times 0) = \mathbf{10.3800\text{ m/s}}$  
  $y_1 = 0 + 2(0) = \mathbf{0.0000\text{ m}}$
- **$t_2 = 4\text{ s}$:**  
  $v_2 = 10.38 + 2(5.19 - 0.1 \times 10.38) = \mathbf{18.6840\text{ m/s}}$  
  $y_2 = 0 + 2(10.38) = \mathbf{20.7600\text{ m}}$
- **$t_3 = 6\text{ s}$:**  
  $v_3 = 18.684 + 2(5.19 - 0.1 \times 18.684) = \mathbf{25.3272\text{ m/s}}$  
  $y_3 = 20.76 + 2(18.684) = \mathbf{58.1280\text{ m}}$

### Tabla Resumen a los 20 segundos ($h = 2\text{ s}$):
| Tiempo $t$ (s) | $v_{\text{Euler}}$ (m/s) | $v_{\text{Analítica}}$ (m/s) | Error $v$ (m/s) | $y_{\text{Euler}}$ (m) | $y_{\text{Analítica}}$ (m) | Error $y$ (m) |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 0 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 | 0.0000 |
| 2 | 10.3800 | 9.4079 | 0.9721 | 0.0000 | 9.7213 | 9.7213 |
| 4 | 18.6840 | 17.1104 | 1.5736 | 20.7600 | 36.4961 | 15.7361 |
| 6 | 25.3272 | 23.4167 | 1.9105 | 58.1280 | 77.2332 | 19.1052 |
| 8 | 30.6418 | 28.5798 | 2.0619 | 108.7824 | 129.4017 | 20.6193 |
| 10 | 34.8934 | 32.8070 | 2.0864 | 170.0659 | 190.9295 | 20.8635 |
| 12 | 38.2947 | 36.2679 | 2.0267 | 239.8527 | 260.1199 | 20.2671 |
| 14 | 41.0158 | 39.1012 | 1.9142 | 316.4422 | 335.5842 | 19.1416 |
| 16 | 43.1926 | 41.4215 | 1.7711 | 398.4738 | 416.1843 | 17.7105 |
| 18 | 44.9341 | 43.3210 | 1.6131 | 484.8590 | 500.9902 | 16.1311 |
| **20** | **46.3273** | **44.8761** | **1.4512** | **574.7272** | **589.2390** | **14.5118** |

---

## 📊 4. Efecto del Tamaño de Paso $h$ ($t = 20\text{ s}$)

| Paso $h$ | $v_{\text{Euler}}$ (m/s) | Error Vel. (m/s) | $y_{\text{Euler}}$ (m) | Error Alt. (m) |
|:---:|:---:|:---:|:---:|:---:|
| **2 s** | 46.3273 | 1.4512 | 574.7272 | 14.5118 |
| **1 s** | 45.5902 | 0.7141 | 582.0983 | 7.1407 |
| **0.5 s** | 45.2302 | 0.3541 | 585.6978 | 3.5412 |
| **0.25 s** | 45.0524 | 0.1763 | 587.4757 | 1.7633 |
| **Exacta**| **44.8761** | **0.0000** | **589.2390** | **0.0000** |

*Conclusión del paso:* Al reducir el paso a la mitad, el error de Euler se reduce aproximadamente a la mitad, confirmando que es un método de orden 1 ($\mathcal{O}(h)$).

---

## 🔬 5. Parte C: Comparación con Heun y RK4 ($h = 2\text{ s}$, $t = 20\text{ s}$)

| Método | Orden | Velocidad (m/s) | Error Vel. (m/s) | Altura (m) | Error Alt. (m) |
|:---|:---:|:---:|:---:|:---:|:---:|
| **Solución Exacta** | — | 44.8761 | 0.000000 | 589.2390 | 0.000000 |
| **Runge-Kutta 4 (RK4)**| 4 | 44.8759 | **0.000221** | 589.2412 | **0.002214** |
| **Heun (RK2)** | 2 | 44.7664 | **0.109721** | 590.3355 | **1.096472** |
| **Euler** | 1 | 46.3273 | **1.451221** | 574.7272 | **14.511786** |

**Conclusión:** RK4 obtiene un error casi nulo incluso con un paso grande de $h = 2\text{ s}$ gracias a que evalúa cuatro pendientes intermedias ponderadas ($\mathcal{O}(h^4)$).

---

## 💡 6. Parte D: Preguntas de Interpretación y Reflexión (Respuestas Breves)

1. **¿Por qué era importante verificar cálculos de trayectoria antes de una misión espacial tripulada?**  
   Porque la vida de los astronautas dependía de ello: cualquier error en la órbita o en el ángulo de reentrada causaba que la nave se quemara o se perdiera en el espacio.

2. **¿Qué riesgos numéricos puede producir un paso demasiado grande?**  
   Genera pérdida severa de precisión, acumulación de error e inestabilidad numérica, arrojando valores irreales o divergentes.

3. **¿Por qué una aproximación aparentemente razonable puede acumular errores?**  
   Porque asume aceleración constante en cada paso; al usar un valor anterior con error para calcular el siguiente, el error se arrastra y crece con el tiempo.

4. **¿Qué fenómenos reales no contempla el modelo?**  
   No considera el consumo de combustible (la masa disminuye), el empuje variable, la variación de la atmósfera con la altura, el viento ni trayectorias curvas.

5. **¿Por qué una trayectoria orbital o lunar requiere modelos más complejos que este ascenso vertical?**  
   Porque intervienen la gravedad 3D de varios cuerpos (Tierra, Luna y Sol), la rotación terrestre, curvatura espacial y cambios continuos de ángulo de vuelo.

---

## 🎬 7. Guion para el Video Explicativo (Máx. 2 Minutos)

- **0:00 - 0:25 (Introducción):** Presentación personal, contexto de la misión espacial Mercury de 1962 y mención al papel histórico de Katherine Johnson en *Hidden Figures*.
- **0:25 - 0:55 (Modelo y Matemáticas):** Explicación rápida de las ecuaciones diferenciales $v' = 5.19 - 0.1v$ y $y' = v$, la solución analítica exacta y las fórmulas de Euler.
- **0:55 - 1:35 (Demostración de la App):** Mostrar la interfaz web en vivo: probar $h=2\text{ s}$ viendo los errores de $1.45\text{ m/s}$ y $14.51\text{ m}$, pulsar $h=0.25\text{ s}$ para evidenciar la reducción de error, y mostrar la tabla de Heun y RK4.
- **1:35 - 2:00 (Conclusión):** Reflexión final sobre el compromiso entre precisión y costo computacional, y la importancia crítica de validar antes de volar.

---

## 💻 8. Instrucciones de Ejecución

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/BlankS0800/desafio-cohete.git
   ```
2. Abrir el archivo `index.html` directamente en cualquier navegador web moderno (Google Chrome, Firefox, Edge, Safari). No requiere instalación de dependencias ni servidor backend.
3. Para correr con un servidor local ligero (opcional):
   ```bash
   # Con Python
   python -m http.server 8000
   ```
   Luego ingresar en el navegador a `http://localhost:8000`.
