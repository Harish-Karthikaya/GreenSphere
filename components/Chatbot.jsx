'use client';
import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Leaf } from 'lucide-react';

const RESPONSES = [
    {
        keywords: ['hello', 'hi', 'hey', 'start'],
        reply: "Hello! I'm the GreenSphere Assistant. I can help you understand how to use the Dashboard, City Twin, Product Explorer, or Climate Simulator. What would you like to know?"
    },
    {
        keywords: ['dashboard', 'home', 'kpi'],
        reply: "The Dashboard provides a high-level overview of global sustainability metrics like CO₂ PPM, Average Temperature Rise, and Global Forest Cover. It's your starting point."
    },
    {
        keywords: ['city', 'twin', 'urban', 'simulator'],
        reply: "In the City Twin module, you can adjust urban parameters (like Cars, Trees, Solar) using the sliders. Watch how your choices affect the city's Air Quality, CO₂, and Energy levels in real-time on the canvas!"
    },
    {
        keywords: ['product', 'explorer', 'items', 'compare', 'add'],
        reply: "The Product Explorer lets you search for everyday items to see their environmental footprint. You can click 'Compare' on up to 3 products to see side-by-side charts. You can also add your own Custom Products!"
    },
    {
        keywords: ['climate', 'global', 'temperature', 'scenario', 'ipcc'],
        reply: "The Climate Simulator forecasts global outcomes up to the year 2100 based on variables like Fossil Fuel usage and Deforestation. Try comparing the 'Business as Usual' and 'Green Transition' scenarios."
    },
    {
        keywords: ['data', 'source', 'where', 'real', 'accurate'],
        reply: "Our product data comes from Lifecycle Assessment (LCA) databases like the Water Footprint Network. Our simulators use directional formulas inspired by real-world and IPCC models for educational purposes."
    },
    {
        keywords: ['login', 'account', 'save', 'auth'],
        reply: "You can 'Log In' via the Navbar using any username/password (it's a simulation). Custom products you add are saved locally to your browser."
    }
];

const DEFAULT_REPLY = "I'm not sure about that. Try asking me how to use the 'City Twin', 'Product Explorer', or 'Climate Simulator'. You can also check the 'Guide' page for detailed instructions!";

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi there! I'm the GreenSphere Assistant. How can I help you today?", isBot: true }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userText = input.trim();
        setMessages(prev => [...prev, { text: userText, isBot: false }]);
        setInput('');

        // Simple fuzzy match
        setTimeout(() => {
            const lowerInput = userText.toLowerCase();
            let foundReply = DEFAULT_REPLY;

            for (const res of RESPONSES) {
                if (res.keywords.some(kw => lowerInput.includes(kw))) {
                    foundReply = res.reply;
                    break;
                }
            }

            setMessages(prev => [...prev, { text: foundReply, isBot: true }]);
        }, 600);
    };

    return (
        <div style={containerStyle}>
            {isOpen ? (
                <div style={chatWindowStyle}>
                    {/* Header */}
                    <div style={headerStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={iconBoxStyle}><Leaf size={14} /></div>
                            <span style={{ fontWeight: 600, fontSize: 14 }}>GreenSphere AI</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={closeBtnStyle} aria-label="Close Chat">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div style={messagesWrapStyle}>
                        {messages.map((m, i) => (
                            <div key={i} style={{ ...msgRowStyle, justifyContent: m.isBot ? 'flex-start' : 'flex-end' }}>
                                <div style={m.isBot ? botBubbleStyle : userBubbleStyle}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form style={inputFormStyle} onSubmit={handleSend}>
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Ask me a question..."
                            style={inputStyle}
                        />
                        <button type="submit" disabled={!input.trim()} style={sendBtnStyle}>
                            <Send size={16} />
                        </button>
                    </form>
                </div>
            ) : (
                <button onClick={() => setIsOpen(true)} style={toggleBtnStyle} aria-label="Open Chat">
                    <MessageSquare size={24} />
                </button>
            )}
        </div>
    );
}

// Inline styles for the floating widget
const containerStyle = {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
};

const toggleBtnStyle = {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: 'var(--primary)',
    color: 'white',
    border: 'none',
    boxShadow: '0 8px 16px rgba(var(--primary-r), var(--primary-g), var(--primary-b), 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s',
};

const chatWindowStyle = {
    width: '320px',
    height: '460px',
    background: 'var(--surface-2)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    boxShadow: '0 12px 24px -10px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
};

const headerStyle = {
    padding: '14px 16px',
    background: 'var(--surface-3)',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
};

const iconBoxStyle = {
    width: '24px',
    height: '24px',
    borderRadius: '6px',
    background: 'rgba(var(--primary-r), var(--primary-g), var(--primary-b), 0.2)',
    color: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const closeBtnStyle = {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
};

const messagesWrapStyle = {
    flex: 1,
    padding: '16px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
};

const msgRowStyle = {
    display: 'flex',
    width: '100%',
};

const userBubbleStyle = {
    background: 'var(--primary)',
    color: 'white',
    padding: '10px 14px',
    borderRadius: '16px 16px 4px 16px',
    fontSize: '13px',
    lineHeight: 1.5,
    maxWidth: '85%',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
};

const botBubbleStyle = {
    background: 'var(--surface-3)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border)',
    padding: '10px 14px',
    borderRadius: '16px 16px 16px 4px',
    fontSize: '13px',
    lineHeight: 1.5,
    maxWidth: '85%',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
};

const inputFormStyle = {
    padding: '12px',
    borderTop: '1px solid var(--border)',
    background: 'var(--surface-2)',
    display: 'flex',
    gap: '8px',
};

const inputStyle = {
    flex: 1,
    padding: '10px 12px',
    background: 'var(--surface-1)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontSize: '13px',
    outline: 'none',
    fontFamily: 'inherit',
};

const sendBtnStyle = {
    width: '38px',
    height: '38px',
    borderRadius: '8px',
    background: 'var(--primary)',
    color: 'white',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
};
