import { BaseEntity } from './BaseEntity';

export interface Step extends BaseEntity {
    name:           string;
    description?:   string;
    done:           boolean;
    priority:       number;
}