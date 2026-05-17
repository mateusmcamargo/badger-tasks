import { clearSession } from '@/services/authService';
import { AuthResponse } from '@/types/Auth';
import { getCookie } from '@/utils/cookies';

export type UserSession = Omit<AuthResponse, 'token'>;

export function getSession(): UserSession | null {
    const raw = getCookie('user');
    if (!raw) return null;

    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export function getRole():  string | null {return getSession()?.role ?? null;}

export function isCaptain(): boolean      {return getRole() === 'CAPTAIN';}
export function isManager(): boolean      {return getRole() === 'MANAGER';}
export function isLeader():  boolean      {return getRole() === 'LEADER';}
export function isMember():  boolean      {return getRole() === 'MEMBER';}

export function hasAdminAccess(): boolean {
    return isCaptain() ||
           isManager() ||
           isLeader();
}

export function logout(): void {
    clearSession();

    if (typeof window !== 'undefined') {
        window.location.href = '/login';
    }
}