import { Area } from './Area';
import { BaseEntity } from './BaseEntity';
import { Role } from './Role';

export interface User extends BaseEntity {
    name:   string;
    ra:     string;
    email:  string;
    role:   Role;
    area:   Area;
    photoUrl?: string;
}