import { Category } from '@/types/Category';
import { getToken } from '@/services/authService';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

function authHeaders(): HeadersInit {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

export async function getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_URL}/api/categories`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Erro ao carregar categorias');
    return res.json();
}