import { LoginRequest, AuthResponse } from '@/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

export async function login(data: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message ?? 'Credenciais inválidas');
    }

    return response.json();
}

export function saveSession(auth: AuthResponse): void {
    localStorage.setItem('token', auth.token);
    localStorage.setItem('user', JSON.stringify({
        id:    auth.id,
        name:  auth.name,
        ra:    auth.ra,
        email: auth.email,
        role:  auth.role,
    }));
}

export function clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

export function getToken(): string | null {
    return localStorage.getItem('token');
}