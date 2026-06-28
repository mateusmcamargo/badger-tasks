import { User } from '@/types/User';
import { getToken } from '@/services/authService';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

export type AssignableUser = {
    id:                string;
    name:              string;
    assignedTaskCount: number;
};


function authHeaders(): HeadersInit {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

export async function getUsersByArea(areaId: string): Promise<User[]> {
    const res = await fetch(`${API_URL}/api/users?areaId=${areaId}`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Erro ao carregar usuários');
    return res.json();
}

export async function getAssignableMembers(taskId: string, name?: string): Promise<AssignableUser[]> {
    const params = new URLSearchParams({ taskId });
    if (name) params.set('name', name);
    const res = await fetch(`${API_URL}/api/users/assignable?${params.toString()}`, {
        headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Erro ao carregar membros');
    return res.json();
}
