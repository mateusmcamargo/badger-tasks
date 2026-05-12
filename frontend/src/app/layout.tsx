import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import './variables.css';

const nunito = Nunito({
    variable: '--font-nunito',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Badger Racing | Badger Tasks',
    description: 'Software interno de gestão das tarefas da equipe.',
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
    return (
        <html
            lang='pt-br'
            className={`${nunito.variable}`}
        >
            <body>
                {children}
            </body>
        </html>
    );
}
