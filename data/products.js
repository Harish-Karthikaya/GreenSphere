/**
 * Product Environmental Impact Database
 * Sourced from peer-reviewed LCA studies and environmental databases.
 */

export const PRODUCTS = [
    {
        id: 'cotton-kurta',
        name: 'Fabindia Cotton Kurta',
        category: 'Clothing',
        icon: '👕',
        description: 'A traditional 300g cotton kurta made from sustainably sourced Indian cotton.',
        waterLiters: 2900,
        carbonKg: 9.2,
        wasteKg: 0.6,
        energyKwh: 18,
        rawMaterials: ['Indian Cotton (300g)', 'Natural dyes', 'Cotton thread'],
        sustainabilityScore: 4,
        co2Label: '9.2 kg CO₂e',
        waterLabel: '2,900 litres',
        keyFact: 'Traditional handloom kurtas have a 40% lower carbon footprint than powerloom equivalents.',
    },
    {
        id: 'jiophone',
        name: 'JioPhone Next',
        category: 'Electronics',
        icon: '📱',
        description: 'An entry-level smartphone designed for the Indian market.',
        waterLiters: 850,
        carbonKg: 65,
        wasteKg: 2.1,
        energyKwh: 52,
        rawMaterials: ['Plastic casing', 'Lithium battery', 'Glass', 'Copper', 'Silicon'],
        sustainabilityScore: 3,
        co2Label: '65 kg CO₂e',
        waterLabel: '850 litres',
        keyFact: 'Electronic waste in India is growing at 30% annually; proper recycling is critical.',
    },
    {
        id: 'bisleri-bottle',
        name: 'Bisleri 1L Bottle',
        category: 'Packaging',
        icon: '🍶',
        description: 'Standard 1-litre single-use PET plastic water bottle.',
        waterLiters: 4.2,
        carbonKg: 0.22,
        wasteKg: 0.035,
        energyKwh: 0.8,
        rawMaterials: ['Recycled PET (partially)', 'Virgin plastic', 'LDPE label'],
        sustainabilityScore: 1,
        co2Label: '0.22 kg CO₂e',
        waterLabel: '4.2 litres',
        keyFact: 'Plastic bottle litter is a major contributor to urban drainage blockages in Indian cities.',
    },
    {
        id: 'amul-milk',
        name: 'Amul Gold Milk (500ml)',
        category: 'Food',
        icon: '🥛',
        description: '500ml pouch of full cream milk from Indian dairy cooperatives.',
        waterLiters: 512,
        carbonKg: 1.1,
        wasteKg: 0.015,
        energyKwh: 2.4,
        rawMaterials: ['Bovine milk', 'Plastic pouch', 'Fortified vitamins'],
        sustainabilityScore: 4,
        co2Label: '1.1 kg CO₂e',
        waterLabel: '512 litres',
        keyFact: 'Indian dairy co-ops are among the most energy-efficient milk producers globally.',
    },
    {
        id: 'tata-tea',
        name: 'Tata Tea Premium',
        category: 'Food',
        icon: '☕',
        description: '250g pack of premium Assam tea leaves.',
        waterLiters: 180,
        carbonKg: 0.45,
        wasteKg: 0.05,
        energyKwh: 1.2,
        rawMaterials: ['Tea leaves', 'Foil packaging', 'Cardboard box'],
        sustainabilityScore: 6,
        co2Label: '0.45 kg CO₂e',
        waterLabel: '180 litres',
        keyFact: 'Rain-fed tea plantations in Northeast India have lower water stress than irrigated crops.',
    },
    {
        id: 'tata-nexon-ev',
        name: 'Tata Nexon EV',
        category: 'Transport',
        icon: '🚗',
        description: 'India\'s most popular electric SUV (lifetime assessment).',
        waterLiters: 1200000,
        carbonKg: 7200,
        wasteKg: 310,
        energyKwh: 62000,
        rawMaterials: ['Steel', 'Aluminum', 'LFP Battery cells', 'Copper'],
        sustainabilityScore: 7,
        co2Label: '7,200 kg CO₂e',
        waterLabel: '1.2M litres',
        keyFact: 'LFP batteries used in Indian EVs are rarer-earth free and safer for tropical climates.',
    },
    {
        id: 'solar-tata',
        name: 'Tata Power Solar Panel',
        category: 'Energy',
        icon: '☀️',
        description: 'High-efficiency 450W solar module made in India.',
        waterLiters: 4800,
        carbonKg: 42,
        wasteKg: 0.7,
        energyKwh: 580,
        rawMaterials: ['Silicon cells', 'Aluminum', 'Toughened glass'],
        sustainabilityScore: 9,
        co2Label: '42 kg CO₂e',
        waterLabel: '4,800 litres',
        keyFact: 'India is on track to achieve 500GW of non-fossil energy capacity by 2030.',
    },
    {
        id: 'toi-newspaper',
        name: 'Times of India',
        category: 'Paper',
        icon: '📰',
        description: 'Standard 32-page daily English newspaper.',
        waterLiters: 8,
        carbonKg: 0.22,
        wasteKg: 0.18,
        energyKwh: 0.40,
        rawMaterials: ['Recycled Newsprint', 'Soy ink', 'Water'],
        sustainabilityScore: 6,
        co2Label: '0.22 kg CO₂e',
        waterLabel: '8 litres',
        keyFact: 'India has a thriving informal recycling sector (Kabadiwallas) that recovers 90%+ of newspapers.',
    },
];

export function searchProducts(query) {
    if (!query) return PRODUCTS;
    const q = query.toLowerCase();
    return PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
}

export function getProductById(id) {
    return PRODUCTS.find(p => p.id === id);
}

export function getRatingLabel(score) {
    if (score >= 8) return { label: 'Excellent', color: '#22c55e' };
    if (score >= 6) return { label: 'Good', color: '#4ade80' };
    if (score >= 4) return { label: 'Fair', color: '#fbbf24' };
    if (score >= 2) return { label: 'Poor', color: '#f97316' };
    return { label: 'Very Poor', color: '#ef4444' };
}

export const CATEGORY_COLORS = {
    Clothing: '#a78bfa',
    Electronics: '#60a5fa',
    Packaging: '#f87171',
    Food: '#fbbf24',
    Transport: '#34d399',
    Energy: '#fcd34d',
    Paper: '#fb923c',
};
