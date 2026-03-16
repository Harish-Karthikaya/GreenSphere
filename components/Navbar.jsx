'use client';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Leaf, Sun, Moon, Building2, ShoppingBag, Globe, BarChart2, Menu, X, BookOpen, LogOut, User } from 'lucide-react';
import { useAuth } from './AuthContext';
import styles from './Navbar.module.css';
import './NavbarAuthStyles.css';

const LINKS = [
    { href: '/', label: 'Dashboard', icon: BarChart2 },
    { href: '/city-twin', label: 'City Twin', icon: Building2 },
    { href: '/products', label: 'Products', icon: ShoppingBag },
    { href: '/climate', label: 'Climate', icon: Globe },
    { href: '/guide', label: 'Guide', icon: BookOpen },
];

export default function Navbar() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isDark = resolvedTheme === 'dark';

    return (
        <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
            <div className={`container ${styles.inner}`}>
                {/* Logo */}
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoIcon}>
                        <Leaf size={20} />
                    </span>
                    <span className={styles.logoText}>Green<span className={styles.logoAccent}>Sphere</span></span>
                </Link>

                {/* Desktop Links */}
                <div className={styles.links}>
                    {LINKS.map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`${styles.link} ${pathname === href ? styles.active : ''}`}
                        >
                            <Icon size={15} />
                            {label}
                        </Link>
                    ))}
                </div>

                {/* Actions */}
                <div className={styles.actions}>
                    {mounted && (
                        <button
                            className={styles.themeBtn}
                            onClick={() => setTheme(isDark ? 'light' : 'dark')}
                            aria-label="Toggle theme"
                        >
                            {isDark ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    )}

                    {/* Mobile hamburger */}
                    <button className={styles.menuBtn} onClick={() => setMenuOpen(v => !v)}>
                        {menuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Desktop Auth */}
                {mounted && (
                    <div className={styles.authDesktop}>
                        {user ? (
                            <div className={styles.userMenu}>
                                <img src={user.avatar} alt="Avatar" className={styles.avatar} />
                                <div className={styles.userInfo}>
                                    <span className={styles.userName}>{user.name}</span>
                                    <span className={styles.userRole}>{user.role}</span>
                                </div>
                                <button className={styles.logoutBtn} onClick={logout} title="Log Out">
                                    <LogOut size={16} />
                                </button>
                            </div>
                        ) : (
                            <Link href="/login" className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '13px', marginLeft: '12px' }}>
                                Log In
                            </Link>
                        )}
                    </div>
                )}
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className={styles.mobileMenu}>
                    {LINKS.map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`${styles.mobileLink} ${pathname === href ? styles.active : ''}`}
                            onClick={() => setMenuOpen(false)}
                        >
                            <Icon size={16} />
                            {label}
                        </Link>
                    ))}

                    <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }} />

                    {/* Mobile Auth */}
                    {mounted && user ? (
                        <div className={styles.mobileAuth}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12 }}>
                                <img src={user.avatar} alt="Avatar" className={styles.avatar} />
                                <div>
                                    <div className={styles.userName}>{user.name}</div>
                                    <div className={styles.userRole} style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user.role}</div>
                                </div>
                            </div>
                            <button
                                className={styles.mobileLink}
                                onClick={() => { logout(); setMenuOpen(false); }}
                                style={{ color: '#ef4444', justifyContent: 'flex-start', width: '100%', background: 'transparent', border: 'none', cursor: 'pointer' }}
                            >
                                <LogOut size={16} /> Log Out
                            </button>
                        </div>
                    ) : mounted ? (
                        <Link href="/login" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                            <User size={16} /> Log In
                        </Link>
                    ) : null}
                </div>
            )}
        </nav>
    );
}
