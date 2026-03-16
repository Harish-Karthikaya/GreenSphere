import { useState } from 'react';
import { X, Plus, Package } from 'lucide-react';

export default function AddProductModal({ isOpen, onClose, onAdd }) {
    const [formData, setFormData] = useState({
        name: '',
        category: 'Electronics',
        desc: '',
        water: 0,
        carbon: 0,
        waste: 0,
        energy: 0,
        rating: 'C'
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const newProduct = {
            id: `custom-${Date.now()}`,
            name: formData.name,
            category: formData.category,
            desc: formData.desc,
            icon: 'Package', // Save as string to avoid JSON serialization crash
            waterLiters: Number(formData.water),
            carbonKg: Number(formData.carbon),
            wasteKg: Number(formData.waste),
            energyKwh: Number(formData.energy),
            rawMaterials: ['Custom Material'],
            sustainabilityScore: {
                A: 9, B: 7, C: 5, D: 3, F: 1
            }[formData.rating] || 5,
            co2Label: `${formData.carbon}kg`,
            waterLabel: `${formData.water}L`,
            keyFact: 'Custom user-added product data.',
            rating: formData.rating,
            custom: true
        };
        onAdd(newProduct);
        onClose();
        // Reset form
        setFormData({
            name: '', category: 'Electronics', desc: '', water: 0, carbon: 0, waste: 0, energy: 0, rating: 'C'
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <div style={headerStyle}>
                    <h2 style={{ fontSize: 20, fontWeight: 700 }}>Add Custom Product</h2>
                    <button onClick={onClose} style={closeBtnStyle} aria-label="Close modal">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={formStyle}>
                    <div style={gridStyle}>
                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Product Name</label>
                            <input required name="name" value={formData.name} onChange={handleChange} style={inputStyle} placeholder="E.g., Bamboo Toothbrush" />
                        </div>

                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Category</label>
                            <select name="category" value={formData.category} onChange={handleChange} style={inputStyle}>
                                <option value="Electronics">Electronics</option>
                                <option value="Apparel">Apparel</option>
                                <option value="Food & Drink">Food & Drink</option>
                                <option value="Household">Household</option>
                                <option value="Transport">Transport</option>
                            </select>
                        </div>
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Description</label>
                        <input required name="desc" value={formData.desc} onChange={handleChange} style={inputStyle} placeholder="Brief description of the product" />
                    </div>

                    <div style={{ padding: '16px', background: 'var(--surface-1)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                        <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Impact Metrics</h3>
                        <div style={metricsGridStyle}>
                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>Water (L)</label>
                                <input type="number" min="0" required name="water" value={formData.water} onChange={handleChange} style={inputStyle} />
                            </div>
                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>Carbon (kg CO₂)</label>
                                <input type="number" min="0" step="0.1" required name="carbon" value={formData.carbon} onChange={handleChange} style={inputStyle} />
                            </div>
                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>Waste (kg)</label>
                                <input type="number" min="0" step="0.1" required name="waste" value={formData.waste} onChange={handleChange} style={inputStyle} />
                            </div>
                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>Energy (kWh)</label>
                                <input type="number" min="0" step="0.1" required name="energy" value={formData.energy} onChange={handleChange} style={inputStyle} />
                            </div>
                        </div>
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Sustainability Rating</label>
                        <select name="rating" value={formData.rating} onChange={handleChange} style={inputStyle}>
                            <option value="A">A (Excellent)</option>
                            <option value="B">B (Good)</option>
                            <option value="C">C (Average)</option>
                            <option value="D">D (Poor)</option>
                            <option value="F">F (Critical)</option>
                        </select>
                    </div>

                    <div style={footerStyle}>
                        <button type="button" onClick={onClose} style={cancelBtnStyle}>Cancel</button>
                        <button type="submit" style={submitBtnStyle}>
                            <Plus size={16} /> Add Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Inline styles for simplicity of the modal
const overlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
};
const modalStyle = {
    background: 'var(--surface-2)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    width: '100%', maxWidth: '540px',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
    display: 'flex', flexDirection: 'column',
    maxHeight: '90vh', overflowY: 'auto'
};
const headerStyle = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '20px 24px', borderBottom: '1px solid var(--border)'
};
const closeBtnStyle = {
    background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', borderRadius: '6px'
};
const formStyle = {
    padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px'
};
const gridStyle = {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'
};
const metricsGridStyle = {
    display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px'
};
const inputGroupStyle = {
    display: 'flex', flexDirection: 'column', gap: '6px'
};
const labelStyle = {
    fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)'
};
const inputStyle = {
    padding: '10px 14px', background: 'var(--surface-3)', border: '1px solid var(--border)',
    borderRadius: '6px', color: 'var(--text-primary)', fontSize: '14px', fontFamily: 'inherit'
};
const footerStyle = {
    display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px'
};
const cancelBtnStyle = {
    padding: '10px 16px', background: 'var(--surface-3)', border: '1px solid var(--border)',
    borderRadius: '6px', color: 'var(--text-primary)', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
};
const submitBtnStyle = {
    padding: '10px 16px', background: 'var(--primary)', border: 'none', display: 'flex', alignItems: 'center', gap: '6px',
    borderRadius: '6px', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
};
