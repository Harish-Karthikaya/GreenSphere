'use client';
import { useState, useMemo, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale, LinearScale, PointElement, LineElement,
    Title, Tooltip, Legend, Filler
} from 'chart.js';
import {
    Flame, Sun, Trees, Train, Factory,
    Thermometer, Waves, Wind, Zap, Leaf,
    Globe, BarChart2, RefreshCw, X
} from 'lucide-react';
import { computeClimateOutcomes, SCENARIOS, getTempRiseColor } from '@/lib/climateSimulator';
import TooltipEl from '@/components/Tooltip';
import InfoPanel from '@/components/InfoPanel';
import styles from './page.module.css';

ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement,
    Title, Tooltip, Legend, Filler
);

const PARAM_CONFIG = [
    { key: 'fossilFuel', label: 'Fossil Fuel Usage', icon: Flame, min: 0, max: 100, step: 5, unit: '%', color: '#ef4444', tip: 'Global reliance on coal, oil, and natural gas for energy. The single largest driver of climate change.' },
    { key: 'renewable', label: 'Renewable Adoption', icon: Sun, min: 0, max: 100, step: 5, unit: '%', color: '#fbbf24', tip: 'Share of energy from solar, wind, and hydro. Directly offsets fossil fuel CO₂ emissions.' },
    { key: 'deforestation', label: 'Deforestation Level', icon: Trees, min: 0, max: 100, step: 5, unit: '%', color: '#f97316', tip: 'Rate of forest loss. Forests absorb 30% of global CO₂. Deforestation releases stored carbon.' },
    { key: 'transit', label: 'Public Transit Use', icon: Train, min: 0, max: 100, step: 5, unit: '%', color: '#60a5fa', tip: 'Percentage of transport done via public transit vs private vehicles. Reduces urban emissions significantly.' },
    { key: 'industrial', label: 'Industrial Emissions', icon: Factory, min: 0, max: 100, step: 5, unit: '%', color: '#a78bfa', tip: 'Emissions from cement, steel, and chemical industries. Hard-to-abate sector representing ~30% of emissions.' },
];

const DEFAULT_PARAMS = { fossilFuel: 60, renewable: 25, deforestation: 40, transit: 40, industrial: 55 };

const METRIC_INFO = [
    { key: 'tempRise', label: 'Temp Rise', icon: Thermometer, unit: '°C', tip: 'Projected global average temperature increase above pre-industrial levels by 2100.', good: 0, bad: 4 },
    { key: 'seaRise', label: 'Sea Level Rise', icon: Waves, unit: 'cm', tip: 'Projected sea level rise in centimetres by 2100 due to ice melt and ocean expansion.', good: 20, bad: 150 },
    { key: 'airQuality', label: 'Air Quality', icon: Wind, unit: 'AQI', tip: 'Air Quality Index. 0–50 Good, 51–100 Moderate, 101–300 Unhealthy.', good: 50, bad: 400 },
    { key: 'energyDemand', label: 'Energy Demand', icon: Zap, unit: 'TW', tip: 'Global energy demand index. High renewables = cleaner demand.', good: 30, bad: 180 },
    { key: 'ecosystem', label: 'Ecosystem', icon: Leaf, unit: '/100', tip: 'Ecosystem health score: biodiversity, forests, ocean health.', good: 80, bad: 20, invert: true },
];

const YEARS = ['2025', '2035', '2045', '2055', '2065', '2075', '2085', '2100'];

