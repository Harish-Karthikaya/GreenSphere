/**
 * Climate Consequence Simulator
 * Simplified IPCC-inspired formulas for long-term climate projections.
 */

/**
 * @param {Object} params
 * @param {number} params.fossilFuel   0–100 (usage level %)
 * @param {number} params.renewable    0–100 (adoption %)
 * @param {number} params.deforestation 0–100 (level %)
 * @param {number} params.transit      0–100 (adoption %)
 * @param {number} params.industrial   0–100 (emissions level %)
 */
export function computeClimateOutcomes({ fossilFuel, renewable, deforestation, transit, industrial }) {
    const ff = fossilFuel / 100;
    const re = renewable / 100;
    const de = deforestation / 100;
    const tr = transit / 100;
    const ind = industrial / 100;

    // --- Global Temperature Rise (°C above pre-industrial by 2100) ---
    const tempRise = clamp(
        0.5
        + ff * 3.5
        - re * 1.8
        + de * 1.2
        - tr * 0.6
        + ind * 1.8,
        0.1, 6.0
    );

    // --- Sea Level Rise (cm by 2100) ---
    const seaRise = clamp(
        10
        + tempRise * 30
        + de * 8,
        10, 200
    );

    // --- Air Quality Index (1-500, lower is better) ---
    const airQuality = clamp(
        20
        + ff * 250
        + ind * 200
        - re * 80
        - tr * 100,
        10, 500
    );

    // --- Energy Demand (TW, relative index 0-200) ---
    const energyDemand = clamp(
        50
        + ff * 100
        + ind * 60
        - re * 70
        - tr * 30,
        10, 200
    );

    // --- Ecosystem Health (0-100, 100 = pristine) ---
    const ecosystem = clamp(
        100
        - de * 50
        - ff * 20
        - tempRise * 8
        + re * 10
        + tr * 5,
        0, 100
    );

    // --- Final Sustainability Score (0-100) ---
    const score = clamp(
        100
        - (tempRise / 6) * 40
        - (seaRise / 200) * 20
        - (airQuality / 500) * 20
        - (energyDemand / 200) * 10
        + (ecosystem / 100) * 10,
        0, 100
    );

    return {
        tempRise: +tempRise.toFixed(2),
        seaRise: Math.round(seaRise),
        airQuality: Math.round(airQuality),
        energyDemand: Math.round(energyDemand),
        ecosystem: Math.round(ecosystem),
        score: Math.round(score),
    };
}

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

export const SCENARIOS = {
    bau: {
        label: 'Business as Usual (Global)',
        color: '#ef4444',
        params: { fossilFuel: 85, renewable: 15, deforestation: 70, transit: 20, industrial: 80 },
    },
    indiaCurrent: {
        label: 'India Current Policy',
        color: '#f97316',
        params: { fossilFuel: 65, renewable: 30, deforestation: 40, transit: 35, industrial: 70 },
    },
    indiaNetZero: {
        label: 'India Net Zero 2070',
        color: '#fbbf24',
        params: { fossilFuel: 40, renewable: 60, deforestation: 20, transit: 50, industrial: 40 },
    },
    green: {
        label: 'Aggressive Transition',
        color: '#22c55e',
        params: { fossilFuel: 15, renewable: 85, deforestation: 10, transit: 80, industrial: 20 },
    },
};

export function getTempRiseColor(val) {
    if (val < 1.5) return '#22c55e';
    if (val < 2.0) return '#fbbf24';
    if (val < 3.0) return '#f97316';
    return '#ef4444';
}
