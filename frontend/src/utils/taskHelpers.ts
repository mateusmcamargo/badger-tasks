import {
    Crown,
    ShieldCheck,
    BriefcaseBusiness,
    User,
    LucideIcon,
    CheckCircle,
    Flag,
    AlertCircle,
    Activity
} from 'lucide-react';

import { Task } from '@/types/Task';
import { AreaName, RoleName } from '@/types/Enums';

export type BadgeData = {
    label: string;
    className: string;
    icon?: LucideIcon;
}

export const STATUS_BADGES: Record<Task['status'], BadgeData> = {
    NOT_STARTED: {
        label: 'Pendente',
        className: 'notStarted',
        icon: AlertCircle,
    },
    IN_PROGRESS: {
        label: 'Em Progresso',
        className: 'inProgress',
        icon: Activity,
    },
    IN_REVISION: {
        label: 'Em Revisão',
        className: 'inRevision',
        icon: Flag,
    },
    DONE: {
        label: 'Concluída',
        className: 'done',
        icon: CheckCircle,
    },
};

export const AREA_BADGES: Record<AreaName, BadgeData> = {
    AERODYNAMICS: {
        label: 'Aerodinâmica',
        className: 'areaAero',
    },
    DYNAMICS: {
        label: 'Dinâmica',
        className: 'areaDynamics',
    },
    TELEMETRY: {
        label: 'Telemetria',
        className: 'areaTelemetry',
    },
    MARKETING: {
        label: 'Marketing',
        className: 'areaMarketing',
    },
    STRUCTURE: {
        label: 'Estrutura',
        className: 'areaStructure',
    },
};

export const ROLE_BADGES: Record<RoleName, BadgeData> = {
    CAPTAIN: {
        label: 'Capitania',
        className: 'roleCaptain',
        icon: Crown,
    },
    MANAGER: {
        label: 'Gestão',
        className: 'roleManager',
        icon: BriefcaseBusiness,
    },
    LEADER: {
        label: 'Liderança',
        className: 'roleLeader',
        icon: ShieldCheck,
    },
    MEMBER: {
        label: 'Membro',
        className: 'roleMember',
        icon: User,
    },
};