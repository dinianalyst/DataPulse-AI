/**
 * DataPulse Studio - Visual Analytics & Chart Manager
 * Renders glowing Chart.js graphs, animated decision boundary canvas, and correlation heatmaps.
 */

class ChartManager {
  constructor() {
    this.charts = {};
  }

  destroyChart(id) {
    if (this.charts[id]) {
      this.charts[id].destroy();
      delete this.charts[id];
    }
  }

  /**
   * Render Feature Distribution Histogram
   */
  renderHistogram(canvasId, histData, featureName) {
    this.destroyChart(canvasId);
    const ctx = document.getElementById(canvasId).getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(0, 242, 254, 0.85)');
    gradient.addColorStop(1, 'rgba(138, 43, 226, 0.25)');

    this.charts[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: histData.labels,
        datasets: [{
          label: `${featureName} Frequency`,
          data: histData.counts,
          backgroundColor: gradient,
          borderColor: '#00f2fe',
          borderWidth: 1.5,
          borderRadius: 6,
          hoverBackgroundColor: '#00f5a0'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#a0aec0', font: { family: 'Inter', size: 12 } } },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleColor: '#00f2fe',
            bodyColor: '#fff',
            borderColor: 'rgba(0, 242, 254, 0.3)',
            borderWidth: 1,
            padding: 10,
            cornerRadius: 8
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#718096', font: { family: 'Inter', size: 10 } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#718096', font: { family: 'Inter', size: 10 } },
            beginAtZero: true
          }
        }
      }
    });
  }

  /**
   * Render Multidimensional Scatter Plot
   */
  renderScatter(canvasId, dataset, featureX, featureY) {
    this.destroyChart(canvasId);
    const ctx = document.getElementById(canvasId).getContext('2d');
    const data = dataset.data;
    const targetCol = dataset.targetColumn;

    // Group by target class if categorical/binary
    const groups = {};
    data.forEach(row => {
      const cls = row[targetCol] !== undefined ? row[targetCol] : 'Data';
      if (!groups[cls]) groups[cls] = [];
      groups[cls].push({ x: Number(row[featureX]), y: Number(row[featureY]) });
    });

    const colors = [
      { bg: 'rgba(0, 242, 254, 0.8)', border: '#00f2fe' },
      { bg: 'rgba(255, 75, 114, 0.8)', border: '#ff4b72' },
      { bg: 'rgba(0, 245, 160, 0.8)', border: '#00f5a0' },
      { bg: 'rgba(255, 183, 3, 0.8)', border: '#ffb703' }
    ];

    const datasets = Object.keys(groups).map((cls, idx) => {
      const color = colors[idx % colors.length];
      return {
        label: `${targetCol}: ${cls}`,
        data: groups[cls],
        backgroundColor: color.bg,
        borderColor: color.border,
        borderWidth: 1.5,
        pointRadius: 6,
        pointHoverRadius: 9,
        pointHoverBackgroundColor: '#ffffff'
      };
    });

    this.charts[canvasId] = new Chart(ctx, {
      type: 'scatter',
      data: { datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#cbd5e1', font: { family: 'Inter', size: 12 } } },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleColor: '#00f2fe',
            bodyColor: '#fff',
            borderColor: 'rgba(0, 242, 254, 0.3)',
            borderWidth: 1,
            callbacks: {
              label: (context) => `(${featureX}: ${context.raw.x}, ${featureY}: ${context.raw.y})`
            }
          }
        },
        scales: {
          x: {
            title: { display: true, text: featureX, color: '#00f2fe', font: { size: 12, weight: '600' } },
            grid: { color: 'rgba(255, 255, 255, 0.06)' },
            ticks: { color: '#718096' }
          },
          y: {
            title: { display: true, text: featureY, color: '#00f2fe', font: { size: 12, weight: '600' } },
            grid: { color: 'rgba(255, 255, 255, 0.06)' },
            ticks: { color: '#718096' }
          }
        }
      }
    });
  }

  /**
   * Render Live Training Loss and Accuracy Chart
   */
  renderTrainingCurves(canvasId, lossHistory, accHistory = null) {
    this.destroyChart(canvasId);
    const ctx = document.getElementById(canvasId).getContext('2d');
    const labels = Array.from({ length: lossHistory.length }, (_, i) => i + 1);

    const datasets = [
      {
        label: 'Training Loss (MSE / Log-Loss)',
        data: lossHistory,
        borderColor: '#ff4b72',
        backgroundColor: 'rgba(255, 75, 114, 0.15)',
        fill: true,
        tension: 0.35,
        borderWidth: 2,
        yAxisID: 'y'
      }
    ];

    if (accHistory && accHistory.length > 0) {
      datasets.push({
        label: 'Accuracy (%)',
        data: accHistory,
        borderColor: '#00f5a0',
        backgroundColor: 'rgba(0, 245, 160, 0.15)',
        fill: true,
        tension: 0.35,
        borderWidth: 2,
        yAxisID: 'y1'
      });
    }

    this.charts[canvasId] = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 250 },
        plugins: {
          legend: { labels: { color: '#cbd5e1', font: { family: 'Inter', size: 12 } } },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            borderColor: 'rgba(0, 242, 254, 0.3)',
            borderWidth: 1
          }
        },
        scales: {
          x: {
            title: { display: true, text: 'Epoch', color: '#718096' },
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#718096' }
          },
          y: {
            title: { display: true, text: 'Loss', color: '#ff4b72' },
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#ff4b72' }
          },
          ...(accHistory && accHistory.length > 0 ? {
            y1: {
              position: 'right',
              title: { display: true, text: 'Accuracy (%)', color: '#00f5a0' },
              grid: { drawOnChartArea: false },
              ticks: { color: '#00f5a0', max: 100, min: 0 }
            }
          } : {})
        }
      }
    });
  }

  /**
   * Render Feature Weights / Importance Horizontal Bar Chart
   */
  renderFeatureImportance(canvasId, features, weights) {
    this.destroyChart(canvasId);
    const ctx = document.getElementById(canvasId).getContext('2d');

    const absWeights = weights.map(Math.abs);
    const maxVal = Math.max(...absWeights) || 1;
    const normalized = absWeights.map(w => Math.round((w / maxVal) * 100));

    this.charts[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: features,
        datasets: [{
          label: 'Relative Feature Impact (%)',
          data: normalized,
          backgroundColor: normalized.map(val =>
            val > 70 ? 'rgba(0, 242, 254, 0.85)' : val > 40 ? 'rgba(138, 43, 226, 0.85)' : 'rgba(255, 75, 114, 0.85)'
          ),
          borderRadius: 6,
          borderWidth: 1,
          borderColor: '#00f2fe'
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            max: 100,
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#718096', callback: (v) => v + '%' }
          },
          y: {
            grid: { display: false },
            ticks: { color: '#cbd5e1', font: { weight: '600' } }
          }
        }
      }
    });
  }

  /**
   * Dynamic 2D Decision Boundary Canvas Visualizer
   */
  static drawDecisionBoundary(canvasId, model, dataset, featX, featY) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const data = dataset.data;
    const rawX = data.map(r => Number(r[featX])).filter(v => !isNaN(v));
    const rawY = data.map(r => Number(r[featY])).filter(v => !isNaN(v));

    const minX = Math.min(...rawX);
    const maxX = Math.max(...rawX);
    const minY = Math.min(...rawY);
    const maxY = Math.max(...rawY);

    const padX = (maxX - minX) * 0.1 || 1;
    const padY = (maxY - minY) * 0.1 || 1;

    const x0 = minX - padX, x1 = maxX + padX;
    const y0 = minY - padY, y1 = maxY + padY;

    // Generate grid & render classification contour
    const resolution = 45;
    const cellW = width / resolution;
    const cellH = height / resolution;

    for (let r = 0; r < resolution; r++) {
      for (let c = 0; c < resolution; c++) {
        const valX = x0 + (c / resolution) * (x1 - x0);
        const valY = y1 - (r / resolution) * (y1 - y0);

        // Normalize or prepare vector matching feature size
        const featureVector = dataset.features.map(f => {
          if (f === featX) return (valX - minX) / ((maxX - minX) || 1);
          if (f === featY) return (valY - minY) / ((maxY - minY) || 1);
          return 0.5; // Neutral median
        });

        const pred = model.predict(featureVector);
        const prob = pred.probability !== undefined ? pred.probability : (pred.label === 1 ? 0.9 : 0.1);

        // Shading: Neon Cyan for Class 0, Neon Coral for Class 1
        if (prob >= 0.5) {
          const alpha = 0.15 + (prob - 0.5) * 0.5;
          ctx.fillStyle = `rgba(255, 75, 114, ${alpha})`;
        } else {
          const alpha = 0.15 + (0.5 - prob) * 0.5;
          ctx.fillStyle = `rgba(0, 242, 254, ${alpha})`;
        }
        ctx.fillRect(c * cellW, r * cellH, cellW + 1, cellH + 1);
      }
    }

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const gx = (i / 5) * width;
      const gy = (i / 5) * height;
      ctx.beginPath();
      ctx.moveTo(gx, 0); ctx.lineTo(gx, height);
      ctx.moveTo(0, gy); ctx.lineTo(width, gy);
      ctx.stroke();
    }

    // Draw Data Points on top
    const targetCol = dataset.targetColumn;
    data.forEach(row => {
      const vx = Number(row[featX]);
      const vy = Number(row[featY]);
      const px = ((vx - x0) / (x1 - x0)) * width;
      const py = ((y1 - vy) / (y1 - y0)) * height;
      const label = row[targetCol];

      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, 2 * Math.PI);
      if (label === 1 || label === '1') {
        ctx.fillStyle = '#ff4b72';
        ctx.shadowColor = '#ff4b72';
        ctx.shadowBlur = 10;
      } else {
        ctx.fillStyle = '#00f2fe';
        ctx.shadowColor = '#00f2fe';
        ctx.shadowBlur = 10;
      }
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    });
  }
}
