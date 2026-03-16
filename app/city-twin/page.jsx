'use client';
import { useState, useMemo, useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartTooltip, Legend
} from 'chart.js';
import { Car, Trees, Sun, Building, Layers, Train, Wind, Thermometer, Zap, Leaf, Droplets, Activity } from 'lucide-react';
import { computeCityMetrics, getPollutionLabel, getSustainabilityColor } from '@/lib/citySimulator';
import TooltipEl from '@/components/Tooltip';
import InfoPanel from '@/components/InfoPanel';
import styles from './page.module.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

const PARAM_CONFIG = [
    { key: 'cars', label: 'Cars', icon: Car, min: 0, max: 200, step: 5, unit: 'k', color: '#f87171', tip: 'Thousands of vehicles in the city. More cars = more CO₂, heat, and pollution.' },
    { key: 'trees', label: 'Trees', icon: Trees, min: 0, max: 200, step: 5, unit: 'k', color: '#4ade80', tip: 'Thousands of urban trees. Trees absorb CO₂, reduce temperature, and improve air quality.' },
    { key: 'solar', label: 'Solar Energy', icon: Sun, min: 0, max: 100, step: 5, unit: '%', color: '#fbbf24', tip: 'Percentage of energy from solar panels. Replaces fossil fuels, reducing emissions.' },
    { key: 'density', label: 'Building Density', icon: Building, min: 0, max: 100, step: 5, unit: '%', color: '#a78bfa', tip: 'Urban density level. Dense cities create heat islands but may reduce transport needs.' },
    { key: 'greenRoofs', label: 'Green Roofs', icon: Layers, min: 0, max: 100, step: 5, unit: '%', color: '#34d399', tip: 'Percentage of buildings with green roofs. Reduces heat, improves insulation and biodiversity.' },
    { key: 'transit', label: 'Public Transit', icon: Train, min: 0, max: 100, step: 5, unit: '%', color: '#60a5fa', tip: 'Percentage of residents using public transit instead of private cars.' },
];

const DEFAULT_PARAMS = { cars: 100, trees: 50, solar: 20, density: 60, greenRoofs: 15, transit: 30 };

const METRIC_TIPS = {
    pollution: 'Air Quality Index (0–500). Lower is better. Above 100 is unhealthy for sensitive groups.',
    co2: 'Relative CO₂ emissions index. Baseline 100 = average city. Below 50 is excellent.',
    temperature: 'Average city surface temperature in °C. Urban heat islands can add 3–8°C above rural areas.',
    energy: 'Energy consumption index. 100 = baseline. Renewables significantly lower this.',
    resources: 'Water and material resource usage index. Green infrastructure can reduce this.',
};

