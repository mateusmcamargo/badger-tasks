import { LoginRequest, AuthResponse } from '@/types/Auth';
import { getCookie } from '@/utils/cookies';

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
    const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
    const base   = `path=/; SameSite=Strict${secure}`;

    document.cookie = `token=${auth.token}; ${base}`;
    document.cookie = `user=${encodeURIComponent(JSON.stringify({
        id:    auth.id,
        name:  auth.name,
        ra:    auth.ra,
        email: auth.email,
        role:  auth.role,
        area:  auth.area,
    }))}; ${base}`;
}

export function clearSession(): void {
    const expired = 'path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = `token=; ${expired}`;
    document.cookie = `user=; ${expired}`;
}

export function getToken(): string | null {
    return getCookie('token');
}