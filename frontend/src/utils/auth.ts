import { clearSession } from '@/services/authService';
import { AuthResponse } from '@/types/Auth';

export type UserSession = Omit<AuthResponse, 'token'>;

export function getSession(): UserSession | null {
    if (typeof window === 'undefined') {return null;}
    const  raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
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