export default function CityTwinPage() {
    const [params, setParams] = useState(DEFAULT_PARAMS);
    const [history, setHistory] = useState([]);
    const canvasRef = useRef(null);

    const metrics = useMemo(() => computeCityMetrics(params), [params]);
    const pollutionLabel = useMemo(() => getPollutionLabel(metrics.pollution), [metrics.pollution]);
    const sustainColor = useMemo(() => getSustainabilityColor(metrics.sustainability), [metrics.sustainability]);

    // Record history for charts (last 12 changes)
    useEffect(() => {
        setHistory(h => [...h.slice(-11), { ...metrics }]);
    }, [metrics]);

    // Draw city canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        drawCity(ctx, canvas.width, canvas.height, params, metrics);
    }, [params, metrics]);

    function handleParam(key, value) {
        setParams(p => ({ ...p, [key]: Number(value) }));
    }

    const chartData = {
        labels: ['Air Pollution', 'CO₂ Emissions', 'Temperature', 'Energy', 'Resources'],
        datasets: [{
            label: 'Current City',
            data: [
                metrics.pollution / 4,
                metrics.co2 / 2,
                ((metrics.temperature - 18) / 24) * 100,
                metrics.energy / 2,
                metrics.resources / 2,
            ],
            backgroundColor: ['#f87171aa', '#fb923caa', '#fbbf24aa', '#a78bfaaa', '#60a5faaa'],
            borderColor: ['#f87171', '#fb923c', '#fbbf24', '#a78bfa', '#60a5fa'],
            borderWidth: 2,
            borderRadius: 8,
        }],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (c) => ` ${c.raw.toFixed(1)}% of max` } },
        },
        scales: {
            y: {
                min: 0, max: 100,
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: { color: '#94a3b8', callback: v => v + '%' },
            },
            x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 11 } } },
        },
    };

    return (
        <div className={styles.wrap}>
            <div className="container">
                {/* Header */}
                <div className={styles.header}>
                    <div>
                        <div className="badge badge-green" style={{ marginBottom: 10 }}>
                            <Building size={11} /> Sustainable City Digital Twin
                        </div>
                        <h1 className={styles.title}>Bengaluru Digital Twin</h1>
                        <p className={styles.sub}>Adjust urban parameters for the Bengaluru metropolitan area and watch the environmental impact change in real time.</p>
                    </div>
                    <div className={styles.scoreWrap}>
                        <div className={styles.scoreBig} style={{ color: sustainColor }}>{metrics.sustainability}</div>
                        <div className={styles.scoreLabel}>Sustainability Score</div>
                        <div className="progress-bar" style={{ width: 120 }}>
                            <div className="progress-fill" style={{ width: `${metrics.sustainability}%`, background: sustainColor }} />
                        </div>
                    </div>
                </div>

                <div className={styles.layout}>
                    {/* Left: Parameter Sliders */}
                    <aside className={styles.sidebar}>
                        <div className={styles.panelTitle}>Urban Parameters</div>
                        {PARAM_CONFIG.map(({ key, label, icon: Icon, min, max, step, unit, color, tip }) => (
                            <div key={key} className={styles.sliderBlock}>
                                <div className={styles.sliderHeader}>
                                    <span className={styles.sliderIcon} style={{ background: color + '20', color }}>
                                        <Icon size={14} />
                                    </span>
                                    <TooltipEl text={tip}>
                                        <span className={styles.sliderLabel}>{label}</span>
                                    </TooltipEl>
                                    <span className={styles.sliderVal} style={{ color }}>{params[key]}{unit}</span>
                                </div>
                                <input
                                    type="range"
                                    className="slider-range"
                                    min={min} max={max} step={step}
                                    value={params[key]}
                                    onChange={e => handleParam(key, e.target.value)}
                                    style={{ '--c': color, accentColor: color }}
                                />
                            </div>
                        ))}

                        <button
                            className="btn btn-ghost"
                            style={{ width: '100%', marginTop: 8 }}
                            onClick={() => setParams(DEFAULT_PARAMS)}
                        >
                            Reset to Default
                        </button>

                        <InfoPanel title="How it works">
                            The simulator uses directional formulas based on real urban ecology research.
                            Cars and density increase pollution and heat; trees and green roofs cool the city;
                            solar and transit reduce CO₂ emissions. Results are scaled indices — not exact predictions.
                        </InfoPanel>
                    </aside>

                    {/* Center: City Canvas + Metrics */}
                    <div className={styles.main}>
                        {/* City Canvas */}
                        <div className={styles.canvasWrap}>
                            <canvas ref={canvasRef} width={800} height={260} className={styles.canvas} />
                            <div className={styles.canvasBadge} style={{ background: pollutionLabel.color + '22', color: pollutionLabel.color, border: `1px solid ${pollutionLabel.color}44` }}>
                                AQI: {metrics.pollution} – {pollutionLabel.label}
                            </div>
                        </div>

                        {/* Metric cards */}
                        <div className={styles.metricsGrid}>
                            {[
                                { label: 'Air Pollution', value: metrics.pollution, unit: 'AQI', icon: Wind, color: pollutionLabel.color, sub: pollutionLabel.label, tip: METRIC_TIPS.pollution },
                                { label: 'CO₂ Emissions', value: metrics.co2, unit: 'index', icon: Activity, color: '#fb923c', tip: METRIC_TIPS.co2 },
                                { label: 'Temperature', value: `${metrics.temperature}°C`, unit: '', icon: Thermometer, color: '#f87171', tip: METRIC_TIPS.temperature },
                                { label: 'Energy Use', value: metrics.energy, unit: 'index', icon: Zap, color: '#a78bfa', tip: METRIC_TIPS.energy },
                                { label: 'Resources', value: metrics.resources, unit: 'index', icon: Droplets, color: '#60a5fa', tip: METRIC_TIPS.resources },
                            ].map(({ label, value, unit, icon: Icon, color, sub, tip }) => (
                                <div key={label} className={styles.metricCard} style={{ '--accent': color + '30' }}>
                                    <div className={styles.metricIcon} style={{ background: color + '20', color }}>
                                        <Icon size={18} />
                                    </div>
                                    <TooltipEl text={tip}>
                                        <div className={styles.metricLabel}>{label}</div>
                                    </TooltipEl>
                                    <div className={styles.metricValue} style={{ color }}>{value} <span style={{ fontSize: 12, opacity: 0.7 }}>{unit}</span></div>
                                    {sub && <div className={styles.metricSub}>{sub}</div>}
                                </div>
                            ))}
                        </div>

                        {/* Chart */}
                        <div className={styles.chartWrap}>
                            <div className={styles.panelTitle} style={{ marginBottom: 16 }}>Environmental Impact Levels (% of Maximum)</div>
                            <div style={{ height: 220 }}>
                                <Bar data={chartData} options={chartOptions} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── City Canvas Drawing ───────────────────────────────────────────────
function drawCity(ctx, W, H, params, metrics) {
    ctx.clearRect(0, 0, W, H);

    // Sky gradient
    const horizon = H * 0.55;
    const skyAlpha = Math.min(metrics.pollution / 300, 0.8);
    const sky = ctx.createLinearGradient(0, 0, 0, horizon);
    sky.addColorStop(0, `rgba(${lerp(10, 80, skyAlpha)},${lerp(24, 60, skyAlpha)},${lerp(80, 50, skyAlpha)},1)`);
    sky.addColorStop(1, `rgba(${lerp(30, 100, skyAlpha)},${lerp(58, 80, skyAlpha)},${lerp(138, 60, skyAlpha)},1)`);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, horizon);

    // Ground
    const ground = ctx.createLinearGradient(0, horizon, 0, H);
    ground.addColorStop(0, '#1a2e1a');
    ground.addColorStop(1, '#111e11');
    ctx.fillStyle = ground;
    ctx.fillRect(0, horizon, W, H - horizon);

    // Road
    ctx.fillStyle = '#1c1f24';
    ctx.fillRect(0, H * 0.72, W, H * 0.1);
    // Road markings
    ctx.strokeStyle = '#fbbf2444';
    ctx.setLineDash([30, 20]);
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, H * 0.77); ctx.lineTo(W, H * 0.77);
    ctx.stroke(); ctx.setLineDash([]);

    // Sun / Smog haze
    const smogAlpha = Math.min(metrics.pollution / 400, 0.7);
    if (smogAlpha > 0) {
        const smog = ctx.createRadialGradient(W / 2, -20, 0, W / 2, 0, W * 0.7);
        smog.addColorStop(0, `rgba(150,100,30,${smogAlpha * 0.5})`);
        smog.addColorStop(1, 'transparent');
        ctx.fillStyle = smog;
        ctx.fillRect(0, 0, W, H);
    }

    // Sun
    const solarGlow = params.solar / 100;
    ctx.save();
    const sunGrad = ctx.createRadialGradient(W - 80, 40, 0, W - 80, 40, 30 + solarGlow * 20);
    sunGrad.addColorStop(0, `rgba(255,230,100,${0.6 + solarGlow * 0.4})`);
    sunGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = sunGrad;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();

    // Buildings
    const numBuildings = 14;
    const buildingDensity = 0.4 + params.density / 100 * 0.6;
    const rand = mulberry32(42);

    for (let i = 0; i < numBuildings; i++) {
        const x = (W / numBuildings) * i + rand() * 10;
        const bw = (W / numBuildings) * buildingDensity * (0.6 + rand() * 0.4);
        const bh = horizon * (0.2 + rand() * 0.6 + buildingDensity * 0.2);
        const by = horizon - bh;

        // Building body
        const shade = 40 + Math.floor(rand() * 40);
        ctx.fillStyle = `rgb(${shade},${shade + 10},${shade + 20})`;
        ctx.fillRect(x, by, bw, bh);

        // Windows
        ctx.fillStyle = 'rgba(200,230,255,0.15)';
        const winCols = 3, winRows = Math.max(2, Math.floor(bh / 20));
        const ww = bw / (winCols * 2), wh = 8;
        for (let r = 0; r < winRows; r++) {
            for (let c = 0; c < winCols; c++) {
                const lit = rand() > 0.4;
                ctx.fillStyle = lit ? 'rgba(255,240,150,0.4)' : 'rgba(100,160,255,0.1)';
                ctx.fillRect(x + ww * (c * 2 + 0.5), by + r * 18 + 8, ww * 0.8, wh);
            }
        }

        // Green roof
        if (rand() < params.greenRoofs / 100) {
            ctx.fillStyle = '#2d5a1e';
            ctx.fillRect(x, by - 6, bw, 6);
            // Little plants
            for (let p = 0; p < 4; p++) {
                ctx.fillStyle = '#4ade80';
                ctx.beginPath();
                ctx.arc(x + (bw / 5) * (p + 0.5), by - 4, 4, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Solar panels
        if (rand() < params.solar / 100 * 0.8) {
            ctx.fillStyle = '#1e40af';
            ctx.fillRect(x + 4, by - 4, bw - 8, 4);
            ctx.fillStyle = '#93c5fdaa';
            ctx.fillRect(x + 5, by - 4, bw / 2 - 8, 3);
        }
    }

    // Trees
    const numTrees = Math.floor((params.trees / 200) * 25);
    const treeRand = mulberry32(7);
    for (let i = 0; i < numTrees; i++) {
        const tx = treeRand() * W;
        const ty = horizon - 5 + treeRand() * (H * 0.15);
        const th = 20 + treeRand() * 20;

        // Trunk
        ctx.fillStyle = '#5c3d1e';
        ctx.fillRect(tx - 2, ty, 4, th * 0.5);
        // Canopy
        ctx.fillStyle = `hsl(${100 + treeRand() * 40}, 60%, 35%)`;
        ctx.beginPath();
        ctx.arc(tx, ty, th * 0.4, 0, Math.PI * 2);
        ctx.fill();
    }

    // Cars
    const numCars = Math.min(Math.floor(params.cars / 20), 10);
    for (let i = 0; i < numCars; i++) {
        const cx = (W / numCars) * i + 10;
        const cy = H * 0.74;
        drawCar(ctx, cx, cy, i % 2 === 0);
    }

    // Smog particles
    if (metrics.pollution > 100) {
        const particleRand = mulberry32(99);
        const numP = Math.floor((metrics.pollution - 100) / 10);
        for (let i = 0; i < numP; i++) {
            ctx.fillStyle = `rgba(150,120,50,${0.1 + particleRand() * 0.2})`;
            ctx.beginPath();
            ctx.arc(particleRand() * W, particleRand() * horizon, 3 + particleRand() * 8, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Transit bus
    if (params.transit > 30) {
        drawBus(ctx, W * 0.6, H * 0.745);
    }
}

function drawCar(ctx, x, y, dir) {
    const d = dir ? 1 : -1;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(d, 1);
    ctx.fillStyle = ['#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6'][Math.floor(x) % 4];
    ctx.fillRect(0, -8, 28, 8);
    ctx.fillStyle = 'rgba(150,220,255,0.6)';
    ctx.fillRect(4, -13, 12, 5);
    ctx.fillStyle = '#111';
    ctx.beginPath(); ctx.arc(5, 0, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(22, 0, 4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
}

function drawBus(ctx, x, y) {
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(x, y - 18, 50, 18);
    ctx.fillStyle = '#166534';
    ctx.fillRect(x + 2, y - 17, 46, 3);
    ctx.fillStyle = 'rgba(150,220,255,0.5)';
    for (let i = 0; i < 5; i++) ctx.fillRect(x + 4 + i * 9, y - 15, 6, 8);
    ctx.fillStyle = '#111';
    ctx.beginPath(); ctx.arc(x + 8, y, 5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + 40, y, 5, 0, Math.PI * 2); ctx.fill();
}

function mulberry32(seed) {
    return function () {
        seed |= 0; seed = seed + 0x6D2B79F5 | 0;
        let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

function lerp(a, b, t) { return a + (b - a) * t; }
