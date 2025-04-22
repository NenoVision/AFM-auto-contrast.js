/**
 * Calculate histogram from input data.
 *
 * @param {Array<number>} data - Input intensity values.
 * @param {number} min - Minimum intensity value.
 * @param {number} max - Maximum intensity value.
 * @param {number} bins - Number of histogram bins.
 * @returns {{ data: Array<number>, step: number }}
 */
export function calculateHistogram(data, min, max, bins) {
    const histogram = {
        data: new Array(bins).fill(0),
        step: (max - min) / (bins - 1),
    };
    for (let i = 0; i < data.length; i++) {
        const bin = Math.floor((data[i] - min) / histogram.step);
        if (bin >= 0 && bin < bins) {
            histogram.data[bin] += 1;
        }
    }
    return histogram;
}