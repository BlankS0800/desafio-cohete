// Misión Espacial 1962 - Simulación de Ascenso de Cohete
// Métodos Numéricos: Euler, Heun, RK4 y Solución Analítica

document.addEventListener('DOMContentLoaded', () => {
  // Elementos DOM
  const form = document.getElementById('sim-form');
  const errorMsg = document.getElementById('error-msg');
  const btnExportCsv = document.getElementById('btn-export-csv');
  const presetButtons = document.querySelectorAll('.btn-chip');

  // Stats DOM
  const statVfEuler = document.getElementById('stat-vf-euler');
  const statVfExact = document.getElementById('stat-vf-exact');
  const statVfErr = document.getElementById('stat-vf-err');

  const statYfEuler = document.getElementById('stat-yf-euler');
  const statYfExact = document.getElementById('stat-yf-exact');
  const statYfErr = document.getElementById('stat-yf-err');

  const statVterm = document.getElementById('stat-vterm');
  const statPctTerm = document.getElementById('stat-pct-term');

  // Tablas DOM
  const resultsBody = document.getElementById('results-body');
  const methodsSummaryBody = document.getElementById('methods-summary-body');

  // Gráficas Chart.js
  let velocityChart = null;
  let heightChart = null;

  // Manejo de botones predefinidos de h
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('step').value = btn.dataset.h;
      runSimulation();
    });
  });

  // Manejador del formulario
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    runSimulation();
  });

  // Exportar a CSV
  btnExportCsv.addEventListener('click', () => {
    exportTableToCSV('simulacion_cohete_euler.csv');
  });

  // Ejecución inicial automática
  runSimulation();

  function runSimulation() {
    errorMsg.style.display = 'none';
    errorMsg.textContent = '';

    // Lectura de parámetros
    const m = parseFloat(document.getElementById('mass').value);
    const T = parseFloat(document.getElementById('thrust').value);
    const g = parseFloat(document.getElementById('gravity').value);
    const k = parseFloat(document.getElementById('drag').value);
    const v0 = parseFloat(document.getElementById('v0').value);
    const y0 = parseFloat(document.getElementById('y0').value);
    const tf = parseFloat(document.getElementById('tfinal').value);
    const h = parseFloat(document.getElementById('step').value);

    // Validaciones estrictas
    if (isNaN(m) || m <= 0) {
      showError('Error: La masa del cohete debe ser un número positivo mayor que cero.');
      return;
    }
    if (isNaN(tf) || tf <= 0) {
      showError('Error: El tiempo final de simulación debe ser mayor que cero.');
      return;
    }
    if (isNaN(h) || h <= 0) {
      showError('Error: El tamaño del paso temporal (h) debe ser mayor que cero.');
      return;
    }
    if (h > tf) {
      showError('Error: El paso temporal (h) no puede ser mayor que el tiempo final (tf).');
      return;
    }

    // Funciones del modelo
    // dv/dt = f(t, v) = (T - m*g - k*v) / m
    const f = (t, v) => (T - m * g - k * v) / m;
    
    // Solución analítica para dv/dt = A - B*v
    // A = (T - m*g)/m, B = k/m
    const A = (T - m * g) / m;
    const B = k / m;

    const analytical = (t) => {
      if (Math.abs(B) < 1e-12) {
        // Sin fricción (aceleración constante)
        const v = v0 + A * t;
        const y = y0 + v0 * t + 0.5 * A * t * t;
        return { v, y };
      } else {
        // Con fricción lineal
        const vTerm = A / B;
        const expTerm = Math.exp(-B * t);
        const v = vTerm + (v0 - vTerm) * expTerm;
        const y = y0 + vTerm * t + ((v0 - vTerm) / B) * (1 - expTerm);
        return { v, y, vTerm };
      }
    };

    // 1. Simulación Euler
    const eulerData = computeEuler(v0, y0, tf, h, f);

    // 2. Simulación Heun (Parte C)
    const heunData = computeHeun(v0, y0, tf, h, f);

    // 3. Simulación RK4 (Parte C)
    const rk4Data = computeRK4(v0, y0, tf, h, f);

    // Actualizar Resumen a tf
    const lastEuler = eulerData[eulerData.length - 1];
    const lastExact = analytical(lastEuler.t);

    const errVf = Math.abs(lastEuler.v - lastExact.v);
    const errYf = Math.abs(lastEuler.y - lastExact.y);

    statVfEuler.textContent = `${lastEuler.v.toFixed(4)} m/s`;
    statVfExact.textContent = `${lastExact.v.toFixed(4)} m/s`;
    statVfErr.textContent = `${errVf.toFixed(4)} m/s (${((errVf / lastExact.v) * 100).toFixed(2)}%)`;

    statYfEuler.textContent = `${lastEuler.y.toFixed(4)} m`;
    statYfExact.textContent = `${lastExact.y.toFixed(4)} m`;
    statYfErr.textContent = `${errYf.toFixed(4)} m (${((errYf / lastExact.y) * 100).toFixed(2)}%)`;

    const vTermTheoretical = B > 0 ? A / B : 'N/A (sin fricción)';
    if (B > 0) {
      statVterm.textContent = `${vTermTheoretical.toFixed(2)} m/s`;
      const pctVterm = ((lastExact.v / vTermTheoretical) * 100).toFixed(1);
      statPctTerm.textContent = `${pctVterm}% de v_∞ alcanzada a t = ${tf}s`;
    } else {
      statVterm.textContent = 'Infinito';
      statPctTerm.textContent = 'Aceleración continua sin resistencia';
    }

    // Actualizar Tabla de Métodos (Parte C)
    updateMethodsSummaryTable(lastExact, lastEuler, heunData[heunData.length - 1], rk4Data[rk4Data.length - 1]);

    // Actualizar Tabla Detallada Euler
    updateDetailedTable(eulerData, analytical);

    // Actualizar Gráficas
    updateCharts(eulerData, heunData, rk4Data, analytical);
  }

  function computeEuler(v0, y0, tf, h, f) {
    const data = [];
    let t = 0;
    let v = v0;
    let y = y0;

    data.push({ t, v, y });

    const totalSteps = Math.round(tf / h);
    for (let i = 0; i < totalSteps; i++) {
      const vNext = v + h * f(t, v);
      const yNext = y + h * v;
      t = (i + 1) * h;
      v = vNext;
      y = yNext;
      data.push({ t, v, y });
    }
    return data;
  }

  function computeHeun(v0, y0, tf, h, f) {
    const data = [];
    let t = 0;
    let v = v0;
    let y = y0;

    data.push({ t, v, y });

    const totalSteps = Math.round(tf / h);
    for (let i = 0; i < totalSteps; i++) {
      const k1v = f(t, v);
      const k1y = v;

      const vPred = v + h * k1v;
      const yPred = y + h * k1y;

      const k2v = f(t + h, vPred);
      const k2y = vPred;

      const vNext = v + (h / 2.0) * (k1v + k2v);
      const yNext = y + (h / 2.0) * (k1y + k2y);

      t = (i + 1) * h;
      v = vNext;
      y = yNext;
      data.push({ t, v, y });
    }
    return data;
  }

  function computeRK4(v0, y0, tf, h, f) {
    const data = [];
    let t = 0;
    let v = v0;
    let y = y0;

    data.push({ t, v, y });

    const totalSteps = Math.round(tf / h);
    for (let i = 0; i < totalSteps; i++) {
      const k1v = f(t, v);
      const k1y = v;

      const k2v = f(t + 0.5 * h, v + 0.5 * h * k1v);
      const k2y = v + 0.5 * h * k1v;

      const k3v = f(t + 0.5 * h, v + 0.5 * h * k2v);
      const k3y = v + 0.5 * h * k2v;

      const k4v = f(t + h, v + h * k3v);
      const k4y = v + h * k3v;

      const vNext = v + (h / 6.0) * (k1v + 2 * k2v + 2 * k3v + k4v);
      const yNext = y + (h / 6.0) * (k1y + 2 * k2y + 2 * k3y + k4y);

      t = (i + 1) * h;
      v = vNext;
      y = yNext;
      data.push({ t, v, y });
    }
    return data;
  }

  function updateMethodsSummaryTable(exact, euler, heun, rk4) {
    const methods = [
      {
        name: 'Solución Analítica',
        order: 'Exacto',
        v: exact.v,
        errV: 0,
        y: exact.y,
        errY: 0
      },
      {
        name: 'Runge-Kutta 4 (RK4)',
        order: 'Orden 4 [O(h⁴)]',
        v: rk4.v,
        errV: Math.abs(rk4.v - exact.v),
        y: rk4.y,
        errY: Math.abs(rk4.y - exact.y)
      },
      {
        name: 'Método de Heun (RK2)',
        order: 'Orden 2 [O(h²)]',
        v: heun.v,
        errV: Math.abs(heun.v - exact.v),
        y: heun.y,
        errY: Math.abs(heun.y - exact.y)
      },
      {
        name: 'Método de Euler',
        order: 'Orden 1 [O(h)]',
        v: euler.v,
        errV: Math.abs(euler.v - exact.v),
        y: euler.y,
        errY: Math.abs(euler.y - exact.y)
      }
    ];

    methodsSummaryBody.innerHTML = '';
    methods.forEach(m => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${m.name}</strong></td>
        <td><span class="tag">${m.order}</span></td>
        <td>${m.v.toFixed(4)}</td>
        <td class="${m.errV > 0.1 ? 'highlight-err' : ''}">${m.errV.toFixed(6)}</td>
        <td>${m.y.toFixed(4)}</td>
        <td class="${m.errY > 0.5 ? 'highlight-err' : ''}">${m.errY.toFixed(6)}</td>
      `;
      methodsSummaryBody.appendChild(tr);
    });
  }

  function updateDetailedTable(eulerData, analytical) {
    resultsBody.innerHTML = '';
    eulerData.forEach(row => {
      const exact = analytical(row.t);
      const errV = Math.abs(row.v - exact.v);
      const errY = Math.abs(row.y - exact.y);

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${row.t.toFixed(2)}</strong></td>
        <td>${row.v.toFixed(4)}</td>
        <td>${exact.v.toFixed(4)}</td>
        <td class="${errV > 0.001 ? 'highlight-err' : ''}">${errV.toFixed(4)}</td>
        <td>${row.y.toFixed(4)}</td>
        <td>${exact.y.toFixed(4)}</td>
        <td class="${errY > 0.001 ? 'highlight-err' : ''}">${errY.toFixed(4)}</td>
      `;
      resultsBody.appendChild(tr);
    });
  }

  function updateCharts(eulerData, heunData, rk4Data, analytical) {
    const labels = eulerData.map(d => d.t.toFixed(1));

    const eulerV = eulerData.map(d => d.v);
    const heunV = heunData.map(d => d.v);
    const rk4V = rk4Data.map(d => d.v);
    const exactV = eulerData.map(d => analytical(d.t).v);

    const eulerY = eulerData.map(d => d.y);
    const heunY = heunData.map(d => d.y);
    const rk4Y = rk4Data.map(d => d.y);
    const exactY = eulerData.map(d => analytical(d.t).y);

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          labels: { color: '#cbd5e1', font: { size: 11 } }
        },
        tooltip: {
          backgroundColor: '#0f172a',
          titleColor: '#38bdf8',
          bodyColor: '#f1f5f9',
          borderColor: '#334155',
          borderWidth: 1
        }
      },
      scales: {
        x: {
          title: { display: true, text: 'Tiempo (s)', color: '#94a3b8' },
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#94a3b8' }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#94a3b8' }
        }
      }
    };

    // Gráfico Velocidad
    if (velocityChart) velocityChart.destroy();
    const ctxV = document.getElementById('chart-velocity').getContext('2d');
    velocityChart = new Chart(ctxV, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Solución Analítica (Exacta)',
            data: exactV,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 2.5,
            pointRadius: 0,
            fill: false
          },
          {
            label: 'Runge-Kutta 4 (RK4)',
            data: rk4V,
            borderColor: '#8b5cf6',
            borderWidth: 2,
            borderDash: [4, 4],
            pointRadius: 3,
            fill: false
          },
          {
            label: 'Método Heun (RK2)',
            data: heunV,
            borderColor: '#3b82f6',
            borderWidth: 1.5,
            borderDash: [2, 2],
            pointRadius: 3,
            fill: false
          },
          {
            label: 'Método Euler',
            data: eulerV,
            borderColor: '#f97316',
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: '#f97316',
            fill: false
          }
        ]
      },
      options: {
        ...chartOptions,
        scales: {
          ...chartOptions.scales,
          y: {
            ...chartOptions.scales.y,
            title: { display: true, text: 'Velocidad (m/s)', color: '#94a3b8' }
          }
        }
      }
    });

    // Gráfico Altura
    if (heightChart) heightChart.destroy();
    const ctxY = document.getElementById('chart-height').getContext('2d');
    heightChart = new Chart(ctxY, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Solución Analítica (Exacta)',
            data: exactY,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 2.5,
            pointRadius: 0,
            fill: false
          },
          {
            label: 'Runge-Kutta 4 (RK4)',
            data: rk4Y,
            borderColor: '#8b5cf6',
            borderWidth: 2,
            borderDash: [4, 4],
            pointRadius: 3,
            fill: false
          },
          {
            label: 'Método Heun (RK2)',
            data: heunY,
            borderColor: '#3b82f6',
            borderWidth: 1.5,
            borderDash: [2, 2],
            pointRadius: 3,
            fill: false
          },
          {
            label: 'Método Euler',
            data: eulerY,
            borderColor: '#06b6d4',
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: '#06b6d4',
            fill: false
          }
        ]
      },
      options: {
        ...chartOptions,
        scales: {
          ...chartOptions.scales,
          y: {
            ...chartOptions.scales.y,
            title: { display: true, text: 'Altura (m)', color: '#94a3b8' }
          }
        }
      }
    });
  }

  function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.style.display = 'block';
  }

  function exportTableToCSV(filename) {
    const rows = document.querySelectorAll('#results-table tr');
    let csv = [];
    rows.forEach(row => {
      const cols = row.querySelectorAll('th, td');
      let rowData = [];
      cols.forEach(col => {
        let text = col.innerText.replace(/"/g, '""');
        rowData.push(`"${text}"`);
      });
      csv.push(rowData.join(','));
    });

    const csvFile = new Blob([csv.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const downloadLink = document.createElement('a');
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
});
