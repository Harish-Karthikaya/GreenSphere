'use client';
import { useState } from 'react';
import { ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';

export default function InfoPanel({ title, children, defaultOpen = false }) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className="info-panel" style={{ marginBottom: 0 }}>
            <button
                onClick={() => setOpen(v => !v)}
                style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--green-500)', fontWeight: 600, fontSize: 13, gap: 8,
                    padding: 0,
                }}
            >
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Lightbulb size={15} />
                    {title || 'Did you know?'}
                </span>
                {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
            {open && (
                <div style={{
                    marginTop: 12,
                    color: 'var(--text-secondary)',
                    fontSize: 13,
                    lineHeight: 1.6,
                }}>
                    {children}
                </div>
            )}
        </div>
    );
}
