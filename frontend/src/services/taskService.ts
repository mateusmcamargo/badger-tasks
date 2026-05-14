import { Task, TaskFilter, TaskFilterResponse } from '@/types/Task';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

function authHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
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

export async function getTasks(filter: TaskFilter = {}): Promise<TaskFilterResponse> {
    const params = new URLSearchParams();
    if (filter.areaId)     params.set('areaId',     filter.areaId);
    if (filter.categoryId) params.set('categoryId', filter.categoryId);
    if (filter.status)     params.set('status',     filter.status);
    if (filter.active !== undefined) params.set('active', String(filter.active));
    if (filter.memberId)   params.set('memberId',   filter.memberId);

    const res = await fetch(`${API_URL}/api/tasks?${params.toString()}`, {
        headers: authHeaders(),
    });
    return handleResponse<TaskFilterResponse>(res);
}

export async function getTaskById(id: string): Promise<Task> {
    const res = await fetch(`${API_URL}/api/tasks/${id}`, {
        headers: authHeaders(),
    });
    return handleResponse<Task>(res);
}

export type TaskRequest = {
    name:        string;
    description?: string;
    categoryId:  string;
    areaId:      string;
    leaderId:    string;
    managerId:   string;
    status:      Task['status'];
    active:      boolean;
    dateLimit?:  string; // ISO string
};

export async function createTask(data: TaskRequest): Promise<Task> {
    const res = await fetch(`${API_URL}/api/tasks`, {
        method:  'POST',
        headers: authHeaders(),
        body:    JSON.stringify(data),
    });
    return handleResponse<Task>(res);
}

export async function updateTask(id: string, data: TaskRequest): Promise<Task> {
    const res = await fetch(`${API_URL}/api/tasks/${id}`, {
        method:  'PUT',
        headers: authHeaders(),
        body:    JSON.stringify(data),
    });
    return handleResponse<Task>(res);
}

export async function deleteTask(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/api/tasks/${id}`, {
        method:  'DELETE',
        headers: authHeaders(),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? `Erro ${res.status}`);
    }
}

export async function assignMember(taskId: string, userId: string): Promise<void> {
    const res = await fetch(`${API_URL}/api/tasks/members`, {
        method:  'POST',
        headers: authHeaders(),
        body:    JSON.stringify({ taskId, userId }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? `Erro ${res.status}`);
    }
}

export async function removeMember(taskId: string, userId: string): Promise<void> {
    const res = await fetch(`${API_URL}/api/tasks/${taskId}/members/${userId}`, {
        method:  'DELETE',
        headers: authHeaders(),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? `Erro ${res.status}`);
    }
}