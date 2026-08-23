/**
 * DataPulse Studio - Statistics & Data Profiling Engine
 * Computes descriptive statistics, Pearson correlation matrix, histograms, IQR outliers, and data health scores.
 */

class StatsEngine {
  /**
   * Compute comprehensive summary statistics for each feature
   */
  static computeSummary(dataset) {
    const summary = {};
    const data = dataset.data;
    const allCols = [...dataset.features, dataset.targetColumn].filter(Boolean);

    allCols.forEach(col => {
      const type = dataset.featureTypes[col] || 'number';
      const values = data.map(r => r[col]).filter(v => v !== undefined && v !== null && v !== '');

      if (type === 'number' || type === 'continuous' || (type === 'binary' && typeof values[0] === 'number')) {
        const numVals = values.map(Number).filter(v => !isNaN(v)).sort((a, b) => a - b);
        const count = numVals.length;

        if (count === 0) {
          summary[col] = { type: 'numerical', count: 0, missing: data.length };
          return;
        }

        const sum = numVals.reduce((acc, v) => acc + v, 0);
        const mean = sum / count;
        const median = count % 2 === 0 ? (numVals[count / 2 - 1] + numVals[count / 2]) / 2 : numVals[Math.floor(count / 2)];
        const min = numVals[0];
        const max = numVals[count - 1];

        // Variance & Standard Deviation
        const variance = numVals.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (count > 1 ? count - 1 : 1);
        const stdDev = Math.sqrt(variance);

        // Skewness
        let skewness = 0;
        if (count > 2 && stdDev > 0) {
          const m3 = numVals.reduce((acc, v) => acc + Math.pow(v - mean, 3), 0) / count;
          skewness = m3 / Math.pow(stdDev, 3);
        }

        // Quartiles & IQR
        const q1 = StatsEngine.getPercentile(numVals, 25);
        const q3 = StatsEngine.getPercentile(numVals, 75);
        const iqr = q3 - q1;
        const lowerBound = q1 - 1.5 * iqr;
        const upperBound = q3 + 1.5 * iqr;
        const outliers = numVals.filter(v => v < lowerBound || v > upperBound);

        summary[col] = {
          type: 'numerical',
          count,
          missing: data.length - count,
          mean: Math.round(mean * 100) / 100,
          median: Math.round(median * 100) / 100,
          min: Math.round(min * 100) / 100,
          max: Math.round(max * 100) / 100,
          stdDev: Math.round(stdDev * 100) / 100,
          skewness: Math.round(skewness * 100) / 100,
          q1: Math.round(q1 * 100) / 100,
          q3: Math.round(q3 * 100) / 100,
          iqr: Math.round(iqr * 100) / 100,
          outlierCount: outliers.length,
          sparkline: numVals.slice(0, 15)
        };
      } else {
        // Categorical Column
        const freqMap = {};
        values.forEach(v => {
          freqMap[v] = (freqMap[v] || 0) + 1;
        });

        const uniqueVals = Object.keys(freqMap);
        let mode = uniqueVals[0];
        let maxFreq = 0;
        uniqueVals.forEach(k => {
          if (freqMap[k] > maxFreq) {
            maxFreq = freqMap[k];
            mode = k;
          }
        });

        summary[col] = {
          type: 'categorical',
          count: values.length,
          missing: data.length - values.length,
          uniqueCount: uniqueVals.length,
          mode: mode,
          frequencies: freqMap
        };
      }
    });

    return summary;
  }

