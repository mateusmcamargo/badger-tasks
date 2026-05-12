import { BaseEntity } from './BaseEntity';

export interface Category extends BaseEntity {
    name:           string;
    description?:   string;
}