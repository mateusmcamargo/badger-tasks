import { Step } from '@/types/Step';
import { getToken } from './authService';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

function authHeaders(): HeadersInit {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? `Erro ${res.status}`);
    }
    return res.json();
}

export async function toggleStepDone(stepId: string, done: boolean): Promise<Step> {
    const res = await fetch(`${API_URL}/api/steps/${stepId}/done?done=${done}`, {
        method:  'PATCH',
        headers: authHeaders(),
    });
    return handleResponse<Step>(res);
}