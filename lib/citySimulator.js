/**
 * City Digital Twin Simulator
 * Computes environmental metrics based on urban parameter inputs.
 * All formulas are simplified but directionally realistic.
 */

const BASELINE = {
    pollution: 100,
    co2: 100,
    temperature: 25,
    energy: 100,
    resources: 100,
};

/**
 * @param {Object} params
 * @param {number} params.cars        0–200  (number of thousands of cars)
 * @param {number} params.trees       0–200  (number of thousands of trees)
 * @param {number} params.solar       0–100  (% renewable solar usage)
 * @param {number} params.density     0–100  (building density %)
 * @param {number} params.greenRoofs  0–100  (% buildings with green roofs)
 * @param {number} params.transit     0–100  (% residents using public transit)
 * @returns {Object} metrics
 */
export function computeCityMetrics({ cars, trees, solar, density, greenRoofs, transit }) {
    // Normalize inputs
    const carsN = cars / 100;        // relative car density
    const treesN = trees / 100;       // relative tree coverage
    const solarN = solar / 100;       // fraction of renewable energy
    const densityN = density / 100;     // building density
    const greenN = greenRoofs / 100;  // green roof fraction
    const transitN = transit / 100;     // transit adoption

    // --- Air Pollution (AQI 0–500, lower is better) ---
    const pollution = clamp(
        BASELINE.pollution
        + carsN * 180   // cars are biggest contributor
        - treesN * 60    // trees absorb pollutants
        - transitN * 80   // transit replaces cars
        - solarN * 20    // less fossil fuel burning
        + densityN * 30,  // denser cities trap pollutants
        5, 400
    );

    // --- CO₂ Emissions (tons/year per capita equivalent, 0–100 normalised) ---
    const co2 = clamp(
        BASELINE.co2
        + carsN * 80
        - solarN * 60
        - transitN * 50
        + densityN * 15
        - treesN * 25,
        2, 200
    );

    // --- City Temperature (°C, heat island effect) ---
    const temperature = clamp(
        BASELINE.temperature
        + densityN * 6     // urban heat island
        + carsN * 3     // exhaust heat
        - treesN * 4     // evapotranspiration cooling
        - greenN * 3     // green roofs reduce heat
        - solarN * 1,    // less AC with solar
        18, 42
    );

    // --- Energy Consumption (0–100 index) ---
    const energy = clamp(
        BASELINE.energy
        + densityN * 30
        + carsN * 15
        - solarN * 60
        - greenN * 10
        - transitN * 20,
        5, 200
    );

    // --- Resource Usage (water, materials, etc., 0–100 index) ---
    const resources = clamp(
        BASELINE.resources
        + densityN * 25
        - treesN * 10
        - greenN * 15
        - transitN * 10
        - solarN * 5,
        10, 200
    );

    // --- Sustainability Score (0–100, higher is better) ---
    const sustainability = clamp(
        100
        - (pollution / 400) * 30
        - (co2 / 200) * 25
        - ((temperature - 18) / 24) * 20
        - (energy / 200) * 15
        - (resources / 200) * 10,
        0, 100
    );

    return {
        pollution: Math.round(pollution),
        co2: Math.round(co2),
        temperature: +temperature.toFixed(1),
        energy: Math.round(energy),
        resources: Math.round(resources),
        sustainability: Math.round(sustainability),
    };
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

export const POLLUTION_LABELS = {
    good: [0, 50],
    moderate: [51, 100],
    unhealthy: [101, 200],
    hazardous: [201, 400],
};

export function getPollutionLabel(val) {
    if (val <= 50) return { label: 'Good', color: '#22c55e' };
    if (val <= 100) return { label: 'Moderate', color: '#fbbf24' };
    if (val <= 200) return { label: 'Unhealthy', color: '#f97316' };
    return { label: 'Hazardous', color: '#ef4444' };
}

export function getSustainabilityColor(score) {
    if (score >= 75) return '#22c55e';
    if (score >= 50) return '#fbbf24';
    if (score >= 25) return '#f97316';
    return '#ef4444';
}
