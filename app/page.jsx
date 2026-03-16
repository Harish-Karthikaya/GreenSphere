'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
    Building2, ShoppingBag, Globe, Leaf, TrendingUp, Droplets, Zap, Wind, ArrowRight, Activity
} from 'lucide-react';
import styles from './page.module.css';

const KPI_DATA = [
    { icon: Wind, label: 'CO₂ in Atmosphere', value: '421', unit: 'ppm', trend: '+2.4/yr', bad: true, color: '#f97316' },
    { icon: TrendingUp, label: 'Avg. Temp Rise', value: '1.2', unit: '°C', trend: 'since 1900', bad: true, color: '#ef4444' },
    { icon: Droplets, label: 'Ocean Level Rise', value: '20', unit: 'cm', trend: 'since 1900', bad: true, color: '#60a5fa' },
    { icon: Leaf, label: 'Forest Cover Lost', value: '1.3M', unit: 'km²/yr', trend: 'annually', bad: true, color: '#fbbf24' },
    { icon: Zap, label: 'Renewable Energy', value: '30', unit: '%', trend: '+3%/yr', bad: false, color: '#22c55e' },
    { icon: Activity, label: 'Species at Risk', value: '40,000', unit: 'species', trend: '↑ IUCN Red List', bad: true, color: '#a78bfa' },
];

const MODULES = [
    {
        href: '/city-twin',
        icon: Building2,
        title: 'Bengaluru Digital Twin',
        subtitle: 'Simulate the Garden City',
        description: 'Adjust urban parameters — traffic, trees, solar, density — for Bengaluru and watch how they reshape pollution, temperature, and energy in real time.',
        color: '#22c55e',
        bg: 'rgba(34,197,94,0.08)',
        border: 'rgba(34,197,94,0.2)',
        features: ['Real-time metrics', 'Map visualization', 'Dynamic charts'],
    },
    {
        href: '/products',
        icon: ShoppingBag,
        title: 'Indian Product Impact',
        subtitle: 'Tata, Amul & Local Brands',
        description: 'Explore the environmental footprint of popular Indian products — from water usage in tea to the raw materials of local EVs.',
        color: '#60a5fa',
        bg: 'rgba(96,165,250,0.08)',
        border: 'rgba(96,165,250,0.2)',
        features: ['12+ products', 'Comparison mode', 'Impact charts'],
    },
    {
        href: '/climate',
        icon: Globe,
        title: 'Climate Simulator',
        subtitle: 'Shape the future',
        description: 'Control global variables — fossil fuels, renewables, deforestation — and project climate outcomes like temperature rise and sea levels.',
        color: '#14b8a6',
        bg: 'rgba(20,184,166,0.08)',
        border: 'rgba(20,184,166,0.2)',
        features: ['4 scenarios', '3D globe', 'Comparisons'],
    },
];

