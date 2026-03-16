'use client';
import { useState } from 'react';
import { Info } from 'lucide-react';

export default function Tooltip({ text, children }) {
    const [visible, setVisible] = useState(false);

    return (
        <span
            className="tooltip-wrapper"
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
            onFocus={() => setVisible(true)}
            onBlur={() => setVisible(false)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'default' }}
        >
            {children}
            <Info size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            {visible && (
                <span
                    style={{
                        position: 'absolute',
                        bottom: 'calc(100% + 8px)',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'var(--surface-4)',
                        color: 'var(--text-primary)',
                        fontSize: 12,
                        padding: '8px 12px',
                        borderRadius: 8,
                        whiteSpace: 'normal',
                        maxWidth: 220,
                        textAlign: 'center',
                        zIndex: 999,
                        boxShadow: 'var(--shadow)',
                        border: '1px solid var(--border)',
                        pointerEvents: 'none',
                        lineHeight: 1.45,
                    }}
                >
                    {text}
                </span>
            )}
        </span>
    );
}
