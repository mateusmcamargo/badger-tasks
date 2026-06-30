import {
    Crown,
    ShieldCheck,
    BriefcaseBusiness,
    User,
    LucideIcon,
    CheckCircle,
    Flag,
    AlertCircle,
    Activity,
    WindArrowDown,
    TrendingUpDown,
    ChartArea,
    Headset,
    Wrench,
    BookmarkCheck,
    BookmarkOff,
    Check,
    Info,
    TriangleAlert,
    CircleAlert
} from 'lucide-react';

import { Task } from '@/types/Task';
import { AreaName, RoleName } from '@/types/Enums';

export type BadgeData = {
    label?: string;
    className: string;
    icon?: LucideIcon;
}

type MessageName =
    'INFO'      |
    'WARNING'   |
    'DANGER'    |
    'SUCCESS';

export const ACTIVE_BADGES: Record<`${Task['active']}`, BadgeData> = {
    true: {
        label: 'Ativa',
        className: 'active',
        icon: BookmarkCheck,
    },
    false: {
        label: 'Inativa',
        className: 'inactive',
        icon: BookmarkOff,
    },
};

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
        icon: WindArrowDown
    },
    DYNAMICS: {
        label: 'Dinâmica',
        className: 'areaDynamics',
        icon: TrendingUpDown
    },
    TELEMETRY: {
        label: 'Telemetria',
        className: 'areaTelemetry',
        icon: ChartArea
    },
    MARKETING: {
        label: 'Marketing',
        className: 'areaMarketing',
        icon: Headset
    },
    STRUCTURE: {
        label: 'Estrutura',
        className: 'areaStructure',
        icon: Wrench
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

export const MESSAGE_BADGES: Record<MessageName, BadgeData> = {
    WARNING: {
        className: 'warning',
        icon: TriangleAlert,
    },
    DANGER: {
        className: 'danger',
        icon: CircleAlert,
    },
    INFO: {
        className: 'info',
        icon: Info,
    },
    SUCCESS: {
        className: 'success',
        icon: Check,
    },
};

export const USER_BADGES: Record<RoleName, BadgeData> = {
    CAPTAIN: {
        className: 'roleCaptain',
        icon: Crown,
    },
    MANAGER: {
        className: 'roleManager',
        icon: BriefcaseBusiness,
    },
    LEADER: {
        className: 'roleLeader',
        icon: ShieldCheck,
    },
    MEMBER: {
        className: 'roleMember',
        icon: User,
    },
};

export function getStatusLabel(status: Task['status']): string | undefined {
    return STATUS_BADGES[status].label;
}