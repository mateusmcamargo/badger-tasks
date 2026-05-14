import { Task } from '@/types/Task';

export function statusLabel(status: Task['status']): string {
    const labels: Record<string, string> = {
        NOT_STARTED: 'Pendente',
        IN_PROGRESS: 'Em Progresso',
        IN_REVISION: 'Em Revisão',
        DONE:        'Concluída',
    };
    return labels[status] ?? '';
}

export function statusClass(status: Task['status']): string {
    const classes: Record<string, string> = {
        NOT_STARTED: 'notStarted',
        IN_PROGRESS: 'inProgress',
        IN_REVISION: 'inRevision',
        DONE:        'done',
    };
    return classes[status] ?? '';
}

export function areaLabel(area: string): string {
    const labels: Record<string, string> = {
        AERODYNAMICS: 'Aerodinâmica',
        DYNAMICS:     'Dinâmica',
        TELEMETRY:    'Telemetria',
        MARKETING:    'Marketing',
        STRUCTURE:    'Estruturas',
    };
    return labels[area] ?? area;
}

export function areaClass(area: string): string {
    const classes: Record<string, string> = {
        AERODYNAMICS: 'areaAero',
        DYNAMICS:     'areaDynamics',
        TELEMETRY:    'areaTelemetry',
        MARKETING:    'areaMarketing',
        STRUCTURE:    'areaStructure',
    };
    return classes[area] ?? '';
}

export function roleLabel(role: string): string {
    const labels: Record<string, string> = {
        CAPTAIN: 'Capitão',
        MANAGER: 'Gestor',
        LEADER:  'Líder',
        MEMBER:  'Membro',
    };
    return labels[role] ?? role;
}

export function roleClass(role: string): string {
    const classes: Record<string, string> = {
        CAPTAIN: 'roleCaptain',
        MANAGER: 'roleManager',
        LEADER:  'roleLeader',
        MEMBER:  'roleMember',
    };
    return classes[role] ?? '';
}