  static getPercentile(sortedArr, percentile) {
    if (sortedArr.length === 0) return 0;
    const index = (percentile / 100) * (sortedArr.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;
    if (lower === upper) return sortedArr[lower];
    return sortedArr[lower] * (1 - weight) + sortedArr[upper] * weight;
  }

  /**
   * Compute Pearson correlation matrix for numerical features
   */
  static computeCorrelationMatrix(dataset) {
    const data = dataset.data;
    const allCols = [...dataset.features, dataset.targetColumn].filter(Boolean);
    const numCols = allCols.filter(col => {
      const type = dataset.featureTypes[col];
      return type === 'number' || type === 'continuous' || type === 'binary';
    });

    const matrix = [];
    for (let i = 0; i < numCols.length; i++) {
      const row = [];
      const colA = numCols[i];
      const valsA = data.map(r => Number(r[colA]));
      const meanA = valsA.reduce((a, b) => a + b, 0) / valsA.length;

      for (let j = 0; j < numCols.length; j++) {
        if (i === j) {
          row.push(1.0);
          continue;
        }
        const colB = numCols[j];
        const valsB = data.map(r => Number(r[colB]));
        const meanB = valsB.reduce((a, b) => a + b, 0) / valsB.length;

        let numerator = 0;
        let denomA = 0;
        let denomB = 0;

        for (let k = 0; k < data.length; k++) {
          const diffA = valsA[k] - meanA;
          const diffB = valsB[k] - meanB;
          numerator += diffA * diffB;
          denomA += diffA * diffA;
          denomB += diffB * diffB;
        }

        const denom = Math.sqrt(denomA * denomB);
        const r = denom === 0 ? 0 : Math.round((numerator / denom) * 100) / 100;
        row.push(r);
      }
      matrix.push({ feature: colA, values: row });
    }

    return { columns: numCols, matrix: matrix };
  }

  /**
   * Compute histogram bins and frequencies for a numerical column
   */
  static computeHistogram(dataset, column, numBins = 8) {
    const data = dataset.data;
    const values = data.map(r => Number(r[column])).filter(v => !isNaN(v)).sort((a, b) => a - b);
    if (values.length === 0) return { bins: [], counts: [], labels: [] };

    const min = values[0];
    const max = values[values.length - 1];
    const step = (max - min) / numBins || 1;

    const bins = [];
    const counts = new Array(numBins).fill(0);
    const labels = [];

    for (let i = 0; i < numBins; i++) {
      const lower = min + i * step;
      const upper = lower + step;
      bins.push({ lower, upper });
      labels.push(`${Math.round(lower * 10) / 10} - ${Math.round(upper * 10) / 10}`);
    }

    values.forEach(v => {
      let binIndex = Math.floor((v - min) / step);
      if (binIndex >= numBins) binIndex = numBins - 1;
      if (binIndex < 0) binIndex = 0;
      counts[binIndex]++;
    });

    return { bins, counts, labels, total: values.length };
  }

  /**
   * Automated Data Quality & Health Assessment
   */
  static computeDataHealth(dataset) {
    const summary = StatsEngine.computeSummary(dataset);
    const data = dataset.data;
    let score = 100;
    const insights = [];

    // Check missing values
    let totalMissing = 0;
    Object.keys(summary).forEach(col => {
      totalMissing += summary[col].missing || 0;
    });

    const totalCells = data.length * Object.keys(summary).length;
    const missingPct = (totalMissing / totalCells) * 100;

    if (missingPct === 0) {
      insights.push({ type: 'success', text: 'Clean Dataset: 0% missing or null values detected.' });
    } else if (missingPct < 5) {
      score -= 10;
      insights.push({ type: 'warning', text: `Minor Sparsity: ${missingPct.toFixed(1)}% missing values found across features.` });
    } else {
      score -= 25;
      insights.push({ type: 'danger', text: `High Sparsity: ${missingPct.toFixed(1)}% missing records require imputation.` });
    }

    // Check outliers
    let totalOutliers = 0;
    Object.keys(summary).forEach(col => {
      if (summary[col].type === 'numerical') {
        totalOutliers += summary[col].outlierCount || 0;
      }
    });

    if (totalOutliers === 0) {
      insights.push({ type: 'success', text: 'Balanced Boundaries: No extreme numerical outliers (1.5x IQR).' });
    } else if (totalOutliers <= 3) {
      score -= 5;
      insights.push({ type: 'info', text: `Detected ${totalOutliers} potential statistical outlier values.` });
    } else {
      score -= 15;
      insights.push({ type: 'warning', text: `Detected ${totalOutliers} outliers that may skew linear estimators.` });
    }

    // Sample size check
    if (data.length >= 25) {
      insights.push({ type: 'success', text: `Adequate Sample: ${data.length} records ready for cross-validation.` });
    } else {
      score -= 15;
      insights.push({ type: 'warning', text: 'Small sample size: Consider synthetic oversampling for robust generalization.' });
    }

    // Calculate Letter Grade
    let grade = 'A+';
    if (score < 60) grade = 'D';
    else if (score < 75) grade = 'C';
    else if (score < 85) grade = 'B';
    else if (score < 95) grade = 'A';

    return {
      score: Math.max(0, Math.min(100, score)),
      grade: grade,
      insights: insights,
      rowCount: data.length,
      colCount: Object.keys(summary).length,
      totalOutliers: totalOutliers,
      missingPct: missingPct
    };
  }
}
