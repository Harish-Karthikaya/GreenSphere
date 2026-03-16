'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for mock session
        const storedUser = localStorage.getItem('greensphere_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (username, password) => {
        if (username && password) {
            const newUser = {
                id: 1,
                name: 'Harish Karthikaya',
                email: 'harishkarthikaya@gmail.com',
                avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=Harish`,
                role: 'Eco Explorer'
            };
            setUser(newUser);
            localStorage.setItem('greensphere_user', JSON.stringify(newUser));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('greensphere_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
