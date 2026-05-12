import { Area } from './Area';
import { BaseEntity } from './BaseEntity';
import { TaskStatus } from './Enums';
import { Step } from './Step';
import { Category } from './Category';
import { User } from './User';

export type TaskFilter = {
    areaId?:     string;
    categoryId?: string;
    status?:     TaskStatus;
    active?:     boolean;
    memberId?:   string;
};

export type TaskFilterResponse = {
    tasks: Task[];
    total: number;
};

export type TaskMember = {
    id:     string;
    taskId: string;
    user:   User;
};

export interface Task extends BaseEntity {
    name:           string;
    description?:   string;
    category:       Category;
    area:           Area;
    leader:         User;
    manager:        User;
    status:         TaskStatus;
    active:         boolean;
    steps:          Step[];
    dateLimit?:     string;
    assignedTo:     User[];
    //priority:     TaskPriority;
    //createdBy:    string;
};