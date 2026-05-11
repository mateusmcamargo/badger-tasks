'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, saveSession } from '@/services/authService';

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
        <main className="login-root">
            <div className="login-card">
                <div className="login-header">
                    <span className="login-badge">BADGER RACING</span>
                    <h1 className="login-title">Badger Tasks</h1>
                    <p className="login-subtitle">Gestão interna da equipe</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="field">
                        <label htmlFor="login">Email ou RA</label>
                        <input
                            id="login"
                            type="text"
                            placeholder="seu@email.com ou 1234567"
                            value={loginInput}
                            onChange={e => setLoginInput(e.target.value)}
                            required
                            autoComplete="username"
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="password">Senha</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    {error && <p className="login-error">{error}</p>}

                    <button type="submit" disabled={loading} className="login-btn">
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
            </div>

            <style>{`
                .login-root {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #0f172a;
                    background-image:
                        radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59,130,246,0.15), transparent);
                    font-family: 'Geist Sans', sans-serif;
                }

                .login-card {
                    width: 100%;
                    max-width: 400px;
                    background: #1e293b;
                    border: 1px solid #334155;
                    border-radius: 12px;
                    padding: 2.5rem;
                    box-shadow: 0 25px 50px rgba(0,0,0,0.5);
                }

                .login-header {
                    text-align: center;
                    margin-bottom: 2rem;
                }

                .login-badge {
                    display: inline-block;
                    font-size: 0.65rem;
                    font-weight: 700;
                    letter-spacing: 0.15em;
                    color: #3b82f6;
                    background: rgba(59,130,246,0.1);
                    border: 1px solid rgba(59,130,246,0.3);
                    border-radius: 999px;
                    padding: 0.25rem 0.75rem;
                    margin-bottom: 1rem;
                }

                .login-title {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: #f1f5f9;
                    margin: 0 0 0.25rem;
                    letter-spacing: -0.02em;
                }

                .login-subtitle {
                    font-size: 0.875rem;
                    color: #64748b;
                    margin: 0;
                }

                .login-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                }

                .field {
                    display: flex;
                    flex-direction: column;
                    gap: 0.4rem;
                }

                .field label {
                    font-size: 0.8rem;
                    font-weight: 500;
                    color: #94a3b8;
                    letter-spacing: 0.02em;
                }

                .field input {
                    background: #0f172a;
                    border: 1px solid #334155;
                    border-radius: 8px;
                    padding: 0.65rem 0.875rem;
                    font-size: 0.9rem;
                    color: #f1f5f9;
                    outline: none;
                    transition: border-color 0.15s;
                }

                .field input::placeholder {
                    color: #475569;
                }

                .field input:focus {
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
                }

                .login-error {
                    font-size: 0.8rem;
                    color: #f87171;
                    background: rgba(248,113,113,0.1);
                    border: 1px solid rgba(248,113,113,0.2);
                    border-radius: 6px;
                    padding: 0.5rem 0.75rem;
                    margin: 0;
                }

                .login-btn {
                    background: #3b82f6;
                    color: #fff;
                    border: none;
                    border-radius: 8px;
                    padding: 0.75rem;
                    font-size: 0.9rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.15s, transform 0.1s;
                    margin-top: 0.25rem;
                }

                .login-btn:hover:not(:disabled) {
                    background: #2563eb;
                }

                .login-btn:active:not(:disabled) {
                    transform: scale(0.98);
                }

                .login-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
            `}</style>
        </main>
    );
}