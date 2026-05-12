import { BaseEntity } from './BaseEntity';
import { RoleName } from './Enums';

export interface Role extends BaseEntity {
    name: RoleName;
    description?: string;
}