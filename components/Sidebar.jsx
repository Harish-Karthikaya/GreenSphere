'use client';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Leaf, Sun, Moon, Building2, ShoppingBag, Globe, BarChart2, BookOpen, LogOut, User, Menu, X } from 'lucide-react';
import { useAuth } from './AuthContext';
import styles from './Sidebar.module.css';

const LINKS = [
    { href: '/', label: 'Dashboard', icon: BarChart2 },
    { href: '/city-twin', label: 'City Twin', icon: Building2 },
    { href: '/products', label: 'Products', icon: ShoppingBag },
    { href: '/climate', label: 'Climate', icon: Globe },
    { href: '/guide', label: 'Guide', icon: BookOpen },
];

export default function Sidebar() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = resolvedTheme === 'dark';

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Mobile Header */}
            <header className={styles.mobileHeader}>
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoIcon}><Leaf size={18} /></span>
                    <span className={styles.logoText}>GreenSphere</span>
                </Link>
                <button className={styles.menuBtn} onClick={toggleSidebar}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
                <div className={styles.top}>
                    <Link href="/" className={styles.logo} onClick={() => setIsOpen(false)}>
                        <span className={styles.logoIcon}>
                            <Leaf size={24} />
                        </span>
                        <div className={styles.logoTextWrap}>
                            <span className={styles.logoText}>Green<span className={styles.logoAccent}>Sphere</span></span>
                            <span className={styles.logoVersion}>v1.0</span>
                        </div>
                    </Link>

                    <nav className={styles.nav}>
                        {LINKS.map(({ href, label, icon: Icon }) => (
                            <Link
                                key={href}
                                href={href}
                                className={`${styles.link} ${pathname === href ? styles.active : ''}`}
                                onClick={() => setIsOpen(false)}
                            >
                                <Icon size={20} />
                                <span>{label}</span>
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className={styles.bottom}>
                    {mounted && (
                        <button
                            className={styles.themeBtn}
                            onClick={() => setTheme(isDark ? 'light' : 'dark')}
                        >
                            {isDark ? (
                                <><Sun size={18} /> Light Mode</>
                            ) : (
                                <><Moon size={18} /> Dark Mode</>
                            )}
                        </button>
                    )}

                    <div className={styles.auth}>
                        {mounted && user ? (
                            <div className={styles.userProfile}>
                                <img src={user.avatar} alt="User Avatar" className={styles.avatar} />
                                <div className={styles.userInfo}>
                                    <span className={styles.userName}>{user.name}</span>
                                    <span className={styles.userRole}>{user.role}</span>
                                </div>
                                <button className={styles.logoutBtn} onClick={logout} title="Log Out">
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : mounted ? (
                            <Link href="/login" className={styles.loginBtn} onClick={() => setIsOpen(false)}>
                                <User size={18} /> <span>Log In</span>
                            </Link>
                        ) : null}
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)} />}
        </>
    );
}
