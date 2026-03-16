import { BookOpen, Building2, ShoppingBag, Globe, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import styles from './page.module.css';

const SECTIONS = [
    {
        id: 'dashboard',
        title: 'Dashboard Basics',
        icon: BookOpen,
        desc: 'The main dashboard provides an overview of global sustainability indicators. These metrics show real-world data like CO₂ PPM levels, average temperature rise, and global forest cover. Use the dashboard to get a quick pulse on the planet before diving into the interactive modules.'
    },
    {
        id: 'city-twin',
        title: 'City Digital Twin',
        icon: Building2,
        desc: 'This module simulates a modern city environment. On the left panel, you\'ll find 6 sliders controlling urban parameters like the number of cars on the road, tree coverage, and renewable energy adoption. As you adjust these, the simulation engine calculates real-time impacts on Air Quality (AQI), CO₂ emissions, and energy usage. Watch the city canvas visually update—smog clears when cars are reduced, and buildings light up with green roofs when adopted.'
    },
    {
        id: 'products',
        title: 'Product Explorer',
        icon: ShoppingBag,
        desc: 'A lifecycle assessment (LCA) database of everyday items. Browse or search for items like smartphones, t-shirts, or coffee. Clicking an item expands its footprint details showing Water usage, Carbon emissions, Waste generated, and Energy consumed. You can select up to 3 products and click "Compare" in the toolbar to see side-by-side radar and bar charts analyzing which product is more sustainable.'
    },
    {
        id: 'climate',
        title: 'Climate Simulator',
        icon: Globe,
        desc: 'A macro-level forecasting tool inspired by IPCC models. Use the sliders to control global behaviors like Fossil Fuel use and Deforestation. The animated globe changes color as the projected temperature rises. Use the preset scenarios at the top ("Green Transition", "Business as Usual") to load predefined parameter sets. Click the "Compare" button to view two scenarios side-by-side and understand the delta between different policy paths.'
    }
];

export default function GuidePage() {
    return (
        <div className={styles.wrap}>
            <div className="container">

                <div className={styles.header}>
                    <div className="badge" style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.3)', marginBottom: 10 }}>
                        <BookOpen size={11} /> User Manual
                    </div>
                    <h1 className={styles.title}>How to Use GreenSphere</h1>
                    <p className={styles.sub}>
                        GreenSphere is an interactive intelligence platform designed to help you understand environmental
                        impact through data simulation. Here's a brief guide to the three core modules.
                    </p>
                </div>

                <div className={styles.grid}>
                    {SECTIONS.map((sec) => {
                        const Icon = sec.icon;
                        return (
                            <div key={sec.id} className={styles.card}>
                                <div className={styles.cardIcon}>
                                    <Icon size={24} />
                                </div>
                                <h2 className={styles.cardTitle}>{sec.title}</h2>
                                <p className={styles.cardDesc}>{sec.desc}</p>

                                {sec.id !== 'dashboard' && (
                                    <Link href={`/${sec.id}`} className={styles.cardLink}>
                                        Try the {sec.title} module <ArrowRight size={14} />
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className={styles.faq}>
                    <h3 className={styles.faqTitle}>Frequently Asked Questions</h3>

                    <div className={styles.faqList}>
                        <div className={styles.faqItem}>
                            <h4>Where does the data come from?</h4>
                            <p>Product footprint data is aggregated from Lifecycle Assessment (LCA) databases like the Water Footprint Network and EPDs. The climate and city simulators use simplified directional formulas inspired by academic and IPCC models, adapted for interactive real-time performance.</p>
                        </div>

                        <div className={styles.faqItem}>
                            <h4>Can I save my simulation results?</h4>
                            <p>Currently, the platform operates purely client-side. Your "Custom Products" added in the Product Explorer are saved locally in your browser to test your own data, but broad simulation results highlight instantaneous feedback rather than persistent storage.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
