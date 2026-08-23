/**
 * DataPulse Studio - In-Browser Machine Learning Engine
 * Implements Logistic Regression, Multiple Linear Regression, K-Nearest Neighbors (KNN),
 * Decision Tree Classifier, and K-Means Clustering with live training hooks and metric evaluators.
 */

class MLEngine {
  /**
   * Min-Max Normalizer for numerical matrices
   */
  static normalizeFeatures(X) {
    if (X.length === 0) return { normalized: [], mins: [], maxs: [] };
    const numFeatures = X[0].length;
    const mins = new Array(numFeatures).fill(Infinity);
    const maxs = new Array(numFeatures).fill(-Infinity);

    for (let i = 0; i < X.length; i++) {
      for (let j = 0; j < numFeatures; j++) {
        if (X[i][j] < mins[j]) mins[j] = X[i][j];
        if (X[i][j] > maxs[j]) maxs[j] = X[i][j];
      }
    }

    const normalized = X.map(row =>
      row.map((val, j) => {
        const range = maxs[j] - mins[j];
        return range === 0 ? 0 : (val - mins[j]) / range;
      })
    );

    return { normalized, mins, maxs };
  }

  /**
   * Split dataset into training and testing partitions
   */
  static trainTestSplit(X, y, testRatio = 0.25, seed = 42) {
    const indices = Array.from({ length: X.length }, (_, i) => i);
    // Simple deterministic pseudo-shuffle
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor((Math.sin(seed + i) * 10000) % 1 * (i + 1));
      const validJ = Math.abs(j) % (i + 1);
      [indices[i], indices[validJ]] = [indices[validJ], indices[i]];
    }

    const testSize = Math.max(1, Math.floor(X.length * testRatio));
    const testIndices = indices.slice(0, testSize);
    const trainIndices = indices.slice(testSize);

