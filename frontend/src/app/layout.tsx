import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Badger Racing | Tarefas da Equipe',
    description: 'Software interno de gestão das tarefas da equipe.',
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
    return (
        <html
            lang='pt-br'
            className={`${geistSans.variable}${geistMono.variable}`}
        >
            <body>
                {children}
            </body>
        </html>
    );
}
