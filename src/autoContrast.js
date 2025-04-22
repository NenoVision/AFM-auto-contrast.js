import { calculateHistogram } from './histogram.js';

/**
 * Calculate optimal min and max values for contrast adjustment based on histogram analysis.
 *
 * @param {Array<number>} data - Input intensity values.
 * @param {number} [min] - Optional minimum value.
 * @param {number} [max] - Optional maximum value.
 * @returns {[number, number]} - Optimized [min, max] range.
 */
export function calculateContrastScale(data, min = Math.min(...data), max = Math.max(...data)) {
    const histogramBins = 512;
    let n = data.length;
    let rmin = min;
    let rmax = max;

    if (n < 4 || min >= max) {
        rmin = Math.min(min, max);
        rmax = Math.max(min, max);
        return [rmin, rmax];
    }

    const histogram = calculateHistogram(data, min, max, histogramBins);

    const hasReachedThresholdPercentage = (sum, totalCount, percentage) => {
        const threshold = totalCount * percentage;
        return sum >= threshold;
    };

    const isBinAboveThreshold = (binValue, totalCount, bins, percentage) => {
        const thresholdPerBin = (percentage * totalCount) / bins;
        return binValue >= thresholdPerBin;
    };

    const binThreshold = 0.05;
    const histogramSumThreshold = 0.02;

    let histogramSum = 0;
    for (let i = 0; i < histogramBins - 1; i++) {
        const binValue = histogram.data[i];
        const binAboveThreshold = isBinAboveThreshold(binValue, n, histogramBins, binThreshold);
        const reachedThresholdPercentage = hasReachedThresholdPercentage(histogramSum, n, histogramSumThreshold);
        if (binAboveThreshold || reachedThresholdPercentage) {
            break;
        }
        histogramSum += binValue;
        rmin = min + i * histogram.step;
    }

    histogramSum = 0;
    for (let i = histogramBins - 1; i > 0; i--) {
        const binValue = histogram.data[i];
        const binAboveThreshold = isBinAboveThreshold(binValue, n, histogramBins, binThreshold);
        const reachedThresholdPercentage = hasReachedThresholdPercentage(histogramSum, n, histogramSumThreshold);
        if (binAboveThreshold || reachedThresholdPercentage) {
            break;
        }
        histogramSum += binValue;
        rmax = min + (i + 1) * histogram.step;
    }

    if (!(rmin < rmax)) {
        rmin = min;
        rmax = max;
    }

    return [rmin, rmax];
}