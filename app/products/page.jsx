'use client';
import { useState, useMemo, useEffect } from 'react';
import { Bar, Radar } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement,
    RadialLinearScale, PointElement, LineElement, Filler,
    Title, Tooltip, Legend
} from 'chart.js';
import { Search, X, Plus, ArrowLeftRight, Droplets, Wind, Trash2, Package, Zap, Leaf } from 'lucide-react';
import { PRODUCTS, searchProducts, getRatingLabel, CATEGORY_COLORS } from '@/data/products';
import TooltipEl from '@/components/Tooltip';
import InfoPanel from '@/components/InfoPanel';
import AddProductModal from '@/components/AddProductModal';
import styles from './page.module.css';

ChartJS.register(
    CategoryScale, LinearScale, BarElement,
    RadialLinearScale, PointElement, LineElement, Filler,
    Title, Tooltip, Legend
);

const METRICS = [
    { key: 'waterLiters', label: 'Water (L)', icon: Droplets, color: '#60a5fa', tip: 'Total litres of water consumed during the full product lifecycle.' },
    { key: 'carbonKg', label: 'Carbon (kg CO₂e)', icon: Wind, color: '#f97316', tip: 'CO₂-equivalent greenhouse gas emissions from production to disposal.' },
    { key: 'wasteKg', label: 'Waste (kg)', icon: Trash2, color: '#a78bfa', tip: 'Solid waste generated during production and disposal.' },
    { key: 'energyKwh', label: 'Energy (kWh)', icon: Zap, color: '#fbbf24', tip: 'Total energy consumed across the product\'s lifecycle stages.' },
];

