'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, saveSession } from '@/services/authService';
import { User, Lock } from 'lucide-react';

import styles from './login.module.scss';
import Field from '@/components/forms/Field';
import { Button } from '@/components/forms/Button';

export default function LoginPage() {
    const router = useRouter();
    const [loginInput, setLoginInput] = useState('');
    const [password, setPassword]     = useState('');
    const [error, setError]           = useState('');
    const [loading, setLoading]       = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const auth = await login({ login: loginInput, password });
            saveSession(auth);
            router.push('/tasks');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao fazer login');
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className={styles.login}>
            <section className={styles.hero}>
                <img className={styles.logo}       src='/badger-tasks-logo-dark.png' alt='Badger Tasks'/>
                <img className={styles.screenshot} src='/badger-tasks-screenshot.png' alt='Screenshot'/>

                <h2>Produtividade digna de um Fórmula SAE</h2>
            </section>

            <section className={styles.login}>

                <div className={styles.loginCard}>

                    <div className={styles.header}>
                        <h1>Entre na sua conta</h1>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.loginForm}>
                        <Field
                            label='Email ou RA'
                            icon={User}
                            id='login'
                            type='text'
                            placeholder='seu@email.com ou 1234567'
                            value={loginInput}
                            onChange={setLoginInput}
                            required
                            autoComplete='username'
                        />

                        <Field
                            label='Senha'
                            icon={Lock}
                            id='password'
                            type='password'
                            placeholder='••••••••'
                            value={password}
                            onChange={setPassword}
                            required
                            autoComplete='current-password'
                        />

                        {error && <p className='login-error'>{error}</p>}

                        <Button
                            type='submit'
                            label='Entrar'
                            loadingLabel='Entrando...'
                            loading={loading}
                            fullWidth
                        />
                    </form>
                </div>
            </section>
        </main>
    );
}