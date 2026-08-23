/**
 * DataPulse AI Studio - Main Application Controller
 * Manages state, UI event listeners, dataset loading, ML training triggers, and exports.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  lucide.createIcons();

  const chartManager = new ChartManager();

  // Application State
  const state = {
    currentDatasetId: 'telecom_churn',
    dataset: DATASETS.telecom_churn,
    trainedModel: null,
    trainedModelType: 'logistic_regression',
    featureMins: {},
    featureMaxs: {},
    isTraining: false
  };

  // DOM Elements
  const datasetSelectorBar = document.getElementById('dataset-selector-bar');
  const navButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  // Stats Elements
  const statRowCount = document.getElementById('stat-row-count');
  const statColCount = document.getElementById('stat-col-count');
  const statHealthScore = document.getElementById('stat-health-score');
  const statHealthGrade = document.getElementById('stat-health-grade');
  const statTaskType = document.getElementById('stat-task-type');
  const statTargetName = document.getElementById('stat-target-name');
  const healthInsightsList = document.getElementById('health-insights-list');
  const summaryStatsBody = document.getElementById('summary-stats-body');
  const rawTableHead = document.getElementById('raw-table-head');
  const rawTableBody = document.getElementById('raw-table-body');
  const tableSearchInput = document.getElementById('table-search-input');

  // Visuals Selectors
  const histFeatureSelect = document.getElementById('hist-feature-select');
  const scatterXSelect = document.getElementById('scatter-x-select');
  const scatterYSelect = document.getElementById('scatter-y-select');
  const correlationMatrixWrapper = document.getElementById('correlation-matrix-wrapper');

  // ML Lab Elements
  const mlAlgoSelect = document.getElementById('ml-algo-select');
  const sliderLr = document.getElementById('slider-lr');
  const valLr = document.getElementById('val-lr');
  const sliderEpochs = document.getElementById('slider-epochs');
  const valEpochs = document.getElementById('val-epochs');
  const sliderKnnK = document.getElementById('slider-knn-k');
  const valKnnK = document.getElementById('val-knn-k');
  const groupKnnK = document.getElementById('group-knn-k');
  const groupLr = document.getElementById('group-lr');
  const groupEpochs = document.getElementById('group-epochs');
  const sliderSplit = document.getElementById('slider-split');
  const valSplit = document.getElementById('val-split');
  const btnTrainModel = document.getElementById('btn-train-model');
  const btnResetMl = document.getElementById('btn-reset-ml');
  const mlStatusBadge = document.getElementById('ml-status-badge');
  const valModelAcc = document.getElementById('val-model-acc');
  const valModelPrecision = document.getElementById('val-model-precision');
  const valModelRecall = document.getElementById('val-model-recall');
  const valModelF1 = document.getElementById('val-model-f1');
  const boundaryXSelect = document.getElementById('boundary-x-select');
  const boundaryYSelect = document.getElementById('boundary-y-select');
  const whatifSlidersContainer = document.getElementById('whatif-sliders-container');
  const whatifPredValue = document.getElementById('whatif-pred-value');
  const whatifPredConfidence = document.getElementById('whatif-pred-confidence');

  // Insights Elements
  const executiveSummaryContent = document.getElementById('executive-summary-content');

  // Modals
  const btnUploadModal = document.getElementById('btn-upload-modal');
  const modalUpload = document.getElementById('modal-upload');
  const btnCloseUpload = document.getElementById('btn-close-upload');
  const csvDropzone = document.getElementById('csv-dropzone');
  const csvFileInput = document.getElementById('csv-file-input');

  const btnSyntheticModal = document.getElementById('btn-synthetic-modal');
  const modalSynthetic = document.getElementById('modal-synthetic');
  const btnCloseSynthetic = document.getElementById('btn-close-synthetic');
  const btnGenerateSynthetic = document.getElementById('btn-generate-synthetic');
  const synthCountSlider = document.getElementById('synth-count-slider');
  const valSynthCount = document.getElementById('val-synth-count');

  // --- INITIALIZATION ---
  renderDatasetSwitcher();
  loadDataset(state.dataset);

  // --- TAB NAVIGATION ---
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      navButtons.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const targetTab = document.getElementById(btn.dataset.tab);
      if (targetTab) targetTab.classList.add('active');

      // Trigger redraw of charts on tab switch
      if (btn.dataset.tab === 'tab-visuals') {
        updateVisualAnalytics();
      } else if (btn.dataset.tab === 'tab-ml') {
        updateMLTabViews();
      } else if (btn.dataset.tab === 'tab-insights') {
        renderExecutiveSummary();
      }
    });
  });

  // --- DATASET SWITCHER ---
  function renderDatasetSwitcher() {
    datasetSelectorBar.innerHTML = '';
    Object.values(DATASETS).forEach(ds => {
      const card = document.createElement('div');
      card.className = `dataset-card ${ds.id === state.currentDatasetId ? 'active' : ''}`;
      card.innerHTML = `
        <div class="dataset-card-icon">
          <i data-lucide="${ds.icon || 'database'}"></i>
        </div>
        <div class="dataset-info">
          <h4>${ds.name}</h4>
          <p>${ds.category} • ${ds.data.length} Records</p>
        </div>
      `;
      card.addEventListener('click', () => {
        state.currentDatasetId = ds.id;
        state.dataset = ds;
        renderDatasetSwitcher();
        loadDataset(ds);
      });
      datasetSelectorBar.appendChild(card);
    });
    lucide.createIcons();
  }

  // --- LOAD DATASET ---
  function loadDataset(dataset) {
    state.dataset = dataset;
    state.trainedModel = null;

    // Reset ML metrics
    valModelAcc.textContent = '--';
    valModelPrecision.textContent = '--';
    valModelRecall.textContent = '--';
    valModelF1.textContent = '--';

    // 1. Profiler & Summary
    const summary = StatsEngine.computeSummary(dataset);
    const health = StatsEngine.computeDataHealth(dataset);

    statRowCount.textContent = dataset.data.length.toLocaleString();
    statColCount.textContent = `${dataset.features.length} Features`;
    statTargetName.textContent = `Target: ${dataset.targetColumn || 'None'}`;
    statHealthScore.textContent = `${health.score}%`;
    statHealthGrade.textContent = `Grade: ${health.grade} (${health.score >= 80 ? 'Production Ready' : 'Needs Cleansing'})`;
    statTaskType.textContent = dataset.category;

    // Health Insights
    healthInsightsList.innerHTML = health.insights.map(item => `
      <div style="display: flex; align-items: center; gap: 10px; font-size: 0.85rem; padding: 6px 10px; background: rgba(255,255,255,0.03); border-radius: 6px;">
        <i data-lucide="${item.type === 'success' ? 'check-circle' : item.type === 'warning' ? 'alert-triangle' : 'info'}"
           style="color: ${item.type === 'success' ? 'var(--accent-emerald)' : item.type === 'warning' ? 'var(--accent-amber)' : 'var(--accent-cyan)'}; width: 16px; height: 16px;"></i>
        <span>${item.text}</span>
      </div>
    `).join('');

    // Summary Stats Table
    summaryStatsBody.innerHTML = '';
    Object.keys(summary).forEach(col => {
      const s = summary[col];
      const row = document.createElement('tr');
      if (s.type === 'numerical') {
        row.innerHTML = `
          <td><strong>${col}</strong></td>
          <td><span class="badge badge-cyan">Numerical</span></td>
          <td>${s.mean}</td>
          <td>&plusmn;${s.stdDev}</td>
          <td>${s.min} &ndash; ${s.max}</td>
          <td>${s.iqr}</td>
          <td>${s.skewness > 0.5 ? '<span style="color: var(--accent-amber);">' + s.skewness + ' (Skewed)</span>' : s.skewness}</td>
          <td>${s.outlierCount > 0 ? '<span class="badge badge-pink">' + s.outlierCount + ' Outliers</span>' : '<span class="badge badge-emerald">0</span>'}</td>
        `;
      } else {
        row.innerHTML = `
          <td><strong>${col}</strong></td>
          <td><span class="badge badge-purple">Categorical</span></td>
          <td>${s.mode} (Top)</td>
          <td>--</td>
          <td>${s.uniqueCount} Uniques</td>
          <td>--</td>
          <td>--</td>
          <td>--</td>
        `;
      }
      summaryStatsBody.appendChild(row);
    });

    // Populate Raw Data Table
    renderRawTable(dataset.data);

    // Populate Selectors for Visuals
    populateFeatureSelectors();

    // Setup What-If Sliders
    setupWhatIfSliders();

    // Auto-select ML algorithm suitable for dataset
    if (dataset.category === 'Regression') {
      mlAlgoSelect.value = 'linear_regression';
    } else if (dataset.category === 'Clustering') {
      mlAlgoSelect.value = 'kmeans';
    } else {
      mlAlgoSelect.value = 'logistic_regression';
    }
    updateMlControls();

    // Auto-render EDA and Correlation
    updateVisualAnalytics();

    lucide.createIcons();
  }

  // --- RAW DATA TABLE ---
  function renderRawTable(data) {
    const allCols = [...state.dataset.features, state.dataset.targetColumn].filter(Boolean);
    rawTableHead.innerHTML = `<tr>${allCols.map(c => `<th>${c}</th>`).join('')}</tr>`;
    
    rawTableBody.innerHTML = data.slice(0, 15).map(row => `
      <tr>${allCols.map(c => `<td>${row[c] !== undefined ? row[c] : ''}</td>`).join('')}</tr>
    `).join('');
  }

  tableSearchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = state.dataset.data.filter(row =>
      Object.values(row).some(v => String(v).toLowerCase().includes(term))
    );
    renderRawTable(filtered);
  });

  // --- VISUAL ANALYTICS ---
  function populateFeatureSelectors() {
    const numCols = state.dataset.features.filter(f => state.dataset.featureTypes[f] === 'number');

    histFeatureSelect.innerHTML = numCols.map(f => `<option value="${f}">${f}</option>`).join('');
    scatterXSelect.innerHTML = numCols.map(f => `<option value="${f}">${f}</option>`).join('');
    scatterYSelect.innerHTML = numCols.map((f, i) => `<option value="${f}" ${i === 1 ? 'selected' : ''}>${f}</option>`).join('');

    boundaryXSelect.innerHTML = numCols.map(f => `<option value="${f}">${f}</option>`).join('');
    boundaryYSelect.innerHTML = numCols.map((f, i) => `<option value="${f}" ${i === 1 ? 'selected' : ''}>${f}</option>`).join('');
  }

  function updateVisualAnalytics() {
    // 1. Histogram
    const histCol = histFeatureSelect.value || state.dataset.features[0];
    if (histCol) {
      const histData = StatsEngine.computeHistogram(state.dataset, histCol, 8);
      chartManager.renderHistogram('canvas-histogram', histData, histCol);
    }

    // 2. Scatter
    const sx = scatterXSelect.value || state.dataset.features[0];
    const sy = scatterYSelect.value || state.dataset.features[1] || state.dataset.features[0];
    if (sx && sy) {
      chartManager.renderScatter('canvas-scatter', state.dataset, sx, sy);
    }

    // 3. Correlation Heatmap
    renderCorrelationHeatmap();
  }

  histFeatureSelect.addEventListener('change', () => {
    const histData = StatsEngine.computeHistogram(state.dataset, histFeatureSelect.value, 8);
    chartManager.renderHistogram('canvas-histogram', histData, histFeatureSelect.value);
  });

  scatterXSelect.addEventListener('change', updateVisualAnalytics);
  scatterYSelect.addEventListener('change', updateVisualAnalytics);

  function renderCorrelationHeatmap() {
    const { columns, matrix } = StatsEngine.computeCorrelationMatrix(state.dataset);
    if (columns.length === 0) return;

    let html = `<table style="margin: 0 auto; border-collapse: separate; border-spacing: 6px;">`;
    html += `<tr><th></th>${columns.map(c => `<th style="font-size: 0.72rem; color: #94a3b8; padding: 4px 6px;">${c}</th>`).join('')}</tr>`;

    matrix.forEach((row, i) => {
      html += `<tr><th style="font-size: 0.72rem; color: #94a3b8; text-align: right; padding-right: 8px;">${row.feature}</th>`;
      row.values.forEach((val, j) => {
        let bg = 'rgba(255,255,255,0.05)';
        let textColor = '#fff';
        if (val > 0) {
          bg = `rgba(0, 242, 254, ${Math.max(0.15, val)})`;
          if (val > 0.6) textColor = '#070913';
        } else if (val < 0) {
          bg = `rgba(255, 75, 114, ${Math.max(0.15, Math.abs(val))})`;
          if (Math.abs(val) > 0.6) textColor = '#fff';
        }
        html += `<td class="matrix-cell" style="background: ${bg}; color: ${textColor};" title="${columns[i]} vs ${columns[j]}: ${val}">${val}</td>`;
      });
      html += `</tr>`;
    });
    html += `</table>`;
    correlationMatrixWrapper.innerHTML = html;
  }

  // --- ML CONTROLS & TRAINING ---
  mlAlgoSelect.addEventListener('change', updateMlControls);

  function updateMlControls() {
    const algo = mlAlgoSelect.value;
    if (algo === 'knn') {
      groupKnnK.style.display = 'block';
      groupLr.style.display = 'none';
      groupEpochs.style.display = 'none';
    } else if (algo === 'kmeans') {
      groupKnnK.style.display = 'block';
      groupLr.style.display = 'none';
      groupEpochs.style.display = 'none';
    } else {
      groupKnnK.style.display = 'none';
      groupLr.style.display = 'block';
      groupEpochs.style.display = 'block';
    }
  }

  sliderLr.addEventListener('input', (e) => valLr.textContent = Number(e.target.value).toFixed(2));
  sliderEpochs.addEventListener('input', (e) => valEpochs.textContent = e.target.value);
  sliderKnnK.addEventListener('input', (e) => valKnnK.textContent = e.target.value);
  sliderSplit.addEventListener('input', (e) => {
    valSplit.textContent = `${e.target.value}% Train / ${100 - e.target.value}% Test`;
  });

  synthCountSlider.addEventListener('input', (e) => valSynthCount.textContent = e.target.value);

  // Train Button Handler
  btnTrainModel.addEventListener('click', async () => {
    if (state.isTraining) return;
    state.isTraining = true;
    btnTrainModel.disabled = true;
    mlStatusBadge.innerHTML = `<span class="badge badge-amber"><span class="pulse-indicator" style="background: var(--accent-amber);"></span> Training Model...</span>`;

    const dataset = state.dataset;
    const numFeatures = dataset.features.filter(f => dataset.featureTypes[f] === 'number');
    const X = dataset.data.map(r => numFeatures.map(f => Number(r[f])));
    const y = dataset.data.map(r => Number(r[dataset.targetColumn]));

    // Min-Max Normalize
    const { normalized, mins, maxs } = MLEngine.normalizeFeatures(X);
    state.featureMins = mins;
    state.featureMaxs = maxs;

    const splitRatio = (100 - Number(sliderSplit.value)) / 100;
    const { X_train, y_train, X_test, y_test } = MLEngine.trainTestSplit(normalized, y, splitRatio);

    const algo = mlAlgoSelect.value;
    state.trainedModelType = algo;

    if (algo === 'logistic_regression') {
      const model = await MLEngine.trainLogisticRegression(
        X_train,
        y_train,
        { epochs: Number(sliderEpochs.value), learningRate: Number(sliderLr.value) },
        (progress) => {
          chartManager.renderTrainingCurves('canvas-training-curve', modelLossAccumulator(progress));
        }
      );

      state.trainedModel = model;
      chartManager.renderTrainingCurves('canvas-training-curve', model.lossHistory, model.accuracyHistory);

      // Evaluate on Test Set
      const testPreds = X_test.map(x => model.predict(x).label);
      const metrics = MLEngine.evaluateClassification(y_test, testPreds);

      valModelAcc.textContent = `${metrics.accuracy}%`;
      valModelPrecision.textContent = `${metrics.precision}%`;
      valModelRecall.textContent = `${metrics.recall}%`;
      valModelF1.textContent = `${metrics.f1Score}%`;

      confetti({ particleCount: 40, spread: 60, origin: { y: 0.85 } });

    } else if (algo === 'knn') {
      const k = Number(sliderKnnK.value);
      const model = MLEngine.trainKNN(X_train, y_train, k);
      state.trainedModel = model;

      const testPreds = X_test.map(x => model.predict(x).label);
      const metrics = MLEngine.evaluateClassification(y_test, testPreds);

      valModelAcc.textContent = `${metrics.accuracy}%`;
      valModelPrecision.textContent = `${metrics.precision}%`;
      valModelRecall.textContent = `${metrics.recall}%`;
      valModelF1.textContent = `${metrics.f1Score}%`;

      // Mock curve for instant model
      chartManager.renderTrainingCurves('canvas-training-curve', [0.8, 0.5, 0.3, 0.2], [50, 75, 88, metrics.accuracy]);

    } else if (algo === 'linear_regression') {
      const model = await MLEngine.trainLinearRegression(
        X_train,
        y_train,
        { epochs: Number(sliderEpochs.value), learningRate: Number(sliderLr.value) }
      );
      state.trainedModel = model;
      chartManager.renderTrainingCurves('canvas-training-curve', model.lossHistory);

      const testPreds = X_test.map(x => model.predict(x).value);
      const metrics = MLEngine.evaluateRegression(y_test, testPreds);

      valModelAcc.textContent = `R²: ${metrics.r2Score}`;
      valModelPrecision.textContent = `MSE: ${metrics.mse}`;
      valModelRecall.textContent = `RMSE: ${metrics.rmse}`;
      valModelF1.textContent = `MAE: ${metrics.mae}`;

    } else if (algo === 'kmeans') {
      const k = Number(sliderKnnK.value);
      const model = await MLEngine.trainKMeans(normalized, k, 20);
      state.trainedModel = {
        predict: (x) => {
          let best = 0, minD = Infinity;
          model.centroids.forEach((c, idx) => {
            let d = 0;
            for (let j = 0; j < x.length; j++) d += Math.pow(x[j] - c[j], 2);
            if (d < minD) { minD = d; best = idx; }
          });
          return { label: best, probability: 1 - minD };
        }
      };

      valModelAcc.textContent = `WCSS: ${Math.round(model.wcss)}`;
      valModelPrecision.textContent = `K=${k}`;
      valModelRecall.textContent = 'Clusters';
      valModelF1.textContent = 'Active';
      chartManager.renderTrainingCurves('canvas-training-curve', [model.wcss * 1.5, model.wcss * 1.2, model.wcss]);
    }

    mlStatusBadge.innerHTML = `<span class="badge badge-emerald"><span class="pulse-indicator"></span> Model Trained Successfully</span>`;
    state.isTraining = false;
    btnTrainModel.disabled = false;

    // Redraw Decision Boundary & Update What-If Simulator
    updateDecisionBoundary();
    triggerWhatIfInference();
  });

  const dummyLossAcc = [];
  function modelLossAccumulator(p) {
    dummyLossAcc.push(p.loss);
    return dummyLossAcc;
  }

  // --- DECISION BOUNDARY ---
  boundaryXSelect.addEventListener('change', updateDecisionBoundary);
  boundaryYSelect.addEventListener('change', updateDecisionBoundary);

  function updateDecisionBoundary() {
    if (!state.trainedModel) return;
    const bx = boundaryXSelect.value || state.dataset.features[0];
    const by = boundaryYSelect.value || state.dataset.features[1];
    ChartManager.drawDecisionBoundary('canvas-decision-boundary', state.trainedModel, state.dataset, bx, by);
  }

  function updateMLTabViews() {
    if (state.trainedModel) {
      updateDecisionBoundary();
    }
  }

  // --- "WHAT-IF" SIMULATOR ---
  function setupWhatIfSliders() {
    whatifSlidersContainer.innerHTML = '';
    const numFeatures = state.dataset.features.filter(f => state.dataset.featureTypes[f] === 'number');

    numFeatures.forEach(feat => {
      const vals = state.dataset.data.map(r => Number(r[feat]));
      const min = Math.min(...vals);
      const max = Math.max(...vals);
      const defaultVal = (min + max) / 2;

      const div = document.createElement('div');
      div.className = 'form-group';
      div.style.marginBottom = '6px';
      div.innerHTML = `
        <div class="form-label" style="font-size: 0.75rem;">
          <span>${feat}</span>
          <span class="form-value-badge" id="whatif-val-${feat}">${Math.round(defaultVal * 10) / 10}</span>
        </div>
        <input type="range" class="whatif-slider" data-feature="${feat}" min="${min}" max="${max}" step="${(max - min) / 50 || 1}" value="${defaultVal}">
      `;
      whatifSlidersContainer.appendChild(div);
    });

    // Add slider listener
    const sliders = whatifSlidersContainer.querySelectorAll('.whatif-slider');
    sliders.forEach(slider => {
      slider.addEventListener('input', (e) => {
        const feat = e.target.dataset.feature;
        const valSpan = document.getElementById(`whatif-val-${feat}`);
        if (valSpan) valSpan.textContent = Number(e.target.value).toFixed(1);
        triggerWhatIfInference();
      });
    });
  }

  function triggerWhatIfInference() {
    if (!state.trainedModel) {
      whatifPredValue.textContent = 'Train Model First';
      whatifPredConfidence.textContent = '--%';
      return;
    }

    const numFeatures = state.dataset.features.filter(f => state.dataset.featureTypes[f] === 'number');
    const sliders = whatifSlidersContainer.querySelectorAll('.whatif-slider');
    const currentValues = Array.from(sliders).map(s => Number(s.value));

    // Normalize input
    const normalizedInput = currentValues.map((v, idx) => {
      const min = state.featureMins[idx] || 0;
      const max = state.featureMaxs[idx] || 1;
      return max === min ? 0 : (v - min) / (max - min);
    });

    const pred = state.trainedModel.predict(normalizedInput);

    if (state.dataset.category === 'Regression') {
      whatifPredValue.textContent = `$${Math.round(pred.value || pred.label || 0).toLocaleString()}`;
      whatifPredConfidence.textContent = 'Regression Est.';
    } else {
      const label = pred.label !== undefined ? pred.label : 0;
      const prob = pred.probability !== undefined ? pred.probability : 0.85;
      whatifPredValue.textContent = label === 1 ? 'Positive / High Risk' : 'Negative / Normal';
      whatifPredValue.style.color = label === 1 ? 'var(--accent-pink)' : 'var(--accent-cyan)';
      whatifPredConfidence.textContent = `${Math.round(prob * 100)}% Conf.`;
    }
  }

  // --- AUTOMATED EXECUTIVE SUMMARY ---
  function renderExecutiveSummary() {
    const summary = StatsEngine.computeSummary(state.dataset);
    const health = StatsEngine.computeDataHealth(state.dataset);
    const { columns, matrix } = StatsEngine.computeCorrelationMatrix(state.dataset);

    // Find highest correlation pair
    let maxCorr = -1, pair = [];
    matrix.forEach((row, i) => {
      row.values.forEach((v, j) => {
        if (i !== j && Math.abs(v) > maxCorr) {
          maxCorr = Math.abs(v);
          pair = [columns[i], columns[j], v];
        }
      });
    });

    executiveSummaryContent.innerHTML = `
      <div style="padding: 1rem; background: rgba(0, 242, 254, 0.05); border-left: 4px solid var(--accent-cyan); border-radius: 4px;">
        <h4 style="color: #fff; margin-bottom: 4px;">Dataset Overview & Quality Grade: ${health.grade}</h4>
        <p>This dataset consists of <strong>${state.dataset.data.length}</strong> observations across <strong>${state.dataset.features.length}</strong> input dimensions. Data health audit achieved an overall score of <strong>${health.score}/100</strong>.</p>
      </div>

      <div style="padding: 1rem; background: rgba(138, 43, 226, 0.05); border-left: 4px solid var(--accent-purple); border-radius: 4px;">
        <h4 style="color: #fff; margin-bottom: 4px;">Key Collinearity Driver</h4>
        <p>Highest feature correlation identified between <strong>${pair[0] || 'Feature A'}</strong> and <strong>${pair[1] || 'Feature B'}</strong> (r = <strong>${pair[2] || 0}</strong>). This suggests strong statistical linkage suitable for predictive modeling.</p>
      </div>

      <div style="padding: 1rem; background: rgba(0, 245, 160, 0.05); border-left: 4px solid var(--accent-emerald); border-radius: 4px;">
        <h4 style="color: #fff; margin-bottom: 4px;">Modeling Recommendation</h4>
        <p>For this ${state.dataset.category} task, an ensemble or gradient-based estimator with L2 regularization is recommended to prevent overfitting given the sample distribution.</p>
      </div>
    `;
  }

  // --- EXPORT HANDLERS ---
  document.getElementById('btn-export-csv').addEventListener('click', () => exportDataCSV(state.dataset));
  document.getElementById('btn-export-cleaned-csv').addEventListener('click', () => exportDataCSV(state.dataset));

  document.getElementById('btn-export-weights').addEventListener('click', () => {
    if (!state.trainedModel) {
      alert('Please train a model first before exporting parameters.');
      return;
    }
    const modelExport = {
      modelType: state.trainedModelType,
      dataset: state.dataset.name,
      timestamp: new Date().toISOString(),
      weights: state.trainedModel.weights || [],
      bias: state.trainedModel.bias || 0
    };
    downloadFile(JSON.stringify(modelExport, null, 2), `model_weights_${state.trainedModelType}.json`, 'application/json');
  });

  document.getElementById('btn-export-full-report').addEventListener('click', () => {
    window.print();
  });

  function exportDataCSV(dataset) {
    const allCols = [...dataset.features, dataset.targetColumn].filter(Boolean);
    const headerLine = allCols.join(',');
    const rows = dataset.data.map(r => allCols.map(c => r[c]).join(',')).join('\n');
    const csvContent = `${headerLine}\n${rows}`;
    downloadFile(csvContent, `${dataset.id}_export.csv`, 'text/csv');
  }

  function downloadFile(content, fileName, contentType) {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }

  // --- MODAL CONTROLS ---
  btnUploadModal.addEventListener('click', () => modalUpload.style.display = 'flex');
  btnCloseUpload.addEventListener('click', () => modalUpload.style.display = 'none');

  csvDropzone.addEventListener('click', () => csvFileInput.click());
  csvFileInput.addEventListener('change', handleFileUpload);

  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsedDataset = CSVParser.parse(event.target.result);
        DATASETS[parsedDataset.id] = parsedDataset;
        state.currentDatasetId = parsedDataset.id;
        modalUpload.style.display = 'none';
        renderDatasetSwitcher();
        loadDataset(parsedDataset);
      } catch (err) {
        alert("Error parsing CSV file: " + err.message);
      }
    };
    reader.readAsText(file);
  }

  btnSyntheticModal.addEventListener('click', () => modalSynthetic.style.display = 'flex');
  btnCloseSynthetic.addEventListener('click', () => modalSynthetic.style.display = 'none');

  btnGenerateSynthetic.addEventListener('click', () => {
    const pattern = document.getElementById('synthetic-pattern').value;
    const count = Number(synthCountSlider.value);
    const synthDataset = SyntheticDataGenerator.generate(pattern, count);

    DATASETS[synthDataset.id] = synthDataset;
    state.currentDatasetId = synthDataset.id;
    modalSynthetic.style.display = 'none';
    renderDatasetSwitcher();
    loadDataset(synthDataset);
  });
});
