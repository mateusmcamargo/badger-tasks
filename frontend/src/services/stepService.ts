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

export type StepWriteRequest = {
    name:        string;
    description?: string;
    priority:    number;
    done:        boolean;
};

export async function toggleStepDone(stepId: string, done: boolean): Promise<Step> {
    const res = await fetch(`${API_URL}/api/steps/${stepId}/done?done=${done}`, {
        method:  'PATCH',
        headers: authHeaders(),
    });
    return handleResponse<Step>(res);
}

export async function createStep(taskId: string, data: Omit<StepWriteRequest, 'done'>): Promise<Step> {
    const res = await fetch(`${API_URL}/api/steps/task/${taskId}`, {
        method:  'POST',
        headers: authHeaders(),
        body:    JSON.stringify({ ...data, done: false }),
    });
    return handleResponse<Step>(res);
}

export async function updateStep(stepId: string, data: Pick<StepWriteRequest, 'name' | 'description' | 'priority'>): Promise<Step> {
    const res = await fetch(`${API_URL}/api/steps/${stepId}`, {
        method:  'PUT',
        headers: authHeaders(),
        body:    JSON.stringify({ ...data, done: false }),
    });
    return handleResponse<Step>(res);
}

export async function deleteStep(stepId: string): Promise<void> {
    const res = await fetch(`${API_URL}/api/steps/${stepId}`, {
        method:  'DELETE',
        headers: authHeaders(),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? `Erro ${res.status}`);
    }
}