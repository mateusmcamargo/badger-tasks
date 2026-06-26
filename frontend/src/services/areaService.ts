import { Area } from '@/types/Area';
import { getToken } from '@/services/authService';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

function authHeaders(): HeadersInit {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

export async function getAreas(): Promise<Area[]> {
    const res = await fetch(`${API_URL}/api/areas`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Erro ao carregar áreas');
    return res.json();
}