import { Area } from './area';
import { Role } from './role';

export type User = {
    id:         string;
    name:       string;
    ra:         string;
    email?:     string;
    role:       Role;
    area:       Area;
    createdAt:  string;
    updatedAt:  string;
}