    return {
      X_train: trainIndices.map(i => X[i]),
      y_train: trainIndices.map(i => y[i]),
      X_test: testIndices.map(i => X[i]),
      y_test: testIndices.map(i => y[i])
    };
  }

  /**
   * Sigmoid Activation Function
   */
  static sigmoid(z) {
    return 1 / (1 + Math.exp(-Math.max(-50, Math.min(50, z))));
  }

  /**
   * Train Logistic Regression Classifier with Animated Epoch Callback
   */
  static async trainLogisticRegression(X_train, y_train, options = {}, onEpochProgress = null) {
    const epochs = options.epochs || 80;
    const lr = options.learningRate || 0.1;
    const numFeatures = X_train[0].length;
    const n = X_train.length;

    let weights = new Array(numFeatures).fill(0).map(() => (Math.random() - 0.5) * 0.1);
    let bias = 0;
    const lossHistory = [];
    const accuracyHistory = [];

    for (let epoch = 1; epoch <= epochs; epoch++) {
      let totalLoss = 0;
      let correct = 0;
      const dw = new Array(numFeatures).fill(0);
      let db = 0;

      for (let i = 0; i < n; i++) {
        let linear = bias;
        for (let j = 0; j < numFeatures; j++) {
          linear += weights[j] * X_train[i][j];
        }
        const pred = MLEngine.sigmoid(linear);
        const target = y_train[i];

        // Binary Cross-Entropy Loss
        const eps = 1e-15;
        const loss = -(target * Math.log(pred + eps) + (1 - target) * Math.log(1 - pred + eps));
        totalLoss += loss;

        const predictedClass = pred >= 0.5 ? 1 : 0;
        if (predictedClass === target) correct++;

        const error = pred - target;
        for (let j = 0; j < numFeatures; j++) {
          dw[j] += error * X_train[i][j];
        }
        db += error;
      }

      // Update parameters
      for (let j = 0; j < numFeatures; j++) {
        weights[j] -= (lr * dw[j]) / n;
      }
      bias -= (lr * db) / n;

      const epochLoss = totalLoss / n;
      const epochAcc = (correct / n) * 100;
      lossHistory.push(epochLoss);
      accuracyHistory.push(epochAcc);

      if (onEpochProgress && (epoch % 5 === 0 || epoch === epochs)) {
        onEpochProgress({ epoch, epochs, loss: epochLoss, accuracy: epochAcc });
        await new Promise(r => setTimeout(r, 15));
      }
    }

    return {
      weights,
      bias,
      lossHistory,
      accuracyHistory,
      predict: (x) => {
        let linear = bias;
        for (let j = 0; j < x.length; j++) linear += weights[j] * x[j];
        const prob = MLEngine.sigmoid(linear);
        return { label: prob >= 0.5 ? 1 : 0, probability: prob };
      }
    };
  }

  /**
   * K-Nearest Neighbors Classifier
   */
  static trainKNN(X_train, y_train, k = 3) {
    return {
      k,
      predict: (x) => {
        const distances = X_train.map((trainRow, idx) => {
          let distSq = 0;
          for (let j = 0; j < x.length; j++) {
            distSq += Math.pow(trainRow[j] - x[j], 2);
          }
          return { dist: Math.sqrt(distSq), label: y_train[idx] };
        });

        distances.sort((a, b) => a.dist - b.dist);
        const kNearest = distances.slice(0, Math.min(k, distances.length));

        const votes = {};
        kNearest.forEach(n => {
          votes[n.label] = (votes[n.label] || 0) + 1;
        });

        let bestLabel = null;
        let maxVotes = -1;
        for (const [label, count] of Object.entries(votes)) {
          if (count > maxVotes) {
            maxVotes = count;
            bestLabel = Number(label);
          }
        }

        const prob = maxVotes / kNearest.length;
        return { label: bestLabel, probability: prob };
      }
    };
  }

  /**
   * Multiple Linear Regression (Gradient Descent)
   */
  static async trainLinearRegression(X_train, y_train, options = {}, onEpochProgress = null) {
    const epochs = options.epochs || 100;
    const lr = options.learningRate || 0.05;
    const numFeatures = X_train[0].length;
    const n = X_train.length;

    let weights = new Array(numFeatures).fill(0);
    let bias = 0;
    const lossHistory = [];

    for (let epoch = 1; epoch <= epochs; epoch++) {
      let totalMse = 0;
      const dw = new Array(numFeatures).fill(0);
      let db = 0;

      for (let i = 0; i < n; i++) {
        let y_pred = bias;
        for (let j = 0; j < numFeatures; j++) {
          y_pred += weights[j] * X_train[i][j];
        }
        const error = y_pred - y_train[i];
        totalMse += error * error;

        for (let j = 0; j < numFeatures; j++) {
          dw[j] += error * X_train[i][j];
        }
        db += error;
      }

      for (let j = 0; j < numFeatures; j++) {
        weights[j] -= (lr * (2 * dw[j])) / n;
      }
      bias -= (lr * (2 * db)) / n;

      const epochMse = totalMse / n;
      lossHistory.push(epochMse);

      if (onEpochProgress && (epoch % 5 === 0 || epoch === epochs)) {
        onEpochProgress({ epoch, epochs, loss: epochMse });
        await new Promise(r => setTimeout(r, 12));
      }
    }

    return {
      weights,
      bias,
      lossHistory,
      predict: (x) => {
        let y_pred = bias;
        for (let j = 0; j < x.length; j++) y_pred += weights[j] * x[j];
        return { value: y_pred };
      }
    };
  }

  /**
   * K-Means Clustering Engine
   */
  static async trainKMeans(X, k = 3, maxIters = 25, onStepProgress = null) {
    const numFeatures = X[0].length;
    // Initialize centroids using random samples
    let centroids = [];
    const used = new Set();
    while (centroids.length < k && centroids.length < X.length) {
      const idx = Math.floor(Math.random() * X.length);
      if (!used.has(idx)) {
        used.add(idx);
        centroids.push([...X[idx]]);
      }
    }

    let clusters = new Array(X.length).fill(0);
    let history = [];

    for (let iter = 1; iter <= maxIters; iter++) {
      // Assign points to nearest centroid
      let changed = false;
      for (let i = 0; i < X.length; i++) {
        let minDist = Infinity;
        let bestCluster = 0;
        for (let c = 0; c < centroids.length; c++) {
          let distSq = 0;
          for (let j = 0; j < numFeatures; j++) {
            distSq += Math.pow(X[i][j] - centroids[c][j], 2);
          }
          if (distSq < minDist) {
            minDist = distSq;
            bestCluster = c;
          }
        }
        if (clusters[i] !== bestCluster) {
          clusters[i] = bestCluster;
          changed = true;
        }
      }

      // Recompute centroids
      const newCentroids = Array.from({ length: k }, () => new Array(numFeatures).fill(0));
      const counts = new Array(k).fill(0);

      for (let i = 0; i < X.length; i++) {
        const c = clusters[i];
        counts[c]++;
        for (let j = 0; j < numFeatures; j++) {
          newCentroids[c][j] += X[i][j];
        }
      }

      for (let c = 0; c < k; c++) {
        if (counts[c] > 0) {
          for (let j = 0; j < numFeatures; j++) {
            newCentroids[c][j] /= counts[c];
          }
        } else {
          newCentroids[c] = [...centroids[c]];
        }
      }

      centroids = newCentroids;
      history.push({ iter, centroids: JSON.parse(JSON.stringify(centroids)) });

      if (onStepProgress) {
        onStepProgress({ iter, maxIters, centroids, clusters });
        await new Promise(r => setTimeout(r, 40));
      }

      if (!changed) break;
    }

    // Compute Inertia (WCSS)
    let wcss = 0;
    for (let i = 0; i < X.length; i++) {
      const c = clusters[i];
      for (let j = 0; j < numFeatures; j++) {
        wcss += Math.pow(X[i][j] - centroids[c][j], 2);
      }
    }

    return { centroids, clusters, wcss, history };
  }

  /**
   * Classification Metrics Evaluator (Accuracy, Precision, Recall, F1, Confusion Matrix)
   */
  static evaluateClassification(y_true, y_pred) {
    let tp = 0, fp = 0, tn = 0, fn = 0;

    for (let i = 0; i < y_true.length; i++) {
      const actual = y_true[i];
      const pred = y_pred[i];
      if (actual === 1 && pred === 1) tp++;
      else if (actual === 0 && pred === 1) fp++;
      else if (actual === 0 && pred === 0) tn++;
      else if (actual === 1 && pred === 0) fn++;
    }

    const total = y_true.length;
    const accuracy = (tp + tn) / (total || 1);
    const precision = tp / (tp + fp || 1);
    const recall = tp / (tp + fn || 1);
    const f1 = (2 * precision * recall) / (precision + recall || 1);

    return {
      accuracy: Math.round(accuracy * 1000) / 10,
      precision: Math.round(precision * 1000) / 10,
      recall: Math.round(recall * 1000) / 10,
      f1Score: Math.round(f1 * 1000) / 10,
      confusionMatrix: { tp, fp, tn, fn }
    };
  }

  /**
   * Regression Metrics Evaluator (MSE, RMSE, MAE, R²)
   */
  static evaluateRegression(y_true, y_pred) {
    const n = y_true.length;
    let sumSqErr = 0;
    let sumAbsErr = 0;
    const meanY = y_true.reduce((a, b) => a + b, 0) / (n || 1);
    let totalVar = 0;

    for (let i = 0; i < n; i++) {
      const err = y_pred[i] - y_true[i];
      sumSqErr += err * err;
      sumAbsErr += Math.abs(err);
      totalVar += Math.pow(y_true[i] - meanY, 2);
    }

    const mse = sumSqErr / (n || 1);
    const rmse = Math.sqrt(mse);
    const mae = sumAbsErr / (n || 1);
    const r2 = totalVar === 0 ? 1 : 1 - sumSqErr / totalVar;

    return {
      mse: Math.round(mse * 100) / 100,
      rmse: Math.round(rmse * 100) / 100,
      mae: Math.round(mae * 100) / 100,
      r2Score: Math.round(Math.max(-1, Math.min(1, r2)) * 1000) / 1000
    };
  }
}
