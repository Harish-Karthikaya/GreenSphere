'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import { Leaf, ArrowRight, Loader2, Mail } from 'lucide-react';
import styles from './page.module.css';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.push('/');
        }
    }, [user, loading, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate network delay
        await new Promise(r => setTimeout(r, 800));

        const success = login(username, password);
        if (success) {
            router.push('/');
        }
        setIsLoading(false);
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        await new Promise(r => setTimeout(r, 1200));
        login('harishkarthikaya@gmail.com', 'google_mock');
        router.push('/');
        setIsLoading(false);
    };

    if (loading || user) return null;

    return (
        <div className={styles.wrap}>
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>Welcome back</h1>
                        <p className={styles.sub}>Enter your details to access the GreenSphere intelligence platform.</p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        {/* Google Auth Option */}
                        <button type="button" onClick={handleGoogleLogin} className={styles.googleBtn} disabled={isLoading}>
                            <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </button>

                        <div className={styles.divider}>
                            <span>or continue with email</span>
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="username" className={styles.label}>Email or Username</label>
                            <input
                                id="username"
                                type="text"
                                className={styles.input}
                                placeholder="name@example.com"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="password" className={styles.label}>Password</label>
                            <input
                                id="password"
                                type="password"
                                className={styles.input}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className={styles.submitBtn} disabled={isLoading || !username || !password}>
                            {isLoading ? (
                                <Loader2 size={18} className={styles.spin} />
                            ) : (
                                <>
                                    Sign In <ArrowRight size={18} />
                                </>
                            )}
                        </button>

                        <div className={styles.hint}>
                            <p>Mock login: Any credentials will work.</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
