# INFORME TÉCNICO: DESAFÍO DE MÉTODOS NUMÉRICOS
## Misión Espacial: Cálculo del Ascenso de un Cohete mediante el Método de Euler y Comparación con Solución Analítica

---

### Datos del Proyecto
- **Asignatura:** Métodos Numéricos
- **Misión de Referencia:** Mercury-Atlas 6 (1962) / Contexto *Talentos Ocultos* (Hidden Figures)
- **Repositorio de Código:** [https://github.com/BlankS0800/desafio-cohete.git](https://github.com/BlankS0800/desafio-cohete.git)

---

## 1. Contexto Histórico e Introducción

En 1962, durante el apogeo de la carrera espacial, la misión **Mercury-Atlas 6** puso en órbita por primera vez a un astronauta estadounidense, John Glenn. En aquella época, la computación electrónica mediante mainframes (como la IBM 7090) estaba en sus primeras etapas y era propensa a fallos de cálculo o redondeo. Por este motivo, el trabajo de matemáticas como **Katherine Johnson** y sus colegas del Centro de Investigación Langley de la NASA fue fundamental: ellas verificaban a mano, paso a paso, las trayectorias de lanzamiento, las ventanas de inserción orbital y las maniobras críticas de reentrada.

En este desafío académico se formula un modelo didáctico de ascenso vertical de un cohete propulsado con resistencia aerodinámica lineal. El objetivo central es aplicar el **Método de Euler** para resolver el sistema de ecuaciones diferenciales resultante, deducir la **Solución Analítica Exacta**, evaluar los errores numéricos producidos por el tamaño de paso $h$ y comparar su desempeño frente a métodos de orden superior (**Heun** y **Runge-Kutta 4**).

---

## 2. Parámetros y Formulación del Modelo Físico-Matemático

### 2.1. Tabla de Parámetros del Cohete Experimental
| Parámetro | Símbolo | Valor | Unidades |
|:---|:---:|:---:|:---:|
| Masa constante del cohete | $m$ | $1000$ | $\text{kg}$ |
| Empuje constante del motor | $T$ | $15000$ | $\text{N}$ |
| Aceleración gravitacional | $g$ | $9.81$ | $\text{m/s}^2$ |
| Coeficiente de resistencia aerodinámica | $k$ | $100$ | $\text{kg/s}$ |
| Velocidad inicial | $v(0)$ | $0.00$ | $\text{m/s}$ |
| Altura inicial | $y(0)$ | $0.00$ | $\text{m}$ |
| Intervalo temporal | $t$ | $[0, 20]$ | $\text{s}$ |
| Paso de simulación base | $h$ | $2.00$ | $\text{s}$ |

### 2.2. Ecuaciones Diferenciales
Se adopta la convención en la que el eje vertical apunta hacia arriba ($+y$). La velocidad $v(t)$ y la altura $y(t)$ son positivas en ascenso. La fuerza de resistencia aerodinámica se opone al movimiento ($F_r = kv$ hacia abajo).

Por la Segunda Ley de Newton:
$$\Sigma F_y = m \frac{dv}{dt} = T - mg - kv$$

Dividiendo entre la masa $m$:
$$\frac{dv}{dt} = \frac{T}{m} - g - \frac{k}{m}v$$

Sustituyendo los valores numéricos:
$$\frac{dv}{dt} = \frac{15000}{1000} - 9.81 - \frac{100}{1000}v = 15 - 9.81 - 0.1v = 5.19 - 0.1v$$

Puesto que la velocidad es la derivada de la posición con respecto al tiempo:
$$\frac{dy}{dt} = v$$

Se obtiene el sistema de ecuaciones diferenciales acoplado:
$$\begin{cases} 
\frac{dv}{dt} = 5.19 - 0.1v, & v(0) = 0 \\
\frac{dy}{dt} = v, & y(0) = 0
\end{cases}$$

---

## 3. Deducción de la Solución Analítica

### 3.1. Ecuación de la Velocidad
Reescribiendo la ecuación diferencial por separación de variables:
$$\frac{dv}{5.19 - 0.1v} = dt$$

Multiplicando numerador y denominador por $-10$:
$$\frac{-0.1 dv}{5.19 - 0.1v} = -0.1 dt$$

Integrando ambos miembros:
$$\ln|5.19 - 0.1v| = -0.1t + C$$
$$5.19 - 0.1v = C_1 e^{-0.1t}$$

Despejando $v(t)$:
$$0.1v = 5.19 - C_1 e^{-0.1t} \implies v(t) = 51.9 - 10C_1 e^{-0.1t}$$

Aplicando la condición inicial $v(0) = 0$:
$$0 = 51.9 - 10C_1 \implies 10C_1 = 51.9$$

Por lo tanto:
$$\mathbf{v(t) = 51.9\left(1 - e^{-0.1t}\right)}$$

*Velocidad terminal ($t \to \infty$):* $v_{\infty} = 51.9\text{ m/s}$.

### 3.2. Ecuación de la Altura
Integrando la velocidad con respecto al tiempo:
$$y(t) = \int v(t) dt = \int 51.9\left(1 - e^{-0.1t}\right) dt = 51.9t + \frac{51.9}{0.1} e^{-0.1t} + C_2 = 51.9t + 519 e^{-0.1t} + C_2$$

Aplicando la condición inicial $y(0) = 0$:
$$0 = 51.9(0) + 519 e^0 + C_2 \implies C_2 = -519$$

Reagrupando términos:
$$\mathbf{y(t) = 51.9t - 519\left(1 - e^{-0.1t}\right)}$$

### 3.3. Evaluación Analítica Exacta en $t = 20\text{ s}$
Para $t = 20\text{ s}$:
- $e^{-0.1(20)} = e^{-2} \approx 0.135335$
- $1 - e^{-2} \approx 0.864665$

Cálculos:
$$v(20) = 51.9 \times (0.864665) = \mathbf{44.8761\text{ m/s}}$$
$$y(20) = 51.9 \times (20) - 519 \times (0.864665) = 1038 - 448.7610 = \mathbf{589.2390\text{ m}}$$

---

## 4. Método de Euler: Formulación e Iteraciones Manuales

El esquema de Euler explícito para el sistema es:
$$v_{n+1} = v_n + h(5.19 - 0.1v_n)$$
$$y_{n+1} = y_n + h v_n$$

Con paso $h = 2\text{ s}$:

### Desarrollo paso a paso:
1. **Instante $t_0 = 0\text{ s}$:**
   $$v_0 = 0\text{ m/s}, \quad y_0 = 0\text{ m}$$

2. **Iteración 1 ($t_1 = 2\text{ s}$):**
   $$v_1 = 0 + 2\cdot[5.19 - 0.1(0)] = 2 \times 5.19 = \mathbf{10.3800\text{ m/s}}$$
   $$y_1 = 0 + 2 \times (0) = \mathbf{0.0000\text{ m}}$$

3. **Iteración 2 ($t_2 = 4\text{ s}$):**
   $$v_2 = 10.38 + 2\cdot[5.19 - 0.1(10.38)] = 10.38 + 2(4.152) = \mathbf{18.6840\text{ m/s}}$$
   $$y_2 = 0 + 2 \times (10.38) = \mathbf{20.7600\text{ m}}$$

4. **Iteración 3 ($t_3 = 6\text{ s}$):**
   $$v_3 = 18.684 + 2\cdot[5.19 - 0.1(18.684)] = 18.684 + 2(3.3216) = \mathbf{25.3272\text{ m/s}}$$
   $$y_3 = 20.76 + 2 \times (18.684) = \mathbf{58.1280\text{ m}}$$

---

## 5. Tabla Completa de Resultados y Comparación ($h = 2\text{ s}$)

| $t$ (s) | $v_{\text{Euler}}$ (m/s) | $v_{\text{Analítica}}$ (m/s) | Error Abs. $v$ (m/s) | $y_{\text{Euler}}$ (m) | $y_{\text{Analítica}}$ (m) | Error Abs. $y$ (m) |
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

### Análisis de Errores:
- En velocidad, Euler **sobreestima** el valor ($46.3273 > 44.8761$) porque calcula la aceleración al inicio del intervalo, cuando la resistencia aerodinámica aún es menor que durante el resto del intervalo.
- En altura, Euler **subestima** el valor ($574.7272 < 589.2390$) porque utiliza la velocidad inicial de cada tramo, retrasando la acumulación de altura (notablemente $y(2)=0$ a pesar de que el cohete ya aceleraba).

---

## 6. Estudio de Convergencia: Variación del Tamaño de Paso $h$

| Paso $h$ | $v_{\text{Euler}}(20)$ (m/s) | Error Abs. $v$ (m/s) | $y_{\text{Euler}}(20)$ (m) | Error Abs. $y$ (m) |
|:---:|:---:|:---:|:---:|:---:|
| **2.00 s** | 46.3273 | 1.4512 | 574.7272 | 14.5118 |
| **1.00 s** | 45.5902 | 0.7141 | 582.0983 | 7.1407 |
| **0.50 s** | 45.2302 | 0.3541 | 585.6978 | 3.5412 |
| **0.25 s** | 45.0524 | 0.1763 | 587.4757 | 1.7633 |
| **Exacta** | **44.8761** | **0.0000** | **589.2390** | **0.0000** |

*Observación:* Reducir el paso a la mitad disminuye el error aproximadamente a la mitad. Esto confirma experimentalmente que el Método de Euler es de **primer orden de convergencia: $\mathcal{O}(h)$**.

---

## 7. Parte C: Ampliación (Comparación con Heun y Runge-Kutta 4)

Para el mismo paso $h = 2\text{ s}$ en $t = 20\text{ s}$:

| Método | Tipo / Orden | Velocidad (m/s) | Error Vel. (m/s) | Altura (m) | Error Alt. (m) |
|:---|:---:|:---:|:---:|:---:|:---:|
| **Solución Analítica** | Exacta | 44.8761 | 0.000000 | 589.2390 | 0.000000 |
| **Runge-Kutta 4 (RK4)** | Orden 4 [$\mathcal{O}(h^4)$] | 44.8759 | **0.000221** | 589.2412 | **0.002214** |
| **Método de Heun** | Orden 2 [$\mathcal{O}(h^2)$] | 44.7664 | **0.109721** | 590.3355 | **1.096472** |
| **Método de Euler** | Orden 1 [$\mathcal{O}(h)$] | 46.3273 | **1.451221** | 574.7272 | **14.511786** |

### Explicación:
- **Heun** promedia la pendiente inicial y la predicha al final del intervalo, reduciendo el error en un factor cuadrático.
- **RK4** evalúa cuatro pendientes intermedias ponderadas (método de Simpson continuo). Su error en velocidad es de apenas **$0.0002\text{ m/s}$**, siendo más de 6500 veces más preciso que Euler con el mismo tamaño de paso.

---

## 8. Parte D: Interpretación y Reflexión (Respuestas Breves y Simplificadas)

1. **¿Por qué era importante verificar cálculos de trayectoria antes de una misión espacial tripulada?**  
   Porque la vida de los astronautas dependía de ello: cualquier desviación de órbita o de ángulo en la reentrada provocaría que la cápsula se destruyera o se perdiera en el espacio.

2. **¿Qué riesgos numéricos puede producir un paso demasiado grande?**  
   Produce gran pérdida de precisión, acumulación severa de errores y puede volver el método inestable, arrojando resultados absurdos o divergentes.

3. **¿Por qué una aproximación aparentemente razonable puede acumular errores?**  
   Porque Euler asume derivadas constantes durante todo el paso; al usar el valor del punto anterior para calcular el siguiente, el error se arrastra y crece en cada iteración.

4. **¿Qué fenómenos reales no contempla el modelo?**  
   No contempla la pérdida de masa por quemado de combustible, el empuje variable, la disminución del aire con la altura, el viento ni el movimiento en 2D/3D con curvatura terrestre.

5. **¿Por qué una trayectoria orbital o lunar requiere modelos más complejos que este ascenso vertical?**  
   Porque entran en juego la gravedad variable en 3D de varios cuerpos celestes (Tierra, Luna, Sol), la rotación terrestre, la relatividad y trayectorias curvas en el espacio.

---

## 9. Conclusiones

1. El Método de Euler es conceptualmente intuitivo y fácil de implementar, pero su precisión depende fuertemente de pasos pequeños ($h \ll 1$), lo que eleva el costo de cómputo y el error de redondeo acumulativo.
2. Para simulaciones críticas de ingeniería y astronáutica, esquemas de orden superior como Runge-Kutta 4 (RK4) son indispensables, logrando precisión milimétrica incluso con pasos temporales relativamente amplios.
3. La verificación cruzada e independiente de cálculos fue la clave del éxito en los programas espaciales tripulados de la NASA, resaltando la trascendencia del rigor matemático en la ingeniería.
