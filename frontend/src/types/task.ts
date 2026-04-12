import { Area } from './area';
import { User } from './user';

export type TaskStatus =
    | 'PENDING'
    | 'IN_PROGRESS'
    | 'DONE';

export type TaskPriority =
    | 'LOW'
    | 'MEDIUM'
    | 'HIGH'
    | 'URGENT';

export type TaskStep = {
    id:         string;
    done:       boolean;
    createdAt:  string;
    updatedAt:  string;
}

export type TaskCategory = {
    id:         string;
    name:       string;
    createdAt:  string;
    updatedAt:  string;
}

export type Task = {
    id:             string;
    name:           string;
    description?:   string;
    conclusion:     number;
    area:           Area;
    status:         TaskStatus;
    priority:       TaskPriority;
    steps:          TaskStep[];
    category:       TaskCategory;
    assignedTo:     User[];
    createdBy:      string;
    dueDate?:       string;
    createdAt:      string;
    updatedAt:      string;
};