import './globals.css';
import { Providers } from './providers';
import { AuthProvider } from '@/components/AuthContext';
import Sidebar from '@/components/Sidebar';
import Chatbot from '@/components/Chatbot';

export const metadata = {
    title: 'GreenSphere – Interactive Sustainability Intelligence Platform',
    description: 'Explore environmental impact through interactive city simulations, product footprint analysis, and climate scenario modeling.',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <Providers>
                    <AuthProvider>
                        <Sidebar />
                        <main className="page-wrapper">{children}</main>
                        <Chatbot />
                    </AuthProvider>
                </Providers>
            </body>
        </html>
    );
}