export default function ClimatePage() {
    const [params, setParams] = useState(DEFAULT_PARAMS);
    const [compareScenario, setCompareScenario] = useState(null);
    const [activeTab, setActiveTab] = useState('custom'); // 'custom' | scenario id
    const canvasRef = useRef(null);

    const currentParams = useMemo(() => {
        if (activeTab !== 'custom' && SCENARIOS[activeTab]) {
            return SCENARIOS[activeTab].params;
        }
        return params;
    }, [activeTab, params]);

    const metrics = useMemo(() => computeClimateOutcomes(currentParams), [currentParams]);
    const compareMetrics = useMemo(() =>
        compareScenario ? computeClimateOutcomes(SCENARIOS[compareScenario].params) : null,
        [compareScenario]
    );
    const tempColor = getTempRiseColor(metrics.tempRise);

    // Build temperature projection curve
    function buildTempCurve(p) {
        return YEARS.map((_, i) => {
            const frac = i / (YEARS.length - 1);
            const outcome = computeClimateOutcomes(p);
            return +(frac * outcome.tempRise * 0.85 + 0.3 + frac * outcome.tempRise * 0.15).toFixed(2);
        });
    }

    const lineData = {
        labels: YEARS,
        datasets: [
            {
                label: activeTab === 'custom' ? 'Your Scenario' : SCENARIOS[activeTab]?.label,
                data: buildTempCurve(currentParams),
                borderColor: tempColor,
                backgroundColor: tempColor + '20',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                borderWidth: 2.5,
            },
            ...(compareScenario ? [{
                label: SCENARIOS[compareScenario].label,
                data: buildTempCurve(SCENARIOS[compareScenario].params),
                borderColor: SCENARIOS[compareScenario].color,
                backgroundColor: SCENARIOS[compareScenario].color + '15',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                borderWidth: 2,
                borderDash: [6, 3],
            }] : []),
        ],
    };

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: !!compareScenario,
                position: 'top',
                labels: { color: '#94a3b8', boxWidth: 20, font: { size: 12 } },
            },
            tooltip: {
                callbacks: {
                    label: (c) => ` ${c.dataset.label}: +${c.raw}°C`,
                },
            },
        },
        scales: {
            y: {
                min: 0,
                title: { display: true, text: '°C above pre-industrial', color: '#94a3b8', font: { size: 12 } },
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: { color: '#94a3b8', callback: v => `+${v}°C` },
            },
            x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
        },
    };

    // Draw animated globe
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let frame = 0;
        let animId;

        function drawGlobe() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const cx = canvas.width / 2, cy = canvas.height / 2, r = Math.min(cx, cy) - 10;
            const heatFrac = Math.min(metrics.tempRise / 5, 1);

            // Glow
            const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 1.4);
            const hue = Math.round(140 - heatFrac * 140); // green → red
            glow.addColorStop(0, `hsla(${hue},80%,40%,0.4)`);
            glow.addColorStop(1, 'transparent');
            ctx.fillStyle = glow;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Globe base
            const base = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.05, cx, cy, r);
            base.addColorStop(0, `hsl(${hue},60%,55%)`);
            base.addColorStop(0.5, `hsl(${hue},55%,35%)`);
            base.addColorStop(1, `hsl(${hue},50%,15%)`);
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.fillStyle = base;
            ctx.fill();

            // Ocean shine
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.strokeStyle = `hsla(${hue + 30},60%,70%,0.25)`;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Animated latitude rings
            for (let i = 1; i <= 4; i++) {
                const y = cy - r + (r * 2 * i / 5);
                const rr = Math.sqrt(Math.max(0, r * r - (y - cy) * (y - cy)));
                ctx.beginPath();
                ctx.ellipse(cx, y, rr, rr * 0.25, 0, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(255,255,255,0.08)`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            // Animated longitude lines
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI + (frame / 400);
                ctx.beginPath();
                ctx.ellipse(cx, cy, r * Math.abs(Math.cos(angle)), r, Math.PI / 2, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(255,255,255,0.05)`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            // Ice cap (shrinks with temp)
            const iceR = r * Math.max(0.1, 0.45 - heatFrac * 0.35);
            const ice = ctx.createRadialGradient(cx, cy - r + iceR * 0.5, 0, cx, cy - r + iceR, iceR);
            ice.addColorStop(0, 'rgba(200,230,255,0.9)');
            ice.addColorStop(1, 'rgba(200,230,255,0)');
            ctx.beginPath();
            ctx.arc(cx, cy - r + iceR * 0.6, iceR * 0.8, 0, Math.PI * 2);
            ctx.fillStyle = ice;
            ctx.fill();

            // CO2 haze rings
            if (metrics.tempRise > 2) {
                const hazeAlpha = (metrics.tempRise - 2) / 10;
                for (let i = 0; i < 3; i++) {
                    const phase = (frame / 180 + i / 3) * Math.PI * 2;
                    ctx.beginPath();
                    ctx.arc(cx, cy, r + 6 + i * 5 + Math.sin(phase) * 2, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(255,160,50,${hazeAlpha * 0.3})`;
                    ctx.lineWidth = 1.5 - i * 0.3;
                    ctx.stroke();
                }
            }

            // Specular highlight
            const spec = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.35, 0, cx - r * 0.35, cy - r * 0.35, r * 0.5);
            spec.addColorStop(0, 'rgba(255,255,255,0.2)');
            spec.addColorStop(1, 'transparent');
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.fillStyle = spec;
            ctx.fill();

            frame++;
            animId = requestAnimationFrame(drawGlobe);
        }

        drawGlobe();
        return () => cancelAnimationFrame(animId);
    }, [metrics]);

    function handleParam(key, value) {
        setParams(p => ({ ...p, [key]: Number(value) }));
        setActiveTab('custom');
    }

    function applyScenario(key) {
        setActiveTab(key);
    }

    function getMetricStatus(key, val) {
        const info = METRIC_INFO.find(m => m.key === key);
        if (!info) return '#94a3b8';
        const { good, bad, invert } = info;
        const frac = (val - good) / (bad - good);
        if (invert) return frac < 0 ? '#22c55e' : frac < 0.5 ? '#fbbf24' : '#ef4444';
        return frac < 0.25 ? '#22c55e' : frac < 0.6 ? '#fbbf24' : '#ef4444';
    }

    return (
        <div className={styles.wrap}>
            <div className="container">
                {/* Header */}
                <div className={styles.header}>
                    <div>
                        <div className="badge" style={{ background: 'rgba(20,184,166,0.15)', color: '#14b8a6', border: '1px solid rgba(20,184,166,0.3)', marginBottom: 10 }}>
                            <Globe size={11} /> Climate Consequence Simulator
                        </div>
                        <h1 className={styles.title}>Climate Simulator</h1>
                        <p className={styles.sub}>Adjust global variables and project climate outcomes through the 21st century.</p>
                    </div>

                    <div className={styles.tempDisplay}>
                        <div className={styles.tempVal} style={{ color: tempColor }}>+{metrics.tempRise}°C</div>
                        <div className={styles.tempLabel}>Projected Temp Rise</div>
                    </div>
                </div>

                {/* Scenario Presets */}
                <div className={styles.scenarioBar}>
                    <span className={styles.scenarioBarLabel}>Scenarios:</span>
                    {Object.entries(SCENARIOS).map(([key, s]) => (
                        <button
                            key={key}
                            className={`${styles.scenarioBtn} ${activeTab === key ? styles.active : ''}`}
                            style={{ '--sc': s.color }}
                            onClick={() => applyScenario(key)}
                        >
                            {s.label}
                        </button>
                    ))}
                    {activeTab !== 'custom' && (
                        <button className={styles.scenarioBtn} onClick={() => { setActiveTab('custom'); setParams(DEFAULT_PARAMS); }}>
                            <RefreshCw size={12} /> Custom
                        </button>
                    )}
                </div>

                {/* Compare selector */}
                {activeTab !== 'custom' && (
                    <div className={styles.compareBar}>
                        <BarChart2 size={14} style={{ color: 'var(--text-muted)' }} />
                        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Compare with:</span>
                        {Object.entries(SCENARIOS)
                            .filter(([k]) => k !== activeTab)
                            .map(([k, s]) => (
                                <button
                                    key={k}
                                    className={`${styles.compareBtn} ${compareScenario === k ? styles.activeCompare : ''}`}
                                    style={{ '--cc': s.color }}
                                    onClick={() => setCompareScenario(prev => prev === k ? null : k)}
                                >
                                    {s.label}
                                </button>
                            ))}
                        {compareScenario && (
                            <button className={styles.compareBtn} onClick={() => setCompareScenario(null)}>
                                <X size={12} /> Clear
                            </button>
                        )}
                    </div>
                )}

                <div className={styles.layout}>
                    {/* Left: Sliders */}
                    <aside className={styles.sidebar}>
                        <div className={styles.panelTitle}>Global Variables</div>
                        {PARAM_CONFIG.map(({ key, label, icon: Icon, min, max, step, unit, color, tip }) => {
                            const val = activeTab === 'custom' ? params[key] : SCENARIOS[activeTab]?.params[key];
                            return (
                                <div key={key} className={styles.sliderBlock}>
                                    <div className={styles.sliderHeader}>
                                        <span className={styles.sliderIcon} style={{ background: color + '20', color }}>
                                            <Icon size={14} />
                                        </span>
                                        <TooltipEl text={tip}>
                                            <span className={styles.sliderLabel}>{label}</span>
                                        </TooltipEl>
                                        <span className={styles.sliderVal} style={{ color }}>{val}{unit}</span>
                                    </div>
                                    <input
                                        type="range"
                                        className="slider-range"
                                        min={min} max={max} step={step}
                                        value={val}
                                        onChange={e => handleParam(key, e.target.value)}
                                        style={{ accentColor: color }}
                                        disabled={activeTab !== 'custom'}
                                    />
                                </div>
                            );
                        })}

                        <InfoPanel title="About the model">
                            This simulator uses simplified IPCC-inspired formulas. Real climate models require
                            supercomputers and handle hundreds of variables. These projections are directionally
                            accurate and suitable for educational purposes only.
                        </InfoPanel>
                    </aside>

                    {/* Right: Globe + Metrics + Chart */}
                    <div className={styles.main}>
                        {/* Globe + Metric cards */}
                        <div className={styles.glbMetrics}>
                            <div className={styles.globeWrap}>
                                <canvas ref={canvasRef} width={220} height={220} />
                                <div className={styles.globeLabel} style={{ color: tempColor }}>
                                    {metrics.tempRise < 1.5 ? '🌿 Safe Zone' :
                                        metrics.tempRise < 2.0 ? '⚠️ Paris Limit' :
                                            metrics.tempRise < 3.0 ? '🔥 Dangerous' : '💀 Critical'}
                                </div>
                            </div>

                            <div className={styles.metricCards}>
                                {METRIC_INFO.map(({ key, label, icon: Icon, unit, tip }) => {
                                    const val = metrics[key];
                                    const color = getMetricStatus(key, val);
                                    const cmpVal = compareMetrics?.[key];
                                    const delta = cmpVal != null ? (val - cmpVal).toFixed(key === 'tempRise' ? 2 : 0) : null;
                                    return (
                                        <div key={key} className={styles.metricCard}>
                                            <div className={styles.metricTop}>
                                                <div className={styles.metricIcon} style={{ background: color + '20', color }}>
                                                    <Icon size={16} />
                                                </div>
                                                <TooltipEl text={tip}>
                                                    <span className={styles.metricLabel}>{label}</span>
                                                </TooltipEl>
                                            </div>
                                            <div className={styles.metricVal} style={{ color }}>
                                                {val.toLocaleString()} <span style={{ fontSize: 12, opacity: 0.7 }}>{unit}</span>
                                            </div>
                                            {delta != null && (
                                                <div className={styles.metricDelta} style={{ color: parseFloat(delta) < 0 ? '#22c55e' : '#ef4444' }}>
                                                    {parseFloat(delta) >= 0 ? '+' : ''}{delta} vs {SCENARIOS[compareScenario]?.label}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Temperature projection chart */}
                        <div className={styles.chartWrap}>
                            <div className={styles.panelTitle} style={{ marginBottom: 14 }}>
                                Projected Temperature Rise 2025–2100
                            </div>
                            <div style={{ height: 240 }}>
                                <Line data={lineData} options={lineOptions} />
                            </div>
                        </div>

                        {/* Scenario comparison cards */}
                        {compareScenario && compareMetrics && (
                            <div className={styles.scenarioCompare}>
                                {['tempRise', 'seaRise', 'ecosystem'].map(key => {
                                    const info = METRIC_INFO.find(m => m.key === key);
                                    const a = metrics[key];
                                    const b = compareMetrics[key];
                                    const diff = (a - b).toFixed(key === 'tempRise' ? 2 : 0);
                                    const better = info?.invert ? parseFloat(diff) > 0 : parseFloat(diff) < 0;
                                    return (
                                        <div key={key} className={styles.cmpCard}>
                                            <div className={styles.cmpLabel}>{info.label}</div>
                                            <div className={styles.cmpRow}>
                                                <div>
                                                    <div className={styles.cmpScenLabel} style={{ color: tempColor }}>
                                                        {activeTab === 'custom' ? 'Your Scenario' : SCENARIOS[activeTab]?.label}
                                                    </div>
                                                    <div className={styles.cmpVal}>{a} {info.unit}</div>
                                                </div>
                                                <div style={{ color: 'var(--text-muted)', fontSize: 20 }}>vs</div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div className={styles.cmpScenLabel} style={{ color: SCENARIOS[compareScenario].color }}>
                                                        {SCENARIOS[compareScenario].label}
                                                    </div>
                                                    <div className={styles.cmpVal}>{b} {info.unit}</div>
                                                </div>
                                            </div>
                                            <div className={styles.cmpDiff} style={{ color: better ? '#22c55e' : '#ef4444' }}>
                                                Δ {parseFloat(diff) >= 0 ? '+' : ''}{diff} {info.unit} {better ? '(better ✓)' : '(worse ✗)'}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