function AnimatedCounter({ target, duration = 1800, suffix = '' }) {
    const [current, setCurrent] = useState(0);
    const targetNum = parseFloat(String(target).replace(/[^0-9.]/g, ''));
    const hasLetters = /[a-zA-Z,]/.test(String(target));

    useEffect(() => {
        if (hasLetters) { setCurrent(targetNum); return; }
        let start = null;
        const step = (ts) => {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setCurrent(+(targetNum * ease).toFixed(targetNum < 10 ? 1 : 0));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [targetNum, duration, hasLetters]);

    if (hasLetters) return <>{target}{suffix}</>;
    return <>{current.toLocaleString()}{suffix}</>;
}

export default function HomePage() {
    return (
        <div className={styles.wrap}>
            {/* ── Hero ── */}
            <section className={styles.hero}>
                <div className={styles.heroGlobe}>
                    {[...Array(3)].map((_, i) => (
                        <span key={i} className={styles.ring} style={{ '--i': i }} />
                    ))}
                    <Globe size={64} className={styles.heroGlobeIcon} />
                </div>
                <div className={styles.heroContent}>
                    <div className="badge badge-green" style={{ marginBottom: 20 }}>
                        <Leaf size={11} /> Sustainability Intelligence Platform
                    </div>
                    <h1 className={styles.heroTitle}>
                        Understand India&apos;s
                        <br />
                        <span className="gradient-text">Environmental Future</span>
                    </h1>
                    <p className={styles.heroSub}>
                        Explore how cities, products, and global decisions shape our climate through
                        interactive simulations, real-time data, and immersive visualizations.
                    </p>
                    <div className={styles.heroActions}>
                        <Link href="/city-twin" className="btn btn-primary">
                            <Building2 size={16} /> Start Simulating <ArrowRight size={14} />
                        </Link>
                        <Link href="/products" className="btn btn-ghost">
                            <ShoppingBag size={16} /> Explore Products
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Global KPIs ── */}
            <section className={`section-sm ${styles.kpiSection}`}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Real-World Sustainability Indicators</h2>
                        <p className={styles.sectionSub}>Live global environmental data from authoritative sources</p>
                    </div>
                    <div className="grid-3" style={{ gap: 16 }}>
                        {KPI_DATA.map(({ icon: Icon, label, value, unit, trend, bad, color }) => (
                            <div key={label} className={styles.kpiCard}>
                                <div className={styles.kpiIcon} style={{ background: color + '20', color }}>
                                    <Icon size={20} />
                                </div>
                                <div className={styles.kpiBody}>
                                    <div className={styles.kpiValue} style={{ color }}>
                                        <AnimatedCounter target={value} />
                                        <span className={styles.kpiUnit}> {unit}</span>
                                    </div>
                                    <div className={styles.kpiLabel}>{label}</div>
                                    <div className={styles.kpiTrend} style={{ color: bad ? '#f97316' : '#22c55e' }}>
                                        {trend}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Module Cards ── */}
            <section className="section">
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Explore the Modules</h2>
                        <p className={styles.sectionSub}>Three powerful simulation tools to deepen your environmental understanding</p>
                    </div>
                    <div className={styles.moduleGrid}>
                        {MODULES.map(({ href, icon: Icon, title, subtitle, description, color, bg, border, features }) => (
                            <Link key={href} href={href} className={styles.moduleCard} style={{ '--mc': color, '--mb': bg, '--mbd': border }}>
                                <div className={styles.moduleTop}>
                                    <div className={styles.moduleIconWrap} style={{ background: bg, border: `1px solid ${border}` }}>
                                        <Icon size={28} style={{ color }} />
                                    </div>
                                    <ArrowRight size={18} className={styles.moduleArrow} style={{ color }} />
                                </div>
                                <div className={styles.moduleSubtitle} style={{ color }}>{subtitle}</div>
                                <h3 className={styles.moduleTitle}>{title}</h3>
                                <p className={styles.moduleDesc}>{description}</p>
                                <div className={styles.moduleFeatures}>
                                    {features.map(f => (
                                        <span key={f} className={styles.moduleFeature} style={{ background: bg, border: `1px solid ${border}`, color }}>
                                            {f}
                                        </span>
                                    ))}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Why it Matters ── */}
            <section className={styles.whySection}>
                <div className="container">
                    <div className={styles.whyGrid}>
                        <div className={styles.whyLeft}>
                            <div className="badge badge-green" style={{ marginBottom: 16 }}>
                                <Leaf size={11} /> About GreenSphere
                            </div>
                            <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 16, lineHeight: 1.2 }}>
                                Why Awareness <br />
                                <span className="gradient-text">Drives Change</span>
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 24 }}>
                                GreenSphere translates complex environmental data into intuitive, interactive
                                experiences. By visualizing the hidden consequences of everyday choices,
                                urban planning, and global energy policy, we make sustainability tangible.
                            </p>
                            <Link href="/climate" className="btn btn-primary">
                                <Globe size={15} /> Explore Climate Futures
                            </Link>
                        </div>
                        <div className={styles.whyStats}>
                            {[
                                { num: '97%', desc: 'of climate scientists agree human activity drives climate change' },
                                { num: '8B', desc: 'people whose daily choices collectively shape our planet\'s future' },
                                { num: '2050', desc: 'target year for net-zero emissions to limit warming to 1.5°C' },
                            ].map(({ num, desc }) => (
                                <div key={num} className={styles.whyStat}>
                                    <div className={styles.whyStatNum}>{num}</div>
                                    <div className={styles.whyStatDesc}>{desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