export default function ProductsPage() {
    const [query, setQuery] = useState('');
    const [compareList, setCompareList] = useState([]);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'compare'
    const [selected, setSelected] = useState(null);
    const [products, setProducts] = useState(PRODUCTS);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const savedCustom = localStorage.getItem('greensphere_custom_products');
        if (savedCustom) {
            setProducts([...PRODUCTS, ...JSON.parse(savedCustom)]);
        }
    }, []);

    const handleAddCustomProduct = (newProduct) => {
        setProducts(prev => {
            const updated = [newProduct, ...prev];
            const customOnly = updated.filter(p => p.custom);
            localStorage.setItem('greensphere_custom_products', JSON.stringify(customOnly));
            return updated;
        });
    };

    const filtered = useMemo(() => {
        if (!query) return products;
        const q = query.toLowerCase();
        return products.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }, [query, products]);

    function toggleCompare(p) {
        setCompareList(prev => {
            const has = prev.find(x => x.id === p.id);
            if (has) return prev.filter(x => x.id !== p.id);
            if (prev.length >= 3) return prev;
            return [...prev, p];
        });
    }

    const inCompare = (p) => compareList.some(x => x.id === p.id);

    function startCompare() {
        if (compareList.length >= 2) setViewMode('compare');
    }

    // Radar chart for comparison
    const radarLabels = ['Water', 'Carbon', 'Waste', 'Energy', 'Impact'];
    const normalizers = { waterLiters: 1500000, carbonKg: 330, wasteKg: 340, energyKwh: 67000 };

    function normalize(product, key) {
        const n = normalizers[key];
        return Math.min((product[key] / n) * 100, 100);
    }

    const COMPARISON_COLORS = ['#22c55e', '#60a5fa', '#f97316'];

    const radarData = {
        labels: radarLabels,
        datasets: compareList.map((p, i) => ({
            label: p.name,
            data: [
                normalize(p, 'waterLiters'),
                normalize(p, 'carbonKg'),
                normalize(p, 'wasteKg'),
                normalize(p, 'energyKwh'),
                (10 - p.sustainabilityScore) * 10,
            ],
            borderColor: COMPARISON_COLORS[i],
            backgroundColor: COMPARISON_COLORS[i] + '30',
            pointBackgroundColor: COMPARISON_COLORS[i],
            borderWidth: 2,
        })),
    };

    const radarOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', font: { size: 12 } } } },
        scales: {
            r: {
                min: 0, max: 100,
                grid: { color: 'rgba(255,255,255,0.07)' },
                ticks: { display: false },
                pointLabels: { color: '#94a3b8', font: { size: 12 } },
            }
        },
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: { legend: { display: compareList.length > 1, position: 'top', labels: { color: '#94a3b8' } } },
        scales: {
            x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
            y: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 12 } } },
        },
    };

    function makeBarData(metricKey) {
        return {
            labels: compareList.map(p => p.name),
            datasets: [{
                label: metricKey,
                data: compareList.map(p => p[metricKey]),
                backgroundColor: COMPARISON_COLORS.slice(0, compareList.length).map(c => c + 'bb'),
                borderColor: COMPARISON_COLORS.slice(0, compareList.length),
                borderWidth: 2,
                borderRadius: 6,
            }],
        };
    }

    return (
        <div className={styles.wrap}>
            <div className="container">
                {/* Header */}
                <div className={styles.header}>
                    <div>
                        <div className="badge badge-blue" style={{ marginBottom: 10 }}>
                            <Package size={11} /> Product Environmental Impact Explorer
                        </div>
                        <h1 className={styles.title}>Product Impact Explorer</h1>
                        <p className={styles.sub}>Discover the hidden environmental cost of everyday consumer products.</p>
                    </div>
                </div>

                {/* Search bar + tabs */}
                <div className={styles.toolbar} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)} style={{ padding: '10px 16px', fontSize: 13, gap: 6, fontWeight: 700 }}>
                            <Plus size={16} /> Add Custom Product
                        </button>
                        <div className={styles.searchWrap}>
                            <Search size={16} className={styles.searchIcon} />
                            <input
                                type="text"
                                className={styles.searchInput}
                                placeholder="Search products (e.g. smartphone, jeans, coffee…)"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                            />
                            {query && (
                                <button className={styles.clearBtn} onClick={() => setQuery('')}>
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        {compareList.length > 0 && (
                            <div className={styles.compareTray}>
                                {compareList.map(p => (
                                    <span key={p.id} className={styles.trayItem}>
                                        {typeof p.icon === 'string' ? <Package size={14} /> : p.icon} {p.name}
                                        <button onClick={() => toggleCompare(p)}><X size={12} /></button>
                                    </span>
                                ))}
                                {compareList.length >= 2 && (
                                    <button className="btn btn-primary" style={{ padding: '6px 14px', fontSize: 13 }}
                                        onClick={startCompare}>
                                        <ArrowLeftRight size={14} /> Compare
                                    </button>
                                )}
                            </div>
                        )}

                        {viewMode === 'compare' && (
                            <button className="btn btn-ghost" style={{ padding: '6px 14px', fontSize: 13 }}
                                onClick={() => setViewMode('grid')}>
                                ← Back to Grid
                            </button>
                        )}
                    </div>
                </div>

                {viewMode === 'grid' ? (
                    <>
                        {/* Product Grid */}
                        <div className={styles.grid}>
                            {filtered.map(p => {
                                const rating = getRatingLabel(p.sustainabilityScore);
                                const catColor = CATEGORY_COLORS[p.category] || '#22c55e';
                                return (
                                    <div
                                        key={p.id}
                                        className={`${styles.productCard} ${inCompare(p) ? styles.inCompare : ''}`}
                                        onClick={() => setSelected(selected?.id === p.id ? null : p)}
                                    >
                                        <div className={styles.cardTop}>
                                            <span className={styles.productIcon}>
                                                {typeof p.icon === 'string' ? <Package size={24} /> : p.icon}
                                            </span>
                                            <div className={styles.productCategory} style={{ background: catColor + '22', color: catColor }}>
                                                {p.category}
                                            </div>
                                        </div>
                                        <h3 className={styles.productName}>{p.name}</h3>
                                        <p className={styles.productDesc}>{p.description}</p>

                                        {/* Mini stat pills */}
                                        <div className={styles.statRow}>
                                            <TooltipEl text="CO₂ equivalent emissions">
                                                <span className={styles.statPill} style={{ background: '#f9731622', color: '#f97316', border: '1px solid #f9731633' }}>
                                                    <Wind size={11} /> {p.co2Label}
                                                </span>
                                            </TooltipEl>
                                            <TooltipEl text="Water consumption">
                                                <span className={styles.statPill} style={{ background: '#60a5fa22', color: '#60a5fa', border: '1px solid #60a5fa33' }}>
                                                    <Droplets size={11} /> {p.waterLabel}
                                                </span>
                                            </TooltipEl>
                                        </div>

                                        {/* Sustainability score bar */}
                                        <div className={styles.ratingRow}>
                                            <span className={styles.ratingLabel} style={{ color: rating.color }}>{rating.label}</span>
                                            <div className="progress-bar" style={{ flex: 1 }}>
                                                <div className="progress-fill" style={{ width: `${p.sustainabilityScore * 10}%`, background: rating.color }} />
                                            </div>
                                            <span className={styles.ratingNum} style={{ color: rating.color }}>{p.sustainabilityScore}/10</span>
                                        </div>

                                        <p className={styles.keyFact}>💡 {p.keyFact}</p>

                                        <div className={styles.cardActions}>
                                            <button
                                                className={`${styles.addCompare} ${inCompare(p) ? styles.added : ''}`}
                                                onClick={e => { e.stopPropagation(); toggleCompare(p); }}
                                            >
                                                {inCompare(p) ? <><X size={13} /> Remove</> : <><Plus size={13} /> Compare</>}
                                            </button>
                                        </div>

                                        {/* Expanded detail */}
                                        {selected?.id === p.id && (
                                            <div className={styles.expandedDetail}>
                                                <div className={styles.expandedGrid}>
                                                    {METRICS.map(({ key, label, icon: Icon, color, tip }) => (
                                                        <div key={key} className={styles.expandedMetric}>
                                                            <div className={styles.expIcon} style={{ background: color + '20', color }}><Icon size={14} /></div>
                                                            <TooltipEl text={tip}>
                                                                <div className={styles.expLabel}>{label}</div>
                                                            </TooltipEl>
                                                            <div className={styles.expVal} style={{ color }}>{p[key].toLocaleString()}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div style={{ marginTop: 12 }}>
                                                    <div className={styles.expSubLabel}>Raw Materials</div>
                                                    <div className={styles.rawMats}>
                                                        {p.rawMaterials.map(m => (
                                                            <span key={m} className={styles.rawMat}>{m}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {filtered.length === 0 && (
                            <div className={styles.noResults}>
                                <span style={{ fontSize: 48 }}>🔍</span>
                                <p>No products found for &quot;{query}&quot;</p>
                            </div>
                        )}

                        <div style={{ marginTop: 32 }}>
                            <InfoPanel title="About this data" defaultOpen>
                                Impact figures are compiled from peer-reviewed Life Cycle Assessment (LCA) studies, the
                                Environmental Product Declaration (EPD) database, and the Water Footprint Network.
                                Numbers represent global averages and may vary by region, manufacturer, and production method.
                            </InfoPanel>
                        </div>
                    </>
                ) : (
                    /* ── Comparison View ── */
                    <div className={styles.compareView}>
                        <h2 className={styles.compareTitle}>Impact Comparison</h2>
                        <div className={styles.compareHeader}>
                            {compareList.map((p, i) => {
                                const rating = getRatingLabel(p.sustainabilityScore);
                                return (
                                    <div key={p.id} className={styles.compareHero} style={{ borderTop: `4px solid ${COMPARISON_COLORS[i]}` }}>
                                        <span style={{ fontSize: 48, display: 'block', marginBottom: 8 }}>
                                            {typeof p.icon === 'string' ? <Package size={48} /> : p.icon}
                                        </span>
                                        <div className={styles.compareHeroName}>{p.name}</div>
                                        <div className={styles.compareHeroCat}>{p.category}</div>
                                        <div style={{ color: rating.color, fontWeight: 700, fontSize: 14 }}>{rating.label} ({p.sustainabilityScore}/10)</div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className={styles.compareCharts}>
                            {/* Radar */}
                            <div className={styles.chartCard}>
                                <div className={styles.chartCardTitle}>Overall Environmental Profile</div>
                                <div style={{ height: 300 }}>
                                    <Radar data={radarData} options={radarOptions} />
                                </div>
                            </div>

                            {/* Bar charts */}
                            {METRICS.map(({ key, label, icon: Icon, color }) => (
                                <div key={key} className={styles.chartCard}>
                                    <div className={styles.chartCardTitle} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <span style={{ color }}><Icon size={14} /></span>
                                        {label}
                                    </div>
                                    <div style={{ height: 160 }}>
                                        <Bar data={makeBarData(key)} options={barOptions} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Detail table */}
                        <div className={styles.compareTable}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Metric</th>
                                        {compareList.map(p => (
                                            <th key={p.id}>
                                                {typeof p.icon === 'string' ? <Package size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} /> : p.icon} {p.name}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {METRICS.map(({ key, label, icon: Icon, color }) => (
                                        <tr key={key}>
                                            <td><Icon size={13} style={{ color, marginRight: 6, verticalAlign: 'middle' }} />{label}</td>
                                            {compareList.map(p => {
                                                const best = Math.min(...compareList.map(x => x[key]));
                                                const isBest = p[key] === best;
                                                return (
                                                    <td key={p.id} style={{ color: isBest ? '#22c55e' : 'inherit', fontWeight: isBest ? 700 : 400 }}>
                                                        {p[key].toLocaleString()}
                                                        {isBest && <span style={{ marginLeft: 4, fontSize: 11 }}>✓ Best</span>}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                    <tr>
                                        <td><Leaf size={13} style={{ color: '#22c55e', marginRight: 6, verticalAlign: 'middle' }} />Sustainability Score</td>
                                        {compareList.map(p => {
                                            const best = Math.max(...compareList.map(x => x.sustainabilityScore));
                                            const rating = getRatingLabel(p.sustainabilityScore);
                                            return (
                                                <td key={p.id} style={{ color: rating.color, fontWeight: 700 }}>
                                                    {p.sustainabilityScore}/10 – {rating.label}
                                                    {p.sustainabilityScore === best && <span style={{ color: '#22c55e', marginLeft: 4, fontSize: 11 }}>✓ Best</span>}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Add Product Modal */}
                <AddProductModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onAdd={handleAddCustomProduct}
                />
            </div>
        </div>
    );
}
