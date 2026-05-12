export type TaskStatus =
    | 'NOT_STARTED'
    | 'IN_PROGRESS'
    | 'IN_REVISION'
    | 'DONE';

// export type TaskPriority =
//     | 'LOW'
//     | 'MEDIUM'
//     | 'HIGH'
//     | 'URGENT';

export type AreaName =
    'AERODYNAMICS'  |
    'DYNAMICS'      |
    'TELEMETRY'     |
    'MARKETING'     |
    'STRUCTURE'     
;

export type RoleName =
    'CAPTAIN'   |
    'MANAGER'   |
    'LEADER'    |
    'MEMBER';